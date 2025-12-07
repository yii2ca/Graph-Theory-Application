import React from 'react';
import './Button.css';

/**
 * Reusable Button Component
 * Variants: primary, secondary, danger, ghost, success
 * Sizes: sm, md, lg
 * States: default, hover, active, disabled, loading
 */
const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const buttonClass = `btn btn--${variant} btn--${size} ${disabled ? 'btn--disabled' : ''} ${loading ? 'btn--loading' : ''} ${className}`.trim();

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      <span className="btn__content">
        {Icon && iconPosition === 'left' && <Icon className="btn__icon" size={16} />}
        {children && <span className="btn__text">{children}</span>}
        {Icon && iconPosition === 'right' && <Icon className="btn__icon" size={16} />}
      </span>
      {loading && (
        <span className="btn__loader">
          <span className="loader"></span>
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;