# Use the official Node.js image as the base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json from the parent directory
# This is crucial for leveraging Docker's layer caching
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
# This command is for running a monorepo application.
CMD [ "npm", "run", "start:prod", "api-gateway" ]
