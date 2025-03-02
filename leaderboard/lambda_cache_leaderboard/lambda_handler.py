import os
import json
import asyncio
from dotenv import load_dotenv
from glide import (
    GlideClient,
    GlideClientConfiguration,
    NodeAddress,
    Logger,
    LogLevel,
    ClosingError,
)
from get_leaderboard import get_leaderboard  # Note: ensure function names match

# Load environment variables from .env file if needed
load_dotenv()

# Configure logger for Glide
Logger.set_logger_config(LogLevel.INFO)

# Global variable to hold the Valkey client instance-
valkey_client = None

async def initialize_valkey_client():
    """
    Initializes the Valkey client using Glide.
    """
    global valkey_client
    host = os.getenv("VALKEY_HOST", "main-cache-mutbnm.serverless.eun1.cache.amazonaws.com")
    port = int(os.getenv("VALKEY_PORT", "6379"))
    
    addresses = [NodeAddress(host, port)]
    config = GlideClientConfiguration(addresses=addresses, use_tls=True)
    
    try:
        valkey_client = await GlideClient.create(config)
        print("Valkey client created successfully.")
    except Exception as e:
        print("Failed to create Valkey client:", e)
        raise


async def async_handler(event, context):
    """
    Async handler that initializes the client if needed, fetches leaderboard data,
    formats the data with a timestamp, and updates the cache.
    """
    
    global valkey_client

    # Initialize the client if not already done.
    print("Initializing valkey client")
    if valkey_client is None:
        try:
            await initialize_valkey_client()
        except Exception as e:
            return {
                "statusCode": 500,
                "body": json.dumps({"error": f"Valkey initialization failed: {str(e)}"})
            }
    
    # Try to get new leaderboard data.
    try:
        leaderboard = await get_leaderboard(count=5)
    except Exception as e:
        print(f"Error getting leaderboard: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    
    cache_payload = leaderboard

    # Update the cache with the new data.
    key = "active_leaderboard"
    await valkey_client.set(key, json.dumps(cache_payload))

    return {
        "statusCode": 200,
        "body": json.dumps(cache_payload)
    }

def lambda_handler(event, context):
    """
    Synchronous wrapper for the async lambda handler.
    """
    return asyncio.run(async_handler(event, context))