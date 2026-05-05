# Deployment Guide for WasteLess

## Overview
WasteLess is a full-stack application with:
- **Frontend**: React + Vite (runs on port 5173)
- **Backend**: Node.js + Express + TypeScript (runs on port 3001)

## Build Status
✅ Frontend builds successfully to `dist/`
✅ Backend builds successfully to `server/dist/`

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)
**Pros**: Free, easy, automatic deployments from Git
**Cons**: Backend requires separate solution

#### Frontend Deployment (Vercel)
1. Push code to GitHub/GitLab
2. Connect repository to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy!

### Option 2: Netlify (Alternative for Frontend)
**Pros**: Free, easy, Git integration
**Cons**: Backend requires separate solution

#### Frontend Deployment (Netlify)
1. Push code to GitHub/GitLab
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy!

### Option 3: Railway/Render (Full Stack)
**Pros**: Can host both frontend and backend
**Cons**: May require configuration

#### Full Stack Deployment (Railway)
1. Create `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd server && npm start",
    "healthcheckPath": "/api/health"
  }
}
```

2. Push to GitHub
3. Connect to Railway
4. Set environment variables

### Option 4: Vercel + Railway (Hybrid)
**Best solution**: Use Vercel for frontend, Railway for backend

#### Backend Deployment (Railway)
1. Create `server/Procfile`:
```
web: npm start
```

2. Set environment variables:
   - `PORT`: 3001 (or any port)
   - `JWT_SECRET`: your-secret-key
   - `NODE_ENV`: production

3. Deploy backend to Railway
4. Update frontend CORS to include Railway URL

## Environment Variables

### Backend Required Variables
```env
PORT=3001
JWT_SECRET=your-very-secure-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

### Frontend Configuration
Update CORS origins in `server/src/index.ts`:
```javascript
origin: [
  'http://localhost:5173',
  'https://your-frontend-domain.vercel.app',
  'https://your-backend-domain.railway.app'
]
```

## Deployment Steps

### Step 1: Prepare for Production
```bash
# Build frontend
npm run build

# Build backend
cd server
npm run build
```

### Step 2: Deploy Backend (Railway/Render)
1. Create account on Railway.app
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Step 3: Deploy Frontend (Vercel)
1. Create account on Vercel.com
2. Connect GitHub repository
3. Configure build settings
4. Deploy

### Step 4: Update CORS
Update `server/src/index.ts` to include your deployed URLs.

## Alternative: Docker Deployment

Create `Dockerfile` in root:
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

# Build frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Build backend
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app/server
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/node_modules ./node_modules
COPY --from=builder /app/server/package.json ./
EXPOSE 3001
CMD ["npm", "start"]
```

## Testing Deployment
1. Check backend health: `https://your-backend-url/api/health`
2. Test frontend: `https://your-frontend-url`
3. Test API calls in browser

## Troubleshooting

### Common Issues
- **CORS errors**: Update allowed origins in backend
- **Build failures**: Check all dependencies are installed
- **Environment variables**: Ensure all required vars are set
- **Port conflicts**: Use different ports for frontend/backend

### Database Notes
- Current implementation uses file-based storage
- For production, consider migrating to PostgreSQL/MongoDB
- File storage may not work well on serverless platforms

## Cost Analysis
- **Vercel**: Free tier available
- **Railway**: $5-20/month depending on usage
- **Netlify**: Free tier available
- **Render**: Free tier available

## Next Steps
1. Choose deployment strategy
2. Set up Git repository
3. Configure environment variables
4. Deploy backend first
5. Deploy frontend
6. Test integration
