import React from 'react';
import { Link } from 'react-router-dom';
import { docsNavigationItems, docsRepositories, socialLinks } from './data/content';
import { A11Y } from '../../shared/constants';
import { useReveal } from '../../shared/hooks/useReveal';
import BackToTop from './components/BackToTop';
import Icon from './components/Icon';
import SiteFooter from './components/SiteFooter';
import SiteHeader from './components/SiteHeader';

const DocsHubPage = () => {
  useReveal();

  return (
    <div className="app-shell docs-shell" id="top">
      <a className="skip-link" href="#main">
        {A11Y.LABELS.SKIP_TO_CONTENT}
      </a>

      <div className="app-backdrop" aria-hidden="true" />

      <SiteHeader navigationItems={docsNavigationItems} />

      <main className="main docs-page" id="main">
        <section className="docs-page__masthead" data-reveal>
          <div className="docs-page__heading">
            <p className="section__eyebrow">
              <span className="section__eyebrow-dot" aria-hidden="true" />
              Docs
            </p>
            <h1 className="section__title">Choose a documentation set</h1>
            <p className="section__description">
              A GitHub-backed reader for my study archives. Pick a repository to
              browse its module index and rendered Markdown.
            </p>
          </div>
        </section>

        <section className="docs-hub" data-reveal>
          <div className="docs-hub__grid">
            {docsRepositories.map((repo, index) => (
              <Link
                key={repo.id}
                className="docs-hub-card"
                to={`/docs/${repo.id}`}
                data-reveal
                style={{ '--reveal-delay': `${index * 90}ms` }}
              >
                <span className="docs-hub-card__icon" aria-hidden="true">
                  <Icon name="document" />
                </span>
                <span className="docs-hub-card__body">
                  <span className="docs-hub-card__meta">{repo.eyebrow}</span>
                  <strong className="docs-hub-card__title">{repo.name}</strong>
                  <span className="docs-hub-card__summary">{repo.description}</span>
                </span>
                <Icon name="arrowRight" className="docs-hub-card__arrow" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter socialLinks={socialLinks} navigationItems={docsNavigationItems} />
      <BackToTop />
    </div>
  );
};

export default DocsHubPage;
