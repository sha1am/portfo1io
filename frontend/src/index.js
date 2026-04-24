import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import ErrorBoundary from './shared/components/ErrorBoundary';
import './app/global.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
