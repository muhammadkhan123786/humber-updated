// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Upload,
//   X,
//   Sparkles,
//   Image as ImageIcon,
//   Tag,
//   Package,
// } from "lucide-react";
// import { Input } from "@/components/form/Input";
// import { Textarea } from "@/components/form/Textarea";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/form/Card";
// import { Label } from "@/components/form/Label";

// interface BasicInfoStepProps {
//   formData: {
//     productName: string;
//     sku: string;
//     barcode: string;
//     brand: string;
//     manufacturer: string;
//     modelNumber: string;
//     description: string;
//     shortDescription: string;
//     keywords: string;
//   };
//   tags: string[];
//   images: string[];
//   newTag: string;
//   onInputChange: (field: string, value: string) => void;
//   onAddTag: () => void;
//   onRemoveTag: (tag: string) => void;
//   onNewTagChange: (value: string) => void;
//   onImageUpload: (files: FileList | File[]) => void;
//   onRemoveImage: (index: number) => void;
// }

// interface UploadedImage {
//   id: string;
//   preview: string;
//   progress: number;
//   isUploading: boolean;
//   file?: File;
// }

// export function BasicInfoStep({
//   formData,
//   tags,
//   images,
//   newTag,
//   onInputChange,
//   onAddTag,
//   onRemoveTag,
//   onNewTagChange,
//   onImageUpload,
//   onRemoveImage
// }: BasicInfoStepProps) {
//   const [isDragging, setIsDragging] = useState(false);
//   const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
//   const [aiSuggestions, setAiSuggestions] = useState<{
//     tags: string[];
//     description: string;
//     shortDescription: string;
//     keywords: string;
//   } | null>(null);

//   // Simulate AI image analysis for the first image
//   const analyzeImage = async (imageId: string) => {
//     // Find the image to analyze
//     setUploadedImages(prev => 
//       prev.map(img => 
//         img.id === imageId ? { ...img, isUploading: true } : img
//       )
//     );

//     // Simulate upload progress for this specific image
//     const progressInterval = setInterval(() => {
//       setUploadedImages(prev => 
//         prev.map(img => {
//           if (img.id === imageId && img.progress < 90) {
//             return { ...img, progress: img.progress + 10 };
//           }
//           return img;
//         })
//       );
//     }, 200);

//     // Simulate AI analysis
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     clearInterval(progressInterval);
    
//     // Set progress to 100%
//     setUploadedImages(prev => 
//       prev.map(img => 
//         img.id === imageId 
//           ? { ...img, progress: 100, isUploading: false } 
//           : img
//       )
//     );

//     // Mock AI suggestions (only for the first image)
//     const mockSuggestions = {
//       tags: [
//         "Mobility Scooter",
//         "Electric",
//         "Outdoor Use",
//         "Senior Care",
//         "Portable",
//       ],
//       description:
//         "This premium mobility scooter features a robust design with excellent maneuverability for both indoor and outdoor use. Equipped with a comfortable padded seat, adjustable armrests, and a powerful electric motor, it provides reliable transportation for individuals with limited mobility. The scooter includes safety features such as automatic braking, LED lighting, and anti-tip wheels.",
//       shortDescription:
//         "Premium electric mobility scooter with comfortable seating and excellent outdoor performance",
//       keywords:
//         "mobility scooter, electric scooter, senior mobility, wheelchair alternative, outdoor mobility, disability aid, assisted living",
//     };

//     setAiSuggestions(mockSuggestions);

//     // Reset progress after a delay
//     setTimeout(() => {
//       setUploadedImages(prev => 
//         prev.map(img => 
//           img.id === imageId ? { ...img, progress: 0 } : img
//         )
//       );
//     }, 1000);
//   };

//   const handleFilesUpload = async (files: FileList) => {
//     const imageFiles = Array.from(files).filter((file) =>
//       file.type.startsWith("image/"),
//     );

//     if (imageFiles.length === 0) return;

//     // Add new files to parent state
//     onImageUpload(imageFiles);

