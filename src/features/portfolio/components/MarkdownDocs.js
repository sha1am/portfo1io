import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/core';
import cpp from 'highlight.js/lib/languages/cpp';
import Icon from './Icon';
import { useActiveSection } from '../../../shared/hooks/useActiveSection';

// Only the cpp grammar is registered. The notes' 683 unlabelled fences are
// CLRS-style pseudocode, not a real language, and stay plain monospace.
hljs.registerLanguage('cpp', cpp);

const DOC_EXTENSION = '.md';

const HIGHLIGHT_ALIASES = {
  c: 'cpp',
  cc: 'cpp',
  cpp: 'cpp',
  'c++': 'cpp',
  h: 'cpp',
  hpp: 'cpp',
};

const LANGUAGE_LABELS = { cpp: 'C++' };

// Anchor targets sit below both the site header and the reader's own sticky
// header, whose measured height lands in --docs-header-h.
const SCROLL_OFFSET_FALLBACK = 214;

// The line the contents rail uses to decide which heading is current. Same
// constraint as HEADER_OFFSET on the main nav: it must stay GREATER than the
// headings' scroll-margin-top (72px site header + ~118px reader header + 24px),
// or clicking an entry parks its heading just below the line and highlights the
// previous one instead.
const TOC_ACTIVE_OFFSET = 240;

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

/**
 * Reproduces GitHub's heading-anchor algorithm, because the anchors in these
 * notes were written against GitHub: lowercase, drop everything that is not a
 * letter, number, space, hyphen or underscore, then turn EACH remaining space
 * into one hyphen.
 *
 * The "each" matters. A heading like "Insert & Delete" loses the ampersand and
 * keeps both surrounding spaces, so GitHub's id is `insert--delete` with two
 * hyphens. Collapsing whitespace here (or mapping & to "and") produced ids that
 * none of the docs' own table-of-contents links could reach.
 */
const slugifyHeading = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]+/gu, '')
    .replace(/\s/g, '-');

const makeDocFinder = (docs) => {
  const byName = new Map(docs.map((doc) => [normalizeDocName(doc.name), doc]));

  return (href) => {
    const name = normalizeDocName(href);
    return name ? byName.get(name) || null : null;
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
// the current module index.
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: false,
  highlight: (code, lang) => {
    const language = HIGHLIGHT_ALIASES[(lang || '').trim().toLowerCase()];
    if (!language) return '';
    try {
      return hljs.highlight(code, { language, ignoreIllegals: true }).value;
    } catch {
      // Returning '' makes markdown-it escape and emit the source unchanged.
      return '';
    }
  },
});

// typographer is on for the curly quotes and true em dashes the serif setting
// wants, but its `replacements` rule also rewrites (c) as a copyright sign and
// mangles the ASCII arrows and +- used throughout these notes.
md.disable('replacements');

