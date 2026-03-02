"use client";

interface PartsProps {
  job: any;
}

const Parts = ({ job }: PartsProps) => {
  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Parts</h3>
      <p className="text-gray-500">Parts management coming soon...</p>
    </div>
  );
};

export default Parts;
