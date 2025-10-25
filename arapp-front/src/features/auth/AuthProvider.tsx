import {type ReactNode, useState} from "react";
import {AuthContext} from "./auth";

export function AuthProvider({children}: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<{ id: string; name: string } | null>(null);

    const logout = () => {
        setAccessToken(null);
        setUser(null);
        //api wylogowanie TODO
    };

    return (
        <AuthContext.Provider value={{accessToken, setAccessToken, logout, user, setUser}}>
            {children}
        </AuthContext.Provider>
    );
}
