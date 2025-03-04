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
from get_leaderboard import get_top_leaderboard_entries  # Note: ensure function names match

# Load environment variables from .env file if needed
load_dotenv()

# Configure logger for Glide
Logger.set_logger_config(LogLevel.INFO)

# Global variable to hold the Valkey client instance
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
    
    print(f"DEBUG: Attempting to create Valkey client with host={host}, port={port}")

    try:
        valkey_client = await GlideClient.create(config)
        print("Valkey client created successfully.")
    except Exception as e:
        print(f"Failed to create Valkey client: {e}")
        raise

async def async_handler(event, context):
    """
    Async handler that initializes the client if needed, fetches leaderboard data,
    and updates the cache.
    """
    global valkey_client

    print("DEBUG: Received event:", event)

    # Initialize the client if not already done.
    if valkey_client is None:
        print("DEBUG: valkey_client is None; initializing now.")
        try:
            await initialize_valkey_client()
        except Exception as e:
            print("DEBUG: Exception while initializing Valkey client:", e)
            return {
                "statusCode": 500,
                "body": json.dumps({"error": f"Valkey initialization failed: {str(e)}"})
            }
    else:
        print("DEBUG: valkey_client already initialized.")

    # Try to get new leaderboard data.
    try:
        print("DEBUG: About to call get_leaderboard...")
        leaderboard = get_top_leaderboard_entries(count=5)
        print("DEBUG: Successfully received leaderboard data.")
    except Exception as e:
        print(f"DEBUG: Error getting leaderboard: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

    cache_payload = leaderboard
    print(f"DEBUG: cache_payload ready. Key to store = 'active_leaderboard'")

    # Update the cache with the new data.
    key = "active_leaderboard_testing"
    try:
        print("DEBUG: Attempting to set data in Valkey cache...")
        await valkey_client.set(key, json.dumps(cache_payload))
        print("DEBUG: Successfully set data in Valkey cache.")
    except Exception as e:
        print(f"DEBUG: Error setting data in Valkey cache: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Cache update failed: {str(e)}"})
        }

    return {
        "statusCode": 200,
        "body": json.dumps(cache_payload)
    }

def lambda_handler(event, context):
    """
    Synchronous wrapper for the async lambda handler.
    """
    return asyncio.run(async_handler(event, context))
