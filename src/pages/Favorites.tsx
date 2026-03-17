import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Favorites() {
  return (
    <div className="min-h-screen pb-24 pt-16">
      <div className="container px-4 py-4 space-y-6 max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-lg font-bold text-foreground">Favorites</h1>
          <p className="text-xs text-muted-foreground">Your saved fuel stations</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
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
      </div>
    </div>
  );
}
