// src/components/MarkdownEditor.jsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownEditor({
    initialContent = "",
    onContentChange,
}) {
    const [markdown, setMarkdown] = useState(initialContent);

    function handleChange(e) {
        const newValue = e.target.value;
        setMarkdown(newValue);
        onContentChange(newValue);
    }

    return (
        <div className="space-y-4">
            {/* Editor */}
            <textarea
                value={markdown}
                onChange={handleChange}
                className="
          w-full 
          min-h-[400px] 
          p-4 
          border border-gray-300 dark:border-gray-600 
          rounded-lg 
          bg-white dark:bg-gray-800 
          text-black dark:text-white 
          focus:outline-none focus:ring-2 focus:ring-yellow-300
          resize-vertical
        "
                placeholder="Write your post in Markdown here…"
            />

            {/* Live Preview */}
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 p-4 prose dark:prose-invert max-w-full overflow-auto">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {markdown}
                </ReactMarkdown>
            </div>
        </div>
    );
}
