import React from 'react'

interface DropdownAnimationProps {
  isOpen: boolean
  children: React.ReactNode
}

export const DropdownAnimation: React.FC<DropdownAnimationProps> = ({ isOpen, children }) => {
  if (!isOpen) return null

  return (
    <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden animate-dropdown">
      {children}
    </div>
  )
}

// Add this to your global CSS file (globals.css or tailwind.config)
// @keyframes dropdown {
//   from {
//     opacity: 0;
//     transform: translateY(-10px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

// .animate-dropdown {
//   animation: dropdown 0.2s ease-out;
// }
