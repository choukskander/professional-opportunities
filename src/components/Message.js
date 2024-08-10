// src/components/Message.js

import React from 'react';
import { Alert } from 'react-bootstrap'; // Assurez-vous que react-bootstrap est installé

const Message = ({ variant = 'info', children }) => {
  return (
    <Alert variant={variant}>
      {children}
    </Alert>
  );
};

export default Message;
