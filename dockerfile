# Use the official Node.js 20.11.0 image
FROM node:20.11.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Install Yarn version 3.5.1
RUN corepack enable && corepack prepare yarn@3.5.1 --activate

# Copy package.json and yarn.lock (if available) to the container to install dependencies
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the application port (adjust if your NestJS app uses a different port)
EXPOSE 3000

# Start the NestJS application
CMD ["yarn", "start:dev"]
