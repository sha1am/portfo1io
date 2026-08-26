/**
 * Pure parsing helpers, kept separate from the network code so they can be
 * unit-tested without hitting the live APIs.
 */

/**
 * LeetCode reports accepted-submission counts per difficulty plus an "All"
 * row. Prefer the "All" row; fall back to summing the difficulties, because
 * the shape has changed before.
 */
export const parseLeetCode = (payload) => {
  const stats =
    payload?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum ??
    payload?.data?.matchedUser?.submitStats?.acSubmissionNum;

  if (!Array.isArray(stats) || stats.length === 0) {
    throw new Error('LeetCode: no acSubmissionNum in response');
  }

  const all = stats.find((row) => row.difficulty === 'All');
  const total = all
    ? all.count
    : stats.reduce((sum, row) => sum + (row.count ?? 0), 0);

  if (!Number.isInteger(total) || total < 0) {
    throw new Error(`LeetCode: implausible total ${total}`);
  }

  return total;
};

/**
 * Codeforces has no "solved count" endpoint, so we count distinct problems
 * with an accepted verdict across the user's whole submission history.
 * A problem is identified by contest + index; problems reachable only through
 * the problemset archive carry no contestId, so fall back to problemsetName.
 */
export const parseCodeforces = (payload) => {
  if (payload?.status !== 'OK' || !Array.isArray(payload.result)) {
    throw new Error(
      `Codeforces: unexpected response (${payload?.comment ?? payload?.status})`
    );
  }

  const solved = new Set();

  for (const submission of payload.result) {
    if (submission.verdict !== 'OK') continue;
    const problem = submission.problem;
    if (!problem) continue;

    const scope = problem.contestId ?? problem.problemsetName ?? 'unknown';
    solved.add(`${scope}-${problem.index}`);
  }

  return solved.size;
};
