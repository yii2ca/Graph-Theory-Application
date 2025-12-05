import React from 'react';

/**
 * Card component - Container với gradient và border
 */
const Card = ({ 
  children, 
  title, 
  icon: Icon,
  gradient = 'purple',
  className = ''
}) => {
  const gradients = {
    purple: 'from-purple-500/10 to-pink-500/10 border-purple-500/30',
    blue: 'from-blue-500/10 to-cyan-500/10 border-blue-500/30',
    green: 'from-green-500/10 to-emerald-500/10 border-emerald-500/30',
    amber: 'from-amber-500/10 to-orange-500/10 border-amber-500/30'
  };

  return (
    <div className={`
      bg-gradient-to-br ${gradients[gradient]}
      rounded-xl p-4 border backdrop-blur-sm
      ${className}
    `}>
      {(title || Icon) && (
        <div className="flex items-center gap-2 mb-3">
          {Icon && <Icon className="text-current" size={20} />}
          {title && (
            <h3 className="text-lg font-semibold text-current">{title}</h3>
          )}
        </div>
      )}
      
      <div>
        {children}
      </div>
    </div>
  );
};

export default Card;
