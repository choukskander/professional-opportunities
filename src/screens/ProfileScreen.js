import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col, Image, Card, Container, FormControl } from 'react-bootstrap';
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
  const [profileImage, setProfileImage] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experienceEntries, setExperienceEntries] = useState([
    { title: '', company: '', location: '', startDate: '', endDate: '', description: '' },
  ]);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
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
          setExperienceEntries(data.experience);

          // Check if profileImage is set; if not, set to placeholder
          setProfileImage(data.profileImage || '/placeholder-profile-image.jpg');
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

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role);
        formData.append('skills', JSON.stringify(skills)); // Just JSON stringify the array directly
        formData.append('experience', JSON.stringify(experienceEntries));

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

        setProfileImage(data.profileImage || '/placeholder-profile-image.jpg');
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
    const newSkills = e.target.value.split(',').map((skill) => skill.trim()); // Ensure it's an array of strings
    setSkills(newSkills);
  };
  

  const addExperienceEntry = () => {
    setExperienceEntries([
      ...experienceEntries,
      { title: '', company: '', location: '', startDate: '', endDate: '', description: '' },
    ]);
  };

  const removeExperienceEntry = (index) => {
    setExperienceEntries(experienceEntries.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index, field, value) => {
    setExperienceEntries(
      experienceEntries.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    );
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
                <Image
                  src={
                    profileImage instanceof File
                      ? URL.createObjectURL(profileImage)
                      : profileImage || '/placeholder-profile-image.jpg'
                  }
                  roundedCircle
                  width="150"
                  height="150"
                />
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
                value={skills}
                onChange={handleSkillsChange}
              />
            </Form.Group>

            <Form.Group controlId="experience">
              <Form.Label>Experience</Form.Label>
              {experienceEntries.map((entry, index) => (
                <Container key={index}>
                  <Row>
                    <Col md={3}>
                      <Form.Control
                        type="text"
                        placeholder="Title"
                        value={entry.title}
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="text"
                        placeholder="Company"
                        value={entry.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="text"
                        placeholder="Location"
                        value={entry.location}
                        onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="date"
                        placeholder="Start Date"
                        value={entry.startDate}
                        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={3}>
                      <Form.Control
                        type="date"
                        placeholder="End Date"
                        value={entry.endDate}
                        onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                      />
                    </Col>
                    <Col md={9}>
                      <FormControl
                        as="textarea"
                        placeholder="Description"
                        value={entry.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Button variant="danger" onClick={() => removeExperienceEntry(index)}>
                    Remove
                  </Button>{' '}
                </Container>
              ))}
              <Button variant="primary" onClick={addExperienceEntry} className="mt-2">
                Add Experience
              </Button>
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
              Update Profile
            </Button>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default ProfileScreen;
