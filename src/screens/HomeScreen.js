import React from 'react';
import { Row, Col } from 'react-bootstrap';

const HomeScreen = () => {
  return (
    <div>
      <h1>Welcome to the Job Portal</h1>
      <Row>
        <Col>
          <h2>Latest Job Offers</h2>
          {/* Map through the latest job offers and display them here */}
        </Col>
      </Row>
    </div>
  );
};

export default HomeScreen;
