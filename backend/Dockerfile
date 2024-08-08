# Use an official Python runtime as a parent image
FROM python:3.11.7-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install pipenv

# Copy Pipfile and Pipfile.lock
COPY Pipfile Pipfile.lock ./

# Install project dependencies
RUN pipenv install --system --deploy

# Copy the current directory contents into the container at /app
COPY . .

# Make wait-for.sh script executable
RUN chmod +x wait-for.sh

# Make entrypoint script executable
RUN chmod +x entrypoint.sh

# Run entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]