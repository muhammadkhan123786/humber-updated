import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Bike,
  Truck,
  Star,
  Edit2,
  PauseCircle,
  UserMinus,
  Trash2,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  Award,
} from "lucide-react";

interface Rider {
  id: string;
  date: string;
  name: string;
  location: string;
  type: string;
  email: string;
  phone: string;
  vehicle: string;
  plate: string;
  rating: number;
  deliveries: number;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "REJECTED" | "TERMINATED";
}

const riders: Rider[] = [
  {
    id: "R001",
    date: "15/01/2024",
    name: "John Smith",
    location: "London, UK",
    type: "Full-Time",
    email: "john.smith@example.com",
    phone: "+44 7700 900123",
    vehicle: "Motorcycle",
    plate: "AB12 CDE",
    rating: 4.8,
    deliveries: 145,
    status: "ACTIVE",
  },
  {
    id: "R002",
    date: "20/02/2024",
    name: "Sarah Johnson",
    location: "Manchester, UK",
    type: "Part-Time",
    email: "sarah.j@example.com",
    phone: "+44 7700 900456",
    vehicle: "Van",
    plate: "CD34 EFG",
    rating: 4.9,
    deliveries: 203,
    status: "ACTIVE",
  },
  {
    id: "R003",
    date: "10/12/2023",
    name: "Mike Williams",
    location: "Birmingham, UK",
    type: "Full-Time",
    email: "mike.w@example.com",
    phone: "+44 7700 900789",
    vehicle: "Bicycle",
    plate: "N/A",
    rating: 4.5,
    deliveries: 89,
    status: "INACTIVE",
  },
  {
    id: "R004",
    date: "05/03/2024",
    name: "Emma Davis",
    location: "Liverpool, UK",
    type: "Full-Time",
    email: "emma.d@example.com",
    phone: "+44 7700 901234",
    vehicle: "E-Bike",
    plate: "EF56 HIJ",
    rating: 0.0,
    deliveries: 0,
    status: "PENDING",
  },
  {
    id: "R005",
    date: "30/01/2024",
    name: "James Brown",
    location: "Leeds, UK",
    type: "Contractor",
    email: "james.b@example.com",
    phone: "+44 7700 905678",
    vehicle: "Car",
    plate: "GH78 KLM",
    rating: 0.0,
    deliveries: 0,
    status: "REJECTED",
  },
  {
    id: "R006",
    date: "12/02/2024",
    name: "Olivia Wilson",
    location: "Bristol, UK",
    type: "Full-Time",
    email: "olivia.w@example.com",
    phone: "+44 7700 900555",
    vehicle: "Motorcycle",
    plate: "XY12 ZZZ",
    rating: 3.2,
    deliveries: 42,
    status: "TERMINATED",
  },
];

const StatusBadge = ({ status }: { status: Rider["status"] }) => {
  const styles = {
    ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-100",
    INACTIVE: "bg-gray-100 text-gray-500 border-gray-200",
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    REJECTED: "bg-red-50 text-red-600 border-red-100",
    TERMINATED: "bg-orange-50 text-orange-700 border-orange-100",
  };

  const icons = {
    ACTIVE: <CheckCircle2 size={14} />,
    INACTIVE: <PauseCircle size={14} />,
    PENDING: <Clock size={14} />,
    REJECTED: <XCircle size={14} />,
    TERMINATED: <UserMinus size={14} />,
  };

  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${styles[status]}`}
    >
      {icons[status as keyof typeof icons]}
      {status}
    </span>
  );
};

const RiderTable: React.FC = () => {
  return (
    <div className="w-full py-2 overflow-x-auto">
      <table className="w-full bg-white rounded-3xl overflow-hidden border-collapse">
        <thead>
          <tr className="text-left bg-gray-50 border-b border-gray-100">
            <th className="p-4 text-xs font-bold text-gray-500">RIDER ID</th>
            <th className="p-4 text-xs font-bold text-gray-500">
              RIDER DETAILS
            </th>
            <th className="p-4 text-xs font-bold text-gray-500">CONTACT</th>
            <th className="p-4 text-xs font-bold text-gray-500">VEHICLE</th>
            <th className="p-4 text-xs font-bold text-gray-500">PERFORMANCE</th>
            <th className="p-4 text-xs font-bold text-gray-500">STATUS</th>
            <th className="p-4 text-xs font-bold text-gray-500">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {riders.map((rider) => (
            <tr
              key={rider.id}
              className="hover:bg-blue-50/30 transition-colors"
            >
              <td className="p-4">
                <div className="text-sm font-bold text-blue-600">
                  {rider.id}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Calendar size={12} /> {rider.date}
                </div>
              </td>

              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-sm">
                    {rider.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {rider.name}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-400">
                      <MapPin size={10} /> {rider.location}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {rider.type}
                    </div>
                  </div>
                </div>
              </td>

              <td className="p-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <Mail size={12} className="text-gray-400" /> {rider.email}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Phone size={12} className="text-gray-400" /> {rider.phone}
                </div>
              </td>

              {/* Vehicle */}
              <td className="p-4">
                <div className="flex items-center gap-2 text-blue-600 text-xs font-bold">
                  {rider.vehicle === "Van" ? (
                    <Truck size={14} />
                  ) : (
                    <Bike size={14} />
                  )}
                  {rider.vehicle}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {rider.plate}
                </div>
              </td>

              <td className="p-4">
                <div className="flex items-center gap-1 font-bold text-gray-800">
                  <Star size={14} className="fill-amber-400 text-amber-400" />{" "}
                  {rider.rating.toFixed(1)}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium mt-1">
                  <Award size={12} strokeWidth={2.5} />
                  <span>{rider.deliveries} deliveries</span>
                </div>
              </td>

              <td className="p-4">
                <StatusBadge status={rider.status} />
              </td>

              <td className="p-4">
                <div className="grid grid-cols-3 gap-2 w-fit">
                  <button className="p-1.5 text-blue-500 bg-blue-50 rounded-md border border-blue-100 hover:bg-blue-100">
                    <Edit2 size={14} />
                  </button>
                  {rider.status === "PENDING" ? (
                    <>
                      <button className="p-1.5 text-white bg-emerald-500 rounded-md shadow-sm">
                        <CheckCircle2 size={14} />
                      </button>
                      <button className="p-1.5 text-red-500 bg-red-50 rounded-md border border-red-100">
                        <XCircle size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="p-1.5 text-gray-500 bg-gray-50 rounded-md border border-gray-200">
                        <PauseCircle size={14} />
                      </button>
                      <button className="p-1.5 text-orange-500 bg-orange-50 rounded-md border border-orange-100">
                        <UserMinus size={14} />
                      </button>
                    </>
                  )}
                  <button className="p-1.5 text-red-500 bg-red-50 rounded-md border border-red-100 hover:bg-red-100">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiderTable;
