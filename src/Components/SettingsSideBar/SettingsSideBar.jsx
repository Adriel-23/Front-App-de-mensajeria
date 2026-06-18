import React from "react";
import { useAuth } from "../../Context/AuthContext";
import "./SettingsSideBar.css";

export default function SettingsSideBar({ onClose, onOpenProfile }) {
    const { userProfile, logout } = useAuth();

    return (
        <div className="settings-sidebar-container">
            <div className="settings-sidebar-header">
                <button className="settings-back-button" onClick={onClose}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-arrow-left-short"
                        viewBox="0 0 16 16"
                    >
                        <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5" />
                    </svg>
                </button>
                <h2>Configuración</h2>
            </div>

            <div className="settings-sidebar-content">
                <div className="settings-profile-header" onClick={onOpenProfile} title="Modificar perfil">
                    <div className="settings-profile-avatar">
                        {userProfile?.avatar ? (
                            <img src={userProfile.avatar} alt="Profile" />
                        ) : (
                            <div className="settings-avatar-placeholder"></div>
                        )}
                    </div>
                    <div className="settings-profile-info">
                        <span className="settings-profile-name">{userProfile?.nickname || "Usuario"}</span>
                        <span className="settings-profile-email">{userProfile?.email || ""}</span>
                    </div>
                </div>

                <div className="settings-options-list">
                    <button
                        className="settings-option-item"
                        onClick={() => alert("Función de cambiar contraseña en desarrollo")}
                    >
                        <div className="settings-option-icon">
                            <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none">
                                <title>lock</title>
                                <path d="M12 2C9.243 2 7 4.243 7 7V10H6C4.897 10 4 10.897 4 12V20C4 21.103 4.897 22 6 22H18C19.103 22 20 21.103 20 20V12C20 10.897 19.103 10 18 10H17V7C17 4.243 14.757 2 12 2ZM9 7C9 5.346 10.346 4 12 4C13.654 4 15 5.346 15 7V10H9V7ZM18 12L18.002 20H6V12H18ZM12 17C12.828 17 13.5 16.328 13.5 15.5C13.5 14.672 12.828 14 12 14C11.172 14 10.5 14.672 10.5 15.5C10.5 16.328 11.172 17 12 17Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <div className="settings-option-text">
                            <span>Cambiar contraseña</span>
                        </div>
                    </button>

                    <button className="settings-option-item" onClick={logout}>
                        <div className="settings-option-icon text-danger">
                            <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" fill="none">
                                <title>logout</title>
                                <path d="M16 13V11H8V13H16ZM18 15V17H6V7H18V9H20V6C20 4.897 19.103 4 18 4H6C4.897 4 4 4.897 4 6V18C4 19.103 4.897 20 6 20H18C19.103 20 20 19.103 20 18V15H18ZM14 16L19 12L14 8V11H8V13H14V16Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <div className="settings-option-text text-danger">
                            <span>Cerrar sesión</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
