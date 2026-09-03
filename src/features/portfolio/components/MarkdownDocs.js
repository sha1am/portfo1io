import React, { useEffect, useMemo, useRef, useState } from 'react';
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

const splitTableRow = (line) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());

const isTableDivider = (line = '') => {
  if (!line.includes('|')) return false;
  const cells = splitTableRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
};

const isHorizontalRule = (line) =>
  /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line);

const isListLine = (line) => /^(\s*)([-*+]|\d+\.)\s+/.test(line);

const isTableStart = (lines, index) =>
  lines[index]?.includes('|') && isTableDivider(lines[index + 1]);

const makeDocFinder = (docs) => {
  const byName = new Map(docs.map((doc) => [normalizeDocName(doc.name), doc]));

  return (href) => {
    const name = normalizeDocName(href);
    return name ? byName.get(name) : null;
  };
};

const resolveRelativeGitHubUrl = (href, selectedDoc, repository) => {
  const trimmedHref = href.replace(/^\.?\//, '');
  const selectedPath = selectedDoc?.path || `${repository.path}/${selectedDoc?.name || ''}`;
  const currentDir = selectedPath.split('/').slice(0, -1).join('/');
  const path = trimmedHref.startsWith(repository.path)
    ? trimmedHref
    : `${currentDir}/${trimmedHref}`;

  return `https://github.com/${repository.owner}/${repository.name}/blob/${
    repository.branch
  }/${encodePathSegment(path)}`;
};

const renderInline = (text, options, keyPrefix = 'inline') => {
  const nodes = [];
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*)/g;
  let cursor = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index));
    }

    const key = `${keyPrefix}-${match.index}`;

    if (match[2] && match[3]) {
      nodes.push(renderMarkdownLink(match[2], match[3], options, key));
    } else if (match[4]) {
      nodes.push(<code key={key}>{match[4]}</code>);
    } else if (match[5]) {
      nodes.push(<strong key={key}>{renderInline(match[5], options, key)}</strong>);
    }

    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return nodes;
};

const renderMarkdownLink = (label, href, options, key) => {
  const cleanHref = href.trim().replace(/^<|>$/g, '');
  const doc = options.findDoc(cleanHref);

  if (doc) {
    return (
      <a
        key={key}
        href="#docs"
        onClick={(event) => {
          event.preventDefault();
          options.onSelectDoc(doc);
        }}
      >
        {renderInline(label, options, `${key}-label`)}
      </a>
    );
  }

  if (cleanHref.startsWith('#')) {
    const targetId = `docs-${cleanHref.slice(1)}`;
    return (
      <a
        key={key}
        href={`#${targetId}`}
        onClick={(event) => {
          const target = document.getElementById(targetId);
          if (!target) return;
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      >
        {renderInline(label, options, `${key}-label`)}
      </a>
    );
  }

  const isExternal = /^(https?:|mailto:|tel:)/i.test(cleanHref);
  const resolvedHref = isExternal
    ? cleanHref
    : resolveRelativeGitHubUrl(cleanHref, options.selectedDoc, options.repository);

  return (
    <a key={key} href={resolvedHref} target="_blank" rel="noreferrer">
      {renderInline(label, options, `${key}-label`)}
    </a>
  );
};

const parseMarkdown = (markdown, options) => {
  const blocks = [];
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const headingCounts = new Map();
  let paragraph = [];
  let index = 0;

  const nextKey = () => `md-${blocks.length}`;

  const getHeadingId = (text) => {
    const base = slugifyHeading(text) || `section-${blocks.length}`;
    const count = (headingCounts.get(base) || 0) + 1;
    headingCounts.set(base, count);
    return `docs-${count === 1 ? base : `${base}-${count}`}`;
  };

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(' ').trim();
    if (text) {
      blocks.push(<p key={nextKey()}>{renderInline(text, options, nextKey())}</p>);
    }
    paragraph = [];
  };

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      index += 1;
      continue;
    }

    const fenceMatch = line.match(/^```(\S*)\s*$/);
    if (fenceMatch) {
      flushParagraph();
      const language = fenceMatch[1];
      const code = [];
      index += 1;

      while (index < lines.length && !/^```\s*$/.test(lines[index])) {
        code.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) index += 1;

      blocks.push(
        <figure className="markdown-body__code" key={nextKey()}>
          {language && <figcaption>{language}</figcaption>}
          <pre>
            <code>{code.join('\n')}</code>
          </pre>
        </figure>
      );
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      const level = headingMatch[1].length;
      const Heading = `h${Math.min(level + 3, 6)}`;
      const headingText = headingMatch[2].replace(/\s+#+\s*$/, '').trim();

      blocks.push(
        <Heading
          className={`markdown-body__heading markdown-body__heading--${level}`}
          id={getHeadingId(headingText)}
          key={nextKey()}
        >
          {renderInline(headingText, options, nextKey())}
        </Heading>
      );
      index += 1;
      continue;
    }

    if (isHorizontalRule(line)) {
      flushParagraph();
      blocks.push(<hr key={nextKey()} />);
      index += 1;
      continue;
    }

    if (isTableStart(lines, index)) {
      flushParagraph();
      const header = splitTableRow(lines[index]);
      const rows = [];
      index += 2;

      while (index < lines.length && lines[index].trim() && lines[index].includes('|')) {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }

      blocks.push(
        <div className="markdown-body__table-wrap" key={nextKey()}>
          <table>
            <thead>
              <tr>
                {header.map((cell, cellIndex) => (
                  <th key={`${cell}-${cellIndex}`}>
                    {renderInline(cell, options, `${nextKey()}-th-${cellIndex}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`${nextKey()}-row-${rowIndex}`}>
                  {header.map((_, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`}>
                      {renderInline(
                        row[cellIndex] || '',
                        options,
                        `${nextKey()}-td-${rowIndex}-${cellIndex}`
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (/^>\s?/.test(line)) {
      flushParagraph();
      const quote = [];

      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, ''));
        index += 1;
      }

      blocks.push(
        <blockquote key={nextKey()}>
          {quote.map((quoteLine, quoteIndex) => (
            <p key={`${quoteLine}-${quoteIndex}`}>
              {renderInline(quoteLine, options, `${nextKey()}-quote-${quoteIndex}`)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    if (isListLine(line)) {
      flushParagraph();
      const firstMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);
      const ordered = /^\d+\./.test(firstMatch[2]);
      const ListTag = ordered ? 'ol' : 'ul';
      const items = [];

      while (index < lines.length && isListLine(lines[index])) {
        const itemMatch = lines[index].match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);
        const depth = Math.min(
          4,
          Math.floor(itemMatch[1].replace(/\t/g, '  ').length / 2)
        );
        items.push({ depth, text: itemMatch[3] });
        index += 1;
      }

      blocks.push(
        <ListTag key={nextKey()}>
          {items.map((item, itemIndex) => (
            <li
              key={`${item.text}-${itemIndex}`}
              style={{ '--list-depth': item.depth }}
            >
              {renderInline(item.text, options, `${nextKey()}-li-${itemIndex}`)}
            </li>
          ))}
        </ListTag>
      );
      continue;
    }

    paragraph.push(trimmed);
    index += 1;
  }

  flushParagraph();
  return blocks;
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
    return parseMarkdown(markdownState.content, {
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
