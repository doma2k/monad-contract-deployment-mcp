#!/bin/bash

# Check if Redis is running
if ! pgrep -x "redis-server" > /dev/null; then
  echo "Starting Redis server..."
  /opt/homebrew/opt/redis/bin/redis-server /opt/homebrew/etc/redis.conf &
  sleep 2  # Give Redis time to start
else
  echo "Redis is already running"
fi

# Set the Redis URL environment variable
export REDIS_URL=redis://localhost:6379

# Start the Next.js development server
echo "Starting Next.js development server..."
npm run dev 