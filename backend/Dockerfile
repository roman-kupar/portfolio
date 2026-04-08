# Use an official Python runtime as a parent image
FROM python:3.10-slim
LABEL authors="Roman Kupar"

# Install system dependencies (CMake, g++, make)
RUN apt-get update && apt-get install -y \
    cmake \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy backend files
COPY . .

# Install Python dependencies
# (Assuming you don't have a requirements.txt, we install flask and flask-cors directly)
RUN pip install --no-cache-dir flask flask-cors

# Build the C++ Chess Engine
RUN mkdir -p build && \
    cd build && \
    cmake .. -DCMAKE_BUILD_TYPE=Release && \
    cmake --build .

# Expose port 5000
EXPOSE 5000

# Set environment variable to tell server.py we are in Docker
ENV DOCKER_ENV=1

# Run the Flask app
CMD ["python", "server.py"]