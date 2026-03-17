import { Fuel, TrendingDown, MapPin, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { icon: Fuel, label: 'Stations', value: '2,450+', color: 'text-primary' },
  { icon: TrendingDown, label: 'Lowest ₦', value: '₦580', color: 'text-fuel-available' },
  { icon: MapPin, label: 'Cities', value: '12', color: 'text-fuel-verified' },
  { icon: Zap, label: 'Updates', value: '1.2K/day', color: 'text-accent' },
];

export default function QuickStats() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          className="bg-card rounded-2xl p-3 flex flex-col items-center gap-1 border border-border"
        >
          <stat.icon className={`w-5 h-5 ${stat.color}`} />
          <span className="text-sm font-bold text-card-foreground">{stat.value}</span>
          <span className="text-[10px] text-muted-foreground">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
