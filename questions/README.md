# Random Questions Service

## Overview
The **Random Questions Service** includes two main components:
1. **Question Retrieval Service**: Fetches and processes random coding questions from Supabase API and stores them.
2. **Lambda Cache Updater for Questions**: Periodically updates and caches questions using **Valkey Glide** to improve performance in AWS Lambda.

## Project Structure
```
random-questions/
│── __init__.py                       # Marks directory as a package
│── db_client/
│   │── __init__.py                   # Marks db_client as a package
│   │── db_client.py                  # Database client for Supabase integration
│── double_string_parsing.py          # Utility for parsing JSON fields
│── randomq.py                        # Fetches and processes random questions
│── run.py                            # Main execution entry point
│── requirements.txt                  # Dependencies for the service
│── Dockerfile                        # Container setup (if applicable)
│
│── lambda-cache-updater-questions/
│   │── get_questions.py              # Fetches coding questions from API
│   │── lambda_handler.py             # AWS Lambda function for caching questions
│   │── requirements.txt              # Dependencies for the Lambda service
│   │── Dockerfile                    # Docker containerization setup
│   │── tests/
│   │   │── test_lambda_handler.py    # Unit tests for Lambda
│   │   │── test_questions_helpers.py # Unit tests for helper functions
```

## Features
- **Fetches random questions** based on difficulty and source (`randomq.py`).
- **Stores and retrieves data from Supabase** (`db_client.py`).
- **Processes malformed JSON fields** (`double_string_parsing.py`).
- **Caches questions in Valkey Glide** (`lambda_handler.py`).
- **Supports AWS Lambda deployment**.

## Installation & Setup
### 1. Install Dependencies
Ensure Python is installed, then install dependencies:
```sh
pip install -r requirements.txt
pip install -r lambda_cache_updater_questions/requirements.txt
```

### 2. Set Up Environment Variables
Create a `.env` file and configure the following:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
QUESTIONS_API_URL=your_api_url
VALKEY_HOST=your_valkey_host
VALKEY_PORT=your_valkey_port
```

### 3. Running Locally
#### Running the Random Questions Service
```sh
python run.py
```
#### Running the Lambda Cache Updater
```sh
python lambda_cache_updater_questions/lambda_handler.py
```

## AWS Lambda Deployment
### Deploy the Cache Updater
```sh
zip -r deployment_package.zip . -x "*.git*"
aws lambda update-function-code --function-name questions-cache-updater --zip-file fileb://deployment_package.zip
```

## API Usage
### Random Questions Endpoint:
```
GET /questions?count=5&difficulty=easy&source=leetcode
```
### Cache Updater Execution:
```
POST /update-cache
```

## Testing
Run tests using:
```sh
pytest random_questions/lambda_cache_updater_questions/tests/
```

## Technologies Used
- **Python** (async with `httpx` for API calls)
- **AWS Lambda** (serverless deployment)
- **Supabase** (PostgreSQL-based question storage)
- **Valkey Glide** (Redis-compatible caching)
- **Pytest** (unit testing framework)

