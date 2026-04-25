import React from 'react';
import CircularProgressBar from './CircularProgressBar';
import PlatformLogo from './PlatformLogo';
import { useCodingStats } from '../hooks/useCodingStats';

const CodingProfiles = ({ initialProfiles }) => {
  const { profiles, loading, error } = useCodingStats(initialProfiles);

  if (loading) {
    return (
      <div className="coding-profiles">
        <h3 className="coding-profiles__title">Coding Profiles</h3>
        <div className="coding-profiles__loading">
          <div className="loading-spinner"></div>
          <p>Fetching statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="coding-profiles">
        <h3 className="coding-profiles__title">Coding Profiles</h3>
        <div className="coding-profiles__error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="coding-profiles">
      <h3 className="coding-profiles__title">Coding Profiles</h3>
      <div className="coding-profiles__grid">
        {profiles.map((profile, index) => {
          const percentage = Math.round((profile.problemsSolved / profile.totalProblems) * 100);
          
          return (
            <a
              key={profile.name}
              href={profile.url}
              target="_blank"
              rel="noreferrer"
              className="coding-profile-card"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="profile-progress">
                <CircularProgressBar
                  percentage={percentage}
                  color={profile.color}
                  size={100}
                  strokeWidth={6}
                />
                <div className="profile-icon">
                  <PlatformLogo logoType={profile.logoType} className="platform-logo" />
                </div>
              </div>
              <div className="profile-info">
                <h4 className="profile-name">{profile.name}</h4>
                <p className="profile-stats">
                  {profile.problemsSolved}/{profile.totalProblems}
                </p>
                <p className="profile-percentage">{percentage}%</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default CodingProfiles;
