# --- Stage 1: Build the Next.js Application ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
# Note: Use paths relative to the build context (which is ./frontend in docker-compose.yml)
COPY package*.json ./
RUN npm install
# Copy all source code (assuming source is in the same directory as Dockerfile)
COPY . .
# Run the Next.js build command - this creates the .next folder
RUN npm run build


# --- Stage 2: Serve the Application (Leaner Production Image) ---
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary files/folders for production run
# 1. Configuration (use .js or .mjs if that's what your setup uses)
#    Assuming next.config is copied into /app/ during the build stage
COPY --from=builder /app/next.config.* ./ 
# 2. Package files for npm ci
COPY --from=builder /app/package*.json ./
# 3. The essential built output (required for 'next start')
COPY --from=builder /app/.next ./.next
# 4. Static assets
COPY --from=builder /app/public ./public
# 5. Lockfile for clean installation (optional but good practice)
COPY --from=builder /app/package-lock.json ./package-lock.json 

# Install production dependencies only
RUN npm ci --only=production --ignore-scripts

EXPOSE 3000

# Command to start the production server
CMD ["npm", "run", "start"]