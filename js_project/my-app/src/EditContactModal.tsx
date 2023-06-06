import React, { useState, useEffect } from 'react';
import { ContactType } from './Contacts';

type EditContactModalProps = {
  contact: ContactType;
  onEditContact: (name: string, phone: string) => void;
  onCancel: () => void;
};

const EditContactModal: React.FC<EditContactModalProps> = ({ contact, onEditContact, onCancel }) => {
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);

  useEffect(() => {
    setName(contact.name);
    setPhone(contact.phone);
  }, [contact]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onEditContact(name, phone);
  };

  return (
    <div>
      <div>Редактировать контакт</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Имя:</label>
          <input type="text" id="name" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <label htmlFor="phone">Телефон:</label>
          <input type="text" id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
        </div>
        <button type="submit">Сохранить</button>
        <button onClick={onCancel}>Отмена</button>
      </form>
    </div>
  );
};

export default EditContactModal;