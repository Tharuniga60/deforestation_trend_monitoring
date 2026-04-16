# Backend Deployment to Railway - Step by Step

## Prerequisites Checklist
- [ ] GitHub account created
- [ ] Commits pushed to https://github.com/Tharuniga60/deforestation_trend_monitoring
- [ ] Have access to Email/GitHub login

## Complete Step-by-Step Instructions

### Step 1: Create Railway Account (2 minutes)
1. Go to https://railway.app
2. Click "Start Project"
3. Sign up with GitHub or Email
4. Complete email verification if needed

### Step 2: Create New Project (1 minute)
1. In Railway dashboard, click "New Project"
2. Choose "Deploy from GitHub repo"
3. Authorize Railway to access your GitHub account

### Step 3: Select Repository (1 minute)
1. Search for: `deforestation_trend_monitoring`
2. Select: `Tharuniga60/deforestation_trend_monitoring`
3. Click "Deploy Now"

### Step 4: Railway Auto-Configuration (automatic)
Railway automatically:
- Detects Python project
- Reads `backend/requirements.txt`
- Reads `backend/Procfile`
- Reads `backend/runtime.txt`
- Sets up environment

### Step 5: Wait for Build (3-5 minutes)
- Watch deployment progress in Railway dashboard
- Status changes: Building → Deploying → Success
- You'll see build logs in real-time

### Step 6: Get Your Railway Domain URL
In Railway Dashboard:
1. Click on project
2. Under "Railway Deployments", find your domain
3. Format: `https://deforest-watch-api-[random].railway.app`
4. **SAVE THIS URL** - You'll need it for frontend!

### Step 7: Verify Backend is Running
1. Open your Railway domain URL in browser
2. Should see: `{"message": "DeforestWatch API running"}`
3. Visit `/docs` endpoint for API documentation

### Success Indicators
- ✅ Railway shows "Success" status
- ✅ Health check returns {"message": "DeforestWatch API running"}
- ✅ API docs accessible at `/docs`

---

## Your Railway Domain Format
```
https://[project-name]-[random-id].railway.app
```

Example: `https://deforest-watch-api-xyz123.railway.app`

**NEXT STEP**: Use this URL in frontend deployment!

---

## Troubleshooting Railway Deployment

### Error: "Build failed"
- Check Railway logs for Python errors
- Verify requirements.txt syntax
- All packages must be available

### Error: "Port not binding"
- Verify Procfile has `$PORT` variable
- Railway automatically assigns PORT environment variable

### Error: "Python version mismatch"
- Check `runtime.txt` specifies valid Python version (3.11.9)

### API returns 500 error
- Check Railway logs for backend errors
- Verify data file exists (sample_forest_data.csv)
- Check all imports in backend modules

### How to Check Logs
1. Railway Dashboard → Your Project
2. Click "Deployments" tab
3. Click latest deployment
4. View "Logs" section

---

## After Successful Deployment

1. **Save your Railway domain** (e.g., `https://deforest-watch-api-xyz.railway.app`)
2. **Proceed to frontend deployment** (using this URL)
3. **Update frontend API configuration** with this domain
4. **Deploy frontend to Vercel**

---

## Cost
- FREE tier (suffices for demo)
- Monitor usage in Railway dashboard
- No credit card required

---

**Status**: Ready for Railway deployment
**Last Updated**: 2026-04-16
