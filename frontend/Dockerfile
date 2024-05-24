# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose port 5001 for the app and 6006 for Storybook
EXPOSE 5001
EXPOSE 6006

# Default command to run the app
CMD ["yarn", "start"]
