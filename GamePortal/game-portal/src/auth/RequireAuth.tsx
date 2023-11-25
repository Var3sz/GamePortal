import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "./useAuth"

/**
 * Source: https://www.youtube.com/watch?v=nI8PYZNFtac&list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd&index=4&pp=iAQB
 * Basic idea come from this playlist, but I reworked it
 */

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