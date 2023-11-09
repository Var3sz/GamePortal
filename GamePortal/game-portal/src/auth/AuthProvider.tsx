import { Dispatch, SetStateAction, createContext, useState } from "react";

interface Auth {
    roles: [];
    userName: string;
    password: string;
    token: string;
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
        token: ""
    },
    setAuth: () => { }
});

export const initialAuth: Auth = {
    roles: [],
    userName: "",
    password: "",
    token: ""
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