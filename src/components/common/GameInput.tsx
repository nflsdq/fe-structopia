import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface GameInputProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  autoComplete?: string;
  className?: string;
}

const GameInput: React.FC<GameInputProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  icon,
  autoComplete,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block mb-1 font-medium text-primary-200">
        {label} {required && <span className="text-error-400">*</span>}
      </label>
      
      <motion.div
        className={`
          relative border-2 rounded-lg overflow-hidden
          ${error ? 'border-error-400' : isFocused ? 'border-primary-400' : 'border-neutral-600'}
          ${isFocused ? 'shadow-[0_0_10px_rgba(109,40,217,0.3)]' : ''}
        `}
        animate={{ 
          borderColor: error ? '#EF4444' : isFocused ? '#6D28D9' : '#4B5563',
          boxShadow: isFocused ? '0 0 15px rgba(109, 40, 217, 0.3)' : 'none'
        }}
      >
        <div className="flex items-center bg-neutral-800">
          {icon && (
            <span className="pl-3 pr-0 text-neutral-400">
              {icon}
            </span>
          )}
          
          <input
            type={inputType}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            autoComplete={autoComplete}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full px-4 py-3 bg-neutral-800 text-white focus:outline-none"
          />
          
          {type === 'password' && (
            <button
              type="button"
              onClick={toggleShowPassword}
              className="pr-4 text-neutral-400 hover:text-primary-400 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </motion.div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default GameInput;