//     // Create uploaded image objects with unique IDs
//     const newUploadedImages: UploadedImage[] = imageFiles.map((file, index) => {
//       const preview = URL.createObjectURL(file);
//       const id = `img-${Date.now()}-${index}`;
//       return {
//         id,
//         preview,
//         progress: 0,
//         isUploading: false,
//         file
//       };
//     });

//     setUploadedImages(prev => [...prev, ...newUploadedImages]);

//     // Start analysis for the first new image if it's the first image overall
//     if (uploadedImages.length === 0 && newUploadedImages.length > 0) {
//       await analyzeImage(newUploadedImages[0].id);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const files = e.dataTransfer.files;
//     if (files.length > 0) {
//       handleFilesUpload(files);
//     }
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files.length > 0) {
//       handleFilesUpload(files);
//     }
//   };

//   const handleRemoveImage = (index: number, imageId: string) => {
//     // Remove from parent state
//     onRemoveImage(index);
    
//     // Remove from local state
//     setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    
//     // If we removed the first image and there are more images, analyze the new first image
//     if (index === 0 && uploadedImages.length > 1) {
//       const nextImage = uploadedImages[1];
//       analyzeImage(nextImage.id);
//     }
    
//     // If all images are removed, clear AI suggestions
//     if (uploadedImages.length === 1) {
//       setAiSuggestions(null);
//     }
//   };

//   const applyAISuggestion = (field: string, value: string) => {
//     onInputChange(field, value);
//   };

//   const applyAllSuggestions = () => {
//     if (!aiSuggestions) return;
//     onInputChange("description", aiSuggestions.description);
//     onInputChange("shortDescription", aiSuggestions.shortDescription);
//     onInputChange("keywords", aiSuggestions.keywords);
//   };

//   // Combine uploaded images from state with images from props for display
//   const displayImages = [
//     ...uploadedImages.map(img => img.preview),
//     ...images.filter(img => !uploadedImages.some(uploadedImg => 
//       uploadedImg.preview === img || uploadedImg.preview.includes(URL.createObjectURL(new Blob()))
//     ))
//   ];

//   return (
//     <div className="space-y-4">
//       {/* Image Upload Card */}
//       <Card className="border-2 border-blue-100">
//         <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
//           <CardTitle className="text-lg flex items-center gap-2">
//             <ImageIcon className="h-5 w-5 text-blue-600" />
//             Product Images
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6 space-y-6">
//           <div className="space-y-4">
//             <div>
//               <Label className="text-sm font-semibold text-gray-700 mb-2 block">
//                 Upload Product Images
//               </Label>
//               <p className="text-sm text-gray-600 mb-4">
//                 Upload images to auto-generate descriptions with AI. Drag & drop
//                 or click to select multiple images.
//               </p>
//             </div>

//             {/* Upload Zone */}
//             <div
//               onDragOver={handleDragOver}
//               onDragLeave={handleDragLeave}
//               onDrop={handleDrop}
//               className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
//                 isDragging
//                   ? "border-blue-500 bg-blue-100/50 scale-[1.02]"
//                   : "border-blue-300 bg-white/50 hover:bg-blue-50/50"
//               }`}
//             >
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileSelect}
//                 className="hidden"
//                 id="image-upload"
//                 multiple
//               />

