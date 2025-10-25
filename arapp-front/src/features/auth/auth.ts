import {createContext, useContext} from 'react';

type AuthContextType = {

    user: { id: string; name: string } | null;
    setUser: (user: { id: string; name: string } | null) => void;
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    logout: () => void;

}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}