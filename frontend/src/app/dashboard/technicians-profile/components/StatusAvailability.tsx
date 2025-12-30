"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Activity, MapPin, Plus, Clock, Trash2, ChevronDown, Loader2 } from "lucide-react";

interface ServiceZoneEntry {
  id: string;
  zoneName: string;
  days: string[]; 
  startTime: string;
  endTime: string;
}

interface MasterZone {
  _id: string;
  serviceZone: string; // Backend model key
  isActive: boolean;
}

interface StatusAvailabilityProps {
  formData: any;
  setFormData: (data: any) => void;
}

const WEEK_DAYS = [
  { id: "mon", label: "M" },
  { id: "tue", label: "T" },
  { id: "wed", label: "W" },
  { id: "thu", label: "T" },
  { id: "fri", label: "F" },
  { id: "sat", label: "S" },
  { id: "sun", label: "S" },
];

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ZONES_API_URL = `${BASE_URL}/services-zones`;

export default function StatusAvailability({ formData, setFormData }: StatusAvailabilityProps) {
  const [activeStatus, setActiveStatus] = useState(true);
  const [serviceZones, setServiceZones] = useState<ServiceZoneEntry[]>([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [masterZones, setMasterZones] = useState<MasterZone[]>([]);
  const [loadingZones, setLoadingZones] = useState(false);

  // 1. Fetch Zones from Master Form API
  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoadingZones(true);
        const token = localStorage.getItem("token");
        const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = savedUser.id || savedUser._id;

        const res = await axios.get(ZONES_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId, limit: 100 }
        });

        if (res.data && res.data.data) {
          // Sirf Active zones ko dropdown mein dikhayenge
          const activeOnes = res.data.data.filter((z: MasterZone) => z.isActive);
          setMasterZones(activeOnes);
        }
      } catch (err) {
        console.error("Error fetching master zones:", err);
      } finally {
        setLoadingZones(false);
      }
    };
    fetchZones();
  }, []);

  // Sync with main form data
  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      isActive: activeStatus,
      serviceZones: serviceZones
    }));
  }, [serviceZones, activeStatus, setFormData]);

  const getUsedDays = () => serviceZones.flatMap(z => z.days);

  const addZone = () => {
    if (!selectedZone) return;
    
    const usedDays = getUsedDays();
    const initialDays = WEEK_DAYS
      .map(d => d.id)
      .filter(id => !usedDays.includes(id))
      .slice(0, 5); 

    const newEntry: ServiceZoneEntry = {
      id: Math.random().toString(36).substr(2, 9),
      zoneName: selectedZone,
      days: initialDays, 
      startTime: "09:00",
      endTime: "18:00",
    };
    setServiceZones([...serviceZones, newEntry]);
    setSelectedZone(""); 
  };

  const removeZone = (id: string) => {
    setServiceZones(serviceZones.filter(z => z.id !== id));
  };

  const updateTiming = (id: string, field: 'startTime' | 'endTime', value: string) => {
    setServiceZones(serviceZones.map(z => z.id === id ? { ...z, [field]: value } : z));
  };

  const toggleDay = (zoneId: string, dayId: string) => {
    const usedDaysAcrossAllZones = getUsedDays();
    setServiceZones(serviceZones.map(z => {
      if (z.id === zoneId) {
        const isAlreadySelectedInThisZone = z.days.includes(dayId);
        if (!isAlreadySelectedInThisZone && usedDaysAcrossAllZones.includes(dayId)) {
          alert("This day is already assigned to another service zone.");
          return z;
        }
        const newDays = isAlreadySelectedInThisZone 
          ? z.days.filter(d => d !== dayId) 
          : [...z.days, dayId];
        return { ...z, days: newDays };
      }
      return z;
    }));
  };

  // Filter out zones that are already added to the list
  const availableZones = masterZones.filter(
    mz => !serviceZones.some(sz => sz.zoneName === mz.serviceZone)
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2 text-[#FE6B1D]">
          <Activity size={22} /> Status & Availability
        </h2>
      </div>

      <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center border border-gray-100">
        <div>
          <p className="font-bold text-gray-800">Active Status</p>
          <p className="text-xs text-gray-400">Technician can accept jobs when active</p>
        </div>
        <button 
          type="button"
          onClick={() => setActiveStatus(!activeStatus)}
          className={`w-14 h-7 rounded-full transition-all relative p-1 ${activeStatus ? 'bg-[#FE6B1D]' : 'bg-gray-300'}`}
        >
          <div className={`bg-white w-5 h-5 rounded-full shadow-sm transition-all transform ${activeStatus ? 'translate-x-7' : 'translate-x-0'}`} />
        </button>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4 gap-4">
          <div className="flex-1">
            <label className="text-sm font-semibold text-gray-600 block mb-2">Service Zone</label>
            <div className="relative">
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none appearance-none cursor-pointer focus:border-[#FE6B1D] disabled:opacity-50"
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                disabled={loadingZones}
              >
                <option value="">{loadingZones ? "Loading Zones..." : "Select Service Zone"}</option>
                {availableZones.map(mz => (
                  <option key={mz._id} value={mz.serviceZone}>{mz.serviceZone}</option>
                ))}
              </select>
              <div className="absolute right-3 top-3.5 text-gray-400 pointer-events-none">
                {loadingZones ? <Loader2 size={18} className="animate-spin" /> : <ChevronDown size={18} />}
              </div>
            </div>
          </div>
          <button 
            type="button"
            onClick={addZone}
            disabled={!selectedZone || loadingZones}
            className="bg-[#FE6B1D] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all active:scale-95 shadow-sm h-[52px]"
          >
            <Plus size={20} /> Add
          </button>
        </div>

        <div className="space-y-4 mt-6">
          {serviceZones.map((zone) => (
            <div key={zone.id} className="border border-orange-100 rounded-2xl p-5 bg-orange-50/20">
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold text-gray-800 flex items-center gap-2">
                  <MapPin size={16} className="text-[#FE6B1D]" /> {zone.zoneName}
                </p>
                <button type="button" onClick={() => removeZone(zone.id)} className="text-red-400">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {WEEK_DAYS.map((day) => {
                  const isActive = zone.days.includes(day.id);
                  const isTakenByOtherZone = getUsedDays().includes(day.id) && !isActive;
                  return (
                    <button
                      key={day.id}
                      type="button"
                      disabled={isTakenByOtherZone}
                      onClick={() => toggleDay(zone.id, day.id)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${
                        isActive 
                          ? 'bg-[#FE6B1D] text-white border-[#FE6B1D]' 
                          : isTakenByOtherZone 
                            ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed opacity-50' 
                            : 'bg-white text-gray-400 border-gray-100 hover:border-orange-200'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                <Clock size={16} className="text-gray-400" />
                <input 
                  type="time" 
                  value={zone.startTime} 
                  onChange={(e) => updateTiming(zone.id, 'startTime', e.target.value)}
                  className="bg-white border border-gray-100 rounded-lg px-2 py-1 outline-none" 
                />
                <span>to</span>
                <input 
                  type="time" 
                  value={zone.endTime} 
                  onChange={(e) => updateTiming(zone.id, 'endTime', e.target.value)}
                  className="bg-white border border-gray-100 rounded-lg px-2 py-1 outline-none" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}