import React, { useState, useContext } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { ContactContext } from '../../Context/ContactContext';
import { API_BASE_URL } from '../../Config/environment';
import { useNavigate } from 'react-router';
import './CreateGroupSideBar.css';

export default function CreateGroupSideBar({ onClose }) {
    const { authToken, userProfile } = useAuth();
    const { contacts, loadContacts, createDirectChat } = useContext(ContactContext);
    const navigate = useNavigate();

    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [searchEmail, setSearchEmail] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Filtramos los chats directos para extraer a los contactos únicos
    const directContacts = (contacts || []).filter(chat => chat.type === 'direct');
    const contactsList = directContacts
        .map(chat => {
            const otherParticipant = chat.participants.find(
                p => p.user && p.user._id !== userProfile?._id
            );
            return otherParticipant ? otherParticipant.user : null;
        })
        .filter(Boolean);

    // Alternar selección de un participante
    const handleToggleMember = (userId) => {
        setSelectedMembers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    // Buscar y agregar usuario por email (crea/invita chat directo si no existe)
    const handleSearchAndAddEmail = async (e) => {
        e.preventDefault();
        if (!searchEmail || !searchEmail.trim()) return;

        setIsLoading(true);
        setStatusMessage('');
        setStatusType('');

        try {
            const result = await createDirectChat(searchEmail);

            // Si el email no está registrado, el Backend devuelve 'invited': true
            if (result.invited) {
                setStatusType('success');
                setStatusMessage('Invitación de registro enviada correctamente por correo.');
            } else if (result.data) {
                const otherParticipant = result.data.participants.find(
                    p => p.user && p.user.email.toLowerCase() === searchEmail.toLowerCase()
                );
                if (otherParticipant && otherParticipant.user) {
                    const userId = otherParticipant.user._id;
                    if (!selectedMembers.includes(userId)) {
                        setSelectedMembers(prev => [...prev, userId]);
                    }
                    setStatusType('success');
                    setStatusMessage('Usuario agregado al grupo.');
                }
            }
            setSearchEmail('');
        } catch (error) {
            setStatusType('error');
            setStatusMessage(error.message || 'Error al buscar el usuario.');
        } finally {
            setIsLoading(false);
        }
    };

    // Enviar el formulario al Backend para crear el grupo
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!groupName.trim()) {
            setStatusType('error');
            setStatusMessage('El nombre del grupo es obligatorio.');
            return;
        }

        setIsLoading(true);
        setStatusMessage('');
        setStatusType('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/chats/group`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    name: groupName,
                    description,
                    avatar: avatarUrl || undefined,
                    participantIds: selectedMembers
                })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al crear el grupo.');
            }

            await loadContacts(); // Refresca lista global
            onClose(); // Cierra el sidebar
            navigate(`/contact/${data.data._id}`); // Abre el nuevo chat
        } catch (error) {
            setStatusType('error');
            setStatusMessage(error.message || 'Error al crear el grupo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-group-sidebar-container">
            <div className="create-group-sidebar-header">
                <button className="create-group-back-button" onClick={onClose}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left-short" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5" />
                    </svg>
                </button>
                <h2>Nuevo Grupo</h2>
            </div>

            <div className="create-group-sidebar-content">
                {statusMessage && (
                    <div className={`create-group-status-box ${statusType}`}>
                        {statusMessage}
                    </div>
                )}

                <form onSubmit={handleCreateGroup} className="create-group-form">
                    <div className="create-group-input-group">
                        <label>Nombre del Grupo (Obligatorio)</label>
                        <input
                            type="text"
                            placeholder="Ej. Proyecto Final"
                            value={groupName}
                            onChange={e => setGroupName(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="create-group-input-group">
                        <label>Descripción</label>
                        <input
                            type="text"
                            placeholder="De qué trata el grupo"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="create-group-input-group">
                        <label>URL de Avatar del Grupo</label>
                        <input
                            type="text"
                            placeholder="https://ejemplo.com/avatar.jpg"
                            value={avatarUrl}
                            onChange={e => setAvatarUrl(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="create-group-search-add-section">
                        <label>Buscar / Invitar por Email</label>
                        <div className="search-add-wrapper">
                            <input
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={searchEmail}
                                onChange={e => setSearchEmail(e.target.value)}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={handleSearchAndAddEmail}
                                disabled={isLoading}
                                className="search-add-btn"
                            >
                                Agregar
                            </button>
                        </div>
                    </div>

                    <div className="create-group-participants-section">
                        <label>Integrantes del grupo ({selectedMembers.length})</label>
                        <div className="create-group-contacts-list">
                            {contactsList.map(contact => (
                                <div key={contact._id} className="create-group-contact-item">
                                    <input
                                        type="checkbox"
                                        id={`checkbox-${contact._id}`}
                                        checked={selectedMembers.includes(contact._id)}
                                        onChange={() => handleToggleMember(contact._id)}
                                        disabled={isLoading}
                                    />
                                    <label htmlFor={`checkbox-${contact._id}`} className="contact-item-label">
                                        <div className="contact-avatar-wrapper">
                                            {contact.avatar ? (
                                                <img src={contact.avatar} alt={contact.name} />
                                            ) : (
                                                <div className="contact-avatar-placeholder"></div>
                                            )}
                                        </div>
                                        <span>{contact.nickname || contact.name}</span>
                                    </label>
                                </div>
                            ))}

                            {contactsList.length === 0 && (
                                <p className="no-contacts-text">
                                    No tienes chats directos previos. Agrega a un usuario por email arriba.
                                </p>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="create-group-submit-btn" disabled={isLoading}>
                        {isLoading ? 'Creando...' : 'Crear Grupo'}
                    </button>
                </form>
            </div>
        </div>
    );
}
