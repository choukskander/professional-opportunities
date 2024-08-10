import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import axios from 'axios'; // Import axios for making API calls
import { useNavigate } from 'react-router-dom'; 

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(''); // Add role state
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const navigate = useNavigate(); // Use useNavigate

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
          setRole(data.role); // Set role state
          setMessage(null); // Clear the message state
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
      return; // Stop execution if passwords don't match
    } else {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.put(
          `http://localhost:5000/api/users/profile`,
          { name, email, password, role }, 
          config
        );

        // Set a success message with green color
        setMessage({ 
          variant: 'success',  
          message: 'Profile Updated'
        }); 

        console.log('Profile Updated Successfully:', data);
      } catch (error) {
        console.error('Error updating profile:', error);
        // Set an error message with red color
        setMessage({ 
          variant: 'danger', 
          message: 'Error updating profile. Please try again.'
        });
      }
    }
  };

  return (
    <FormContainer>
      <h2>User Profile</h2>
      
      {message && (
        <Alert variant={message.variant}> {message.message} </Alert>
      )}
      <Form onSubmit={submitHandler}>
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
      </Form>
    </FormContainer>
  );
};

export default ProfileScreen; 