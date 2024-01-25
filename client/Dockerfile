# Dockerfile

# Base image
FROM node:20.10.0

# Set working directory
WORKDIR /app/client

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --ignore-scripts

# Copy the rest of your app's source code
COPY . ./

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["yarn", "dev"]