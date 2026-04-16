# DeforestWatch - Production Deployment Quick Start

## Timeline: ~15 minutes total
- Railway backend deployment: ~5 minutes after clicking Deploy
- Vercel frontend deployment: ~2 minutes after clicking Deploy
- Setup & configuration: ~5 minutes

## ⚡ Super Quick Summary (TL;DR)

### Step 1: Deploy Backend to Railway (5 min)
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project from `deforestation_trend_monitoring` repo
4. Wait for deployment → Get URL like `https://deforest-watch-api-xyz.railway.app`
5. ✅ Verify: Open URL in browser → should see API health message

### Step 2: Deploy Frontend to Vercel (2 min)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import `deforestation_trend_monitoring` repo
4. Set Root Directory to `./frontend`
5. Click Deploy → Wait for completion → Get URL like `https://deforest-watch-xyz.vercel.app`
6. ✅ Verify: Open URL in browser → should see dashboard

### Step 3: Test End-to-End (1 min)
1. Open frontend URL
2. Click region filter → should load data
3. Map should render with markers
4. Charts should display
5. ✅ All working!

---

## 📋 Pre-Deployment Checklist

- [ ] GitHub account (free)
- [ ] Railway account (free) → https://railway.app
- [ ] Vercel account (free) → https://vercel.com
- [ ] Repository pushed to GitHub
- [ ] All 3 commits visible in GitHub

---

## 🚀 Detailed Deployment Process

### Phase 1: Railway Backend (Most Important)

**See**: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

**Quick steps:**
```
1. railway.app → Sign up with GitHub
2. New Project → Deploy from GitHub
3. Select deforestation_trend_monitoring
4. Click Deploy
5. Wait 3-5 min → Get domain URL
6. Save URL: https://deforest-watch-api-[random].railway.app
```

**Verify success:**
```
Open in browser: https://deforest-watch-api-[random].railway.app/
Should return: {"message": "DeforestWatch API running"}
```

### Phase 2: Vercel Frontend

**See**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

**Quick steps:**
```
1. vercel.com → Sign up with GitHub
2. Add New Project → Import Git Repository
3. Select deforestation_trend_monitoring
4. Root Directory: ./frontend
5. Click Deploy
6. Wait 1-2 min → Get domain URL
7. Save URL: https://deforest-watch-[random].vercel.app
```

**Verify success:**
```
Open in browser: https://deforest-watch-[random].vercel.app
Should show: DeforestWatch dashboard with map and KPIs
```

### Phase 3: End-to-End Testing

Open frontend URL and test:
- [ ] Page loads → Title visible
- [ ] Map renders → CartoDB tiles visible
- [ ] KPI cards show numbers
- [ ] Apply filter → Data updates
- [ ] Multiple charts visible
- [ ] No console errors (F12)

---

## 🔑 Important URLs

After deployment, you'll have:

```
Frontend:  https://deforest-watch-[your-id].vercel.app
Backend:   https://deforest-watch-api-[your-id].railway.app
API Docs:  https://deforest-watch-api-[your-id].railway.app/docs
GitHub:    https://github.com/Tharuniga60/deforestation_trend_monitoring
```

---

## ⚙️ How It Works

### Backend (Railway)
- Runs Python FastAPI server
- Automatically starts when deployed
- Procfile tells Railway how to run it
- Port automatically assigned
- Data cached for performance

### Frontend (Vercel)
- Static HTML/CSS/JavaScript files
- Automatically detects production
- Connects to Railway backend
- No build process needed
- CDN automatically distributed

### Auto URL Detection
Frontend automatically:
- **On localhost**: Uses `http://localhost:8000`
- **On Vercel**: Uses Railway backend URL
- **No configuration needed!**

---

## 🐛 If Something Goes Wrong

### Backend Error (API not responding)
1. Check Railway logs: Railroad dashboard → Logs tab
2. Verify Procfile has `$PORT` variable
3. Verify requirements.txt has all packages
4. Check sample_forest_data.csv exists

### Frontend Error (Blank page)
1. Open browser console: F12
2. Check Network tab for 404 errors
3. Verify index.html in frontend/ directory
4. Check if CSS and JS files load

### API Connection Error (Frontend can't reach backend)
1. Verify Railway backend URL is correct
2. Test backend directly in browser
3. Check browser Network tab
4. Try refreshing page (F5)

### CORS Issue
Already handled! Backend allows all origins by default.

---

## 📊 What Gets Deployed

### Backend (Railway)
```
✅ Python FastAPI app
✅ All services (analysis, trends, charts)
✅ Data CSV (700 rows)
✅ API endpoints (9 total)
```

### Frontend (Vercel)
```
✅ index.html (dashboard)
✅ CSS styling (dark theme)
✅ JavaScript (interactive maps, charts)
✅ All static assets
```

---

## 💰 Costs

| Service | Free Tier | Cost |
|---------|-----------|------|
| Railway | 500 CPU hours/month | ✅ FREE |
| Vercel | Unlimited deployments | ✅ FREE |
| GitHub | Public repos | ✅ FREE |
| **Total** | **Sufficient for demo** | **$0 USD** |

---

## 📞 Support Resources

If stuck, check:
1. **Railway Docs**: https://docs.railway.app
2. **Vercel Docs**: https://vercel.com/docs
3. **Project DEPLOYMENT.md**: Full troubleshooting
4. **RAILWAY_DEPLOYMENT.md**: Backend-specific help
5. **VERCEL_DEPLOYMENT.md**: Frontend-specific help

---

## ✅ Success Criteria

When everything is working:

1. ✅ Frontend loads at Vercel URL
2. ✅ Map displays with markers
3. ✅ KPI cards show data
4. ✅ Filters work (region, year)
5. ✅ Charts render
6. ✅ No console errors
7. ✅ Mobile responsive
8. ✅ API accessible at `/docs`

---

## 📝 Next Steps

After deployment:
1. Share frontend Vercel URL with users
2. Monitor Railway logs for errors
3. Test on different devices/browsers
4. Share API docs URL with developers
5. Celebrate! 🎉

---

**Ready to deploy?**
→ Start with [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

**Status**: All deployment files ready
**Last Updated**: 2026-04-16
**Time to Deploy**: ~15 minutes

