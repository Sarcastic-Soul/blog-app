// src/pages/BlogPostPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import { blogPosts } from "../data/blogs";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import Blockquote from "@tiptap/extension-blockquote";
import { createLowlight, common } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';

const lowlight = createLowlight(common);
lowlight.register({ javascript, python });


export default function BlogPostPage() {
    const { id } = useParams();
    const post = blogPosts.find((p) => p.id === id);

    const editor = useEditor({
        editable: false,
        extensions: [
            StarterKit.configure({ codeBlock: false, blockquote: false }),
            CodeBlockLowlight.configure({ lowlight }),
            Image,
            Blockquote,
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
            <main className="max-w-3xl mx-auto px-4 py-8">
                <img
                    src={post.headerImage}
                    alt={post.title}
                    className="w-full rounded-lg mb-6 object-cover max-h-64"
                />
                <h1 className="text-4xl font-bold text-yellow-300 mb-4">{post.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Published: {new Date(post.createdAt).toDateString()}
                </p>
                {post.updatedAt && (
                    <p className="text-gray-500 dark:text-gray-500 mb-8 text-sm">
                        Last updated: {new Date(post.updatedAt).toDateString()}
                    </p>
                )}

                <article className="prose dark:prose-invert max-w-none">
                    <EditorContent editor={editor} />
                </article>

                <Link to="/blogs" className="text-yellow-300 underline mt-8 block">
                    ← Back to Blogs
                </Link>
            </main>
        </div>
    );
}