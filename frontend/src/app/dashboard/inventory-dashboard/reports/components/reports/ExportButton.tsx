// components/reports/ExportButton.tsx
"use client";

import { useState } from "react";
import { Download, FileText, FileSpreadsheet, FileJson, Printer, Check } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportButtonProps {
  data: any[];
  columns: { key: string; label: string }[];
  filename: string;
}

export default function ExportButton({ data, columns, filename }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const exportToCSV = () => {
    const headers = columns.map(col => col.label).join(",");
    const rows = data.map(row => 
      columns.map(col => {
        let value = row[col.key];
        if (typeof value === 'number') value = value.toString();
        if (value?.includes(',')) value = `"${value}"`;
        return value;
      }).join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const exportToExcel = () => {
    const worksheetData = data.map(row => {
      const obj: any = {};
      columns.forEach(col => {
        obj[col.label] = row[col.key];
      });
      return obj;
    });
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${filename}.xlsx`);
    setIsOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`${filename.replace(/-/g, ' ').toUpperCase()} Report`, 14, 15);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);
    
    const tableData = data.map(row => 
      columns.map(col => row[col.key])
    );
    
    autoTable(doc, {
      head: [columns.map(col => col.label)],
      body: tableData,
      startY: 35,
      theme: 'striped',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontSize: 9 },
    });
    
    doc.save(`${filename}.pdf`);
    setIsOpen(false);
  };

  const printReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const tableHtml = `
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr><th>${columns.map(col => `<th style="background: #3b82f6; color: white; padding: 8px;">${col.label}</th>`).join('')}</th>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${columns.map(col => `<td style="padding: 8px; border: 1px solid #ddd;">${row[col.key]}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${filename} Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1e293b; }
            p { color: #64748b; }
          </style>
        </head>
        <body>
          <h1>${filename.replace(/-/g, ' ').toUpperCase()} Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          ${tableHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    setIsOpen(false);
  };

  const copyToClipboard = async () => {
    const headers = columns.map(col => col.label).join("\t");
    const rows = data.map(row => 
      columns.map(col => row[col.key]).join("\t")
    ).join("\n");
    const text = `${headers}\n${rows}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
      >
        <Download className="h-4 w-4" />
        Export
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-20 min-w-[200px]">
          <div className="py-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <FileText className="h-4 w-4 text-green-600" />
              Export as CSV
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              Export as Excel
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <FileJson className="h-4 w-4 text-red-600" />
              Export as PDF
            </button>
            <button
              onClick={printReport}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Printer className="h-4 w-4 text-purple-600" />
              Print Report
            </button>
            <div className="border-t border-slate-100 my-1" />
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <FileText className="h-4 w-4 text-slate-500" />}
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}