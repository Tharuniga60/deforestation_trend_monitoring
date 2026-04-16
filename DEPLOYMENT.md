# DeforestWatch Deployment Guide

## Complete Deployment Instructions

This guide walks you through deploying DeforestWatch to production using Railway (backend) and Vercel (frontend).

---

## Phase 1: Backend Deployment to Railway

### Prerequisites
- Railway account (free at https://railway.app)
- GitHub account with deforestation_trend_monitoring repository

### Steps

1. **Go to Railway.app**
   - Sign up/Login at https://railway.app
   - Create new project → Deploy from GitHub repo

2. **Connect GitHub Repository**
   - Click "Deploy from GitHub"
   - Select: `Tharuniga60/deforestation_trend_monitoring`
   - Authorize Railway access

3. **Railway Auto-Detection**
   - Railway automatically detects Python project
   - Reads `requirements.txt`
   - Reads `Procfile` from backend folder
   - Reads `runtime.txt` for Python version

4. **Environment Variables** (if needed)
   - No environment variables required for basic setup
   - Railway auto-assigns PORT

5. **Deploy**
   - Click "Deploy"
   - Wait 3-5 minutes for build/deployment
   - Railway assigns a domain: `https://deforest-watch-api-xyz.railway.app`

6. **Verify Backend**
   - Visit: `https://your-railway-domain.railway.app/`
   - Should see: `{"message": "DeforestWatch API running"}`
   - Visit: `https://your-railway-domain.railway.app/docs`
   - Should see: FastAPI Swagger documentation

**SAVE YOUR RAILWAY DOMAIN** - You'll need it next!

---

## Phase 2: Update Frontend with Backend URL

### Update frontend/js/api.js
The API URL is auto-set to:
```javascript
window.DEFOREST_API_URL || "https://deforest-watch-api.railway.app/api"
```

When you deploy frontend to Vercel, it will automatically use production backend URL.

To test locally with production backend:
1. In browser console: `window.DEFOREST_API_URL = "https://your-railway-domain.railway.app/api"`
2. Reload page

Or update the fallback URL in api.js:
```javascript
return window.DEFOREST_API_URL || "https://YOUR-RAILWAY-DOMAIN.railway.app/api";
```

---

## Phase 3: Frontend Deployment to Vercel

### Prerequisites
- Vercel account (free at https://vercel.com)
- GitHub repository connected

### Steps

1. **Go to Vercel.com**
   - Sign up/Login at https://vercel.com
   - Click "Add New..." → "Project"

2. **Import GitHub Repository**
   - Select: `Tharuniga60/deforestation_trend_monitoring`
   - Vercel asks for import settings

3. **Configure Vercel Project**
   - Framework: "Other" (static)
   - Root Directory: `./frontend`
   - Build Command: Leave empty (static files)
   - Output Directory: `.`
   - Install Command: Leave empty

4. **Environment Variables** (Optional)
   - Key: `VITE_API_URL`
   - Value: `https://your-railway-domain.railway.app/api`
   - (Frontend auto-detects localhost vs production)

5. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Vercel assigns domain: `https://deforest-watch.vercel.app`

6. **Verify Frontend**
   - Visit: `https://your-vercel-domain.vercel.app`
   - Should see: DeforestWatch dashboard
   - Check browser console for any errors

---

## Phase 4: End-to-End Testing

### Test Checklist

1. **Backend Health**
   ```
   GET https://your-railway-domain.railway.app/
   Expected: {"message": "DeforestWatch API running"}
   ```

2. **Frontend Loads**
   - Visit frontend URL in browser
   - Check Network tab - no 404 errors

3. **API Calls Work**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Navigate dashboard, apply filters
   - All API calls should return 200 OK

4. **Specific Features**
   - KPI cards populate with data
   - Map renders with hotspot markers
   - Charts display (trend, hotspot, heatmap)
   - Region filter works
   - Year range filter works
   - Report generates data

---

## Initial Testing Checklist

- [ ] Backend returns "DeforestWatch API running"
- [ ] Frontend loads without errors
- [ ] Map displays with markers
- [ ] KPI cards show data
- [ ] Filters work (region, year)
- [ ] Charts render
- [ ] Report section populates
- [ ] No console errors
- [ ] Mobile responsive (test on phone)

---

## Troubleshooting

### Backend Issues

**Problem**: 500 error on API calls
- Check Railway logs: Railway dashboard → Logs tab
- Verify requirements.txt installed all packages
- Ensure PORT environment variable is set

**Problem**: CORS errors
- Backend has CORS enabled by default
- Vercel frontend should connect properly
- Check if backend URL is correct in frontend

**Problem**: Data not loading
- Verify sample_forest_data.csv exists in backend/data/
- Check backend/data/generate_data.py ran successfully

### Frontend Issues

**Problem**: Blank page
- Check browser console (F12) for errors
- Verify index.html loads
- Check Network tab for 404s

**Problem**: API calls failing
- Open browser console
- Check if API_BASE URL is correct
- Verify backend is running and accessible
- Check CORS headers

**Problem**: Charts not showing
- Verify Chart.js loads from CDN
- Check browser console for CDN load errors
- Verify backend returns image data as base64

### Common Fixes

1. **Update API URL after Railway deployment:**
   ```javascript
   // In frontend/js/api.js
   return window.DEFOREST_API_URL || "https://YOUR-NEW-RAILWAY-URL.railway.app/api";
   ```

2. **After updating frontend, push to GitHub:**
   ```bash
   git add frontend/js/api.js
   git commit -m "Update production API URL"
   git push origin master
   ```

3. **Redeploy on Vercel:**
   - Vercel auto-redeploys on GitHub push
   - Or click "Redeploy" in Vercel dashboard

---

## Production URLs After Deployment

- **Backend API**: `https://your-railway-domain.railway.app`
- **API Docs**: `https://your-railway-domain.railway.app/docs`
- **Frontend**: `https://your-vercel-domain.vercel.app`

---

## Monitoring & Maintenance

### Railway (Backend)
- Monitor usage in Railway dashboard
- Check logs for errors: Logs tab
- Free tier sufficient for this project

### Vercel (Frontend)
- Monitor deployment history
- Check analytics dashboard
- Automatic HTTPS provided

---

## Cost Breakdown

- **Railway**: FREE tier (sufficient for demo project)
- **Vercel**: FREE tier (sufficient for static frontend)
- **Total Cost**: $0 USD

---

## Next Steps

1. Deploy backend to Railway ✅
2. Get Railway domain
3. Update frontend API URL ✅
4. Deploy frontend to Vercel ✅
5. Test end-to-end ✅
6. Monitor production logs

---

**Last Updated**: 2026-04-16
**Status**: Ready for Production Deployment
