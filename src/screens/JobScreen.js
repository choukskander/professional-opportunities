import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Button, Container } from 'react-bootstrap';
import { listJobDetails } from '../actions/jobActions';
import './JobScreen.css'; // Importing the CSS file

const JobScreen = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const jobDetails = useSelector((state) => state.jobDetails);
  const { loading, error, job } = jobDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin; // Get the logged-in user info

  useEffect(() => {
    dispatch(listJobDetails(id));
  }, [dispatch, id]);

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
                  <Button className="apply-button" type="button">
                    Apply Now
                  </Button>
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
