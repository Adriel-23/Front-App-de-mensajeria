import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router";
import { ContactContext } from "../../Context/ContactContext";
import { API_BASE_URL } from "../../Config/environment.js";
import "./GroupDetailSideBar.css";

export default function GroupDetailSideBar({ contactSelected, onClose, onRefresh }) {
    const { authToken, userProfile } = useAuth();
    const { contacts, createDirectChat } = useContext(ContactContext);
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isInviting, setIsInviting] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        action: null,
        title: "",
        subtitle: "",
        confirmText: ""
    });

    const isGroup = contactSelected.type === "group";

    const directContacts = (contacts || []).filter(chat => chat.type === 'direct');
    const contactsList = directContacts
        .map(chat => {
            const otherParticipant = chat.participants.find(
                p => p.user && p.user._id !== userProfile?._id
            );
            return otherParticipant ? otherParticipant.user : null;
        })
        .filter(Boolean);

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
        setIsInviting(false);
        setInviteEmail("");
    }, [contactSelected]);

    useEffect(() => {
        if (statusMessage) {
            const timer = setTimeout(() => {
                setStatusMessage("");
                setStatusType("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [statusMessage]);

    const inviteContactById = async (userId) => {
        setStatusMessage("");
        setIsLoading(true);
        try {
            const inviteResponse = await fetch(`${API_BASE_URL}/api/chats/${contactSelected._id}/invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify({ userToInvite: userId })
            });
            
            const inviteData = await inviteResponse.json();
            if (!inviteResponse.ok) {
                throw new Error(inviteData.message || "Error al invitar al grupo");
            }
            
            setStatusType("success");
            setStatusMessage("Usuario añadido al grupo correctamente.");
            setIsInviting(false);
            setInviteEmail("");
            onRefresh();
        } catch (error) {
            setStatusType("error");
            setStatusMessage(error.message || "Error al invitar usuario.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInviteMember = async (e) => {
        e.preventDefault();
        if (!inviteEmail.trim()) return;

        setStatusMessage("");
        setIsLoading(true);

        try {
            const result = await createDirectChat(inviteEmail);
            
            if (result.invited) {
                setStatusType("success");
                setStatusMessage("Invitación de registro enviada correctamente por correo.");
                setIsInviting(false);
                setInviteEmail("");
                setIsLoading(false);
            } else if (result.data) {
                const otherParticipant = result.data.participants.find(
                    p => p.user && (p.user.email?.toLowerCase() === inviteEmail.toLowerCase() || p.user.nickname?.toLowerCase() === inviteEmail.toLowerCase())
                );
                
                if (otherParticipant && otherParticipant.user) {
                    const userId = otherParticipant.user._id;
                    await inviteContactById(userId);
                } else {
                    throw new Error("No se pudo encontrar el usuario.");
                }
            }
        } catch (error) {
            setStatusType("error");
            setStatusMessage(error.message || "Error al buscar o invitar usuario.");
            setIsLoading(false);
        }
    };

    const confirmRemoveMember = (userId) => {
        setConfirmDialog({
            isOpen: true,
            title: "¿Eliminar miembro?",
            subtitle: "Esta acción no se puede deshacer.",
            confirmText: "Eliminar",
            action: () => executeRemoveMember(userId)
        });
    };

    const executeRemoveMember = async (userId) => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
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

    const confirmLeaveGroup = () => {
        setConfirmDialog({
            isOpen: true,
            title: "¿Abandonar grupo?",
            subtitle: "Dejarás de recibir mensajes de este grupo.",
            confirmText: "Abandonar",
            action: () => executeLeaveGroup()
        });
    };

    const executeLeaveGroup = async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
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
                                    className="edit-group-info"
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

                {isGroup && !isInviting && (
                    <div className="group-members-section">
                        <h4>Miembros ({contactSelected.participants.length})</h4>

                        <div className="group-members-list">
                            <div className="group-member-item add-member-option" onClick={() => setIsInviting(true)}>
                                <div className="group-member-avatar-wrapper add-member-icon-wrapper">
                                    +
                                </div>
                                <div className="group-member-info">
                                    <h5 className="add-member-text">Añadir participante</h5>
                                </div>
                            </div>

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
                                                onClick={() => confirmRemoveMember(participant.user._id)}
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

                {isGroup && isInviting && (
                    <div className="group-members-section">
                        <div className="invite-view-header">
                            <button className="group-detail-close-btn" onClick={() => { setIsInviting(false); setInviteEmail(""); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left-short" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5" />
                                </svg>
                            </button>
                            <h4>Añadir participantes</h4>
                        </div>

                        <form onSubmit={handleInviteMember} className="invite-search-form">
                            <input
                                type="text"
                                className="invite-search-input"
                                placeholder="Email o nickname"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            <button type="submit" disabled={isLoading} className="invite-search-btn">
                                Buscar
                            </button>
                        </form>

                        <div className="group-members-list">
                            {contactsList
                                .filter(contact => !contactSelected.participants.some(p => p.user && p.user._id === contact._id))
                                .map(contact => (
                                    <div key={contact._id} className="group-member-item invite-member-item" onClick={() => inviteContactById(contact._id)}>
                                        <div className="group-member-avatar-wrapper">
                                            {contact.avatar ? (
                                                <img src={contact.avatar} alt={contact.name} />
                                            ) : (
                                                <div className="group-member-avatar-placeholder"></div>
                                            )}
                                        </div>
                                        <div className="group-member-info">
                                            <h5>{contact.nickname || contact.name}</h5>
                                            <span className="group-member-role">{contact.email}</span>
                                        </div>
                                    </div>
                                ))}
                                {contactsList.filter(contact => !contactSelected.participants.some(p => p.user && p.user._id === contact._id)).length === 0 && (
                                    <p className="invite-no-contacts">No hay más contactos disponibles para añadir.</p>
                                )}
                        </div>
                    </div>
                )}

                {isGroup && !isInviting && (
                    <button
                        className="group-leave-btn"
                        onClick={confirmLeaveGroup}
                        disabled={isLoading}
                    >
                        Abandonar Grupo
                    </button>
                )}
            </div>

            {confirmDialog.isOpen && (
                <div className="custom-confirm-overlay">
                    <div className="custom-confirm-box">
                        <h4 className="custom-confirm-title">{confirmDialog.title}</h4>
                        <p className="custom-confirm-subtitle">{confirmDialog.subtitle}</p>
                        <div className="custom-confirm-actions">
                            <button className="custom-confirm-btn-cancel" onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}>
                                Cancelar
                            </button>
                            <button className="custom-confirm-btn-danger" onClick={confirmDialog.action}>
                                {confirmDialog.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
