
import React from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LogIn, ArrowLeft, Shield, Zap, Users, Coffee } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const { loginWithGoogle } = useAuth();

    const benefits = [
        {
            icon: Shield,
            title: "Admin Access",
            description: "Create and manage your own satirical masterpieces"
        },
        {
            icon: Zap,
            title: "Early Access",
            description: "Be the first to read the latest chaotic content"
        },
        {
            icon: Users,
            title: "Duck Community",
            description: "Join fellow developers in rubber duck solidarity"
        },
        {
            icon: Coffee,
            title: "Caffeine Credits",
            description: "Virtual coffee points for engaging with content"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-300 rounded-full blur-3xl"></div>
                <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-orange-300 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-red-300 rounded-full blur-3xl"></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 p-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </nav>

            <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Login Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full max-w-md mx-auto lg:mx-0"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="w-20 h-20 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg"
                                >
                                    🦆
                                </motion.div>

                                <motion.h1
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                                >
                                    Welcome Back
                                </motion.h1>

                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="text-gray-600 dark:text-gray-400"
                                >
                                    Enter the chaotic realm of satirical ducks and honest blog posts
                                </motion.p>
                            </div>

                            {/* Login Button */}
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="space-y-6"
                            >
                                <motion.button
                                    onClick={loginWithGoogle}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-yellow-300 to-orange-400 text-black font-semibold rounded-xl hover:from-yellow-400 hover:to-orange-500 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <img
                                        src="/assets/google-icon.svg"
                                        alt="Google"
                                        className="w-5 h-5"
                                    />
                                    <LogIn className="w-5 h-5" />
                                    Continue with Google
                                </motion.button>

                                {/* Divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                                            Quick & Secure Authentication
                                        </span>
                                    </div>
                                </div>

                                {/* Benefits Preview */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                        What you'll get:
                                    </h3>
                                    <div className="space-y-2">
                                        {benefits.slice(0, 2).map((benefit, index) => {
                                            const Icon = benefit.icon;
                                            return (
                                                <div key={benefit.title} className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                                        <Icon className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                            {benefit.title}
                                                        </p>
                                                        <p className="text-gray-600 dark:text-gray-400 text-xs">
                                                            {benefit.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Footer */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center"
                            >
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    By logging in, you agree to our Terms of Chaos and Privacy Quackery
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right Side - Benefits & Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        {/* Hero Illustration */}
                        <div className="relative">
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 2, 0]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-center mb-8"
                            >
                                <div className="relative inline-block">
                                    <div className="w-64 h-64 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 rounded-full flex items-center justify-center text-8xl shadow-2xl mx-auto">
                                        🦆
                                    </div>

                                    {/* Floating Elements */}
                                    <motion.div
                                        animate={{
                                            y: [0, -15, 0],
                                            x: [0, 5, 0]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute -top-4 -right-8 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-xl shadow-lg"
                                    >
                                        💻
                                    </motion.div>

                                    <motion.div
                                        animate={{
                                            y: [0, 12, 0],
                                            x: [0, -8, 0]
                                        }}
                                        transition={{
                                            duration: 3.5,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute -bottom-6 -left-8 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center text-lg shadow-lg"
                                    >
                                        ⚡
                                    </motion.div>

                                    <motion.div
                                        animate={{
                                            y: [0, -8, 0],
                                            rotate: [0, 10, 0]
                                        }}
                                        transition={{
                                            duration: 2.5,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute top-1/3 -left-12 px-3 py-2 bg-black text-green-400 rounded-lg text-sm font-mono shadow-lg"
                                    >
                                        {"console.log('🦆')"}
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Benefits List */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    Join the <span className="text-yellow-500">Duck Revolution</span>
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    Unlock exclusive features and become part of our chaotic community
                                </p>
                            </div>

                            <div className="grid gap-4">
                                {benefits.map((benefit, index) => {
                                    const Icon = benefit.icon;
                                    return (
                                        <motion.div
                                            key={benefit.title}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                                            className="flex items-start gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-700"
                                        >
                                            <div className="w-12 h-12 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-lg flex items-center justify-center shadow-lg">
                                                <Icon className="w-6 h-6 text-black" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                    {benefit.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                    {benefit.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quote */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.6 }}
                            className="p-6 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-xl text-black"
                        >
                            <blockquote className="text-lg font-semibold italic mb-2">
                                "Never trust a duck with a knife, but always trust one with your code problems."
                            </blockquote>
                            <cite className="text-sm opacity-75">- The Chaotic Duck Manifesto</cite>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
