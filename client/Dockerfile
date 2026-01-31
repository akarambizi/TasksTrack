FROM node:22-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json yarn.lock ./

# Install dependencies with network timeout and retry
RUN yarn install --network-timeout 1000000 --frozen-lockfile

# Copy the rest of the application
COPY . .

# Verify all dependencies are properly installed
RUN yarn install --check-files

# Set environment variables
ENV NODE_ENV=development
ENV VITE_HOST=0.0.0.0

# Expose the port
EXPOSE 3000

# Start the application
CMD ["yarn", "dev", "--host"]