// src/components/BlogContentEditor.jsx
import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

// Core extensions
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";

// Syntax highlighting
import { createLowlight, common } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";

// Initialize lowlight
const lowlight = createLowlight(common);
lowlight.register({ javascript, python, css, html });

export default function BlogContentEditor({ initialContent, onContentUpdate }) {
    const [showPreview, setShowPreview] = useState(false);
    const [activeHighlightColor, setActiveHighlightColor] = useState("yellow");
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [linkText, setLinkText] = useState("");
    const linkDialogRef = useRef(null);

    const editor = useEditor({
        editable: !showPreview,
        extensions: [
            StarterKit.configure({
                codeBlock: false, // We'll use CodeBlockLowlight instead
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'hljs',
                }
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
                HTMLAttributes: {
                    class: 'flex items-start gap-2',
                }
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"]
            }),
            Typography,
            Highlight.configure({
                multicolor: true,
                HTMLAttributes: {
                    class: 'px-1 rounded',
                }
            }),
            Subscript,
            Superscript,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 hover:text-blue-800 underline',
                },
            }),
        ],
        content: initialContent || `
            <h1>Getting started</h1>
            <p>Welcome to your enhanced blog editor! This editor includes all the features from the Tiptap Simple Editor template.</p>
            <h2>Features</h2>
            <ul>
                <li><strong>Rich formatting</strong> with bold, italic, underline, and more</li>
                <li><strong>Headings</strong> from H1 to H6</li>
                <li><strong>Lists</strong> including bullet lists, numbered lists, and task lists</li>
                <li><strong>Code blocks</strong> with syntax highlighting</li>
                <li><strong>Images</strong> and links</li>
                <li><strong>Text alignment</strong> options</li>
                <li><strong>Highlighting</strong> with multiple colors</li>
            </ul>
            <p>Try the features above and start writing your blog post!</p>
        `,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none p-6 dark:prose-invert max-w-none",
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
            },
            handleKeyDown(view, event) {
                if (showPreview) {
                    event.preventDefault();
                    return true;
                }
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            if (onContentUpdate) {
                onContentUpdate(editor.getJSON());
            }
        },
    });

    // Handle link dialog
    useEffect(() => {
        if (showLinkDialog && linkDialogRef.current) {
            linkDialogRef.current.focus();
        }
    }, [showLinkDialog]);

    if (!editor) {
        return <div className="flex items-center justify-center p-8">Loading editor...</div>;
    }

    // Helper functions
    const isActive = (name, attrs = {}) => editor.isActive(name, attrs);

    const buttonClass = (active = false) => `
        px-3 py-1.5 rounded text-sm font-medium transition-colors
        ${active
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }
        ${showPreview ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `;

    const insertImage = () => {
        if (showPreview) return;
        const url = window.prompt("Enter image URL:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const insertCodeBlock = () => {
        if (showPreview) return;
        const language = window.prompt(
            "Enter programming language (javascript, python, css, html, etc.):",
            "javascript"
        );
        editor.chain().focus().toggleCodeBlock({ language: language || null }).run();
    };

    const toggleHighlight = (color) => {
        if (showPreview) return;
        // Use the color name directly, not CSS variable
        if (editor.isActive('highlight', { color })) {
            editor.chain().focus().unsetHighlight().run();
        } else {
            editor.chain().focus().setHighlight({ color }).run();
        }
    };

    const openLinkDialog = () => {
        if (showPreview) return;
        const { from, to } = editor.state.selection;
        if (from === to) {
            alert("Please select some text first to create a link.");
            return;
        }
        const selectedText = editor.state.doc.textBetween(from, to);
        setLinkText(selectedText);
        setLinkUrl("");
        setShowLinkDialog(true);
    };

    const insertLink = () => {
        if (linkUrl) {
            editor.chain().focus().setLink({ href: linkUrl }).run();
        }
        setShowLinkDialog(false);
        setLinkUrl("");
        setLinkText("");
    };

    const removeLink = () => {
        editor.chain().focus().unsetLink().run();
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4">
            {/* Toolbar */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-sm z-10">
                <div className="flex flex-wrap items-center gap-2">
                    {/* Undo/Redo */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={showPreview || !editor.can().undo()}
                            className={buttonClass()}
                            title="Undo (Ctrl+Z)"
                        >
                            ↶
                        </button>
                        <button
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={showPreview || !editor.can().redo()}
                            className={buttonClass()}
                            title="Redo (Ctrl+Y)"
                        >
                            ↷
                        </button>
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Headings */}
                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                            <button
                                key={level}
                                onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                                disabled={showPreview}
                                className={buttonClass(isActive("heading", { level }))}
                                title={`Heading ${level}`}
                            >
                                H{level}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Text Formatting */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            disabled={showPreview}
                            className={buttonClass(isActive("bold"))}
                            title="Bold (Ctrl+B)"
                        >
                            <strong>B</strong>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            disabled={showPreview}
                            className={buttonClass(isActive("italic"))}
                            title="Italic (Ctrl+I)"
                        >
                            <em>I</em>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            disabled={showPreview}
                            className={buttonClass(isActive("underline"))}
                            title="Underline (Ctrl+U)"
                        >
                            <u>U</u>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            disabled={showPreview}
                            className={buttonClass(isActive("strike"))}
                            title="Strikethrough"
                        >
                            <s>S</s>
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            disabled={showPreview}
                            className={buttonClass(isActive("code"))}
                            title="Inline Code"
                        >
                            &lt;/&gt;
                        </button>
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Lists */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            disabled={showPreview}
                            className={buttonClass(isActive("bulletList"))}
                            title="Bullet List"
                        >
                            • List
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            disabled={showPreview}
                            className={buttonClass(isActive("orderedList"))}
                            title="Numbered List"
                        >
                            1. List
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleTaskList().run()}
                            disabled={showPreview}
                            className={buttonClass(isActive("taskList"))}
                            title="Task List"
                        >
                            ☑ Task
                        </button>
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Block Elements */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            disabled={showPreview}
                            className={buttonClass(isActive("blockquote"))}
                            title="Blockquote"
                        >
                            " "
                        </button>
                        <button
                            onClick={insertCodeBlock}
                            disabled={showPreview}
                            className={buttonClass(isActive("codeBlock"))}
                            title="Code Block"
                        >
                            {"{ }"}
                        </button>
                        <button
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            disabled={showPreview}
                            className={buttonClass()}
                            title="Horizontal Rule"
                        >
                            ---
                        </button>
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Text Alignment */}
                    <div className="flex gap-1">
                        {['left', 'center', 'right', 'justify'].map((align) => (
                            <button
                                key={align}
                                onClick={() => editor.chain().focus().setTextAlign(align).run()}
                                disabled={showPreview}
                                className={buttonClass(isActive({ textAlign: align }))}
                                title={`Align ${align}`}
                            >
                                {align === 'left' && '⟵'}
                                {align === 'center' && '⟷'}
                                {align === 'right' && '⟶'}
                                {align === 'justify' && '⟵⟶'}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Superscript/Subscript */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => editor.chain().focus().toggleSuperscript().run()}
                            disabled={showPreview}
                            className={buttonClass(isActive("superscript"))}
                            title="Superscript"
                        >
                            x²
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleSubscript().run()}
                            disabled={showPreview}
                            className={buttonClass(isActive("subscript"))}
                            title="Subscript"
                        >
                            x₂
                        </button>
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Highlight Colors */}
                    <div className="flex gap-1">
                        {['yellow', 'green', 'blue', 'red', 'purple'].map((color) => (
                            <button
                                key={color}
                                onClick={() => toggleHighlight(color)}
                                disabled={showPreview}
                                className={`w-6 h-6 rounded border-2 ${isActive('highlight', { color })
                                    ? 'border-gray-800 dark:border-white'
                                    : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                style={{ backgroundColor: getHighlightColor(color) }}
                                title={`Highlight ${color}`}
                            />
                        ))}
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Media & Links */}
                    <div className="flex gap-1">
                        <button
                            onClick={insertImage}
                            disabled={showPreview}
                            className={buttonClass()}
                            title="Insert Image"
                        >
                            🖼️
                        </button>
                        <button
                            onClick={isActive("link") ? removeLink : openLinkDialog}
                            disabled={showPreview}
                            className={buttonClass(isActive("link"))}
                            title={isActive("link") ? "Remove Link" : "Add Link"}
                        >
                            🔗
                        </button>
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Preview Toggle */}
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="ml-auto px-4 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        {showPreview ? "Edit" : "Preview"}
                    </button>
                </div>
            </div>

            {/* Link Dialog */}
            {showLinkDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Add Link</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Selected Text:</label>
                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                                    {linkText}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">URL:</label>
                                <input
                                    ref={linkDialogRef}
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    onKeyPress={(e) => e.key === 'Enter' && insertLink()}
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => setShowLinkDialog(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={insertLink}
                                    disabled={!linkUrl}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    Add Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Editor Container */}
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 min-h-[500px]">
                <EditorContent
                    editor={editor}
                    className="prose-editor-content"
                />
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                .prose-editor-content .ProseMirror {
                    outline: none;
                    padding: 1.5rem;
                    min-height: 500px;
                }
                
                /* Heading styles */
                .prose-editor-content .ProseMirror h1 {
                    font-size: 2rem;
                    font-weight: bold;
                    margin: 1.5rem 0 1rem 0;
                    line-height: 1.2;
                }
                
                .prose-editor-content .ProseMirror h2 {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin: 1.25rem 0 0.75rem 0;
                    line-height: 1.3;
                }
                
                .prose-editor-content .ProseMirror h3 {
                    font-size: 1.25rem;
                    font-weight: bold;
                    margin: 1rem 0 0.5rem 0;
                    line-height: 1.4;
                }
                
                .prose-editor-content .ProseMirror h4 {
                    font-size: 1.125rem;
                    font-weight: bold;
                    margin: 0.875rem 0 0.5rem 0;
                    line-height: 1.4;
                }
                
                /* List styles */
                .prose-editor-content .ProseMirror ul {
                    list-style-type: disc;
                    margin: 1rem 0;
                    padding-left: 1.5rem;
                }
                
                .prose-editor-content .ProseMirror ol {
                    list-style-type: decimal;
                    margin: 1rem 0;
                    padding-left: 1.5rem;
                }
                
                .prose-editor-content .ProseMirror li {
                    margin: 0.25rem 0;
                    line-height: 1.6;
                }
                
                .prose-editor-content .ProseMirror ul ul {
                    list-style-type: circle;
                    margin: 0.25rem 0;
                }
                
                .prose-editor-content .ProseMirror ul ul ul {
                    list-style-type: square;
                }
                
                /* Task list styles */
                .prose-editor-content .ProseMirror ul[data-type="taskList"] {
                    list-style: none;
                    padding-left: 0;
                    margin: 1rem 0;
                }
                
                .prose-editor-content .ProseMirror ul[data-type="taskList"] li {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.5rem;
                    margin: 0.5rem 0;
                }
                
                .prose-editor-content .ProseMirror ul[data-type="taskList"] li > label {
                    margin-top: 0.125rem;
                    cursor: pointer;
                }
                
                .prose-editor-content .ProseMirror ul[data-type="taskList"] li > label > input {
                    margin: 0;
                }
                
                .prose-editor-content .ProseMirror ul[data-type="taskList"] li > div {
                    flex: 1;
                }
                
                /* Highlight styles */
                .prose-editor-content .ProseMirror mark[data-color="yellow"] {
                    background-color: #fef08a;
                    color: #854d0e;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                }
                
                .prose-editor-content .ProseMirror mark[data-color="green"] {
                    background-color: #bbf7d0;
                    color: #14532d;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                }
                
                .prose-editor-content .ProseMirror mark[data-color="blue"] {
                    background-color: #bfdbfe;
                    color: #1e3a8a;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                }
                
                .prose-editor-content .ProseMirror mark[data-color="red"] {
                    background-color: #fecaca;
                    color: #7f1d1d;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                }
                
                .prose-editor-content .ProseMirror mark[data-color="purple"] {
                    background-color: #e9d5ff;
                    color: #581c87;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                }
                
                /* Code styles */
                .prose-editor-content .ProseMirror code {
                    background-color: #f3f4f6;
                    color: #374151;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                    font-size: 0.875em;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                }
                
                .prose-editor-content .ProseMirror pre {
                    background-color: #1f2937;
                    color: #f9fafb;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                    margin: 1rem 0;
                }
                
                .prose-editor-content .ProseMirror pre code {
                    background: none;
                    color: inherit;
                    padding: 0;
                    font-size: 0.875rem;
                }
                
                /* Blockquote styles */
                .prose-editor-content .ProseMirror blockquote {
                    border-left: 4px solid #e5e7eb;
                    padding-left: 1rem;
                    margin: 1rem 0;
                    font-style: italic;
                    color: #6b7280;
                }
                
                /* Image styles */
                .prose-editor-content .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                    margin: 1rem 0;
                }
                
                /* Paragraph styles */
                .prose-editor-content .ProseMirror p {
                    margin: 0.75rem 0;
                    line-height: 1.6;
                }
                
                /* Dark mode adjustments */
                .dark .prose-editor-content .ProseMirror code {
                    background-color: #374151;
                    color: #f3f4f6;
                }
                
                .dark .prose-editor-content .ProseMirror blockquote {
                    border-left-color: #4b5563;
                    color: #9ca3af;
                }
            `}</style>
        </div>
    );
}

// Helper function to get highlight colors
function getHighlightColor(color) {
    const colors = {
        yellow: '#fef08a',
        green: '#bbf7d0',
        blue: '#bfdbfe',
        red: '#fecaca',
        purple: '#e9d5ff'
    };
    return colors[color] || colors.yellow;
}