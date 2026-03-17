import { Navigation, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import StationCard from '@/components/StationCard';
import { mockStations } from '@/data/stations';

export default function Nearby() {
  const sorted = [...mockStations].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

  return (
    <div className="min-h-screen pb-24 pt-16">
      <div className="container px-4 py-4 space-y-4 max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Navigation className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Nearby Stations</h1>
            <p className="text-xs text-muted-foreground">Sorted by distance from you</p>
          </div>
        </motion.div>

        <div className="space-y-3">
          {sorted.map((station, i) => (
            <StationCard key={station.id} station={station} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
