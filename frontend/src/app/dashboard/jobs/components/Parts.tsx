"use client";
import { Wrench, Package } from "lucide-react";

interface PartsProps {
  job: any;
}

const Parts = ({ job }: PartsProps) => {
  // Parts are located in job.quotationId.partsList
  const partsList = job?.quotationId?.partsList || [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-100 rounded-lg">
          <Wrench className="text-orange-600" size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Parts List</h3>
          <p className="text-sm text-gray-500">
            {partsList.length} {partsList.length === 1 ? 'part' : 'parts'} in this job
          </p>
        </div>
      </div>

      {/* Parts List */}
      {partsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Package size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No parts added yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Parts will appear here once added to the job
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {partsList.map((part: any, index: number) => (
            <div
              key={part.partId || index}
              className="border-2 border-orange-200 rounded-xl p-5 bg-linear-to-r from-orange-50/50 to-white hover:from-orange-50 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-orange-100 rounded-md">
                      <Wrench size={14} className="text-orange-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">{part.partName}</h4>
                  </div>
                  
                  <div className="ml-8 space-y-1">
                    {part.partNumber && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Part Number:</span> {part.partNumber}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Quantity:</span> {part.quantity} {part.quantity === 1 ? 'unit' : 'units'}
                    </p>
                  </div>
                </div>
                
                {/* <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</span>
                  <span className="text-2xl font-bold text-orange-600">
                    £{(part.total || 0).toFixed(2)}
                  </span>
                  {part.discount > 0 && (
                    <span className="text-xs text-green-600 font-medium">
                      Discount: £{part.discount.toFixed(2)}
                    </span>
                  )}
                </div> */}
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="mt-6 p-5 bg-linear-to-r from-orange-600 to-red-600 rounded-xl shadow-lg">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm font-medium text-orange-100">Total Parts Value</p>
                <p className="text-xs text-orange-200 mt-0.5">
                  {partsList.length} {partsList.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              {/* <div className="text-right">
                <p className="text-3xl font-bold">
                  £{partsList.reduce((sum: number, part: any) => sum + (part.total || 0), 0).toFixed(2)}
                </p>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parts;
