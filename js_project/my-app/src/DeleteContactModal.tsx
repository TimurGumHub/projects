import React from 'react';
import { ContactType } from './Contacts';

type DeleteContactModalProps = {
  contact: ContactType;
  onDeleteContact: () => void;
  onCancel: () => void;
};

const DeleteContactModal: React.FC<DeleteContactModalProps> = ({ contact, onDeleteContact, onCancel }) => {
  return (
    <div>
      <div>Удалить контакт</div>
      <div>Вы действительно хотите удалить этот контакт?</div>
      <button onClick={onDeleteContact}>Удалить</button>
      <button onClick={onCancel}>Отмена</button>
    </div>
  );
};

export default DeleteContactModal;