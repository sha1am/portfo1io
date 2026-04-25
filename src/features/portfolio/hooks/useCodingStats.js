import { useState, useEffect } from 'react';
import codingStatsService from '../services/codingStatsService';

export const useCodingStats = (initialProfiles) => {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const stats = await codingStatsService.fetchAllStats();
        
        // Update profiles with fetched data
        const updatedProfiles = initialProfiles.map(profile => {
          const platformKey = profile.name.toLowerCase();
          const platformStats = stats[platformKey === 'leetcode' ? 'leetcode' : 
                                platformKey === 'codeforces' ? 'codeforces' : 
                                platformKey === 'stratascratch' ? 'stratascratch' : null];
          
          if (platformStats && !platformStats.error) {
            return {
              ...profile,
              problemsSolved: platformStats.problemsSolved,
              totalProblems: platformStats.totalProblems
            };
          }
          
          return profile;
        });

        setProfiles(updatedProfiles);
      } catch (err) {
        setError('Failed to fetch coding statistics');
        console.error('Error in useCodingStats:', err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch stats only once when component mounts
    fetchStats();
  }, [initialProfiles]);

  return {
    profiles,
    loading,
    error
  };
};
