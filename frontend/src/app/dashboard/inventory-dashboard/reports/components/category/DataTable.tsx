// import { useState } from 'react';
// import { Badge } from '../../components/common/Badge';
// import { ExportBtn } from '../../components/common/ExportBtn';
// import { Pagination } from './Pagination';

// interface DataTableProps {
//   headers: string[];
//   rows: (string | number)[][];
//   accent: string;
//   accentLight: string;
//   accentBorder: string;
//   grad: string;
//   activeTabLabel: string;
// }

// const ROWS_PER_PAGE = 5;

// export function DataTable({ headers, rows, accent, accentLight, accentBorder, grad, activeTabLabel }: DataTableProps) {
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
  
//   const filtered = rows.filter(row => 
//     row.some(cell => String(cell).toLowerCase().includes(search.toLowerCase()))
//   );
  
//   const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
//   const pageRows = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  
//   const isStatus = (value: string | number) => {
//     const statuses = ["In Stock", "Low Stock", "Out of Stock", "Received", "Pending", "Partial", "Overdue", "Approved", "Preferred", "Active", "Review"];
//     return statuses.includes(String(value));
//   };
  
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
//       {/* Table Header */}
//       <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
//         <div>
//           <h3 className="text-sm font-bold text-slate-900">Detailed Data</h3>
//           <p className="text-slate-400 text-[11px]">{filtered.length} records · {activeTabLabel}</p>
//         </div>
//         <div className="flex gap-1.5 flex-wrap">
//           <div className="relative">
//             <input
//               value={search}
//               onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//               placeholder="Search data..."
//               className="border border-slate-200 rounded-lg py-1.5 px-2 pl-7 text-xs outline-none focus:border-blue-400 transition-colors"
//             />
//             <svg className="absolute left-2 top-1/2 -translate-y-1/2" width="11" height="11" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24">
//               <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
//             </svg>
//           </div>
//           <ExportBtn label="CSV" color="#059669" bg="#ecfdf5" />
//           <ExportBtn label="Excel" color="#16a34a" bg="#f0fdf4" />
//           <ExportBtn label="PDF" color="#dc2626" bg="#fef2f2" />
//           <ExportBtn label="Print" color="#7c3aed" bg="#f5f3ff" />
//         </div>
//       </div>
      
//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-slate-50">
//               {headers.map((h) => (
//                 <th key={h} className="py-2.5 px-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wide border-b border-slate-100 whitespace-nowrap cursor-pointer">
//                   {h} <span className="text-slate-300">↕</span>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {pageRows.length === 0 ? (
//               <tr>
//                 <td colSpan={headers.length} className="py-10 text-center text-slate-400 text-xs">
//                   No records found.
//                 </td>
//               </tr>
//             ) : (
//               pageRows.map((row, ri) => (
//                 <tr key={ri} className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
//                   {row.map((cell, ci) => (
//                     <td key={ci} className="py-3 px-4 text-xs">
//                       {isStatus(cell) ? (
//                         <Badge label={String(cell)} />
//                       ) : ci === 0 ? (
//                         <span className="text-slate-600 text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-md font-mono tracking-wide">
//                           {cell}
//                         </span>
//                       ) : (
//                         <span className={`text-slate-700 ${ci > 1 ? "font-medium" : ""}`}>{cell}</span>
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
      
//       {/* Pagination */}
//       <Pagination
//         page={page}
//         totalPages={totalPages}
//         filteredLength={filtered.length}
//         rowsPerPage={ROWS_PER_PAGE}
//         onPageChange={setPage}
//         grad={grad}
//       />
//     </div>
//   );
// }