import { Dispatch, SetStateAction, createContext, useState } from "react";
import { Player } from "../models/player.model";

/**
 * Source: https://www.youtube.com/watch?v=nI8PYZNFtac&list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd&index=4&pp=iAQB
 * Basic idea come from this playlist, but I reworked it
 */

interface Auth {
    player: Player;
    token: string;
    refresh: string;
}

interface AuthContextInterface {
    auth: Auth
    setAuth: Dispatch<SetStateAction<Auth>>
}

export const initialAuth: Auth = {
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
};

export const AuthContext = createContext<AuthContextInterface>({
  auth: initialAuth,
  setAuth: () => {},
});

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