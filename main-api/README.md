# Main API

## Overview
The **Main API** is a FastAPI-based service that acts as the central hub for handling user interactions, including **daily coding challenges, leaderboard management, and code submission processing**. It integrates with **AWS SQS**, **Valkey Glide (Redis)** for caching, and external APIs for **leaderboard** and **question retrieval**.

## Project Structure
```
main-api/
│── .gitignore                # Git ignore file for repo cleanliness
│── .ebignore                 # Elastic Beanstalk ignore file
│── Dockerfile                # Docker containerization setup
│── app.py                    # FastAPI main application
│── leaderboard.py            # Leaderboard formatting and processing functions
│── questions_fns.py          # Helper functions for handling daily coding questions
│── stats_fns.py              # (Planned) Functions for statistical processing
│── requirements.txt          # Dependencies for the service
│── test_sqs.html             # Frontend testing file for SQS message submission
│── tests/                    # Folder containing unit tests
│   │── disabled_test_sqs.py          # Tests for AWS SQS job queue integration
│   │── disabled_test_valkey_cache.py  # Tests for caching job results using Valkey Glide
```

## Features
- **Retrieves daily coding questions** from the cache (`questions_fns.py`).
- **Handles code submissions** and queues them via **AWS SQS**.
- **Manages leaderboard retrieval and formatting** (`leaderboard.py`).
- **Provides a WebSocket API** for real-time job status updates.
- **Uses **Valkey Glide (Redis)** for caching leaderboard and question data.
- **FastAPI-based server** with CORS middleware.
- **Includes test cases for SQS job queue and caching in Valkey Glide** (`tests/`).

## Installation & Setup
### 1. Install Dependencies
Ensure Python is installed, then install dependencies:
```sh
pip install -r requirements.txt
```

### 2. Set Up Environment Variables
Create a `.env` file and configure the following:
```
AWS_REGION=eu-north-1
SQS_QUEUE_URL=your_sqs_queue_url
LEADERBOARD_API_URL=your_leaderboard_api_url
VALKEY_HOST=your_valkey_host
VALKEY_PORT=your_valkey_port
```

### 3. Running the API Locally
```sh
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

## AWS Deployment (Elastic Beanstalk)
This service is designed for **AWS Elastic Beanstalk** deployment.

### Deploying to Elastic Beanstalk:
```sh
eb init -p docker main-api
 eb create main-api-env
```

### Deploying via Docker:
```sh
docker build -t main-api .
docker run -p 8000:8000 --env-file .env main-api
```

## API Endpoints
### **1. Daily Question Retrieval**
```
GET /api/daily-question
```
**Response:**
```json
{
    "easy": { "problem_id": "123", "description": "An easy problem" },
    "hard": { "problem_id": "456", "description": "A hard problem" }
}
```

### **2. Submit Code**
```
POST /api/submit-code
```
**Request:**
```json
{
    "code": "print('Hello, world!')",
    "problem_id": "123",
    "language": "python",
    "is_submit": true
}
```
**Response:**
```json
{
    "status": "queued",
    "job_id": "abc-123"
}
```

### **3. Leaderboard Retrieval**
```
GET /api/leaderboard
```
**Response:**
```json
{
    "easy": [{"rank": 1, "name": "Alice", "score": 100}],
    "hard": [{"rank": 1, "name": "Bob", "score": 95}]
}
```

### **4. WebSocket for Job Status**
```
ws://localhost:8000/ws/job-status/{job_id}
```
- Listens for **real-time updates** on code execution results.

## Error Handling
- **Cache miss** → Returns HTTP 500 with an error message.
- **AWS SQS failures** → Logs error and returns HTTP 500.
- **Invalid API payloads** → Returns HTTP 400 with error details.

## Testing
Run unit tests using:
```sh
pytest tests/
```
### **Test Coverage:**
- **SQS Job Queue Tests** (`disabled_test_sqs.py`): Ensures that submitted code is properly enqueued in **AWS SQS**.
- **Valkey Glide Caching Tests** (`disabled_test_valkey_cache.py`): Simulates storing and retrieving job results from the cache.

## Technologies Used
- **Python / FastAPI** (server framework)
- **AWS Elastic Beanstalk** (deployment)
- **AWS SQS** (job queue management)
- **Valkey Glide (Redis)** (caching)
- **Docker** (containerized deployment)
- **WebSockets** (real-time job status updates)
- **Pytest & Moto** (unit testing and AWS mocking)

