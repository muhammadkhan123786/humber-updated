// // components/reports/ProfessionalTable.tsx
// "use client";

// import { useState, useMemo } from "react";
// import { 
//   Search, Filter, X, Eye, Download, FileText, 
//   FileSpreadsheet, FileJson, Printer, Check, Copy,
//   ChevronLeft, ChevronRight, ArrowUpDown, LayoutGrid,
//   RefreshCw, Settings, ChevronUp, ChevronDown
// } from "lucide-react";

// interface ProfessionalTableProps {
//   headers: string[];
//   rows: any[][];
//   statusStyles?: Record<string, { bg: string; color: string; dot: string }>;
//   accentColor?: string;
//   accentLight?: string;
//    onExport?: (type: "csv" | "excel" | "pdf") => void;
// }

// export function ProfessionalTable({ 
//   headers = [], 
//   rows = [], 
//   statusStyles = {},
//   accentColor = "#059669",
//   accentLight = "#ecfdf5",
//   onExport,
// }: ProfessionalTableProps) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [sortConfig, setSortConfig] = useState<{ key: number; direction: "asc" | "desc" } | null>(null);
//   const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
//   const [showColumnMenu, setShowColumnMenu] = useState(false);
//   const [visibleColumns, setVisibleColumns] = useState<boolean[]>(() => headers.map(() => true));
//   const [columnFilters, setColumnFilters] = useState<Record<number, string>>({});
//   const [showFilters, setShowFilters] = useState(false);
//   const [compactView, setCompactView] = useState(false);
//   const [showExportMenu, setShowExportMenu] = useState(false);
//   const [copied, setCopied] = useState(false);

//   // Filter data based on search and column filters
//   const filteredData = useMemo(() => {
//     if (!rows.length) return [];
    
//     let result = [...rows];
    
//     // Global search
//     if (searchTerm) {
//       result = result.filter(row =>
//         row.some(cell => 
//           String(cell || '').toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//     }
    
//     // Column-specific filters
//     Object.entries(columnFilters).forEach(([colIdx, filterValue]) => {
//       if (filterValue) {
//         result = result.filter(row => 
//           row[parseInt(colIdx)] && 
//           String(row[parseInt(colIdx)]).toLowerCase().includes(filterValue.toLowerCase())
//         );
//       }
//     });
    
//     return result;
//   }, [rows, searchTerm, columnFilters]);

//   // Sort data
//   const sortedData = useMemo(() => {
//     if (!sortConfig || !filteredData.length) return filteredData;
    
//     return [...filteredData].sort((a, b) => {
//       let aVal = a[sortConfig.key];
//       let bVal = b[sortConfig.key];
      
//       // Check if values are numbers
//       const aNum = parseFloat(String(aVal).replace(/[^0-9.-]/g, ''));
//       const bNum = parseFloat(String(bVal).replace(/[^0-9.-]/g, ''));
      
//       if (!isNaN(aNum) && !isNaN(bNum)) {
//         return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
//       }
      
//       aVal = String(aVal || '').toLowerCase();
//       bVal = String(bVal || '').toLowerCase();
      
//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [filteredData, sortConfig]);

//   // Paginate data
//   const paginatedData = useMemo(() => {
//     if (!sortedData.length) return [];
//     const start = (currentPage - 1) * rowsPerPage;
//     return sortedData.slice(start, start + rowsPerPage);
//   }, [sortedData, currentPage, rowsPerPage]);

//   const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));
//   const startEntry = sortedData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
//   const endEntry = Math.min(currentPage * rowsPerPage, sortedData.length);

//   // Handle sort
//   const handleSort = (colIndex: number) => {
//     setSortConfig(prev => ({
//       key: colIndex,
//       direction: prev?.key === colIndex && prev.direction === "asc" ? "desc" : "asc",
//     }));
//   };

//   // Handle row selection
//   const toggleRowSelection = (index: number) => {
//     const newSelected = new Set(selectedRows);
//     if (newSelected.has(index)) {
//       newSelected.delete(index);
//     } else {
//       newSelected.add(index);
//     }
//     setSelectedRows(newSelected);
//   };

//   const selectAllRows = () => {
//     if (selectedRows.size === paginatedData.length && paginatedData.length > 0) {
//       setSelectedRows(new Set());
//     } else {
//       setSelectedRows(new Set(paginatedData.map((_, i) => i)));
//     }
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setSearchTerm("");
//     setColumnFilters({});
//     setCurrentPage(1);
//   };

//   const hasActiveFilters = searchTerm || Object.keys(columnFilters).length > 0;

//   // Export functions
//   const exportToCSV = () => {
//     if (!headers.length || !sortedData.length) return;
    
//     const visibleHeaders = headers.filter((_, i) => visibleColumns[i]);
//     const csvRows = [
//       visibleHeaders.join(","),
//       ...sortedData.map(row => 
//         row.filter((_, i) => visibleColumns[i])
//           .map(cell => {
//             const str = String(cell || '');
//             return str.includes(",") ? `"${str}"` : str;
//           }).join(",")
//       )
//     ];
    
//     const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `table-export-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//     setShowExportMenu(false);
//   };

//   const exportToExcel = async () => {
//     if (!headers.length || !sortedData.length) return;
    
//     const XLSX = await import('xlsx');
//     const visibleHeaders = headers.filter((_, i) => visibleColumns[i]);
//     const worksheetData = sortedData.map(row => {
//       const obj: any = {};
//       visibleHeaders.forEach((header, idx) => {
//         const originalIdx = headers.findIndex(h => h === header);
//         obj[header] = row[originalIdx] || '';
//       });
//       return obj;
//     });
    
