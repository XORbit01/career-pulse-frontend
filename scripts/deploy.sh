#!/bin/bash

# === CONFIGURATION ===
SSH_KEY=~/.ssh/digita_ocean_id
USER=root
HOST=your-server-ip
REMOTE_PATH=/var/www/careerpulse
NGINX_SERVICE=nginx

# === 1. Build the project ===
echo "👉 Building React project with Vite..."
npm run build || { echo "❌ Build failed"; exit 1; }

# === 2. Ensure remote folder exists ===
echo "📁 Ensuring remote path exists..."
ssh -i "$SSH_KEY" $USER@$HOST "mkdir -p $REMOTE_PATH"

# === 3. Upload files ===
echo "📤 Uploading dist/ to $HOST:$REMOTE_PATH..."
scp -i "$SSH_KEY" -r dist/* $USER@$HOST:$REMOTE_PATH/ || { echo "❌ Upload failed"; exit 1; }

# === 4. Restart Nginx ===
echo "🔄 Restarting Nginx on remote server..."
ssh -i "$SSH_KEY" $USER@$HOST "systemctl reload $NGINX_SERVICE" || { echo "❌ Nginx reload failed"; exit 1; }

echo "✅ Deployment complete: https://your-domain.com"
