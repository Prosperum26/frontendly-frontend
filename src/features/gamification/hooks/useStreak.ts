import { useState, useEffect } from 'react';

export const useStreak = (userId: string) => {
  const [streak, setStreak] = useState<number>(0);
  const [lastActive, setLastActive] = useState<number | null>(null);

  useEffect(() => {
    // TODO: Fetch streak from API
    setStreak(0);
    setLastActive(null);
  }, [userId]);

  const incrementStreak = () => {
    setStreak((prev) => prev + 1);
  };

  return { streak, lastActive, incrementStreak };
};

export default useStreak;