//     const ws = XLSX.utils.json_to_sheet(worksheetData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Data Export");
//     XLSX.writeFile(wb, `export-${new Date().toISOString().split('T')[0]}.xlsx`);
//     setShowExportMenu(false);
//   };

//   const exportToPDF = async () => {
//     if (!headers.length || !sortedData.length) return;
    
//     const jsPDF = await import('jspdf');
//     const autoTable = await import('jspdf-autotable');
//     const doc = new jsPDF.default({ orientation: 'landscape' });
    
//     const visibleHeaders = headers.filter((_, i) => visibleColumns[i]);
//     const tableData = sortedData.map(row => 
//       row.filter((_, i) => visibleColumns[i]).map(cell => String(cell || ''))
//     );
    
//     doc.text('Data Export Report', 14, 15);
//     doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);
//     doc.text(`Total Records: ${sortedData.length}`, 14, 35);
    
//     autoTable.default(doc, {
//       head: [visibleHeaders],
//       body: tableData,
//       startY: 45,
//       theme: 'striped',
//       styles: { fontSize: 8, cellPadding: 2 },
//       headStyles: { fillColor: [59, 130, 246], textColor: 255, fontSize: 9, fontStyle: 'bold' },
//       // alternateRowStyles: { fillColor: [248, 250, 252] },
//     });
    
//     doc.save(`export-${new Date().toISOString().split('T')[0]}.pdf`);
//     setShowExportMenu(false);
//   };

//   const printReport = () => {
//     if (!headers.length || !sortedData.length) return;
    
//     const printWindow = window.open('', '_blank');
//     if (!printWindow) return;
    
//     const visibleHeaders = headers.filter((_, i) => visibleColumns[i]);
//     const tableHtml = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Data Export Report</title>
//           <style>
//             * { margin: 0; padding: 0; box-sizing: border-box; }
//             body { 
//               font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//               margin: 40px;
//               background: white;
//             }
//             .header { margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
//             h1 { color: #1e293b; font-size: 24px; margin-bottom: 8px; }
//             .meta { color: #64748b; font-size: 12px; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
//             th { background: #3b82f6; color: white; padding: 12px 8px; text-align: left; font-weight: 600; }
//             td { padding: 8px; border-bottom: 1px solid #e2e8f0; color: #334155; }
//             tr:hover { background: #f8fafc; }
//             @media print { body { margin: 0; padding: 20px; } }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>Data Export Report</h1>
//             <div class="meta">Generated: ${new Date().toLocaleString()}</div>
//             <div class="meta">Total Records: ${sortedData.length}</div>
//           </div>
//           <table>
//             <thead><tr>${visibleHeaders.map(h => `<th>${h}</th>`).join('')}</tr></thead>
//             <tbody>
//               ${sortedData.map(row => `
//                 <tr>${row.filter((_, i) => visibleColumns[i]).map(cell => `<td>${cell || ''}</td>`).join('')}</tr>
//               `).join('')}
//             </tbody>
//           </table>
//         </body>
//       </html>
//     `;
    
//     printWindow.document.write(tableHtml);
//     printWindow.document.close();
//     printWindow.print();
//     setShowExportMenu(false);
//   };

//   const copyToClipboard = async () => {
//     if (!headers.length || !sortedData.length) return;
    
//     const visibleHeaders = headers.filter((_, i) => visibleColumns[i]);
//     const rows = sortedData.map(row => 
//       row.filter((_, i) => visibleColumns[i]).join("\t")
//     );
//     const text = [visibleHeaders.join("\t"), ...rows].join("\n");
//     await navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//     setShowExportMenu(false);
//   };

//   // Render cell with proper formatting
//   const renderCell = (value: any, colIndex: number) => {
//     const strValue = String(value || '');
//     const isStatus = statusStyles[strValue];
    
//     if (isStatus) {
//       return (
//         <span style={{
//           display: "inline-flex",
//           alignItems: "center",
//           gap: "5px",
//           background: isStatus.bg,
//           color: isStatus.color,
//           padding: "3px 10px",
//           borderRadius: "20px",
//           fontSize: "11px",
//           fontWeight: "600",
//           whiteSpace: "nowrap"
//         }}>
//           <span style={{
//             width: 6,
//             height: 6,
//             borderRadius: "50%",
//             background: isStatus.dot,
//             display: "inline-block"
//           }} />
//           {value}
//         </span>
//       );
//     }
    
//     // SKU-like values
//     if (colIndex === 0 && typeof value === 'string' && (value.includes('-') || value.startsWith('PO-'))) {
//       return (
//         <span style={{
//           color: "#475569",
//           fontSize: "10px",
//           fontWeight: "700",
//           background: "#f1f5f9",
//           padding: "3px 8px",
//           borderRadius: "6px",
//           fontFamily: "monospace",
//           letterSpacing: "0.3px"
//         }}>
//           {value}
//         </span>
//       );
//     }
    
//     // Currency values
//     if (typeof value === 'string' && (value.startsWith('$') || value.includes('M') || value.includes('K') || value.includes('★'))) {
//       return (
//         <span style={{
//           color: "#059669",
//           fontWeight: "600",
//           fontFamily: "monospace"
//         }}>
//           {value}
//         </span>
//       );
//     }
    
//     // Numbers
//     if (typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value))) {
//       return (
//         <span style={{
//           fontFamily: "monospace",
//           fontWeight: "500",
//           color: "#334155"
//         }}>
//           {typeof value === 'number' ? value.toLocaleString() : value}
//         </span>
//       );
//     }
    
//     return <span style={{ color: "#374151" }}>{value || '-'}</span>;
//   };

