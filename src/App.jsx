import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import GroupDetails from './pages/GroupDetails';
import AboutUs from './pages/AboutUs';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
              path="/dashboard" 
              element={
                  <PrivateRoute>
                    <Dashboard /> 
                  </PrivateRoute>
              }
          />
          <Route path="/groups/:groupId" element={<GroupDetails/>} />
          <Route path="/about" element={<AboutUs />}/>
        </Routes>
      <Footer />
    </>
    
  );
}

export default App;
