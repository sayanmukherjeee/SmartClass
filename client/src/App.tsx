// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { CertificateProvider } from './context/CertificateContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import './styles/global.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CourseProvider>
          <CertificateProvider>
            <div className="app">
              <Navbar />
              <main className="main-content">
                <AppRoutes />
              </main>
            </div>
          </CertificateProvider>
        </CourseProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;