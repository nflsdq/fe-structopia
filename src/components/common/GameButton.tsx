import React from 'react';
import { motion } from 'framer-motion';
import useAudio from '../../hooks/useAudio';

interface GameButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const GameButton: React.FC<GameButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  type = 'button',
  className = '',
}) => {
  const { playSound } = useAudio();
  
  const handleClick = () => {
    if (!disabled && onClick) {
      playSound('buttonClick');
      onClick();
    }
  };
  
  const handleHover = () => {
    if (!disabled) {
      playSound('hover');
    }
  };
  
  // Base styles
  let baseClasses = 'relative font-display uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center justify-center overflow-hidden outline-none focus:outline-none';
  
  // Size variations
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-lg',
    lg: 'px-8 py-4 text-xl',
  };
  
  // Variant styles (background, borders, shadows)
  const variantClasses = {
    primary: `bg-primary-500 text-white border-2 border-primary-400 hover:bg-primary-600 
              shadow-[0_4px_0_rgba(0,0,0,0.2),0_0_10px_rgba(109,40,217,0.5)]
              hover:shadow-[0_6px_0_rgba(0,0,0,0.2),0_0_15px_rgba(109,40,217,0.7)]
              active:shadow-[0_2px_0_rgba(0,0,0,0.2),0_0_5px_rgba(109,40,217,0.3)]`,
    secondary: `bg-secondary-500 text-white border-2 border-secondary-400 hover:bg-secondary-600
                shadow-[0_4px_0_rgba(0,0,0,0.2),0_0_10px_rgba(79,70,229,0.5)]
                hover:shadow-[0_6px_0_rgba(0,0,0,0.2),0_0_15px_rgba(79,70,229,0.7)]
                active:shadow-[0_2px_0_rgba(0,0,0,0.2),0_0_5px_rgba(79,70,229,0.3)]`,
    accent: `bg-accent-500 text-white border-2 border-accent-400 hover:bg-accent-600
             shadow-[0_4px_0_rgba(0,0,0,0.2),0_0_10px_rgba(249,115,22,0.5)]
             hover:shadow-[0_6px_0_rgba(0,0,0,0.2),0_0_15px_rgba(249,115,22,0.7)]
             active:shadow-[0_2px_0_rgba(0,0,0,0.2),0_0_5px_rgba(249,115,22,0.3)]`,
    success: `bg-success-500 text-white border-2 border-success-400 hover:bg-success-600
              shadow-[0_4px_0_rgba(0,0,0,0.2),0_0_10px_rgba(16,185,129,0.5)]
              hover:shadow-[0_6px_0_rgba(0,0,0,0.2),0_0_15px_rgba(16,185,129,0.7)]
              active:shadow-[0_2px_0_rgba(0,0,0,0.2),0_0_5px_rgba(16,185,129,0.3)]`,
    warning: `bg-warning-500 text-neutral-900 border-2 border-warning-400 hover:bg-warning-600
              shadow-[0_4px_0_rgba(0,0,0,0.2),0_0_10px_rgba(251,191,36,0.5)]
              hover:shadow-[0_6px_0_rgba(0,0,0,0.2),0_0_15px_rgba(251,191,36,0.7)]
              active:shadow-[0_2px_0_rgba(0,0,0,0.2),0_0_5px_rgba(251,191,36,0.3)]`,
    danger: `bg-error-500 text-white border-2 border-error-400 hover:bg-error-600
             shadow-[0_4px_0_rgba(0,0,0,0.2),0_0_10px_rgba(239,68,68,0.5)]
             hover:shadow-[0_6px_0_rgba(0,0,0,0.2),0_0_15px_rgba(239,68,68,0.7)]
             active:shadow-[0_2px_0_rgba(0,0,0,0.2),0_0_5px_rgba(239,68,68,0.3)]`,
  };
  
  // Disabled state
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed hover:transform-none active:transform-none'
    : 'cursor-pointer hover:transform hover:-translate-y-1 active:transform active:translate-y-1';
  
  // Width
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${disabledClasses} 
    ${widthClasses}
    ${className}
  `;
  
  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      onMouseEnter={handleHover}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Button glow effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"></span>
      
      {/* Button content */}
      <span className="flex items-center justify-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="flex-1">{children}</span>
      </span>
    </motion.button>
  );
};

export default GameButton;