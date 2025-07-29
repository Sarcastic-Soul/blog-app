# Ink and Irony 🖋️

A modern blog platform built with React, Vite, and Appwrite. Where thoughts flow like ink and wisdom meets irony.

**Live Demo**: [https://blog-app-amber-five-52.vercel.app](https://blog-app-amber-five-52.vercel.app)

## ✨ Features

- **Rich Text Editor** - TipTap with Markdown support
- **Google OAuth** - Authentication via Appwrite
- **Admin Dashboard** - Content management and analytics
- **Dark/Light Mode** - Responsive design
- **Search & Tags** - Content organization

## 🚀 Tech Stack

React 19 • Vite 6 • Tailwind CSS 4 • Appwrite • TipTap • React Router

## 🛠️ Quick Setup

```bash
# Clone and install
git clone https://github.com/Sarcastic-Soul/blog-app.git
cd blog-app
npm install

# Configure environment
cp .env.example .env
# Update .env with your Appwrite credentials

# Setup backend and start
npm run setup:appwrite
npm run dev
```

## 📋 Environment Variables

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=blog-database
VITE_APPWRITE_COLLECTION_ID=blogs
VITE_APPWRITE_ADMIN_TEAM_ID=admin-team
APPWRITE_API_KEY=your-api-key
```

## 🚀 Deployment

Deploy to Vercel/Netlify and update OAuth redirect URIs in:
- **Google Cloud Console**: Add `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/[PROJECT_ID]`
- **Appwrite Console**: Add your domain to hostnames and OAuth success/failure URLs

## ⚠️ Known Issues

- **Firefox OAuth**: Third-party cookie restrictions may cause authentication issues in development. Works fine in production.

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

---

Made with ❤️ by [Anish Kumar](https://github.com/Sarcastic-Soul)
