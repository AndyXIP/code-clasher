from flask import Flask, request, jsonify
import boto3
import json
import os
import uuid
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

# Init SQS client using boto3 package.
sqs = boto3.client('sqs', region_name=os.getenv('AWS_REGION', 'eu-north-1'))

SQS_QUEUE_URL = os.getenv('SQS_QUEUE_URL')

@app.route('/')
def index():
    return "hello"

@app.route('/submit-code', methods=['POST'])
def submit_code():
    print('entering submit code')
    data = request.get_json()
    code = data.get('code')
    problem_id = data.get('problem_id')
    language = data.get('language')
    test_cases = data.get('test_cases')

    if not code or not problem_id or not language:
        return jsonify({'error': 'Missing required parameters'}), 400

    job_id = str(uuid.uuid4())

    job_payload = {
        'job_id': job_id,
        'problem_id': problem_id,
        'language': language,
        'code': code,
        'status': 'queued',
    }

    message_body = json.dumps(job_payload)

    try:
        response = sqs.send_message(
            QueueUrl=SQS_QUEUE_URL,
            MessageBody=message_body,
            MessageGroupId='default'
        )
        print('sent...')
        return jsonify({'message_id': response.get('MessageId'), 'status': 'queued'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

if __name__ == '__main__':
    app.run(debug=True, port=8080)
