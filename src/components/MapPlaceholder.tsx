import { MapPin, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Station } from '@/data/stations';

const availabilityDotColor = (station: Station) => {
  const hasFuel = station.fuels.some((f) => f.availability === 'available');
  const hasLimited = station.fuels.some((f) => f.availability === 'limited');
  if (hasFuel) return 'bg-fuel-available';
  if (hasLimited) return 'bg-fuel-limited';
  return 'bg-fuel-unavailable';
};

export default function MapPlaceholder({ stations }: { stations: Station[] }) {
  return (
    <div className="relative w-full h-48 rounded-2xl bg-secondary overflow-hidden">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`h${i}`} className="absolute w-full h-px bg-border" style={{ top: `${(i + 1) * 16.6}%` }} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`v${i}`} className="absolute h-full w-px bg-border" style={{ left: `${(i + 1) * 12.5}%` }} />
        ))}
      </div>

      {/* Station dots */}
      {stations.slice(0, 6).map((station, i) => {
        const positions = [
          { left: '25%', top: '30%' }, { left: '60%', top: '20%' }, { left: '40%', top: '55%' },
          { left: '75%', top: '45%' }, { left: '15%', top: '65%' }, { left: '55%', top: '70%' },
        ];
        return (
          <motion.div
            key={station.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="absolute"
            style={positions[i]}
          >
            <div className={`w-3 h-3 rounded-full ${availabilityDotColor(station)} animate-pulse-dot`} />
          </motion.div>
        );
      })}

      {/* User location */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative">
          <div className="w-4 h-4 rounded-full bg-primary border-2 border-primary-foreground shadow-lg" />
          <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/30 animate-ping" />
        </div>
      </motion.div>

      {/* Overlay text */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground glass-card px-2.5 py-1 rounded-lg">
          Lagos, Nigeria
        </span>
        <button className="glass-card p-2 rounded-lg">
          <Navigation className="w-3.5 h-3.5 text-primary" />
        </button>
      </div>
    </div>
  );
}
