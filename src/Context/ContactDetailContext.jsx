import { useContext, createContext, useState, useEffect } from "react";
import { ContactContext } from "./ContactContext";
import { useAuth } from "./AuthContext";
import { useParams, Outlet } from "react-router";
import { API_BASE_URL } from "../Config/environment.js";

export const ContactDetailContext = createContext({
    contactSelected: null,
    messages: [],
    loadingMessages: false,
    addNewMessage: () => { }
});

export default function ContactDetailContextProvider() {
    const { getContactById, loadContacts } = useContext(ContactContext);
    const { authToken } = useAuth();
    const { contact_id } = useParams();

    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const contactSelected = getContactById(contact_id);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!contact_id || !authToken) return;
            setLoadingMessages(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/messages/${contact_id}`, {
                    headers: {
                        "Authorization": `Bearer ${authToken}`
                    }
                });
                const data = await response.json();
                if (data.ok) {
                    setMessages(data.data);
                }
            } catch (err) {
                console.error("Error al cargar mensajes:", err);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchMessages();
    }, [contact_id, authToken]);

    const addNewMessage = async (new_message_text) => {

        if (!contact_id || !authToken || !new_message_text || new_message_text.trim() === "") return;

        const isAiQuery = new_message_text.trim().toLowerCase().startsWith("@bayis");

        if (isAiQuery) {

            try {
                const response = await fetch(`${API_BASE_URL}/api/messages/${contact_id}/query-ai`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    },
                    body: JSON.stringify({ question: new_message_text })
                });

                const data = await response.json();
                if (data.ok) {
                    const qMsg = { ...data.data.question, sendByMe: true };
                    const rMsg = { ...data.data.response, sendByMe: false };

                    setMessages((prev) => [...prev, qMsg, rMsg]);
                    await loadContacts();
                }
            } catch (error) {
                console.error("Error al consultar al asistente IA:", error);
            }
            return;
        }


        try {
            const response = await fetch(`${API_BASE_URL}/api/messages/${contact_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify({ content: new_message_text })
            });
            const data = await response.json();
            if (data.ok) {
                setMessages((prev) => [...prev, data.data]);
                await loadContacts();
            }
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
        }
    };


    const contactDetailValue = {
        contactSelected,
        messages,
        loadingMessages,
        addNewMessage
    };

    return (
        <ContactDetailContext.Provider value={contactDetailValue}>
            <Outlet />
        </ContactDetailContext.Provider>
    );
}
