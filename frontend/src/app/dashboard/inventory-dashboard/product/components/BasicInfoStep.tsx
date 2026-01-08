import { useFormContext, Controller } from "react-hook-form";
import { FileUpload } from "@/components/form/FileUpload";
import SearchableDropdown from "@/components/form/SearchableDropdown";

export function BasicInfoStep({ dropdownData }: any) {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
  <Controller
    name="images"
    control={control}
    defaultValue={[]}
    render={({ field, fieldState }) => (
      <FileUpload
        label="Product Images *"
        maxSize={5}
        onFilesChange={field.onChange}
        error={fieldState.error?.message}
        helperText="Upload up to 5 images (max 5MB each)"
      />
    )}
  />
</div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-semibold">Product Name *</label>
          <input {...register("productName")} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" placeholder="Ex: Wireless Headphones" />
          {errors.productName && <p className="text-red-500 text-xs">{String(errors.productName.message)}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold">SKU Code *</label>
          <input {...register("SKU")} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 uppercase" placeholder="PROD-001" />
          {errors.SKU && <p className="text-red-500 text-xs">{String(errors.SKU.message)}</p>}

        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold">Description</label>
        <textarea {...register("productDes")} rows={4} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500" placeholder="Detailed product description..." />
          {errors.productDes && <p className="text-red-500 text-xs">{String(errors.productDes.message)}</p>}

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <SearchableDropdown label="Category" options={dropdownData?.categories || []} {...field} />
          )}
        />
        <Controller
          name="vendorId"
          control={control}
          render={({ field }) => (
            <SearchableDropdown label="Vendor/Supplier" options={dropdownData?.vendors || []} {...field} />
          )}
        />
      </div>
    </div>
  );
}