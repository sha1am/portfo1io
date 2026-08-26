#!/usr/bin/env node
/**
 * Refreshes the coding-profile counts shown on the site.
 *
 * Runs at BUILD time, not in the browser. LeetCode's GraphQL endpoint sends
 * no CORS headers, so a request from the deployed page is blocked before it
 * reaches the server - a previous version of this site shipped exactly that
 * fetch and it failed on every single page load. From Node there is no such
 * restriction, so the numbers are baked into the bundle instead, and a daily
 * scheduled workflow rebuilds the site to keep them current.
 *
 * Failure policy: this script must never fail the build and must never write
 * a worse number than it started with. Any platform that errors, times out or
 * returns something implausible keeps its previously committed value.
 *
 * Usage: npm run stats
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parseLeetCode, parseCodeforces } from './coding-stats-parsers.mjs';

const DATA_FILE = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/features/portfolio/data/coding-stats.json'
);

const HANDLES = {
  leetcode: 'sha1am',
  codeforces: 'shalam',
};

const TIMEOUT_MS = 20000;
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const request = async (url, init = {}) => {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { 'User-Agent': USER_AGENT, ...(init.headers ?? {}) },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.json();
};

const fetchLeetCode = async (username) => {
  const query = `
    query userProblemsSolved($username: String!) {
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum { difficulty count }
        }
      }
    }
  `;

  const payload = await request('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Node can set Referer; a browser cannot, and LeetCode rejects the
      // request without it.
      Referer: `https://leetcode.com/u/${username}/`,
    },
    body: JSON.stringify({ query, variables: { username } }),
  });

  return parseLeetCode(payload);
};

const fetchCodeforces = async (handle) => {
  const payload = await request(
    `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}`
  );
  return parseCodeforces(payload);
};

const withRetry = async (label, fn) => {
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === 2) throw error;
      console.warn(`  ${label}: attempt ${attempt} failed (${error.message}), retrying`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  return undefined;
};

const main = async () => {
  const previous = JSON.parse(await readFile(DATA_FILE, 'utf8'));
  const next = { ...previous, platforms: { ...previous.platforms } };
  let changed = false;
  let failures = 0;

  const tasks = [
    ['leetcode', () => fetchLeetCode(HANDLES.leetcode)],
    ['codeforces', () => fetchCodeforces(HANDLES.codeforces)],
  ];

  for (const [key, fn] of tasks) {
    const before = previous.platforms[key]?.problemsSolved;

    try {
      const solved = await withRetry(key, fn);

      // Guard against a successful response that reports fewer problems than
      // we already show. Counts do not go down; a drop means the API changed
      // shape or returned a partial history, and publishing it would
      // understate the profile.
      if (typeof before === 'number' && solved < before) {
        console.warn(
          `  ${key}: got ${solved}, which is below the committed ${before} - keeping ${before}`
        );
        failures += 1;
        continue;
      }

      next.platforms[key] = { problemsSolved: solved, source: 'api' };
      if (solved !== before) changed = true;
      console.log(`  ${key}: ${before} -> ${solved}`);
    } catch (error) {
      failures += 1;
      console.warn(`  ${key}: FAILED (${error.message}) - keeping ${before}`);
    }
  }

  if (changed) {
    next.updatedAt = new Date().toISOString().slice(0, 10);
    await writeFile(DATA_FILE, `${JSON.stringify(next, null, 2)}\n`);
    console.log(`Wrote ${DATA_FILE}`);
  } else {
    console.log('No changes.');
  }

  if (failures > 0) {
    console.warn(
      `\n${failures} platform(s) could not be refreshed. The build continues ` +
        'with the last known values.'
    );
  }
};

main().catch((error) => {
  // Even an unexpected crash must not break the build.
  console.error(`fetch-coding-stats: ${error.message}`);
  process.exitCode = 0;
});