//   // If no data, show empty state
//   if (!headers.length || !rows.length) {
//     return (
//       <div style={{
//         background: "#fff",
//         borderRadius: "20px",
//         padding: "60px",
//         textAlign: "center",
//         border: "1px solid #f1f5f9"
//       }}>
//         <div style={{
//           width: "48px",
//           height: "48px",
//           background: "#f1f5f9",
//           borderRadius: "50%",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           margin: "0 auto 16px"
//         }}>
//           <LayoutGrid size={20} color="#94a3b8" />
//         </div>
//         <p style={{ color: "#94a3b8", fontSize: "13px" }}>No data available</p>
//       </div>
//     );
//   }

//   return (
//     <div style={{
//       background: "#fff",
//       borderRadius: "20px",
//       boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
//       border: "1px solid #f1f5f9",
//       overflow: "hidden"
//     }}>
//       {/* Table Header with Controls */}
//       <div style={{
//         padding: "16px 20px",
//         borderBottom: "1px solid #f1f5f9",
//         background: "#fafcff"
//       }}>
//         <div style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           flexWrap: "wrap",
//           gap: "12px"
//         }}>
//           {/* Left side - Title and stats */}
//           <div>
//             <h3 style={{
//               fontSize: "14px",
//               fontWeight: "700",
//               color: "#0f172a",
//               margin: 0,
//               display: "flex",
//               alignItems: "center",
//               gap: "8px"
//             }}>
//               <LayoutGrid size={14} style={{ color: accentColor }} />
//               Data Records
//             </h3>
//             <p style={{ color: "#94a3b8", fontSize: "11px", margin: "2px 0 0" }}>
//               {sortedData.length} records found
//             </p>
//           </div>
          
//           {/* Right side - Controls */}
//           <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//             {/* Search */}
//             <div style={{ position: "relative" }}>
//               <Search size={12} style={{
//                 position: "absolute",
//                 left: "10px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 color: "#94a3b8"
//               }} />
//               <input
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 placeholder="Search..."
//                 style={{
//                   background: "#fff",
//                   border: "1px solid #e2e8f0",
//                   borderRadius: "10px",
//                   padding: "6px 10px 6px 28px",
//                   fontSize: "12px",
//                   width: "160px",
//                   outline: "none"
//                 }}
//               />
//             </div>
            
