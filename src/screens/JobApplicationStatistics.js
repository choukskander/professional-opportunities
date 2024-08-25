import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importez le hook useNavigate

const JobApplicationStatistics = () => {
  const [statistics, setStatistics] = useState([]); // For the first chart
  const [statistics2, setStatistics2] = useState([]); // For the second chart
  const [mostAppliedJob, setMostAppliedJob] = useState(null);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate(); // Utilisez useNavigate pour la redirection

  useEffect(() => {
    // Redirection si l'utilisateur n'est pas connecté
    if (!userInfo) {
      navigate('/login');
    } else {

    const fetchStatistics = async () => {
      try {
        // Vérification si userInfo est défini et contient un token
        if (userInfo.token) {
          const token = userInfo.token;
          // Fetch data for both statistics
          const [statisticsData, statisticsData2] = await Promise.all([
            axios.get('http://localhost:5000/api/applications/statistics/jobs-applications', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            axios.get('http://localhost:5000/api/applications/statistics/jobs-applications2', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);
          setStatistics(statisticsData.data); // Update statistics with the data from the first API call
          setStatistics2(statisticsData2.data); // Update statistics2 with the data from the second API call
          findMostAppliedJob(statisticsData.data); // Find the most applied job based on the first API call
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    };

    // Vérification supplémentaire pour s'assurer que userInfo existe et que l'utilisateur est un 'hr'
    if (userInfo.role === 'hr') {
      fetchStatistics();
    }}
  }, [userInfo, navigate]); // Ajoutez navigate aux dépendances pour éviter les avertissements

  const findMostAppliedJob = (data) => {
    if (data && data.length > 0) {
      const maxApplicationsJob = data.reduce((max, job) =>
        job.totalApplications > max.totalApplications ? job : max,
        data[0]
      );
      setMostAppliedJob(maxApplicationsJob);
    }
  };

  const getChartData = () => {
    return statistics.map((stat) => ({
      job: stat.jobTitle,
      applications: stat.totalApplications,
    }));
  };
    const getChartData2 = () => {
    // Exemple de transformation des données pour le graphique
    return statistics2.map((stat) => ({
      job: stat.jobTitle,
      applications: stat.totalApplications,
      accepted: stat.acceptedApplications,
      rejected: stat.rejectedApplications,
    }));
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Afficher le job avec le plus d'applications en haut de la page */}
      {mostAppliedJob && (
        <div className="winner-card" style={{
          backgroundColor: '#fff4e5',
          padding: '20px',
          borderRadius: '15px',
          border: '2px solid #FFAA00', // Ajout d'un contour
          margin: '0 auto 30px auto', // Centrage de la carte
          maxWidth: '200px', // Largeur maximale de la carte
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h1 style={{ color: '#FFAA00', fontSize: '3rem' }}>1<sup>st</sup></h1>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{mostAppliedJob.jobTitle}</p>
          </div>
          <div>
            <svg width="80" height="80" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M469.333333 682.666667h85.333334v128h-85.333334zM435.2 810.666667h153.6c4.693333 0 8.533333 3.84 8.533333 8.533333v34.133333h-170.666666v-34.133333c0-4.693333 3.84-8.533333 8.533333-8.533333z" fill="#ea9518" className=""></path><path d="M384 853.333333h256a42.666667 42.666667 0 0 1 42.666667 42.666667v42.666667H341.333333v-42.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z" fill="#6e4a32" className=""></path><path d="M213.333333 256v85.333333a42.666667 42.666667 0 0 0 85.333334 0V256H213.333333zM170.666667 213.333333h170.666666v128a85.333333 85.333333 0 1 1-170.666666 0V213.333333zM725.333333 256v85.333333a42.666667 42.666667 0 0 0 85.333334 0V256h-85.333334z m-42.666666-42.666667h170.666666v128a85.333333 85.333333 0 1 1-170.666666 0V213.333333z" fill="#f4ea2a" className=""></path><path d="M298.666667 85.333333h426.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v341.333333a256 256 0 1 1-512 0V128a42.666667 42.666667 0 0 1 42.666667-42.666667z" fill="#f2be45" className=""></path><path d="M512 469.333333l-100.309333 52.736 19.157333-111.701333-81.152-79.104 112.128-16.298667L512 213.333333l50.176 101.632 112.128 16.298667-81.152 79.104 19.157333 111.701333z" fill="#FFF2A0"></path></svg>
          </div>
        </div>
      )}
<div>
      <h2>Statistiques sur les Applications de Jobs</h2>
      <BarChart width={800} height={400} data={getChartData()}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="job" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="applications" fill="#82ca9d" />
      </BarChart>
      </div>
      <div>
            <h2>Statistics on Jobs and Applications</h2>
            <BarChart width={800} height={400} data={getChartData2()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="job" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill="#82ca9d" />
              <Bar dataKey="accepted" fill="#8884d8" />
              <Bar dataKey="rejected" fill="#ff6961" />
            </BarChart>
          </div>
          </div>
  );
};

export default JobApplicationStatistics;