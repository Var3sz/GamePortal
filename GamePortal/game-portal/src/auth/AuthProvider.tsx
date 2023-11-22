import { Dispatch, SetStateAction, createContext, useState } from "react";

interface Auth {
    roles: number[];
    token: string;
    refresh: string;
}

interface AuthContextInterface {
    auth: Auth
    setAuth: Dispatch<SetStateAction<Auth>>
}

const AuthContext = createContext<AuthContextInterface>({
    auth: {
        roles: [],
        token: "",
        refresh: ""
    },
    setAuth: () => { }
});

export const initialAuth: Auth = {
    roles: [],
    token: "",
    refresh: ""
};

export const AuthProvider = ({ children }: any) => {
    const [auth, setAuth] = useState(() => {
        const storedToken = sessionStorage.getItem('accessToken');
        const storedRoles = sessionStorage.getItem('roles');
        const storedRefreshToken = sessionStorage.getItem('refreshToken');

        return storedToken
            ? {
                roles: storedRoles ? JSON.parse(storedRoles) : [],
                token: storedToken,
                refresh: storedRefreshToken || ""
            }
            : initialAuth;
    });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;