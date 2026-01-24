"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // Default: Light Gray border #e5e7eb to match Inputs
        "aspect-square size-4 shrink-0 rounded-full border border-[#e5e7eb] bg-white shadow-sm transition-all outline-none",
        // Focus: Indigo ring #4f46e5 with 20% opacity
        "focus-visible:ring-2 focus-visible:ring-[#4f46e5]/20 focus-visible:border-[#4f46e5]",
        // Checked: Indigo border #4f46e5
        "data-[state=checked]:border-[#4f46e5]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Error: Red border #ef4444
        "aria-invalid:border-[#ef4444] aria-invalid:ring-[#ef4444]/20",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        {/* Fill: Primary Indigo #4f46e5 */}
        <CircleIcon className="fill-[#4f46e5] text-[#4f46e5] absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };