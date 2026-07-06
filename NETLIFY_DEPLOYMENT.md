# HNOSS Portal - Complete Netlify Deployment Guide
# Official Portal for Global Governance, Finance & Sovereign Infrastructure

## 🚀 Quick Deployment

### 1. Prerequisites
- Node.js v20+ installed
- Netlify CLI installed (`npm install -g netlify-cli`)
- Git configured

### 2. One-Command Deploy
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy to Netlify (requires authentication)
netlify deploy --prod --dir=dist
```

## 📋 Manual Netlify Setup

### Option A: Git Integration (Recommended)
1. Push this repository to GitHub
2. Go to [Netlify Dashboard](https://app.netlify.com/)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

### Option B: Drag & Drop
1. Run `npm run build`
2. Drag the `dist` folder to Netlify dashboard

### Option C: Netlify CLI
```bash
# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

## 🛠️ Configuration Files

### netlify.toml (Auto-detected)
```toml
[build]
  command = "npm run build"
  publish = "dist"
  base = "/"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🔧 Environment Variables (Optional)

Set these in Netlify dashboard under Site Settings > Build & Deploy > Environment:

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API endpoint | No |
| VITE_GOOGLE_API_KEY | Google Generative AI key | No |

## 📊 Project Structure

```
/
├── src/                    # Source code (React + TypeScript)
│   ├── components/         # React components
│   ├── App.tsx             # Main application
│   └── index.css           # Global styles
├── public/                 # Static assets
│   ├── documents/          # Documentation files
│   └── finance-system/     # Finance system HTML docs
├── netlify.toml            # Netlify configuration
├── vite.config.ts          # Vite configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
```

## 🎯 Features Deployed

- ✅ Government Pledge Page (Pledge/Agenda)
- ✅ Papers Archive (Research Documentation)
- ✅ Finance System (SWF Capital Flows)
- ✅ Memorial Tribute (Verstorbene Key-Personen)
- ✅ Identity Portal (★ Original Portal)
- ✅ Governance Hierarchy Map
- ✅ Capital Flow Dashboard
- ✅ Real-time Audit Terminal
- ✅ Concil Portal Documentation

## 🔒 Security Headers

The portal includes built-in security features:
- EU-NATO CLASSIFIED-Pilot-2026 License
- HNOSS Control Operating System (HCOS)
- Cryptographic verification signatures
- Real-time blockchain audit trails

## 📞 Support

For deployment support or verification:
- Email: government-enterprise@ag-thrust.cloud
- Germany Contact: +49 1556 2233724

## 🌐 Post-Deployment Verification

After deployment, verify:
1. All navigation tabs work correctly
2. Rainbow Lightning Footer displays properly
3. Documents are accessible in `/documents/`
4. No console errors in browser dev tools

---
© 2024–2026 Daniel Pohl | HNOSS Corporation | EU-UNION / NATO / Pentagon / UN