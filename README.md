
# Code Clasher

This project is a web application that allows users to test themselves daily with easy and hard programming challenges, while providing a fun competitive leaderboard to increase engagement.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup (FAST API)](#backend-setup-flask)
3. [Serverless Functions (AWS)](#serverless-functions)
4. [Frontend Setup (React)](#frontend-setup-react)
5. [Running the Application](#running-the-application)
6. [API Endpoints](#api-endpoints)
7. [Contributing](#contributing)
8. [License](#license)

---

## Prerequisites

Before setting up the project, ensure that you have the following installed on your machine:

- **Python 3.8+**
- **Next.js 16+** (which includes npm)
- **pip** (Python package manager)
- **virtualenv** (optional, for creating a virtual environment)

---

## Backend Setup (Flask)

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone git@github.com:AndyXIP/sse-team-project.git
cd sse-team-project
```

### 2. Set up a Virtual Environment

It is recommended to use a virtual environment to isolate your project dependencies:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scriptsactivate
```

### 3. Install Dependencies

Next, install the required Python packages:

```bash
pip install -r requirements.txt
```

### 4. Running the Flask Backend

Run the Flask development server to start the backend:

```bash
python src/app.py
```

This will start the backend server on `http://localhost:5000`.

### 5. Backend API Endpoints

The backend manages communication between serverless functions and the frontend through several API endpoints:

#### `GET /api/daily-question`
- **Description**: Fetches the current daily question in JSON format.
- **Example Request**:

```bash
curl https://main-api.click/api/daily-question
```

#### `GET /api/leaderboard`
- **Description**: Fetches the current top 5 users in the leaderboard in JSON format.
- **Example Request**:

```bash
curl https://main-api.click/api/leaderboard
```

#### `POST /api/submit-code`
- **Description**: Sends the user's code for compiling and testing, then fetches the results of that test in JSON format.
- **Example Request**:

```bash
curl https://main-api.click/api/submit-code
```

---

## Serverless Functions (AWS)

## Frontend Setup (React)

### 1. Install Frontend Dependencies

Navigate to the `frontend` directory and install the required JavaScript dependencies:

```bash
cd frontend
npm install
```

### 2. Running the React App

Start the React development server:

```bash
npm run dev
```

This will run the frontend on `http://localhost:3000`.

### 3. Frontend Features

The frontend provides the following features:

- Feature 1: Displaying real-time RuneScape item prices.
- Feature 2: User-friendly interface to interact with the backend and view data.

---

## Running the Application

Once both the backend and frontend are running, you should be able to visit the app at the following URLs:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:5000](http://localhost:5000)

The React frontend will make API requests to the Flask backend to display real-time item prices.

---

## API Endpoints

The backend provides the following API endpoint for fetching real-time item prices:

### `GET /api/daily-question`

- **Method**: GET
- **Description**: Fetches the daily question.
- **Response**: A JSON array containing difficulty, question inputs, prompt, output, etc.

#### Example Response:

```json
[
  {
    "easy": {
      "id": 665,
      "created_at": "2025-03-03T22:48:38.734378+00:00",
      "question": "In a deck of cards, each card has an integer written on it.\nReturn true if and only if you can choose X >= 2 such that it is possible to split the entire deck into 1 or more groups of cards, where:\n\nEach group has exactly X cards.\nAll the cards in each group have the same integer.\n\n \nExample 1:\nInput: deck = [1,2,3,4,4,3,2,1]\nOutput: true\nExplanation: Possible partition [1,1],[2,2],[3,3],[4,4].\n\nExample 2:\nInput: deck = [1,1,1,2,2,2,3,3]\nOutput: false\nExplanation: No possible partition.\n\nExample 3:\nInput: deck = [1]\nOutput: false\nExplanation: No possible partition.\n\nExample 4:\nInput: deck = [1,1]\nOutput: true\nExplanation: Possible partition [1,1].\n\nExample 5:\nInput: deck = [1,1,2,2,2,2]\nOutput: true\nExplanation: Possible partition [1,1],[2,2],[2,2].\n\n \nConstraints:\n\n1 <= deck.length <= 10^4\n0 <= deck[i] < 10^4",
      "inputs": [
        [[1,1,2,2,3,3,3,3]],
        [[2,2,2,2,3,3]],
        [[4,4,4,4,5,5,5,5]]
      ],
      "difficulty": "introductory",
      "starter_code": "\nclass Solution:\n    def hasGroupsSizeX(self, deck: List[int]) -> bool:\n        ",
      "source": "leetcode",
      "seen": false,
      "outputs": [true, true, true]
    }
  },
  {
    "hard": {
      "id": 334,
      "created_at": "2025-03-03T21:47:33.787697+00:00",
      "question": "A robot is located at the top-left corner of a m x n grid (marked 'Start' in the diagram below).\n\nThe robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid (marked 'Finish' in the diagram below).\n\nHow many possible unique paths are there?\n\n\nAbove is a 7 x 3 grid. How many possible unique paths are there?\n\nNote: m and n will be at most 100.\n\nExample 1:\n\n\nInput: m = 3, n = 2\nOutput: 3\nExplanation:\nFrom the top-left corner, there are a total of 3 ways to reach the bottom-right corner:\n1. Right -> Right -> Down\n2. Right -> Down -> Right\n3. Down -> Right -> Right\n\n\nExample 2:\n\n\nInput: m = 7, n = 3\nOutput: 28",
      "inputs": [
        [1,1],
        [2,2],
        [4,5]
      ],
      "difficulty": "interview",
      "starter_code": "\nclass Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        ",
      "source": "leetcode",
      "seen": false,
      "outputs": [1, 2, 35]
    }
  }
]
```

---

## Contributing

Contributions are welcome! To contribute to this project:

1. **Fork the repository**.
2. **Create a new branch**: `git checkout -b feature-name`.
3. **Commit your changes**: `git commit -am 'Add new feature'`.
4. **Push to your branch**: `git push origin feature-name`.
5. **Create a new Pull Request**.

---

## License

Include your licensing information here.

---
