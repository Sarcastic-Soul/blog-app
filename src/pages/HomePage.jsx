import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    BookOpen,
    Coffee,
    Code,
    Zap,
    Users,
    Star,
    ArrowRight,
    Moon,
    Sun,
    Github,
    Twitter
} from 'lucide-react';

function HomePage() {
    const { user } = useAuth();

    // Initialize dark mode without causing re-renders
    const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem('darkMode');
        if (stored !== null) {
            return stored === 'true';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Apply dark mode to document - use useCallback to prevent re-creation
    const toggleDarkMode = useCallback(() => {
        setDarkMode(prev => {
            const newValue = !prev;
            localStorage.setItem('darkMode', newValue.toString());
            document.documentElement.classList.toggle('dark', newValue);
            return newValue;
        });
    }, []);

    // Apply dark mode on mount only
    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, []); // Only run on mount

    const features = [
        {
            icon: BookOpen,
            title: "Satirical Tech Commentary",
            description: "Where code meets comedy and bugs become features (temporarily)."
        },
        {
            icon: Coffee,
            title: "Caffeine-Powered Insights",
            description: "Deep thoughts from the depths of endless coffee cups and rubber duck conversations."
        },
        {
            icon: Code,
            title: "Real Developer Stories",
            description: "Honest tales from the trenches of software development, minus the corporate speak."
        },
        {
            icon: Zap,
            title: "Quick Duck Debugging",
            description: "Professional rubber duck consultation services for your most perplexing problems."
        }
    ];

    const stats = [
        { number: "47", label: "Rubber Ducks", subtext: "And counting" },
        { number: "∞", label: "Coffee Consumed", subtext: "Liters" },
        { number: "404", label: "Bugs Fixed", subtext: "This week" },
        { number: "1", label: "Duck with Knife", subtext: "Very dangerous" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-black dark:text-white">
            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between p-6 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <span className="text-3xl">🦆</span>
                    <span className="text-2xl font-bold text-yellow-300">Ink & Irony</span>
                </motion.div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {user ? (
                        <Link
                            to="/blogs"
                            className="px-6 py-2 bg-yellow-300 text-black rounded-full hover:bg-yellow-400 transition-colors font-medium"
                        >
                            Go to Blogs
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="px-6 py-2 bg-yellow-300 text-black rounded-full hover:bg-yellow-400 transition-colors font-medium"
                        >
                            Get Started
                        </Link>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-medium"
                                >
                                    <Star className="w-4 h-4" />
                                    Where Chaos Meets Code
                                </motion.div>

                                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                                    <span className="text-gray-900 dark:text-white">Welcome to </span>
                                    <span className="text-yellow-400">Ink & Irony</span>
                                </h1>

                                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
                                    A satirical tech blog where rubber ducks debug code, coffee fuels creativity,
                                    and every line of code has a story worth telling.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/blogs"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-300 text-black rounded-full hover:bg-yellow-400 transition-all hover:scale-105 font-semibold shadow-lg"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    Read the Chaos
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <Link
                                    to="/about"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition-all hover:scale-105 font-semibold"
                                >
                                    Meet the Duck
                                </Link>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-4 pt-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Follow the chaos:</span>
                                <div className="flex gap-3">
                                    <a
                                        href="https://github.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-yellow-300 dark:hover:bg-yellow-300 hover:text-black transition-colors"
                                    >
                                        <Github className="w-4 h-4" />
                                    </a>
                                    <a
                                        href="https://twitter.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-yellow-300 dark:hover:bg-yellow-300 hover:text-black transition-colors"
                                    >
                                        <Twitter className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="relative"
                        >
                            <div className="relative w-full max-w-md mx-auto">
                                {/* Floating Elements */}
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, 5, 0]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center text-2xl shadow-lg"
                                >
                                    ☕
                                </motion.div>

                                <motion.div
                                    animate={{
                                        y: [0, 10, 0],
                                        rotate: [0, -5, 0]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute -bottom-6 -left-6 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-lg shadow-lg"
                                >
                                    💻
                                </motion.div>

                                {/* Main Duck */}
                                <div className="w-80 h-80 bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-9xl shadow-2xl">
                                    <motion.span
                                        animate={{
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        🦆
                                    </motion.span>
                                </div>

                                {/* Floating Code Snippets */}
                                <motion.div
                                    animate={{
                                        y: [0, -8, 0],
                                        opacity: [0.7, 1, 0.7]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute top-1/4 -left-8 px-3 py-2 bg-black text-green-400 rounded text-sm font-mono shadow-lg"
                                >
                                    console.log("🦆")
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            What Makes This Duck <span className="text-yellow-400">Special?</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            More than just another tech blog - it's a satirical journey through the absurdities of software development.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all hover:scale-105"
                                >
                                    <div className="w-12 h-12 bg-yellow-300 rounded-lg flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-black" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-r from-yellow-300 to-orange-400 text-black">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">By the Numbers</h2>
                        <p className="text-xl opacity-80">
                            Some completely scientific metrics from the duck universe
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="text-center p-6 bg-white/20 rounded-xl backdrop-blur-sm"
                            >
                                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                                <div className="text-sm opacity-75">{stat.subtext}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-900 dark:bg-black text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl font-bold">
                            Ready to Embrace the <span className="text-yellow-400">Chaos?</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Join the community of developers who aren't afraid to laugh at themselves,
                            learn from their mistakes, and share the journey.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/blogs"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-300 text-black rounded-full hover:bg-yellow-400 transition-all hover:scale-105 font-semibold"
                            >
                                <BookOpen className="w-5 h-5" />
                                Start Reading
                            </Link>

                            {!user && (
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 px-8 py-4 border-2 border-yellow-300 text-yellow-300 rounded-full hover:bg-yellow-300 hover:text-black transition-all hover:scale-105 font-semibold"
                                >
                                    <Users className="w-5 h-5" />
                                    Join the Duck Army
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-2xl">🦆</span>
                        <span className="font-bold text-yellow-300">Ink & Irony</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        "In code we trust, in ducks we debug." - The Chaotic Duck
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
