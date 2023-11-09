import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "./useAuth"



const RequireAuth = ({ allowedRoles }: any) => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.roles?.find(role => allowedRoles.includes(role))
            ? <Outlet />
            : auth.userName ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ unathorized: true, from: location }} replace />

    )

}

export default RequireAuth;