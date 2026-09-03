import React, { useEffect, useMemo, useRef, useState } from 'react';
import MarkdownIt from 'markdown-it';
import Icon from './Icon';

const DOC_EXTENSION = '.md';

const decodeSafe = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const normalizeDocName = (value = '') =>
  decodeSafe(value)
    .split('#')[0]
    .split('?')[0]
    .split('/')
    .pop()
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase();

const encodePathSegment = (value) =>
  value
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

const titleFromFilename = (name) => {
  const base = name.replace(new RegExp(`${DOC_EXTENSION}$`, 'i'), '');
  if (/^readme$/i.test(base)) return 'Archive Overview';
  if (/^index$/i.test(base)) return 'Study Index';

  const moduleMatch = base.match(/^M(\d{2})(.*)$/i);
  if (!moduleMatch) return base.replace(/[-_]+/g, ' ');

  const [, moduleNumber, rawTitle] = moduleMatch;
  const title = rawTitle
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();

  return `M${moduleNumber}${title ? ` ${title}` : ''}`;
};

const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  return `${Math.round(bytes / 1024)} KB`;
};

const buildFallbackDocs = ({ files, repository }) =>
  files.map((file, index) => ({
    ...file,
    order: index,
    path: `${repository.path}/${file.name}`,
    downloadUrl: `${repository.rawBaseUrl}/${encodePathSegment(file.name)}`,
    htmlUrl: `${repository.blobBaseUrl}/${encodePathSegment(file.name)}`,
  }));

