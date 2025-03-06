# Leaderboard Service

## Overview
The **Leaderboard Service** is responsible for retrieving, caching, and serving leaderboard data for coding challenge results. It integrates with **Supabase** for data storage and **Valkey (Redis) Glide** for caching to optimize performance. The service is designed to run in an AWS Lambda environment with an API Gateway trigger.

## Project Structure
```
leaderboard_service/
│── lambda_cache_leaderboard/
│   │── Dockerfile               # Docker containerization setup for caching layer
│   │── get_leaderboard.py       # Fetches leaderboard data from API
│   │── lambda_handler.py        # AWS Lambda entry point with caching
│   │── requirements.txt         # Dependencies required for caching layer
│
│── leaderboard_function/
│   │── app.py                   # Lambda handler for API requests
│   │── Dockerfile               # Docker containerization setup for leaderboard API
│   │── leaderboard.py           # Processes leaderboard entries from Supabase
│   │── requirements.txt         # Dependencies required for the leaderboard API
│   │── db_client/
│   │   │── db_client.py         # Database client for Supabase integration
```

## Features
- **Fetches leaderboard data** from an external API (`get_leaderboard.py`).
- **Stores and retrieves data from Supabase** (`db_client.py`).
- **Caches leaderboard results** using **Valkey Glide** (`lambda_handler.py`).
- **AWS Lambda integration** (`app.py`) for efficient API serving.

## Installation & Setup
### 1. Install Dependencies
Ensure Python is installed, then install dependencies:
```sh
pip install -r lambda_cache_leaderboard/requirements.txt
pip install -r leaderboard_function/requirements.txt
```

### 2. Set Up Environment Variables
Create a `.env` file and configure the following environment variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
LEADERBOARD_API_URL=your_leaderboard_api_url
VALKEY_HOST=your_valkey_host
VALKEY_PORT=your_valkey_port
```

### 3. Running Locally
You can run the service locally using:
```sh
python leaderboard_function/app.py
```

## AWS Lambda Deployment
This service is designed to run on **AWS Lambda**. You can deploy it using **AWS SAM**, **Serverless Framework**, or a **manual Lambda zip package**.

### Example AWS Lambda Deployment (ZIP Method)
```sh
zip -r deployment_package.zip . -x "*.git*"
aws lambda update-function-code --function-name your-lambda-function --zip-file fileb://deployment_package.zip
```

## API Usage
### Endpoint:
```
GET /leaderboard?count=5
```

## Caching Mechanism
- Uses **Valkey Glide** for caching leaderboard results.
- Cached data is stored under the key `active_leaderboard`.
- If cache is **stale or missing**, the leaderboard is re-fetched from the API.

## Technologies Used
- **Python** (async with `httpx` for API calls)
- **AWS Lambda** (serverless deployment)
- **Supabase** (PostgreSQL-based leaderboard storage)
- **Valkey Glide** (Redis-compatible caching)
- **Docker** (containerized deployment)

