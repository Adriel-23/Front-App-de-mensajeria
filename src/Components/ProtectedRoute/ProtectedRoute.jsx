import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../Context/AuthContext";
import LoadingScreen from "../../Screens/LoadingScreen/Loadingscreen";

export default function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    //Acá veo que si el usuario no está autenticado, lo redirija al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
