# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the React application for production
RUN npm run build

# Expose Vite's default preview port
EXPOSE 4173

# Serve the production build
CMD ["npm", "run", "preview", "--", "--host"]