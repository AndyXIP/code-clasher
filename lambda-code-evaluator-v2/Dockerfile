# Use AWS Lambda Python runtime
FROM public.ecr.aws/lambda/python:3.9

# Install necessary dependencies
RUN yum update -y && \
    yum install -y gcc-c++ curl && \
    pip install RestrictedPython timeout-decorator

# Copy your Lambda function code into the container
COPY app/ ${LAMBDA_TASK_ROOT}

# Set entry point to your Lambda handler
CMD ["lambda_function.lambda_handler"]