//               {uploadedImages.some(img => img.isUploading) ? (
//                 <div className="text-center">
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{
//                       duration: 2,
//                       repeat: Infinity,
//                       ease: "linear",
//                     }}
//                     className="inline-block mb-4"
//                   >
//                     <Sparkles className="h-12 w-12 text-blue-500" />
//                   </motion.div>
//                   <p className="text-lg font-semibold text-gray-900 mb-2">
//                     Analyzing Images with AI...
//                   </p>
//                   <p className="text-sm text-gray-600 mb-4">
//                     Generating tags, descriptions, and keywords
//                   </p>
//                   <div className="max-w-xs mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
//                     <motion.div
//                       className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
//                       initial={{ width: 0 }}
//                       animate={{
//                         width: `${uploadedImages.find(img => img.isUploading)?.progress || 0}%`,
//                       }}
//                       transition={{ duration: 0.3 }}
//                     />
//                   </div>
//                   <p className="text-xs text-gray-500 mt-2">
//                     {uploadedImages.find(img => img.isUploading)?.progress || 0}% complete
//                   </p>
//                 </div>
//               ) : (
//                 <label
//                   htmlFor="image-upload"
//                   className="cursor-pointer block text-center"
//                 >
//                   <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
//                   <p className="text-lg font-semibold text-gray-900 mb-2">
//                     Drop images here or click to upload
//                   </p>
//                   <p className="text-sm text-gray-600 mb-4">
//                     Supports: JPG, PNG, WebP (Max 5MB each)
//                   </p>
//                   <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all">
//                     <Upload className="h-5 w-5" />
//                     Select Images
//                   </div>
//                 </label>
//               )}
//             </div>

//             {/* Uploaded Images Grid */}
//             {displayImages.length > 0 && (
//               <div className="mt-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <Label className="text-sm font-semibold text-gray-700">
//                     Uploaded Images ({displayImages.length})
//                   </Label>
//                   <span className="text-xs text-gray-500">
//                     First image will be used as primary for AI analysis
//                   </span>
//                 </div>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//                   <AnimatePresence>
//                     {displayImages.map((preview, index) => {
//                       const uploadedImage = uploadedImages.find(img => img.preview === preview);
//                       const progress = uploadedImage?.progress || 0;
//                       const isUploading = uploadedImage?.isUploading || false;
                      
//                       return (
//                         <motion.div
//                           key={preview}
//                           initial={{ opacity: 0, scale: 0.8 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           exit={{ opacity: 0, scale: 0.8 }}
//                           className="relative group"
//                         >
//                           <div className="aspect-square overflow-hidden rounded-lg border-2 border-blue-200 shadow-md bg-gray-100">
//                             <img
//                               src={preview}
//                               alt={`Product ${index + 1}`}
//                               className="w-full h-full object-cover"
//                             />
//                             {(progress > 0 && progress < 100) && (
//                               <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                                 <div className="text-center">
//                                   {isUploading ? (
//                                     <>
//                                       <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
//                                       <span className="text-xs text-white">
//                                         {progress}%
//                                       </span>
//                                     </>
//                                   ) : (
//                                     <div className="text-white text-sm">
//                                       Uploading...
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                           <button
//                             onClick={() => handleRemoveImage(index, uploadedImage?.id || preview)}
//                             className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 z-10"
//                           >
//                             <X className="h-3 w-3" />
//                           </button>
//                           {index === 0 && (
//                             <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
//                               Primary
//                             </div>
//                           )}
//                           {progress === 100 && (
//                             <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
//                               ✓
//                             </div>
//                           )}
//                         </motion.div>
//                       );
//                     })}
//                   </AnimatePresence>
//                 </div>
//               </div>
//             )}

//             {/* AI Suggestions Panel */}
//             <AnimatePresence>
//               {aiSuggestions && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 shadow-lg"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
//                         <Sparkles className="h-5 w-5 text-white" />
//                       </div>
//                       <div>
//                         <h4 className="text-lg font-bold text-gray-900">
//                           AI Suggestions Ready!
//                         </h4>
//                         <p className="text-sm text-gray-600">
//                           Review and apply auto-generated content
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={applyAllSuggestions}
//                       className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
//                     >
//                       <Sparkles className="h-4 w-4" />
//                       Apply All
//                     </button>
//                   </div>

//                   <div className="space-y-4">
//                     <div>
//                       <Label className="text-xs font-semibold text-gray-600 mb-2 block">
//                         Suggested Tags:
//                       </Label>
//                       <div className="flex flex-wrap gap-2">
//                         {aiSuggestions.tags.map((tag, idx) => (
//                           <motion.button
//                             key={idx}
//                             initial={{ opacity: 0, scale: 0.8 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{ delay: idx * 0.1 }}
//                             onClick={() => {
//                               onNewTagChange(tag);
//                               onAddTag();
//                             }}
//                             className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium border border-green-300 hover:bg-green-200 transition-colors flex items-center gap-1"
//                           >
//                             <Tag className="h-3 w-3" />
//                             {tag}
//                           </motion.button>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label className="text-xs font-semibold text-gray-600 block">
//                         Suggested Description:
//                       </Label>
//                       <div className="bg-white p-4 rounded-lg border border-green-200 text-sm text-gray-700 relative">
//                         {aiSuggestions.description}
//                         <button
//                           onClick={() =>
//                             applyAISuggestion(
//                               "description",
//                               aiSuggestions.description,
//                             )
//                           }
//                           className="absolute top-2 right-2 px-3 py-1 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 transition-colors"
//                         >
//                           Apply
//                         </button>
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label className="text-xs font-semibold text-gray-600 block">
//                         Suggested Short Description:
//                       </Label>
//                       <div className="bg-white p-4 rounded-lg border border-green-200 text-sm text-gray-700 relative">
//                         {aiSuggestions.shortDescription}
//                         <button
//                           onClick={() =>
//                             applyAISuggestion(
//                               "shortDescription",
//                               aiSuggestions.shortDescription,
//                             )
//                           }
//                           className="absolute top-2 right-2 px-3 py-1 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 transition-colors"
//                         >
//                           Apply
//                         </button>
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label className="text-xs font-semibold text-gray-600 block">
//                         Suggested SEO Keywords:
//                       </Label>
//                       <div className="bg-white p-4 rounded-lg border border-green-200 text-sm text-gray-700 relative">
//                         {aiSuggestions.keywords}
//                         <button
//                           onClick={() =>
//                             applyAISuggestion(
//                               "keywords",
//                               aiSuggestions.keywords,
//                             )
//                           }
//                           className="absolute top-2 right-2 px-3 py-1 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 transition-colors"
//                         >
//                           Apply
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Product Information Card - Rest remains the same */}
//       <Card className="border-2 border-indigo-100">
//         <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
//           <CardTitle className="text-lg flex items-center gap-2">
//             <Package className="h-5 w-5 text-indigo-600" />
//             Product Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6 space-y-6">
//           <Card className="border-2 border-indigo-100">
//         <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
//           <CardTitle className="text-lg flex items-center gap-2">
//             <Package className="h-5 w-5 text-indigo-600" />
//             Product Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label htmlFor="productName" className="text-sm font-semibold">
//                 Product Name <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="productName"
//                 value={formData.productName}
//                 onChange={(e) => onInputChange("productName", e.target.value)}
//                 placeholder="e.g., Travel Mobility Scooter Pro"
//                 className="border-2 h-11"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="sku" className="text-sm font-semibold">
//                 SKU Code <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="sku"
//                 value={formData.sku}
//                 onChange={(e) => onInputChange("sku", e.target.value)}
//                 placeholder="e.g., MS-TRAV-001"
//                 className="border-2 h-11"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="space-y-2">
//               <Label htmlFor="brand" className="text-sm font-semibold">
//                 Brand
//               </Label>
//               <Input
//                 id="brand"
//                 value={formData.brand}
//                 onChange={(e) => onInputChange("brand", e.target.value)}
//                 placeholder="e.g., Pride"
//                 className="border-2 h-11"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="manufacturer" className="text-sm font-semibold">
//                 Manufacturer
//               </Label>
//               <Input
//                 id="manufacturer"
//                 value={formData.manufacturer}
//                 onChange={(e) => onInputChange("manufacturer", e.target.value)}
//                 placeholder="e.g., Pride Mobility"
//                 className="border-2 h-11"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="modelNumber" className="text-sm font-semibold">
//                 Model Number
//               </Label>
//               <Input
//                 id="modelNumber"
//                 value={formData.modelNumber}
//                 onChange={(e) => onInputChange("modelNumber", e.target.value)}
//                 placeholder="e.g., GO-GO-ELITE"
//                 className="border-2 h-11"
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="barcode" className="text-sm font-semibold">
//               Barcode / EAN
//             </Label>
//             <Input
//               id="barcode"
//               value={formData.barcode}
//               onChange={(e) => onInputChange("barcode", e.target.value)}
//               placeholder="e.g., 5060123456789"
//               className="border-2 h-11"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="shortDescription" className="text-sm font-semibold">
//               Short Description
//             </Label>
//             <Textarea
//               id="shortDescription"
//               value={formData.shortDescription}
//               onChange={(e) =>
//                 onInputChange("shortDescription", e.target.value)
//               }
//               placeholder="Brief one-line description (max 160 characters)"
//               rows={2}
//               maxLength={160}
//               className="border-2"
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               {formData.shortDescription.length}/160 characters
//             </p>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description" className="text-sm font-semibold">
//               Full Description <span className="text-red-500">*</span>
//             </Label>
//             <Textarea
//               id="description"
//               value={formData.description}
//               onChange={(e) => onInputChange("description", e.target.value)}
//               placeholder="Detailed product description, features, benefits..."
//               rows={6}
//               className="border-2"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="keywords" className="text-sm font-semibold">
//               SEO Keywords
//             </Label>
//             <Input
//               id="keywords"
//               value={formData.keywords}
//               onChange={(e) => onInputChange("keywords", e.target.value)}
//               placeholder="e.g., mobility scooter, electric scooter, senior mobility, wheelchair alternative"
//               className="border-2 h-11"
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Comma-separated keywords for search optimization
//             </p>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="tags" className="text-sm font-semibold">
//               Product Tags
//             </Label>
//             <div className="flex gap-2 mb-3">
//               <Input
//                 id="tags"
//                 value={newTag}
//                 onChange={(e) => onNewTagChange(e.target.value)}
//                 onKeyPress={(e) => {
//                   if (e.key === "Enter") {
//                     e.preventDefault();
//                     onAddTag();
//                   }
//                 }}
//                 placeholder="Add a tag..."
//                 className="flex-1 border-2 h-11"
//               />
//               <button
//                 onClick={onAddTag}
//                 className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
//               >
//                 <Tag className="h-4 w-4" />
//                 Add
//               </button>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               <AnimatePresence>
//                 {tags.map((tag) => (
//                   <motion.div
//                     key={tag}
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.8 }}
//                     className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium border border-blue-300 cursor-pointer hover:bg-blue-200 transition-colors flex items-center gap-2"
//                     onClick={() => onRemoveTag(tag)}
//                   >
//                     {tag}
//                     <X className="h-3 w-3" />
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }





