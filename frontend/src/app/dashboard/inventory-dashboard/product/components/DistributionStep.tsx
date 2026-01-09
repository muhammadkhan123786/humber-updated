import { useFormContext, Controller } from "react-hook-form";
import MultiSelectDrop from "@/components/form/MultiSelectDrop";
import SearchableDropdown from "@/components/form/SearchableDropdown";
import { Tag, X } from "lucide-react"

export function DistributionStep({ dropdownData }: any) {
  const { register, control, watch, setValue } = useFormContext();
  
  const tagOptions = [
    // Performance
    { value: "long-range", label: "Long Range" },
    { value: "fast-charge", label: "Fast Charge" },
    { value: "off-road", label: "Off-Road" },
    { value: "commuter", label: "Commuter" },
    // Marketing
    { value: "new-arrival", label: "New Arrival" },
    { value: "best-seller", label: "Best Seller" },
    { value: "summer-sale", label: "Summer Sale" },
    // User Profile
    { value: "adults", label: "Adults" },
    { value: "kids", label: "Kids" },
    { value: "beginner-friendly", label: "Beginner-Friendly" },
  ];

  // Watch tags value to display chips
  const selectedTags = watch("tags") || [];



    console.log("order",dropdownData?.orderStatus || [])
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100">
        <h3 className="text-lg font-bold text-orange-900 mb-4">Sales Channels</h3>
        

         <Controller
          name="channelIds"
          control={control}
          defaultValue={[]}
          render={({ field, fieldState }) => (
            <div>
              <MultiSelectDrop 
                label="Select Marketplace Channels" 
                multiple={true}
                placeholder="Add performance, marketing, or user tags..."
                options={dropdownData?.channels || []} 
                value={field.value || []}
                onChange={field.onChange}
                error={fieldState.error?.message}
                hideOnSelect={true}  
              />
              
             
            </div>
          )}
        />
        <p className="text-sm text-orange-700 mt-2 italic">Product will be synchronized to the selected channels upon saving.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-5 h-5 text-orange-500" />
          <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm">Product Attributes & Tags</h3>
        </div>
        
        <Controller
          name="tags"
          control={control}
          defaultValue={[]}
          render={({ field, fieldState }) => (
            <div>
              <MultiSelectDrop 
                label="Search & Select Tags" 
                multiple={true}
                placeholder="Add performance, marketing, or user tags..."
                options={tagOptions} 
                value={field.value || []}
                onChange={field.onChange}
                error={fieldState.error?.message}
                hideOnSelect={true}  
              />
              
             
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-white border rounded-xl flex items-center justify-between">
          <div>
            <h4 className="font-bold">Promote to Featured</h4>
            <p className="text-xs text-gray-500">Highlight this item in special collections</p>
          </div>
          <input type="checkbox" {...register("isFeatured")} className="w-6 h-6 accent-orange-500" />
        </div>

        {/* <Controller
          name="orderStatus"
          control={control}
          render={({ field }) => (
            <SearchableDropdown label="Publishing Status" options={dropdownData?.orderStatus || []} {...field} />
          )}
        /> */}
      </div>
    </div>
  );
}