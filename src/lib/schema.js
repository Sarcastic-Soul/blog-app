// Appwrite Database Schema Configuration
// This file defines the structure for the blog database

export const DATABASE_SCHEMA = {
    databaseId: 'blog-database',
    name: 'Blog Database',
    collections: {
        blogs: {
            id: 'blogs',
            name: 'Blogs',
            permissions: [
                // Allow public read access
                'read("any")',
                // Allow authenticated users to create
                'create("users")',
                // Allow document creator and admin team to update/delete
                'update("users")',
                'delete("users")',
                'update("team:admin-team")',
                'delete("team:admin-team")'
            ],
            attributes: [
                {
                    key: 'title',
                    type: 'string',
                    required: true,
                    array: false,
                    size: 255
                },
                {
                    key: 'slug',
                    type: 'string',
                    required: true,
                    array: false,
                    size: 255
                },
                {
                    key: 'excerpt',
                    type: 'string',
                    required: true,
                    array: false,
                    size: 500
                },
                {
                    key: 'content',
                    type: 'string',
                    required: true,
                    array: false,
                    size: 16777216 // 16MB for long blog content
                },
                {
                    key: 'headerImage',
                    type: 'string',
                    required: false,
                    array: false,
                    size: 2048
                },
                {
                    key: 'tags',
                    type: 'string',
                    required: false,
                    array: true,
                    size: 50
                },
                {
                    key: 'isPublished',
                    type: 'boolean',
                    required: false,
                    array: false,
                    default: false
                },
                {
                    key: 'publishDate',
                    type: 'datetime',
                    required: false,
                    array: false
                },
                {
                    key: 'lastModified',
                    type: 'datetime',
                    required: true,
                    array: false
                },
                {
                    key: 'authorId',
                    type: 'string',
                    required: true,
                    array: false,
                    size: 36
                },
                {
                    key: 'authorName',
                    type: 'string',
                    required: true,
                    array: false,
                    size: 100
                },
                {
                    key: 'readTime',
                    type: 'integer',
                    required: false,
                    array: false,
                    min: 1,
                    max: 999
                },
                {
                    key: 'views',
                    type: 'integer',
                    required: false,
                    array: false,
                    default: 0,
                    min: 0
                },
                {
                    key: 'likes',
                    type: 'integer',
                    required: false,
                    array: false,
                    default: 0,
                    min: 0
                }
            ],
            indexes: [
                {
                    key: 'slug',
                    type: 'unique',
                    attributes: ['slug']
                },
                {
                    key: 'published',
                    type: 'key',
                    attributes: ['isPublished']
                },
                {
                    key: 'author',
                    type: 'key',
                    attributes: ['authorId']
                },
                {
                    key: 'publishDate',
                    type: 'key',
                    attributes: ['publishDate']
                },
                {
                    key: 'tags',
                    type: 'key',
                    attributes: ['tags']
                },
                {
                    key: 'search',
                    type: 'fulltext',
                    attributes: ['title', 'excerpt', 'content']
                }
            ]
        },

        comments: {
            id: 'comments',
            name: 'Comments',
            permissions: [
                'read("any")',
                'create("users")',
                'update("users")',
                'delete("users")',
                'delete("team:admin-team")'
            ],
            attributes: [
                {
                    key: 'blogId',
                    type: 'string',
                    required: true,
                    array: false,
                    size: 36
                },
                {
                    key: 'content',
                    type: 'string',
                    required: true,
                    array: false,
                    size: 1000
                },
                {
                    key: 'authorId',
                    type: 'string',
                    required: true,
                    array: false,
                    size: 36
                },
                {
                    key: 'authorName',
                    type: 'string',
                    required: true,
                    array: false,
                    size: 100
                },
                {
                    key: 'isApproved',
                    type: 'boolean',
                    required: false,
                    array: false,
                    default: false
                },
                {
                    key: 'createdAt',
                    type: 'datetime',
                    required: true,
                    array: false
                }
            ],
            indexes: [
                {
                    key: 'blog',
                    type: 'key',
                    attributes: ['blogId']
                },
                {
                    key: 'author',
                    type: 'key',
                    attributes: ['authorId']
                },
                {
                    key: 'approved',
                    type: 'key',
                    attributes: ['isApproved']
                }
            ]
        }
    }
};

export const TEAM_SCHEMA = {
    adminTeam: {
        id: 'admin-team',
        name: 'Blog Administrators',
        roles: ['admin', 'editor', 'moderator']
    }
};
