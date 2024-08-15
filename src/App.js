import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'; 
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import JobScreen from './screens/JobScreen';
import JobListScreen from './screens/JobListScreen';
import JobEditScreen from './screens/JobEditScreen';
import ProfileViewScreen from './screens/ProfileViewScreen';
import NotFound from './components/NotFound';
import JobCreateScreen from './screens/JobCreateScreen';

const App = () => {


  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/profile/view/:id" element={<ProfileViewScreen />} />
            <Route path="/job/:id/edit" element={<JobEditScreen />} />
            <Route path="/job/:id" element={<JobScreen />} />
            <Route path="/admin/joblist" element={<JobListScreen />} />
            <Route path="/admin/job/create" element={<JobCreateScreen />} />
            <Route path="/jobs" element={<JobListScreen />} /> {/* Pass keyword prop */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;