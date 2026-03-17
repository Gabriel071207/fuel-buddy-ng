import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShieldCheck, Clock, MapPin, Navigation, Flag, Fuel, Droplets, Flame, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockStations, type FuelType, type AvailabilityStatus, type QueueLevel } from '@/data/stations';

const fuelIcons: Record<FuelType, React.ElementType> = { petrol: Fuel, diesel: Droplets, gas: Flame };

const availabilityLabel: Record<AvailabilityStatus, { text: string; class: string }> = {
  available: { text: 'Available', class: 'bg-fuel-available text-primary-foreground' },
  limited: { text: 'Limited', class: 'bg-fuel-limited text-primary-foreground' },
  unavailable: { text: 'Out of Stock', class: 'bg-fuel-unavailable text-primary-foreground' },
};

const queueBar: Record<QueueLevel, { width: string; color: string; label: string }> = {
  low: { width: '25%', color: 'bg-fuel-available', label: 'Low Queue' },
  medium: { width: '60%', color: 'bg-fuel-limited', label: 'Medium Queue' },
  high: { width: '90%', color: 'bg-fuel-unavailable', label: 'High Queue' },
};

export default function StationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const station = mockStations.find((s) => s.id === id);

  if (!station) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Station not found</p>
      </div>
    );
  }

  const queue = queueBar[station.queueLevel];

  return (
    <div className="min-h-screen pb-8 pt-14">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="container flex items-center h-14 px-4 max-w-lg mx-auto gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <h1 className="text-sm font-semibold text-foreground truncate flex-1">{station.name}</h1>
        </div>
      </div>

      <div className="container px-4 py-4 space-y-4 max-w-lg mx-auto">
        {/* Hero card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl overflow-hidden border border-border">
          <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
            <Fuel className="w-16 h-16 text-primary/40" />
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-bold text-card-foreground">{station.name}</h2>
                  {station.verified && <ShieldCheck className="w-5 h-5 text-fuel-verified" />}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{station.address}</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 bg-accent/10 px-2 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                <span className="text-sm font-bold text-accent">{station.rating}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {station.openHours}
              </span>
              <span className={station.openNow ? 'text-fuel-available font-medium' : 'text-fuel-unavailable font-medium'}>
                {station.openNow ? 'Open Now' : 'Closed'}
              </span>
              <span>Updated {station.lastUpdated}</span>
            </div>
          </div>
        </motion.div>

        {/* Fuel Prices */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-sm font-bold text-foreground mb-3">Fuel Prices & Availability</h3>
          <div className="space-y-2">
            {station.fuels.map((fuel) => {
              const Icon = fuelIcons[fuel.type];
              const avail = availabilityLabel[fuel.availability];
              return (
                <div key={fuel.type} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-card-foreground capitalize">{fuel.type}</span>
                      <p className="text-lg font-bold text-primary">₦{fuel.price}<span className="text-xs font-normal text-muted-foreground">/litre</span></p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${avail.class}`}>{avail.text}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Queue */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 className="text-sm font-bold text-foreground mb-3">Queue Status</h3>
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">{queue.label}</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: queue.width }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className={`h-full rounded-full ${queue.color}`}
              />
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex gap-3">
          <button className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.97] transition-transform">
            <Navigation className="w-4 h-4" /> Navigate
          </button>
          <button className="flex-1 h-12 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
            <Flag className="w-4 h-4" /> Report Update
          </button>
        </motion.div>

        {/* Reviews placeholder */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h3 className="text-sm font-bold text-foreground mb-3">Reviews ({station.reviewCount})</h3>
          <div className="bg-card rounded-xl p-4 border border-border text-center text-sm text-muted-foreground">
            Reviews coming soon — sign in to be the first to review!
          </div>
        </motion.div>
      </div>
    </div>
  );
}
