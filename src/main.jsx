import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import BlogsPage from "./pages/BlogsPage";
import BlogPostPage from "./pages/BlogPostPage";
import AboutPage from "./pages/AboutPage";
import CreateBlogPage from "./pages/CreateBlogPage";
import EditBlog from "./pages/EditBlog";
import StatsPage from "./pages/StatsPage";
import "./index.css";
import AdminRoute from "./routes/AdminRoute";
import HomePage from "./pages/HomePage";

function RedirectIfAuthenticated({ children }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (user) return <Navigate to="/blogs" replace />;
    return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                    <Route path="/login" element={<RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated>} />
                    <Route path="/blogs" element={<BlogsPage />} />
                    <Route path="/blog/:id" element={<BlogPostPage />} />
                    <Route path="/about" element={<AboutPage />} />

                    {/* Protected Admin Routes */}
                    <Route
                        path="/create-blog"
                        element={
                            <AdminRoute>
                                <CreateBlogPage />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/edit/:id"
                        element={
                            <AdminRoute>
                                <EditBlog />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/stats/:id"
                        element={
                            <AdminRoute>
                                <StatsPage />
                            </AdminRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);
