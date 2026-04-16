# Frontend Deployment to Vercel - Step by Step

## Prerequisites Checklist
- [ ] Backend successfully deployed to Railway
- [ ] Have Railway backend URL (e.g., `https://deforest-watch-api-xyz.railway.app`)
- [ ] GitHub account with repository access
- [ ] Deployment configuration pushed to GitHub

## Complete Step-by-Step Instructions

### Step 0: Get Your Railway Backend URL
Before starting, you need the URL from Railway deployment:
- Format: `https://deforest-watch-api-[random].railway.app`
- Verify it works: Open in browser, should show API health message

### Step 1: Create Vercel Account (2 minutes)
1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub account
4. Authorize Vercel to access your GitHub

### Step 2: Create New Project (1 minute)
1. In Vercel dashboard, click "Add New..." → "Project"
2. Click "Import Git Repository"
3. Search for: `deforestation_trend_monitoring`
4. Select your repository

### Step 3: Configure Project Settings (2 minutes)
1. **Framework Preset**: Select "Other" (static site)
2. **Root Directory**: Set to `./frontend`
3. **Build Command**: Leave empty (static files, no build needed)
4. **Output Directory**: Set to `.` (current directory)
5. **Install Command**: Leave empty
6. Click "Deploy"

### Step 4: Add Environment Variables (Optional but Recommended)
Before clicking Deploy:
1. Expand "Environment Variables" section
2. Add new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-railway-domain.railway.app/api`
   - Click "Add"
3. Then click "Deploy"

*Note: Frontend auto-detects localhost vs production, so this is optional*

### Step 5: Wait for Build (1-2 minutes)
- Vercel builds and deploys automatically
- Status changes: Building → Deploying → Ready
- Real-time logs available in dashboard

### Step 6: Get Your Vercel Domain
After successful deployment:
- Vercel shows your domain: `https://deforest-watch-[random].vercel.app`
- Or configure custom domain (optional)
- **SAVE THIS URL** - Share this with users!

### Step 7: Verify Frontend is Running
1. Open your Vercel domain in browser
2. Should see: DeforestWatch dashboard
3. Check browser console (F12) for any errors
4. Try clicking filters, viewing map, etc.

### Success Indicators
- ✅ Vercel shows "Ready" status
- ✅ Frontend loads without errors
- ✅ Browser console has no 404 errors
- ✅ Map renders with markers
- ✅ KPI cards display data
- ✅ Filters work properly

---

## Your Vercel Domain Format
```
https://deforest-watch-[random].vercel.app
```

Example: `https://deforest-watch-abc123.vercel.app`

---

## Production URLs After Deployment

| Component | URL |
|-----------|-----|
| Frontend | `https://deforest-watch-[random].vercel.app` |
| Backend API | `https://deforest-watch-api-[random].railway.app` |
| API Docs | `https://deforest-watch-api-[random].railway.app/docs` |
| Repository | `https://github.com/Tharuniga60/deforestation_trend_monitoring` |

---

## Troubleshooting Vercel Deployment

### Error: "Cannot find module"
- Check frontend file structure
- Verify all JS files in `frontend/js/` directory
- Ensure CSS file exists at `frontend/css/styles.css`

### Error: "Build failed"
- Check Vercel logs for errors
- Verify no syntax errors in HTML/JS/CSS
- Ensure all files are committed to GitHub

### Blank page or 404
- Check browser console (F12)
- Verify HTML file exists
- Check Network tab for failed requests

### API calls failing (Network errors)
- Verify Railway backend is running
- Check Browser Network tab → API requests
- Verify backend URL in frontend/js/api.js
- Check CORS configuration on backend

### How to Fix CORS Issues
If frontend can't reach backend:
1. Edit `frontend/js/api.js`
2. Verify API_BASE URL is correct
3. Check backend allows CORS from all origins
4. Push to GitHub (Vercel auto-redeploys)

### Update Vercel After Changes
1. Make changes to frontend files
2. Commit to GitHub: `git add . && git commit -m "Update frontend"`
3. Push to GitHub: `git push origin master`
4. Vercel automatically redeploys (2-3 minutes)

### Redeploy Manually
1. Vercel Dashboard → Your Project
2. Click "Deployments" tab
3. Click menu (⋯) on latest deployment
4. Select "Redeploy"

---

## Frontend Environment Configuration

The frontend handles both development and production automatically:

**Development** (localhost):
- Uses `http://localhost:8000/api`
- For local testing

**Production** (Vercel):
- Uses Railway backend URL
- Auto-detected from domain

### Override API URL
In browser console:
```javascript
window.DEFOREST_API_URL = "https://your-backend-url.railway.app/api";
location.reload();
```

---

## Next Steps After Deployment

1. ✅ Backend deployed to Railway
2. ✅ Frontend deployed to Vercel
3. [ ] Test end-to-end functionality
4. [ ] Share frontend URL with users
5. [ ] Monitor both services for errors

---

## Cost
- Vercel: FREE tier (sufficient for demo)
- Railway: FREE tier (sufficient for demo)
- **Total Cost**: $0 USD

---

## Monitoring

### Vercel
- Dashboard shows deployment history
- Analytics available (traffic, performance)
- Automatic HTTPS provided

### Railway
- Check logs in Railway dashboard
- Monitor resource usage
- Upgrade if needed (free tier often sufficient)

---

**Status**: Ready for Vercel deployment
**Last Updated**: 2026-04-16
