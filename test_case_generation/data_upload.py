from datasets import load_dataset
import json
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase credentials
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_API_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
TABLE_NAME = 'questions'

# Supabase REST endpoint
SUPABASE_ENDPOINT = f'{SUPABASE_URL}/rest/v1/{TABLE_NAME}'
HEADERS = {
    'apikey': SUPABASE_API_KEY,
    'Authorization': f'Bearer {SUPABASE_API_KEY}',
    'Content-Type': 'application/json',
}


# Extract and filter dataset
def filter_and_prepare_question(sample, split):
    url = sample.get('url', '')

    # Filter only Codewars and Leetcode questions
    if 'leetcode' in url:
        source = 'leetcode'
    elif 'codewars' in url:
        source = 'codewars'
    else:
        return None  # Filter out samples with irrelevant sources

    try:
        # Check if input_output is missing or empty
        input_output_raw = sample.get('input_output', '')
        if not input_output_raw:
            return None  # Filter out if input_output is missing or empty

        input_output = json.loads(input_output_raw)

        # Further filter out if inputs or outputs are missing or empty
        inputs = input_output.get('inputs', [])
        outputs = input_output.get('outputs', [])

        if not inputs or not outputs:
            return None  # Filter out if inputs or outputs are missing or empty

        # Extract solutions, even if empty
        solutions = json.loads(sample['solutions']) if sample['solutions'] else []

        # Return the processed question in the required format
        return {
            'question': sample.get('question', ''),
            'solutions': solutions,
            'inputs': inputs,
            'outputs': outputs,
            'name': input_output.get('name', ''),
            'difficulty': sample.get('difficulty', 'Easy'),
            'starter_code': sample.get('starter_code', ''),
            'source': source,
        }
    except Exception as e:
        print(f'Error processing question {sample.get('problem_id')}: {e}')
        return None


# Upload to Supabase
def upload_to_supabase(data, counter):
    try:
        response = requests.post(SUPABASE_ENDPOINT, headers=HEADERS, json=[data])
        if response.status_code == 201:
            print(f'Uploaded question {counter}.')
            return True
        else:
            print(f'Upload failed: {response.status_code} - {response.text}')
            return False
    except Exception as e:
        print(f'Upload error: {e}')
        return False


# Process dataset for both splits
def process_and_upload_dataset(dataset, split):
    uploaded_count = 0
    for i, sample in enumerate(dataset):
        processed_question = filter_and_prepare_question(sample, split)
        if processed_question:
            success = upload_to_supabase(processed_question, uploaded_count)
            if success:
                uploaded_count += 1
    print(f'Total {split} questions uploaded: {uploaded_count}')


if __name__ == '__main__':
    # Load both train and test splits from Hugging Face
    print('Loading dataset from Hugging Face...')
    train_data = load_dataset('codeparrot/apps', split='train')
    test_data = load_dataset('codeparrot/apps', split='test')
    print(
        f'Loaded {len(train_data)} training questions and {len(test_data)} testing questions.'
    )

    # Process and upload both train and test splits
    print('Uploading training dataset...')
    process_and_upload_dataset(train_data, 'train')

    print('Uploading testing dataset...')
    process_and_upload_dataset(test_data, 'test')

    print('All uploads completed successfully.')
