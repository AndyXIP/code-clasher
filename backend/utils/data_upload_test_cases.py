import os
import re
import json
import requests
import time
import traceback
import multiprocessing
import math
from dotenv import load_dotenv
from openai import OpenAI
from datasets import load_dataset

# Load environment variables
load_dotenv()

# OpenAI API setup
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=OPENAI_API_KEY)

# Supabase setup
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_API_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
TABLE_NAME = 'questions'

SUPABASE_ENDPOINT = f'{SUPABASE_URL}/rest/v1/{TABLE_NAME}'
HEADERS = {
    'apikey': SUPABASE_API_KEY,
    'Authorization': f'Bearer {SUPABASE_API_KEY}',
    'Content-Type': 'application/json',
}


def run_solution_with_timeout(solution_code, inputs, timeout=5):
    '''
    Runs the solution in a separate process to enforce a timeout.
    '''
    def target_function(queue, solution_code, inputs):
        '''
        This function executes the provided solution code and stores results in a queue.
        '''
        try:
            import math
            import collections
            import heapq
            import queue as q
            import itertools
            import functools
            import bisect
            import re
            import json
            import string
            import datetime
            import statistics
            import random
            import typing
            from typing import List, Tuple, Dict, Set, Optional
            from collections import defaultdict, deque, Counter
            from functools import lru_cache

            # Inject all modules into execution environment
            exec_globals = {
                '__builtins__': __builtins__,
                'math': math,
                'collections': collections,
                'heapq': heapq,
                'queue': q,
                'itertools': itertools,
                'functools': functools,
                'bisect': bisect,
                're': re,
                'json': json,
                'string': string,
                'datetime': datetime,
                'statistics': statistics,
                'random': random,
                'typing': typing,
                'List': List,
                'Tuple': Tuple,
                'Dict': Dict,
                'Set': Set,
                'Optional': Optional,
                'defaultdict': defaultdict,
                'deque': deque,
                'Counter': Counter,
                'lru_cache': lru_cache,
            }
            exec_locals = {}

            # Execute the solution code safely
            exec(solution_code, exec_globals, exec_locals)

            # Check if it's a class-based solution
            if 'Solution' in exec_locals:
                solution_instance = exec_locals['Solution']()
                for key in dir(solution_instance):
                    if not key.startswith('__') and callable(getattr(solution_instance, key)):
                        method = getattr(solution_instance, key)

                        # Run method and store result
                        results = [method(*inp) for inp in inputs]
                        queue.put(results)
                        return

            # Check for standalone function
            for name, obj in exec_locals.items():
                if callable(obj) and not name.startswith('__'):
                    results = [obj(*inp) for inp in inputs]
                    queue.put(results)
                    return

            queue.put([])  # If no valid function/class method found

        except Exception as e:
            queue.put(f'Error: {str(e)}')  # Send error to parent process

    # Run in separate process
    result_queue = multiprocessing.Queue()
    process = multiprocessing.Process(target=target_function, args=(result_queue, solution_code, inputs))
    process.start()
    process.join(timeout)  # Timeout Enforced

    # If process is still alive after timeout, terminate it
    if process.is_alive():
        print(f'Timeout! Solution execution took longer than {timeout} seconds.')
        process.terminate()
        process.join()
        return f'Error: Timeout after {timeout} seconds'

    # Retrieve result from queue
    if not result_queue.empty():
        return result_queue.get()
    
    return f'Error: No output received'


def execute_solution(solution_code, inputs, timeout=5):
    '''
    Executes the solution with a timeout.
    '''
    result = run_solution_with_timeout(solution_code, inputs, timeout)

    if isinstance(result, str) and 'Error' in result:
        print(f'{result}')  # Print errors, including timeouts
        return []

    return result


def generate_test_cases_with_llm(question, example_inputs, example_outputs):
    '''
    Uses GPT-4o mini to generate additional test cases. 
    '''
    prompt = f'''
    You are an AI test case generator. Your task is to generate additional valid test cases for a given coding problem.
    Make basic, edge, and large scale test cases. Please don't add any comments, only outputs. Please don't add any
    inf or NaN cases. Keep your input cases realistic and concise.
    
    **Question**:
    {question}
    
    **Example Input-Output Pair**:
    Inputs: {example_inputs}
    Outputs: {example_outputs}
    
    **Goal**:
    - Generate 15 new test cases.
    - Ensure inputs match the expected structure.
    - Ensure outputs are logically valid.

    **Format the response as JSON:**
    {{
        'inputs': [[...], [...], ...],  # List of new input test cases
        'outputs': [[...], [...], ...]]  # Corresponding expected outputs
    }}
    '''
    retries = 3
    for attempt in range(retries):
        try:
            response = client.chat.completions.create(
                model='gpt-4o-mini',
                messages=[
                    {'role': 'system', 'content': 'You generate programming test cases.'},
                    {'role': 'user', 'content': prompt}
                ],
                temperature=0.5
            )

            raw_response = response.choices[0].message.content
            print(f'RAW LLM RESPONSE:\n{raw_response}')

            cleaned_response = re.sub(r'```json\s*|\s*```', '', raw_response).strip()
            return json.loads(cleaned_response)

        except Exception as e:
            print(f'API error: {e}. Retrying in {2 ** attempt} seconds...')
            time.sleep(2 ** attempt)

    return {'inputs': [], 'outputs': []}
