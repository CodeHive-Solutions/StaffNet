# Use an official Node.js runtime as a parent image
FROM node:latest

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to /app
COPY package*.json ./

# Install Python
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install --upgrade pip && \
    pip3 install -r requirements.txt
# Install dependencies
RUN npm install

# Copy the rest of the application code to /app
COPY . .

# Expose port 3000 (default port used by React)
EXPOSE 5173

# Start the React application
CMD ["npm", "run","dev"]