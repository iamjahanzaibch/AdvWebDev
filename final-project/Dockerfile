FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose both frontend (5173) and backend (5000) ports
EXPOSE 5173 5000

# Default to frontend dev server; override with docker-compose command
CMD ["npm", "run", "dev:frontend", "--", "--host", "0.0.0.0", "--port", "5173"]
