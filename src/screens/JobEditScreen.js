import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer'; 
import { listJobDetails, updateJob } from '../actions/jobActions'; 
import Loader from '../components/Loader';
import Message from '../components/Message';

const JobEditScreen = () => {
  const { id: jobId } = useParams(); 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const jobDetails = useSelector((state) => state.jobDetails);
  const { loading, error, job } = jobDetails;

  const jobUpdate = useSelector((state) => state.jobUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = jobUpdate;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState(''); 
  const [location, setLocation] = useState(''); 
  const [type, setType] = useState(''); 

  useEffect(() => {
    if (successUpdate) {
      // Clear successUpdate flag after successful update
      dispatch({ type: 'JOB_UPDATE_RESET' });

      // Navigate to the job list
      navigate('/admin/joblist'); 
    } else {
      if (!job.title || job._id !== jobId) {
        dispatch(listJobDetails(jobId));
      } else {
        setTitle(job.title);
        setDescription(job.description);
        setCompany(job.company);
        setLocation(job.location);
        setType(job.type);
      }
    }
  }, [dispatch, navigate, jobId, job, successUpdate]); 

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateJob({ _id: jobId, title, description, company, location, type })); 
  };

  return (
    <>
      <Link to="/admin/joblist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Job</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="company">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="full-time">Full-Time</option>
                <option value="internship">Internship</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default JobEditScreen;