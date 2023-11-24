import axios from "../api/axios";
import useAuth from "./useAuth";

/**
 * Source: https://www.youtube.com/playlist?list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd
 * I used some of the hooks from this video
 */

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();
    const accessToken = auth.token;
    const refreshToken = auth.refresh;

    const refresh = async () => {
        const response = await axios.post('/api/token/refresh',
            JSON.stringify({ accessToken, refreshToken }),
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            },
        );
        setAuth((prevState) => ({
            ...prevState,
            token: response.data.token,
            refresh: response.data.refreshToken,
        }));
        return response.data.token;
    }
    return refresh;
};

export default useRefreshToken;