import React from 'react';

export const TierTabs: React.FC = () => {
  return (
    <div className="tier-tabs">
      <button className="tier-tab active">All</button>
      <button className="tier-tab">Diamond</button>
      <button className="tier-tab">Gold</button>
      <button className="tier-tab">Silver</button>
      <button className="tier-tab">Bronze</button>
    </div>
  );
};

export default TierTabs;
