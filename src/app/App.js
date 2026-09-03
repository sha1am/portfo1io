import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PortfolioPage from '../features/portfolio/PortfolioPage';
import DocsPage from '../features/portfolio/DocsPage';
import DocsHubPage from '../features/portfolio/DocsHubPage';
import '../features/portfolio/portfolio.css';

const getRouterBasename = () => {
  if (typeof window === 'undefined') return undefined;

  const [, firstSegment] = window.location.pathname.split('/');
  return window.location.hostname.endsWith('github.io') &&
    firstSegment === 'portfo1io'
    ? '/portfo1io'
    : undefined;
};

const App = () => (
  <Router basename={getRouterBasename()}>
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/docs" element={<DocsHubPage />} />
      <Route path="/docs/:repoId" element={<DocsPage />} />
    </Routes>
  </Router>
);

export default App;
