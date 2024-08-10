// src/screens/JobEditScreen.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer'; // Assurez-vous que ce fichier existe
import { listJobDetails, updateJob } from '../actions/jobActions'; // Assurez-vous que ces fonctions existent
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

  useEffect(() => {
    if (successUpdate) {
      navigate('/admin/joblist');
    } else {
      if (!job.title || job._id !== jobId) {
        dispatch(listJobDetails(jobId));
      } else {
        setTitle(job.title);
        setDescription(job.description);
      }
    }
  }, [dispatch, navigate, jobId, job, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateJob({ _id: jobId, title, description }));
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
