import { Activity, ShieldCheck, Clock8 } from "lucide-react";

export default function ManagementSection() {
  const managementCards = [
    {
      title: "Login History",
      description: "View authentication logs and security events",
      icon: <Activity className="w-5 h-5 text-white" />,
      gradient: "from-blue-500 to-cyan-500",
      topBorder: "bg-blue-500",
    },
    {
      title: "Permissions Manager",
      description: "Configure module and form-level permissions",
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      gradient: "from-fuchsia-500 to-purple-600",
      topBorder: "bg-fuchsia-500",
    },
    {
      title: "Audit Trail",
      description: "Track user changes and system modifications",
      icon: <Clock8 className="w-5 h-5 text-white" />,
      gradient: "from-orange-500 to-red-500",
      topBorder: "bg-orange-600",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 my-4 w-full bg-transparent">
      {managementCards.map((card, index) => (
        <div
          key={index}
          className="flex-1  h-auto bg-white/90 rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
        >
          <div className={`w-full h-1 ${card.topBorder}`} />

          <div className="p-5 flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 bg-linear-to-br ${card.gradient} rounded-xl shadow-sm flex items-center justify-center shrink-0`}
              >
                {card.icon}
              </div>
              <h3 className="text-gray-900 text-[17px] font-bold font-['Arial'] leading-tight tracking-tight">
                {card.title}
              </h3>
            </div>

            <p className="text-gray-500 text-sm font-normal font-['Arial'] leading-relaxed">
              {card.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
