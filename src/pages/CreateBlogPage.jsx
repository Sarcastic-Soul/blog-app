// src/pages/CreateBlogPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BlogMetaForm from "../components/BlogMetaForm";
import BlogContentEditor from "../components/BlogContentEditor";
import { BlogService } from "../lib/blogService";
import { useAuth } from "../context/AuthContext";
import { ADMIN_TEAM_ID } from "../lib/config";

export default function CreateBlogPage() {
    const navigate = useNavigate();
    const { user, userTeams } = useAuth();

    // Check if user is admin
    const isAdmin = userTeams.includes(ADMIN_TEAM_ID);

    // Redirect if not admin
    React.useEffect(() => {
        if (!user || !isAdmin) {
            navigate('/blogs');
        }
    }, [user, isAdmin, navigate]);

    // 0 = meta, 1 = content
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Meta state
    const [meta, setMeta] = useState({
        title: "",
        excerpt: "",
        headerImage: "",
        tags: [],
    });

    // TipTap JSON content
    const [contentJSON, setContentJSON] = useState(null);

    const [error, setError] = useState("");

    // When user completes meta form, move to content
    function handleMetaNext(newMeta) {
        setMeta(newMeta);
        setStep(1);
    }

    // Utility to slugify titles
    function slugify(text) {
        return text
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    // Save as draft or publish
    async function saveToAppwrite(isDraft) {
        setError("");
        setIsSubmitting(true);

        if (!meta.title || !meta.excerpt) {
            setError("Title and excerpt are required.");
            setIsSubmitting(false);
            return;
        }
        if (!contentJSON) {
            setError("Content cannot be empty.");
            setIsSubmitting(false);
            return;
        }

        if (!user) {
            setError("You must be logged in to create a blog.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Convert TipTap JSON to HTML for storage
            const contentHTML = contentJSON; // Assuming contentJSON is already HTML

            const blogData = {
                title: meta.title,
                excerpt: meta.excerpt,
                content: contentHTML,
                headerImage: meta.headerImage || "",
                tags: meta.tags,
                isPublished: !isDraft,
            };

            const newBlog = await BlogService.createBlog(
                blogData,
                user.$id,
                user.name || user.email
            );

            console.log("Blog created successfully:", newBlog);
            navigate("/blogs");
        } catch (err) {
            console.error("Failed to save blog:", err);
            setError(err.message || "Failed to save blog. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
            <Header />

            <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                {step === 0 && (
                    <>
                        <h2 className="text-3xl font-bold text-yellow-300">
                            ✍️ Create New Post
                        </h2>
                        {error && (
                            <div className="text-red-500 bg-red-100 px-4 py-2 rounded">
                                {error}
                            </div>
                        )}
                        <BlogMetaForm initialMeta={meta} onNext={handleMetaNext} />
                    </>
                )}

                {step === 1 && (
                    <>
                        <h2 className="text-3xl font-bold text-yellow-300 text-center">
                            ✍️ Write Your Content
                        </h2>

                        {error && (
                            <div className="text-red-500 bg-red-100 px-4 py-2 rounded">
                                {error}
                            </div>
                        )}

                        {/* Buttons at the top */}
                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={() => setStep(0)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                ← Back to Meta
                            </button>

                            <button
                                onClick={() => saveToAppwrite(true)}
                                disabled={isSubmitting}
                                className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Draft'}
                            </button>

                            <button
                                onClick={() => saveToAppwrite(false)}
                                disabled={isSubmitting}
                                className="ml-auto bg-yellow-300 text-black px-6 py-2 rounded-full hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish Post'}
                            </button>
                        </div>

                        <BlogContentEditor
                            initialContent={contentJSON}
                            onContentUpdate={(json) => setContentJSON(json)}
                        />
                    </>
                )}
            </main>
        </div>
    );
}
