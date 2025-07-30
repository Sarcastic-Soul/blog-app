// src/components/BlogContentEditor.jsx
import React, { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import {
    Bold, Italic, Underline, Strikethrough, Code, List, ListOrdered,
    Quote, Image as ImageIcon, Link as LinkIcon, AlignLeft, AlignCenter,
    AlignRight, AlignJustify, Heading1, Heading2, Heading3, Heading4,
    Undo, Redo, Edit3, Type, Palette, Minus
} from "lucide-react";

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
import { Underline as UnderlineExtension } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Blockquote } from "@tiptap/extension-blockquote";

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
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [linkText, setLinkText] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageAlt, setImageAlt] = useState("");
    const linkDialogRef = useRef(null);
    const imageDialogRef = useRef(null);

    // Auto-save content to localStorage
    const saveToLocalStorage = (content) => {
        try {
            localStorage.setItem('blog-editor-content', JSON.stringify(content));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    };

    // Load content from localStorage
    const loadFromLocalStorage = () => {
        try {
            const saved = localStorage.getItem('blog-editor-content');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
            return null;
        }
    };

    const editor = useEditor({
        editable: true,
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                blockquote: false,
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'hljs code-block',
                }
            }),
            Blockquote.configure({
                HTMLAttributes: {
                    class: 'custom-blockquote',
                }
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'blog-image',
                },
                inline: false,
                allowBase64: true,
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
                HTMLAttributes: {
                    class: 'task-item',
                }
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"]
            }),
            Typography,
            Highlight.configure({
                multicolor: true,
                HTMLAttributes: {
                    class: 'highlight-text',
                }
            }),
            Subscript,
            Superscript,
            UnderlineExtension,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'blog-link',
                },
            }),
        ],
        content: initialContent || loadFromLocalStorage() || `
            <h1>Welcome to Your Blog Editor</h1>
            <p>Start writing your amazing blog post here! This editor provides all the tools you need to create professional content.</p>
            <h2>What you can do:</h2>
            <ul>
                <li><strong>Format text</strong> with bold, italic, underline, and more</li>
                <li><strong>Add headings</strong> to structure your content</li>
                <li><strong>Create lists</strong> and task lists for better organization</li>
                <li><strong>Insert images</strong> and links to enrich your content</li>
                <li><strong>Use code blocks</strong> with syntax highlighting</li>
                <li><strong>Highlight important text</strong> with different colors</li>
            </ul>
            <blockquote>
                <p>Start creating something amazing!</p>
            </blockquote>
        `,
        editorProps: {
            attributes: {
                class: "blog-editor-content focus:outline-none",
                spellcheck: "true",
            },
        },
        onUpdate: ({ editor }) => {
            const content = editor.getJSON();
            // Auto-save to localStorage
            saveToLocalStorage(content);
            // Call parent callback
            if (onContentUpdate) {
                onContentUpdate(content);
            }
        },
    });

    // Handle dialogs
    useEffect(() => {
        if (showLinkDialog && linkDialogRef.current) {
            linkDialogRef.current.focus();
        }
    }, [showLinkDialog]);

    useEffect(() => {
        if (showImageDialog && imageDialogRef.current) {
            imageDialogRef.current.focus();
        }
    }, [showImageDialog]);

    if (!editor) {
        return (
            <div className="flex items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading editor...</p>
                </div>
            </div>
        );
    }

    // Helper functions
    const isActive = (name, attrs = {}) => editor.isActive(name, attrs);

    const ToolbarButton = ({ onClick, disabled, active, title, children, className = "" }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
                relative p-2 rounded-lg transition-all duration-200 group
                ${active
                    ? 'bg-yellow-400 text-gray-900 shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}
                ${className}
            `}
        >
            {children}
            {title && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    {title}
                </div>
            )}
        </button>
    );

    const ColorButton = ({ color, active, onClick, title }) => (
        <button
            onClick={onClick}
            disabled={false}
            title={title}
            className={`
                w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110
                ${active
                    ? 'border-gray-900 dark:border-white shadow-lg'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }
                cursor-pointer
            `}
            style={{ backgroundColor: getHighlightColor(color) }}
        />
    );

    const insertImage = () => {
        setImageUrl("");
        setImageAlt("");
        setShowImageDialog(true);
    };

    const handleImageInsert = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({
                src: imageUrl,
                alt: imageAlt || "Blog image"
            }).run();
        }
        setShowImageDialog(false);
        setImageUrl("");
        setImageAlt("");
    };

    const insertCodeBlock = () => {
        const language = window.prompt(
            "Enter programming language (javascript, python, css, html, etc.):",
            "javascript"
        );
        editor.chain().focus().toggleCodeBlock({ language: language || null }).run();
    };

    const toggleHighlight = (color) => {
        if (editor.isActive('highlight', { color })) {
            editor.chain().focus().unsetHighlight().run();
        } else {
            editor.chain().focus().setHighlight({ color }).run();
        }
    };

    const openLinkDialog = () => {
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

    // Function to clear saved content (call this when blog is published)
    const clearSavedContent = () => {
        try {
            localStorage.removeItem('blog-editor-content');
        } catch (error) {
            console.warn('Failed to clear localStorage:', error);
        }
    };

    // Expose clearSavedContent function to parent component
    useEffect(() => {
        if (onContentUpdate && typeof onContentUpdate === 'function') {
            onContentUpdate.clearSaved = clearSavedContent;
        }
    }, [onContentUpdate]);

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center">
                <div className="flex items-center space-x-3">
                    <Edit3 className="h-6 w-6 text-yellow-400" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Blog Editor
                    </h2>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Undo/Redo */}
                    <div className="flex items-center space-x-1">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            title="Redo (Ctrl+Y)"
                        >
                            <Redo className="h-4 w-4" />
                        </ToolbarButton>
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Headings */}
                    <div className="flex items-center space-x-1">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            active={isActive("heading", { level: 1 })}
                            title="Heading 1"
                        >
                            <Heading1 className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            active={isActive("heading", { level: 2 })}
                            title="Heading 2"
                        >
                            <Heading2 className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            active={isActive("heading", { level: 3 })}
                            title="Heading 3"
                        >
                            <Heading3 className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                            active={isActive("heading", { level: 4 })}
                            title="Heading 4"
                        >
                            <Heading4 className="h-4 w-4" />
                        </ToolbarButton>
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Text Formatting */}
                    <div className="flex items-center space-x-1">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            active={isActive("bold")}
                            title="Bold (Ctrl+B)"
                        >
                            <Bold className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            active={isActive("italic")}
                            title="Italic (Ctrl+I)"
                        >
                            <Italic className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            active={isActive("underline")}
                            title="Underline (Ctrl+U)"
                        >
                            <Underline className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            active={isActive("strike")}
                            title="Strikethrough"
                        >
                            <Strikethrough className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            active={isActive("code")}
                            title="Inline Code"
                        >
                            <Code className="h-4 w-4" />
                        </ToolbarButton>
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Lists */}
                    <div className="flex items-center space-x-1">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            active={isActive("bulletList")}
                            title="Bullet List"
                        >
                            <List className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            active={isActive("orderedList")}
                            title="Numbered List"
                        >
                            <ListOrdered className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleTaskList().run()}
                            active={isActive("taskList")}
                            title="Task List"
                            className="font-mono text-sm"
                        >
                            ☑
                        </ToolbarButton>
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Block Elements */}
                    <div className="flex items-center space-x-1">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            active={isActive("blockquote")}
                            title="Quote"
                        >
                            <Quote className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={insertCodeBlock}
                            active={isActive("codeBlock")}
                            title="Code Block"
                            className="font-mono text-sm"
                        >
                            {"{ }"}
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            title="Horizontal Rule"
                        >
                            <Minus className="h-4 w-4" />
                        </ToolbarButton>
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Text Alignment */}
                    <div className="flex items-center space-x-1">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            active={isActive({ textAlign: 'left' })}
                            title="Align Left"
                        >
                            <AlignLeft className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            active={isActive({ textAlign: 'center' })}
                            title="Align Center"
                        >
                            <AlignCenter className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            active={isActive({ textAlign: 'right' })}
                            title="Align Right"
                        >
                            <AlignRight className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                            active={isActive({ textAlign: 'justify' })}
                            title="Justify"
                        >
                            <AlignJustify className="h-4 w-4" />
                        </ToolbarButton>
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Superscript/Subscript */}
                    <div className="flex items-center space-x-1">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleSuperscript().run()}
                            active={isActive("superscript")}
                            title="Superscript"
                            className="text-xs"
                        >
                            x²
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleSubscript().run()}
                            active={isActive("subscript")}
                            title="Subscript"
                            className="text-xs"
                        >
                            x₂
                        </ToolbarButton>
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Highlight Colors */}
                    <div className="flex items-center space-x-2">
                        <Palette className="h-4 w-4 text-gray-500" />
                        <div className="flex space-x-1">
                            {['yellow', 'green', 'blue', 'red', 'purple'].map((color) => (
                                <ColorButton
                                    key={color}
                                    color={color}
                                    active={isActive('highlight', { color })}
                                    onClick={() => toggleHighlight(color)}
                                    title={`Highlight ${color}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                    {/* Media & Links */}
                    <div className="flex items-center space-x-1">
                        <ToolbarButton
                            onClick={insertImage}
                            title="Insert Image"
                        >
                            <ImageIcon className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={isActive("link") ? removeLink : openLinkDialog}
                            active={isActive("link")}
                            title={isActive("link") ? "Remove Link" : "Add Link"}
                        >
                            <LinkIcon className="h-4 w-4" />
                        </ToolbarButton>
                    </div>
                </div>
            </div>

            {/* Link Dialog */}
            {showLinkDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Add Link
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Selected Text:
                                    </label>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600">
                                        {linkText}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        URL:
                                    </label>
                                    <input
                                        ref={linkDialogRef}
                                        type="url"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                        onKeyPress={(e) => e.key === 'Enter' && insertLink()}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    onClick={() => setShowLinkDialog(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={insertLink}
                                    disabled={!linkUrl}
                                    className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Dialog */}
            {showImageDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Insert Image
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Image URL:
                                    </label>
                                    <input
                                        ref={imageDialogRef}
                                        type="url"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Alt Text (Optional):
                                    </label>
                                    <input
                                        type="text"
                                        value={imageAlt}
                                        onChange={(e) => setImageAlt(e.target.value)}
                                        placeholder="Describe the image..."
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                        onKeyPress={(e) => e.key === 'Enter' && handleImageInsert()}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    onClick={() => setShowImageDialog(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleImageInsert}
                                    disabled={!imageUrl}
                                    className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Insert Image
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Editor Container */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                <EditorContent
                    editor={editor}
                    className="blog-editor-wrapper"
                />
            </div>

            {/* Custom Styles */}
            <style>{`
                .blog-editor-wrapper .ProseMirror {
                    outline: none;
                    padding: 2rem;
                    min-height: 600px;
                    max-width: none;
                    font-family: 'Inter', sans-serif;
                    line-height: 1.7;
                    color: #111827 !important;
                }
                
                .dark .blog-editor-wrapper .ProseMirror {
                    color: #f9fafb !important;
                }
                
                /* Ensure text input is always visible */
                .blog-editor-wrapper .ProseMirror * {
                    color: inherit !important;
                }
                
                .blog-editor-wrapper .ProseMirror p {
                    color: #111827 !important;
                }
                
                .dark .blog-editor-wrapper .ProseMirror p {
                    color: #f9fafb !important;
                }
                
                /* Heading styles matching the blog theme */
                .blog-editor-wrapper .ProseMirror h1 {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin: 2rem 0 1.5rem 0;
                    line-height: 1.2;
                    color: #fbbf24;
                }
                
                .blog-editor-wrapper .ProseMirror h2 {
                    font-size: 2rem;
                    font-weight: 600;
                    margin: 1.75rem 0 1rem 0;
                    line-height: 1.3;
                    color: #374151;
                }
                
                .dark .blog-editor-wrapper .ProseMirror h2 {
                    color: #f3f4f6;
                }
                
                .blog-editor-wrapper .ProseMirror h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 1.5rem 0 0.75rem 0;
                    line-height: 1.4;
                    color: #374151;
                }
                
                .dark .blog-editor-wrapper .ProseMirror h3 {
                    color: #f3f4f6;
                }
                
                .blog-editor-wrapper .ProseMirror h4 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 1.25rem 0 0.5rem 0;
                    line-height: 1.4;
                    color: #374151;
                }
                
                .dark .blog-editor-wrapper .ProseMirror h4 {
                    color: #f3f4f6;
                }
                
                /* Paragraph styles */
                .blog-editor-wrapper .ProseMirror p {
                    margin: 1rem 0;
                    line-height: 1.7;
                    font-size: 1.1rem;
                }
                
                /* List styles */
                .blog-editor-wrapper .ProseMirror ul,
                .blog-editor-wrapper .ProseMirror ol {
                    margin: 1.5rem 0;
                    padding-left: 2rem;
                }
                
                .blog-editor-wrapper .ProseMirror ul {
                    list-style-type: disc;
                }
                
                .blog-editor-wrapper .ProseMirror ol {
                    list-style-type: decimal;
                }
                
                .blog-editor-wrapper .ProseMirror li {
                    margin: 0.5rem 0;
                    line-height: 1.6;
                    font-size: 1.1rem;
                }
                
                .blog-editor-wrapper .ProseMirror ul ul {
                    list-style-type: circle;
                    margin: 0.5rem 0;
                }
                
                .blog-editor-wrapper .ProseMirror ul ul ul {
                    list-style-type: square;
                }
                
                /* Task list styles */
                .blog-editor-wrapper .ProseMirror .task-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    margin: 0.75rem 0;
                    list-style: none;
                }
                
                .blog-editor-wrapper .ProseMirror .task-item > label {
                    margin-top: 0.125rem;
                    cursor: pointer;
                    flex-shrink: 0;
                }
                
                .blog-editor-wrapper .ProseMirror .task-item > label > input {
                    margin: 0;
                    width: 1.25rem;
                    height: 1.25rem;
                    accent-color: #fbbf24;
                }
                
                .blog-editor-wrapper .ProseMirror .task-item > div {
                    flex: 1;
                    font-size: 1.1rem;
                }
                
                /* Blockquote styles matching the blog theme */
                .blog-editor-wrapper .ProseMirror .custom-blockquote {
                    border-left: 4px solid #fbbf24;
                    padding: 1.5rem 2rem;
                    margin: 2rem 0;
                    background: #fffbeb;
                    border-radius: 0 0.5rem 0.5rem 0;
                    font-style: italic;
                    font-size: 1.125rem;
                    color: #92400e;
                    position: relative;
                }
                
                .dark .blog-editor-wrapper .ProseMirror .custom-blockquote {
                    background: #1f2937;
                    color: #fcd34d;
                    border-left-color: #fbbf24;
                }
                
                .blog-editor-wrapper .ProseMirror .custom-blockquote::before {
                    content: '"';
                    font-size: 4rem;
                    color: #fbbf24;
                    position: absolute;
                    left: 0.5rem;
                    top: -0.5rem;
                    line-height: 1;
                    opacity: 0.3;
                }
                
                /* Code styles */
                .blog-editor-wrapper .ProseMirror code {
                    background: #f3f4f6;
                    color: #dc2626;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.375rem;
                    font-size: 0.9em;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    font-weight: 500;
                }
                
                .dark .blog-editor-wrapper .ProseMirror code {
                    background: #374151;
                    color: #fca5a5;
                }
                
                /* Code block styles */
                .blog-editor-wrapper .ProseMirror .code-block {
                    background: #1f2937;
                    color: #f9fafb;
                    padding: 1.5rem;
                    border-radius: 0.75rem;
                    overflow-x: auto;
                    margin: 2rem 0;
                    border: 1px solid #374151;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    font-size: 0.875rem;
                    line-height: 1.5;
                }
                
                .blog-editor-wrapper .ProseMirror .code-block code {
                    background: none;
                    color: inherit;
                    padding: 0;
                    font-size: inherit;
                }
                
                /* Image styles matching the blog theme */
                .blog-editor-wrapper .ProseMirror .blog-image {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.75rem;
                    margin: 2rem auto;
                    display: block;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                
                /* Link styles matching the blog theme */
                .blog-editor-wrapper .ProseMirror .blog-link {
                    color: #fbbf24;
                    text-decoration: underline;
                    text-decoration-color: #fbbf24;
                    text-underline-offset: 0.125rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                
                .blog-editor-wrapper .ProseMirror .blog-link:hover {
                    color: #f59e0b;
                    text-decoration-color: #f59e0b;
                }
                
                /* Highlight styles */
                .blog-editor-wrapper .ProseMirror .highlight-text[data-color="yellow"] {
                    background: linear-gradient(120deg, #fef08a 0%, #fef08a 100%);
                    background-repeat: no-repeat;
                    background-size: 100% 0.75em;
                    background-position: 0 88%;
                    color: #854d0e;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                }
                
                .blog-editor-wrapper .ProseMirror .highlight-text[data-color="green"] {
                    background: linear-gradient(120deg, #bbf7d0 0%, #bbf7d0 100%);
                    background-repeat: no-repeat;
                    background-size: 100% 0.75em;
                    background-position: 0 88%;
                    color: #14532d;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                }
                
                .blog-editor-wrapper .ProseMirror .highlight-text[data-color="blue"] {
                    background: linear-gradient(120deg, #bfdbfe 0%, #bfdbfe 100%);
                    background-repeat: no-repeat;
                    background-size: 100% 0.75em;
                    background-position: 0 88%;
                    color: #1e3a8a;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                }
                
                .blog-editor-wrapper .ProseMirror .highlight-text[data-color="red"] {
                    background: linear-gradient(120deg, #fecaca 0%, #fecaca 100%);
                    background-repeat: no-repeat;
                    background-size: 100% 0.75em;
                    background-position: 0 88%;
                    color: #7f1d1d;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                }
                
                .blog-editor-wrapper .ProseMirror .highlight-text[data-color="purple"] {
                    background: linear-gradient(120deg, #e9d5ff 0%, #e9d5ff 100%);
                    background-repeat: no-repeat;
                    background-size: 100% 0.75em;
                    background-position: 0 88%;
                    color: #581c87;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                }
                
                /* Horizontal rule */
                .blog-editor-wrapper .ProseMirror hr {
                    border: none;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #fbbf24, transparent);
                    margin: 3rem 0;
                    border-radius: 1px;
                }
                
                /* Focus styles */
                .blog-editor-wrapper .ProseMirror:focus {
                    outline: none;
                }
                
                /* Selection styles */
                .blog-editor-wrapper .ProseMirror ::selection {
                    background: #fef3c7;
                    color: #92400e;
                }
                
                .dark .blog-editor-wrapper .ProseMirror ::selection {
                    background: #92400e;
                    color: #fef3c7;
                }
                
                /* Text alignment */
                .blog-editor-wrapper .ProseMirror [style*="text-align: center"] {
                    text-align: center;
                }
                
                .blog-editor-wrapper .ProseMirror [style*="text-align: right"] {
                    text-align: right;
                }
                
                .blog-editor-wrapper .ProseMirror [style*="text-align: justify"] {
                    text-align: justify;
                }
                
                /* Superscript and subscript */
                .blog-editor-wrapper .ProseMirror sup {
                    font-size: 0.75em;
                    vertical-align: super;
                }
                
                .blog-editor-wrapper .ProseMirror sub {
                    font-size: 0.75em;
                    vertical-align: sub;
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