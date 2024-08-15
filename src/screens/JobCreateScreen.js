import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { createJob } from '../actions/jobActions';
import Message from '../components/Message';
import Loader from '../components/Loader';

const JobCreateScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('full-time'); // Type par défaut
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobCreate = useSelector((state) => state.jobCreate);
  const { loading, error, success } = jobCreate;

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(
      createJob({ title, description, company, location, type })
    );
  };

  useEffect(() => {
    if (success) {
      setMessage('Job Created');
      navigate('/admin/joblist'); // Redirige vers la liste des jobs
    }
  }, [success, navigate]);

  return (
    <FormContainer>
      <h1>Create Job</h1>
      {message && <Message variant='success'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='title'>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='description'>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as='textarea'
            row='5'
            placeholder='Enter description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='company'>
          <Form.Label>Company</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter company'
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='location'>
          <Form.Label>Location</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='type'>
          <Form.Label>Type</Form.Label>
          <Form.Select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value='full-time'>Full-Time</option>
            <option value='internship'>Internship</option>
          </Form.Select>
        </Form.Group>

        <Button type='submit' variant='primary'className='mt-2'>
          Create Job
        </Button>
      </Form>
    </FormContainer>
  );
};

export default JobCreateScreen;
