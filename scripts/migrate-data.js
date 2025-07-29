#!/usr/bin/env node

/**
 * Data Migration Script
 * 
 * This script migrates the sample blog posts from the static data file
 * to your Appwrite database. Run this after setting up your database.
 * 
 * Usage: npm run migrate:data
 */

import dotenv from 'dotenv';
import { Client, Databases, Account } from 'node-appwrite';
import { blogPosts } from '../src/data/blogs.js';

// Load environment variables from .env file
dotenv.config();

const config = {
    endpoint: process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
    projectId: process.env.VITE_APPWRITE_PROJECT_ID,
    apiKey: process.env.APPWRITE_API_KEY,
    databaseId: process.env.VITE_APPWRITE_DATABASE_ID || 'blog-database',
    collectionId: process.env.VITE_APPWRITE_COLLECTION_ID || 'blogs'
};

if (!config.projectId || !config.apiKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   VITE_APPWRITE_PROJECT_ID');
    console.error('   APPWRITE_API_KEY');
    process.exit(1);
}

// Initialize Appwrite client with server key
const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey);

const databases = new Databases(client);

async function migrateBlogPosts() {
    console.log('🦆 Starting blog post migration...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const post of blogPosts) {
        try {
            console.log(`📝 Migrating: "${post.title}"`);

            // Transform static post to Appwrite format
            const blogData = {
                title: post.title,
                slug: post.slug || generateSlug(post.title),
                excerpt: post.excerpt,
                content: post.content,
                headerImage: post.headerImage || '',
                tags: post.tags || [],
                isPublished: post.isPublished !== false,
                publishDate: post.date || new Date().toISOString(),
                lastModified: new Date().toISOString(),
                authorId: 'admin', // Default admin user
                authorName: post.author || 'Admin',
                readTime: calculateReadTime(post.content),
                views: post.views || Math.floor(Math.random() * 100),
                likes: post.likes || Math.floor(Math.random() * 20)
            };

            const document = await databases.createDocument(
                config.databaseId,
                config.collectionId,
                post.id || `blog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                blogData
            );

            console.log(`   ✅ Migrated successfully (ID: ${document.$id})`);
            successCount++;

        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}`);
            errorCount++;
        }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📝 Total: ${blogPosts.length}`);

    if (successCount > 0) {
        console.log('\n🎉 Migration completed! Your blogs are now in Appwrite.');
        console.log('💡 You can now remove or comment out the static blog data in src/data/blogs.js');
    }
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

async function main() {
    try {
        await migrateBlogPosts();
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

main();
