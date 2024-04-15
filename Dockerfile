# Use the Node.js 20 base image
FROM node:20 AS base

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json pnpm-lock.yaml ./

# Install dependencies using PNPM
RUN npm install -g pnpm && pnpm install

# Generate prisma dependencies
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build target
FROM base AS build
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
COPY --from=0 /app .
RUN pnpm run bundle

# # Test target
FROM base AS test
ARG NODE_ENV=test
ENV NODE_ENV $NODE_ENV
COPY --from=build /app .
RUN pnpm run test