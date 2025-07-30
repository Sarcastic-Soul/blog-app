import { databases, DATABASE_ID, COLLECTION_ID } from './appwrite';
import { ID, Query } from 'appwrite';

// Blog service for database operations
export class BlogService {

    // Get all published blogs with pagination
    static async getPublishedBlogs(limit = 25, offset = 0) {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    Query.equal('isPublished', true),
                    Query.orderDesc('publishDate'),
                    Query.limit(limit),
                    Query.offset(offset)
                ]
            );
            return {
                documents: response.documents,
                total: response.total
            };
        } catch (error) {
            console.error('Error fetching published blogs:', error);
            throw error;
        }
    }

    // Get all blogs (including drafts) - for admin
    static async getAllBlogs(limit = 25, offset = 0) {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    Query.orderDesc('lastModified'),
                    Query.limit(limit),
                    Query.offset(offset)
                ]
            );
            return {
                documents: response.documents,
                total: response.total
            };
        } catch (error) {
            console.error('Error fetching all blogs:', error);
            throw error;
        }
    }

    // Search blogs
    static async searchBlogs(searchTerm, isPublishedOnly = true) {
        try {
            const queries = [
                Query.search('search', searchTerm),
                Query.limit(50)
            ];

            if (isPublishedOnly) {
                queries.push(Query.equal('isPublished', true));
            }

            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                queries
            );
            return response.documents;
        } catch (error) {
            console.error('Error searching blogs:', error);
            throw error;
        }
    }

    // Filter blogs by tag
    static async getBlogsByTag(tag, isPublishedOnly = true) {
        try {
            const queries = [
                Query.equal('tags', tag),
                Query.orderDesc('publishDate'),
                Query.limit(50)
            ];

            if (isPublishedOnly) {
                queries.push(Query.equal('isPublished', true));
            }

            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                queries
            );
            return response.documents;
        } catch (error) {
            console.error('Error fetching blogs by tag:', error);
            throw error;
        }
    }

    // Get blog by slug
    static async getBlogBySlug(slug) {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.equal('slug', slug)]
            );

            if (response.documents.length === 0) {
                throw new Error('Blog not found');
            }

            return response.documents[0];
        } catch (error) {
            console.error('Error fetching blog by slug:', error);
            throw error;
        }
    }

    // Get blog by ID
    static async getBlogById(id) {
        try {
            return await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
        } catch (error) {
            console.error('Error fetching blog by ID:', error);
            throw error;
        }
    }

    // Create new blog
    static async createBlog(blogData, authorId, authorName) {
        try {
            const slug = this.generateSlug(blogData.title);
            const now = new Date().toISOString();

            const document = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    title: blogData.title,
                    slug: slug,
                    excerpt: blogData.excerpt,
                    content: blogData.content,
                    headerImage: blogData.headerImage || '',
                    tags: blogData.tags || [],
                    isPublished: blogData.isPublished || false,
                    publishDate: blogData.isPublished ? now : null,
                    lastModified: now,
                    authorId: authorId,
                    authorName: authorName,
                    readTime: this.calculateReadTime(blogData.content),
                    views: 0,
                    likes: 0
                }
            );

            return document;
        } catch (error) {
            console.error('Error creating blog:', error);
            throw error;
        }
    }

    // Update blog
    static async updateBlog(id, updateData) {
        try {
            const now = new Date().toISOString();

            // If publishing for the first time, set publish date
            if (updateData.isPublished && !updateData.publishDate) {
                updateData.publishDate = now;
            }

            updateData.lastModified = now;

            // Update slug if title changed
            if (updateData.title) {
                updateData.slug = this.generateSlug(updateData.title);
            }

            // Recalculate read time if content changed
            if (updateData.content) {
                updateData.readTime = this.calculateReadTime(updateData.content);
            }

            return await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                id,
                updateData
            );
        } catch (error) {
            console.error('Error updating blog:', error);
            throw error;
        }
    }

    // Delete blog
    static async deleteBlog(id) {
        try {
            return await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
        } catch (error) {
            console.error('Error deleting blog:', error);
            throw error;
        }
    }

    // Increment view count
    static async incrementViews(id) {
        try {
            const blog = await this.getBlogById(id);
            return await this.updateBlog(id, {
                views: (blog.views || 0) + 1
            });
        } catch (error) {
            console.error('Error incrementing views:', error);
            // Don't throw error for view tracking
        }
    }

    // Increment like count
    static async incrementLikes(id) {
        try {
            const blog = await this.getBlogById(id);
            return await this.updateBlog(id, {
                likes: (blog.likes || 0) + 1
            });
        } catch (error) {
            console.error('Error incrementing likes:', error);
            throw error;
        }
    }

    // Get unique tags
    static async getAllTags() {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    Query.select(['tags']),
                    Query.equal('isPublished', true),
                    Query.limit(1000)
                ]
            );

            const allTags = new Set();
            response.documents.forEach(doc => {
                if (doc.tags && Array.isArray(doc.tags)) {
                    doc.tags.forEach(tag => allTags.add(tag));
                }
            });

            return Array.from(allTags).sort();
        } catch (error) {
            console.error('Error fetching tags:', error);
            throw error;
        }
    }

    // Helper: Generate URL-friendly slug
    static generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // Helper: Calculate reading time
    static calculateReadTime(content) {
        const wordsPerMinute = 200;

        // If content is a JSON object (Tiptap format), extract text from it
        let textContent = '';
        if (typeof content === 'object' && content !== null) {
            // Extract text from Tiptap JSON structure
            textContent = this.extractTextFromTiptapJSON(content);
        } else if (typeof content === 'string') {
            // If it's HTML or plain text, strip HTML tags
            textContent = content.replace(/<[^>]*>/g, '');
        } else {
            textContent = String(content || '');
        }

        const words = textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
        return Math.max(1, Math.ceil(words / wordsPerMinute));
    }

    // Helper: Extract text content from Tiptap JSON
    static extractTextFromTiptapJSON(json) {
        if (!json || typeof json !== 'object') return '';

        let text = '';

        if (json.type === 'text') {
            return json.text || '';
        }

        if (json.content && Array.isArray(json.content)) {
            text += json.content.map(child => this.extractTextFromTiptapJSON(child)).join(' ');
        }

        return text;
    }

    // Get blog statistics
    static async getStats() {
        try {
            const [published, drafts, total] = await Promise.all([
                databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
                    Query.equal('isPublished', true),
                    Query.limit(1)
                ]),
                databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
                    Query.equal('isPublished', false),
                    Query.limit(1)
                ]),
                databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
                    Query.limit(1)
                ])
            ]);

            return {
                published: published.total,
                drafts: drafts.total,
                total: total.total
            };
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    }
}
