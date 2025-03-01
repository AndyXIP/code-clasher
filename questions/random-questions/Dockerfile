# Use AWS Lambda Python 3.9 runtime base image
FROM public.ecr.aws/lambda/python:3.9

# Copy requirements.txt and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy your entire application code into the container
COPY . ${LAMBDA_TASK_ROOT}

# Set the CMD to your Lambda handler function
CMD ["run.lambda_handler"]
