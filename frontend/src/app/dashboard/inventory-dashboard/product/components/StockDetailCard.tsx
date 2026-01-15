import React from 'react';
import { Calendar, Plus, Minus } from 'lucide-react';
 interface StockDetail {
  id: string;
  name: string;
  sku: string;
  image: string;
  status: 'Critical' | 'Healthy' | 'Low';
  lastUpdated: string;
  unitPrice: number;
  metrics: {
    onHand: number;
    reserved: number;
    reorderLevel: number;
    reorderQty: number;
    dangerLevel: number;
  };
}
interface StockDetailCardProps {
  data: StockDetail;
}

 const StockDetailCard: React.FC<StockDetailCardProps> = ({ data }) => {
  return (
    <div className="w-full border-2 border-red-100 rounded-3xl p-6 bg-white shadow-sm">
      {/* Top Section: Product Info */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex gap-4">
          <img 
            src={data.image} 
            alt={data.name} 
            className="w-20 h-20 rounded-2xl object-cover border border-gray-100" 
          />
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">{data.name}</h2>
              <span className="bg-gray-100 text-[10px] font-bold px-2 py-1 rounded text-gray-500 uppercase tracking-tighter">
                SKU: {data.sku}
              </span>
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {data.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Calendar size={14} />
              <span>Last updated: {data.lastUpdated}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 font-medium">Unit Price</p>
          <p className="text-2xl font-black text-gray-900">${data.unitPrice.toLocaleString()}</p>
        </div>
      </div>

      {/* Middle Section: Metrics Grid */}
      <div className="grid grid-cols-5 gap-4 mb-8 border-b border-gray-100 pb-8">
        <MetricItem label="On Hand" value={data.metrics.onHand} color="text-black" />
        <MetricItem label="Reserved" value={data.metrics.reserved} color="text-black" />
        <MetricItem label="Reorder Level" value={data.metrics.reorderLevel} color="text-blue-600" />
        <MetricItem label="Reorder Qty" value={data.metrics.reorderQty} color="text-orange-500" />
        <MetricItem label="Danger Level" value={data.metrics.dangerLevel} color="text-red-600" />
      </div>

      {/* Bottom Section: Action Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Adjust Physical Stock */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700">Adjust Physical Stock</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Quantity" 
              className="flex-1 px-4 py-2 border-2 border-gray-100 rounded-xl outline-none focus:border-blue-400 transition-all"
            />
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-1 font-bold text-sm">
              <Plus size={16} /> Add
            </button>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-1 font-bold text-sm">
              <Plus size={16} /> Add
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-1 font-bold text-sm">
              <Minus size={16} /> Remove
            </button>
          </div>
        </div>

        {/* Reserve Management */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700">Reserve Management</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Quantity" 
              className="flex-1 px-4 py-2 border-2 border-gray-100 rounded-xl outline-none focus:border-blue-400 transition-all"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold text-sm">
              Reserve
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-bold text-sm">
              Release
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default StockDetailCard
// Helper Sub-component
const MetricItem = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div>
    <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

