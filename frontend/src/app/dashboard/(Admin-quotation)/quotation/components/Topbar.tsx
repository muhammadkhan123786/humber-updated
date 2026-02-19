// "use client";
// import React from 'react'
// import { ArrowLeft, Plus } from 'lucide-react'
// import { useRouter } from 'next/navigation'

// const Topbar = () => {
//   const router = useRouter();

//   const handleCreateQuotation = () => {
//     router.push('/dashboard/qutations/create');
//   };

//   const handleBack = () => {
//     router.push('/dashboard');
//   };

//   return (
//     <div className="flex items-center justify-between py-6 px-8 bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50">
//       <div className="flex items-center gap-4">
//         <button
//           onClick={handleBack}
//           className="p-2 hover:bg-white/50 rounded-lg transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4 text-gray-700" />
//         </button>
//         <div>
//           <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//             Customer Quotations
//           </h1>
//           <p className="text-gray-600 mt-1">
//             Manage repair quotations for customers
//           </p>
//         </div>
//       </div>

//       <button
//         onClick={handleCreateQuotation}
//         className="inline-flex items-center text-white justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground hover:bg-primary/90 px-4 py-2 has-[>svg]:px-3 bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 h-11"
//       >
//         <Plus className="w-4 h-4" />
//         Create Quotation
//       </button>
//     </div>
//   )
// }

// export default Topbar
