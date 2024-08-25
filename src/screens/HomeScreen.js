import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const [latestJobs, setLatestJobs] = useState([]);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
    const fetchLatestJobs = async () => {
      try {
        const { data } = await axios.get('/api/jobs/latest'); // Ensure the endpoint is correct
        setLatestJobs(data);
      } catch (error) {
        console.error('Failed to fetch latest jobs:', error);
      }
    };
  
    fetchLatestJobs();
    
  }}, [userInfo, navigate]);
   // Empty dependency array ensures this runs once when the component mounts

  return (
    <div>
      <h1>Welcome to the Job Portal</h1>
      <Row>
        <Col>
          <h2>Latest Job Offers</h2>
          {latestJobs.length > 0 ? (
            latestJobs.map((job) => (
              <Card key={job._id} className="my-3 p-3 rounded">
                <Card.Body>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{job.company}</Card.Subtitle>
                  <Card.Text>{job.description}</Card.Text>
                  <Card.Text>
                    <small>{job.location}</small>
                  </Card.Text>
                  {/* Add more details or links as needed */}
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No job offers available at the moment.</p>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default HomeScreen;
