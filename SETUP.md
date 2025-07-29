# 🦆 Ink & Irony Blog - Setup Guide

## Quick Setup

### 1. Environment Configuration

Copy `.env.example` to `.env` and update with your Appwrite credentials:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=your_database_id_here
VITE_APPWRITE_COLLECTION_ID=your_collection_id_here
VITE_APPWRITE_ADMIN_TEAM_ID=your_admin_team_id_here
```

### 2. Appwrite Backend Setup

#### Create a Project
1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Create a new project
3. Copy the Project ID

#### Set up Authentication
1. Go to Authentication → Settings
2. Add your domain: `http://localhost:3000` (for development)
3. Enable Google OAuth:
   - Go to Authentication → Settings → OAuth2 Providers
   - Enable Google
   - Add your Google OAuth credentials

#### Create Database & Collection
1. Go to Databases → Create Database
2. Create a Collection with these attributes:
   - `title` (String, Required, 256 chars)
   - `excerpt` (String, Required, 512 chars)
   - `content` (String, Required, 65536 chars)
   - `headerImage` (String, Optional, 512 chars)
   - `tags` (String Array, Optional)
   - `createdAt` (DateTime, Required)
   - `updatedAt` (DateTime, Required)
   - `isPublished` (Boolean, Required, Default: false)

#### Set up Permissions
1. Collection Permissions:
   - Read: `any` (allows public reading)
   - Create: `users` (authenticated users can create)
   - Update: `users` (authors can update their posts)
   - Delete: `users` (authors can delete their posts)

#### Create Admin Team
1. Go to Authentication → Teams
2. Create a team called "Admins"
3. Copy the Team ID for your `.env` file
4. Add users to this team who should have admin access

### 3. Run the Application

```bash
npm install
npm run dev
```

## Troubleshooting

### 401 Errors
If you see 401 errors in the console:
1. Check your Appwrite endpoint and project ID
2. Verify your domain is added to the allowed origins
3. Ensure collection permissions allow public reading
4. The app will fall back to static content if Appwrite isn't configured

### Authentication Issues
1. Verify Google OAuth is configured correctly
2. Check redirect URLs match your domain
3. Ensure success URL is set to `/blogs`
4. Failure URL should be set to `/login`

### No Admin Access
1. Verify you're added to the Admin team
2. Check the `VITE_APPWRITE_ADMIN_TEAM_ID` matches your team ID
3. Try logging out and back in

## Features Without Appwrite

The blog works with static content even without Appwrite:
- ✅ View blog posts (static content)
- ✅ Browse and search functionality  
- ✅ Responsive design and dark mode
- ❌ User authentication
- ❌ Create/edit posts
- ❌ Admin features
- ❌ Dynamic content

This makes it perfect for testing the UI and then connecting to Appwrite later!
