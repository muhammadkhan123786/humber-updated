"use client";
export default function VehicleNotes({ formData, setFormData }: any) {
  return (
    <div className="bg-linear-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200 flex flex-col md:flex-row gap-8 hover:shadow-2xl transition-all animate-fadeInUp animation-delay-300">
      <div className="md:w-1/3">
        <h2 className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Notes</h2>
        <p className="text-xs text-gray-400 mt-1">Add any specific quirks, previous damage, or customer requests.</p>
      </div>
      <div className="md:w-2/3">
        <textarea 
          placeholder="Type detailed notes here..."
          className="w-full h-32 p-4 bg-linear-to-br from-purple-50 to-pink-50 border border-gray-300 rounded-2xl outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none transition-all hover:border-purple-400"
          value={formData.note}
          onChange={(e) => setFormData({...formData, note: e.target.value})}
        />
      </div>
    </div>
  );
}