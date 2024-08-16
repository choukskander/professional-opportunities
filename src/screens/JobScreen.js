// import React, { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Row, Col, Card, Button, Container, Form, Alert } from 'react-bootstrap';
// import { listJobDetails } from '../actions/jobActions';
// import './JobScreen.css'; // Importing the CSS file
// //import { createApplication } from '../actions/applicationActions'; // Import createApplication action
// import axios from 'axios';

// const JobScreen = () => {
//   const dispatch = useDispatch();
//   const { id: jobId } = useParams();

//   const jobDetails = useSelector((state) => state.jobDetails);
//   const { loading, error, job } = jobDetails;

//   const userLogin = useSelector((state) => state.userLogin);
//   const { userInfo } = userLogin; // Get the logged-in user info

//   const [resume, setResume] = useState('');
//   const [coverLetter, setCoverLetter] = useState('');
//   const [message, setMessage] = useState(null);

//   useEffect(() => {
//     dispatch(listJobDetails(jobId));
//   }, [dispatch, jobId]);

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${userInfo.token}`,
//         },
//       };
//       const data = await axios.post(
//         `http://localhost:5000/api/applications/${jobId}`, // Update the URL
//         { resume, coverLetter },
//         config
//       );
//       setMessage({
//         variant: 'success',
//         message: 'Application Submitted Successfully',
//       });
//       console.log('Application Created Successfully', data);
//     } catch (error) {
//       console.error('Error creating application:', error);
//       setMessage({
//         variant: 'danger',
//         message: 'Error submitting application. Please try again.',
//       });
//     }
//   };

//   return (
//     <Container className="job-screen">
//       <Link className="btn btn-light my-3" to="/admin/joblist">
//         Go Back
//       </Link>
//       {loading ? (
//         <div className="spinner-border" role="status"></div>
//       ) : error ? (
//         <div className="alert alert-danger">{error}</div>
//       ) : (
//         <Row>
//           <Col md={userInfo && userInfo.role !== 'hr' ? 8 : 12}>
//             <Card className="job-details-card">
//               <Card.Body>
//                 <Card.Title className="job-title">{job.title}</Card.Title>
//                 <Card.Text className="job-description">{job.description}</Card.Text>
//                 <Card.Text className="job-info">
//                   <strong>Company:</strong> {job.company}
//                 </Card.Text>
//                 <Card.Text className="job-info">
//                   <strong>Location:</strong> {job.location}
//                 </Card.Text>
//                 <Card.Text className="job-info">
//                   <strong>Type:</strong> {job.type}
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>
//           {userInfo && userInfo.role !== 'hr' && (
//             <Col md={4}>
//               <Card className="apply-card">
//                 <Card.Body>
//                   <Form onSubmit={submitHandler}>
//                     <Form.Group controlId="resume">
//                       <Form.Label>Resume</Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="Enter resume"
//                         value={resume}
//                         onChange={(e) => setResume(e.target.value)}
//                       />
//                     </Form.Group>
//                     <Form.Group controlId="coverLetter">
//                       <Form.Label>Cover Letter</Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="Enter cover letter"
//                         value={coverLetter}
//                         onChange={(e) => setCoverLetter(e.target.value)}
//                       />
//                     </Form.Group>
//                     <Button className="apply-button" type="submit">
//                       Apply Now
//                     </Button>
//                     {message && (
//                       <Alert variant={message.variant}>{message.message}</Alert>
//                     )}
//                   </Form>
//                 </Card.Body>
//               </Card>
//             </Col>
//           )}
//         </Row>
//       )}
//     </Container>
//   );
// };

// export default JobScreen;

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Button, Container, Form, Alert } from 'react-bootstrap';
import { listJobDetails } from '../actions/jobActions';
import './JobScreen.css'; // Importing the CSS file
//import { createApplication } from '../actions/applicationActions'; // Import createApplication action
import axios from 'axios';

const JobScreen = () => {
  const dispatch = useDispatch();
  const { id: jobId } = useParams();

  const jobDetails = useSelector((state) => state.jobDetails);
  const { loading, error, job } = jobDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin; // Get the logged-in user info

  const [resume, setResume] = useState(null); // Store the file object
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    dispatch(listJobDetails(jobId));
  }, [dispatch, jobId]);

  const submitHandler = async (e) => {
    e.preventDefault();
  
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data', // Ensure multipart/form-data is set
        },
      };
      const formData = new FormData();
      formData.append('resume', resume); // Ensure this is the file object
      formData.append('coverLetter', coverLetter);
  
      const { data } = await axios.post(
        `http://localhost:5000/api/applications/${jobId}`,
        formData,
        config
      );
      
      setMessage({
        variant: 'success',
        message: 'Application Submitted Successfully',
      });
      console.log('Application Created Successfully', data);
    } catch (error) {
      console.error('Error creating application:', error);
      setMessage({
        variant: 'danger',
        message: 'Error submitting application. Please try again.',
      });
    }
  };
  

  return (
    <Container className="job-screen">
      <Link className="btn btn-light my-3" to="/admin/joblist">
        Go Back
      </Link>
      {loading ? (
        <div className="spinner-border" role="status"></div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Row>
          <Col md={userInfo && userInfo.role !== 'hr' ? 8 : 12}>
            <Card className="job-details-card">
              <Card.Body>
                <Card.Title className="job-title">{job.title}</Card.Title>
                <Card.Text className="job-description">{job.description}</Card.Text>
                <Card.Text className="job-info">
                  <strong>Company:</strong> {job.company}
                </Card.Text>
                <Card.Text className="job-info">
                  <strong>Location:</strong> {job.location}
                </Card.Text>
                <Card.Text className="job-info">
                  <strong>Type:</strong> {job.type}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          {userInfo && userInfo.role !== 'hr' && (
            <Col md={4}>
              <Card className="apply-card">
                <Card.Body>
                  <Form onSubmit={submitHandler}>
                  <Form.Group controlId="resume">
                    <Form.Label>Resume</Form.Label>
                    <Form.Control
                    type="file"
                    accept="application/pdfz"
                    onChange={(e) => {
                    console.log(e.target.files[0]); // Log selected file for debugging
                    setResume(e.target.files[0]); // Ensure the file object is being set correctly
                   }}
                  />
                  </Form.Group>
                  
                    <Form.Group controlId="coverLetter">
                      <Form.Label>Cover Letter</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter cover letter"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                      />
                    </Form.Group>
                    <Button className="apply-button" type="submit">
                      Apply Now
                    </Button>
                    {message && (
                      <Alert variant={message.variant}>{message.message}</Alert>
                    )}
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default JobScreen;