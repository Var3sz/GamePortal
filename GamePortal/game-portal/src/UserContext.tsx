import { createContext } from "react";
import { Player } from "./models/player.model";


export interface IProviderValue {
    player: Player | null;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
}

export const UserContext = createContext<IProviderValue | null>(null);