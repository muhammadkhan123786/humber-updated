"use client";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

export const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder,
  error,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.pageYOffset,
        left: rect.left + window.pageXOffset,
        width: rect.width,
      });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt: any) => opt.id === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-10 px-3 bg-gray-100 rounded-[10px] flex items-center justify-between cursor-pointer transition-all border-2
          ${isOpen ? "border-purple-400 bg-white" : error ? "border-red-400" : "border-purple-100"}`}
      >
        <span
          className={`text-sm truncate ${selectedOption ? "text-indigo-950" : "text-gray-400"}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen &&
        createPortal(
          <div
            className="absolute z-999999 bg-white rounded-[10px] shadow-2xl border border-gray-200 overflow-hidden"
            style={{
              position: "absolute",
              top: `${coords.top + 4}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="max-h-[200px] overflow-y-auto p-1">
              {options.map((opt: any) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                  className="w-full group flex items-center px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[#10B981] mb-0.5 text-left"
                >
                  <span
                    className={`text-sm truncate flex-1 ${value === opt.id ? "font-bold text-[#10B981] group-hover:text-white" : "text-indigo-950 group-hover:text-white"}`}
                  >
                    {opt.label}
                  </span>
                  {value === opt.id && (
                    <Check
                      size={16}
                      className="ml-2 text-[#10B981] group-hover:text-white"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
