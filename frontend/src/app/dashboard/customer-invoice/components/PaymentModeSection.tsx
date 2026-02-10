"use client";
import React, { useState } from "react";
import {
  Banknote,
  Building2,
  CreditCard,
  Globe,
  QrCode,
  Clock,
  WalletCards,
  LucideIcon,
  CheckCircle2,
} from "lucide-react";

interface PaymentMode {
  id: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
  iconColor: string;
  bgColor: string;
}

const PaymentModeSection = () => {
  const [selectedId, setSelectedId] = useState<string>("Pending");

  const modes: PaymentMode[] = [
    {
      id: "Cash",
      title: "Cash",
      desc: "Cash payment",
      Icon: Banknote,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: "Transfer",
      title: "Bank Transfer",
      desc: "Direct bank deposit",
      Icon: Building2,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "Card",
      title: "Card Payment",
      desc: "Credit/Debit card",
      Icon: CreditCard,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      id: "Online",
      title: "Online Payment",
      desc: "PayPal, Stripe, etc.",
      Icon: Globe,
      iconColor: "text-cyan-600",
      bgColor: "bg-cyan-100",
    },
    {
      id: "QR",
      title: "QR Code",
      desc: "Digital wallet",
      Icon: QrCode,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      id: "Pending",
      title: "Pending",
      desc: "To be decided",
      Icon: Clock,
      iconColor: "text-slate-600",
      bgColor: "bg-slate-100",
    },
  ];

  const activeMode = modes.find((m) => m.id === selectedId);

  return (
    <div className="w-full bg-linear-to-r from-violet-50 via-purple-50 to-fuchsia-50 rounded-2xl  outline-2 -outline-offset-2 outline-violet-100 overflow-hidden font-sans">
      <div className="w-full px-6 pt-6 pb-4 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <WalletCards size={20} className="text-violet-600" />
          <h2 className="text-violet-600 text-base font-normal">
            Payment Mode
          </h2>
        </div>
        <p className="text-gray-500 text-base">
          Select how the customer will pay for this invoice
        </p>
      </div>

      {/* Responsive Grid Section */}
      <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modes.map((mode) => {
          const isActive = selectedId === mode.id;

          let activeClass = "";
          if (isActive) {
            switch (mode.id) {
              case "Cash":
                activeClass =
                  "bg-gradient-to-br from-green-500 to-emerald-500 text-white outline-green-500 shadow-lg shadow-green-500/20";
                break;
              case "Transfer":
                activeClass =
                  "bg-gradient-to-br from-blue-500 to-indigo-500 text-white outline-blue-400 shadow-lg shadow-blue-500/20";
                break;
              case "Card":
                activeClass =
                  "bg-gradient-to-br from-purple-500 to-pink-500 text-white outline-purple-400 shadow-lg shadow-purple-500/20";
                break;
              case "Online":
                activeClass =
                  "bg-gradient-to-br from-cyan-500 to-teal-500 text-white outline-cyan-400 shadow-lg shadow-cyan-500/20";
                break;
              case "QR":
                activeClass =
                  "bg-gradient-to-br from-orange-500 to-red-500 text-white outline-orange-400 shadow-lg shadow-orange-500/20";
                break;
              case "Pending":
                activeClass =
                  "bg-slate-700 text-white outline-slate-600 shadow-lg";
                break;
            }
          }

          return (
            <div
              key={mode.id}
              onClick={() => setSelectedId(mode.id)}
              className={`relative h-44 p-6 rounded-2xl  outline-2 -outline-offset-2 flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer ${
                isActive
                  ? activeClass
                  : "bg-white outline-gray-200 hover:outline-violet-200 shadow-sm"
              }`}
            >
              {isActive && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 size={20} className="text-white/90" />
                </div>
              )}

              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isActive ? "bg-white/20 scale-110" : mode.bgColor
                }`}
              >
                <mode.Icon
                  size={32}
                  className={isActive ? "text-white" : mode.iconColor}
                />
              </div>

              <div className="text-center">
                <div
                  className={`text-lg font-bold ${isActive ? "text-white" : "text-gray-900"}`}
                >
                  {mode.title}
                </div>
                <div
                  className={`text-sm ${isActive ? "text-white/80" : "text-gray-500"}`}
                >
                  {mode.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mx-6 mb-6 p-4 bg-violet-100/50 rounded-xl border border-violet-200 flex items-center gap-4">
        <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center">
          <CheckCircle2 size={20} className="text-white" />
        </div>
        <div>
          <p className="text-xs text-violet-600 font-medium">
            Selected Payment Mode:
          </p>
          <p className="text-lg font-bold text-violet-900">
            {activeMode?.title} Payment
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModeSection;
