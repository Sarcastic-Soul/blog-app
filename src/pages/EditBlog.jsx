import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import BlogMetaForm from "../components/BlogMetaForm";
import BlogContentEditor from "../components/BlogContentEditor";
import { databases, DATABASE_ID, COLLECTION_ID } from "../lib/appwrite";
import { ADMIN_TEAM_ID } from "../lib/config";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Trash2, Eye } from "lucide-react";

function EditBlog() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // 0 = meta, 1 = content
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Blog data
    const [originalPost, setOriginalPost] = useState(null);
    const [meta, setMeta] = useState({
        title: "",
        excerpt: "",
        headerImage: "",
        tags: [],
    });
    const [contentJSON, setContentJSON] = useState(null);

    // Fetch existing blog post
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const post = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);

                setOriginalPost(post);
                setMeta({
                    title: post.title || "",
                    excerpt: post.excerpt || "",
                    headerImage: post.headerImage || "",
                    tags: post.tags || [],
                });
                setContentJSON(post.content || null);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch blog:", err);
                setError("Blog post not found or you don't have permission to edit it.");
                setLoading(false);
            }
        };

        if (id && user) {
            fetchBlog();
        }
    }, [id, user]);

    // When user completes meta form, move to content
    function handleMetaNext(newMeta) {
        setMeta(newMeta);
        setStep(1);
    }

    // Save updated blog
    async function saveBlog(isDraft) {
        setSaveLoading(true);
        setError("");

        if (!meta.title || !meta.excerpt) {
            setError("Title and excerpt are required.");
            setSaveLoading(false);
            return;
        }

        if (!contentJSON) {
            setError("Content cannot be empty.");
            setSaveLoading(false);
            return;
        }

        const updatedPost = {
            ...originalPost,
            title: meta.title,
            excerpt: meta.excerpt,
            content: contentJSON,
            headerImage: meta.headerImage || "",
            tags: meta.tags,
            updatedAt: new Date().toISOString(),
            isPublished: !isDraft,
        };

        try {
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                id,
                updatedPost
            );
            navigate("/blogs");
        } catch (err) {
            console.error("Failed to update post:", err);
            setError("Failed to save changes. Please try again.");
        } finally {
            setSaveLoading(false);
        }
    }

    // Delete blog
    async function deleteBlog() {
        if (!window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
            return;
        }

        setDeleteLoading(true);
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
            navigate("/blogs");
        } catch (err) {
            console.error("Failed to delete post:", err);
            setError("Failed to delete post. Please try again.");
        } finally {
            setDeleteLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
                <Header />
                <div className="flex items-center justify-center py-20">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-yellow-300 border-t-transparent rounded-full"
                    />
                    <span className="ml-3 text-lg">Loading blog post...</span>
                </div>
            </div>
        );
    }

    if (error && !originalPost) {
        return (
            <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
                <Header />
                <div className="max-w-3xl mx-auto px-4 py-8 text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl mb-4"
                    >
                        🦆💥
                    </motion.div>
                    <h2 className="text-3xl font-bold text-red-500">Oops!</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">{error}</p>
                    <Link
                        to="/blogs"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-300 text-black rounded-full hover:bg-yellow-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
            <Header />

            <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                {step === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/blogs"
                                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-300 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Blogs
                                </Link>
                                <h2 className="text-3xl font-bold text-yellow-300">
                                    ✏️ Edit Post
                                </h2>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    to={`/blog/${id}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    Preview
                                </Link>

                                <button
                                    onClick={deleteBlog}
                                    disabled={deleteLoading}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {deleteLoading ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-500 bg-red-100 dark:bg-red-900/20 px-4 py-3 rounded-lg border border-red-200 dark:border-red-800"
                            >
                                {error}
                            </motion.div>
                        )}

                        <BlogMetaForm initialMeta={meta} onNext={handleMetaNext} />
                    </motion.div>
                )}

                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold text-yellow-300 text-center">
                            ✍️ Edit Content
                        </h2>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-500 bg-red-100 dark:bg-red-900/20 px-4 py-3 rounded-lg border border-red-200 dark:border-red-800"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => setStep(0)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Meta
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => saveBlog(true)}
                                    disabled={saveLoading}
                                    className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-colors disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {saveLoading ? "Saving..." : "Save Draft"}
                                </button>

                                <button
                                    onClick={() => saveBlog(false)}
                                    disabled={saveLoading}
                                    className="flex items-center gap-2 bg-yellow-300 text-black px-6 py-2 rounded-full hover:bg-yellow-400 transition-colors disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {saveLoading ? "Publishing..." : "Update & Publish"}
                                </button>
                            </div>
                        </div>

                        <BlogContentEditor
                            initialContent={contentJSON}
                            onContentUpdate={(json) => setContentJSON(json)}
                        />
                    </motion.div>
                )}
            </main>
        </div>
    );
}

export default EditBlog;