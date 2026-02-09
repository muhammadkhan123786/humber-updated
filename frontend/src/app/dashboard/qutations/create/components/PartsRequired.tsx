"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Wrench, Plus, Search, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { getAll } from '@/helper/apiHelper';
import { toast } from 'react-hot-toast';

interface Part {
  _id: string;
  partName: string;
  partNumber: string;
  description?: string;
  price: number;
  stock?: number;
  isActive?: boolean;
}

interface SelectedPart extends Part {
  quantity: number;
}

interface PartsRequiredProps {
  selectedParts: SelectedPart[];
  onPartsChange: (parts: SelectedPart[]) => void;
}

const PartsRequired = ({ selectedParts, onPartsChange }: PartsRequiredProps) => {
  const [showPartsList, setShowPartsList] = useState(false);
  const [parts, setParts] = useState<Part[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showPartsList) {
      loadParts();
    }
  }, [showPartsList]);

  const loadParts = async () => {
    setIsLoading(true);
    try {
      const response = await getAll<any>('/mobility-parts', {
        limit: '1000',
        search: searchQuery.trim(),
      });
      
      // Filter only active parts
      const activeParts = response.data?.filter((part: Part) => part.isActive) || [];
      setParts(activeParts);
    } catch (error) {
      console.error('Error loading parts:', error);
      toast.error('Failed to load parts');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredParts = useMemo(() => {
    if (!searchQuery) return parts;

    const query = searchQuery.toLowerCase();
    return parts.filter(part =>
      part.partName.toLowerCase().includes(query) ||
      part.partNumber.toLowerCase().includes(query)
    );
  }, [parts, searchQuery]);

  const handleSelectPart = (part: Part) => {
    const isAlreadySelected = selectedParts.some(p => p._id === part._id);
    
    if (isAlreadySelected) {
      toast.error(`${part.partName} is already added`);
      return;
    }

    const newPart: SelectedPart = {
      ...part,
      quantity: 1,
    };

    onPartsChange([...selectedParts, newPart]);
    toast.success(`${part.partName} added successfully`);
  };

  const handleQuantityChange = (partId: string, change: number) => {
    const updatedParts = selectedParts.map(part => {
      if (part._id === partId) {
        const newQuantity = Math.max(1, part.quantity + change);
        return { ...part, quantity: newQuantity };
      }
      return part;
    });
    onPartsChange(updatedParts);
  };

  const handleRemovePart = (partId: string) => {
    const partToRemove = selectedParts.find(p => p._id === partId);
    const updatedParts = selectedParts.filter(part => part._id !== partId);
    onPartsChange(updatedParts);
    
    if (partToRemove) {
      toast.success(`${partToRemove.partName} removed`);
    }
  };

  return (
    <>
      <div className="bg-white rounded-b-2xl border-t-4 border-orange-500 shadow-lg animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Wrench className="text-orange-600 w-5 h-5" />
            <h2 className="font-medium text-gray-900 leading-none">Parts Required</h2>
          </div>
          <button
            onClick={() => setShowPartsList(!showPartsList)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-md"
          >
            <Plus size={18} />
            <span>Add Part</span>
          </button>
        </div>

        {/* Search Bar and Parts List - shown when Add Part is clicked */}
        {showPartsList && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search parts by name or part number..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            {/* Parts List */}
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : filteredParts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No parts found</p>
                </div>
              ) : (
                filteredParts.map((part) => (
                  <div
                    key={part._id}
                    className="p-3 bg-orange-50 rounded-lg border border-orange-200 hover:border-orange-400 cursor-pointer transition-all"
                    onClick={() => handleSelectPart(part)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{part.partName}</h4>
                        <p className="text-sm text-gray-600 mt-0.5">Part #: {part.partNumber}</p>
                        {part.stock !== undefined && (
                          <p className="text-xs text-gray-500 mt-0.5">Stock: {part.stock} units</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-orange-600">£{part.price.toFixed(2)}</span>
                        <button className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Selected Parts Content */}
        <div className="p-6">
          {selectedParts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Wrench size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No parts added yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Click "Add Part" to include parts in quotation
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedParts.map((part) => (
                <div
                  key={part._id}
                  className="border border-orange-200 rounded-lg p-4 bg-orange-50/30 hover:bg-orange-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{part.partName}</h3>
                      <p className="text-sm text-gray-600 mt-1">Part #: {part.partNumber}</p>
                      <p className="text-sm text-gray-700 mt-2">
                        £{part.price.toFixed(2)} × {part.quantity} = £{(part.price * part.quantity).toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(part._id, -1)}
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                          disabled={part.quantity <= 1}
                        >
                          <ChevronDown size={16} className="text-gray-600" />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium border-x border-gray-300">
                          {part.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(part._id, 1)}
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                        >
                          <ChevronUp size={16} className="text-gray-600" />
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemovePart(part._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Remove part"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PartsRequired;
