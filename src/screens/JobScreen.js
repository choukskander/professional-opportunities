import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { listJobDetails } from '../actions/jobActions';

const JobScreen = ({ match }) => {
  const dispatch = useDispatch();

  const jobDetails = useSelector((state) => state.jobDetails);
  const { loading, error, job } = jobDetails;

  useEffect(() => {
    dispatch(listJobDetails(match.params.id));
  }, [dispatch, match]);

  return (
    <>
      <Link className="btn btn-light my-3" to="/jobs">
        Go Back
      </Link>
      {loading ? (
        <div className="spinner-border" role="status"></div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Row>
          <Col md={8}>
            <Card>
              <Card.Body>
                <Card.Title>{job.title}</Card.Title>
                <Card.Text>{job.description}</Card.Text>
                <Card.Text>
                  <strong>Company:</strong> {job.company}
                </Card.Text>
                <Card.Text>
                  <strong>Location:</strong> {job.location}
                </Card.Text>
                <Card.Text>
                  <strong>Type:</strong> {job.type}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Button className="btn-block" type="button">
                  Apply Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default JobScreen;
