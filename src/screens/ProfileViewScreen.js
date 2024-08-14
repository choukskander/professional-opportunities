import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Row, Col, Image, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormContainer from '../components/FormContainer';

const ProfileViewScreen = () => {
  const { userId } = useParams(); // Get user ID from URL
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userInfo').token}`,
          },
        };

        const { data } = await axios.get(`http://localhost:5000/api/users/${userId}`, config);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError(error.message);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const handleManageAccount = () => {
    navigate(`/profile/${userId}`); // Navigate to update profile screen
  };

  return (
    <FormContainer>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {user && (
        <Card>
          <Card.Header>
            <h3>{user.name}</h3>
            
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <Card>
                  <Card.Body>
                    {user.profileImage ? (
                      <Image src={user.profileImage} roundedCircle width="150" height="150" />
                    ) : (
                      <Image src="/placeholder-profile-image.jpg" roundedCircle width="150" height="150" />
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={8}>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Skills:</strong> {user.skills.map((skill) => skill.name).join(', ')}</p>

                <h4 className="mt-4">Experience</h4>
                {user.experience.map((exp, index) => (
                  <div key={index}>
                    <h5>{exp.title}</h5>
                    <p><strong>Company:</strong> {exp.company}</p>
                    <p><strong>Location:</strong> {exp.location}</p>
                    <p><strong>Start Date:</strong> {new Date(exp.startDate).toLocaleDateString()}</p>
                    {exp.endDate && <p><strong>End Date:</strong> {new Date(exp.endDate).toLocaleDateString()}</p>}
                    <p>{exp.description}</p>
                  </div>
                ))}
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Button variant="primary" onClick={handleManageAccount}>Manage Account</Button>
          </Card.Footer>
        </Card>
      )}
    </FormContainer>
  );
};

export default ProfileViewScreen;