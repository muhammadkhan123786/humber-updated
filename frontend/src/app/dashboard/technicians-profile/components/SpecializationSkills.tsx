"use client";
import React, { useState } from "react";
import { Wrench, Plus, Upload, X, FileText, Sparkles } from "lucide-react";

interface ComponentProps {
  formData: {
    skills: string[];
    certFile: File | null;
  };
  setFormData: any;
}

export default function SpecializationSkills({ formData, setFormData }: ComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput] });
      setSkillInput("");
      setIsModalOpen(false); // Modal close after adding
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: newSkills });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
      
      {/* 1. Skills Section Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "#FE6B1D" }}>
            <Wrench size={22} /> Specialization & Skills
          </h2>
          <button 
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-orange-50 text-[#FE6B1D] px-4 py-2 rounded-xl font-bold hover:bg-[#FE6B1D] hover:text-white transition-all active:scale-95 border border-orange-100"
          >
            <Plus size={18} /> Add New Skill
          </button>
        </div>

        {/* Render Skills as Chips */}
        <div className="flex flex-wrap gap-3">
          {formData.skills.map((skill: string, index: number) => (
            <div key={index} className="group flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:border-[#FE6B1D] transition-all shadow-sm">
              <span className="text-sm font-semibold text-gray-700">{skill}</span>
              <button 
                type="button" 
                onClick={() => removeSkill(index)} 
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {formData.skills.length === 0 && (
            <div className="w-full py-8 border-2 border-dotted border-gray-100 rounded-2xl text-center">
              <p className="text-gray-400 text-sm italic">No skills added. Click the button above to start.</p>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-100 mb-8" />

      {/* 2. Certification Section */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4" style={{ color: "#FE6B1D" }}>
          <FileText size={22} /> Certification & Documents
        </h2>
        
        <div className="relative group">
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) setFormData({...formData, certFile: e.target.files[0]});
            }}
          />
          <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 group-hover:border-[#FE6B1D] transition-all bg-gray-50/50 group-hover:bg-orange-50/30">
            <div className="p-4 bg-white shadow-md rounded-2xl text-[#FE6B1D] group-hover:rotate-12 transition-transform">
              <Upload size={32} />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-700">Drop your certification here</p>
              <p className="text-sm text-gray-400">PDF or Images up to 5MB</p>
            </div>
            
            {formData.certFile && (
              <div className="mt-2 bg-[#FE6B1D] text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-bounce-short">
                <FileText size={16} />
                <span className="text-sm font-bold truncate max-w-[150px]">{formData.certFile.name}</span>
                <X size={16} className="cursor-pointer" onClick={(e) => { e.preventDefault(); setFormData({...formData, certFile: null}); }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- ADD SKILL MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-100 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center bg-gray-50 border-b">
               <div className="w-16 h-16 bg-orange-100 text-[#FE6B1D] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={32} />
               </div>
               <h3 className="text-xl font-bold text-gray-800">Add Technical Skill</h3>
               <p className="text-sm text-gray-500">Specify your expertise area</p>
            </div>
            
            <div className="p-6">
              <input 
                autoFocus
                type="text" 
                placeholder="e.g. Engine Diagnostics"
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#FE6B1D] transition-all text-center text-lg font-semibold"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={addSkill}
                  className="p-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all"
                  style={{ backgroundColor: "#FE6B1D" }}
                >
                  Add Skill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}