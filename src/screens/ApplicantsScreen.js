// import React, { useEffect, useState, useCallback } from 'react';
// import { Row, Col, Card } from 'react-bootstrap';
// import axios from 'axios';

// import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';

// const ApplicantsScreen = ({ jobId }) => {
//   const [applicants, setApplicants] = useState([]);

//   const userLogin = useSelector((state) => state.userLogin);
//   const { userInfo } = userLogin;

//   const fetchApplicants = useCallback(async () => {
//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${userInfo.token}`,
//         },
//       };
//       const { data } = await axios.get(`/api/jobs/${jobId}/applications`, config);
//       setApplicants(data);
//     } catch (error) {
//       console.error('Error fetching applicants:', error);
//     }
//   }, [jobId, userInfo]);

//   useEffect(() => {
//     if (userInfo && userInfo.token) {
//       fetchApplicants();
//     } else {
//       console.error('User is not logged in.');
//     }
//   }, [fetchApplicants, userInfo]);

//   return (
//     <Row>
//       {applicants.map((applicant) => (
//         <Col key={applicant._id} md={6} lg={4}>
//           <Card className="my-3 p-3 rounded">
//             <Card.Body>
//               <Card.Title>{applicant.user.name}</Card.Title>
              
//               <Card.Text>
//                 <strong>Email:</strong> {applicant.user.email}
//               </Card.Text>
      
//               <Card.Text>
//   <strong>Resume:</strong>
//   <a href={`http://localhost:5000/uploads/${applicant.resume}`} target="_blank" rel="noopener noreferrer">
//     View Resume
//   </a>
// </Card.Text>

//               <Card.Text>
//                 <strong>Cover Letter:</strong> {applicant.coverLetter}
//               </Card.Text>
//               <Link
//                       to={`/profile/view/${applicant.user._id}`}
//                       className="btn btn-sm btn-outline-info"
//                     >
//                       View profile
//                     </Link>
//             </Card.Body>
//           </Card>
//         </Col>
//       ))}
//     </Row>
//   );
// };

// export default ApplicantsScreen;

import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
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
      console.error('Erreur lors de la récupération des candidats:', error);
    }
  }, [jobId, userInfo]);

  // Fonction pour mettre à jour le statut de l'application
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Update the API call to use the new route
      await axios.put(`/api/applications/${jobId}/applications/${applicationId}/status`, { status }, config);console.log('status'+status)
      fetchApplicants(); // Recharger les candidats après la mise à jour du statut
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de l\'application:', error);
      
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.token) {
      fetchApplicants();
    } else {
      console.error('L\'utilisateur n\'est pas connecté.');
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
                <a href={`http://localhost:5000/uploads/${applicant.resume}`} target="_blank" rel="noopener noreferrer">
                  Voir le CV
                </a>
              </Card.Text>

              <Card.Text>
                <strong>Lettre de Motivation:</strong> {applicant.coverLetter}
              </Card.Text>
              <Card.Text>
                <strong>status:</strong> {applicant.status}
              </Card.Text>
              {/* Boutons pour changer le statut */}
              <Button
                variant="success"
                className="btn-sm mx-1"
                onClick={() => updateApplicationStatus(applicant._id, 'accepted')}
              >
                Accepter
              </Button>
              <Button
                variant="danger"
                className="btn-sm"
                onClick={() => updateApplicationStatus(applicant._id, 'rejected')}
              >
                Rejeter
              </Button>
             <div></div>
              <Link
                to={`/profile/view/${applicant.user._id}`}
                className="btn btn-sm btn-outline-info mt-2"
              >
                Voir le profil
              </Link>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ApplicantsScreen;