// src/pages/BlogPostPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import { blogPosts } from "../data/blogs";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Image } from "@tiptap/extension-image";
import { Blockquote } from "@tiptap/extension-blockquote";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";
import { Link as LinkExtension } from "@tiptap/extension-link";
import { createLowlight, common } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';

const lowlight = createLowlight(common);
lowlight.register({ javascript, python, css, html });


export default function BlogPostPage() {
    const { id } = useParams();
    const post = blogPosts.find((p) => p.id === id);

    const editor = useEditor({
        editable: false,
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                blockquote: false
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'hljs code-block',
                }
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'blog-image',
                },
            }),
            Blockquote.configure({
                HTMLAttributes: {
                    class: 'custom-blockquote',
                }
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
                HTMLAttributes: {
                    class: 'task-item',
                }
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"]
            }),
            Highlight.configure({
                multicolor: true,
                HTMLAttributes: {
                    class: 'highlight-text',
                }
            }),
            Subscript,
            Superscript,
            Underline,
            LinkExtension.configure({
                openOnClick: true,
                HTMLAttributes: {
                    class: 'blog-link',
                },
            }),
        ],
        content: post?.content || "",
    });

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white dark:bg-black text-black dark:text-white">
                <Header />
                <h2 className="text-3xl mb-4">Post Not Found</h2>
                <Link to="/blogs" className="text-yellow-300 underline">
                    Back to Blogs
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
            <Header />
            <main className="max-w-4xl mx-auto px-4 py-8">
                <img
                    src={post.headerImage}
                    alt={post.title}
                    className="w-full rounded-xl mb-8 object-cover max-h-96 shadow-xl"
                />
                <h1 className="text-5xl font-bold text-yellow-400 mb-6 leading-tight">{post.title}</h1>
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Published: {new Date(post.createdAt).toDateString()}
                    </p>
                    {post.updatedAt && (
                        <p className="text-gray-500 dark:text-gray-500 text-sm">
                            Last updated: {new Date(post.updatedAt).toDateString()}
                        </p>
                    )}
                </div>

                <article className="blog-post-content">
                    <EditorContent editor={editor} />
                </article>

                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <Link
                        to="/blogs"
                        className="inline-flex items-center text-yellow-400 hover:text-yellow-500 font-medium transition-colors duration-200"
                    >
                        ← Back to Blogs
                    </Link>
                </div>
            </main>

            {/* Blog Post Styles */}
            <style jsx>{`
                .blog-post-content .ProseMirror {
                    outline: none;
                    max-width: none;
                    font-family: 'Inter', sans-serif;
                    line-height: 1.7;
                    color: #1f2937;
                }
                
                .dark .blog-post-content .ProseMirror {
                    color: #f9fafb;
                }
                
                /* Heading styles matching the blog theme */
                .blog-post-content .ProseMirror h1 {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin: 2rem 0 1.5rem 0;
                    line-height: 1.2;
                    color: #fbbf24;
                }
                
                .blog-post-content .ProseMirror h2 {
                    font-size: 2rem;
                    font-weight: 600;
                    margin: 1.75rem 0 1rem 0;
                    line-height: 1.3;
                    color: #374151;
                }
                
                .dark .blog-post-content .ProseMirror h2 {
                    color: #f3f4f6;
                }
                
                .blog-post-content .ProseMirror h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 1.5rem 0 0.75rem 0;
                    line-height: 1.4;
                    color: #374151;
                }
                
                .dark .blog-post-content .ProseMirror h3 {
                    color: #f3f4f6;
                }
                
                .blog-post-content .ProseMirror h4 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 1.25rem 0 0.5rem 0;
                    line-height: 1.4;
                    color: #374151;
                }
                
                .dark .blog-post-content .ProseMirror h4 {
                    color: #f3f4f6;
                }
                
                /* Paragraph styles */
                .blog-post-content .ProseMirror p {
                    margin: 1rem 0;
                    line-height: 1.7;
                    font-size: 1.1rem;
                }
                
                /* List styles */
                .blog-post-content .ProseMirror ul,
                .blog-post-content .ProseMirror ol {
                    margin: 1.5rem 0;
                    padding-left: 2rem;
                }
                
                .blog-post-content .ProseMirror ul {
                    list-style-type: disc;
                }
                
                .blog-post-content .ProseMirror ol {
                    list-style-type: decimal;
                }
                
                .blog-post-content .ProseMirror li {
                    margin: 0.5rem 0;
                    line-height: 1.6;
                    font-size: 1.1rem;
                }
                
                /* Task list styles */
                .blog-post-content .ProseMirror .task-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    margin: 0.75rem 0;
                    list-style: none;
                }
                
                .blog-post-content .ProseMirror .task-item > label > input {
                    width: 1.25rem;
                    height: 1.25rem;
                    accent-color: #fbbf24;
                }
                
                /* Blockquote styles */
                .blog-post-content .ProseMirror .custom-blockquote {
                    border-left: 4px solid #fbbf24;
                    padding: 1.5rem 2rem;
                    margin: 2rem 0;
                    background: #fffbeb;
                    border-radius: 0 0.5rem 0.5rem 0;
                    font-style: italic;
                    font-size: 1.125rem;
                    color: #92400e;
                    position: relative;
                }
                
                .dark .blog-post-content .ProseMirror .custom-blockquote {
                    background: #1f2937;
                    color: #fcd34d;
                    border-left-color: #fbbf24;
                }
                
                .blog-post-content .ProseMirror .custom-blockquote::before {
                    content: '"';
                    font-size: 4rem;
                    color: #fbbf24;
                    position: absolute;
                    left: 0.5rem;
                    top: -0.5rem;
                    line-height: 1;
                    opacity: 0.3;
                }
                
                /* Code styles */
                .blog-post-content .ProseMirror code {
                    background: #f3f4f6;
                    color: #dc2626;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.375rem;
                    font-size: 0.9em;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    font-weight: 500;
                }
                
                .dark .blog-post-content .ProseMirror code {
                    background: #374151;
                    color: #fca5a5;
                }
                
                /* Code block styles */
                .blog-post-content .ProseMirror .code-block {
                    background: #1f2937;
                    color: #f9fafb;
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                    overflow-x: auto;
                    margin: 2rem 0;
                    border: 1px solid #374151;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    font-size: 0.875rem;
                    line-height: 1.5;
                }
                
                /* Image styles */
                .blog-post-content .ProseMirror .blog-image {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.75rem;
                    margin: 2rem auto;
                    display: block;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                }
                
                /* Link styles */
                .blog-post-content .ProseMirror .blog-link {
                    color: #fbbf24;
                    text-decoration: underline;
                    text-decoration-color: #fbbf24;
                    text-underline-offset: 0.125rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                
                .blog-post-content .ProseMirror .blog-link:hover {
                    color: #f59e0b;
                    text-decoration-color: #f59e0b;
                }
                
                /* Highlight styles */
                .blog-post-content .ProseMirror .highlight-text[data-color="yellow"] {
                    background: linear-gradient(120deg, #fef08a 0%, #fef08a 100%);
                    background-repeat: no-repeat;
                    background-size: 100% 0.75em;
                    background-position: 0 88%;
                    color: #854d0e;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                }
                
                .blog-post-content .ProseMirror .highlight-text[data-color="green"] {
                    background: linear-gradient(120deg, #bbf7d0 0%, #bbf7d0 100%);
                    background-repeat: no-repeat;
                    background-size: 100% 0.75em;
                    background-position: 0 88%;
                    color: #14532d;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                }
                
                .blog-post-content .ProseMirror .highlight-text[data-color="blue"] {
                    background: linear-gradient(120deg, #bfdbfe 0%, #bfdbfe 100%);
                    background-repeat: no-repeat;
                    background-size: 100% 0.75em;
                    background-position: 0 88%;
                    color: #1e3a8a;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                }
                
                .blog-post-content .ProseMirror .highlight-text[data-color="red"] {
                    background: linear-gradient(120deg, #fecaca 0%, #fecaca 100%);
                    background-repeat: no-repeat;
                    background-size: 100% 0.75em;
                    background-position: 0 88%;
                    color: #7f1d1d;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                }
                
                .blog-post-content .ProseMirror .highlight-text[data-color="purple"] {
                    background: linear-gradient(120deg, #e9d5ff 0%, #e9d5ff 100%);
                    background-repeat: no-repeat;
                    background-size: 100% 0.75em;
                    background-position: 0 88%;
                    color: #581c87;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                }
                
                /* Horizontal rule */
                .blog-post-content .ProseMirror hr {
                    border: none;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #fbbf24, transparent);
                    margin: 3rem 0;
                    border-radius: 1px;
                }
                
                /* Text alignment */
                .blog-post-content .ProseMirror [style*="text-align: center"] {
                    text-align: center;
                }
                
                .blog-post-content .ProseMirror [style*="text-align: right"] {
                    text-align: right;
                }
                
                .blog-post-content .ProseMirror [style*="text-align: justify"] {
                    text-align: justify;
                }
                
                /* Superscript and subscript */
                .blog-post-content .ProseMirror sup {
                    font-size: 0.75em;
                    vertical-align: super;
                }
                
                .blog-post-content .ProseMirror sub {
                    font-size: 0.75em;
                    vertical-align: sub;
                }
            `}</style>
        </div>
    );
}