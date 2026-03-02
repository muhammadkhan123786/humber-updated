"use client";
import React from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

interface FormFooterProps {
  onPrevious?: () => void;
  onNext?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isLoading?: boolean;
  isValid?: boolean;
}

const FormFooter: React.FC<FormFooterProps> = ({
  onPrevious,
  onNext,
  isFirstStep = false,
  isLastStep = false,
  isLoading = false,
  isValid = true,
}) => {
  const handleAction = () => {
    if (onNext) {
      onNext();
    }
  };

  const submitClasses = `
    inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md
    text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50
    [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0
    [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50
    focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
    aria-invalid:border-destructive hover:bg-primary/90 h-9 py-2 has-[>svg]:px-3
    bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700
    text-white px-8 shadow-lg active:scale-95
  `;

  const nextClasses = `
    flex items-center gap-2 text-white px-3 py-1.5 rounded-xl font-bold
    shadow-lg transition-all active:scale-95 hover:brightness-110
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <div className="w-full mt-8">
      <div className="flex items-center justify-between p-4 bg-transparent">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstStep || isLoading}
          className={`flex items-center gap-2 px-2 py-1.5 rounded-xl font-bold transition-all border border-gray-100 shadow-sm
            ${
              isFirstStep || isLoading
                ? "opacity-0 cursor-default pointer-events-none"
                : "bg-white/80 text-gray-500 hover:bg-white hover:text-gray-700 active:scale-95"
            }`}
        >
          <ChevronLeft size={18} strokeWidth={3} />
          <span>Previous</span>
        </button>

        {isLastStep ? (
          <button
            type="button"
            onClick={handleAction}
            disabled={isLoading || !isValid}
            className={submitClasses}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FileText size={18} strokeWidth={2.5} className="mr-2" />
                <span>Submit Registration</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAction}
            disabled={!isValid || isLoading}
            className={nextClasses}
            style={{
              background: "linear-gradient(90deg, #0061FF 0%, #009D85 100%)",
              opacity: !isValid || isLoading ? 0.5 : 1,
            }}
          >
            <span>Next</span>
            <ChevronRight size={18} strokeWidth={3} className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FormFooter;
