import React, { useEffect, useCallback, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { listJobs, deleteJob } from '../actions/jobActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';

const JobListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const jobList = useSelector((state) => state.jobList);
  const { loading, error, jobs: jobsFromRedux, page, pages } = jobList;

  const keyword = location.search ? location.search.split('=')[1] : '';

  const [jobs, setJobs] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchJobs = useCallback(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(listJobs(keyword));
    }
  }, [dispatch, navigate, keyword, userInfo]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    setJobs(jobsFromRedux); // Update local jobs state when jobsFromRedux changes
  }, [jobsFromRedux]);

  const createJobHandler = () => {
    navigate('/admin/job/create');
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this job and its applications?')) {
      setIsDeleting(true);
      try {
        await dispatch(deleteJob(id));
        // Optimistically update the local state to remove the deleted job
        setJobs(jobs.filter((job) => job._id !== id));
      } catch (error) {
        console.error('Error deleting job:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const renderEditButton = (job) => {
    if (job.createdBy._id.toString() === userInfo._id.toString()) {
      return (
        <>
          <Link
            to={`/admin/job/${job._id}/edit`}
            className="btn btn-sm btn-outline-primary mx-1"
          >
            Edit
          </Link>
          <Button
            variant="danger"
            size="sm"
            disabled={isDeleting}
            onClick={() => deleteHandler(job._id)}
          >
            Delete
          </Button>
        </>
      );
    }
    return null;
  };

  return (
    <>
      <h1>Jobs</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {userInfo && userInfo.role === 'hr' && (
            <Button variant="primary" className="my-3" onClick={createJobHandler}>
              Create Job
            </Button>
          )}
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Type</th>
                <th>Created By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>{job.location}</td>
                  <td>{job.type}</td>
                  <td>{job.createdBy.name}</td>
                  <td>
                    <Link
                      to={`/admin/job/${job._id}`}
                      className="btn btn-sm btn-outline-info"
                    >
                      View
                    </Link>
                    {userInfo && userInfo.role === 'hr' && renderEditButton(job)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} keyword={keyword} />
        </>
      )}
    </>
  );
};

export default JobListScreen;
