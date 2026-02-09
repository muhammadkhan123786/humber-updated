import { useState, useCallback, useEffect, ReactNode } from "react";
import { ProductInformationCard } from "../utils/ProductInformationCard";
import {
  BASE_URL,
  BasicInfoStepProps,
  UploadedImage,
  AIResponse,
} from "../../types/product";

type Props = BasicInfoStepProps;

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
  setImage,
  isUploading: parentIsUploading = false,
}: Props) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<{
    tags: string[];
    description: string;
    shortDescription: string;
    keywords: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sync images from parent - FIXED
  useEffect(() => {
    // Convert parent images (string URLs) to UploadedImage format
    if (images && images.length > 0) {
      const initialImages = images.map((img, index) => ({
        id: `img-init-${Date.now()}-${index}`,
        preview: img,
        progress: 100,
        isUploading: false,
      }));
      setUploadedImages(initialImages);
    } else {
      setUploadedImages([]);
    }
  }, [images]); // Added dependency on images

  // Unified AI Analysis Logic
  const handleAnalyzeWithAI = async () => {
    // Collect all files currently in state
    const filesToAnalyze = uploadedImages
      .map((img) => img.file)
      .filter((file): file is File => !!file);

    if (filesToAnalyze.length === 0) {
      alert("Please upload new images to analyze.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const data = new FormData();
      filesToAnalyze.forEach((file) => data.append("images", file));

      const response = await fetch(`${BASE_URL}/ai`, {
        method: "POST",
        body: data,
      });

      const result: AIResponse = await response.json();
      if (result.success && result.ai) {
        const uniqueTags = Array.from(
          new Set(result.ai.tags.map((t) => t.trim())),
        );

        const suggestions = {
          ...result.ai,
          tags: uniqueTags,
        };

        setAiSuggestions(suggestions);

        // Auto-fill form if empty
        if (!formData.description)
          onInputChange("description", suggestions.description);
        if (!formData.shortDescription)
          onInputChange("shortDescription", suggestions.shortDescription);
        if (!formData.keywords) onInputChange("keywords", suggestions.keywords);
      }
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFilesUpload = useCallback(
    async (files: File[] | FileList): Promise<void> => {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (imageFiles.length === 0) return;

      // Create local previews and keep track of files
      const newImages: UploadedImage[] = imageFiles.map((file, index) => ({
        id: `img-${Date.now()}-${index}`,
        preview: URL.createObjectURL(file),
        file: file,
        progress: 0,
        isUploading: true,
      }));

      setUploadedImages((prev) => [...prev, ...newImages]);

      // Upload to parent/cloud storage
      await onImageUpload(imageFiles);
      
      // Update progress after upload
      setUploadedImages((prev) =>
        prev.map((img) =>
          newImages.some((newImg) => newImg.id === img.id)
            ? { ...img, progress: 100, isUploading: false }
            : img
        )
      );
    },
    [onImageUpload],
  );

  const handleRemoveImage = useCallback(
    (index: number, imageId: string) => {
      const img = uploadedImages.find((i) => i.id === imageId);
      if (img?.preview.startsWith("blob:")) URL.revokeObjectURL(img.preview);

      // Call parent to remove image
      onRemoveImage(index);
      
      // Update local state
      setUploadedImages((prev) => prev.filter((i) => i.id !== imageId));
    },
    [uploadedImages, onRemoveImage],
  );

  const applyAllSuggestions = useCallback(() => {
    if (!aiSuggestions) return;

    // Update text fields
    onInputChange("description", aiSuggestions.description);
    onInputChange("shortDescription", aiSuggestions.shortDescription);
    onInputChange("keywords", aiSuggestions.keywords);

    // Add all tags
    if (aiSuggestions.tags.length > 0) {
      // Add each tag individually
      aiSuggestions.tags.forEach((tag) => {
        if (!tags.includes(tag)) {
          onNewTagChange(tag);
          onAddTag();
        }
      });
    }

    setAiSuggestions(null);
  }, [aiSuggestions, onInputChange, tags, onNewTagChange, onAddTag]);

  return (
    <>
      <ProductInformationCard
        formData={formData}
        tags={tags}
        images={images}
        newTag={newTag}
        onInputChange={onInputChange}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        onNewTagChange={onNewTagChange}
        onImageUpload={handleFilesUpload} 
        onRemoveImage={handleRemoveImage} 
        setImage = { setImage}
      />
      
     
    </>
  );
}



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
//   onRemoveImage,

//   isUploading: parentIsUploading = false,
// }: Props) {
//   const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
//   const [aiSuggestions, setAiSuggestions] = useState<{
//     tags: string[];
//     description: string;
//     shortDescription: string;
//     keywords: string;
//   } | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);

//   // Sync images from parent
//   useEffect(() => {
//     if (images.length > 0 && uploadedImages.length === 0) {
//       const initialImages = images.map((img, index) => ({
//         id: `img-init-${index}`,
//         preview: img,
//         progress: 100,
//         isUploading: false,
//       }));
//       setUploadedImages(initialImages);
//     }
//   }, [images]);

//   // Unified AI Analysis Logic
//   const handleAnalyzeWithAI = async () => {
//     // Collect all files currently in state
//     const filesToAnalyze = uploadedImages
//       .map((img) => img.file)
//       .filter((file): file is File => !!file);

//     if (filesToAnalyze.length === 0) {
//       alert("Please upload new images to analyze.");
//       return;
//     }

//     setIsAnalyzing(true);

//     try {
//       const data = new FormData();
//       filesToAnalyze.forEach((file) => data.append("images", file));

//       const response = await fetch(`${BASE_URL}/ai`, {
//         method: "POST",
//         body: data,
//       });

//       const result: AIResponse = await response.json();
//       if (result.success && result.ai) {
//         // 1. Remove duplicates from AI tags immediately
//         const uniqueTags = Array.from(
//           new Set(result.ai.tags.map((t) => t.trim())),
//         );

//         const suggestions = {
//           ...result.ai,
//           tags: uniqueTags,
//         };

//         setAiSuggestions(suggestions);

//         // 2. Auto-fill form if empty
//         if (!formData.description)
//           onInputChange("description", suggestions.description);
//         if (!formData.shortDescription)
//           onInputChange("shortDescription", suggestions.shortDescription);
//         if (!formData.keywords) onInputChange("keywords", suggestions.keywords);
//       }
//     } catch (error) {
//       console.error("AI Analysis failed:", error);
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   const handleFilesUpload = useCallback(
//     async (files: FileList) => {
//       const imageFiles = Array.from(files).filter((file) =>
//         file.type.startsWith("image/"),
//       );
//       if (imageFiles.length === 0) return;

//       // Create local previews and keep track of files
//       const newImages: UploadedImage[] = imageFiles.map((file, index) => ({
//         id: `img-${Date.now()}-${index}`,
//         preview: URL.createObjectURL(file),
//         file: file,
//         progress: 100,
//         isUploading: false,
//       }));

//       setUploadedImages((prev) => [...prev, ...newImages]);

//       // Upload to parent/cloud storage
//       await onImageUpload(imageFiles);
//     },
//     [onImageUpload],
//   );

//   const handleRemoveImage = useCallback(
//     (index: number, imageId: string) => {
//       const img = uploadedImages.find((i) => i.id === imageId);
//       if (img?.preview.startsWith("blob:")) URL.revokeObjectURL(img.preview);

//       onRemoveImage(index);
//       setUploadedImages((prev) => prev.filter((i) => i.id !== imageId));
//     },
//     [uploadedImages, onRemoveImage],
//   );

//   const applyAllSuggestions = useCallback(() => {
//     if (!aiSuggestions) return;

//     // 1. Update text fields
//     onInputChange("description", aiSuggestions.description);
//     onInputChange("shortDescription", aiSuggestions.shortDescription);
//     onInputChange("keywords", aiSuggestions.keywords);

//     // 2. Add all tags at once (Professional Way)
//     if (aiSuggestions.tags.length > 0) {
//       // If your parent has a bulk add function:
//       // onAddMultipleTags(aiSuggestions.tags);

//       // OR if you must use your existing props:
//       aiSuggestions.tags.forEach((tag) => {
//         if (!tags.includes(tag)) {
//           onNewTagChange(tag);
//           onAddTag();
//         }
//       });
//     }

//     setAiSuggestions(null);
//   }, [aiSuggestions, onInputChange, tags, onNewTagChange, onAddTag]);

//   return (
//     <>
//       <ProductInformationCard
//         formData={formData}
//         tags={tags}
//         newTag={newTag}
//         onInputChange={onInputChange}
//         onAddTag={onAddTag}
//         onRemoveTag={onRemoveTag}
//         onNewTagChange={onNewTagChange}
//         images={images}
//       />
//     </>
//   );
// }
