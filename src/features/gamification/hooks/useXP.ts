import { useState } from 'react';

export const useXP = () => {
  const [xp, setXP] = useState<number>(0);
  const level = Math.max(1, Math.floor(xp / 100) + 1);

  const addXP = (amount: number) => {
    setXP((prev) => prev + amount);
  };

  return { xp, level, addXP };
};

export default useXP;
