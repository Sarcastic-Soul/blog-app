import { createContext, useContext, useEffect, useState } from "react";
import { account, teams as teamsSdk } from "../lib/appwrite";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userTeams, setUserTeams] = useState([]);

    const checkAuth = async () => {
        try {
            setLoading(true);
            const response = await account.get();

            let teams = [];
            try {
                const res = await teamsSdk.list();
                teams = res.teams.map((t) => t.$id);
            } catch (teamError) {
                console.log("Could not fetch teams:", teamError.message);
            }

            setUser(response);
            setUserTeams(teams);
            setLoading(false);

        } catch (authError) {
            console.log("User not authenticated:", authError.message);
            setUser(null);
            setUserTeams([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();

        // Listen for focus events to re-check auth after OAuth redirect
        const handleFocus = () => {
            checkAuth();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const loginWithGoogle = () => {
        account.createOAuth2Session(
            "google",
            `${window.location.origin}/blogs`,
            `${window.location.origin}/login`
        );
    };

    const logout = async () => {
        try {
            await account.deleteSession("current");
            setUser(null);
            setUserTeams([]);
        } catch (error) {
            console.log("Logout error:", error.message);
            setUser(null);
            setUserTeams([]);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            userTeams,
            loginWithGoogle,
            logout,
            refreshAuth: checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
