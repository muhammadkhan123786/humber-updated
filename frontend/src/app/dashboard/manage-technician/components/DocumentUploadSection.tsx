"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

interface DocumentUploadSectionProps {
  documents: { id: number; file: File | null; existingUrl?: string }[];
  handleMultipleFiles: (files: File[]) => void;
  removeDocument: (id: number) => void;
  handlePreviewDocument: (doc: {
    file: File | null;
    existingUrl?: string;
  }) => void;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  documents,
  handleMultipleFiles,
  removeDocument,
  handlePreviewDocument,
}) => {
  // Create a local ref instead of receiving it as a prop
  const localFileInputRef = useRef<HTMLInputElement | null>(null);

  const sectionTitleStyle =
    "flex items-center gap-2 text-md font-bold text-slate-800 border-b border-slate-50 pb-2 mb-4";

  return (
    <section className="space-y-3">
      <h3 className={sectionTitleStyle}>
        <svg
          className="text-blue-600"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
        <span className="text-slate-800 text-sm flex items-center gap-2">
          Document Upload (Multi-File Support)
        </span>
      </h3>

      <div className="p-6 rounded-2xl border-2 border-slate-100 hover:border-cyan-100 transition-all">
        <div className="self-stretch w-full flex flex-col justify-start items-start gap-3">
          <div className="self-stretch px-4 py-3 bg-linear-to-r from-cyan-50 to-blue-50 rounded-xl outline-1 -outline-offset-1 outline-cyan-200 flex flex-col justify-start items-start">
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <span className="text-gray-700 text-base">📎</span>
              <div className="inline-flex flex-wrap gap-1 text-gray-700 text-sm">
                <span className="font-normal">Upload multiple documents:</span>
                <span className="font-bold">
                  Resume, Certifications, ID Proof, Licenses, Background Check,
                  Training Certificates, etc.
                </span>
              </div>
            </div>
          </div>

          <div
            className="self-stretch min-h-72 relative bg-linear-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl outline-2 outline-offset-2 outline-cyan-300 overflow-hidden cursor-pointer transition-all duration-300 hover:outline-cyan-400 group"
            onClick={() => {
              if (localFileInputRef.current) {
                localFileInputRef.current.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add(
                "outline-cyan-500",
                "bg-cyan-100/50",
              );
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove(
                "outline-cyan-500",
                "bg-cyan-100/50",
              );
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove(
                "outline-cyan-500",
                "bg-cyan-100/50",
              );
              if (e.dataTransfer.files.length > 0) {
                const files = Array.from(e.dataTransfer.files);
                handleMultipleFiles(files);
              }
            }}
          >
            <div className="absolute inset-0 opacity-40 bg-linear-to-br from-cyan-200 to-blue-200 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center p-8 gap-6 text-center">
              <motion.div
                className="h-20 w-20 rounded-2xl bg-linear-to-br from-cyan-500 via-blue-500 to-indigo-500 flex items-center justify-center shadow-lg overflow-hidden"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              >
                <Upload size={32} className="text-white" />
              </motion.div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <h4 className="text-xl font-bold text-gray-800">
                    Click to Upload Multiple Documents
                  </h4>
                  <span className="px-3 py-1 bg-cyan-500 text-white text-sm font-bold rounded-full">
                    or drag & drop
                  </span>
                </div>

                <p className="text-gray-600 text-sm">
                  PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
                </p>

                <div className="flex items-center justify-center gap-4 text-xs text-cyan-700">
                  <span className="flex items-center gap-1">
                    ✓ Select multiple files at once
                  </span>
                  <span className="flex items-center gap-1">
                    • ✓ No file limit
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="px-6 py-2 bg-linear-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-[10px] shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  if (localFileInputRef.current) {
                    localFileInputRef.current.click();
                  }
                }}
              >
                <Upload size={16} />
                Browse Files
              </button>

              <input
                type="file"
                className="hidden"
                ref={localFileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const files = Array.from(e.target.files);
                    handleMultipleFiles(files);
                  }
                }}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple
              />
            </div>
          </div>
        </div>

        {documents.filter((doc) => doc.file || doc.existingUrl).length > 0 && (
          <div className="mt-8">
            <h5 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              Selected Documents (
              {documents.filter((doc) => doc.file || doc.existingUrl).length})
            </h5>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {documents
                .filter((doc) => doc.file || doc.existingUrl)
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-slate-50 rounded-lg border border-slate-200 p-3 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`p-2 rounded-md ${doc.file ? "bg-blue-100" : "bg-green-100"}`}
                        >
                          {doc.file?.name?.toLowerCase().endsWith(".pdf") ? (
                            <svg
                              className="w-5 h-5 text-red-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : doc.file?.name
                              ?.toLowerCase()
                              .match(/\.(jpg|jpeg|png)$/) ? (
                            <svg
                              className="w-5 h-5 text-blue-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 text-purple-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-slate-800 truncate">
                              {doc.file
                                ? doc.file.name
                                : doc.existingUrl?.split("/").pop()}
                            </span>
                            {doc.file && (
                              <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                New
                              </span>
                            )}
                            {!doc.file && doc.existingUrl && (
                              <span className="text-xs font-medium px-2 py-0.5 bg-green-100 text-green-700 rounded">
                                Existing
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>
                              {doc.file
                                ? `${(doc.file.size / 1024).toFixed(0)} KB`
                                : "Uploaded"}
                            </span>
                            <span>•</span>
                            <span>
                              {doc.file?.name
                                ?.split(".")
                                .pop()
                                ?.toUpperCase() ||
                                doc.existingUrl
                                  ?.split(".")
                                  .pop()
                                  ?.toUpperCase() ||
                                "FILE"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePreviewDocument(doc)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Preview"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeDocument(doc.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Remove"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DocumentUploadSection;
