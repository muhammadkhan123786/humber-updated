"use client";

interface ServicesProps {
  job: any;
}

const Services = ({ job }: ServicesProps) => {
  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Services</h3>
      <p className="text-gray-500">Services management coming soon...</p>
    </div>
  );
};

export default Services;
