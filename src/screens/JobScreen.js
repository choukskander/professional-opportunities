// import React, { useEffect, useState } from 'react';
// import { Link, useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Row, Col, Card, Button, Container, Form, Alert } from 'react-bootstrap';
// import { listJobDetails } from '../actions/jobActions';
// import './JobScreen.css';
// import axios from 'axios';
// import ApplicantsScreen from './ApplicantsScreen'; // Import ApplicantsScreen

// const JobScreen = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate(); // Use navigate for routing
//   const { id: jobId } = useParams();

//   const jobDetails = useSelector((state) => state.jobDetails);
//   const { loading, error, job } = jobDetails;

//   const userLogin = useSelector((state) => state.userLogin);
//   const { userInfo } = userLogin;

//   const [resume, setResume] = useState(null); // Store the file object
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
//           'Content-Type': 'multipart/form-data',
//         },
//       };
//       const formData = new FormData();
//       formData.append('resume', resume);
//       formData.append('coverLetter', coverLetter);

//       const { data } = await axios.post(
//         `http://localhost:5000/api/applications/${jobId}`,
//         formData,
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

//   const scheduleMeeting = (userName, roomName) => {
//     navigate('/meeting', { state: { userName, roomName } });
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
//           {userInfo && userInfo.role !== 'hr' ? (
//             <Col md={4}>
//               <Card className="apply-card">
//                 <Card.Body>
//                   <Form onSubmit={submitHandler}>
//                     <Form.Group controlId="resume">
//                       <Form.Label>Resume</Form.Label>
//                       <Form.Control
//                         type="file"
//                         accept="application/pdf"
//                         onChange={(e) => setResume(e.target.files[0])}
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
//           ) : (
//             <>
//               <ApplicantsScreen jobId={jobId} />
//               {/* Schedule Meeting Button for HR */}
//               <Button 
//                 className="schedule-meeting-button mt-3" 
//                 onClick={() => scheduleMeeting(userInfo.name, `Room-${jobId}`)}
//               >
//                 Schedule Meeting
//               </Button>
//             </>
//           )}
//         </Row>
//       )}
//     </Container>
//   );
// };

// export default JobScreen;

import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Button, Container, Form, Alert } from 'react-bootstrap';
import { listJobDetails } from '../actions/jobActions';
import './JobScreen.css';
import axios from 'axios';
import ApplicantsScreen from './ApplicantsScreen';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const JobScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: jobId } = useParams();

  const jobDetails = useSelector((state) => state.jobDetails);
  const { loading, error, job } = jobDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(listJobDetails(jobId));
  }, [dispatch, jobId]);

  useEffect(() => {
    if (job?.location) {
      setIsLoading(true);
      getCoordinatesFromAddress(job.location);
    }
  }, [job?.location]);

  const getCoordinatesFromAddress = (address) => {
    const encodedAddress = encodeURIComponent(address);

    axios
      .get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setCoordinates([parseFloat(lat), parseFloat(lon)]);
        } else {
          console.error('Aucune coordonnée trouvée pour l\'adresse :', address);
          setMessage({
            variant: 'danger',
            message: 'Impossible de trouver l\'emplacement sur la carte. Veuillez vérifier l\'adresse.',
          });
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des coordonnées à partir de l\'adresse :', error);
        setMessage({
          variant: 'danger',
          message: 'Erreur lors de la récupération des données de localisation. Veuillez réessayer plus tard.',
        });
        setIsLoading(false);
      });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('coverLetter', coverLetter);

      await axios.post(
        `http://localhost:5000/api/applications/${jobId}`,
        formData,
        config
      );

      setMessage({
        variant: 'success',
        message: 'Candidature soumise avec succès',
      });
    } catch (error) {
      setMessage({
        variant: 'danger',
        message: 'Erreur lors de la soumission de la candidature. Veuillez réessayer.',
      });
    }
  };

  const scheduleMeeting = (userName, roomName) => {
    navigate('/meeting', { state: { userName, roomName } });
  };

  // Define the default icon outside the component
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <Container className="job-screen">
      <Link className="btn btn-light my-3" to="/admin/joblist">
        Retour
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
                <Card.Title className="job-title">{job?.title}</Card.Title>
                <Card.Text className="job-description">{job?.description}</Card.Text>
                <Card.Text className="job-info">
                  <strong>Entreprise :</strong> {job?.company}
                </Card.Text>
                {job?.location && (
                  <>
                    <Card.Text className="job-info">
                      <strong>Localisation :</strong> {job.location}
                    </Card.Text>
                    {/* Affichage de la carte */}
                    <div className="map" style={{ height: '400px' }}>
                      {isLoading ? (
                        <p>Chargement de la carte...</p>
                      ) : coordinates ? (
                        <MapContainer center={coordinates} zoom={13}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={coordinates} icon={defaultIcon}>
                            <Popup>{job.company}</Popup>
                          </Marker>
                        </MapContainer>
                      ) : (
                        <p>Impossible d'afficher la carte pour cet emplacement.</p>
                      )}
                    </div>
                    
                  </>
                )}

              </Card.Body>
            </Card>
          </Col>
          {userInfo && userInfo.role !== 'hr' ? (
            <Col md={4}>
              <Card className="apply-card">
                <Card.Body>
                  <Form onSubmit={submitHandler}>
                    <Form.Group controlId="resume">
                      <Form.Label>CV</Form.Label>
                      <Form.Control
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setResume(e.target.files[0])}
                      />
                    </Form.Group>
                    <Form.Group controlId="coverLetter">
                      <Form.Label>Lettre de motivation</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Entrez la lettre de motivation"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                      />
                    </Form.Group>
                    <Button className="apply-button" type="submit">
                      Postuler maintenant
                    </Button>
                    {message && (
                      <Alert variant={message.variant}>{message.message}</Alert>
                    )}
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            <>
              <ApplicantsScreen jobId={jobId} />
              <Button 
                className="schedule-meeting-button mt-3" 
                onClick={() => scheduleMeeting(userInfo.name, `Room-${jobId}`)}
              >
                Programmer une réunion
              </Button>
            </>
          )}
        </Row>
      )}
    </Container>
  );
};


export default JobScreen;