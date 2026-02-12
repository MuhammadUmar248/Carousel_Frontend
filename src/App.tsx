import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import HomePage from './pages/HomePage';
import GeneratorPage from './pages/GeneratorPage';
import Gallery from './components/Gallery';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import './index.css';
import './App.css';
import './components/Animations.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          } />
          <Route path="/generator" element={
            <PageTransition>
              <GeneratorPage />
            </PageTransition>
          } />
          <Route path="/gallery" element={
            <PageTransition>
              <Gallery />
            </PageTransition>
          } />
          <Route path="/about" element={
            <PageTransition>
              <AboutPage />
            </PageTransition>
          } />
          <Route path="/contact" element={
            <PageTransition>
              <ContactPage />
            </PageTransition>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