import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ImageUploadSection } from "./utils/ImageUploadSection";
import { AISuggestionsPanel } from "./utils/AISuggestionsPanel";
import { ProductInformationCard } from "./utils/ProductInformationCard";

interface BasicInfoStepProps {
  formData: {
    productName: string;
    sku: string;
    barcode: string;
    brand: string;
    manufacturer: string;
    modelNumber: string;
    description: string;
    shortDescription: string;
    keywords: string;
  };
  tags: string[];
  images: string[];
  newTag: string;
  onInputChange: (field: string, value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onNewTagChange: (value: string) => void;
  onImageUpload: (files: FileList | File[]) => Promise<void>;
  onRemoveImage: (index: number) => void;
  isUploading?: boolean;
}

interface UploadedImage {
  id: string;
  preview: string;
  progress: number;
  isUploading: boolean;
}

interface AIResponse {
  success: boolean;
  imageCount: number;
  ai: {
    shortDescription: string;
    description: string;
    tags: string[];
    keywords: string;
  };
}

export function BasicInfoStep({
  formData,
  tags,
  images,
  newTag,
  onInputChange,
  onAddTag,
  onRemoveTag,
  onNewTagChange,
  onImageUpload,
  onRemoveImage,
  isUploading: parentIsUploading = false
}: BasicInfoStepProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<{
    tags: string[];
    description: string;
    shortDescription: string;
    keywords: string;
  } | null>(null);
  const [localIsUploading, setLocalIsUploading] = useState(false);

  const isUploading = parentIsUploading || localIsUploading;

  // Sync images from parent to uploadedImages state
  useEffect(() => {
    if (images.length > 0) {
      const newUploadedImages: UploadedImage[] = [];
      
      images.forEach((img, index) => {
        // Check if this image already exists in uploadedImages
        const exists = uploadedImages.some(uploadedImg => 
          uploadedImg.preview === img || 
          (uploadedImg.id && uploadedImg.id.startsWith('img-'))
        );
        
        if (!exists) {
          newUploadedImages.push({
            id: `img-${Date.now()}-${index}`,
            preview: img,
            progress: 100, // Already uploaded
            isUploading: false
          });
        }
      });

      if (newUploadedImages.length > 0) {
        setUploadedImages(prev => [...prev, ...newUploadedImages]);
      }
    }
  }, [images]);

  // Call backend AI API
  const analyzeImagesWithAI = async (files: File[]): Promise<AIResponse> => {
    try {
      const formData = new FormData();
      
      // Add all image files
      files.forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch('http://localhost:4000/api/ai', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`AI analysis failed: ${response.statusText}`);
      }

      return await response.json();
      
    } catch (error) {
      console.error('AI analysis error:', error);
      return {
        success: false,
        imageCount: files.length,
        ai: {
          tags: files.length > 0 ? ["Product", "Item"] : [],
          description: files.length > 0 
            ? "This product appears in the uploaded images. Please add more details manually." 
            : "No images were uploaded.",
          shortDescription: files.length > 0 
            ? "A product based on the uploaded images" 
            : "Add product description",
          keywords: files.length > 0 ? "product, item" : ""
        }
      };
    }
  };

