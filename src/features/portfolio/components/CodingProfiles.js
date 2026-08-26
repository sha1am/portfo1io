import React from 'react';
import PlatformLogo from './PlatformLogo';

const CodingProfiles = ({ initialProfiles }) => (
  <section className="profiles" aria-labelledby="profiles-title">
    <h2 className="profiles__title" id="profiles-title">
      Coding profiles
    </h2>

    <div className="profiles__grid">
      {initialProfiles.map((profile, index) => (
        <a
          key={profile.name}
          href={profile.url}
          target="_blank"
          rel="noreferrer"
          className="profile-card"
          style={{ '--platform-color': profile.color, '--reveal-delay': `${index * 110}ms` }}
          data-reveal
        >
          <span className="profile-card__logo" aria-hidden="true">
            <PlatformLogo logoType={profile.logoType} />
          </span>

          <span className="profile-card__meta">
            <span className="profile-card__name">{profile.name}</span>
            <span className="profile-card__count">
              {profile.problemsSolved}
              <span className="profile-card__unit"> solved</span>
            </span>
          </span>
        </a>
      ))}
    </div>
  </section>
);

export default CodingProfiles;
