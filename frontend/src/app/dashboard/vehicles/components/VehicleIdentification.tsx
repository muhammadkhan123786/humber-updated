"use client";
import { useEffect, useState, useRef } from "react"; // useRef add kiya
import { customerApi } from "@/lib/api"; 
import { UploadCloud, CheckCircle2, Search, X } from "lucide-react"; // X icon for remove
import { ICustomerVehicleRegInterface } from "../../../../../../common/Vehicle-Registeration.Interface";

interface Props {
  formData: Partial<ICustomerVehicleRegInterface>;
  setFormData: any;
}

export default function VehicleIdentification({ formData, setFormData }: Props) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  
  // Image preview state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    customerApi.getAll().then((data) => {
      setCustomers(data);
      setFilteredCustomers(data);
    });
  }, []);

  // Inside VehicleIdentification component, add this useEffect:
useEffect(() => {
  if (formData.customerId && customers.length > 0) {
    const found = customers.find(c => c.id === formData.customerId || c._id === formData.customerId);
    if (found) setSelectedCustomer(found);
  }
  // Set existing photo preview if available
  if (formData.vehiclePhoto && !formData.vehiclePhoto.startsWith('data:')) {
     setImagePreview(`${process.env.NEXT_PUBLIC_IMAGE_URL}${formData.vehiclePhoto}`);
  } else if (formData.vehiclePhoto) {
     setImagePreview(formData.vehiclePhoto);
  }
}, [formData.customerId, formData.vehiclePhoto, customers]);

  useEffect(() => {
    const filtered = customers.filter((c) => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      const email = (c.email || "").toLowerCase();
      const phone = (c.mobileNumber || "").toLowerCase();
      const search = searchTerm.toLowerCase();
      return fullName.includes(search) || email.includes(search) || phone.includes(search);
    });
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const handleSelect = (cust: any) => {
    setSelectedCustomer(cust);
    setFormData({ ...formData, customerId: cust.id });
  };

  // --- Image Upload Logic ---
  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Create Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        // 2. Update Form Data (aap base64 ya file object bhej sakte hain backend requirements ke mutabiq)
        setFormData({ ...formData, vehiclePhoto: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering file picker
    setImagePreview(null);
    setFormData({ ...formData, vehiclePhoto: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-800">Vehicle Identification</h2>
          <p className="text-xs text-gray-400">Basic details to identify the unit in the fleet.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {["Scooter", "Mobility Vehicle"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, vehicleType: type as any })}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                formData.vehicleType === type ? "bg-white text-[#FE6B1D] shadow-sm" : "text-gray-500"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* --- Photo Upload Area --- */}
        <div 
          onClick={handleBoxClick}
          className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[#FE6B1D] cursor-pointer transition-all group overflow-hidden min-h-[200px]"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-xs font-bold">Change Photo</p>
              </div>
              <button 
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <UploadCloud className="text-gray-300 group-hover:text-orange-400 mb-2 transition-colors" size={40} />
              <p className="text-sm font-bold text-orange-600">Upload a photo</p>
              <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
            </>
          )}
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="relative">
            <label className="text-sm font-medium text-gray-600 block mb-1">Search & Select Customer</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                className="w-full p-2.5 pl-10 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#FE6B1D] text-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="max-h-40 overflow-y-auto border border-gray-100 rounded-xl p-2 bg-gray-50/50 space-y-2 custom-scrollbar">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  className={`p-3 rounded-xl cursor-pointer flex justify-between items-center border transition-all ${
                    formData.customerId === c.id
                      ? "border-[#FE6B1D] bg-orange-50 shadow-sm"
                      : "bg-white border-transparent hover:border-gray-200"
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-gray-700">{c.firstName} {c.lastName}</p>
                    <div className="flex gap-3 mt-0.5">
                       <p className="text-[11px] text-gray-500 flex items-center gap-1"> {c.email}</p>
                       <p className="text-[11px] text-gray-500 flex items-center gap-1"> {c.mobileNumber}</p>
                    </div>
                  </div>
                  {formData.customerId === c.id && (
                    <div className="bg-[#FE6B1D] rounded-full p-0.5">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400 text-sm italic">
                No customers found matching your search.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 ml-1">First Name</span>
              <input readOnly placeholder="—" value={selectedCustomer?.firstName || ""} className="w-full p-3 bg-gray-100 border-none rounded-xl text-sm text-gray-600 cursor-not-allowed" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 ml-1">Last Name</span>
              <input readOnly placeholder="—" value={selectedCustomer?.lastName || ""} className="w-full p-3 bg-gray-100 border-none rounded-xl text-sm text-gray-600 cursor-not-allowed" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 ml-1">Email ID</span>
              <input readOnly placeholder="—" value={selectedCustomer?.email || ""} className="w-full p-3 bg-gray-100 border-none rounded-xl text-sm text-gray-600 cursor-not-allowed" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 ml-1">Contact No</span>
              <input readOnly placeholder="—" value={selectedCustomer?.mobileNumber || ""} className="w-full p-3 bg-gray-100 border-none rounded-xl text-sm text-gray-600 cursor-not-allowed" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}