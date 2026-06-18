import { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useAuth } from "./AuthContext.jsx";
import LoadingScreen from "../Screens/LoadingScreen/Loadingscreen";
import { API_BASE_URL } from "../Config/environment.js";

export const ContactContext = createContext();

export default function ContactContextProvider() {
    const { authToken } = useAuth();
    const [contacts, setContacts] = useState(null);
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const loadContacts = async () => {
        if (!authToken) return;

        if (!contacts) {
            setLoadingContacts(true);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/chats`, {
                headers: {
                    "Authorization": `Bearer ${authToken}`
                }
            });
            const data = await response.json();
            if (data.ok) {
                setContacts(data.data);
            }
        } catch (error) {
            console.error("Error al cargar chats desde el backend:", error);
        } finally {
            setLoadingContacts(false);
        }
    };


    const createDirectChat = async (searchQuery) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/chats/direct`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify({ searchQuery })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Error al iniciar el chat");
            }
            await loadContacts();
            return data;
        } catch (error) {
            console.error("Error en createDirectChat:", error);
            throw error;
        }
    };

    function getContactById(chat_id) {
        if (!contacts || loadingContacts) {
            return null;
        }
        return contacts.find(chat => chat._id === chat_id);
    }

    useEffect(() => {
        if (authToken) {
            loadContacts();
        } else {
            setContacts(null);
            setLoadingContacts(false);
        }
    }, [authToken]);

    const providerValue = {
        contacts,
        loadingContacts,
        loadContacts,
        getContactById,
        createDirectChat,
        searchQuery,
        setSearchQuery
    };

    return (
        <ContactContext.Provider value={providerValue}>
            {
                loadingContacts
                    ? <LoadingScreen />
                    : <Outlet />
            }
        </ContactContext.Provider>
    );
}
