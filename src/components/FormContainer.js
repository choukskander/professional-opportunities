// src/components/FormContainer.js
import React from 'react';
import { Container } from 'react-bootstrap';

const FormContainer = ({ children }) => {
  return (
    <Container>
      <div className="py-3">
        {children}
      </div>
    </Container>
  );
};

export default FormContainer;
