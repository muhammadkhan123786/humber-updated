// "use client";

// import React, { useState } from 'react';
// import { Plus, X, Battery, FileText } from 'lucide-react';

// export type PreferencesFields = 'issues' | 'description';

// interface PreferencesStepProps {
//     formData: {
//         issues: Array<{ category: string; subIssues: string[] }>;
//         description: string;
//     };
//     onInputChange: (field: PreferencesFields, value: any) => void;
// }

// export default function PreferencesStep({ formData, onInputChange }: PreferencesStepProps) {
//     const [selectedCategory, setSelectedCategory] = useState("");

//     // Mock data based on your image
//     const issueCategories = [
//         { id: '1', label: 'Battery & Power Issue', items: ['Battery not charging', 'Short battery life', 'Power button unresponsive'] },
//         { id: '2', label: 'Screen & Display', items: ['Cracked screen', 'Flickering display', 'Dead pixels'] },
//         { id: '3', label: 'Software/OS', items: ['Slow performance', 'App crashing', 'Update failed'] }
//     ];

//     const handleAddCategory = (catLabel: string) => {
//         if (!catLabel) return;
//         const exists = formData.issues.find(i => i.category === catLabel);
//         if (!exists) {
//             const newIssues = [...formData.issues, { category: catLabel, subIssues: [] }];
//             onInputChange('issues', newIssues);
//         }
//         setSelectedCategory("");
//     };

//     const handleToggleSubIssue = (categoryLabel: string, subIssue: string) => {
//         const updatedIssues = formData.issues.map(cat => {
//             if (cat.category === categoryLabel) {
//                 const subIssues = cat.subIssues.includes(subIssue)
//                     ? cat.subIssues.filter(si => si !== subIssue)
//                     : [...cat.subIssues, subIssue];
//                 return { ...cat, subIssues };
//             }
//             return cat;
//         });
//         onInputChange('issues', updatedIssues);
//     };

//     const removeCategory = (catLabel: string) => {
//         onInputChange('issues', formData.issues.filter(i => i.category !== catLabel));
//     };

//     return (
//         <div className="space-y-8 animate-in fade-in duration-500">
//             {/* Header Section */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                 <h2 className="text-2xl font-bold text-gray-900">What Issues Are You Experiencing?</h2>
//                 <div className="flex items-center gap-2">
//                     <select 
//                         value={selectedCategory}
//                         onChange={(e) => handleAddCategory(e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#FE6B1D] outline-none"
//                     >
//                         <option value="">Select Issue Type</option>
//                         {issueCategories.map(cat => (
//                             <option key={cat.id} value={cat.label}>{cat.label}</option>
//                         ))}
//                     </select>
//                     <button 
//                         type="button"
//                         onClick={() => handleAddCategory(selectedCategory)}
//                         className="flex items-center gap-1 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
//                     >
//                         <Plus className="w-4 h-4" /> Add New
//                     </button>
//                 </div>
//             </div>

//             {/* Selected Categories Tags */}
//             <div className="flex flex-wrap gap-2">
//                 {formData.issues.map((issue, idx) => (
//                     <div key={idx} className="flex items-center gap-2 bg-[#FE6B1D] text-white px-3 py-1.5 rounded-full text-sm">
//                         <span>{issue.category}</span>
//                         <button onClick={() => removeCategory(issue.category)}>
//                             <X className="w-4 h-4 hover:text-gray-200" />
//                         </button>
//                     </div>
//                 ))}
//             </div>

//             {/* Sub-issues List (Design match for Battery & Power) */}
//             <div className="space-y-6">
//                 {formData.issues.map((catGroup, idx) => {
//                     const template = issueCategories.find(c => c.label === catGroup.category);
//                     return (
//                         <div key={idx} className="space-y-4">
//                             <div className="flex items-center gap-2 text-gray-800 font-semibold">
//                                 <Battery className="w-5 h-5 text-[#FE6B1D]" />
//                                 <span>{catGroup.category}</span>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 {template?.items.map(item => (
//                                     <label 
//                                         key={item}
//                                         className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
//                                             catGroup.subIssues.includes(item) 
//                                             ? 'border-[#FE6B1D] bg-[#FE6B1D]/5' 
//                                             : 'border-gray-200 hover:bg-gray-50'
//                                         }`}
//                                     >
//                                         <input 
//                                             type="checkbox"
//                                             checked={catGroup.subIssues.includes(item)}
//                                             onChange={() => handleToggleSubIssue(catGroup.category, item)}
//                                             className="w-5 h-5 rounded border-gray-300 text-[#FE6B1D] focus:ring-[#FE6B1D]"
//                                         />
//                                         <span className={`text-base ${catGroup.subIssues.includes(item) ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
//                                             {item}
//                                         </span>
//                                     </label>
//                                 ))}
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* Detailed Description */}
//             <div className="space-y-3">
//                 <div className="flex items-center gap-2 font-semibold text-gray-900">
//                     <FileText className="w-5 h-5 text-[#FE6B1D]" />
//                     <span>Detailed Description of the Issue <span className="text-red-500">*</span></span>
//                 </div>
//                 <textarea 
//                     value={formData.description}
//                     onChange={(e) => onInputChange('description', e.target.value)}
//                     placeholder="Please describe the issue in detail, including when it started, any error messages, and what you've tried to fix it..."
//                     className="w-full min-h-[150px] p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#FE6B1D] focus:bg-white transition-all outline-none resize-none"
//                     required
//                 />
//             </div>
//         </div>
//     );
// }