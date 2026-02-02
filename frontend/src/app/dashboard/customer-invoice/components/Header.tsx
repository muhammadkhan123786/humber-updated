import React from "react";

const Header = () => {
  return (
    <div className="w-full max-w-[1216px] h-32 pl-8 pt-8 bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl flex flex-col justify-start items-start overflow-hidden relative">
      {/* Background Decorative Shapes (Simulating the rotated boxes in your code) */}
      <div className="absolute top-[-20px] left-[100px] w-24 h-24 rotate-[130deg] bg-white/10 rounded-2xl shadow-xl pointer-events-none" />

      <div className="w-full max-w-[1152px] h-16 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          {/* Icon Container */}
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex justify-center items-center backdrop-blur-sm">
            <div className="w-5 h-5 relative border-2 border-white rounded-sm">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white -translate-y-1/2" />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-start items-start">
            <h1 className="text-white text-4xl font-bold font-['Arial'] leading-10 drop-shadow-md">
              Customer Invoice
            </h1>
            <p className="text-white/90 text-lg font-normal font-['Arial'] leading-7">
              Create and manage customer invoices
            </p>
          </div>
        </div>

        {/* Invoice Badge */}
        <div className="px-4 py-2 mr-8 bg-white/20 rounded-[10px] border border-white/30 backdrop-blur-md flex justify-center items-center">
          <span className="text-white text-xs font-normal font-['Arial'] leading-4 tracking-wider">
            INV-2026-1136
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
