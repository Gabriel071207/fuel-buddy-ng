import { Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import StationCard from '@/components/StationCard';
import { useStations } from '@/hooks/useStations';
import { useUserLocation } from '@/hooks/useLocation';

export default function Nearby() {
  const { latitude, longitude } = useUserLocation();
  const { data: stations = [], isLoading } = useStations(latitude ?? undefined, longitude ?? undefined);
  const sorted = [...stations].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

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

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((station, i) => (
              <StationCard key={station.id} station={station} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