const isRelativeHref = (href) => !/^(https?:|mailto:|tel:|data:|blob:|#)/i.test(href);

const splitHash = (href) => {
  const index = href.indexOf('#');
  return index === -1
    ? { path: href, hash: '' }
    : { path: href.slice(0, index), hash: href.slice(index + 1) };
};

const buildHrefProps = (href, options) => {
  const cleanHref = href.trim().replace(/^<|>$/g, '');

  // Internal-doc link: a relative path matching a file in the module index.
  // The relative test matters - without it an external URL that happens to end
  // in the same filename would be swallowed and opened as a local document.
  if (isRelativeHref(cleanHref)) {
    const { hash } = splitHash(cleanHref);
    const doc = options.findDoc(cleanHref);
    if (doc) {
      return {
        // A real URL, not a '#' placeholder: the click handler keeps the
        // reader in-app, but cmd-click, middle-click and "copy link address"
        // then land on the same document on GitHub instead of nowhere.
        href: doc.htmlUrl
          ? `${doc.htmlUrl}${hash ? `#${hash}` : ''}`
          : resolveRelativeGitHubUrl(cleanHref, options.selectedDoc, options.repository),
        onClick: (event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
          event.preventDefault();
          options.onSelectDoc(doc, hash);
        },
      };
    }
  }

  // In-page anchor: scroll to the heading carrying that id.
  if (cleanHref.startsWith('#')) {
    return {
      href: cleanHref,
      onClick: (event) => {
        const id = decodeSafe(cleanHref.slice(1));
        if (!document.getElementById(id)) return;
        event.preventDefault();
        options.onGoToAnchor(id);
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

/**
 * Mark the paragraph that should carry the drop cap.
 *
 * Not simply the first one: most of these notes open on a metadata line
 * ("**Sources:** CLRS Ch. 1 ...") that a drop cap would look absurd on. The
 * lede is the first top-level paragraph that begins with ordinary prose and is
 * long enough to wrap around a three-line initial.
 */
const LEDE_MIN_LENGTH = 180;

const tagLede = (body) => {
  const lede = Array.from(body.children).find((element) => {
    if (element.tagName !== 'P') return false;
    const first = element.firstChild;
    if (!first || first.nodeType !== Node.TEXT_NODE) return false;
    if (!/^[\p{L}]/u.test(first.nodeValue.trimStart())) return false;
    return (element.textContent || '').trim().length >= LEDE_MIN_LENGTH;
  });

  if (lede) lede.classList.add('markdown-body__lede');
};

/**
 * Convert markdown-it's HTML into React elements. Walking the DOM (rather than
 * dangerouslySetInnerHTML) keeps the reader's clickable doc links, in-page
 * anchors, heading ids and task checkboxes, and lets us collect the heading
 * outline for the contents rail in the same pass.
 */
const htmlToReact = (html, options) => {
  const headings = [];
  const usedIds = new Map();
  let keySeed = 0;

  // GitHub's duplicate suffix starts at -1 for the SECOND occurrence.
  const assignHeadingId = (text) => {
    const base = slugifyHeading(text) || 'section';
    const seen = usedIds.get(base) || 0;
    usedIds.set(base, seen + 1);
    return seen === 0 ? base : `${base}-${seen}`;
  };

  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return node.nodeValue;
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const tag = node.tagName.toLowerCase();
    const props = { key: `n${(keySeed += 1)}` };

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

    const headingMatch = tag.match(/^h([1-6])$/);
    if (headingMatch) {
      const level = Number(headingMatch[1]);
      const text = (node.textContent || '').trim();
      props.id = assignHeadingId(text);
      props.className =
        `${props.className || ''} markdown-body__heading markdown-body__heading--${level}`.trim();
      if (level >= 2 && level <= 3 && text) {
        headings.push({ id: props.id, level, text });
      }
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
      const { href, onClick, target, rel } = buildHrefProps(props.href || '', options);
      const anchorProps = { key: props.key, href };
      if (onClick) anchorProps.onClick = onClick;
      if (props.className) anchorProps.className = props.className;
      if (target) anchorProps.target = target;
      if (rel) anchorProps.rel = rel;
      return React.createElement('a', anchorProps, ...children);
    }

    // Fenced code: frame it as a figure so a language caption can sit above the
    // scrolling <pre> without being dragged sideways with it.
    if (tag === 'pre') {
      const codeEl = node.querySelector('code');
      const langMatch = (codeEl?.getAttribute('class') || '').match(/language-([\w+#.-]+)/);
      const rawLang = langMatch ? langMatch[1].toLowerCase() : '';
      const label = LANGUAGE_LABELS[HIGHLIGHT_ALIASES[rawLang]] || '';

      props.className = `${props.className || ''} markdown-body__pre`.trim();
      const pre = React.createElement('pre', props, ...children);

      return React.createElement(
        'figure',
        { key: `f${props.key}`, className: 'markdown-body__code' },
        label
          ? React.createElement('figcaption', { key: 'cap' }, label)
          : null,
        pre
      );
    }

    // markdown-it does not implement GFM task lists, so the "[ ] " marker
    // arrives as literal text - directly in the <li> for a tight list, or
    // inside a leading <p> for a loose one. Handle both.
    if (tag === 'li') {
      const first = children[0];
      const leadText =
        typeof first === 'string'
          ? first
          : React.isValidElement(first) &&
              first.type === 'p' &&
              typeof first.props.children?.[0] === 'string'
            ? first.props.children[0]
            : null;

      const match = leadText?.match(/^\[([ xX])\]\s+/);
      if (match) {
        const checkbox = React.createElement('input', {
          key: 'box',
          type: 'checkbox',
          checked: /[xX]/.test(match[1]),
          disabled: true,
          readOnly: true,
          className: 'markdown-body__checkbox',
          'aria-label': 'task',
        });
        const rest = leadText.slice(match[0].length);
        const tail =
          typeof first === 'string'
            ? [rest, ...children.slice(1)]
            : [
                React.cloneElement(first, undefined, rest, ...React.Children.toArray(
                  first.props.children
                ).slice(1)),
                ...children.slice(1),
              ];
        props.className = `${props.className || ''} task-list-item`.trim();
        return React.createElement('li', props, checkbox, ...tail);
      }
      return React.createElement('li', props, ...children);
    }

    if (tag === 'table') {
      const table = React.createElement('table', props, ...children);
      return React.createElement(
        'div',
        { key: `w${props.key}`, className: 'markdown-body__table-wrap', tabIndex: 0 },
        table
      );
    }

    return React.createElement(tag, props, ...children);
  };

  const body = new DOMParser().parseFromString(html, 'text/html').body;
  tagLede(body);

  const nodes = Array.from(body.childNodes)
    .map(walk)
    .filter((child) => child !== null && child !== '');

  return { nodes, headings };
};

const renderMarkdown = (markdown, options) => {
  // Normalise `! [alt](url)` (a stray space after the bang), which markdown-it
  // would otherwise leave as literal text. Anchored on the closing `](` so it
  // cannot touch ordinary prose such as "n! [see note]".
  const html = md.render(markdown.replace(/!\s\[([^\]\n]*)\]\(/g, '![$1]('));
  return htmlToReact(html, options);
};

const MarkdownDocs = ({ section, onReadingChange }) => {
  const fallbackDocs = useMemo(() => buildFallbackDocs(section), [section]);
  const [docs, setDocs] = useState(fallbackDocs);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [pendingAnchor, setPendingAnchor] = useState(null);
  const [query, setQuery] = useState('');
  const [sourceState, setSourceState] = useState('fallback');
  const [markdownState, setMarkdownState] = useState({
    status: 'idle',
    content: '',
    error: null,
  });
  const rootRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    onReadingChange?.(Boolean(selectedDoc));
    return () => onReadingChange?.(false);
  }, [onReadingChange, selectedDoc]);

  // Publish the sticky reader header's real height so anchor scroll-margin and
  // the contents rail can both clear it without a hard-coded guess.
  useEffect(() => {
    const header = headerRef.current;
    const root = rootRef.current;
    if (!header || !root || typeof ResizeObserver === 'undefined') return undefined;

    // offsetHeight, not contentRect.height: the header has 16px of vertical
    // padding and a 1px border, and anchors have to clear the whole box.
    const observer = new ResizeObserver(() => {
      root.style.setProperty('--docs-header-h', `${header.offsetHeight}px`);
    });

    observer.observe(header);
    return () => observer.disconnect();
  }, [selectedDoc]);

  const scrollToAnchor = useCallback((id) => {
    const target = document.getElementById(id);
    if (!target) return false;

    const offset =
      Number.parseFloat(
        getComputedStyle(target).scrollMarginTop
      ) || SCROLL_OFFSET_FALLBACK;

    window.scrollTo({
      top: window.scrollY + target.getBoundingClientRect().top - offset,
      behavior: 'smooth',
    });

    // Keep the anchor addressable and focusable without stealing focus styling.
    if (window.history?.replaceState) {
      window.history.replaceState(null, '', `#${id}`);
    }
    return true;
  }, []);

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
    // Jump, don't glide: a smooth scroll here races the content swap.
    window.scrollTo({ top: 0, behavior: 'auto' });

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

  const handleSelectDoc = useCallback((doc, hash = '') => {
    setPendingAnchor(hash || null);
    setSelectedDoc(doc);
  }, []);

  const { nodes: renderedMarkdown, headings } = useMemo(() => {
    if (markdownState.status !== 'ready') return { nodes: null, headings: [] };
    return renderMarkdown(markdownState.content, {
      docs,
      findDoc,
      onSelectDoc: handleSelectDoc,
      onGoToAnchor: scrollToAnchor,
      repository: section.repository,
      selectedDoc,
    });
  }, [
    docs,
    findDoc,
    handleSelectDoc,
    markdownState,
    scrollToAnchor,
    section.repository,
    selectedDoc,
  ]);

  // A `file.md#section` link has to wait for the new document to paint before
  // its target id exists.
  useEffect(() => {
    if (!pendingAnchor || markdownState.status !== 'ready') return undefined;
    const frame = window.requestAnimationFrame(() => {
      scrollToAnchor(pendingAnchor);
      setPendingAnchor(null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [markdownState.status, pendingAnchor, renderedMarkdown, scrollToAnchor]);

  const headingIds = useMemo(() => headings.map((heading) => heading.id), [headings]);
  const activeHeadingId = useActiveSection(headingIds, TOC_ACTIVE_OFFSET);

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

  const handleBackClick = () => {
    onReadingChange?.(false);
    setSelectedDoc(null);
    setPendingAnchor(null);
    setMarkdownState({ status: 'idle', content: '', error: null });
  };

  return (
    <div
      className={`docs-file-manager${selectedDoc ? ' is-reading' : ''}`}
      ref={rootRef}
    >
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
                      onClick={() => handleSelectDoc(doc)}
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
              <div className="docs-document-view__header" ref={headerRef}>
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

              <div className="docs-document-view__body">
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
                  <div className="docs-reader">
                    {headings.length > 2 && (
                      <nav className="docs-toc" aria-label="Document contents">
                        <p className="docs-toc__title">In this document</p>
                        <ol className="docs-toc__list">
                          {headings.map((heading) => (
                            <li
                              key={heading.id}
                              className={`docs-toc__item docs-toc__item--${heading.level}${
                                heading.id === activeHeadingId ? ' is-active' : ''
                              }`}
                            >
                              <a
                                href={`#${heading.id}`}
                                onClick={(event) => {
                                  event.preventDefault();
                                  scrollToAnchor(heading.id);
                                }}
                              >
                                {heading.text}
                              </a>
                            </li>
                          ))}
                        </ol>
                      </nav>
                    )}

                    <article className="markdown-body">{renderedMarkdown}</article>
                  </div>
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
