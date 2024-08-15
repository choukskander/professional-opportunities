// import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Table,Button } from 'react-bootstrap';
// import { listJobs } from '../actions/jobActions';
// import Message from '../components/Message';
// import Loader from '../components/Loader';
// import Paginate from '../components/Paginate';
// import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation


// const JobListScreen = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate(); // Use useNavigate

//   const userLogin = useSelector((state) => state.userLogin);
//   const { userInfo } = userLogin;

//   const jobList = useSelector((state) => state.jobList);
//   const { loading, error, jobs, page, pages } = jobList;

//   // const jobDelete = useSelector((state) => state.jobDelete);
//   // const { success: successDelete } = jobDelete;

//   // Get the keyword using useLocation
//   const location = useLocation();
//   const keyword = location.search ? location.search.split('=')[1] : ''; 

//   useEffect(() => {
//     if (!userInfo) {
//       navigate('/login');
//     } else {
//       dispatch(listJobs(keyword));
//     }
//   }, [dispatch, navigate, keyword, userInfo]);

//   // const deleteHandler = (id) => {
//   //   if (window.confirm('Are you sure you want to delete this job?')) {
//   //     dispatch(deleteJob(id));
//   //   }
//   // };

//   const createJobHandler = () => {
//     navigate('/admin/job/create');
//   };

//   return (
//     <>
//       <h1>Jobs</h1>
//       {loading && <Loader />}
//       {error && <Message variant='danger'>{error}</Message>}
//       {userInfo && userInfo.role === 'hr' && (
//         <Button variant="primary" className="my-3" onClick={createJobHandler}>
//           Create Job
//         </Button>
//       )}
//       {jobs && (
//         <>
//           <Table striped bordered hover responsive className='table-sm'>
//             <thead>
//               <tr>
//                 {/* <th>ID</th> */}
//                 <th>Title</th>
//                 <th>Company</th>
//                 <th>Location</th>
//                 <th>Type</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {jobs.map((job) => (
//                 <tr key={job._id}>
//                   {/* <td>{job._id}</td> */}
//                   <td>{job.title}</td>
//                   <td>{job.company}</td>
//                   <td>{job.location}</td>
//                   <td>{job.type}</td>
//                   <td>
//                     <Link to={`/job/${job._id}`} className='btn btn-sm btn-outline-info'>
//                       View
//                     </Link>
//                     {userInfo && userInfo.role === 'hr' && (
//                       <>
//                         {' '}
//                         <Link
//                           to={`/job/${job._id}/edit`}
//                           className='btn btn-sm btn-outline-primary'
//                         >
//                           Edit
//                         </Link>
//                         {' '}
//                         {/* <Button
//                           variant='danger'
//                           className='btn-sm'
//                           onClick={() => deleteHandler(job._id)}
//                         >
//                           Delete
//                         </Button> */}
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//           <Paginate pages={pages} page={page} isAdmin={true} keyword={keyword} /> 
//         </>
//       )}
//     </>
//   );
// };

// export default JobListScreen;
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { listJobs } from '../actions/jobActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation

const JobListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const jobList = useSelector((state) => state.jobList);
  const { loading, error, jobs, page, pages } = jobList;

  // Get the keyword using useLocation **(Now in JobListScreen)**
  const location = useLocation();
  const keyword = location.search ? location.search.split('=')[1] : ''; 

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(listJobs(keyword));
    }
  }, [dispatch, navigate, keyword, userInfo]);

  const createJobHandler = () => {
    navigate('/admin/job/create');
  };

  return (
    <>
      <h1>Jobs</h1>
      {loading && <Loader />}
      {error && <Message variant='danger'>{error}</Message>}
      {userInfo && userInfo.role === 'hr' && (
        <Button variant="primary" className="my-3" onClick={createJobHandler}>
          Create Job
        </Button>
      )}
      {jobs && (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>{job.location}</td>
                  <td>{job.type}</td>
                  <td>
                    <Link to={`/job/${job._id}`} className='btn btn-sm btn-outline-info'>
                      View
                    </Link>
                    {userInfo && userInfo.role === 'hr' && (
                      <>
                        {' '}
                        <Link
                          to={`/job/${job._id}/edit`}
                          className='btn btn-sm btn-outline-primary'
                        >
                          Edit
                        </Link>
                        {' '}
                        {/* <Button
                          variant='danger'
                          className='btn-sm'
                          onClick={() => deleteHandler(job._id)}
                        >
                          Delete
                        </Button> */}
                      </>
                    )}
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