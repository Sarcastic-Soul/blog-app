import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { Github, Mail, Twitter, Coffee, Code, Heart } from "lucide-react";

function AboutPage() {
    const skills = [
        "React", "Node.js", "TypeScript", "Python", "Appwrite",
        "TailwindCSS", "Next.js", "MongoDB", "Express.js", "Git"
    ];

    const socialLinks = [
        { icon: Github, href: "https://github.com", label: "GitHub" },
        { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
        { icon: Mail, href: "mailto:contact@example.com", label: "Email" },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
            <Header />

            <main className="max-w-4xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-12"
                >
                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 flex items-center justify-center text-6xl"
                        >
                            🦆
                        </motion.div>

                        <motion.h1
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-4xl font-bold text-yellow-300"
                        >
                            About the Chaotic Duck
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
                        >
                            Welcome to my corner of the internet where satire meets substance,
                            and rubber ducks wield more power than they should.
                        </motion.p>
                    </div>

                    {/* About Me Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 space-y-6"
                    >
                        <h2 className="text-3xl font-bold text-yellow-300 flex items-center gap-3">
                            <Heart className="w-8 h-8 text-red-500" />
                            Who Am I?
                        </h2>

                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed">
                                I'm a developer who believes that the best code is written with a sense of humor
                                and a healthy dose of skepticism. When I'm not wrestling with bugs or contemplating
                                the existential crisis of semicolons, I write about the absurdities of tech life.
                            </p>

                            <p className="text-lg leading-relaxed">
                                This blog is my digital playground where I share satirical takes on programming,
                                life lessons learned from rubber ducks, and occasionally some actual useful content
                                (though the ducks would argue everything is useful if you squint hard enough).
                            </p>

                            <p className="text-lg leading-relaxed">
                                My writing style can best be described as "caffeinated chaos with a purpose" -
                                equal parts educational and entertaining, with just enough irreverence to keep
                                things interesting.
                            </p>
                        </div>
                    </motion.div>

                    {/* Skills Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold text-yellow-300 flex items-center gap-3">
                            <Code className="w-8 h-8" />
                            Tech Arsenal
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {skills.map((skill, index) => (
                                <motion.div
                                    key={skill}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                                    className="bg-gradient-to-r from-yellow-300 to-orange-400 text-black px-4 py-2 rounded-full text-center font-medium text-sm hover:scale-105 transition-transform"
                                >
                                    {skill}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Fun Facts Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 space-y-6"
                    >
                        <h2 className="text-3xl font-bold text-yellow-300 flex items-center gap-3">
                            <Coffee className="w-8 h-8" />
                            Random Duck Facts
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                    ☕ Coffee Consumption
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Enough to power a small server farm. My code quality is directly proportional
                                    to my caffeine levels.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                    🦆 Rubber Duck Collection
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    47 and counting. Each one specializes in debugging different types of problems.
                                    The pirate duck is particularly good with JavaScript.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                    🌙 Preferred Coding Hours
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Between 10 PM and 3 AM, when the bugs are asleep and can't fight back.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                    📚 Learning Philosophy
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Break it, fix it, break it again, then write a satirical blog post about the experience.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                        className="text-center space-y-6"
                    >
                        <h2 className="text-3xl font-bold text-yellow-300">Let's Connect</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Got a duck-related coding problem? Want to debate the philosophical implications
                            of tabs vs spaces? Or just want to say hi? I'm always up for a good conversation.
                        </p>

                        <div className="flex justify-center gap-6">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-yellow-300 dark:hover:bg-yellow-300 hover:text-black transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{label}</span>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quote Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="text-center py-12"
                    >
                        <blockquote className="text-2xl font-bold text-yellow-300 italic">
                            "In code we trust, in ducks we debug."
                        </blockquote>
                        <p className="text-gray-500 dark:text-gray-500 mt-2">- The Chaotic Duck</p>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}

export default AboutPage;