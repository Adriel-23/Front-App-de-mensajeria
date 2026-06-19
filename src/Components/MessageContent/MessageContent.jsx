import React, { useContext } from 'react'
import { ContactDetailContext } from '../../Context/ContactDetailContext';
import Twemoji from 'react-twemoji';
import './MessageContent.css';

export default function MessageContent() {
    const { messages, loadingMessages } = useContext(ContactDetailContext);

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

                return (
                    <div key={message._id} className='messages-list-container'>
                        <div className={
                            'message-bubble ' +
                            (message.sendByMe ? 'message-by-me' : 'message-by-contact') +
                            (isAiResponse ? ' message-ai-response' : '') +
                            (isOnlyEmojis(message.content) ? ' jumbo-emojis' : '')
                        }>
                            {isAiResponse && (
                                <span className="message-ai-badge">Bayis</span>
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
