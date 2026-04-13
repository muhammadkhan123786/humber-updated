"use client";
import React, { useRef, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  MapPin,
  Camera,
  UploadCloud,
} from "lucide-react";
import { motion } from "framer-motion";
import { useFormContext, Controller } from "react-hook-form";
import FormInput from "../../components/FormInput";
import Image from "next/image";
import useGoogleMapLoad from "@/hooks/useGoogleMapLoad";
import { RiderFormData } from "@/schema/rider.schema";
import PhoneInputField from '@/components/Phoneinputfield'

interface GoogleAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GooglePlaceResult {
  place_id?: string;
  formatted_address?: string;
  address_components?: GoogleAddressComponent[];
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
}

const PersonalInfoForm: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const googleMapLoader = useGoogleMapLoad();
  const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:4000";

  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<RiderFormData>();
  const profilePic = watch("profilePic");
  const getPreviewUrl = () => {
    if (!profilePic) return null;
    if (profilePic instanceof File) {
      return URL.createObjectURL(profilePic);
    }

    if (typeof profilePic === "string" && profilePic.trim() !== "") {
      return profilePic.startsWith("http")
        ? profilePic
        : `${IMAGE_BASE_URL}${profilePic}`;
    }

    return null;
  };

  const previewUrl = getPreviewUrl();

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("profilePic", file, { shouldValidate: true });
    }
  };

  useEffect(() => {
    if (!googleMapLoader || typeof window === "undefined" || !window.google)
      return;

    const input = document.getElementById("address-input") as HTMLInputElement;
    if (!input) return;

    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ["address"],
      componentRestrictions: { country: "uk" },
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace() as GooglePlaceResult;
      if (!place?.place_id) return;

      const service = new window.google.maps.places.PlacesService(
        document.createElement("div"),
      );

      service.getDetails(
        {
          placeId: place.place_id,
          fields: ["address_components", "formatted_address", "geometry"],
        },
        (result: GooglePlaceResult | null, status: string) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            result
          ) {
            const addressComponents = result.address_components || [];
            const getComponent = (types: string[]): string => {
              const component = addressComponents.find((comp) =>
                types.some((type) => comp.types.includes(type)),
              );
              return component?.long_name || "";
            };

            const streetNumber = getComponent(["street_number"]);
            const route = getComponent(["route"]);
            const formattedAddress =
              streetNumber && route
                ? `${streetNumber} ${route}`
                : result.formatted_address || input.value;

            const cityValue =
              getComponent(["locality"]) ||
              getComponent(["postal_town"]) ||
              getComponent(["administrative_area_level_3"]);

            const zipCode = getComponent(["postal_code"]);

            setValue("addressLine1", formattedAddress, {
              shouldValidate: true,
            });
            setValue("city", cityValue, { shouldValidate: true });
            setValue("postalCode", zipCode, { shouldValidate: true });
          }
        },
      );
    });

    return () => {
      if (listener) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [googleMapLoader, setValue]);

  if (!googleMapLoader) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading Google Maps...</span>
      </div>
    );
  }
  const today = new Date().toISOString().split("T")[0];
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
          <User size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 leading-tight">
            Personal Information
          </h2>
          <p className="text-gray-500 text-sm">Basic details about the rider</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">
          Profile Photo <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-white shadow-inner flex items-center justify-center text-gray-400 overflow-hidden relative group">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile Preview"
                fill
                className="object-cover transition-transform group-hover:scale-110"
                unoptimized
                priority
              />
            ) : (
              <Camera size={32} />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-100 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm w-fit active:scale-95"
            >
              <UploadCloud size={18} className="text-blue-600" />
              {previewUrl ? "Change Photo" : "Upload Photo"}
            </button>
            <p className="text-[10px] text-gray-400 pl-1">
              JPG, PNG or GIF (max. 5MB)
            </p>
            {errors.profilePic && (
              <p className="text-xs text-red-500">
                {errors.profilePic.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-1">
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <FormInput
                label="First Name"
                placeholder="John"
                required
                {...field}
                error={!!errors.firstName}
                icon={<User size={18} />}
              />
            )}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500 pl-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Last Name"
                placeholder="Smith"
                required
                {...field}
                error={!!errors.lastName}
                icon={<User size={18} />}
              />
            )}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500 pl-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Email Address"
                placeholder="john.smith@example.com"
                required
                {...field}
                error={!!errors.email}
                icon={<Mail size={18} />}
              />
            )}
          />
          {errors.email && (
            <p className="text-xs text-red-500 pl-1">{errors.email.message}</p>
          )}
        </div>

       <div className="space-y-1">
  <Controller
    name="mobileNumber"
    control={control}
    render={({ field, fieldState: { error } }) => (
      <PhoneInputField
        {...field}                  // Passes value, onChange, onBlur, and name
        label="Phone Number"
        placeholder="+44 7700 900123"
        required={true}
        
        // --- CUSTOMIZATION PROPS ---
        labelIcon={Phone}           // Pass the component reference, not <Phone />
        borderColor={"#d0d5dd"} 
        height="38px"               // You can adjust size here
        fontSize="14px"
        
        // --- VALIDATION PROPS ---
        showValidation={!!error}    // Shows error state if RHF has an error
        errorMessage={error?.message} // Pass the RHF message to your component
      />
    )}
  />
</div>

        <div className="space-y-1">
          <Controller
            name="DOB"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Date of Birth"
                type="date"
                max={today}
                {...field}
                error={!!errors.DOB}
                icon={<Calendar size={18} />}
              />
            )}
          />
          {errors.DOB && (
            <p className="text-xs text-red-500 pl-1">{errors.DOB.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Controller
            name="nationalIssuranceNumber"
            control={control}
            render={({ field }) => (
              <FormInput
                label="National Insurance Number"
                placeholder="AB123456C"
                {...field}
                error={!!errors.nationalIssuranceNumber}
                icon={<ShieldCheck size={18} />}
              />
            )}
          />
          {errors.nationalIssuranceNumber && (
            <p className="text-xs text-red-500 pl-1">
              {errors.nationalIssuranceNumber.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Address
          </label>
          <div className="relative group">
            <div
              className={`absolute left-4 transition-colors top-1/2 -translate-y-1/2 ${errors.addressLine1 ? "text-red-500" : "text-gray-400 group-focus-within:text-blue-500"}`}
            >
              <MapPin size={18} />
            </div>
            <input
              id="address-input"
              type="text"
              {...register("addressLine1")}
              placeholder="123 High Street, Apartment 4B..."
              className={`w-full bg-gray-50 border-2 rounded-xl pl-11 pr-4 text-gray-800 text-sm outline-none transition-all py-2 h-9.5 placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${errors.addressLine1 ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-blue-500"}`}
            />
          </div>
          <p className="text-[10px] text-gray-500 pl-1">
            Start typing your UK address and select from suggestions
          </p>
          {errors.addressLine1 && (
            <p className="text-xs text-red-500 pl-1">
              {errors.addressLine1.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <FormInput
                label="City"
                placeholder="London"
                {...field}
                error={!!errors.city}
                icon={<MapPin size={18} />}
              />
            )}
          />
          {errors.city && (
            <p className="text-xs text-red-500 pl-1">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Controller
            name="postalCode"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Postcode"
                placeholder="SW1A 1AA"
                {...field}
                error={!!errors.postalCode}
                icon={<MapPin size={18} />}
              />
            )}
          />
          {errors.postalCode && (
            <p className="text-xs text-red-500 pl-1">
              {errors.postalCode.message}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalInfoForm;
