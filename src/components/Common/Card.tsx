import React, { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 md:p-6 ${className}`}
      {...props}
    >
      {title && (
        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Card;
