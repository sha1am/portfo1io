import assert from 'node:assert/strict';
import test from 'node:test';
import { parseLeetCode, parseCodeforces } from './coding-stats-parsers.mjs';

test('LeetCode: reads the "All" row', () => {
  const payload = {
    data: {
      matchedUser: {
        submitStatsGlobal: {
          acSubmissionNum: [
            { difficulty: 'All', count: 194 },
            { difficulty: 'Easy', count: 80 },
            { difficulty: 'Medium', count: 95 },
            { difficulty: 'Hard', count: 19 },
          ],
        },
      },
    },
  };
  assert.equal(parseLeetCode(payload), 194);
});

test('LeetCode: sums difficulties when the All row is missing', () => {
  const payload = {
    data: {
      matchedUser: {
        submitStatsGlobal: {
          acSubmissionNum: [
            { difficulty: 'Easy', count: 80 },
            { difficulty: 'Medium', count: 95 },
            { difficulty: 'Hard', count: 19 },
          ],
        },
      },
    },
  };
  assert.equal(parseLeetCode(payload), 194);
});

test('LeetCode: accepts the older submitStats shape', () => {
  const payload = {
    data: {
      matchedUser: {
        submitStats: { acSubmissionNum: [{ difficulty: 'All', count: 12 }] },
      },
    },
  };
  assert.equal(parseLeetCode(payload), 12);
});

test('LeetCode: throws on an unknown user', () => {
  assert.throws(() => parseLeetCode({ data: { matchedUser: null } }), /acSubmissionNum/);
});

test('LeetCode: throws on an empty payload', () => {
  assert.throws(() => parseLeetCode({}), /acSubmissionNum/);
});

test('Codeforces: counts distinct accepted problems', () => {
  const payload = {
    status: 'OK',
    result: [
      { verdict: 'OK', problem: { contestId: 1, index: 'A' } },
      // same problem solved twice - must not count twice
      { verdict: 'OK', problem: { contestId: 1, index: 'A' } },
      { verdict: 'OK', problem: { contestId: 1, index: 'B' } },
      { verdict: 'WRONG_ANSWER', problem: { contestId: 2, index: 'A' } },
      { verdict: 'TIME_LIMIT_EXCEEDED', problem: { contestId: 3, index: 'C' } },
    ],
  };
  assert.equal(parseCodeforces(payload), 2);
});

test('Codeforces: same index in different contests counts separately', () => {
  const payload = {
    status: 'OK',
    result: [
      { verdict: 'OK', problem: { contestId: 1, index: 'A' } },
      { verdict: 'OK', problem: { contestId: 2, index: 'A' } },
    ],
  };
  assert.equal(parseCodeforces(payload), 2);
});

test('Codeforces: handles archive problems with no contestId', () => {
  const payload = {
    status: 'OK',
    result: [
      { verdict: 'OK', problem: { problemsetName: 'acmsguru', index: '101' } },
      { verdict: 'OK', problem: { problemsetName: 'acmsguru', index: '101' } },
      { verdict: 'OK', problem: { problemsetName: 'acmsguru', index: '102' } },
    ],
  };
  assert.equal(parseCodeforces(payload), 2);
});

test('Codeforces: throws on a FAILED response', () => {
  assert.throws(
    () => parseCodeforces({ status: 'FAILED', comment: 'handle not found' }),
    /handle not found/
  );
});

test('Codeforces: a user with no accepted submissions is zero', () => {
  assert.equal(parseCodeforces({ status: 'OK', result: [] }), 0);
});
