import React, { useState } from 'react';

type AddContactModalProps = {
  onAddContact: (name: string, phone: string) => void;
  onCancel: () => void;
};

const AddContactModal: React.FC<AddContactModalProps> = ({ onAddContact, onCancel }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddContact(name, phone);
  };

  return (
    <div>
      <div>Добавить контакт</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Имя:</label>
          <input type="text" id="name" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <label htmlFor="phone">Телефон:</label>
          <input type="text" id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
        </div>
        <button type="submit">Добавить</button>
        <button onClick={onCancel}>Отмена</button>
      </form>
    </div>
  );
};

export default AddContactModal;