import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router";
import { ContactContext } from "../../Context/ContactContext";
import { API_BASE_URL } from "../../Config/environment.js";
import "./GroupDetailSideBar.css";

export default function GroupDetailSideBar({ contactSelected, onClose, onRefresh }) {
    const { authToken, userProfile } = useAuth();
    const { contacts } = useContext(ContactContext);
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isGroup = contactSelected.type === "group";

    const currentUserParticipant = contactSelected.participants.find(
        (p) => p.user && p.user._id === userProfile?._id
    );
    const isAdmin = currentUserParticipant?.role === "admin";

    const otherParticipant = contactSelected.participants.find(
        (p) => p.user && p.user._id !== userProfile?._id
    );
    const otherUser = otherParticipant?.user;

    const commonGroups = contacts ? contacts.filter(chat => 
        chat.type === 'group' && 
        chat.participants.some(p => p.user && p.user._id === userProfile?._id && p.invitationStatus === 'accepted') &&
        chat.participants.some(p => p.user && p.user._id === otherUser?._id && p.invitationStatus === 'accepted')
    ) : [];
    const [isEditing, setIsEditing] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [editForm, setEditForm] = useState({
        name: contactSelected.chatName || '',
        description: contactSelected.chatDescription || '',
        avatar: contactSelected.chatAvatar || ''
    });

    useEffect(() => {
        setEditForm({
            name: contactSelected.chatName || '',
            description: contactSelected.chatDescription || '',
            avatar: contactSelected.chatAvatar || ''
        });
        setIsEditing(false);
        setAvatarFile(null);
    }, [contactSelected]);

    const handleRemoveMember = async (userId) => {
        if (!window.confirm("¿Seguro que deseas eliminar a este miembro del grupo?")) return;
        setStatusMessage("");
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/chats/${contactSelected._id}/members/${userId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Error al remover miembro");
            }
            setStatusType("success");
            setStatusMessage("Miembro eliminado correctamente.");
            onRefresh();
        } catch (error) {
            setStatusType("error");
            setStatusMessage(error.message || "Error al remover miembro.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLeaveGroup = async () => {
        if (!window.confirm("¿Seguro que deseas abandonar este grupo?")) return;
        setStatusMessage("");
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/chats/${contactSelected._id}/leave`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Error al abandonar grupo");
            }
            navigate("/");
            onRefresh();
        } catch (error) {
            setStatusType("error");
            setStatusMessage(error.message || "Error al abandonar grupo.");
            setIsLoading(false);
        }
    };

    const handleSaveDetails = async () => {
        setStatusMessage("");
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", editForm.name);
            formData.append("description", editForm.description);
            if (avatarFile) {
                formData.append("avatar", avatarFile);
            } else {
                formData.append("avatar", editForm.avatar);
            }

            const response = await fetch(`${API_BASE_URL}/api/chats/${contactSelected._id}/details`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                },
                body: formData
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Error al actualizar");
            }

            setIsEditing(false);
            setAvatarFile(null);
            onRefresh();
            setStatusMessage("Grupo actualizado correctamente");
            setStatusType("success");
        } catch (error) {
            setStatusMessage(error.message);
            setStatusType("error");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="group-detail-sidebar">
            <div className="group-detail-header">
                <button className="group-detail-close-btn" onClick={onClose}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left-short" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5" />
                    </svg>
                </button>
                <h3>Info. del {isGroup ? "Grupo" : "Contacto"}</h3>
            </div>

            <div className="group-detail-content">
                {statusMessage && (
                    <div className={`group-status-box ${statusType}`}>
                        {statusMessage}
                    </div>
                )}

                <div className="group-info-card">
                    {isEditing ? (
                        <div className="whatsapp-form" style={{ width: '100%', padding: '0 15px' }}>
                            <div className="group-avatar-display-section">
                                <label htmlFor="group-edit-avatar" className="group-avatar-frame" title="Cambiar foto de perfil del grupo">
                                    {avatarFile ? (
                                        <img src={URL.createObjectURL(avatarFile)} alt="Nueva vista previa" />
                                    ) : editForm.avatar ? (
                                        <img src={editForm.avatar} alt="Avatar actual" />
                                    ) : (
                                        <div className="group-avatar-empty-placeholder"></div>
                                    )}

                                    <div className="group-avatar-overlay">
                                        <span>Cambiar</span>
                                    </div>
                                </label>
                            </div>

                            <div style={{ display: "none" }}>
                                <input
                                    type="file"
                                    id="group-edit-avatar"
                                    accept="image/*"
                                    onChange={(e) => setAvatarFile(e.target.files[0])}
                                />
                            </div>
                            <div className="whatsapp-input-group">
                                <label>NOMBRE DEL GRUPO</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    placeholder="Nombre del grupo"
                                />
                            </div>
                            <div className="whatsapp-input-group">
                                <label>DESCRIPCIÓN</label>

                                <input
                                    type="text"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    placeholder="Añade una descripción"
                                />
                            </div>
                            <button onClick={handleSaveDetails} className="whatsapp-btn">
                                Guardar cambios
                            </button>

                            <button onClick={() => { setIsEditing(false); setAvatarFile(null); }} className="group-leave-btn">
                                Cancelar
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="group-info-avatar-wrapper">
                                {contactSelected.chatAvatar ? (
                                    <img src={contactSelected.chatAvatar} alt={contactSelected.chatName} />
                                ) : (
                                    <div className="group-info-avatar-placeholder"></div>
                                )}
                            </div>
                            <h2>{contactSelected.chatName}</h2>
                            <p className="group-info-description">
                                {contactSelected.chatDescription || "Sin descripción."}
                            </p>

                            {isAdmin && isGroup && (
                                <button
                                    className="whatsapp-btn"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Editar Info del Grupo
                                </button>
                            )}
                        </>
                    )}
                </div>

                {!isGroup && (
                    <div className="contact-extra-info-section">
                        <div className="contact-info-field">
                            <span className="info-field-label">Correo electrónico</span>
                            <span className="info-field-value">{contactSelected.participantEmail || otherUser?.email || "No disponible"}</span>
                        </div>
                        <div className="common-groups-section">
                            <h4>Grupos en común ({commonGroups.length})</h4>
                            {commonGroups.length > 0 ? (
                                <div className="common-groups-list">
                                    {commonGroups.map(group => (
                                        <div key={group._id} className="common-group-item">
                                            <div className="common-group-avatar-wrapper">
                                                {group.chatAvatar ? (
                                                    <img src={group.chatAvatar} alt={group.chatName} />
                                                ) : (
                                                    <div className="common-group-avatar-placeholder"></div>
                                                )}
                                            </div>
                                            <div className="common-group-info">
                                                <h5>{group.chatName}</h5>
                                                {group.chatDescription && <p>{group.chatDescription}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-common-groups">No hay grupos en común</p>
                            )}
                        </div>
                    </div>
                )}

                {isGroup && (
                    <div className="group-members-section">
                        <h4>Miembros ({contactSelected.participants.length})</h4>
                        <div className="group-members-list">
                            {contactSelected.participants.map((participant) => {
                                if (!participant.user) return null;
                                const isSelf = participant.user._id === userProfile?._id;
                                return (
                                    <div key={participant.user._id} className="group-member-item">
                                        <div className="group-member-avatar-wrapper">
                                            {participant.user.avatar ? (
                                                <img src={participant.user.avatar} alt={participant.user.name} />
                                            ) : (
                                                <div className="group-member-avatar-placeholder"></div>
                                            )}
                                        </div>
                                        <div className="group-member-info">
                                            <h5>
                                                {participant.user.nickname || participant.user.name}
                                                {isSelf && " (Tú)"}
                                            </h5>
                                            <span className="group-member-role">
                                                {participant.role === "admin" ? "Admin. del grupo" : "Miembro"}
                                            </span>
                                        </div>
                                        {isAdmin && !isSelf && (
                                            <button
                                                className="group-member-remove-btn"
                                                onClick={() => handleRemoveMember(participant.user._id)}
                                                disabled={isLoading}
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {isGroup && (
                    <button
                        className="group-leave-btn"
                        onClick={handleLeaveGroup}
                        disabled={isLoading}
                    >
                        Abandonar Grupo
                    </button>
                )}
            </div>
        </div>
    );
}
