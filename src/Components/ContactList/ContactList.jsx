import React, { useContext, useState } from 'react'
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
                        className="start-chat-email-option"
                        onClick={!isActionLoading ? handleCreateChat : undefined}
                    >
                        <p>
                            {isActionLoading ? "Procesando..." : `Iniciar chat con: ${searchQuery}`}
                        </p>
                        <span>
                            Haz clic para iniciar chat con este usuario
                        </span>
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

