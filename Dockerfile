# Use an official Python runtime as a parent image
FROM node

# Set the working directory to /app
RUN mkdir -p /data
RUN mkdir -p /app
# Copy the current directory contents into the container at /app
WORKDIR /app
COPY . /app
# Install any needed packages specified in requirements.txt
RUN npm i
RUN npm link


# Run app.py when the container launches
CMD ["yarrrml-parser", "-i",  "/data/yarrrml.yaml", "-o", "/data/rmlrules.ttl"]
