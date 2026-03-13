import { Settings } from "lucide-react";

export const IntegrationTips = () => {
  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
          <Settings size={18} />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Integration Tips</h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50/50">
          <span className="text-green-500">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </span>
          <p className="text-sm text-gray-700">
            <span className="font-bold text-gray-900">Email:</span> Ensure your
            SMTP credentials are correct and your firewall allows outbound
            connections on the specified port.
          </p>
        </div>
        <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50/50">
          <span className="text-green-500">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </span>
          <p className="text-sm text-gray-700">
            <span className="font-bold text-gray-900">SMS:</span> Register your
            sender ID with your SMS provider and verify your account before
            sending messages.
          </p>
        </div>
        <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50/50">
          <span className="text-green-500">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </span>
          <p className="text-sm text-gray-700">
            <span className="font-bold text-gray-900">WhatsApp:</span> Use
            pre-approved message templates for notifications to comply with
            WhatsApp Business policies.
          </p>
        </div>
      </div>
    </div>
  );
};
