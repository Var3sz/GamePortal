import axios from "../api/axios";
import useAuth from "./useAuth";


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
        setAuth(prevState => {
            console.log(JSON.stringify(prevState));
            console.log(response.data.token);
            return {
                ...prevState, token: response.data.token, refresh: response.data.refreshToken
            }
        });
        return response.data.token;
    }
    return refresh;
};


export default useRefreshToken;