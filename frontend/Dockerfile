# Base Image
FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all project files
COPY . .

# Expose frontend port
EXPOSE 5173

# Use environment to decide the command
CMD ["sh", "-c", "npm run $NODE_ENV"]
