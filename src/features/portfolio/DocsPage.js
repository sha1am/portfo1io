import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { docsRepositories, socialLinks, docsNavigationItems } from './data/content';
import { A11Y } from '../../shared/constants';
import { useReveal } from '../../shared/hooks/useReveal';
import MarkdownDocs from './components/MarkdownDocs';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import BackToTop from './components/BackToTop';

const DocsPage = () => {
  useReveal();
  const { repoId } = useParams();
  const [isReadingDoc, setIsReadingDoc] = useState(false);

  const selectedRepo = useMemo(
    () => docsRepositories.find((repo) => repo.id === repoId) || docsRepositories[0],
    [repoId]
  );

  return (
    <div className={`app-shell docs-shell${isReadingDoc ? ' is-reading-doc' : ''}`} id="top">
      <a className="skip-link" href="#main">
        {A11Y.LABELS.SKIP_TO_CONTENT}
      </a>

      <div className="app-backdrop" aria-hidden="true" />

      <SiteHeader navigationItems={docsNavigationItems} />

      <main className={`main docs-page${isReadingDoc ? ' docs-page--reading' : ''}`} id="main">
        <section className="docs-page__masthead" id="docs" data-reveal>
          <div className="docs-page__heading">
            <p className="section__eyebrow">
              <span className="section__eyebrow-dot" aria-hidden="true" />
              {selectedRepo.eyebrow}
            </p>
            <h1 className="section__title">{selectedRepo.title}</h1>
            <p className="section__description">{selectedRepo.description}</p>
          </div>
        </section>

        <section className="docs-page__workspace" data-reveal>
          <MarkdownDocs section={selectedRepo} onReadingChange={setIsReadingDoc} />
        </section>
      </main>

      <SiteFooter socialLinks={socialLinks} navigationItems={docsNavigationItems} />
      <BackToTop />
    </div>
  );
};

export default DocsPage;
