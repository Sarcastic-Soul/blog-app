
import React, { useState, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Moon, Sun, LogOut, LogIn, Menu, X, Home, BookOpen, User, Plus, BarChart3, PenTool } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ADMIN_TEAM_ID } from "../lib/config";

export default function Header() {
    const { user, logout, userTeams } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() =>
        document.documentElement.classList.contains('dark')
    );

    const isAdmin = useMemo(() => userTeams.includes(ADMIN_TEAM_ID), [userTeams]);

    const toggleDark = useCallback(() => {
        setDarkMode(prev => {
            const newDarkMode = !prev;
            document.documentElement.classList.toggle("dark", newDarkMode);
            localStorage.setItem('darkMode', newDarkMode.toString());
            return newDarkMode;
        });
    }, []);

    const toggleMobileMenu = useCallback(() => {
        setMobileMenuOpen(prev => !prev);
    }, []);

    const closeMobileMenu = useCallback(() => {
        setMobileMenuOpen(false);
    }, []);

    const navigation = useMemo(() => [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Blogs', href: '/blogs', icon: BookOpen },
        { name: 'About', href: '/about', icon: User },
    ], []);

    const adminNavigation = [
        { name: 'New Post', href: '/create-blog', icon: Plus },
    ];

    const isActivePath = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link
                            to="/"
                            className="flex items-center gap-3 text-2xl font-bold tracking-wide text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                        >
                            <PenTool className="w-8 h-8" />
                            <span className="hidden sm:block">Ink & Irony</span>
                            <span className="sm:hidden">I&I</span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = isActivePath(item.href);

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                        ${isActive
                                            ? 'bg-yellow-300 text-black'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            );
                        })}

                        {/* Admin Navigation */}
                        {isAdmin && (
                            <>
                                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
                                {adminNavigation.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = isActivePath(item.href);

                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={`
                                                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                                ${isActive
                                                    ? 'bg-green-500 text-white'
                                                    : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                }
                                            `}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </>
                        )}
                    </nav>

                    {/* Right Side Controls */}
                    <div className="flex items-center gap-2">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDark}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            <Sun className="hidden dark:block w-5 h-5 text-yellow-300" />
                            <Moon className="block dark:hidden w-5 h-5 text-gray-600" />
                        </button>

                        {/* User Menu */}
                        {user ? (
                            <div className="hidden md:flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <div className="w-6 h-6 bg-yellow-300 rounded-full flex items-center justify-center text-black text-xs font-bold">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {user.name?.split(' ')[0] || 'User'}
                                    </span>
                                    {isAdmin && (
                                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                                            Admin
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="text-sm">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <LogIn className="w-4 h-4" />
                                Login
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = isActivePath(item.href);

                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={closeMobileMenu}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors
                                            ${isActive
                                                ? 'bg-yellow-300 text-black'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }
                                        `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}

                            {/* Admin Links */}
                            {isAdmin && (
                                <>
                                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                                    {adminNavigation.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = isActivePath(item.href);

                                        return (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                onClick={closeMobileMenu}
                                                className={`
                                                    flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors
                                                    ${isActive
                                                        ? 'bg-green-500 text-white'
                                                        : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                    }
                                                `}
                                            >
                                                <Icon className="w-5 h-5" />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </>
                            )}

                            {/* User Actions */}
                            <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
                                            <div className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center text-black text-sm font-bold">
                                                {user.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {user.name || 'User'}
                                                </div>
                                                {isAdmin && (
                                                    <div className="text-xs text-green-600 dark:text-green-400">
                                                        Administrator
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                logout();
                                                closeMobileMenu();
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors w-full text-left"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <LogIn className="w-5 h-5" />
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
