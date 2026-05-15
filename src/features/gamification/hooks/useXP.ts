import { useState, useEffect } from 'react';

export const useXP = (userId: string) => {
  const [xp, setXP] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);

  useEffect(() => {
    // TODO: Fetch XP from API
    setXP(0);
    setLevel(1);
  }, [userId]);

  const addXP = (amount: number) => {
    setXP((prev) => prev + amount);
  };

  return { xp, level, addXP };
};

export default useXP;
