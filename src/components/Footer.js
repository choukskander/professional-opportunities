import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';  // Import the CSS file (see step 2)

const Footer = () => {
  return (
    <footer className="footer"> {/* Add a class for styling */}
      <Container>
        <Row className="justify-content-center py-3"> {/* Center content */}
          <Col xs="12" md="6" className="text-center"> {/* Responsive column */}
            Copyright © Job Portal
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;