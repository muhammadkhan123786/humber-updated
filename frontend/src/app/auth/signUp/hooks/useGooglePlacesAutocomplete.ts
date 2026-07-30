"use client";

import { useEffect, useRef, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { RegisterFormValues } from "../schema/registerSchema";

export function useGooglePlacesAutocomplete(
  setValue: UseFormSetValue<RegisterFormValues>,
  isLoaded: boolean
) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [isWorking, setIsWorking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    let interval: NodeJS.Timeout;

    const initializeAutocomplete = () => {
      if (
        !window.google ||
        !window.google.maps ||
        !window.google.maps.places ||
        !window.google.maps.places.Autocomplete
      ) {
        return;
      }

      const input = document.getElementById(
        "address"
      ) as HTMLInputElement | null;

      if (!input) {
        return;
      }

      // Already initialized
      if (autocompleteRef.current) {
        setIsWorking(true);
        setIsInitialized(true);
        clearInterval(interval);
        return;
      }

      try {
        autocompleteRef.current = new google.maps.places.Autocomplete(input, {
          fields: [
            "address_components",
            "formatted_address",
            "geometry",
            "name",
          ],
          types: ["address"],
        });

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace();

          if (!place || !place.geometry) return;

          let postalCode = "";
          let country = "";

          place.address_components?.forEach((component) => {
            if (component.types.includes("postal_code")) {
              postalCode = component.long_name;
            }

            if (component.types.includes("country")) {
              country = component.long_name;
            }
          });

          setValue(
            "companyAddress",
            place.formatted_address || "",
            { shouldValidate: true }
          );

          setValue("zipCode", postalCode, {
            shouldValidate: true,
          });

          setValue("country", country, {
            shouldValidate: true,
          });

          setValue(
            "latitude",
            place.geometry.location?.lat() || 0
          );

          setValue(
            "longitude",
            place.geometry.location?.lng() || 0
          );
        });

        console.log("✅ Google Places initialized");

        setIsWorking(true);
        setIsInitialized(true);

        clearInterval(interval);
      } catch (err) {
        console.error("Google Places initialization failed", err);

        setIsWorking(false);
        setIsInitialized(true);

        clearInterval(interval);
      }
    };

    // Try immediately
    initializeAutocomplete();

    // Retry every 200ms until everything is ready
    interval = setInterval(initializeAutocomplete, 200);

    // Give up after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);

      if (!autocompleteRef.current) {
        console.warn("Google Places initialization timed out.");
        setIsWorking(false);
        setIsInitialized(true);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);

      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [isLoaded, setValue]);

  return {
    isWorking,
    isInitialized,
  };
}
