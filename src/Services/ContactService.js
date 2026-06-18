/* import contacts_data from "../Data/ContactsData";

function getContactsList() {
    return contacts_data;
}

function getContactById(contact_id) {
    for (let contact of contacts_data) {
        if (Number(contact.contact_id) === Number(contact_id)) {
            return contact;
        }
    }
}

function getLastMessageByContactId(contact_id) {
    const contact = getContactById(contact_id);
    if (!contact) return null;
    const messages = contact.messages;
        if (!messages || messages.length === 0) return null;
        return messages[messages.length - 1];
}

export { getContactsList, getContactById, getLastMessageByContactId }; */