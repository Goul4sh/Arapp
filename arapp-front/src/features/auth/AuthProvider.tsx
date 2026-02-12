import {type ReactNode, useEffect, useState} from "react";
import {AuthContext} from "./auth";
import api from "./api.ts";

export function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = async () => {

        try {
            const resp = await api.post("/api/auth/logout", null, {withCredentials: true});
            if (resp.status === 200 || resp.status === 204) {
                setUser(null);
                localStorage.removeItem("user");
            }

        } catch (error) {
            console.error('Logout failed:', error);
        }

    };

    useEffect(() => {
        const fetchUser = async () => {

            try {
                const resp = await api.get("/api/auth/validate", {withCredentials: true});
                const userData = resp.data;
                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
            } catch {
                setUser(null);
                localStorage.removeItem("user");
            } finally {
                setLoading(false);
            }
            
        }

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{logout, user, setUser, loading}}>
            {children}
        </AuthContext.Provider>
    );
}
