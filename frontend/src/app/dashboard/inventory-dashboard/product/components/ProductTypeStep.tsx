import { useFormContext } from "react-hook-form";
import { Package, Palette } from "lucide-react";

export function ProductTypeStep() {
  const { watch, setValue } = useFormContext();
  const watchProductType = watch("productType");

  const types = [
    {
      id: "simple",
      title: "Simple Product",
      description: "Individual items with a single SKU and price (e.g., a Book).",
      icon: <Package className="w-10 h-10" />,
    },
    {
      id: "variable",
      title: "Variable Product",
      description: "Items with multiple variations like size or color (e.g., T-Shirts).",
      icon: <Palette className="w-10 h-10" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-800">Choose Product Type</h2>
        <p className="text-gray-500">Select how you want to manage this product's inventory</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {types.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => {
              setValue("productType", type.id);
              setValue("hasVariants", type.id === "variable");
            }}
            className={`p-8 border-2 rounded-2xl text-left transition-all flex flex-col items-center text-center ${
              watchProductType === type.id
                ? "border-orange-500 bg-orange-50 shadow-md ring-4 ring-orange-100"
                : "border-gray-200 hover:border-orange-200 bg-white"
            }`}
          >
            <div className={`mb-4 ${watchProductType === type.id ? "text-orange-600" : "text-gray-400"}`}>
              {type.icon}
            </div>
            <h4 className="font-bold text-lg mb-2">{type.title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed">{type.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}