  // Handle image upload and AI analysis
  const handleFilesUpload = useCallback(async (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) return;

    setLocalIsUploading(true);

    // 1. Create previews immediately
    const newUploadedImages: UploadedImage[] = imageFiles.map((file, index) => {
      const preview = URL.createObjectURL(file);
      const id = `img-${Date.now()}-${index}`;
      return {
        id,
        preview,
        progress: 50, // Initial upload progress
        isUploading: true,
      };
    });

    // Add to local state for immediate preview
    setUploadedImages(prev => [...prev, ...newUploadedImages]);

    try {
      // 2. Upload images to parent (this will call the backend)
      await onImageUpload(imageFiles);

      // 3. Update progress to 75%
      setUploadedImages(prev => 
        prev.map(img => {
          const newImage = newUploadedImages.find(newImg => newImg.id === img.id);
          if (newImage) {
            return { ...img, progress: 75 };
          }
          return img;
        })
      );

      // 4. Call AI analysis API
      const aiResponse = await analyzeImagesWithAI(imageFiles);
      
      // 5. Update progress to 100% and remove loading state
      setUploadedImages(prev => 
        prev.map(img => {
          const newImage = newUploadedImages.find(newImg => newImg.id === img.id);
          if (newImage) {
            return { 
              ...img, 
              progress: 100, 
              isUploading: false 
            };
          }
          return img;
        })
      );

      // 6. Set AI suggestions from backend response
      if (aiResponse.success && aiResponse.ai) {
        const suggestions = {
          tags: aiResponse.ai.tags || [],
          description: aiResponse.ai.description || "",
          shortDescription: aiResponse.ai.shortDescription || "",
          keywords: aiResponse.ai.keywords || ""
        };
        
        setAiSuggestions(suggestions);

        // Auto-apply suggestions if form fields are empty
        if (!formData.description) {
          onInputChange("description", suggestions.description);
        }
        if (!formData.shortDescription) {
          onInputChange("shortDescription", suggestions.shortDescription);
        }
        if (!formData.keywords) {
          onInputChange("keywords", suggestions.keywords);
        }

        // Auto-add unique AI tags
        suggestions.tags.forEach(tag => {
          const trimmedTag = tag.trim();
          if (trimmedTag && !tags.includes(trimmedTag)) {
            onNewTagChange(trimmedTag);
            onAddTag();
          }
        });
      }

    } catch (error) {
      console.error('Upload/AI analysis failed:', error);
      
      // Remove failed uploads from local state
      setUploadedImages(prev => 
        prev.filter(img => !newUploadedImages.some(newImg => newImg.id === img.id))
      );
    } finally {
      setLocalIsUploading(false);
    }
  }, [onImageUpload, onInputChange, onNewTagChange, onAddTag, formData, tags]);

  const handleRemoveImage = useCallback((index: number, imageId: string) => {
    // Find the image to clean up
    const imageToRemove = uploadedImages.find(img => img.id === imageId);
    
    // Revoke the object URL to prevent memory leaks
    if (imageToRemove?.preview.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    
    // Find the index in the parent images array
    const parentIndex = uploadedImages.findIndex(img => img.id === imageId);
    if (parentIndex !== -1) {
      onRemoveImage(parentIndex);
    }
    
    // Remove from local state
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    
    // If we removed all images, clear AI suggestions
    if (uploadedImages.length === 1) {
      setAiSuggestions(null);
    }
  }, [uploadedImages, onRemoveImage]);

  const applyAISuggestion = useCallback((field: string, value: string) => {
    onInputChange(field, value);
  }, [onInputChange]);

  const applyAllSuggestions = useCallback(() => {
    if (!aiSuggestions) return;
    onInputChange("description", aiSuggestions.description);
    onInputChange("shortDescription", aiSuggestions.shortDescription);
    onInputChange("keywords", aiSuggestions.keywords);
    
    // Add all AI tags
    aiSuggestions.tags.forEach(tag => {
      const trimmedTag = tag.trim();
      if (trimmedTag && !tags.includes(trimmedTag)) {
        onNewTagChange(trimmedTag);
        onAddTag();
      }
    });
    
    // Hide suggestions after applying all
    setAiSuggestions(null);
  }, [aiSuggestions, onInputChange, tags, onNewTagChange, onAddTag]);

  const handleAddTagFromAI = useCallback((tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onNewTagChange(trimmedTag);
      onAddTag();
    }
  }, [tags, onNewTagChange, onAddTag]);

  // Check if any image is currently being uploaded or analyzed
  const isAnalyzing = uploadedImages.some(img => img.isUploading) || isUploading;

  return (
    <div className="space-y-4">
      {/* Image Upload Section */}
      <ImageUploadSection
        uploadedImages={uploadedImages}
        onFilesUpload={handleFilesUpload}
        onRemoveImage={handleRemoveImage}
        isAnalyzing={isAnalyzing}
        analyzeImage={(imageId) => {
          // Optional: Allow re-analysis of specific image
          const image = uploadedImages.find(img => img.id === imageId);
          // You could implement re-analysis here if needed
        }}
      />

      {/* AI Suggestions Panel - Only show if we have suggestions and not all are auto-applied */}
      <AnimatePresence>
        {aiSuggestions && (
          <AISuggestionsPanel
            suggestions={aiSuggestions}
            onApplySuggestion={applyAISuggestion}
            onApplyAll={applyAllSuggestions}
            onAddTag={handleAddTagFromAI}
            onClose={() => setAiSuggestions(null)}
          />
        )}
      </AnimatePresence>

      {/* Product Information Card */}
      <ProductInformationCard
        formData={formData}
        tags={tags}
        newTag={newTag}
        onInputChange={onInputChange}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        onNewTagChange={onNewTagChange}
      />

      {/* Upload Progress Indicator */}
      {isUploading && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Uploading and analyzing images...</span>
        </div>
      )}
    </div>
  );
}