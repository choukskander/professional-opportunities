// src/components/Loader.js

import React from 'react';
import { Spinner } from 'react-bootstrap'; // Assurez-vous que react-bootstrap est installé

const Loader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default Loader;
