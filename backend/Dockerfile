# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the backend port
EXPOSE 5000

# Start the compiled application
CMD ["npm", "start"]