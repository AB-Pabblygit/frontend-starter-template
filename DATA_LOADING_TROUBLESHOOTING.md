# 🔧 Data Loading Troubleshooting Guide

If you're seeing "Failed to fetch" or "Loading..." messages, follow these steps to resolve the issue.

## 🚨 **Quick Fix - Start Backend Server**

The most common issue is that the backend server is not running. Here's how to fix it:

### **Option 1: Use the Startup Script**
```bash
npm run start:backend
```

### **Option 2: Manual Backend Start**
```bash
# Terminal 1 - Backend
cd backend
npm install
cp env.example .env
npm run dev
```

### **Option 3: Check if Backend is Running**
```bash
# Test backend health
curl http://localhost:5000/health
```

## 🔍 **Diagnostic Steps**

### **1. Check Backend Status**
Open browser console (F12) and look for these messages:
- ✅ `Backend Health: { available: true }` - Backend is running
- ❌ `Backend Health: { available: false }` - Backend is not running

### **2. Check API Authentication**
The API requires an API key. Make sure your `.env.local` file contains:
```env
VITE_API_KEY=your-api-key-for-authentication
```

### **3. Check Environment Variables**
Verify your `env.local` file has:
```env
VITE_API_URL=http://localhost:5000/api/analytics
VITE_BACKEND_URL=http://localhost:5000
VITE_API_KEY=your-api-key-for-authentication
```

## 🛠️ **Common Issues & Solutions**

### **Issue 1: "Failed to fetch" Error**
**Cause**: Backend server is not running
**Solution**: 
```bash
cd backend
npm run dev
```

### **Issue 2: "401 Unauthorized" Error**
**Cause**: Missing or incorrect API key
**Solution**: 
1. Check `env.local` has correct `VITE_API_KEY`
2. Restart frontend after changing environment variables

### **Issue 3: "CORS Error"**
**Cause**: Frontend and backend ports don't match
**Solution**: 
1. Backend should run on port 5000
2. Frontend should run on port 3031
3. Check CORS configuration in `backend/server.js`

### **Issue 4: "MongoDB Connection Error"**
**Cause**: MongoDB is not running (optional for development)
**Solution**: 
1. Install MongoDB locally, OR
2. Use mock data (already implemented as fallback)

## 🎯 **Fallback System**

The application now has a smart fallback system:

1. **First**: Tries to connect to backend API
2. **If Backend Fails**: Automatically uses mock data
3. **Result**: You'll see data either way!

## 📊 **Expected Behavior**

### **With Backend Running:**
- ✅ Real-time data from database
- ✅ Full API functionality
- ✅ Authentication working

### **Without Backend (Fallback):**
- ✅ Mock data displayed
- ✅ All features working
- ⚠️ Console warning about using mock data

## 🚀 **Quick Start Commands**

```bash
# 1. Install dependencies
npm install
cd backend && npm install

# 2. Set up environment
cp backend/env.example backend/.env

# 3. Start backend (Terminal 1)
cd backend
npm run dev

# 4. Start frontend (Terminal 2)
npm run dev
```

## 🔧 **Advanced Troubleshooting**

### **Check Backend Logs**
Look for these messages in backend console:
- ✅ `🚀 Server running on port 5000`
- ✅ `✅ Connected to MongoDB`
- ❌ `❌ MongoDB connection error`

### **Check Frontend Network Tab**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Look for failed requests to `localhost:5000`
4. Check request headers for API key

### **Test API Manually**
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test analytics endpoint (with API key)
curl -H "x-api-key: your-api-key-for-authentication" \
     http://localhost:5000/api/analytics/health
```

## 📞 **Still Having Issues?**

1. **Check Console Logs**: Look for specific error messages
2. **Verify Ports**: Backend on 5000, Frontend on 3031
3. **Check Dependencies**: Run `npm install` in both directories
4. **Restart Everything**: Stop all processes and restart

## 🎉 **Success Indicators**

You'll know it's working when you see:
- ✅ Analytics data loading
- ✅ Charts displaying
- ✅ Customer table populated
- ✅ No error messages

The application is designed to work with or without the backend, so you should see data either way!
