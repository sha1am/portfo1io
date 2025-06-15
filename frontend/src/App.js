import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="app">
      <Header />
      <Dashboard />
      <Footer />
    </div>
  );
};

export default App;
