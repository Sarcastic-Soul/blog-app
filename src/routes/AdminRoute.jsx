// src/routes/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ADMIN_TEAM_ID } from "../lib/config";

export default function AdminRoute({ children }) {
    const { user, loading, userTeams, loadingTeams } = useAuth();

    // 1) Still waiting on auth or team membership data?
    if (loading || loadingTeams) return null;
    // (Or show a spinner if you prefer)

    // 2) Not logged in at all → send to /login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3) Logged in but not an Admin → send to /blogs (or show “Forbidden”)
    if (!userTeams.includes(ADMIN_TEAM_ID)) {
        return <Navigate to="/blogs" replace />;
    }

    // 4) Logged in AND user is part of Admins team → render children
    return children;
}
