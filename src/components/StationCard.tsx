import { MapPin, Clock, Star, ShieldCheck, Fuel, Droplets, Flame, Heart, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import type { Station, FuelType, AvailabilityStatus, QueueLevel } from '@/data/stations';

const fuelIcons: Record<FuelType, React.ElementType> = {
  petrol: Fuel, diesel: Droplets, gas: Flame,
};

const availabilityColors: Record<AvailabilityStatus, string> = {
  available: 'bg-fuel-available', limited: 'bg-fuel-limited', unavailable: 'bg-fuel-unavailable',
};

const queueConfig: Record<QueueLevel, { label: string; color: string }> = {
  low: { label: 'Low queue', color: 'text-fuel-available' },
  medium: { label: 'Medium queue', color: 'text-fuel-limited' },
  high: { label: 'High queue', color: 'text-fuel-unavailable' },
};

export default function StationCard({ station, index }: { station: Station; index: number }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: favIds = [] } = useFavorites();
  const { mutate: toggleFav } = useToggleFavorite();
  const queue = queueConfig[station.queueLevel];
  const isFav = favIds.includes(station.id);

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`, '_blank');
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { navigate('/auth'); return; }
    toggleFav({ stationId: station.id, isFavorite: isFav });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => navigate(`/station/${station.id}`)}
      className="bg-card rounded-2xl p-4 shadow-sm border border-border cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-card-foreground truncate">{station.name}</h3>
            {station.verified && <ShieldCheck className="w-4 h-4 text-fuel-verified flex-shrink-0" />}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground truncate">{station.address}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
          {station.distance !== undefined && (
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-lg">
              {station.distance}km
            </span>
          )}
          <button onClick={handleFav} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-destructive fill-destructive' : 'text-muted-foreground'}`} />
          </button>
        </div>
      </div>

      {/* Fuel pills */}
      <div className="flex flex-wrap gap-2 mb-3">
        {station.fuels.map((fuel) => {
          const Icon = fuelIcons[fuel.type];
          return (
            <div key={fuel.type} className="flex items-center gap-1.5 bg-secondary rounded-xl px-2.5 py-1.5">
              <div className={`w-2 h-2 rounded-full ${availabilityColors[fuel.availability]}`} />
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-card-foreground capitalize">{fuel.type}</span>
              <span className="text-xs font-bold text-primary">₦{fuel.price}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className={`font-medium ${queue.color}`}>{queue.label}</span>
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-accent fill-accent" />
            <span className="font-medium text-card-foreground">{station.rating}</span>
            <span className="text-muted-foreground">({station.reviewCount})</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {station.confidence && <ConfidenceBadge level={station.confidence} />}
          <button onClick={handleNavigate} className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Navigation className="w-3 h-3 text-primary" />
          </button>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{station.lastUpdated}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
