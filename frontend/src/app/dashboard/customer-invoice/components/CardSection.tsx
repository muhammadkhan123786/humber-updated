"use client";

import React from "react";
import { Package, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import { useWatch } from "react-hook-form";

interface CardSectionProps {
  form: any;
  vatRate: number;
}

const CardSection = ({ form, vatRate }: CardSectionProps) => {
  const parts = useWatch({ control: form.control, name: "parts" }) || [];
  const services = useWatch({ control: form.control, name: "services" }) || [];

  const callOutFee =
    parseFloat(
      String(useWatch({ control: form.control, name: "callOutFee" }) || 0),
    ) || 0;

  const discountValueRaw =
    useWatch({ control: form.control, name: "discountAmount" }) || 0;

  const discountType =
    useWatch({ control: form.control, name: "discountType" }) || "Percentage";

  const isVatExempt =
    useWatch({ control: form.control, name: "isVATEXEMPT" }) || false;

  const discountValue = parseFloat(String(discountValueRaw)) || 0;

  // ===== SAFE DURATION PARSER =====
  const parseDurationToHours = (duration: any): number => {
    if (!duration) return 1;

    const durationStr = String(duration);

    if (durationStr.includes(":")) {
      const [h, m] = durationStr.split(":").map(Number);
      return (h || 0) + (m || 0) / 60;
    }

    return parseFloat(durationStr) || 1;
  };

  // ===== CALCULATIONS (MATCHING INVOICE SUMMARY) =====

  const partsSubtotal = parts.reduce(
    (acc: number, part: any) =>
      acc + (part.quantity || 0) * (part.unitCost || 0),
    0,
  );

  const labourSubtotal = services.reduce((acc: number, service: any) => {
    const hours = parseDurationToHours(service?.duration);
    return acc + hours * (service.rate || 50);
  }, 0);

  const subtotalRaw = partsSubtotal + labourSubtotal + callOutFee;

  const discountAmount =
    discountType === "Percentage"
      ? Math.round(subtotalRaw * discountValue) / 100
      : Math.round(discountValue * 100) / 100;

  const afterDiscount = subtotalRaw - discountAmount;

  const vatAmount = !isVatExempt
    ? Math.round(afterDiscount * vatRate) / 100
    : 0;

  const grandTotal = afterDiscount + vatAmount;

  const totalHours = services.reduce(
    (acc: number, service: any) =>
      acc + parseDurationToHours(service?.duration),
    0,
  );

  const formatValue = (val: number) => val.toFixed(2);

  const cards = [
    {
      title: "Parts",
      value: `£${formatValue(partsSubtotal)}`,
      subText: `${parts.length} Item(s)`,
      icon: <Package className="text-white" size={28} />,
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      title: "Labour",
      value: `£${formatValue(labourSubtotal)}`,
      subText: `${formatValue(totalHours)}h Total`,
      icon: <Clock className="text-white" size={28} />,
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    {
      title: "Subtotal",
      value: `£${formatValue(afterDiscount)}`,
      subText: "After Discount",
      icon: <DollarSign className="text-white" size={28} />,
      gradient: "bg-gradient-to-br from-amber-500 to-orange-500",
    },
    {
      title: "Total",
      value: `£${formatValue(grandTotal)}`,
      subText: "Final Amount",
      icon: <CheckCircle2 className="text-white" size={28} />,
      gradient: "bg-gradient-to-br from-[#00BC7E] to-[#00DA8E]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.gradient} w-full h-40 p-5 rounded-3xl shadow-lg flex flex-col justify-between`}
        >
          <div className="flex justify-between items-center">
            {card.icon}
            <div className="px-3 py-1 bg-white/20 rounded-[10px] border border-white/30">
              <span className="text-white text-[10px] uppercase tracking-wider">
                {card.title}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-white text-3xl font-bold">{card.value}</h2>
            <p className="text-white/80 text-sm mt-1">{card.subText}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSection;
