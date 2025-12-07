import React, { useState } from 'react';
import './Card.css';
import { ChevronDown } from 'lucide-react';

/**
 * Card Component - Container với gradient và border
 * Props: title, children, collapsible, icon, variant, className
 */
const Card = React.forwardRef(({
  children,
  title,
  icon: Icon,
  collapsible = false,
  defaultOpen = true,
  variant = 'primary',
  className = '',
  onToggle,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  const cardClass = `card card--${variant} ${className}`.trim();
  const contentClass = `card__content ${isOpen ? 'card__content--open' : 'card__content--closed'}`;

  return (
    <div ref={ref} className={cardClass} {...props}>
      {(title || Icon || collapsible) && (
        <div
          className={`card__header ${collapsible ? 'card__header--collapsible' : ''}`}
          onClick={collapsible ? handleToggle : undefined}
        >
          <div className="card__header-content">
            {Icon && <Icon className="card__icon" size={20} />}
            {title && <h3 className="card__title">{title}</h3>}
          </div>
          {collapsible && (
            <ChevronDown
              className={`card__chevron ${isOpen ? 'card__chevron--open' : ''}`}
              size={20}
            />
          )}
        </div>
      )}

      {collapsible ? (
        <div className={contentClass}>
          {children}
        </div>
      ) : (
        <div className="card__body">
          {children}
        </div>
      )}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;