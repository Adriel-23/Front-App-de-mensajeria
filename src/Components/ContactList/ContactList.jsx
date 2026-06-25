import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import ContactItem from '../ContactItem/ContactItem.jsx'
import { ContactContext } from '../../Context/ContactContext.jsx';
import './ContactList.css';

export default function ContactList() {
    const { contacts, searchQuery, createDirectChat } = useContext(ContactContext);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState("");
    const [isActionLoading, setIsActionLoading] = useState(false);
    const navigate = useNavigate();

    const chatsList = contacts || [];

    const filteredChats = chatsList.filter(chat => {
        const lowerName = (chat.chatName || "").toLowerCase();
        if (searchQuery && searchQuery.length > 0) {
            return lowerName.includes(searchQuery.toLowerCase()) ||
                (chat.participantEmail && chat.participantEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (chat.participantNickname && chat.participantNickname.includes(searchQuery)) ||
                (chat.participantName && chat.participantName.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return true;
    });

    const isNewSearch = searchQuery && searchQuery.trim().length > 0 && filteredChats.length === 0;

    const handleCreateChat = async () => {
        setStatusMessage("");
        setStatusType("");
        setIsActionLoading(true);
        try {
            const response = await createDirectChat(searchQuery);
            if (response.invited) {
                setStatusType("success");
                setStatusMessage("Invitacion enviada correctamente al correo electronico.");
            } else if (response.data) {
                navigate(`/contact/${response.data._id}`);
            }
        } catch (error) {
            setStatusType("error");
            setStatusMessage(error.message || "Error al iniciar el chat.");
        } finally {
            setIsActionLoading(false);
        }
    };

    useEffect(() => {
        if (statusMessage) {
            const timer = setTimeout(() => {
                setStatusMessage("");
                setStatusType("");
            }, 3000);

            const handleClickOutside = () => {
                setStatusMessage("");
                setStatusType("");
            };

            const delayTimeout = setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 50);

            return () => {
                clearTimeout(timer);
                clearTimeout(delayTimeout);
                document.removeEventListener('click', handleClickOutside);
            };
        }
    }, [statusMessage]);

    return (
        <div className='contact-list-container'>
            {statusMessage && (
                <div className={`status-notification-box ${statusType}`}>
                    {statusMessage}
                </div>
            )}

            <div className='contacts-list-scroll'>
                {isNewSearch && (
                    <div
                        className="contact-item-container new-chat-option"
                        onClick={!isActionLoading ? handleCreateChat : undefined}
                        style={{ cursor: isActionLoading ? 'default' : 'pointer' }}
                    >
                        <div className="contact-avatar-wrapper">
                            <div className='new-chat-avatar-icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wechat" viewBox="0 0 16 16">
                                    <path d="M11.176 14.429c-2.665 0-4.826-1.8-4.826-4.018 0-2.22 2.159-4.02 4.824-4.02S16 8.191 16 10.411c0 1.21-.65 2.301-1.666 3.036a.32.32 0 0 0-.12.366l.218.81a.6.6 0 0 1 .029.117.166.166 0 0 1-.162.162.2.2 0 0 1-.092-.03l-1.057-.61a.5.5 0 0 0-.256-.074.5.5 0 0 0-.142.021 5.7 5.7 0 0 1-1.576.22M9.064 9.542a.647.647 0 1 0 .557-1 .645.645 0 0 0-.646.647.6.6 0 0 0 .09.353Zm3.232.001a.646.646 0 1 0 .546-1 .645.645 0 0 0-.644.644.63.63 0 0 0 .098.356" />
                                    <path d="M0 6.826c0 1.455.781 2.765 2.001 3.656a.385.385 0 0 1 .143.439l-.161.6-.1.373a.5.5 0 0 0-.032.14.19.19 0 0 0 .193.193q.06 0 .111-.029l1.268-.733a.6.6 0 0 1 .308-.088q.088 0 .171.025a6.8 6.8 0 0 0 1.625.26 4.5 4.5 0 0 1-.177-1.251c0-2.936 2.785-5.02 5.824-5.02l.15.002C10.587 3.429 8.392 2 5.796 2 2.596 2 0 4.16 0 6.826m4.632-1.555a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0m3.875 0a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0" />
                                </svg>
                            </div>
                        </div>
                        <div className="contact-item-info">
                            <div className="contact-item-header">
                                <h3>{isActionLoading ? "Procesando..." : searchQuery}</h3>
                            </div>
                            <div className="message-received-container">
                                <div className="message-received">
                                    <p>Haz clic para iniciar chat</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {filteredChats.map(chat => (
                    <ContactItem
                        key={chat._id}
                        contact={chat}
                    />
                ))}

                {filteredChats.length === 0 && !isNewSearch && (
                    <p className='no-contacts-found'>
                        No se encontraron conversaciones
                    </p>
                )}
            </div>
        </div>
    )
}

