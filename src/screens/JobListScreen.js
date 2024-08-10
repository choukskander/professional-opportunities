import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { listJobs } from '../actions/jobActions';

const JobListScreen = () => {
  const dispatch = useDispatch();

  const jobList = useSelector((state) => state.jobList);
  const { loading, error, jobs } = jobList;

  useEffect(() => {
    dispatch(listJobs());
  }, [dispatch]);

  return (
    <>
      <h1>Job Offers</h1>
      {loading ? (
        <div className="spinner-border" role="status"></div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Row>
          {jobs.map((job) => (
            <Col key={job._id} sm={12} md={6} lg={4} xl={3}>
              <Card className="my-3 p-3 rounded">
                <Card.Body>
                  <Card.Title as="div">
                    <strong>{job.title}</strong>
                  </Card.Title>
                  <Card.Text as="div">{job.company}</Card.Text>
                  <Card.Text as="div">{job.location}</Card.Text>
                  <LinkContainer to={`/job/${job._id}`}>
                    <Button className="btn-block" type="button">
                      View Details
                    </Button>
                  </LinkContainer>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default JobListScreen;
