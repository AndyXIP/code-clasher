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
from get_questions import get_questions, format_questions_data  # Note: ensure function names match

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
    
    try:
        valkey_client = await GlideClient.create(config)
        print("Valkey client created successfully.")
    except Exception as e:
        print("Failed to create Valkey client:", e)
        raise

async def async_handler(event, context):
    """
    Async handler that initializes the client if needed, fetches new questions,
    formats the data with a timestamp, and updates the cache.
    """
    global valkey_client

    # Initialize the client if not already done.
    if valkey_client is None:
        try:
            await initialize_valkey_client()
        except Exception as e:
            return {
                "statusCode": 500,
                "body": json.dumps({"error": f"Valkey initialization failed: {str(e)}"})
            }
    
    # Try to get new set of (5) questions.
    try:
        # Note: ensure you're calling the correct function; here we use get_questions.
        questions = await get_questions(count=5)
    except Exception as e:
        print(f"Error getting weekly questions: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    
    # Format the data (e.g., add a timestamp, etc.)
    cache_payload = format_questions_data(questions)

    # Update the cache with the new data.
    key = "active_questions"
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
