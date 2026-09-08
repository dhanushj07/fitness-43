import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-[#0D1527] border ${
            error ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20' : 'border-white/10 hover:border-white/20 focus:border-[#22C55E] focus:ring-[#22C55E]/20'
          } rounded-xl py-2.5 px-3.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all duration-150 ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-slate-400 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-rose-400 mt-0.5">{error}</span>}
      {helperText && !error && <span className="text-xs text-slate-400 mt-0.5">{helperText}</span>}
    </div>
  );
};
