# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip

# Now install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV PORT=8080

# Expose port 8080 so the app is accessible
EXPOSE 8080

# Run the Flask application
CMD ["flask", "run", "--port=8080"]
