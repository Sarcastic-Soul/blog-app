# Appwrite Database Setup Guide

This guide will help you set up your Appwrite backend for the blog application.

## Prerequisites

1. **Appwrite Account**: Sign up at [cloud.appwrite.io](https://cloud.appwrite.io)
2. **Node.js**: Ensure you have Node.js installed

## Step-by-Step Setup

### 1. Create Appwrite Project

1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Click "Create Project"
3. Enter project name: "Blog Page"
4. Note down your **Project ID**

### 2. Generate API Key

1. In your project dashboard, go to "Settings" → "View API Keys"
2. Click "Create API Key"
3. Name: "Server Setup Key"
4. Scopes: Select all under Database, Teams, and Users
5. Copy the generated **API Key**

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update your `.env` file:
   ```bash
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your-project-id-here
   VITE_APPWRITE_PROJECT_NAME=Blog Page
   VITE_APPWRITE_DATABASE_ID=blog-database
   VITE_APPWRITE_COLLECTION_ID=blogs
   VITE_APPWRITE_ADMIN_TEAM_ID=admin-team
   
   # Server-side API key (for setup script only)
   APPWRITE_API_KEY=your-api-key-here
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Database Setup Script

```bash
npm run setup:appwrite
```

This script will:
- Create the database
- Create collections (blogs, comments)
- Set up attributes and indexes
- Create admin team
- Configure permissions

### 6. Configure Authentication (Optional)

If you want Google OAuth login:

1. Go to "Auth" → "Settings" in Appwrite Console
2. Add your domain to "Hostnames": `http://localhost:3000`
3. Enable Google OAuth:
   - Go to "Auth" → "OAuth2"
   - Enable Google
   - Add your Google OAuth credentials

### 7. Add Yourself to Admin Team

1. Go to "Auth" → "Teams" in Appwrite Console
2. Find the "Blog Administrators" team
3. Add your user to this team

### 8. Set Collection Permissions

The setup script configures these permissions automatically:

**Blogs Collection:**
- `read("any")` - Anyone can read published blogs
- `create("users")` - Authenticated users can create blogs
- `update("user:[USER_ID]")` - Authors can edit their own blogs
- `delete("user:[USER_ID]")` - Authors can delete their own blogs
- `update("team:admin-team")` - Admins can edit any blog
- `delete("team:admin-team")` - Admins can delete any blog

## Database Schema

### Blogs Collection

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| title | String(255) | Yes | Blog title |
| slug | String(255) | Yes | URL-friendly slug (unique) |
| excerpt | String(500) | Yes | Short description |
| content | String(16MB) | Yes | Full blog content |
| headerImage | String(2048) | No | Header image URL |
| tags | String[](50) | No | Array of tags |
| isPublished | Boolean | Yes | Publication status |
| publishDate | DateTime | No | Publication date |
| lastModified | DateTime | Yes | Last modified date |
| authorId | String(36) | Yes | Author user ID |
| authorName | String(100) | Yes | Author display name |
| readTime | Integer | No | Estimated reading time |
| views | Integer | No | View count |
| likes | Integer | No | Like count |

### Comments Collection

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| blogId | String(36) | Yes | Reference to blog |
| content | String(1000) | Yes | Comment content |
| authorId | String(36) | Yes | Author user ID |
| authorName | String(100) | Yes | Author display name |
| isApproved | Boolean | Yes | Moderation status |
| createdAt | DateTime | Yes | Creation date |

## Testing the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:3000`

3. The app should now load blogs from Appwrite (may show empty if no blogs exist yet)

4. If you're an admin, you can create new blog posts

## Troubleshooting

### "Database not found" Error
- Ensure the setup script ran successfully
- Check that your environment variables are correct

### "Permission denied" Errors
- Verify you're added to the admin team
- Check collection permissions in Appwrite Console

### "Failed to fetch" Errors
- Verify your project ID and endpoint are correct
- Check network connectivity
- Ensure CORS is properly configured

### Can't Create Blogs
- Ensure you're logged in
- Check that you have the correct permissions
- Verify the admin team ID is correct

## Next Steps

1. **Create Sample Content**: Use the admin interface to create some blog posts
2. **Customize Schema**: Modify the schema in `src/lib/schema.js` if needed
3. **Set up File Storage**: Configure Appwrite Storage for image uploads
4. **Configure Webhooks**: Set up real-time updates and notifications

## API Usage Examples

The app uses the `BlogService` class for all database operations:

```javascript
import { BlogService } from './lib/blogService';

// Get published blogs
const blogs = await BlogService.getPublishedBlogs();

// Search blogs
const results = await BlogService.searchBlogs('javascript');

// Create new blog (admin only)
const newBlog = await BlogService.createBlog({
  title: 'My First Blog',
  excerpt: 'This is a great blog post',
  content: '# Hello World\n\nThis is my first blog post!',
  tags: ['javascript', 'web-dev'],
  isPublished: true
}, userId, userName);
```

## Security Notes

1. **API Keys**: Never expose server API keys in frontend code
2. **Permissions**: Always use least-privilege principle
3. **Validation**: Validate all user inputs before saving
4. **Rate Limiting**: Consider implementing rate limiting for blog creation

Happy blogging! 🦆
