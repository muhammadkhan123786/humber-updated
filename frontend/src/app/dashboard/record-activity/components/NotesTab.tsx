// "use client";
// import React, { useRef } from "react";
// import {
//   Image as ImageIcon,
//   Video,
//   MessageSquare,
//   Plus,
//   FileEdit,
//   CheckCircle,
//   X,
//   Upload,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { UseFormReturn } from "react-hook-form";
// import { ActivityRecordFormData } from "../../../../schema/activityRecordSchema";

// interface NotesTabProps {
//   form: UseFormReturn<ActivityRecordFormData>;
//   handleJobNotesImageUpload: (files: FileList | null) => void;
//   removeJobNotesImage: (index: number) => void;
//   addMessage: (message: string) => void;
//   removeMessage: (index: number) => void;
// }

// export const NotesTab = ({
//   form,
//   handleJobNotesImageUpload,
//   removeJobNotesImage,
//   addMessage,
//   removeMessage,
// }: NotesTabProps) => {
//   const { register, watch } = form;

//   const msgInputRef = useRef<HTMLInputElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const videoInputRef = useRef<HTMLInputElement>(null);

//   const generalNotes = watch("generalNotes") || "";
//   const completionSummary = watch("completionSummary") || "";
//   const jobNotesMessages = watch("jobNotesMessages") || [];
//   const jobNotesImages = watch("jobNotesImages") || [];
//   const jobNotesVideos = watch("jobNotesVideos") || [];

//   const getCurrentTimestamp = () => {
//     return new Date()
//       .toLocaleString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//       })
//       .replace(",", "");
//   };

//   const handleAddMessage = () => {
//     const message = msgInputRef.current?.value?.trim();
//     if (message) {
//       addMessage(message);
//       if (msgInputRef.current) {
//         msgInputRef.current.value = "";
//       }
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     handleJobNotesImageUpload(e.target.files);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (videoInputRef.current) {
//       videoInputRef.current.value = "";
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       handleAddMessage();
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="space-y-6 pb-10"
//     >
//       <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
//         <div className="leading-none flex items-center gap-2 text-blue-600 font-bold mb-4">
//           <Upload size={16} className="text-blue-500" />
//           <span>Add Media & Messages</span>
//         </div>

//         <div className="grid grid-cols-3 gap-3 mb-6">
//           {/* Image Upload */}
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleImageUpload}
//             accept="image/*"
//             multiple
//             className="hidden"
//           />
//           <button
//             type="button" // ✅ Added
//             onClick={() => fileInputRef.current?.click()}
//             className="flex flex-col items-center justify-center gap-2 py-5 rounded-lg bg-[#00AEEF] text-white hover:opacity-90 transition-all"
//           >
//             <ImageIcon size={20} />
//             <span className="text-[11px] font-bold">Add Photos</span>
//           </button>

//           {/* Video Upload */}
//           <input
//             type="file"
//             ref={videoInputRef}
//             onChange={handleVideoUpload}
//             accept="video/*"
//             className="hidden"
//           />
//           <button
//             type="button" // ✅ Added
//             onClick={() => videoInputRef.current?.click()}
//             className="flex flex-col items-center justify-center gap-2 py-5 rounded-lg bg-[#BD32E0] text-white hover:opacity-90 transition-all"
//           >
//             <Video size={20} />
//             <span className="text-[11px] font-bold">Add Videos</span>
//           </button>

//           {/* Add Message Button */}
//           <button
//             type="button" // ✅ Added
//             onClick={handleAddMessage}
//             className="flex flex-col items-center justify-center gap-2 py-5 rounded-lg bg-[#10B981] text-white hover:opacity-90 transition-all"
//           >
//             <MessageSquare size={20} />
//             <span className="text-[11px] font-bold">Add Message</span>
//           </button>
//         </div>

