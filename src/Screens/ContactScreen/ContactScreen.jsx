import React, { useEffect, useContext } from 'react'
import { useParams } from 'react-router';
import MessageContent from '../../Components/MessageContent/MessageContent';
import { ContactDetailContext } from '../../Context/ContactDetailContext';
import { ContactContext } from '../../Context/ContactContext';

export default function ContactDetailScreen() {

    const { contact_id } = useParams();
    const { contactSelected } = useContext(ContactDetailContext);
    const { updateContactById } = useContext(ContactContext);

    console.log('Contacto seleccionado desde contexto ', contactSelected);

    if (!contactSelected) {
        return (
            <div>
                <h2>Contacto no encontrado</h2>
            </div>
        );
    }

    return (
        <div>
            <img src={contactSelected.contact_perfil_image} alt={contactSelected.contact_name} width={40} />
            <h1>{contactSelected.contact_name}</h1>
            {contactSelected && (
                <div>
                    <MessageContent
                        messages_list={contactSelected.messages}
                        contact_selected={contactSelected} />
                </div>
            )}
        </div>
    )
}
