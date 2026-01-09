"use client";
import React from 'react';
import { FileText, Trash2 } from 'lucide-react';

interface Certification {
  id: string;
  docType: string;
  file: File;
  fileName: string;
}

interface ListProps {
  certifications: Certification[];
  onDelete: (id: string) => void;
}

export default function CertificationList({ certifications, onDelete }: ListProps) {
  if (!certifications || certifications.length === 0) return null;

  return (
    <div className="mt-6 overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Document Type</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">File Name</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {certifications.map((cert) => (
            <tr key={cert.id} className="hover:bg-orange-50/30 transition-colors">
              <td className="p-4">
                <span className="px-3 py-1 bg-orange-100 text-[#FE6B1D] rounded-full text-xs font-bold">
                  {cert.docType}
                </span>
              </td>
              <td className="p-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" />
                  <span className="truncate max-w-[200px] font-medium">{cert.fileName}</span>
                </div>
              </td>
              <td className="p-4 text-right">
                <button
                  type="button"
                  onClick={() => onDelete(cert.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}