export function StepIndicator({ steps, currentStep }: { steps: any[], currentStep: number }) {
  return (
    <div className="flex items-center justify-between px-12 py-6 border-b bg-white">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentStep >= step.id ? "bg-orange-500 text-white shadow-lg ring-4 ring-orange-100" : "bg-gray-100 text-gray-400"
            }`}>
              {step.icon}
            </div>
            <span className={`absolute -bottom-6 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${
              currentStep >= step.id ? "text-orange-600" : "text-gray-400"
            }`}>
              {step.title}
            </span>
          </div>
          {idx !== steps.length - 1 && (
            <div className={`h-1 flex-1 mx-4 rounded ${currentStep > step.id ? "bg-orange-500" : "bg-gray-100"}`} />
          )}
        </div>
      ))}
    </div>
  );
}