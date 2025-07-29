import { createContext, useContext, useEffect, useState } from "react";
import { account, teams as teamsSdk } from "../lib/appwrite";

const AuthContext = createContext();

// Browser detection helper
const isFirefox = () => {
    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userTeams, setUserTeams] = useState([]);

    const checkAuth = async () => {
        try {
            setLoading(true);
            console.log('🔍 Checking authentication...');
            console.log('🌐 Browser:', isFirefox() ? 'Firefox' : 'Other');

            const response = await account.get();
            console.log('✅ User authenticated:', response);

            let teams = [];
            try {
                const res = await teamsSdk.list();
                teams = res.teams.map((t) => t.$id);
                console.log('👥 User teams:', teams);
            } catch (teamError) {
                console.log("Could not fetch teams:", teamError.message);
            }

            setUser(response);
            setUserTeams(teams);
            setLoading(false);

        } catch (authError) {
            console.log("User not authenticated:", authError.message);
            console.log("Error type:", authError.type);
            console.log("Error code:", authError.code);

            // Firefox-specific handling
            if (isFirefox() && authError.code === 401) {
                console.log("🦊 Firefox detected - trying alternative session check...");
                await handleFirefoxAuth();
            } else if (authError.code === 401) {
                console.log("🔍 Checking for existing sessions...");
                try {
                    const sessions = await account.listSessions();
                    console.log("📋 Found sessions:", sessions);
                    if (sessions.sessions.length > 0) {
                        console.log("⚠️ Sessions exist but not authenticated - possible cookie issue");
                    }
                } catch (sessionError) {
                    console.log("Could not fetch sessions:", sessionError.message);
                }
            }

            setUser(null);
            setUserTeams([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            console.log('🚀 Initializing auth...');
            console.log('🌐 Browser:', isFirefox() ? 'Firefox' : 'Other');

            // First, try to create session from URL if OAuth redirect
            const sessionCreated = await createSessionFromUrl();

            // Then check auth state
            if (!sessionCreated) {
                // Firefox needs extra time sometimes
                if (isFirefox()) {
                    console.log('🦊 Firefox detected - adding delay before auth check');
                    setTimeout(() => checkAuth(), 500);
                } else {
                    await checkAuth();
                }
            }
        };

        initAuth();

        // Listen for focus events to re-check auth after OAuth redirect
        const handleFocus = () => {
            console.log('🔍 Window focused - rechecking auth');
            if (isFirefox()) {
                // Firefox needs a small delay
                setTimeout(() => checkAuth(), 200);
            } else {
                checkAuth();
            }
        };

        // Listen for storage events (for cross-tab authentication)
        const handleStorageChange = (e) => {
            if (e.key === 'appwrite-session') {
                console.log('📦 Session storage changed - rechecking auth');
                if (isFirefox()) {
                    setTimeout(() => checkAuth(), 300);
                } else {
                    checkAuth();
                }
            }
        };

        // Firefox-specific: Listen for popstate events (back/forward navigation)
        const handlePopState = () => {
            if (isFirefox()) {
                console.log('🦊 Firefox navigation detected - rechecking auth');
                setTimeout(() => checkAuth(), 400);
            }
        };

        window.addEventListener('focus', handleFocus);
        window.addEventListener('storage', handleStorageChange);

        if (isFirefox()) {
            window.addEventListener('popstate', handlePopState);
        }

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('storage', handleStorageChange);
            if (isFirefox()) {
                window.removeEventListener('popstate', handlePopState);
            }
        };
    }, []); const loginWithGoogle = () => {
        console.log('🚀 Starting Google OAuth...');
        console.log('🌐 Browser:', isFirefox() ? 'Firefox' : 'Other');

        if (isFirefox()) {
            console.log('🦊 Using Firefox-optimized OAuth flow');
            // Store a flag to know we're expecting an OAuth return
            localStorage.setItem('oauth-in-progress', 'true');
        }

        account.createOAuth2Session(
            "google",
            `${window.location.origin}/blogs`,
            `${window.location.origin}/login`
        );
    };

    const createSessionFromUrl = async () => {
        try {
            // Check if we have OAuth parameters in URL
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('userId');
            const secret = urlParams.get('secret');

            // Check if we're returning from OAuth
            const oauthInProgress = localStorage.getItem('oauth-in-progress');

            if (userId && secret) {
                console.log('🔗 Creating session from OAuth parameters...');
                await account.createSession(userId, secret);
                console.log('✅ Session created successfully');

                // Clean up OAuth flag
                localStorage.removeItem('oauth-in-progress');

                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);

                // Firefox needs extra time to process the session
                if (isFirefox()) {
                    console.log('🦊 Firefox detected - adding delay before auth check');
                    setTimeout(async () => {
                        await checkAuth();
                    }, 1000);
                } else {
                    await checkAuth();
                }
                return true;
            } else if (oauthInProgress && isFirefox()) {
                // Firefox sometimes doesn't get the URL params, but the session might still be there
                console.log('🦊 Firefox OAuth return detected without URL params - checking session');
                localStorage.removeItem('oauth-in-progress');
                setTimeout(async () => {
                    await checkAuth();
                }, 1500);
                return true;
            }
        } catch (error) {
            console.error('❌ Failed to create session from URL:', error);
            localStorage.removeItem('oauth-in-progress');
        }
        return false;
    };

    const forceSessionCheck = async () => {
        try {
            console.log('🔄 Force checking sessions...');
            const sessions = await account.listSessions();
            console.log('📋 Available sessions:', sessions);

            if (sessions.sessions.length > 0) {
                console.log('🔍 Found active session, refreshing auth...');
                await checkAuth();
            } else {
                console.log('❌ No active sessions found');
                setUser(null);
                setUserTeams([]);
                setLoading(false);
            }
        } catch (error) {
            console.error('❌ Error checking sessions:', error);
            setUser(null);
            setUserTeams([]);
            setLoading(false);
        }
    };

    // Firefox-specific authentication handler
    const handleFirefoxAuth = async () => {
        try {
            console.log('🦊 Attempting Firefox-specific auth recovery...');

            // Try to use localStorage for session persistence in Firefox
            const storedSession = localStorage.getItem('appwrite-session');
            if (storedSession) {
                console.log('🔑 Found stored session, attempting to use it...');
                // Wait a bit and try again
                setTimeout(async () => {
                    try {
                        const response = await account.get();
                        console.log('✅ Firefox auth recovered:', response);
                        setUser(response);

                        let teams = [];
                        try {
                            const res = await teamsSdk.list();
                            teams = res.teams.map((t) => t.$id);
                        } catch (teamError) {
                            console.log("Could not fetch teams:", teamError.message);
                        }
                        setUserTeams(teams);
                        setLoading(false);
                    } catch (retryError) {
                        console.log('🦊 Firefox retry failed:', retryError.message);
                        setUser(null);
                        setUserTeams([]);
                        setLoading(false);
                    }
                }, 1000);
            } else {
                console.log('🦊 No stored session found for Firefox');
            }
        } catch (error) {
            console.error('🦊 Firefox auth handler error:', error);
        }
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
            refreshAuth: checkAuth,
            createSessionFromUrl,
            forceSessionCheck,
            handleFirefoxAuth,
            isFirefox: isFirefox()
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
