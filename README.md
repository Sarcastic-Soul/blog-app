# Ink and Irony 🖋️

A modern, elegant blog platform built with React, Vite, and Appwrite. Where thoughts flow like ink and wisdom meets irony.

![Ink and Irony](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Ink+and+Irony)

## ✨ Features

- **Modern Design** - Clean, responsive interface built with Tailwind CSS
- **Rich Text Editor** - Powered by TipTap with Markdown support
- **User Authentication** - Google OAuth integration via Appwrite
- **Content Management** - Create, edit, and publish blog posts
- **Admin Dashboard** - Manage posts and view analytics
- **Tag System** - Organize content with tags and categories
- **Search Functionality** - Find posts quickly and easily
- **Dark/Light Mode** - Toggle between themes
- **Mobile Responsive** - Optimized for all devices

## 🚀 Tech Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS 4
- **Backend**: Appwrite (Database, Auth, Storage)
- **Editor**: TipTap with syntax highlighting
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- Appwrite Cloud account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ink-and-irony-blog.git
cd ink-and-irony-blog
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```

Update `.env` with your Appwrite credentials:
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=blog-database
VITE_APPWRITE_COLLECTION_ID=blogs
VITE_APPWRITE_ADMIN_TEAM_ID=admin-team
APPWRITE_API_KEY=your-api-key
```

### 3. Set Up Appwrite Backend
```bash
npm run setup:appwrite
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your blog!

## 📖 Usage

### For Writers
1. **Sign in** with your Google account
2. **Create posts** using the rich text editor
3. **Add tags** to organize your content
4. **Publish** when ready or save as draft

### For Admins
1. **Manage all posts** including drafts
2. **View analytics** and post statistics
3. **Moderate content** and user submissions

## 🎨 Customization

### Branding
- Update colors in `tailwind.config.js`
- Replace logo and favicon in `/public`
- Modify site name in `index.html`

### Content
- Edit homepage content in `src/pages/HomePage.jsx`
- Customize about page in `src/pages/AboutPage.jsx`
- Modify navigation in `src/components/Header.jsx`

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Update OAuth redirect URIs to include your domain
4. Deploy!

### Other Platforms
- **Netlify**: Works out of the box
- **Railway**: Add build command `npm run build`
- **Heroku**: Configure buildpacks for Node.js

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Appwrite](https://appwrite.io) for backend services
- Inspired by modern blogging platforms
- Typography and design principles from various design systems

## 📞 Contact

Anish Kumar - [@your-twitter](https://twitter.com/your-twitter) - anish23101@iiitnr.edu.in

Project Link: [https://github.com/yourusername/ink-and-irony-blog](https://github.com/yourusername/ink-and-irony-blog)

---

Made with ❤️ and ☕ by [Anish Kumar](https://github.com/yourusername)
