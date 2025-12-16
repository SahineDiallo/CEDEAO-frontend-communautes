import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  showPassword?: boolean;
  togglePassword?: () => void;
  error?: string;
  label: string; // Add a label prop
}

export function InputWithIcon({
  icon,
  showPassword,
  togglePassword,
  label,
  value, // Add value to props
  ...props
}: InputWithIconProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value); // Initialize hasValue with the input's value

  // Sync hasValue with the input's value
  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const shouldFloatLabel = isFocused || hasValue;

  return (
    <div>
      <div className="relative">
        {/* Icon */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 ${
            shouldFloatLabel ? '' : ''
          }`}
        >
          {icon}
        </div>

        {/* Input */}
        <input
          {...props}
          value={value} // Pass the value prop
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => {
            setHasValue(!!e.target.value);
            if (props.onChange) props.onChange(e);
          }}
          className={`${
            props.error ? 'border-red-500' : 'border-gray-300'
          } block w-full border pl-10 pr-3 pt-6 pb-2 text-gray-900 placeholder-gray-500 focus:border-[#128C4F] focus:outline-none focus:ring-1 focus:ring-[#128C4F] sm:text-sm`}
        />

        {/* Floating Label */}
        <label
          className={`absolute left-10 transition-all duration-200 pointer-events-none ${
            shouldFloatLabel
              ? 'top-2 text-xs text-primary'
              : 'top-4 text-[16px] text-gray-500'
          }`}
        >
          {label}
        </label>

        {/* Toggle Password Button */}
        {togglePassword && (
          <button
            type="button"
            onClick={togglePassword}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? (
              <EyeOff className="h-8 w-8 text-gray-400" tabIndex={-1} />
            ) : (
              <Eye className="h-8 w-8 text-gray-400" tabIndex={-1} />
            )}
          </button>
        )}
      </div>
      {/* Error Message */}
      {props.error && <p className="text-red-500 text-sm mt-1">{props.error}</p>}
    </div>
  );
}