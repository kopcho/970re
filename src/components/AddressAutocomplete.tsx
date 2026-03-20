"use client";

import { useEffect, useRef } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  required?: boolean;
}

export default function AddressAutocomplete({ value, onChange, placeholder, style, required }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "us" },
      fields: ["formatted_address"],
      types: ["address"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.formatted_address) {
        onChange(place.formatted_address);
      }
    });
  }, [onChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder ?? "Property address"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      style={style}
      autoComplete="off"
    />
  );
}
