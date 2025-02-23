from flask import Flask, request, jsonify
import boto3
import json
import os
import uiud

app = Flask(__name__)

# Init SQS client using boto3 package
sqs = boto3.client('sqs', region_name=os.getenv('AWS_REGION', 'eu-west-2'))

SQS_QUEUE_URL = os.getenv('SQS_QUEUE_URL', 'https://sqs.eu-west-2.amazonaws.com/202533540156/CodeQueue.fifo')

@app.route('/submit-code', methods=['POST'])
def submit_code():
    data = request.get_json()
    code = data.get('code')
    problem_id = data.get('problem_id')
    language = data.get('language')

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
            MessageBody=message_body
        )
        return jsonify({'message_id': response.get('MessageId'), 'status': 'queued'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
