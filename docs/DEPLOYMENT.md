# 🚀 Deployment Guide

> Complete guide for deploying Career Pulse Frontend to various platforms

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ Node.js 18+ installed
- ✅ Backend server running and accessible
- ✅ Environment variables configured
- ✅ Production build tested locally

## 🔧 Build Configuration

### Production Build

```bash
# Install dependencies
npm install

# Create production build
npm run build

# Preview the build locally
npm run preview
```

### Environment Variables

Create a `.env.production` file:

```env
# Backend API Configuration
VITE_API_BASE_URL=https://api.careerpulse.com/api/v1
VITE_WS_URL=wss://api.careerpulse.com/ws

# App Configuration
VITE_APP_NAME=Career Pulse
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_ANALYTICS=true
```

## 🌐 Deployment Platforms

### 1. Vercel (Recommended)

Vercel is the recommended platform for React applications.

#### Setup Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Configure Environment Variables**
- Go to your project dashboard on Vercel
- Navigate to Settings → Environment Variables
- Add all production environment variables

#### Vercel Configuration (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Netlify

#### Setup Steps:

1. **Build the project**
```bash
npm run build
```

2. **Deploy via Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

#### Netlify Configuration (`netlify.toml`)

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 3. AWS S3 + CloudFront

#### Setup Steps:

1. **Create S3 Bucket**
```bash
aws s3 mb s3://careerpulse-frontend-prod
```

2. **Configure Bucket for Static Website**
```bash
aws s3 website s3://careerpulse-frontend-prod \
  --index-document index.html \
  --error-document index.html
```

3. **Upload Build Files**
```bash
aws s3 sync dist/ s3://careerpulse-frontend-prod --delete
```

4. **Set Bucket Policy**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::careerpulse-frontend-prod/*"
    }
  ]
}
```

5. **Create CloudFront Distribution**
- Origin: S3 bucket
- Default root object: `index.html`
- Error pages: Redirect 404 to `/index.html`

### 4. Docker Deployment

#### Dockerfile

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration (`nginx.conf`)

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }
}
```

#### Docker Compose (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=https://api.careerpulse.com/api/v1
      - VITE_WS_URL=wss://api.careerpulse.com/ws
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx-ssl.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
    restart: unless-stopped
```

## 🔒 SSL/HTTPS Configuration

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d careerpulse.com -d www.careerpulse.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx SSL Configuration

```nginx
server {
    listen 80;
    server_name careerpulse.com www.careerpulse.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name careerpulse.com www.careerpulse.com;

    ssl_certificate /etc/letsencrypt/live/careerpulse.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/careerpulse.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 Monitoring & Analytics

### Performance Monitoring

```typescript
// src/utils/analytics.ts
export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID, {
      page_path: path,
    });
  }
};

export const trackEvent = (action: string, category: string, label?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
};
```

### Error Tracking with Sentry

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});

// Wrap your app
<Sentry.ErrorBoundary fallback={ErrorFallback} showDialog>
  <App />
</Sentry.ErrorBoundary>
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
        VITE_WS_URL: ${{ secrets.VITE_WS_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Verify environment variables

2. **API Connection Issues**
   - Check CORS configuration on backend
   - Verify API URLs in environment variables
   - Check network connectivity

3. **Routing Issues**
   - Ensure SPA routing is configured
   - Check server configuration for fallback to index.html

4. **Performance Issues**
   - Enable gzip compression
   - Optimize images and assets
   - Use CDN for static assets

### Debug Commands

```bash
# Check build output
npm run build && ls -la dist/

# Test production build locally
npm run preview

# Check environment variables
echo $VITE_API_BASE_URL

# Verify SSL certificate
openssl s_client -connect careerpulse.com:443 -servername careerpulse.com
```

## 📈 Performance Optimization

### Build Optimization

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    host: true,
  },
});
```

### CDN Configuration

```html
<!-- Add to index.html for CDN assets -->
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://cdn.jsdelivr.net/npm/lucide-react@latest/dist/esm/lucide-react.js" as="script">
```

## 🔐 Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Environment variables secured
- [ ] API endpoints protected
- [ ] CORS properly configured
- [ ] Content Security Policy implemented
- [ ] Regular dependency updates
- [ ] Error handling without sensitive data exposure

## 📚 Additional Resources

- [Vercel Deployment Guide](https://vercel.com/docs/concepts/deployments/overview)
- [Netlify Deployment Guide](https://docs.netlify.com/site-deploys/overview/)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)

---

<div align="center">
  <p>🚀 Happy Deploying!</p>
  <p>For support, check our <a href="../README.md">main documentation</a></p>
</div>

