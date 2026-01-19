export const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <div className={`relative inline-flex items-center h-5 w-9 rounded-full transition-all cursor-pointer ${
    isActive ? 'bg-blue-500' : 'bg-gray-300'
  }`}>
    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
      isActive ? 'translate-x-[18px]' : 'translate-x-1'
    }`}></div>
  </div>
);