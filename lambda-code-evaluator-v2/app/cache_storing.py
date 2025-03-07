import json
from glide import (
    ClosingError,
    ConnectionError,
    GlideClient,
    GlideClientConfiguration,
    Logger,
    LogLevel,
    NodeAddress,
    RequestError,
    TimeoutError,
)

VALKEY_HOST = "main-cache-mutbnm.serverless.eun1.cache.amazonaws.com"  # os.getenv("VALKEY_HOST")
VALKEY_PORT = 6379  # os.getenv("VALKEY_PORT")


# ------------------------------
# Async function to store job result in Valkey
# ------------------------------
async def store_result_in_valkey(job_id, results):
    print("Entering store_result_in_valkey()...")
    # Optional: set up logging
    Logger.set_logger_config(LogLevel.INFO)

    # Configure the Glide Cluster Client
    addresses = [NodeAddress(VALKEY_HOST, VALKEY_PORT)]
    config = GlideClientConfiguration(addresses=addresses, use_tls=True)
    client = None

    try:
        # Connect to Valkey
        client = await GlideClient.create(config)
        print("Connected to Valkey.")

        # Convert results to JSON string
        results_json = json.dumps({"status": "completed", "output": results})

        # Store with a TTL (e.g., 300 seconds)
        TTL = 300
        key = f"job:{job_id}"
        print(f"Sending data to valkey at {key}")
        await client.set(key, results_json)
        print("Sent data to Valkey.")
        print("Testing getting data back...")
        retrieved_data = await client.get(key)
        print(f"Retrieved data: {retrieved_data}")

    except (TimeoutError, RequestError, ConnectionError, ClosingError) as e:
        print(f"Valkey error: {e}")
    finally:
        if client:
            try:
                await client.close()
            except ClosingError as e:
                print(f"Error closing Valkey client: {e}")
