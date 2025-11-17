FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Start development server with host flag to allow external access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
