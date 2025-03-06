# Leaderboard Updater

## Overview
The **Leaderboard Updater** is a serverless function designed to update the `completed_questions` table in **Supabase** when users complete coding challenges. It is deployed as an **AWS Lambda function** and accepts input from API Gateway requests.

## Project Structure
```
leaderboard-updater/
│── db_client.py         # Database client for Supabase integration
│── lambda_handler.py    # AWS Lambda function for processing leaderboard updates
│── requirements.txt     # Dependencies required for the service
│── Dockerfile           # Docker containerization setup
```

## Features
- **Processes API requests** to update the leaderboard.
- **Validates user submissions** before storing them in Supabase.
- **Handles missing fields & incorrect data formats** gracefully.
- **Supports both HTTP body and query parameter inputs.**
- **Docker support for containerized deployment.**

## Installation & Setup
### 1. Install Dependencies
Ensure Python is installed, then install dependencies:
```sh
pip install -r requirements.txt
```

### 2. Set Up Environment Variables
Create a `.env` file and configure the following environment variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### 3. Running Locally
You can simulate API requests locally by executing the Lambda handler:
```sh
python lambda_handler.py
```

## AWS Lambda Deployment
This service is designed to run on **AWS Lambda**. You can deploy it using **AWS SAM**, **Serverless Framework**, or a **manual Lambda zip package**.

### Example AWS Lambda Deployment (ZIP Method)
```sh
zip -r deployment_package.zip . -x "*.git*"
aws lambda update-function-code --function-name leaderboard-updater --zip-file fileb://deployment_package.zip
```

## API Usage
### Endpoint:
```
POST /update-leaderboard
```

## Technologies Used
- **Python** (for database interaction)
- **AWS Lambda** (serverless deployment)
- **Supabase** (PostgreSQL-based leaderboard storage)
- **Docker** (optional containerized deployment)

## Contributors
- **Your Name** - Developer

## License
This project is licensed under the MIT License.

