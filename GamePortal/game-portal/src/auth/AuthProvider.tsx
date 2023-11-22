import { Dispatch, SetStateAction, createContext, useState } from "react";

interface Auth {
    roles: number[];
    userName: string;
    password: string;
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
        userName: "",
        password: "",
        token: "",
        refresh: ""
    },
    setAuth: () => { } 
});

export const initialAuth: Auth = {
    roles: [],
    userName: "",
    password: "",
    token: "",
    refresh: ""
};

export const AuthProvider = ({ children }: any) => {
    const [auth, setAuth] = useState(initialAuth);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;