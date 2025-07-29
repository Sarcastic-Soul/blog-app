import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag, Eye } from "lucide-react";

const BlogCard = React.memo(({ post, viewMode = "list" }) => {
    const isGridMode = viewMode === "grid";

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="group"
        >
            <Link
                to={`/blog/${post.id}`}
                className={`
                    block border border-gray-300 dark:border-gray-700 rounded-xl shadow hover:shadow-lg 
                    transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800
                    ${isGridMode ? "h-full" : ""}
                `}
            >
                {isGridMode ? (
                    // Grid View (Card Layout)
                    <div className="h-full flex flex-col">
                        {post.headerImage && (
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={post.headerImage}
                                    alt={`${post.title} header`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                {!post.isPublished && (
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                                        Draft
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-yellow-300 mb-3 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                                    {post.title}
                                </h3>

                                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                                    {post.excerpt}
                                </p>
                            </div>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags.slice(0, 3).map(tag => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                                        >
                                            <Tag className="w-3 h-3" />
                                            {tag}
                                        </span>
                                    ))}
                                    {post.tags.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                                            +{post.tags.length - 3} more
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Meta Info */}
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        5 min read
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-300">
                                    <Eye className="w-4 h-4" />
                                    <span>{Math.floor(Math.random() * 500 + 100)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // List View (Horizontal Layout)
                    <div className="flex items-center gap-6 p-6">
                        {post.headerImage && (
                            <div className="flex-shrink-0 relative">
                                <img
                                    src={post.headerImage}
                                    alt={`${post.title} header`}
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {!post.isPublished && (
                                    <div className="absolute -top-2 -right-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                                        Draft
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl md:text-2xl font-bold text-yellow-300 mb-2 group-hover:text-yellow-400 transition-colors">
                                        {post.title}
                                    </h3>

                                    <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 md:line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    {/* Tags */}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {post.tags.slice(0, 4).map(tag => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                                                >
                                                    <Tag className="w-3 h-3" />
                                                    {tag}
                                                </span>
                                            ))}
                                            {post.tags.length > 4 && (
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                                                    +{post.tags.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Meta Info */}
                                <div className="flex md:flex-col items-start gap-3 md:gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        5 min
                                    </span>
                                    <span className="flex items-center gap-1 text-yellow-300 font-medium">
                                        <Eye className="w-4 h-4" />
                                        {Math.floor(Math.random() * 500 + 100)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Link>
        </motion.div>
    );
});

BlogCard.displayName = 'BlogCard';

export default BlogCard;
