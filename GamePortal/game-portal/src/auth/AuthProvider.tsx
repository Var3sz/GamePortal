import { Dispatch, SetStateAction, createContext, useState } from "react";
import { Player } from "../models/player.model";

interface Auth {
    player: Player;
    token: string;
    refresh: string;
}

interface AuthContextInterface {
    auth: Auth
    setAuth: Dispatch<SetStateAction<Auth>>
}

const AuthContext = createContext<AuthContextInterface>({
    auth: {
        player: {
            roles: [],
            playerId: -1,
            fullName: '',
            userName: '',
            email: '',
            password: '',
            birthdate: '',
            token: ''
        },
        token: "",
        refresh: ""
    },
    setAuth: () => { }
});

export const initialAuth: Auth = {
    player: {
        roles: [],
        playerId: 0,
        fullName: '',
        userName: '',
        email: '',
        password: '',
        birthdate: '',
        token: ''
    },
    token: "",
    refresh: ""
};

export const AuthProvider = ({ children }: any) => {
    const [auth, setAuth] = useState(() => {
        const storedToken = sessionStorage.getItem('accessToken');
        const storedPlayer = sessionStorage.getItem('player');
        const storedRefreshToken = sessionStorage.getItem('refreshToken');

        return storedToken
            ? {
                player: storedPlayer ? JSON.parse(storedPlayer) : [],
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