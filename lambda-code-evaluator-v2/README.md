# Lambda Code Evaluator

## Overview
The **Lambda Code Evaluator** is a serverless function designed to **validate, execute, and evaluate user-submitted code** against predefined test cases. It uses **AWS Lambda** and **Valkey Glide (Redis)** to process coding submissions efficiently.

## Project Structure
```
lambda-code-evaluator-v2/
│── Dockerfile                 # Docker containerization setup
│── app/
│   │── cache_storing.py       # Stores execution results in Valkey Glide (Redis)
│   │── code_execution.py      # Executes user-submitted code in a safe environment
│   │── code_validation.py     # Validates user-submitted code against expected structure
│   │── lambda_function.py     # AWS Lambda entry point handling code execution
│   │── test_data_1.py         # Sample test data for validation
│   │── test_data_2.py         # Additional sample test cases
```

## Features
- **Validates user code structure** before execution (`code_validation.py`).
- **Executes code in a secure sandbox** using subprocess calls (`code_execution.py`).
- **Compares execution output to expected test case results**.
- **Caches execution results** using **Valkey Glide (Redis)** (`cache_storing.py`).
- **Designed for AWS Lambda deployment** (`lambda_function.py`).
- **Includes test cases for evaluation** (`test_data_1.py`, `test_data_2.py`).

## Installation & Setup
### 1. Install Dependencies
Ensure Python is installed, then install dependencies:
```sh
pip install -r requirements.txt
```

### 2. Set Up Environment Variables
Create a `.env` file and configure the following:
```
VALKEY_HOST=your_valkey_host
VALKEY_PORT=your_valkey_port
```

### 3. Running Locally
```sh
python app/lambda_function.py
```

## AWS Lambda Deployment
### Deploy the Lambda Function
```sh
zip -r deployment_package.zip . -x "*.git*"
aws lambda update-function-code --function-name code-evaluator --zip-file fileb://deployment_package.zip
```

## API Usage
### Lambda Execution:
```
POST /execute-code
```

## Technologies Used
- **Python** (for validation and execution)
- **AWS Lambda** (serverless deployment)
- **Valkey Glide** (Redis-compatible caching)
- **Docker** (containerized deployment)

