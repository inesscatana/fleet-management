# Stage 1: Build the Next.js application
FROM node:18 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Production-ready image
FROM node:18-alpine

WORKDIR /app

# Copy the build output and dependencies from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose the port for the Next.js application
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "start"]
