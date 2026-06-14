import React from 'react';
import './editor-ui.css';

export interface ResultConsoleProps {
  message?: string;
}

export const ResultConsole: React.FC<ResultConsoleProps> = ({
  message = 'Run or submit your code to see results here.',
}) => {
  const isEmpty = message === 'Run or submit your code to see results here.';

  return (
    <div className="result-console">
      <div className="result-console__header">Console output</div>
      <pre className={`result-console__body ${isEmpty ? 'result-console__body--empty' : ''}`}>
        {message}
      </pre>
    </div>
  );
};

export default ResultConsole;
