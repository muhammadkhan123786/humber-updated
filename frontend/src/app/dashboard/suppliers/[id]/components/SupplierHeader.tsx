// components/SupplierHeader.tsx
import { ArrowLeft, Edit, Mail, Phone, MapPin, Globe } from "lucide-react";
import { Badge } from "@/components/form/Badge";
import { Button } from "@/components/form/CustomButton";
import { useRouter } from "next/navigation";

interface Props {
  name: string;
  businessName?: string;
  isActive: boolean;
  supplierId: string;
  stats: {
    totalProducts: number;
    activeProducts: number;
    avgLeadTime: string | number;
  };
}

export function SupplierHeader({ name, businessName, isActive, supplierId, stats }: Props) {
  const router = useRouter();

  return (
    <div className="relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-48"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 h-48"></div>
      
      {/* Main Header */}
      <div className="relative max-w-7xl mx-auto px-6 pt-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Top Bar */}
          <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">Back to Suppliers</span>
            </button>
            
            <div className="flex items-center gap-3">
              <Badge className={isActive
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1"
                : "bg-gray-200 text-gray-600 px-3 py-1"
              }>
                {isActive ? "● Active" : "○ Inactive"}
              </Badge>
              
              <Button
                onClick={() => router.push(`/dashboard/suppliers/${supplierId}/edit`)}
                className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white shadow-lg"
              >
                <Edit className="h-4 w-4" /> Edit Supplier
              </Button>
            </div>
          </div>

          {/* Supplier Info */}
          <div className="px-8 py-6">
            <div className="flex items-start gap-6">
              {/* Avatar/Initials */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-70"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-3xl font-bold text-white">
                    {name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Name and Details */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
                {businessName && businessName !== name && (
                  <p className="text-gray-500 mt-1">{businessName}</p>
                )}
                
                {/* Contact Icons */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span>supplier@example.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="p-1.5 rounded-lg bg-green-50 text-green-600">
                      <Phone className="h-4 w-4" />
                    </div>
                    <span>+44 20 1234 5678</span>
                  </div>
                </div>
              </div>

              {/* Mini Stats */}
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
                  <p className="text-xs text-gray-500">Products</p>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{stats.activeProducts}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">{stats.avgLeadTime}</p>
                  <p className="text-xs text-gray-500">Lead Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}