//         <div className="relative">
//           <label className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
//             Quick Message
//           </label>
//           <div className="flex gap-2 mt-1">
//             <input
//               ref={msgInputRef}
//               type="text"
//               onKeyDown={handleKeyDown}
//               placeholder="Type a message and press Enter..."
//               className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
//             />
//             <button
//               type="button" // ✅ Added
//               onClick={handleAddMessage}
//               className="bg-[#10B981] text-white p-3 rounded-lg hover:bg-emerald-600 transition-colors"
//             >
//               <Plus size={20} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Media & Messages Section */}
//       <AnimatePresence>
//         {(jobNotesMessages.length > 0 ||
//           jobNotesImages.length > 0 ||
//           jobNotesVideos.length > 0) && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
//           >
//             <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-4">
//               <MessageSquare size={16} />
//               <span>
//                 Media & Messages (
//                 {jobNotesMessages.length +
//                   jobNotesImages.length +
//                   jobNotesVideos.length}
//                 )
//               </span>
//             </div>

//             <div className="space-y-3">
//               {/* Messages */}
//               {jobNotesMessages.map((message, index) => (
//                 <div
//                   key={`message-${index}`}
//                   className="bg-[#F8FAFF] border border-[#E8EFFF] rounded-xl p-4 relative group"
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-3">
//                       <MessageSquare size={14} className="text-emerald-500" />
//                       <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-emerald-100 text-emerald-600">
//                         MESSAGE
//                       </span>
//                       <span className="text-[10px] text-gray-400 font-medium">
//                         {getCurrentTimestamp()}
//                       </span>
//                     </div>
//                     <button
//                       type="button" // ✅ Added
//                       onClick={() => removeMessage(index)}
//                       className="text-red-400 hover:text-red-600 transition-colors"
//                     >
//                       <X size={14} />
//                     </button>
//                   </div>
//                   <div className="bg-white border border-gray-100 rounded-lg p-3">
//                     <p className="text-xs text-gray-700 font-medium">
//                       {message}
//                     </p>
//                   </div>
//                 </div>
//               ))}

//               {jobNotesImages.map((imageUrl, index) => (
//                 <div
//                   key={`image-${index}`}
//                   className="bg-[#F8FAFF] border border-[#E8EFFF] rounded-xl p-4 relative group"
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-3">
//                       <ImageIcon size={14} className="text-blue-500" />
//                       <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-blue-100 text-blue-600">
//                         IMAGE
//                       </span>
//                       <span className="text-[10px] text-gray-400 font-medium">
//                         {getCurrentTimestamp()}
//                       </span>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => removeJobNotesImage(index)}
//                       className="text-red-400 hover:text-red-600 transition-colors"
//                     >
//                       <X size={14} />
//                     </button>
//                   </div>
//                   <div className="bg-white border border-gray-100 rounded-lg p-3">
//                     <img
//                       src={imageUrl}
//                       alt={`Uploaded ${index}`}
//                       className="max-h-64 rounded-lg mx-auto object-contain"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src =
//                           "https://via.placeholder.com/300x200?text=Image+Error";
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}

//               {/* Videos - Placeholder for video functionality */}
//               {jobNotesVideos.length > 0 && (
//                 <div className="bg-[#F8FAFF] border border-[#E8EFFF] rounded-xl p-4">
//                   <div className="flex items-center gap-3 mb-3">
//                     <Video size={14} className="text-purple-500" />
//                     <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-purple-100 text-purple-600">
//                       VIDEO
//                     </span>
//                     <span className="text-[10px] text-gray-400 font-medium">
//                       {jobNotesVideos.length} video(s) uploaded
//                     </span>
//                   </div>
//                   <div className="bg-white border border-gray-100 rounded-lg p-3 text-center">
//                     <p className="text-xs text-gray-500">
//                       Videos will be uploaded with the form submission
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
//         <div className="leading-none flex items-center gap-2 text-amber-600 font-semibold mb-4">
//           <FileEdit size={16} />
//           <span>General Notes</span>
//         </div>
//         <textarea
//           rows={3}
//           placeholder="Enter any general notes..."
//           className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 focus:outline-none resize-none"
//           {...register("generalNotes")}
//           defaultValue={generalNotes}
//         />
//       </div>

//       <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
//         <div className="leading-none flex items-center gap-2 text-green-600 font-semibold mb-4">
//           <CheckCircle size={16} />
//           <span>Completion Summary</span>
//         </div>
//         <textarea
//           rows={3}
//           placeholder="Summarize the work completed..."
//           className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm focus:outline-none resize-none"
//           {...register("completionSummary")}
//           defaultValue={completionSummary}
//         />
//       </div>
//     </motion.div>
//   );
// };
