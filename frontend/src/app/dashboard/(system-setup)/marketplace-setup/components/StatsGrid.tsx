import { motion } from 'framer-motion';
import { Power, Store, Star } from 'lucide-react';
import { MarketplaceTemplate } from '../data/marketplaceTemplates';

interface StatsGridProps {
  marketplaces: MarketplaceTemplate[];
}

export function StatsGrid({ marketplaces }: StatsGridProps) {
  const activeCount = marketplaces.filter(m => m.isActive).length;
  const defaultMarketplace = marketplaces.find(m => m.isDefault);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Active Marketplaces"
        value={activeCount}
        icon={Power}
        color="green"
        gradient="bg-gradient-to-br from-blue-100 to-indigo-100"
        delay={0.1}
      />

      <StatCard
        title="Total Marketplaces"
        value={marketplaces.length}
        icon={Store}
        color="blue"
        gradient="bg-gradient-to-br from-green-100 to-emerald-100"
        delay={0.15}
      />

      <StatCard
        title="Default Marketplace"
        value={defaultMarketplace?.name || 'None'}
        icon={Star}
        color="yellow"
        gradient="bg-gradient-to-br from-yellow-100 to-orange-100"
        delay={0.2}
        isText
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  gradient: string;
  delay: number;
  isText?: boolean;
}

function StatCard({ title, value, icon: Icon, color, gradient, delay, isText = false }: StatCardProps) {
  const colorClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
    red: 'text-red-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-white rounded-xl shadow-lg p-6 border border-${color}-100`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-${isText ? 'xl' : '3xl'} font-bold ${colorClasses[color as keyof typeof colorClasses]}`}>
            {value}
          </p>
        </div>
        <div className={`h-12 w-12 ${gradient} rounded-lg flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${colorClasses[color as keyof typeof colorClasses]}`} />
        </div>
      </div>
    </motion.div>
  );
}