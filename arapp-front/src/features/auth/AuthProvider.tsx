import {type ReactNode, useEffect, useState} from "react";
import {AuthContext} from "./auth";

export function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);

    const logout = () => {
        setUser(null);
        //api wylogowanie TODO
    };

    useEffect(() => {
        const saved = localStorage.getItem("user");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setUser(parsed);
            } catch {
                localStorage.removeItem("user");
            }
        }
    }, []);


    return (
        <AuthContext.Provider value={{logout, user, setUser}}>
            {children}
        </AuthContext.Provider>
    );
}
