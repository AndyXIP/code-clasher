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
    # You can store your Valkey endpoint in environment variables.
    # For example: VALKEY_HOST, VALKEY_PORT
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

def lambda_handler(event, context):
    """
    AWS Lambda entry point.
    This skeleton function ensures the Valkey client is initialized.
    Business logic can be added below.
    """
    global valkey_client

    # Initialize the client if not already done.
    if valkey_client is None:
        try:
            asyncio.run(initialize_valkey_client())
        except Exception as e:
            return {
                "statusCode": 500,
                "body": json.dumps({"error": f"Valkey initialization failed: {str(e)}"})
            }
    
    # At this point, valkey_client is available for use.
    # You can now add your own business logic. For now, we just return a simple message.
    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Lambda skeleton with Valkey client is ready."})
    }
