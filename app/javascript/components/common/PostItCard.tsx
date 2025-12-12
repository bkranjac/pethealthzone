import React from 'react';

interface PostItCardProps {
  children: React.ReactNode;
  colorIndex: number; // 0-7 for color rotation
  rotation?: number; // Optional manual rotation, defaults to subtle random
  className?: string;
}

// Use actual hex colors instead of Tailwind classes to avoid purging
const colors = [
  '#fef3c7', // Yellow (yellow-100)
  '#fce7f3', // Pink (pink-100)
  '#dbeafe', // Blue (blue-100)
  '#d1fae5', // Green (green-100)
  '#e9d5ff', // Lavender (purple-100)
  '#fed7aa', // Peach (orange-100)
  '#ccfbf1', // Mint (teal-100)
  '#fecaca', // Coral (red-100)
];

const rotations = [
  -2,
  -1,
  0,
  1,
  2,
];

export const PostItCard: React.FC<PostItCardProps> = ({
  children,
  colorIndex,
  rotation,
  className = ''
}) => {
  // Get color from palette
  const bgColor = colors[colorIndex % colors.length];

  // Use provided rotation or subtle rotation based on index
  const rotationDeg = rotation !== undefined
    ? rotation
    : rotations[colorIndex % rotations.length];

  return (
    <div
      className={`
        p-6
        shadow-md
        hover:shadow-xl
        transition-all
        duration-300
        ease-in-out
        relative
        ${className}
      `}
      style={{
        backgroundColor: bgColor,
        transform: `rotate(${rotationDeg}deg)`,
        boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'rotate(0deg) translateY(-8px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${rotationDeg}deg) translateY(0)`;
      }}
    >
      {/* Top "tape" effect */}
      <div
        className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 rounded-sm"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
      />

      {/* Card content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
