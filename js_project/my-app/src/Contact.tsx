import React from 'react';
import { ContactType } from './Contacts';

type ContactProps = {
  contact: ContactType;
  onEdit: () => void;
  onDelete: () => void;
};

const Contact: React.FC<ContactProps> = ({ contact, onEdit, onDelete }) => {
  return (
    <div>
      <h3>{contact.name}</h3>
      <p>{contact.phone}</p>
      <button onClick={onEdit}>Редактировать</button>
      <button onClick={onDelete}>Удалить</button>
    </div>
  );
};

export default Contact;