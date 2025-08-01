FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --network-timeout 1000000

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV VITE_HOST=0.0.0.0

# Expose the port
EXPOSE 3000

# Start the application
CMD ["yarn", "dev", "--host"]