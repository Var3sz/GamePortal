import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "./useAuth"

const RequireAuth = ({ allowedRoles }: any) => {
    const { auth } = useAuth();
    const location = useLocation();

    return auth?.player?.roles && auth.player.roles.find((role: any) => allowedRoles.includes(role.roleId)) ? (
        <Outlet />
    ) : auth.token ? (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
    ) : (
        <Navigate to="/login" state={{ unauthorized: true, from: location }} replace />
    );
};

export default RequireAuth;