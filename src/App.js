import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Timer from './components/Timer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Interroger from './pages/Interroger';
import Fouiller from './pages/Fouiller';
import Acheter from './pages/Acheter';
import Pensine from './pages/Pensine';
import MurderPartyAdmin from './pages/MurderPartyAdmin';
import Conditions from './pages/Conditions';

/**
 * App component sets up routing and the global layout.
 * The header now displays the burger menu and the timer in one line.
 */
function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <Navigation />
          <Timer />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/interroger"
              element={
                <ProtectedRoute>
                  <Interroger />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fouiller"
              element={
                <ProtectedRoute>
                  <Fouiller />
                </ProtectedRoute>
              }
            />
            <Route
              path="/acheter"
              element={
                <ProtectedRoute>
                  <Acheter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pensine"
              element={
                <ProtectedRoute>
                  <Pensine />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <MurderPartyAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/conditions"
              element={
                <ProtectedRoute>
                  <Conditions />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
