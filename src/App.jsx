import React, { useState } from 'react';
import Layout from './components/Layout';
import Landing from './components/Landing';
import InputForm from './components/InputForm';
import Results from './components/Results';

import LoadingScreen from './components/LoadingScreen';

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [view, setView] = useState('landing');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setView('input');
  };

  const handleGenerate = (data) => {
    setLoading(true);
    setUserData(data);

    // Simulate processing time for UX and to allow React to render LoadingScreen
    setTimeout(() => {
      try {
        // Data is passed to Results which does the calculation
        // We just switch view here after the delay
        setLoading(false);
        setView('results');
      } catch (error) {
        console.error("Generation failed", error);
        setLoading(false);
        alert("Failed to generate plan. Please check your inputs.");
      }
    }, 1000);
  };

  return (
    <Layout>
      {loading && <LoadingScreen />}

      {!loading && view === 'landing' && <Landing onStart={handleStart} />}

      {!loading && view === 'input' && (
        <div className="animate-fade-in-up">
          <InputForm onGenerate={handleGenerate} />
        </div>
      )}

      {!loading && view === 'results' && userData && (
        <div className="animate-fade-in-up">
          <ErrorBoundary>
            <Results inputData={userData} />
          </ErrorBoundary>
        </div>
      )}
    </Layout>
  );
}

export default App;
