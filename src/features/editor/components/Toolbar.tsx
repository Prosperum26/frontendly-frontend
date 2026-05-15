import React from 'react';
import { Button } from '../../../components/Button';

export const Toolbar: React.FC = () => {
  return (
    <div className="toolbar">
      <Button variant="outline">Reset</Button>
      <Button variant="primary">Run</Button>
      <Button variant="primary">Submit</Button>
    </div>
  );
};

export default Toolbar;
