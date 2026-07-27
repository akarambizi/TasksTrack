FROM node:24.18.0-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Enable pnpm via Corepack
RUN corepack enable

# Install dependencies with network timeout and retry
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV VITE_HOST=0.0.0.0

# Expose the port
EXPOSE 3000

# Start the application
CMD ["pnpm", "dev", "--host"]