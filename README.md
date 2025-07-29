# 🦆 Ink & Irony Blog

A satirical blog platform built with React and Appwrite, where rubber ducks meet reality and code meets comedy.

## ✨ Features

### 🎯 Core Features
- **Modern Blog Platform**: Full-featured blog with rich text editing
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Mobile-first design that works on all devices
- **Rich Text Editor**: TipTap-powered editor with markdown support, syntax highlighting, and media uploads
- **User Authentication**: Google OAuth integration via Appwrite
- **Admin Panel**: Protected routes for content management
- **Search & Filter**: Advanced filtering by tags, content, and publication status
- **Blog Statistics**: Detailed analytics for blog posts (views, engagement, etc.)

### �️ Admin Features
- **Create & Edit Posts**: Rich WYSIWYG editor with preview mode
- **Draft Management**: Save drafts and publish when ready
- **Media Management**: Image uploads and management
- **Analytics Dashboard**: View detailed statistics for each post
- **User Management**: Role-based access control with Appwrite Teams

### 🎨 UI/UX Features
- **Framer Motion Animations**: Smooth page transitions and micro-interactions
- **Grid/List View Toggle**: Multiple ways to browse content
- **Advanced Search**: Real-time search with multiple filters
- **Tag System**: Organize content with categorization
- **Reading Time Estimates**: Automatic calculation of read times
- **Engagement Metrics**: Mock analytics for demonstration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Appwrite account and project

### 1. Clone the Repository
```bash
git clone https://github.com/appwrite/starter-for-react
cd starter-for-react
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Appwrite

1. **Create Appwrite Project**: Go to [cloud.appwrite.io](https://cloud.appwrite.io) and create a new project

2. **Set up Environment Variables**: Copy `.env.example` to `.env` and update with your Appwrite details:
   ```bash
   cp .env.example .env
   ```

3. **Configure Environment Variables**:
   ```env
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your-project-id
   VITE_APPWRITE_DATABASE_ID=blog-database
   VITE_APPWRITE_COLLECTION_ID=blogs
   VITE_APPWRITE_ADMIN_TEAM_ID=admin-team
   APPWRITE_API_KEY=your-server-api-key
   ```

4. **Run Database Setup**: This will automatically create the database schema:
   ```bash
   npm run setup:appwrite
   ```

5. **Join Admin Team**: In your Appwrite console, add yourself to the "Blog Administrators" team

For detailed setup instructions, see [APPWRITE_SETUP.md](./APPWRITE_SETUP.md)

Create a `.env` file in the root directory:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_ADMIN_TEAM_ID=your_admin_team_id
```

### 4. Set Up Appwrite Backend

#### Database Schema
Create a collection with the following attributes:
- `title` (String, required)
- `excerpt` (String, required) 
- `content` (String, required) - Stores TipTap JSON
- `headerImage` (String, optional)
- `tags` (String Array, optional)
- `createdAt` (DateTime, required)
- `updatedAt` (DateTime, required)
- `isPublished` (Boolean, required)

#### Authentication
- Enable Google OAuth provider in Appwrite Console
- Set up success/failure redirect URLs

#### Teams & Permissions
- Create an Admin team for content management
- Configure read permissions for public
- Configure write permissions for Admin team

### 5. Run the Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app in action!

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BlogCard.jsx    # Blog post preview cards
│   ├── BlogContentEditor.jsx  # Rich text editor
│   ├── BlogMetaForm.jsx       # Blog metadata form
│   ├── Header.jsx             # Navigation header
│   └── MarkdownEditor.jsx     # Alternative markdown editor
├── context/            # React Context providers
│   └── AuthContext.jsx       # Authentication state
├── data/              # Static data and mock content
│   └── blogs.js              # Sample blog posts
├── lib/               # Configuration and utilities
│   ├── appwrite.js           # Appwrite client setup
│   └── config.js             # App configuration
├── pages/             # Main application pages
│   ├── AboutPage.jsx         # About the author page
│   ├── BlogPostPage.jsx      # Individual blog post view
│   ├── BlogsPage.jsx         # Blog listing with filters
│   ├── CreateBlogPage.jsx    # Create new blog post
│   ├── EditBlog.jsx          # Edit existing blog post
│   ├── HomePage.jsx          # Landing page
│   ├── LoginPage.jsx         # Authentication page
│   └── StatsPage.jsx         # Blog analytics dashboard
├── routes/            # Route protection
│   └── AdminRoute.jsx        # Protected admin routes
├── index.css          # Global styles and utilities
└── main.jsx           # Application entry point
```

## 🎨 Design System

### Color Palette
- **Primary**: Yellow (#FEF08A) - Duck-inspired branding
- **Secondary**: Orange (#F59E0B) - Complementary accent
- **Success**: Green (#10B981) - Positive actions
- **Warning**: Orange (#F59E0B) - Attention states
- **Error**: Red (#EF4444) - Error states
- **Gray Scale**: Tailwind's gray palette for text and backgrounds

### Typography
- **Font Family**: Inter - Clean, readable sans-serif
- **Headings**: Bold weights with yellow accent color
- **Body**: Regular weight with high contrast ratios
- **Code**: Monaco/Menlo monospace fonts

### Components
- **Cards**: Clean cards with subtle shadows and hover effects
- **Buttons**: Rounded buttons with distinct states
- **Forms**: Consistent styling with focus states
- **Navigation**: Sticky header with mobile-responsive menu

## 🧪 Sample Content

The app comes with sample blog posts covering:
- **Programming Humor**: Satirical takes on developer life
- **Tech Commentary**: Opinions on frameworks, tools, and trends
- **Tutorial Content**: Technical guides with a humorous twist
- **Industry Observations**: Commentary on software development culture

## � Customization

### Adding New Features
1. **New Pages**: Add to `src/pages/` and update routing in `main.jsx`
2. **Components**: Create reusable components in `src/components/`
3. **Styling**: Extend Tailwind classes in `index.css`
4. **API Integration**: Extend Appwrite functions in `src/lib/appwrite.js`

### Theming
The app supports extensive theming through:
- CSS custom properties for colors
- Tailwind's dark mode utilities
- Consistent component styling patterns

### Content Management
- Rich text editor supports: headings, lists, quotes, code blocks, links, images
- Drag-and-drop image uploads (when configured with Appwrite Storage)
- Real-time preview mode
- Auto-save functionality for drafts

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options
- **Vercel**: Zero-config deployment with automatic builds
- **Netlify**: Simple drag-and-drop or Git integration
- **Appwrite Functions**: Server-side rendering options
- **Traditional Hosting**: Any static hosting service

### Environment Variables
Ensure all environment variables are configured in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Appwrite** - Backend-as-a-Service platform
- **TipTap** - Rich text editor framework
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon set
- **React Router** - Client-side routing

## 🦆 About the Duck Theme

Why ducks? Because like developers, ducks appear calm on the surface but paddle frantically underneath. Plus, rubber duck debugging is a real and valuable technique in software development. This blog celebrates the chaos, humor, and humanity in our technical world.

---

*"In code we trust, in ducks we debug."* - The Chaotic Duck