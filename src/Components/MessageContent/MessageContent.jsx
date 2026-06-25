import React, { useContext } from 'react'
import { ContactDetailContext } from '../../Context/ContactDetailContext';
import Twemoji from 'react-twemoji';
import './MessageContent.css';

export default function MessageContent() {
    const { contactSelected, messages, loadingMessages } = useContext(ContactDetailContext);

    const formatTextWithMentions = (text) => {
        if (!text) return text;
        const parts = text.split(/(@[a-zA-Z0-9_]+)/g);
        return parts.map((part, index) => {
            if (part.startsWith('@')) {
                return <span key={index} className="message-mention-user">{part}</span>;
            }
            return part;
        });
    };

    const getSenderColorClass = (senderId) => {
        if (!senderId) return 'sender-color-0';
        let hash = 0;
        for (let i = 0; i < senderId.length; i++) {
            hash += senderId.charCodeAt(i);
        }
        return `sender-color-${hash % 10}`;
    };

    const isOnlyEmojis = (text) => {
        if (!text) return false;
        const stripped = text.replace(/[\s\n]/g, '');
        if (stripped.length === 0 || [...stripped].length > 4) return false;
        try {
            return /^[\p{Extended_Pictographic}\p{Emoji_Component}\p{Emoji_Modifier}\p{Emoji_Modifier_Base}]+$/u.test(stripped);
        } catch (e) {
            return false;
        }
    };

    const formatMessageText = (content, isAi) => {
        if (isAi && content.trim().toLowerCase().startsWith("@bayis")) {
            const queryText = content.replace(/^@bayis\s*/i, "");
            return (
                <>
                    <span className="message-mention-bayis">@Bayis</span>
                    {formatTextWithMentions(queryText)}
                </>
            );
        }
        return formatTextWithMentions(content);
    };

    if (loadingMessages) {
        return <div className="loading-messages-text">Cargando conversación...</div>;
    }

    if (!messages || messages.length === 0) {
        return (
            <div className="no-messages-text">
                Es momento de iniciar un nuevo chat. Recuerda que puedes hablar a "@Bayis" para obtener informacion del chat
            </div>
        );
    }

    return (
        <div className='message-content-container'>
            {messages.map((message) => {
                const isAiResponse = message.isAi && !message.sender;
                const isGroupChat = contactSelected?.type === 'group';

                return (
                    <div key={message._id} className='messages-list-container'>
                        <div className={
                            'message-bubble ' +
                            (message.sendByMe ? 'message-by-me' : 'message-by-contact') +
                            (isAiResponse ? ' message-ai-response' : '') +
                            (isOnlyEmojis(message.content) ? ' jumbo-emojis' : '')
                        }>
                            {isAiResponse && (
                                <div className='message-ai-header'>
                                    <svg height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 75.996 75.996" xmlSpace="preserve" fill="#000000">
                                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <circle fill="#a4e566" cx="37.998" cy="37.998" r="37.998"></circle> </g> <g> <circle fill="#dae8ce" cx="37.998" cy="37.998" r="31.664"></circle> </g> <g> <circle fill="#f71f18" cx="37.998" cy="37.998" r="27.498"></circle> </g> <g> <circle fill="#ce7940" cx="37.998" cy="37.998" r="3.438"></circle> </g> <g> <circle fill="#ce7940" cx="37.998" cy="20.998" r="3.438"></circle> </g> <g> <circle fill="#ce7940" cx="23.435" cy="29.789" r="3.438"></circle> </g> <g> <circle fill="#ce7940" cx="23.767" cy="46.796" r="3.438"></circle> </g> <g> <circle fill="#ce7940" cx="38.661" cy="55.013" r="3.438"></circle> </g> <g> <circle fill="#ce7940" cx="53.224" cy="46.222" r="3.438"></circle> </g> <g> <circle fill="#ce7940" cx="52.892" cy="29.214" r="3.438"></circle> </g> </g> </g>
                                    </svg>
                                    <span className="message-ai-badge">Bayis</span>
                                </div>
                            )}
                            {isGroupChat && !message.sendByMe && !isAiResponse && message.sender && (
                                <span className={`message-sender-name ${getSenderColorClass(message.sender._id)}`}>
                                    {message.sender.name}
                                </span>
                            )}
                            <div className='message-bubble-content'>
                                <p className='message-content'>
                                    <Twemoji options={{ className: 'twemoji', folder: 'svg', ext: '.svg' }}>
                                        {formatMessageText(message.content, message.isAi)}
                                    </Twemoji>
                                </p>
                                <span className='message-time'>
                                    {new Date(message.createdAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
