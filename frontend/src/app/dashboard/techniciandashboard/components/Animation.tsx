import React from 'react';

const AnimationStyles = () => {
  return (
    <style jsx global>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.9) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-slideUp {
        animation: slideUp 0.5s ease-out forwards;
      }

      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
      }

      .animate-scaleIn {
        animation: scaleIn 0.4s ease-out forwards;
      }
    `}</style>
  );
};

export default AnimationStyles;
