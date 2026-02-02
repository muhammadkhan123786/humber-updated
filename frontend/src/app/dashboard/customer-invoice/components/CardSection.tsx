"use client";
import React from "react";
import { Package, Clock, DollarSign, CheckCircle2 } from "lucide-react";

const CardSection = () => {
  const cards = [
    {
      title: "Parts",
      value: "£0.00",
      subText: "0 Items",
      icon: <Package className="text-white" size={28} />,
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500 ",
    },
    {
      title: "Labour",
      value: "£0.00",
      subText: "0h Total",
      icon: <Clock className="text-white" size={28} />,
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    {
      title: "Subtotal",
      value: "£0.00",
      subText: "Before Discount",
      icon: <DollarSign className="text-white" size={28} />,
      gradient: "bg-gradient-to-br from-amber-500 to-orange-500",
    },
    {
      title: "Total",
      value: "£0.00",
      subText: "Final Amount",
      icon: <CheckCircle2 className="text-white" size={28} />,
      gradient: "bg-gradient-to-br from-[#00BC7E] to-[#00DA8E]",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 p-6 bg-gray-50 justify-center">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.gradient} w-[280px] h-[160px] p-5 rounded-3xl shadow-lg flex flex-col justify-between`}
        >
          {/* Top Section - Using your specific CSS */}
          <div className="self-stretch h-8 inline-flex justify-between items-center">
            {/* Icon Container */}
            <div className="w-8 h-8 flex items-center justify-center">
              {card.icon}
            </div>

            {/* Right Badge */}
            <div className="px-3 py-1 bg-white/20 rounded-[10px] border border-white/30 flex justify-center items-center">
              <span className="text-white text-[10px] font-normal font-['Arial'] uppercase tracking-wider">
                {card.title}
              </span>
            </div>
          </div>

          {/* Bottom Content */}
          <div className="flex flex-col">
            <h2 className="text-white text-3xl font-bold font-['Arial']">
              {card.value}
            </h2>
            <p className="text-white/80 text-sm font-normal font-['Arial'] mt-1">
              {card.subText}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSection;
