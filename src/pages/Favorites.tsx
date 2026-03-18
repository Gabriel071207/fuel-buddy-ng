import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useStations } from '@/hooks/useStations';
import StationCard from '@/components/StationCard';
import { useNavigate } from 'react-router-dom';

export default function Favorites() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: favIds = [] } = useFavorites();
  const { data: stations = [] } = useStations();

  const favStations = stations.filter((s) => favIds.includes(s.id));

  return (
    <div className="min-h-screen pb-24 pt-16">
      <div className="container px-4 py-4 space-y-4 max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-lg font-bold text-foreground">Favorites</h1>
          <p className="text-xs text-muted-foreground">Your saved fuel stations</p>
        </motion.div>

        {!user ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-muted-foreground" />
            </div>
            <h2 className="text-base font-semibold text-foreground mb-1">Sign in to save favorites</h2>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">Create an account to save your favorite stations.</p>
            <button onClick={() => navigate('/auth')} className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.97] transition-transform">
              Sign In
            </button>
          </motion.div>
        ) : favStations.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-muted-foreground" />
            </div>
            <h2 className="text-base font-semibold text-foreground mb-1">No favorites yet</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Tap the heart icon on any station to save it here for quick access.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {favStations.map((station, i) => (
              <StationCard key={station.id} station={station} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
