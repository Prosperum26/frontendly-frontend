import { useState } from 'react';

export const useStreak = () => {
  const [streak, setStreak] = useState<number>(0);
  const [lastActive] = useState<number | null>(null);

  const incrementStreak = () => {
    setStreak((prev) => prev + 1);
  };

  return { streak, lastActive, incrementStreak };
};

export default useStreak;
