export const blogPosts = [
    {
        id: "chaotic-duck-revolution",
        title: "The Chaotic Duck Revolution",
        excerpt:
            "A satirical dive into the uprising of ducks wielding cutlery in a modern dystopia.",
        content: {
            type: "doc",
            content: [
                // Heading
                {
                    type: "heading",
                    attrs: { level: 2 },
                    content: [{ type: "text", text: "Rise of the Ducks" }],
                },
                // Paragraph
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text:
                                "Once docile creatures, ducks now rise with blades clenched in their beaks …",
                        },
                    ],
                },
                // Blockquote
                {
                    type: "blockquote",
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                { type: "text", text: "Never trust a duck with a knife." },
                            ],
                        },
                    ],
                },
                // Code block with syntax highlighting
                {
                    type: "codeBlock",
                    attrs: { language: "javascript" },
                    content: [
                        { type: "text", text: `console.log("Quack!");` },
                    ],
                },
                // More paragraphs, images, lists, etc.
            ],
        },
        headerImage: "/assets/duck1.jpg",
        tags: ["satire", "ducks", "revolution"],
        createdAt: "2025-06-06T12:00:00Z",
        updatedAt: "2025-06-07T15:00:00Z",
        isPublished: true,
    },
    {
        id: "debugging-with-rubber-ducks",
        title: "Debugging with Rubber Ducks: A Complete Guide",
        excerpt:
            "Why talking to a rubber duck is more effective than talking to your senior developer.",
        content: {
            type: "doc",
            content: [
                {
                    type: "heading",
                    attrs: { level: 2 },
                    content: [{ type: "text", text: "The Science Behind Duck Debugging" }],
                },
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: "In the mystical world of software development, there exists a practice so profound, so revolutionary, that it has single-handedly solved more bugs than Stack Overflow and coffee combined. This practice, known as 'rubber duck debugging,' involves explaining your code to a small, yellow, bath-time companion."
                        }
                    ]
                }
            ]
        },
        headerImage: "/assets/duck2.jpg",
        tags: ["debugging", "programming", "tips", "ducks"],
        createdAt: "2025-01-15T10:30:00Z",
        updatedAt: "2025-01-15T10:30:00Z",
        isPublished: true,
    },
    {
        id: "css-is-awesome-not",
        title: "CSS is Awesome... Not: A Love-Hate Relationship",
        excerpt:
            "Exploring the beautiful chaos that is CSS and why it makes us question our life choices.",
        content: {
            type: "doc",
            content: [
                {
                    type: "heading",
                    attrs: { level: 2 },
                    content: [{ type: "text", text: "The CSS Paradox" }],
                },
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: "CSS is like that friend who promises to help you move but shows up three hours late with just a sandwich. It's powerful, essential, and absolutely maddening all at once."
                        }
                    ]
                }
            ]
        },
        headerImage: "/assets/duck3.jpg",
        tags: ["css", "web-development", "rant", "frontend"],
        createdAt: "2025-01-20T14:45:00Z",
        updatedAt: "2025-01-20T14:45:00Z",
        isPublished: true,
    },
    {
        id: "javascript-frameworks-existential-crisis",
        title: "JavaScript Frameworks: An Existential Crisis",
        excerpt:
            "There's a new JS framework every 5 minutes. Here's my mental breakdown about it.",
        content: {
            type: "doc",
            content: [
                {
                    type: "heading",
                    attrs: { level: 2 },
                    content: [{ type: "text", text: "The Framework Fatigue is Real" }],
                },
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: "Remember when we just had jQuery? Those were simpler times. Now we have React, Vue, Angular, Svelte, Solid, Qwik, and probably seven new ones that were created while you read this sentence."
                        }
                    ]
                }
            ]
        },
        headerImage: "/assets/duck1.jpg",
        tags: ["javascript", "frameworks", "mental-health", "programming"],
        createdAt: "2025-01-25T09:15:00Z",
        updatedAt: "2025-01-25T09:15:00Z",
        isPublished: true,
    },
    {
        id: "git-commit-messages-poetry",
        title: "Git Commit Messages as Modern Poetry",
        excerpt:
            "An artistic analysis of the haikus hidden in our everyday commit messages.",
        content: {
            type: "doc",
            content: [
                {
                    type: "heading",
                    attrs: { level: 2 },
                    content: [{ type: "text", text: "The Art of the Commit" }],
                },
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: "Who says programmers aren't poets? Every commit message is a small work of art, expressing the developer's soul in 50 characters or less. 'fix bug' - such minimalism! 'WIP WIP WIP' - the anxiety is palpable!"
                        }
                    ]
                }
            ]
        },
        headerImage: "/assets/duck2.jpg",
        tags: ["git", "poetry", "version-control", "humor"],
        createdAt: "2025-01-10T16:20:00Z",
        updatedAt: "2025-01-10T16:20:00Z",
        isPublished: true,
    },
    {
        id: "tabs-vs-spaces-final-answer",
        title: "Tabs vs Spaces: The Final Answer (Spoiler: You're Wrong)",
        excerpt:
            "Settling the age-old debate once and for all with irrefutable duck logic.",
        content: {
            type: "doc",
            content: [
                {
                    type: "heading",
                    attrs: { level: 2 },
                    content: [{ type: "text", text: "The Great Indentation War" }],
                },
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: "In the beginning, there was code. And the code was without form, and void. And the spirit of the developer moved upon the face of the keyboard. And the developer said, 'Let there be indentation.' And there was indentation. And it was chaos."
                        }
                    ]
                }
            ]
        },
        headerImage: "/assets/duck3.jpg",
        tags: ["programming", "debate", "tabs", "spaces", "philosophy"],
        createdAt: "2025-01-05T11:00:00Z",
        updatedAt: "2025-01-05T11:00:00Z",
        isPublished: true,
    },
    {
        id: "api-documentation-horror-story",
        title: "API Documentation: A Horror Story",
        excerpt:
            "The terrifying tale of endpoints with no examples and error codes that don't exist.",
        content: {
            type: "doc",
            content: [
                {
                    type: "heading",
                    attrs: { level: 2 },
                    content: [{ type: "text", text: "Chapter 1: The Mysterious Endpoint" }],
                },
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: "It was a dark and stormy night when I first encountered the API documentation. The examples were missing, the schemas were wrong, and the error messages were written in what I can only assume was ancient Sumerian."
                        }
                    ]
                }
            ]
        },
        headerImage: "/assets/duck1.jpg",
        tags: ["api", "documentation", "horror", "developer-experience"],
        createdAt: "2025-01-12T13:30:00Z",
        updatedAt: "2025-01-12T13:30:00Z",
        isPublished: true,
    },
    {
        id: "naming-things-hardest-problem",
        title: "Naming Things: The Hardest Problem in Computer Science",
        excerpt:
            "Why 'data', 'info', and 'manager' appear in 90% of all variable names.",
        content: {
            type: "doc",
            content: [
                {
                    type: "heading",
                    attrs: { level: 2 },
                    content: [{ type: "text", text: "The Naming Convention Nightmare" }],
                },
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: "There are only two hard things in Computer Science: cache invalidation, naming things, and off-by-one errors. Today we tackle the second hardest: why my codebase has 47 variables that start with 'temp' and a function called 'doTheThing'."
                        }
                    ]
                }
            ]
        },
        headerImage: "/assets/duck2.jpg",
        tags: ["programming", "naming", "best-practices", "humor"],
        createdAt: "2025-01-18T08:45:00Z",
        updatedAt: "2025-01-18T08:45:00Z",
        isPublished: true,
    }
];  