const mergeRemoteDocs = (entries, section, fallbackDocs) => {
  const fallbackByName = new Map(
    fallbackDocs.map((doc) => [normalizeDocName(doc.name), doc])
  );

  return entries
    .filter((entry) => entry.type === 'file' && entry.name.endsWith(DOC_EXTENSION))
    .map((entry, index) => {
      const fallback = fallbackByName.get(normalizeDocName(entry.name));
      return {
        ...fallback,
        name: entry.name,
        path: entry.path,
        size: entry.size,
        downloadUrl:
          entry.download_url ||
          `${section.repository.rawBaseUrl}/${encodePathSegment(entry.name)}`,
        htmlUrl:
          entry.html_url ||
          `${section.repository.blobBaseUrl}/${encodePathSegment(entry.name)}`,
        title: fallback?.title || titleFromFilename(entry.name),
        category: fallback?.category || 'Notes',
        summary: fallback?.summary || 'Markdown notes from the algorithm archive.',
        order: fallback?.order ?? 100 + index,
      };
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
};

const slugifyHeading = (value) =>
  value
    .replace(/`([^`]+)`/g, '$1')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const makeDocFinder = (docs) => {
  const byName = new Map(docs.map((doc) => [normalizeDocName(doc.name), doc]));

  return (href) => {
    const name = normalizeDocName(href);
    return name ? byName.get(name) : null;
  };
};

const resolveRepositoryPath = (href, selectedDoc, repository) => {
  const trimmedHref = href.replace(/^\.?\//, '');
  const selectedPath = selectedDoc?.path || `${repository.path}/${selectedDoc?.name || ''}`;
  const currentDir = selectedPath.split('/').slice(0, -1).join('/');
  return trimmedHref.startsWith(repository.path)
    ? trimmedHref
    : `${currentDir}/${trimmedHref}`;
};

const resolveRelativeGitHubUrl = (href, selectedDoc, repository) =>
  `https://github.com/${repository.owner}/${repository.name}/blob/${repository.branch}/${encodePathSegment(
    resolveRepositoryPath(href, selectedDoc, repository)
  )}`;

const resolveRawUrl = (href, selectedDoc, repository) =>
  `https://raw.githubusercontent.com/${repository.owner}/${repository.name}/${repository.branch}/${encodePathSegment(
    resolveRepositoryPath(href, selectedDoc, repository)
  )}`;

// markdown-it handles the whole block structure: headings, lists, fenced code,
// blockquotes, and native GFM pipe tables (with alignment). The DOM walker
// below adapts links and images so they resolve against the GitHub repo and
// the current module index the same way the previous hand-rolled parser did.
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
  breaks: false,
});

const isRelativeHref = (href) => !/^(https?:|mailto:|tel:|data:|blob:)/i.test(href);

const buildHrefProps = (href, options) => {
  const cleanHref = href.trim().replace(/^<|>$/g, '');

  // Internal-doc link: matches a file in the current module index.
  const doc = options.findDoc(cleanHref);
  if (doc) {
    return {
      href: '#docs',
      onClick: (event) => {
        event.preventDefault();
        options.onSelectDoc(doc);
      },
    };
  }

  // In-page anchor: scroll to the heading with that id.
  if (cleanHref.startsWith('#')) {
    return {
      href: cleanHref,
      onClick: (event) => {
        const target =
          document.getElementById(cleanHref.slice(1)) ||
          document.getElementById(`docs-${cleanHref.slice(1)}`);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    };
  }

  // Everything else resolves against the GitHub repo and opens externally.
  return {
    href: isRelativeHref(cleanHref)
      ? resolveRelativeGitHubUrl(cleanHref, options.selectedDoc, options.repository)
      : cleanHref,
    target: '_blank',
    rel: 'noreferrer',
  };
};

// Convert markdown-it's HTML output into React elements. Walking the DOM (rather
// than dangerouslySetInnerHTML) keeps the reader's clickable doc links, in-page
// anchors, heading ids and task checkboxes.
const htmlToReact = (html, options) => {
  const headingIds = new Map();

  const assignHeadingId = (text) => {
    const base = slugifyHeading(text) || 'section';
    const count = (headingIds.get(base) || 0) + 1;
    headingIds.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  };

  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return node.nodeValue;
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const tag = node.tagName.toLowerCase();
    const props = {};

    for (const attr of Array.from(node.attributes)) {
      if (attr.name === 'class') {
        props.className = attr.value;
      } else if (attr.name === 'style') {
        props.style = Object.fromEntries(
          attr.value.split(';').filter(Boolean).map((decl) => {
            const [key, value] = decl.split(':');
            const camel = key.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            return [camel, value.trim()];
          })
        );
      } else {
        props[attr.name] = attr.value;
      }
    }

    if (/^h[1-6]$/.test(tag)) {
      props.id = assignHeadingId(node.textContent || '');
      props.className = `${props.className || ''} markdown-body__heading`.trim();
    }

    if (tag === 'pre') {
      props.className = `${props.className || ''} markdown-body__code`.trim();
    }

    if (tag === 'img') {
      const src = props.src || '';
      props.src = isRelativeHref(src)
        ? resolveRawUrl(src, options.selectedDoc, options.repository)
        : src;
      props.loading = 'lazy';
      props.className = `${props.className || ''} markdown-body__img`.trim();
    }

    const children = Array.from(node.childNodes)
      .map(walk)
      .filter((child) => child !== null && child !== '');

    if (tag === 'a') {
      const { href, onClick } = buildHrefProps(props.href || '', options);
      const anchorProps = { key: `${props.href}-${children.length}` };
      if (href !== undefined) anchorProps.href = href;
      if (onClick) anchorProps.onClick = onClick;
      if (props.className) anchorProps.className = props.className;
      if (href === props.href || !href) {
        if (props.target) anchorProps.target = props.target;
        if (props.rel) anchorProps.rel = props.rel;
      }
      return React.createElement('a', anchorProps, ...children);
    }

    if (tag === 'li') {
      const first = children[0];
      if (typeof first === 'string') {
        const match = first.match(/^\[([ xX])\]\s+/);
        if (match) {
          const rest = first.slice(match[0].length);
          const checkbox = React.createElement('input', {
            type: 'checkbox',
            checked: /[xX]/.test(match[1]),
            disabled: true,
            readOnly: true,
            className: 'markdown-body__checkbox',
            'aria-label': 'task',
          });
          props.className = `${props.className || ''} task-list-item`.trim();
          return React.createElement('li', props, checkbox, rest, ...children.slice(1));
        }
      }
      return React.createElement('li', props, ...children);
    }

    if (tag === 'table') {
      const table = React.createElement('table', props, ...children);
      return React.createElement('div', {
        className: 'markdown-body__table-wrap',
      }, table);
    }

    return React.createElement(tag, props, ...children);
  };

  const body = new DOMParser().parseFromString(html, 'text/html').body;
  return Array.from(body.childNodes)
    .map(walk)
    .filter((child) => child !== null && child !== '');
};

const renderMarkdown = (markdown, options) => {
  // Normalise `! [alt](url)` (space after the bang) which markdown-it would
  // otherwise treat as literal text.
  const html = md.render(markdown.replace(/! ?\[/g, '!['));
  return htmlToReact(html, options);
};

const MarkdownDocs = ({ section, onReadingChange }) => {
  const fallbackDocs = useMemo(() => buildFallbackDocs(section), [section]);
  const [docs, setDocs] = useState(fallbackDocs);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [query, setQuery] = useState('');
  const [sourceState, setSourceState] = useState('fallback');
  const [markdownState, setMarkdownState] = useState({
    status: 'idle',
    content: '',
    error: null,
  });
  const contentRef = useRef(null);

  useEffect(() => {
    onReadingChange?.(Boolean(selectedDoc));
    return () => onReadingChange?.(false);
  }, [onReadingChange, selectedDoc]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(section.repository.apiUrl, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`GitHub returned ${response.status}`);
        }
        return response.json();
      })
      .then((entries) => {
        if (!Array.isArray(entries)) {
          throw new Error('GitHub returned an unexpected directory shape');
        }

        const remoteDocs = mergeRemoteDocs(entries, section, fallbackDocs);
        if (remoteDocs.length > 0) {
          setDocs(remoteDocs);
          setSourceState('live');
        }
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setSourceState('fallback');
      });

    return () => controller.abort();
  }, [fallbackDocs, section]);

  useEffect(() => {
    if (!selectedDoc) return undefined;
    const controller = new AbortController();

    setMarkdownState({ status: 'loading', content: '', error: null });
    contentRef.current?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetch(selectedDoc.downloadUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`GitHub returned ${response.status}`);
        }
        return response.text();
      })
      .then((content) =>
        setMarkdownState({ status: 'ready', content, error: null })
      )
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setMarkdownState({
          status: 'error',
          content: '',
          error: error.message,
        });
      });

    return () => controller.abort();
  }, [selectedDoc]);

  const findDoc = useMemo(() => makeDocFinder(docs), [docs]);

  const renderedMarkdown = useMemo(() => {
    if (markdownState.status !== 'ready') return null;
    return renderMarkdown(markdownState.content, {
      docs,
      findDoc,
      onSelectDoc: setSelectedDoc,
      repository: section.repository,
      selectedDoc,
    });
  }, [docs, findDoc, markdownState, section.repository, selectedDoc]);

  const readingMeta = useMemo(() => {
    if (!markdownState.content) return null;
    const wordCount = markdownState.content.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount === 0) return null;
    return `${Math.max(1, Math.ceil(wordCount / 220))} min read`;
  }, [markdownState.content]);

  const filteredDocs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return docs;

    return docs.filter((doc) =>
      [doc.title, doc.name, doc.category, doc.summary]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery))
    );
  }, [docs, query]);

  const sourceLabel =
    sourceState === 'live' ? 'Synced from GitHub' : 'Using saved module index';

  const handleDocClick = (doc) => {
    onReadingChange?.(true);
    setSelectedDoc(doc);
  };

  const handleBackClick = () => {
    onReadingChange?.(false);
    setSelectedDoc(null);
    setMarkdownState({ status: 'idle', content: '', error: null });
  };

  return (
    <div className={`docs-file-manager${selectedDoc ? ' is-reading' : ''}`}>
      <div className="docs-file-manager__toolbar">
        <label className="docs-search">
          <span>Search files</span>
          <input
            type="search"
            value={query}
            placeholder="file name or topic"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="docs-file-manager__actions">
          <span className="docs-file-manager__source">{sourceLabel}</span>
          <a
            className="button button--ghost"
            href={section.repository.url}
            target="_blank"
            rel="noreferrer"
          >
            Repository
            <Icon name="external" />
          </a>
        </div>
      </div>

      <div className="docs-file-manager__viewport">
        <div className="docs-file-manager__slider">
          <section
            className="docs-file-manager__pane docs-file-manager__pane--files"
            aria-hidden={selectedDoc ? 'true' : undefined}
            inert={selectedDoc ? '' : undefined}
          >
            <div className="docs-file-list">
              <div className="docs-file-list__header">
                <span>{filteredDocs.length} visible files</span>
                <span>{docs.length} total</span>
              </div>

              {filteredDocs.length > 0 ? (
                <div className="docs-file-grid">
                  {filteredDocs.map((doc) => (
                    <button
                      key={doc.name}
                      className="docs-file-item"
                      type="button"
                      onClick={() => handleDocClick(doc)}
                    >
                      <span className="docs-file-item__icon" aria-hidden="true">
                        <Icon name="document" />
                      </span>
                      <span className="docs-file-item__content">
                        <span className="docs-file-item__category">{doc.category}</span>
                        <strong className="docs-file-item__title">{doc.title}</strong>
                        <span className="docs-file-item__summary">{doc.summary}</span>
                        <span className="docs-file-item__meta">
                          <span>{doc.name}</span>
                          {formatBytes(doc.size) && <span>{formatBytes(doc.size)}</span>}
                        </span>
                      </span>
                      <span className="docs-file-item__arrow" aria-hidden="true">
                        <Icon name="arrowRight" />
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="docs-file-list__empty">
                  No files match your search.
                </div>
              )}
            </div>
          </section>

          <section
            className="docs-file-manager__pane docs-file-manager__pane--document"
            aria-hidden={!selectedDoc ? 'true' : undefined}
            inert={!selectedDoc ? '' : undefined}
          >
            <div className="docs-document-view">
              <div className="docs-document-view__header">
                <button
                  className="docs-document-view__back"
                  type="button"
                  onClick={handleBackClick}
                >
                  <Icon name="arrowLeft" />
                  Files
                </button>

                <div className="docs-document-view__info">
                  <span className="docs-document-view__category">
                    {selectedDoc?.category}
                  </span>
                  <h2 className="docs-document-view__title">{selectedDoc?.title}</h2>
                  <div className="docs-document-view__meta">
                    {selectedDoc?.name && <span>{selectedDoc.name}</span>}
                    {formatBytes(selectedDoc?.size) && (
                      <span>{formatBytes(selectedDoc.size)}</span>
                    )}
                    {readingMeta && <span>{readingMeta}</span>}
                    {selectedDoc?.htmlUrl && (
                      <a href={selectedDoc.htmlUrl} target="_blank" rel="noreferrer">
                        Open on GitHub
                        <Icon name="external" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="docs-document-view__body" ref={contentRef}>
                {markdownState.status === 'loading' && (
                  <div className="docs-state">
                    <span className="docs-state__pulse" aria-hidden="true" />
                    Loading document...
                  </div>
                )}

                {markdownState.status === 'error' && (
                  <div className="docs-state docs-state--error">
                    <p>Could not load this document.</p>
                    {markdownState.error && <span>{markdownState.error}</span>}
                  </div>
                )}

                {markdownState.status === 'ready' && (
                  <div className="markdown-body">{renderedMarkdown}</div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MarkdownDocs;
