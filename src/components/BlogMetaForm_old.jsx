// src/components/BlogMetaForm.jsx
import React, { useState } from "react";
import { FileText, Image as ImageIcon, Tag, BookOpen } from "lucide-react";

export default function BlogMetaForm({ initialMeta, onNext }) {
    const [title, setTitle] = useState(initialMeta.title || "");
    const [excerpt, setExcerpt] = useState(initialMeta.excerpt || "");
    const [headerImage, setHeaderImage] = useState(initialMeta.headerImage || "");
    const [tagsInput, setTagsInput] = useState(
        Array.isArray(initialMeta.tags) ? initialMeta.tags.join(", ") : ""
    );
    const [error, setError] = useState("");

    function handleNext(e) {
        e.preventDefault();
        setError("");
        if (!title.trim() || !excerpt.trim()) {
            setError("Title and excerpt are required.");
            return;
        }
        onNext({
            title: title.trim(),
            excerpt: excerpt.trim(),
            headerImage: headerImage.trim(),
            tags: tagsInput
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t.length),
        });
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                    <BookOpen className="h-6 w-6 text-yellow-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Blog Metadata
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    Set up your blog post with a compelling title, description, and cover image.
                </p>
            </div>

            <form onSubmit={handleNext} className="space-y-8">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center space-x-2">
                        <span className="text-red-500">⚠</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Title */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <FileText className="h-4 w-4 text-yellow-500" />
                        <span>Post Title</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter your post title"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg font-medium transition-colors"
                        required
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Choose a compelling title that captures your post's essence
                    </p>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <FileText className="h-4 w-4 text-yellow-500" />
                        <span>Post Excerpt</span>
                    </label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Write a compelling description that will appear in blog previews..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-vertical transition-colors"
                        required
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Keep it concise (150-200 characters) to hook your readers
                    </p>
                </div>

                {/* Header Image URL */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <ImageIcon className="h-4 w-4 text-yellow-500" />
                        <span>Header Image URL</span>
                    </label>
                    <input
                        type="url"
                        value={headerImage}
                        onChange={(e) => setHeaderImage(e.target.value)}
                        placeholder="https://example.com/your-image.jpg"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Add a stunning cover image to make your post stand out (optional)
                    </p>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <Tag className="h-4 w-4 text-yellow-500" />
                        <span>Tags</span>
                    </label>
                    <input
                        type="text"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="e.g. technology, tutorial, javascript, web development"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Separate tags with commas to help readers discover your content
                    </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-sm hover:shadow-lg flex items-center justify-center space-x-2"
                    >
                        <span>Continue to Editor</span>
                        <span>→</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
