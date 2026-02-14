FROM node:18-slim

# Install pnpm
RUN npm install -g pnpm@9.12.0

WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Build the server (esbuild bundles server/_core/index.ts -> dist/index.js)
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the server
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
