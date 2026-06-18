import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import "./ProfileSideBar.css";
import { API_BASE_URL } from "../../Config/environment.js";

export default function ProfileSideBar({ onClose }) {
    const { authToken, userProfile, loadUserProfile } = useAuth();

    const [nickname, setNickname] = useState("");
    const [description, setDescription] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);

    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Precargamos los datos cuando se monta el componente
    useEffect(() => {
        if (userProfile) {
            setNickname(userProfile.nickname || "");
            setDescription(userProfile.description || "");
            setAvatar(userProfile.avatar || "");
        }
    }, [userProfile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage("");
        setStatusType("");
        setIsSaving(true);

        try {
            const formData = new FormData();
            formData.append("nickname", nickname);
            formData.append("description", description);

            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Error al actualizar el perfil.");
            }
            setStatusType("success");
            setStatusMessage("Perfil actualizado con exito.");
            await loadUserProfile();
        }
        catch (error) {
            setStatusType("error");
            setStatusMessage(error.message || "Error al guardar los cambios.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="profile-sidebar-container">
            <div className="profile-sidebar-header">
                <button className="profile-back-button" onClick={onClose}>
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
                <h2>Perfil</h2>
            </div>

            <div className="profile-sidebar-content">
                {statusMessage && (
                    <div className={`profile-status-box ${statusType}`}>
                        {statusMessage}
                    </div>
                )}

                <div className="profile-avatar-display-section">
                    <label htmlFor="avatar" className="profile-avatar-frame" style={{ cursor: "pointer" }} title="Cambiar foto de perfil">
                        {avatarFile ? (
                            <img src={URL.createObjectURL(avatarFile)} alt="Nueva vista previa" />
                        ) : avatar ? (
                            <img src={avatar} alt="Tu avatar actual" />
                        ) : (
                            <div className="profile-avatar-empty-placeholder"></div>
                        )}

                        <div className="profile-avatar-overlay">
                            <span>Cambiar</span>
                        </div>
                    </label>

                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="profile-input-group">
                        <label htmlFor="profile-name-readonly">CORREO (LECTURA)</label>
                        <input
                            type="text"
                            id="profile-name-readonly"
                            value={userProfile?.email || ""}
                            disabled
                        />
                    </div>

                    <div className="profile-input-group">
                        <label htmlFor="nickname">TU NOMBRE / ALIAS</label>
                        <input
                            type="text"
                            id="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                        />
                    </div>

                    <div className="profile-input-group">
                        <label htmlFor="description">DESCRIPCION</label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: "none" }}>
                        <input
                            type="file"
                            id="avatar"
                            accept="image/*"
                            onChange={(e) => setAvatarFile(e.target.files[0])}
                        />
                    </div>



                    <button type="submit" className="profile-save-btn" disabled={isSaving}>
                        {isSaving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                    </button>
                </form>
            </div>
        </div>
    );
}
