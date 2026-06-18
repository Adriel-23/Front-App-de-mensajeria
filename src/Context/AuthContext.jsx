
import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../Config/environment.js";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
    const [authToken, setAuthToken] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar datos del perfil de usuario
    const loadUserProfile = async (token) => {
        const activeToken = token || authToken;
        if (!activeToken) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                headers: {
                    "Authorization": `Bearer ${activeToken}`
                }
            });
            const data = await response.json();
            if (data.ok) {
                setUserProfile(data.data);
            }
        } catch (error) {
            console.error("Error al cargar perfil de usuario:", error);
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken) {
            setAuthToken(storedToken);
            loadUserProfile(storedToken);
        }
        setIsLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem("authToken", token);
        setAuthToken(token);
        loadUserProfile(token);
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setAuthToken(null);
        setUserProfile(null);
    };

    const value = {
        authToken,
        isAuthenticated: !!authToken,
        isLoading,
        login,
        logout,
        userProfile,
        loadUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthContextProvider");
    }
    return context;
};