//             {/* Filter Toggle */}
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               style={{
//                 background: showFilters ? accentLight : "#fff",
//                 border: `1px solid ${showFilters ? accentColor : "#e2e8f0"}`,
//                 borderRadius: "10px",
//                 padding: "6px 10px",
//                 fontSize: "11px",
//                 color: showFilters ? accentColor : "#64748b",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "5px"
//               }}
//             >
//               <Filter size={11} />
//               Filter
//               {hasActiveFilters && (
//                 <span style={{
//                   background: accentColor,
//                   color: "#fff",
//                   borderRadius: "10px",
//                   padding: "1px 5px",
//                   fontSize: "9px"
//                 }}>
//                   {Object.keys(columnFilters).length + (searchTerm ? 1 : 0)}
//                 </span>
//               )}
//             </button>
            
//             {/* Column Visibility */}
//             <div style={{ position: "relative" }}>
//               <button
//                 onClick={() => setShowColumnMenu(!showColumnMenu)}
//                 style={{
//                   background: "#fff",
//                   border: "1px solid #e2e8f0",
//                   borderRadius: "10px",
//                   padding: "6px 10px",
//                   fontSize: "11px",
//                   color: "#64748b",
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "5px"
//                 }}
//               >
//                 <Settings size={11} />
//                 Columns
//               </button>
              
//               {showColumnMenu && (
//                 <div style={{
//                   position: "absolute",
//                   top: "100%",
//                   right: 0,
//                   marginTop: "8px",
//                   background: "#fff",
//                   borderRadius: "12px",
//                   boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//                   border: "1px solid #e2e8f0",
//                   zIndex: 20,
//                   minWidth: "180px",
//                   maxHeight: "300px",
//                   overflowY: "auto"
//                 }}>
//                   <div style={{ padding: "8px 0" }}>
//                     {headers.map((header, idx) => (
//                       <label
//                         key={idx}
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "8px",
//                           padding: "6px 14px",
//                           cursor: "pointer",
//                           fontSize: "11px",
//                           color: "#334155"
//                         }}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={visibleColumns[idx]}
//                           onChange={() => {
//                             const newVisible = [...visibleColumns];
//                             newVisible[idx] = !newVisible[idx];
//                             setVisibleColumns(newVisible);
//                           }}
//                           style={{ accentColor: accentColor }}
//                         />
//                         {header}
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             {/* View Toggle */}
//             <button
//               onClick={() => setCompactView(!compactView)}
//               style={{
//                 background: "#fff",
//                 border: "1px solid #e2e8f0",
//                 borderRadius: "10px",
//                 padding: "6px 10px",
//                 fontSize: "11px",
//                 color: "#64748b",
//                 cursor: "pointer"
//               }}
//             >
//               {compactView ? "Comfortable" : "Compact"}
//             </button>
            
//             {/* Export Dropdown */}
//             <div style={{ position: "relative" }}>
//               <button
//                 onClick={() => setShowExportMenu(!showExportMenu)}
//                 style={{
//                   background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
//                   border: "none",
//                   borderRadius: "10px",
//                   padding: "6px 14px",
//                   fontSize: "11px",
//                   fontWeight: "600",
//                   color: "#fff",
//                   cursor: "pointer",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "5px"
//                 }}
//               >
//                 <Download size={11} />
//                 Export
//               </button>
              
//               {showExportMenu && (
//                 <div style={{
//                   position: "absolute",
//                   top: "100%",
//                   right: 0,
//                   marginTop: "8px",
//                   background: "#fff",
//                   borderRadius: "12px",
//                   boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
//                   border: "1px solid #e2e8f0",
//                   zIndex: 20,
//                   minWidth: "170px",
//                   overflow: "hidden"
//                 }}>
//                   <div style={{ padding: "6px 0" }}>
//                     <button onClick={exportToCSV} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer", fontSize: "11px", color: "#334155" }}>
//                       <FileText size={12} style={{ color: "#059669" }} /> CSV
//                     </button>
//                     <button onClick={exportToExcel} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer", fontSize: "11px", color: "#334155" }}>
//                       <FileSpreadsheet size={12} style={{ color: "#16a34a" }} /> Excel
//                     </button>
//                     <button onClick={() => onExport?.("pdf")} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer", fontSize: "11px", color: "#334155" }}>
//                       <FileJson size={12} style={{ color: "#dc2626" }} /> PDF
//                     </button>
//                     <button onClick={printReport} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer", fontSize: "11px", color: "#334155" }}>
//                       <Printer size={12} style={{ color: "#7c3aed" }} /> Print
//                     </button>
//                     <div style={{ borderTop: "1px solid #e2e8f0", margin: "4px 0" }} />
//                     <button onClick={copyToClipboard} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer", fontSize: "11px", color: "#334155" }}>
//                       <Copy size={12} /> {copied ? "Copied!" : "Copy"}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             {/* Clear Filters */}
//             {hasActiveFilters && (
//               <button
//                 onClick={clearFilters}
//                 style={{
//                   background: "transparent",
//                   border: "1px solid #e2e8f0",
//                   borderRadius: "10px",
//                   padding: "6px 10px",
//                   fontSize: "11px",
//                   color: "#ef4444",
//                   cursor: "pointer"
//                 }}
//               >
//                 <RefreshCw size={11} />
//                 Clear
//               </button>
//             )}
//           </div>
//         </div>
        
//         {/* Advanced Filters Panel */}
//         {showFilters && headers.length > 0 && (
//           <div style={{
//             marginTop: "14px",
//             paddingTop: "14px",
//             borderTop: "1px solid #f1f5f9",
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
//             gap: "10px"
//           }}>
//             {headers.slice(0, 5).map((header, idx) => (
//               <div key={idx}>
//                 <label style={{ fontSize: "9px", fontWeight: 600, color: "#64748b", marginBottom: "3px", display: "block" }}>
//                   {header}
//                 </label>
//                 <input
//                   value={columnFilters[idx] || ""}
//                   onChange={(e) => {
//                     setColumnFilters(prev => ({ ...prev, [idx]: e.target.value }));
//                     setCurrentPage(1);
//                   }}
//                   placeholder={`Filter ${header}...`}
//                   style={{
//                     width: "100%",
//                     padding: "5px 8px",
//                     fontSize: "10px",
//                     border: "1px solid #e2e8f0",
//                     borderRadius: "8px",
//                     outline: "none"
//                   }}
//                 />
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
      
//       {/* Selected Rows Bar */}
//       {selectedRows.size > 0 && (
//         <div style={{
//           background: accentLight,
//           padding: "8px 20px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           borderBottom: `1px solid ${accentColor}22`
//         }}>
//           <span style={{ fontSize: "11px", color: accentColor, fontWeight: 500 }}>
//             {selectedRows.size} row(s) selected
//           </span>
//           <button onClick={() => setSelectedRows(new Set())} style={{ background: "transparent", border: "none", color: accentColor, fontSize: "10px", cursor: "pointer" }}>
//             Clear
//           </button>
//         </div>
//       )}
      
//       {/* Table */}
//       <div style={{ overflowX: "auto" }}>
//         <table style={{ width: "100%", borderCollapse: "collapse", fontSize: compactView ? "11px" : "12px" }}>
//           <thead>
//             <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
//               <th style={{ padding: compactView ? "8px 12px" : "10px 16px", width: "30px" }}>
//                 <input
//                   type="checkbox"
//                   checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
//                   onChange={selectAllRows}
//                   style={{ accentColor: accentColor, cursor: "pointer" }}
//                 />
//               </th>
//               {headers.map((header, idx) => visibleColumns[idx] && (
//                 <th
//                   key={idx}
//                   onClick={() => handleSort(idx)}
//                   style={{
//                     padding: compactView ? "8px 12px" : "10px 16px",
//                     textAlign: "left",
//                     fontSize: "10px",
//                     fontWeight: 700,
//                     color: "#64748b",
//                     textTransform: "uppercase",
//                     letterSpacing: "0.5px",
//                     whiteSpace: "nowrap",
//                     cursor: "pointer"
//                   }}
//                 >
//                   <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
//                     {header}
//                     <ArrowUpDown size={10} style={{ opacity: sortConfig?.key === idx ? 1 : 0.3 }} />
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedData.length === 0 ? (
//               <tr>
//                 <td colSpan={visibleColumns.filter(v => v).length + 1} style={{ padding: "50px", textAlign: "center", color: "#94a3b8" }}>
//                   No matching records found
//                 </td>
//               </tr>
//             ) : (
//               paginatedData.map((row, rowIdx) => (
//                 <tr
//                   key={rowIdx}
//                   style={{
//                     borderBottom: "1px solid #f8fafc",
//                     background: selectedRows.has(rowIdx) ? accentLight : "transparent"
//                   }}
//                   onMouseEnter={(e) => { if (!selectedRows.has(rowIdx)) e.currentTarget.style.background = "#fafcff"; }}
//                   onMouseLeave={(e) => { if (!selectedRows.has(rowIdx)) e.currentTarget.style.background = ""; }}
//                 >
//                   <td style={{ padding: compactView ? "8px 12px" : "10px 16px", textAlign: "center" }}>
//                     <input
//                       type="checkbox"
//                       checked={selectedRows.has(rowIdx)}
//                       onChange={() => toggleRowSelection(rowIdx)}
//                       style={{ accentColor: accentColor, cursor: "pointer" }}
//                     />
//                   </td>
//                   {row.map((cell, colIdx) => visibleColumns[colIdx] && (
//                     <td key={colIdx} style={{ padding: compactView ? "8px 12px" : "10px 16px" }}>
//                       {renderCell(cell, colIdx)}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
      
//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div style={{
//           padding: "12px 20px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           borderTop: "1px solid #f1f5f9",
//           flexWrap: "wrap",
//           gap: "10px",
//           background: "#fafcff"
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <span style={{ fontSize: "11px", color: "#94a3b8" }}>
//               {startEntry}–{endEntry} of {sortedData.length}
//             </span>
//             <select
//               value={rowsPerPage}
//               onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
//               style={{ fontSize: "10px", padding: "3px 6px", border: "1px solid #e2e8f0", borderRadius: "6px" }}
//             >
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//               <option value={50}>50</option>
//               <option value={100}>100</option>
//             </select>
//           </div>
          
//           <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
//             <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style={{ padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: "6px", background: "#fff", fontSize: "10px", cursor: currentPage === 1 ? "default" : "pointer", opacity: currentPage === 1 ? 0.5 : 1 }}>
//               <ChevronLeft size={10} /><ChevronLeft size={10} style={{ marginLeft: "-4px" }} />
//             </button>
//             <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: "6px", background: "#fff", fontSize: "10px", cursor: currentPage === 1 ? "default" : "pointer", opacity: currentPage === 1 ? 0.5 : 1 }}>
//               <ChevronLeft size={10} />
//             </button>
            
//             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//               let pageNum: number;
//               if (totalPages <= 5) pageNum = i + 1;
//               else if (currentPage <= 3) pageNum = i + 1;
//               else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
//               else pageNum = currentPage - 2 + i;
              
//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => setCurrentPage(pageNum)}
//                   style={{
//                     padding: "4px 10px",
//                     border: currentPage === pageNum ? "none" : "1px solid #e2e8f0",
//                     borderRadius: "6px",
//                     background: currentPage === pageNum ? `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)` : "#fff",
//                     color: currentPage === pageNum ? "#fff" : "#374151",
//                     fontSize: "10px",
//                     fontWeight: currentPage === pageNum ? 600 : 400,
//                     cursor: "pointer"
//                   }}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
            
//             <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: "6px", background: "#fff", fontSize: "10px", cursor: currentPage === totalPages ? "default" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1 }}>
//               <ChevronRight size={10} />
//             </button>
//             <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} style={{ padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: "6px", background: "#fff", fontSize: "10px", cursor: currentPage === totalPages ? "default" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1 }}>
//               <ChevronRight size={10} /><ChevronRight size={10} style={{ marginLeft: "-4px" }} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




// components/reports/ProfessionalTable.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Search, Filter, X, Download, FileText,
  FileSpreadsheet, FileJson, Printer, Copy, Check,
  ChevronLeft, ChevronRight, ArrowUpDown, LayoutGrid,
  RefreshCw, Settings, Calendar, Loader2,
} from "lucide-react";

interface ProfessionalTableProps {
  headers:        string[];
  rows:           any[][];
  statusStyles?:  Record<string, { bg: string; color: string; dot: string }>;
  accentColor?:   string;
  accentLight?:   string;
  // Date range — controlled from parent (feeds backend via hook)
  dateRange?:           { start: string; end: string };
  onDateRangeChange?:   (start: string, end: string) => void;
  // Export — all three formats go to backend when provided
  onExport?:     (type: "csv" | "excel" | "pdf") => void;
  isExporting?:  boolean;
  // Show a subtle "refreshing" indicator when isFetching but not isLoading
  isFetching?:   boolean;
}

export function ProfessionalTable({
  headers        = [],
  rows           = [],
  statusStyles   = {},
  accentColor    = "#059669",
  accentLight    = "#ecfdf5",
  dateRange      = { start: "", end: "" },
  onDateRangeChange,
  onExport,
  isExporting    = false,
  isFetching     = false,
}: ProfessionalTableProps) {

  // ── Local UI state ────────────────────────────────────────────────────────
  const [localSearch,      setLocalSearch]      = useState("");
  const [currentPage,      setCurrentPage]      = useState(1);
  const [rowsPerPage,      setRowsPerPage]      = useState(10);
  const [sortConfig,       setSortConfig]       = useState<{ key: number; direction: "asc" | "desc" } | null>(null);
  const [selectedRows,     setSelectedRows]     = useState<Set<number>>(new Set());
  const [showColumnMenu,   setShowColumnMenu]   = useState(false);
  const [visibleColumns,   setVisibleColumns]   = useState<boolean[]>(() => headers.map(() => true));
  const [columnFilters,    setColumnFilters]    = useState<Record<number, string>>({});
  const [showFilters,      setShowFilters]      = useState(false);
  const [compactView,      setCompactView]      = useState(false);
  const [showExportMenu,   setShowExportMenu]   = useState(false);
  const [copied,           setCopied]           = useState(false);

  // ── Local filter on the already-loaded rows ───────────────────────────────
  const filteredData = useMemo(() => {
    if (!rows.length) return [];
    let result = [...rows];

    if (localSearch) {
      result = result.filter(row =>
        row.some(cell => String(cell ?? "").toLowerCase().includes(localSearch.toLowerCase()))
      );
    }

    Object.entries(columnFilters).forEach(([colIdx, val]) => {
      if (val) {
        result = result.filter(row =>
          String(row[parseInt(colIdx)] ?? "").toLowerCase().includes(val.toLowerCase())
        );
      }
    });

    return result;
  }, [rows, localSearch, columnFilters]);

  // ── Sort ──────────────────────────────────────────────────────────────────
  const sortedData = useMemo(() => {
    if (!sortConfig || !filteredData.length) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aNum = parseFloat(String(a[sortConfig.key]).replace(/[^0-9.-]/g, ""));
      const bNum = parseFloat(String(b[sortConfig.key]).replace(/[^0-9.-]/g, ""));
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
      }
      const aStr = String(a[sortConfig.key] ?? "").toLowerCase();
      const bStr = String(b[sortConfig.key] ?? "").toLowerCase();
      if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === "asc" ?  1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // ── Paginate ──────────────────────────────────────────────────────────────
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages  = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));
  const startEntry  = sortedData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endEntry    = Math.min(currentPage * rowsPerPage, sortedData.length);

  const handleSort = (colIndex: number) => {
    setSortConfig(prev => ({
      key:       colIndex,
      direction: prev?.key === colIndex && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // ── Row selection ─────────────────────────────────────────────────────────
  const toggleRow    = (i: number) => {
    const next = new Set(selectedRows);
    next.has(i) ? next.delete(i) : next.add(i);
    setSelectedRows(next);
  };
  const selectAll    = () => {
    if (selectedRows.size === paginatedData.length && paginatedData.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((_, i) => i)));
    }
  };
  const clearFilters = () => { setLocalSearch(""); setColumnFilters({}); setCurrentPage(1); };

  const hasActiveFilters   = localSearch || Object.keys(columnFilters).length > 0;
  const hasActiveDateRange = dateRange.start || dateRange.end;

  // ── Copy to clipboard ─────────────────────────────────────────────────────
  const copyToClipboard = async () => {
    const vis  = headers.filter((_, i) => visibleColumns[i]);
    const text = [
      vis.join("\t"),
      ...sortedData.map(r => r.filter((_, i) => visibleColumns[i]).join("\t")),
    ].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowExportMenu(false);
  };

  // ── Print ─────────────────────────────────────────────────────────────────
  const printReport = () => {
    const vis   = headers.filter((_, i) => visibleColumns[i]);
    const win   = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Report</title>
      <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;margin:32px}
      h1{font-size:18px;margin-bottom:8px;color:#1e293b}table{width:100%;border-collapse:collapse;font-size:11px}
      th{background:#3b82f6;color:#fff;padding:8px;text-align:left}td{padding:6px 8px;border-bottom:1px solid #e2e8f0}
      </style></head><body>
      <h1>Report — ${new Date().toLocaleString()}</h1>
      <table><thead><tr>${vis.map(h => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${sortedData.map(r => `<tr>${r.filter((_, i) => visibleColumns[i]).map(c => `<td>${c ?? ""}</td>`).join("")}</tr>`).join("")}
      </tbody></table></body></html>`);
    win.document.close();
    win.print();
    setShowExportMenu(false);
  };

  // ── Cell renderer ─────────────────────────────────────────────────────────
  const renderCell = (value: any, colIndex: number) => {
    const str      = String(value ?? "");
    const isStatus = statusStyles[str];

    if (isStatus) return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: isStatus.bg, color: isStatus.color,
        padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: isStatus.dot, display: "inline-block" }} />
        {str}
      </span>
    );

    if (colIndex === 0 && typeof value === "string" && /[-/]/.test(value)) return (
      <span style={{
        color: "#475569", fontSize: 10, fontWeight: 700,
        background: "#f1f5f9", padding: "3px 8px", borderRadius: 6, fontFamily: "monospace",
      }}>
        {str}
      </span>
    );

    if (typeof value === "string" && (value.startsWith("$") || /[KM]/.test(value))) return (
      <span style={{ color: "#059669", fontWeight: 600, fontFamily: "monospace" }}>{str}</span>
    );

    if (typeof value === "number" || /^\d+$/.test(str)) return (
      <span style={{ fontFamily: "monospace", fontWeight: 500, color: "#334155" }}>
        {typeof value === "number" ? value.toLocaleString() : str}
      </span>
    );

    return <span style={{ color: "#374151" }}>{str || "—"}</span>;
  };

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!headers.length || !rows.length) return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: 60,
      textAlign: "center", border: "1px solid #f1f5f9",
    }}>
      <LayoutGrid size={24} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
      <p style={{ color: "#94a3b8", fontSize: 13 }}>No data available</p>
    </div>
  );

  // ── Export button label ───────────────────────────────────────────────────
  const exportLabel = isExporting ? "Exporting…" : "Export";

  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      border: "1px solid #f1f5f9", overflow: "hidden",
    }}>

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", background: "#fafcff" }}>
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          {/* Left: title + fetch indicator */}
          <div>
            <h3 style={{
              fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <LayoutGrid size={14} style={{ color: accentColor }} />
              Data Records
              {isFetching && (
                <Loader2 size={13} style={{ color: accentColor, animation: "spin 1s linear infinite" }} />
              )}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: 11, margin: "2px 0 0" }}>
              {sortedData.length} records
            </p>
          </div>

          {/* Right: controls */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>

            {/* Local search (filters loaded rows) */}
            <div style={{ position: "relative" }}>
              <Search size={12} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                value={localSearch}
                onChange={(e) => { setLocalSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Filter rows…"
                style={{
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
                  padding: "6px 10px 6px 28px", fontSize: 12, width: 160, outline: "none",
                }}
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                background: showFilters ? accentLight : "#fff",
                border: `1px solid ${showFilters ? accentColor : "#e2e8f0"}`,
                borderRadius: 10, padding: "6px 10px", fontSize: 11,
                color: showFilters ? accentColor : "#64748b", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <Filter size={11} />
              Filters
              {hasActiveFilters && (
                <span style={{
                  background: accentColor, color: "#fff",
                  borderRadius: 10, padding: "1px 5px", fontSize: 9,
                }}>
                  {Object.keys(columnFilters).length + (localSearch ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Column visibility */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowColumnMenu(!showColumnMenu)}
                style={{
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
                  padding: "6px 10px", fontSize: 11, color: "#64748b", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                }}
              >
                <Settings size={11} /> Columns
              </button>
              {showColumnMenu && (
                <div style={{
                  position: "absolute", top: "100%", right: 0, marginTop: 8,
                  background: "#fff", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  border: "1px solid #e2e8f0", zIndex: 20, minWidth: 180, maxHeight: 280, overflowY: "auto",
                }}>
                  <div style={{ padding: "6px 0" }}>
                    {headers.map((h, idx) => (
                      <label key={idx} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "6px 14px", cursor: "pointer", fontSize: 11, color: "#334155",
                      }}>
                        <input
                          type="checkbox" checked={visibleColumns[idx]}
                          onChange={() => {
                            const next = [...visibleColumns];
                            next[idx] = !next[idx];
                            setVisibleColumns(next);
                          }}
                          style={{ accentColor }}
                        />
                        {h}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Compact / comfortable toggle */}
            <button
              onClick={() => setCompactView(!compactView)}
              style={{
                background: "#fff", border: "1px solid #e2e8f0",
                borderRadius: 10, padding: "6px 10px", fontSize: 11, color: "#64748b", cursor: "pointer",
              }}
            >
              {compactView ? "Comfortable" : "Compact"}
            </button>

            {/* Export dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => !isExporting && setShowExportMenu(!showExportMenu)}
                disabled={isExporting}
                style={{
                  background: `linear-gradient(135deg,${accentColor},${accentColor}CC)`,
                  border: "none", borderRadius: 10, padding: "6px 14px",
                  fontSize: 11, fontWeight: 600, color: "#fff",
                  cursor: isExporting ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                  opacity: isExporting ? 0.7 : 1,
                }}
              >
                {isExporting
                  ? <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} />
                  : <Download size={11} />
                }
                {exportLabel}
              </button>

              {showExportMenu && !isExporting && (
                <div style={{
                  position: "absolute", top: "100%", right: 0, marginTop: 8,
                  background: "#fff", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  border: "1px solid #e2e8f0", zIndex: 20, minWidth: 170, overflow: "hidden",
                }}>
                  <div style={{ padding: "6px 0" }}>
                    {(["csv", "excel", "pdf"] as const).map(fmt => (
                      <button
                        key={fmt}
                        onClick={() => { onExport?.(fmt); setShowExportMenu(false); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 8,
                          width: "100%", padding: "8px 14px",
                          background: "transparent", border: "none",
                          cursor: "pointer", fontSize: 11, color: "#334155",
                        }}
                      >
                        {fmt === "csv"   && <FileText size={12} style={{ color: "#059669" }} />}
                        {fmt === "excel" && <FileSpreadsheet size={12} style={{ color: "#16a34a" }} />}
                        {fmt === "pdf"   && <FileJson size={12} style={{ color: "#dc2626" }} />}
                        {fmt.toUpperCase()}
                      </button>
                    ))}
                    <div style={{ borderTop: "1px solid #e2e8f0", margin: "4px 0" }} />
                    <button
                      onClick={printReport}
                      style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer", fontSize: 11, color: "#334155" }}
                    >
                      <Printer size={12} style={{ color: "#7c3aed" }} /> Print
                    </button>
                    <button
                      onClick={copyToClipboard}
                      style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 14px", background: "transparent", border: "none", cursor: "pointer", fontSize: 11, color: "#334155" }}
                    >
                      <Copy size={12} /> {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Clear filters */}
            {(hasActiveFilters || hasActiveDateRange) && (
              <button
                onClick={() => {
                  clearFilters();
                  onDateRangeChange?.("", "");
                }}
                style={{
                  background: "transparent", border: "1px solid #e2e8f0",
                  borderRadius: 10, padding: "6px 10px",
                  fontSize: 11, color: "#ef4444", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 4,
                }}
              >
                <RefreshCw size={11} /> Clear all
              </button>
            )}
          </div>
        </div>

        {/* ── Filters panel ──────────────────────────────────────────────── */}
        {showFilters && (
          <div style={{
            marginTop: 14, paddingTop: 14, borderTop: "1px solid #f1f5f9",
            display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end",
          }}>

            {/* ── Date range ── goes to backend via onDateRangeChange ─────── */}
            <div>
              <label style={{ fontSize: 9, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Date range
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Calendar size={12} style={{ color: "#94a3b8" }} />
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => onDateRangeChange?.(e.target.value, dateRange.end)}
                  style={{
                    border: "1px solid #e2e8f0", borderRadius: 8,
                    padding: "5px 8px", fontSize: 11, outline: "none", color: "#334155",
                    background: dateRange.start ? accentLight : "#fff",
                  }}
                />
                <span style={{ fontSize: 11, color: "#94a3b8" }}>–</span>
                <input
                  type="date"
                  value={dateRange.end}
                  min={dateRange.start || undefined}
                  onChange={(e) => onDateRangeChange?.(dateRange.start, e.target.value)}
                  style={{
                    border: "1px solid #e2e8f0", borderRadius: 8,
                    padding: "5px 8px", fontSize: 11, outline: "none", color: "#334155",
                    background: dateRange.end ? accentLight : "#fff",
                  }}
                />
                {hasActiveDateRange && (
                  <button
                    onClick={() => onDateRangeChange?.("", "")}
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", padding: 2 }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              {hasActiveDateRange && (
                <p style={{ fontSize: 9, color: accentColor, margin: "3px 0 0", fontWeight: 600 }}>
                  ↑ Applied server-side
                </p>
              )}
            </div>

            {/* Column-specific text filters */}
            {headers.slice(0, 4).map((h, idx) => (
              <div key={idx}>
                <label style={{ fontSize: 9, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {h}
                </label>
                <input
                  value={columnFilters[idx] ?? ""}
                  onChange={(e) => { setColumnFilters(prev => ({ ...prev, [idx]: e.target.value })); setCurrentPage(1); }}
                  placeholder={`Filter…`}
                  style={{ padding: "5px 8px", fontSize: 11, border: "1px solid #e2e8f0", borderRadius: 8, outline: "none", width: 120 }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Selection bar ─────────────────────────────────────────────────── */}
      {selectedRows.size > 0 && (
        <div style={{
          background: accentLight, padding: "8px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${accentColor}22`,
        }}>
          <span style={{ fontSize: 11, color: accentColor, fontWeight: 500 }}>
            {selectedRows.size} row(s) selected
          </span>
          <button onClick={() => setSelectedRows(new Set())} style={{ background: "transparent", border: "none", color: accentColor, fontSize: 10, cursor: "pointer" }}>
            Clear
          </button>
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: compactView ? 11 : 12 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
              <th style={{ padding: compactView ? "8px 12px" : "10px 16px", width: 30 }}>
                <input
                  type="checkbox"
                  checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                  onChange={selectAll}
                  style={{ accentColor, cursor: "pointer" }}
                />
              </th>
              {headers.map((h, idx) => visibleColumns[idx] && (
                <th
                  key={idx}
                  onClick={() => handleSort(idx)}
                  style={{
                    padding: compactView ? "8px 12px" : "10px 16px",
                    textAlign: "left", fontSize: 10, fontWeight: 700, color: "#64748b",
                    textTransform: "uppercase", letterSpacing: "0.5px",
                    whiteSpace: "nowrap", cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {h}
                    <ArrowUpDown size={10} style={{ opacity: sortConfig?.key === idx ? 1 : 0.3 }} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.filter(Boolean).length + 1}
                  style={{ padding: 50, textAlign: "center", color: "#94a3b8" }}
                >
                  No matching records found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  style={{
                    borderBottom: "1px solid #f8fafc",
                    background: selectedRows.has(rIdx) ? accentLight : "transparent",
                  }}
                  onMouseEnter={(e) => { if (!selectedRows.has(rIdx)) e.currentTarget.style.background = "#fafcff"; }}
                  onMouseLeave={(e) => { if (!selectedRows.has(rIdx)) e.currentTarget.style.background = ""; }}
                >
                  <td style={{ padding: compactView ? "8px 12px" : "10px 16px", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(rIdx)}
                      onChange={() => toggleRow(rIdx)}
                      style={{ accentColor, cursor: "pointer" }}
                    />
                  </td>
                  {row.map((cell, cIdx) => visibleColumns[cIdx] && (
                    <td key={cIdx} style={{ padding: compactView ? "8px 12px" : "10px 16px" }}>
                      {renderCell(cell, cIdx)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div style={{
          padding: "12px 20px", display: "flex", alignItems: "center",
          justifyContent: "space-between", borderTop: "1px solid #f1f5f9",
          flexWrap: "wrap", gap: 10, background: "#fafcff",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>{startEntry}–{endEntry} of {sortedData.length}</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              style={{ fontSize: 10, padding: "3px 6px", border: "1px solid #e2e8f0", borderRadius: 6 }}
            >
              {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button onClick={() => setCurrentPage(1)}                          disabled={currentPage === 1}          style={pageBtnStyle(currentPage === 1)}><ChevronLeft size={10} /><ChevronLeft size={10} style={{ marginLeft: -4 }} /></button>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}   disabled={currentPage === 1}          style={pageBtnStyle(currentPage === 1)}><ChevronLeft size={10} /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p = i + 1;
              if (totalPages > 5) {
                if      (currentPage <= 3)              p = i + 1;
                else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
                else                                    p = currentPage - 2 + i;
              }
              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  style={{
                    padding: "4px 10px", border: currentPage === p ? "none" : "1px solid #e2e8f0",
                    borderRadius: 6,
                    background: currentPage === p ? `linear-gradient(135deg,${accentColor},${accentColor}CC)` : "#fff",
                    color: currentPage === p ? "#fff" : "#374151",
                    fontSize: 10, fontWeight: currentPage === p ? 600 : 400, cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              );
            })}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={pageBtnStyle(currentPage === totalPages)}><ChevronRight size={10} /></button>
            <button onClick={() => setCurrentPage(totalPages)}                        disabled={currentPage === totalPages} style={pageBtnStyle(currentPage === totalPages)}><ChevronRight size={10} /><ChevronRight size={10} style={{ marginLeft: -4 }} /></button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function pageBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: 6,
    background: "#fff", fontSize: 10, cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.5 : 1, display: "flex", alignItems: "center",
  };
}