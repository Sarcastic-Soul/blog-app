import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import BlogCard from "../components/BlogCard";
import { blogPosts } from "../data/blogs";
import { BlogService } from "../lib/blogService";
import { useAuth } from "../context/AuthContext";
import { ADMIN_TEAM_ID } from "../lib/config";
import { Plus, Search, Filter, Grid, List, Loader, RefreshCw } from "lucide-react";

export default function BlogsPage() {
    const { user, userTeams, refreshAuth } = useAuth();
    const isAdmin = useMemo(() => userTeams.includes(ADMIN_TEAM_ID), [userTeams]);

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [showDrafts, setShowDrafts] = useState(false);
    const [error, setError] = useState(null);
    const [availableTags, setAvailableTags] = useState([]);

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            let fetchedBlogs = [];

            // Determine what blogs to fetch
            if (searchTerm) {
                // Search blogs
                fetchedBlogs = await BlogService.searchBlogs(searchTerm, !showDrafts);
            } else if (selectedTag) {
                // Filter by tag
                fetchedBlogs = await BlogService.getBlogsByTag(selectedTag, !showDrafts);
            } else {
                // Get all blogs
                const result = isAdmin && showDrafts
                    ? await BlogService.getAllBlogs(100, 0)
                    : await BlogService.getPublishedBlogs(100, 0);
                fetchedBlogs = result.documents;
            }

            setBlogs(fetchedBlogs);

            // Fetch available tags if not already loaded
            if (availableTags.length === 0) {
                const tags = await BlogService.getAllTags();
                setAvailableTags(tags);
            }

        } catch (apiError) {
            console.error("Failed to fetch blogs from Appwrite:", apiError);
            setError(apiError.message);

            // Fallback to static blogs
            console.log("Using static blogs as fallback");
            setBlogs(blogPosts);
            setAvailableTags([...new Set(blogPosts.flatMap(blog => blog.tags || []))]);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, selectedTag, showDrafts, isAdmin, availableTags.length]);

    // Manual refresh function
    const refreshBlogs = useCallback(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    // Check if we just came from OAuth redirect
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('oauth') || window.location.hash.includes('oauth')) {
            // Refresh auth state after OAuth redirect
            refreshAuth();
        }
    }, [refreshAuth]);    // Get all unique tags - now from database or fallback
    const allTags = useMemo(() => availableTags, [availableTags]);

    // Filter blogs for local filtering (when not using API filters)
    const filteredBlogs = useMemo(() => {
        if (searchTerm || selectedTag) {
            // Already filtered by API
            return blogs;
        }

        return blogs.filter(blog => {
            const matchesDraftFilter = showDrafts ? !blog.isPublished : blog.isPublished;
            return matchesDraftFilter;
        });
    }, [blogs, showDrafts, searchTerm, selectedTag]);

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
            <Header />

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
                >
                    <div>
                        <h2 className="text-4xl font-bold text-yellow-300 mb-2">Latest Chaos</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Where rubber ducks meet reality and code meets comedy
                            {error && (
                                <span className="block text-orange-400 text-sm mt-1">
                                    ⚠️ Using offline mode - {error}
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Refresh Button */}
                        <button
                            onClick={refreshBlogs}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                            title="Refresh blogs"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>

                        {isAdmin && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex gap-3"
                            >
                                <Link
                                    to="/create-blog"
                                    className="flex items-center gap-2 px-6 py-3 bg-yellow-300 text-black rounded-full hover:bg-yellow-400 transition-colors shadow-lg"
                                >
                                    <Plus className="w-5 h-5" />
                                    New Post
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-8 space-y-4"
                >
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search blogs by title or content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Tag Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <select
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            >
                                <option value="">All Tags</option>
                                {allTags.map(tag => (
                                    <option key={tag} value={tag}>{tag}</option>
                                ))}
                            </select>
                        </div>

                        {/* Admin Filters */}
                        {isAdmin && (
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={showDrafts}
                                        onChange={(e) => setShowDrafts(e.target.checked)}
                                        className="rounded border-gray-300 text-yellow-300 focus:ring-yellow-300"
                                    />
                                    <span className="text-sm">Show Drafts</span>
                                </label>
                            </div>
                        )}

                        {/* View Mode */}
                        <div className="flex items-center gap-1 ml-auto">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded ${viewMode === "grid"
                                    ? "bg-yellow-300 text-black"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded ${viewMode === "list"
                                    ? "bg-yellow-300 text-black"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                    }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Filter Summary */}
                    {(searchTerm || selectedTag || showDrafts) && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>
                                Showing {filteredBlogs.length} of {blogs.length} posts
                            </span>
                            {searchTerm && (
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                                    "{searchTerm}"
                                </span>
                            )}
                            {selectedTag && (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                                    #{selectedTag}
                                </span>
                            )}
                            {showDrafts && (
                                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded">
                                    Drafts
                                </span>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader className="w-8 h-8 animate-spin text-yellow-300" />
                        <span className="ml-3 text-lg">Loading blogs...</span>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredBlogs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <div className="text-6xl mb-4">🦆💭</div>
                        <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                            No blogs found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-500 mb-6">
                            {searchTerm || selectedTag
                                ? "Try adjusting your search or filters"
                                : "No blogs have been published yet"}
                        </p>
                        {isAdmin && !searchTerm && !selectedTag && (
                            <Link
                                to="/create-blog"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-300 text-black rounded-full hover:bg-yellow-400 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Create Your First Post
                            </Link>
                        )}
                    </motion.div>
                )}

                {/* Blog Grid/List */}
                {!loading && filteredBlogs.length > 0 && (
                    <motion.div
                        className={`space-y-6 ${viewMode === "grid" ? "md:grid md:grid-cols-2 md:gap-6 md:space-y-0" : ""}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {filteredBlogs.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: Math.min(index * 0.05, 0.5), // Cap delay at 0.5s
                                    duration: 0.3
                                }}
                                className="relative"
                            >
                                <BlogCard post={post} viewMode={viewMode} />

                                {/* Admin Controls */}
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            to={`/edit/${post.id}`}
                                            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                            title="Edit Post"
                                        >
                                            ✏️
                                        </Link>
                                        <Link
                                            to={`/stats/${post.id}`}
                                            className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                                            title="View Stats"
                                        >
                                            📊
                                        </Link>
                                    </div>
                                )}

                                {/* Draft Indicator */}
                                {!post.isPublished && (
                                    <div className="absolute top-4 left-4 px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                                        Draft
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Pagination could go here in a real app */}

                {/* Fun Stats */}
                {!loading && filteredBlogs.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-xl p-6 text-black"
                    >
                        <h3 className="text-xl font-bold mb-4">🦆 Blog Analytics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold">{blogs.length}</div>
                                <div className="text-sm opacity-75">Total Posts</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{allTags.length}</div>
                                <div className="text-sm opacity-75">Tags</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    {blogs.filter(b => b.isPublished).length}
                                </div>
                                <div className="text-sm opacity-75">Published</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">∞</div>
                                <div className="text-sm opacity-75">Chaos Level</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
