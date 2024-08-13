import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // Image state
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState('');

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      // Fetch user details directly
      const fetchUserDetails = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };

          const { data } = await axios.get(
            `http://localhost:5000/api/users/${userInfo._id}`,
            config
          );

          setName(data.name);
          setEmail(data.email);
          setRole(data.role);
          setSkills(data.skills);
          setExperience(data.experience);
          setProfileImage(data.profileImage); // Set profile image
          setMessage(null);
        } catch (error) {
          console.error('Error fetching user details:', error);
          setMessage('Error fetching user details. Please try again.');
        }
      };

      fetchUserDetails();
    }
  }, [dispatch, navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    } else {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            'Content-Type': 'multipart/form-data',
          },
        };

        // Create FormData for the image upload
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role);
        formData.append('skills', skills.join(','));
        formData.append('experience', experience);
        if (profileImage && profileImage instanceof File) { 
          formData.append('profileImage', profileImage, profileImage.name);
        } 

        const { data } = await axios.put(
          `http://localhost:5000/api/users/profile`,
          formData,
          config
        );

        setMessage({
          variant: 'success',
          message: 'Profile Updated',
        });

        console.log('Profile Updated Successfully:', data);
        // Update the profile image in the UI after success
        setProfileImage(data.profileImage);
      } catch (error) {
        console.error('Error updating profile:', error);
        setMessage({
          variant: 'danger',
          message: 'Error updating profile. Please try again.',
        });
      }
    }
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSkillsChange = (e) => {
    const newSkills = e.target.value.split(','); // Split skills by comma
    setSkills(newSkills);
  };

  return (
    <FormContainer>
      <h2>User Profile</h2>

      {message && (
        <Alert variant={message.variant}>{message.message}</Alert>
      )}
      <Form onSubmit={submitHandler}>
        <Row>
          <Col md={4}>
            <Card>
              <Card.Body>
                {profileImage ? (
                  <Image src={(profileImage)} roundedCircle width="150" height="150" />
                ) : (
                  <Image src="/placeholder-profile-image.jpg" roundedCircle width="150" height="150" />
                )}
                <Form.Group controlId="profileImage" className="mt-3">
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="jobSeeker">Job Seeker</option>
                <option value="hr">HR</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="skills">
              <Form.Label>Skills</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter skills (comma-separated)"
                value={skills.join(',')}
                onChange={handleSkillsChange}
              />
            </Form.Group>

            <Form.Group controlId="experience">
              <Form.Label>Experience</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter your work experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default ProfileScreen;