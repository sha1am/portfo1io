import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const data = {
    labels: ['Codeforces', 'TakeUForward', 'Leetcode', 'Stratascratch'],
    datasets: [
      {
        label: 'Solved Questions',
        data: [150, 120, 200, 90],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="dashboard">
      <h2>Questions Solved</h2>
      <div className="chart">
        <Bar data={data} />
      </div>
      <div className="chart">
        <Pie data={data} />
      </div>
    </div>
  );
};

export default Dashboard;
