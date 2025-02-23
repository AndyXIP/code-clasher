# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the container
# (Make sure you have a requirements.txt file in your questions folder or adjust accordingly)
COPY requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire questions package into the container
COPY . .

# Expose the port that the Flask app runs on (we use 5001 as defined in run.py)
EXPOSE 5001

# Command to run the microservice as a module from the package
CMD ["python", "-m", "run"]
