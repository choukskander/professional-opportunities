import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ApplicantsScreen = ({ jobId }) => {
  const [applicants, setApplicants] = useState([]);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const fetchApplicants = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`/api/jobs/${jobId}/applications`, config);
      setApplicants(data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    }
  }, [jobId, userInfo.token]);

  useEffect(() => {
    if (userInfo && userInfo.token) {
      fetchApplicants();
    } else {
      console.error('User is not logged in.');
    }
  }, [fetchApplicants, userInfo]);

  return (
    <Row>
      {applicants.map((applicant) => (
        <Col key={applicant._id} md={6} lg={4}>
          <Card className="my-3 p-3 rounded">
            <Card.Body>
              <Card.Title>{applicant.user.name}</Card.Title>
              
              <Card.Text>
                <strong>Email:</strong> {applicant.user.email}
              </Card.Text>
              <Card.Text>
                <strong>Resume:</strong> 
                <a href={`/uploads/${applicant.resume}`} target="_blank" rel="noopener noreferrer">
                  View Resume
                </a>
              </Card.Text>
              <Card.Text>
                <strong>Cover Letter:</strong> {applicant.coverLetter}
              </Card.Text>
              <Link
                      to={`/profile/view/${applicant.user._id}`}
                      className="btn btn-sm btn-outline-info"
                    >
                      View profile
                    </Link>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ApplicantsScreen;

