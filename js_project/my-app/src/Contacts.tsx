import { useState } from 'react';
import Contact from './Contact';
import AddContactModal from './AddContactModal';
import EditContactModal from './EditContactModal';
import DeleteContactModal from './DeleteContactModal';

export type ContactType = {
  id: number;
  name: string;
  phone: string;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactType | null>(null);

  const handleAddContact = (name: string, phone: string) => {
    const newContact = { id: contacts.length + 1, name, phone };
    setContacts([newContact, ...contacts]);
    setShowAddContactModal(false);
  };

  const handleEditContact = (name: string, phone: string) => {
    if (selectedContact) {
      const updatedContact = { ...selectedContact, name, phone };
      const updatedContacts = contacts.map((contact) => (contact.id === selectedContact.id ? updatedContact : contact));
      setContacts(updatedContacts);
      setSelectedContact(null);
      setShowEditContactModal(false);
    }
  };

  const handleDeleteContact = () => {
    if (selectedContact) {
      const updatedContacts = contacts.filter((contact) => contact.id !== selectedContact.id);
      setContacts(updatedContacts);
      setSelectedContact(null);
      setShowDeleteContactModal(false);
    }
  };

  return (
    <div>
      <button onClick={() => setShowAddContactModal(true)}>Добавить контакт</button>
      {contacts.map((contact) => (
        <Contact
          key={contact.id}
          contact={contact}
          onEdit={() => {
            setSelectedContact(contact);
            setShowEditContactModal(true);
          }}
          onDelete={() => {
            setSelectedContact(contact);
            setShowDeleteContactModal(true);
          }}
        />
      ))}
      {showAddContactModal && <AddContactModal onAddContact={handleAddContact} onCancel={() => setShowAddContactModal(false)} />}
      {showEditContactModal && selectedContact && <EditContactModal contact={selectedContact} onEditContact={handleEditContact} onCancel={() => setShowEditContactModal(false)} />}
      {showDeleteContactModal && selectedContact && <DeleteContactModal contact={selectedContact} onDeleteContact={handleDeleteContact} onCancel={() => setShowDeleteContactModal(false)} />}
    </div>
  );
};

export default Contacts;