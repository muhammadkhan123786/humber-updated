import { useEffect, useRef } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { RegisterFormValues } from '../schema/registerSchema';

export function useGooglePlacesAutocomplete(
  setValue: UseFormSetValue<RegisterFormValues>,
  isLoaded: boolean
) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isLoaded || !window.google) return;

    const input = document.getElementById('address') as HTMLInputElement;
    if (!input) return;
    inputRef.current = input;

    autocompleteRef.current = new google.maps.places.Autocomplete(input, {
      fields: ['address_components', 'formatted_address', 'geometry'],
    });

    const listener = autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place?.geometry) return;

      const address = place.formatted_address || '';
      const postalCode =
        place.address_components?.find(c => c.types.includes('postal_code'))?.long_name || '';
      const country =
        place.address_components?.find(c => c.types.includes('country'))?.long_name || '';
      const lat = place.geometry?.location?.lat() || 0;
      const lng = place.geometry?.location?.lng() || 0;

      setValue('companyAddress', address, { shouldValidate: true });
      setValue('zipCode', postalCode);
      setValue('country', country);
      setValue('latitude', lat);
      setValue('longitude', lng);
    });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, setValue]);

  return { inputRef };
}