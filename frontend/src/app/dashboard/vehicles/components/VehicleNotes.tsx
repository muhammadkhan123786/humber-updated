"use client";
export default function VehicleNotes({ formData, setFormData }: any) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
      <div className="md:w-1/3">
        <h2 className="text-xl font-bold text-gray-800">Notes</h2>
        <p className="text-xs text-gray-400 mt-1">Add any specific quirks, previous damage, or customer requests.</p>
      </div>
      <div className="md:w-2/3">
        <textarea 
          placeholder="Type detailed notes here..."
          className="w-full h-32 p-4 bg-gray-50 border rounded-2xl outline-none focus:border-[#FE6B1D] resize-none"
          value={formData.note}
          onChange={(e) => setFormData({...formData, note: e.target.value})}
        />
      </div>
    </div>
  );
}