// src/components/BlogMetaForm.jsx
import React, { useState } from "react";

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
        <form onSubmit={handleNext} className="space-y-6">
            {error && (
                <div className="text-red-500 bg-red-100 px-4 py-2 rounded">{error}</div>
            )}

            {/* Title */}
            <div>
                <label className="block mb-1 font-semibold">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    required
                />
            </div>

            {/* Excerpt */}
            <div>
                <label className="block mb-1 font-semibold">Excerpt</label>
                <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Short preview (max ~150 characters)"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    required
                />
            </div>

            {/* Header Image URL */}
            <div>
                <label className="block mb-1 font-semibold">Header Image URL</label>
                <input
                    type="text"
                    value={headerImage}
                    onChange={(e) => setHeaderImage(e.target.value)}
                    placeholder="e.g. https://…/my-image.jpg (optional)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
                />
            </div>

            {/* Tags */}
            <div>
                <label className="block mb-1 font-semibold">Tags (comma-separated)</label>
                <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. satire, ducks, revolution"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
                />
            </div>

            <div>
                <button
                    type="submit"
                    className="bg-yellow-300 text-black px-6 py-2 rounded-full hover:bg-yellow-400 transition"
                >
                    Next: Write Content →
                </button>
            </div>
        </form>
    );
}
