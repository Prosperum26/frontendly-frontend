import React from 'react';
import { cn } from '../../utils/cn';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode; // Đã thêm
  rightElement?: React.ReactNode; // Đã thêm
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightElement,
  className,
  ...props
}) => {
  return (
    <div className="input-wrapper mb-4">
      {label && <label className="input-label block text-xs font-semibold text-slate-800 uppercase mb-2 tracking-wide">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">{icon}</div>}
        <input
          className={cn(
            'input', 
            error && 'input--error', 
            `w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none text-slate-700`, // Đã thêm Tailwind
            className
          )}
          {...props}
        />
        {rightElement && <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">{rightElement}</div>}
      </div>
      {error && <span className="input-error text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default Input;