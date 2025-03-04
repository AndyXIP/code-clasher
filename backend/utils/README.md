# README: Test Case Generation

## Overview
This module provides **automated test case generation** for coding problems in our platform. It utilizes **Large Language Models (LLMs)** to generate diverse test cases and executes solution code to validate outputs. The goal is to enhance the variety and reliability of test cases used for evaluating submitted code.

## Key Features
- **Test Case Generation with LLMs:** Uses OpenAI's GPT models to generate test cases based on problem descriptions.
- **Solution Execution with Timeouts:** Runs solutions in a sandboxed Python environment with a timeout to prevent infinite loops or long-running computations.
- **Error Handling & Robustness:** Skips test cases that contain `inf`, `NaN`, or produce invalid results.
- **Dataset Enhancement:** Addresses the issue of insufficiently diverse test cases in existing datasets.

---

## Motivation
### Challenges in Existing Test Case Datasets
Through our experimentation, we found that existing datasets such as **CodeParrot (from Hugging Face)** often lack sufficient test cases.

### Research Reference
We reference **"Large Language Models as Test Case Generators: Performance Evaluation and Enhancement"** by Kefan Li and Yuan Yuan (Beihang University).
- The paper highlights **LLMs' limitations** in **generating correct test cases**.
- It proposes **TestChain**, a multi-agent framework that **separates test input and output generation** to improve accuracy.
- We incorporated a similar **execution-based validation approach** in our pipeline to ensure that generated test cases **map correctly to outputs**.

---

## How It Works
### 1. Generating Test Cases
- The system queries the LLM with a problem statement and example test cases.
- The LLM generates **15+ new test cases**, covering **basic, edge, and large-scale** scenarios.
- Outputs are computed by running **actual solutions** rather than relying on the LLM to generate expected results.

### 2. Executing Solutions
- The solution code is executed in a **sandboxed environment** with:
  - **Preloaded modules** (math, collections, heapq, etc.).
  - **Timeout enforcement** (default: 5 seconds).
  - **Multiprocessing for parallel execution**.

### 3. Validating Test Cases
- If the generated outputs are **empty** or contain **invalid values** (`inf`, `NaN`), they are **skipped**.
- The system logs errors (e.g., execution failures, infinite loops) and proceeds without crashing.

---

## Installation & Dependencies
### Requirements
The module requires the following dependencies:

```
openai
datasets
requests
python-dotenv
multiprocessing
```

### Setup
1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
2. **Set up environment variables** in a `.env` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_key_here
   ```
3. **Run the script**:
   ```bash
   python data_upload_test_cases.py
   ```

---

## Folder Structure
```
backend/utils/
│── data_upload.py             # Script without test case generation
│── data_upload_test_cases.py  # Main test case generation script
│── requirements.txt           # Dependencies
│── .env                       # API keys & environment variables (not included in version control)
```

---

## Limitations & Future Improvements
### 1. Dependence on LLM Accuracy
- LLM-generated test cases are **not always correct**.
- Errors are mitigated by **executing solutions**, but this requires **correct implementations**.

### 2. Execution Constraints
- The **timeout mechanism** prevents infinite loops but may **kill valid long-running solutions**.
- Potential improvements:
  - Dynamically adjusting timeouts based on **input size**.

### 3. Dataset Quality
- The original dataset lacked **edge cases and diverse test scenarios**.
- Our approach **improves** diversity but still relies on the LLM's ability to generalize.

---

## Conclusion
This module improves **test case diversity** for coding challenges by **generating and validating** test cases using **LLMs and solution execution**. It builds upon prior research on LLM-based test generation and mitigates common pitfalls found in existing datasets.

For future improvements, we could:
- Implement a **multi-agent framework** (similar to TestChain) to **separate test input/output generation**.
- Introduce **mutation testing** to verify solution robustness.
- Optimize the **error-handling mechanisms** to refine test cases further.
