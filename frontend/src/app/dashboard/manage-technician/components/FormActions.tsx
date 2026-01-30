import React from "react";

interface FormActionsProps {
  onClose: () => void;
  isSubmitting: boolean;
  isEditMode: boolean;
  googleMapLoader: any;
}

const FormActions: React.FC<FormActionsProps> = ({
  onClose,
  isSubmitting,
  isEditMode,
  googleMapLoader,
}) => {
  return (
    <div className="p-6 bg-slate-50 flex gap-4 border-t border-slate-100">
      <button
        type="button"
        onClick={onClose}
        className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-[#00C951] hover:text-white hover:border-[#00C951] transition-all duration-300 text-sm shadow-sm"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={isSubmitting || (!googleMapLoader && !isEditMode)}
        className="flex-1 py-3.5 rounded-xl font-bold bg-linear-to-r from-[#FF5C00] via-[#E7000B] to-[#D8006F] text-white shadow-lg shadow-red-100 hover:opacity-95 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? "Processing..."
          : isEditMode
            ? "Update Technician"
            : "Register Technician"}
      </button>
    </div>
  );
};

export default FormActions;
