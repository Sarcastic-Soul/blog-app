import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import { databases, DATABASE_ID, COLLECTION_ID } from "../lib/appwrite";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Eye,
    Heart,
    MessageCircle,
    Share2,
    Calendar,
    Clock,
    TrendingUp,
    Users,
    Globe,
    Edit
} from "lucide-react";

function StatsPage() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Mock stats data (in a real app, these would come from analytics service)
    const [stats, setStats] = useState({
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        readTime: "5 min",
        viewsOverTime: [],
        topReferrers: [],
        readerLocations: [],
        engagementRate: 0
    });

    useEffect(() => {
        const fetchBlogAndStats = async () => {
            try {
                setLoading(true);

                // Fetch blog post
                const post = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
                setBlog(post);

                // Generate mock stats based on blog creation date
                const daysSinceCreated = Math.floor(
                    (new Date() - new Date(post.createdAt)) / (1000 * 60 * 60 * 24)
                );

                const mockStats = generateMockStats(daysSinceCreated, post.title);
                setStats(mockStats);

                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch blog:", err);
                setError("Blog post not found or you don't have permission to view its stats.");
                setLoading(false);
            }
        };

        if (id) {
            fetchBlogAndStats();
        }
    }, [id]);

    // Generate realistic mock stats
    const generateMockStats = (days, title) => {
        const baseViews = Math.floor(Math.random() * 500) + 100;
        const views = baseViews + (days * Math.floor(Math.random() * 20 + 5));
        const likes = Math.floor(views * (0.05 + Math.random() * 0.1));
        const comments = Math.floor(likes * (0.2 + Math.random() * 0.3));
        const shares = Math.floor(likes * (0.1 + Math.random() * 0.2));

        // Generate views over time (last 7 days)
        const viewsOverTime = Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
            views: Math.floor(Math.random() * 50 + 10)
        }));

        // Mock referrers
        const topReferrers = [
            { source: "Direct", visitors: Math.floor(views * 0.4) },
            { source: "Google", visitors: Math.floor(views * 0.3) },
            { source: "Twitter", visitors: Math.floor(views * 0.15) },
            { source: "LinkedIn", visitors: Math.floor(views * 0.1) },
            { source: "Other", visitors: Math.floor(views * 0.05) }
        ];

        // Mock reader locations
        const readerLocations = [
            { country: "United States", visitors: Math.floor(views * 0.4) },
            { country: "United Kingdom", visitors: Math.floor(views * 0.2) },
            { country: "Canada", visitors: Math.floor(views * 0.15) },
            { country: "Germany", visitors: Math.floor(views * 0.1) },
            { country: "Australia", visitors: Math.floor(views * 0.08) },
            { country: "Other", visitors: Math.floor(views * 0.07) }
        ];

        return {
            views,
            likes,
            comments,
            shares,
            readTime: `${Math.floor(Math.random() * 5 + 3)} min`,
            viewsOverTime,
            topReferrers,
            readerLocations,
            engagementRate: ((likes + comments + shares) / views * 100).toFixed(1)
        };
    };

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
                    <span className="ml-3 text-lg">Loading blog statistics...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
                <Header />
                <div className="max-w-3xl mx-auto px-4 py-8 text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl mb-4"
                    >
                        📊💥
                    </motion.div>
                    <h2 className="text-3xl font-bold text-red-500">Stats Not Found</h2>
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

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div className="space-y-2">
                        <Link
                            to="/blogs"
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-300 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Blogs
                        </Link>
                        <h1 className="text-3xl font-bold text-yellow-300">
                            📊 Blog Statistics
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            {blog?.title}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            to={`/blog/${id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            View Post
                        </Link>
                        <Link
                            to={`/edit/${id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-300 text-black rounded-lg hover:bg-yellow-400 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Post
                        </Link>
                    </div>
                </motion.div>

                {/* Quick Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {[
                        { icon: Eye, label: "Total Views", value: stats.views.toLocaleString(), color: "blue" },
                        { icon: Heart, label: "Likes", value: stats.likes.toLocaleString(), color: "red" },
                        { icon: MessageCircle, label: "Comments", value: stats.comments.toLocaleString(), color: "green" },
                        { icon: Share2, label: "Shares", value: stats.shares.toLocaleString(), color: "purple" }
                    ].map(({ icon: Icon, label, value, color }) => (
                        <motion.div
                            key={label}
                            whileHover={{ scale: 1.02 }}
                            className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <Icon className={`w-6 h-6 text-${color}-500`} />
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{value}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Engagement Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid md:grid-cols-3 gap-6"
                >
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <Clock className="w-6 h-6 text-yellow-500" />
                            <h3 className="text-lg font-semibold">Read Time</h3>
                        </div>
                        <p className="text-3xl font-bold text-yellow-300">{stats.readTime}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Average time spent reading
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-blue-500" />
                            <h3 className="text-lg font-semibold">Engagement Rate</h3>
                        </div>
                        <p className="text-3xl font-bold text-blue-400">{stats.engagementRate}%</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Likes, comments & shares per view
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-green-500" />
                            <h3 className="text-lg font-semibold">Published</h3>
                        </div>
                        <p className="text-lg font-semibold">
                            {blog ? new Date(blog.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {blog ? `${Math.floor((new Date() - new Date(blog.createdAt)) / (1000 * 60 * 60 * 24))} days ago` : ""}
                        </p>
                    </div>
                </motion.div>

                {/* Views Over Time Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-6"
                >
                    <h3 className="text-xl font-semibold flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-yellow-500" />
                        Views Over Time (Last 7 Days)
                    </h3>

                    <div className="space-y-4">
                        {stats.viewsOverTime.map((day, index) => (
                            <div key={day.date} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400 w-20">
                                    {day.date}
                                </span>
                                <div className="flex-1 mx-4">
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(day.views / Math.max(...stats.viewsOverTime.map(d => d.views))) * 100}%` }}
                                            transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                            className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full"
                                        />
                                    </div>
                                </div>
                                <span className="text-sm font-medium w-12 text-right">
                                    {day.views}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Traffic Sources and Reader Locations */}
                <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-6"
                    >
                        <h3 className="text-xl font-semibold flex items-center gap-3">
                            <Globe className="w-6 h-6 text-blue-500" />
                            Traffic Sources
                        </h3>

                        <div className="space-y-4">
                            {stats.topReferrers.map((referrer, index) => (
                                <div key={referrer.source} className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{referrer.source}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(referrer.visitors / stats.views) * 100}%` }}
                                                transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                                                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                                            {referrer.visitors}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-6"
                    >
                        <h3 className="text-xl font-semibold flex items-center gap-3">
                            <Users className="w-6 h-6 text-green-500" />
                            Reader Locations
                        </h3>

                        <div className="space-y-4">
                            {stats.readerLocations.map((location, index) => (
                                <div key={location.country} className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{location.country}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(location.visitors / stats.views) * 100}%` }}
                                                transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                                                className="h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full"
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                                            {location.visitors}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Fun Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-r from-yellow-300 to-orange-400 rounded-xl p-6 text-black"
                >
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                        🦆 Duck Analytics Insights
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white/20 rounded-lg p-4">
                            <p className="font-semibold">Coffee Cups Consumed</p>
                            <p className="text-2xl font-bold">{Math.floor(stats.views / 47)}</p>
                            <p className="text-xs opacity-75">While writing this post</p>
                        </div>
                        <div className="bg-white/20 rounded-lg p-4">
                            <p className="font-semibold">Rubber Ducks Consulted</p>
                            <p className="text-2xl font-bold">{Math.floor(stats.comments / 3)}</p>
                            <p className="text-xs opacity-75">For debugging inspiration</p>
                        </div>
                        <div className="bg-white/20 rounded-lg p-4">
                            <p className="font-semibold">Chaos Level</p>
                            <p className="text-2xl font-bold">{Math.min(stats.engagementRate * 10, 100).toFixed(0)}%</p>
                            <p className="text-xs opacity-75">Measured in duck quacks</p>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

export default StatsPage;