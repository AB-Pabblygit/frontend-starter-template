# Troubleshooting Guide

This guide addresses common issues and warnings you might encounter when running the analytics dashboard.

## 🚨 Current Warnings (Non-Critical)

### 1. React DevTools Warning
```
Download the React DevTools for a better development experience
```
**Solution**: Install React DevTools browser extension for better debugging.

### 2. MUI Component Warnings
These are common MUI warnings that don't affect functionality:

#### `bgColor` prop warning
```
Warning: React does not recognize the `bgColor` prop on a DOM element
```
**Status**: Non-critical - This is from existing MUI components in the template.

#### `nodeId` prop warnings
```
Warning: Failed prop type: The prop `nodeId` is marked as required in `TreeItemContent`
```
**Status**: Non-critical - This is from the folder component in the template.

#### `onItemSelect` warning
```
Warning: Unknown event handler property `onItemSelect`
```
**Status**: Non-critical - This is from the tree view component.

#### `hover` attribute warning
```
Warning: Received `true` for a non-boolean attribute `hover`
```
**Status**: Non-critical - This is from table components.

#### Tooltip with disabled button
```
MUI: You are providing a disabled `button` child to the Tooltip component
```
**Status**: Non-critical - This is from existing components.

## ✅ Fixed Issues

### 1. Environment Variables (CRITICAL - FIXED)
**Problem**: `process is not defined` error
```
Uncaught ReferenceError: process is not defined
```

**Solution**: ✅ FIXED
- Updated `src/services/analyticsApi.js` to use `import.meta.env.VITE_API_URL`
- Created `.env.local` file with Vite environment variables
- Updated integration guide for Vite format

## 🔧 Environment Setup

### Frontend Environment Variables
Create `.env.local` file in your frontend root:
```env
# Frontend Environment Variables (Vite format)
VITE_API_URL=http://localhost:5000/api/analytics
VITE_BACKEND_URL=http://localhost:5000
```

### Backend Environment Variables
Create `.env` file in your backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/analytics_db

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
```

## 🚀 Quick Start (Fixed)

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Generate Test Data
```bash
curl -X POST "http://localhost:5000/api/analytics/simulate" \
  -H "Content-Type: application/json" \
  -d '{"months": 6, "usersPerPlan": 50}'
```

### 3. Start Frontend
```bash
npm start
```

## 🔍 Testing the Integration

### 1. Test Backend Connection
```bash
curl "http://localhost:5000/health"
```

### 2. Test Analytics API
```bash
curl "http://localhost:5000/api/analytics/summary"
```

### 3. Test Frontend
- Open `http://localhost:3000`
- Navigate to analytics page
- Verify data loads without errors

## 🐛 Common Issues & Solutions

### Issue 1: CORS Errors
**Symptoms**: Frontend can't connect to backend
**Solution**: 
- Ensure backend is running on port 5000
- Check CORS configuration in backend/server.js

### Issue 2: Environment Variables Not Working
**Symptoms**: API calls fail with wrong URLs
**Solution**:
- Verify `.env.local` file exists in frontend root
- Restart the development server after creating env file
- Check that variables start with `VITE_`

### Issue 3: No Data Displayed
**Symptoms**: Analytics page shows empty or loading forever
**Solution**:
- Generate test data using the simulate endpoint
- Check browser network tab for failed requests
- Verify MongoDB is running and connected

### Issue 4: Performance Issues
**Symptoms**: Slow loading or timeouts
**Solution**:
- Enable Redis caching in backend
- Check database indexes
- Monitor API response times

## 📊 Expected Behavior

After fixing the environment variables, you should see:

✅ **No Critical Errors**: The `process is not defined` error should be gone
✅ **Analytics Dashboard**: Real data from backend API
✅ **Interactive Filters**: Month, product, plan filtering works
✅ **Charts and Tables**: Display real metrics and trends
✅ **Loading States**: Smooth user experience
✅ **Error Handling**: Graceful error messages

## 🎯 Success Indicators

- ✅ Backend server running on port 5000
- ✅ Frontend connecting to backend API
- ✅ Analytics dashboard displaying real data
- ✅ No critical console errors
- ✅ Filters working correctly
- ✅ Charts showing trends
- ✅ Customer table with real data

## 🚨 If You Still See Issues

### 1. Clear Browser Cache
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Try incognito mode

### 2. Restart Development Servers
```bash
# Stop both servers (Ctrl+C)
# Restart backend
cd backend && npm run dev

# Restart frontend (in new terminal)
npm start
```

### 3. Check Network Tab
- Open browser DevTools
- Go to Network tab
- Check for failed API requests
- Look for 404 or CORS errors

### 4. Verify Environment Variables
```bash
# Check if .env.local exists
ls -la .env.local

# Check content
cat .env.local
```

## 📞 Getting Help

If you're still experiencing issues:

1. **Check the console**: Look for specific error messages
2. **Check network tab**: Verify API requests are being made
3. **Check backend logs**: Look for server-side errors
4. **Verify data**: Ensure test data was generated successfully

The integration should now work properly with the environment variables fixed!
