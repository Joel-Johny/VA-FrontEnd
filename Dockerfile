# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build your React app (customize this as needed)
RUN npm run build

# Expose a port (e.g., 80) for your app to listen on
EXPOSE 80

# Define the command to run your app
CMD ["npm", "start"]