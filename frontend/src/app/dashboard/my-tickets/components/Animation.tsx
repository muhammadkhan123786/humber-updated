import React, { useEffect } from 'react'

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

interface PopupAnimationProps {
  isOpen: boolean
  children: React.ReactNode
  onClose?: () => void
}

export const PopupAnimation: React.FC<PopupAnimationProps> = ({ isOpen, children, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
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

// @keyframes fadeIn {
//   from {
//     opacity: 0;
//   }
//   to {
//     opacity: 1;
//   }
// }

// .animate-fadeIn {
//   animation: fadeIn 0.3s ease-out;
// }

// @keyframes scaleIn {
//   from {
//     opacity: 0;
//     transform: scale(0.9);
//   }
//   to {
//     opacity: 1;
//     transform: scale(1);
//   }
// }

// .animate-scaleIn {
//   animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
// }
