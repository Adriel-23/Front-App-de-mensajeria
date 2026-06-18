import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router';
import MessageContent from '../../Components/MessageContent/MessageContent';
import { ContactDetailContext } from '../../Context/ContactDetailContext';
import { ContactContext } from '../../Context/ContactContext';
import GroupDetailSideBar from '../../Components/GroupDetailSideBar/GroupDetailSideBar';
import './ContactDetailScreen.css';
import NewMessageForm from '../../Components/NewMessageForm/NewMessageForm';
import { useAuth } from '../../Context/AuthContext';
import { API_BASE_URL } from '../../Config/environment.js';


export default function ContactDetailScreen() {
    const { contact_id } = useParams();
    const { contactSelected, messages } = useContext(ContactDetailContext);
    const { loadContacts } = useContext(ContactContext);
    const navigate = useNavigate();
    const { userProfile, authToken } = useAuth();


    const [showDetails, setShowDetails] = useState(false);

    const handleBack = () => {
        navigate('/');
    };
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        setShowDetails(false);
    }, [contact_id]);

    if (!contactSelected) {
        return (
            <div className="empty-contact-detail">
                <h2>Este contacto no tiene WhatsApp, envíale una invitación a unirse</h2>
            </div>
        );

    }


    const currentUserParticipant = contactSelected.participants?.find(
        p => p.user && p.user._id === userProfile?._id
    );

    const isPending = contactSelected.type === 'group' && currentUserParticipant?.invitationStatus === 'pending';

    const inviterName = currentUserParticipant?.invitedBy?.nickname || 'Alguien';

    const handleAcceptInvitation = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/chats/invitation/${contactSelected._id}/${userProfile._id}/accept`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                await loadContacts();
            }
        } catch (error) {
            console.error("Error aceptando invitación:", error);
        }
    };

    const handleRejectInvitation = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/chats/invitation/${contactSelected._id}/${userProfile._id}/reject`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                await loadContacts();
                navigate('/');
            }
        } catch (error) {
            console.error("Error rechazando invitación:", error);
        }
    };


    return (
        <div className={`chat-detail-layout ${showDetails ? 'showing-details' : ''}`}>
            <div className='contact-open-chat-container'>
                <div className='profile-contact-detail-header'>
                    <div className='header-left-section'>
                        <button className="back-button" onClick={handleBack}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left-short" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5" />
                            </svg>
                        </button>

                        <div className='header-info-wrapper' onClick={() => setShowDetails(!showDetails)}>
                            {contactSelected.chatAvatar ? (
                                <img
                                    src={contactSelected.chatAvatar}
                                    alt={contactSelected.chatName}
                                />
                            ) : (
                                <div className="chat-header-avatar-placeholder"></div>
                            )}
                            <div className='contact-text-info'>
                                <h1>{contactSelected.chatName}</h1>
                                <p className='contact-status'>
                                    {contactSelected.chatDescription || "¡Hola! Estoy usando BayApp."}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='header-actions'>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-camera-video" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" />
                            </svg>
                        </button>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone" viewBox="0 0 16 16">
                                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                            </svg>
                        </button>
                        <button onClick={() => setShowDetails(!showDetails)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                            </svg>
                        </button>
                    </div>
                </div>

                {isPending ? (
                    <div className="invitation-screen-container">
                        <h2>¡Tienes una invitación!</h2>
                        <p>
                            <strong>{inviterName}</strong> te invitó a formar parte del grupo <strong>{contactSelected.chatName}</strong>
                        </p>
                        <div className="invitation-buttons">
                            <button className="btn-reject" onClick={handleRejectInvitation}>
                                Rechazar
                            </button>
                            <button className="btn-accept" onClick={handleAcceptInvitation}>
                                Aceptar invitación
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className='contact-messages-container'>
                            <div className='messages-list-container'>
                                <MessageContent />
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                        <div className='new-message-form-container'>
                            <NewMessageForm />
                        </div>
                    </>
                )}

            </div>

            {showDetails && (
                <GroupDetailSideBar
                    contactSelected={contactSelected}
                    onClose={() => setShowDetails(false)}
                    onRefresh={loadContacts}
                />
            )}
        </div>
    );
}

