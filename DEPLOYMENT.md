# SpectraCanvas Deployment Guide 🚀

This guide covers deploying SpectraCanvas to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Build succeeds without errors (`npm run build`)
- [ ] No console errors in production build
- [ ] README.md updated with demo video link
- [ ] GitHub repository is public (for IBM submission)

## 🌐 Vercel Deployment (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Step 1: Prepare Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SpectraCanvas for IBM AI Builders Challenge"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/spectracanvas.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your `spectracanvas` repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

### Step 4: Deploy

Click "Deploy" and wait for build to complete (~2-3 minutes).

Your app will be live at: `https://spectracanvas.vercel.app`

---

## 🐳 Docker Deployment

### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build image
docker build -t spectracanvas .

# Run container
docker run -p 3000:3000 \
  -e WATSONX_API_KEY=your_key \
  -e WATSONX_PROJECT_ID=your_project \
  -e WATSONX_URL=your_url \
  spectracanvas
```

---

## ☁️ AWS Amplify Deployment

### Step 1: Install Amplify CLI

```bash
npm install -g @aws-amplify/cli
amplify configure
```

### Step 2: Initialize Amplify

```bash
amplify init
```

### Step 3: Add Hosting

```bash
amplify add hosting
# Choose: Hosting with Amplify Console
# Choose: Manual deployment
```

### Step 4: Deploy

```bash
amplify publish
```

---

## 🔧 Netlify Deployment

### Step 1: Create `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Step 2: Deploy

1. Visit [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select `spectracanvas` repository
5. Add environment variables
6. Click "Deploy site"

---

## 🌍 Custom Server Deployment

### Using PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Build application
npm run build

# Start with PM2
pm2 start npm --name "spectracanvas" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Using Nginx as Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 Environment Variables

### Required Variables

```env
WATSONX_API_KEY=your_watsonx_api_key
WATSONX_PROJECT_ID=your_watsonx_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

### Optional Variables

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 🧪 Testing Production Build Locally

Before deploying, test the production build:

```bash
# Build for production
npm run build

# Start production server
npm start

# Visit http://localhost:3000
```

---

## 📊 Performance Optimization

### Enable Image Optimization

Already configured in `next.config.js`:

```javascript
images: {
  domains: ['fonts.googleapis.com'],
  formats: ['image/webp', 'image/avif'],
}
```

### Enable Compression

Most platforms (Vercel, Netlify) enable gzip/brotli automatically.

For custom servers, add compression middleware.

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Restart dev server after adding new variables
- Check platform-specific environment variable syntax

### 404 Errors on Refresh

Configure your hosting platform for SPA routing:
- Vercel: Automatic
- Netlify: Add `_redirects` file
- Custom: Configure server rewrites

---

## 📈 Monitoring

### Vercel Analytics

Enable in Vercel dashboard → Analytics tab

### Custom Analytics

Add to `src/app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🎯 Post-Deployment

1. **Test all features** on production URL
2. **Update README.md** with live demo link
3. **Submit to IBM Challenge** with deployment URL
4. **Monitor performance** and errors
5. **Gather user feedback**

---

## 📞 Support

For deployment issues:
- Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- Visit [Vercel Support](https://vercel.com/support)
- Open GitHub issue

---

**Your SpectraCanvas is ready to go live!** 🚀
