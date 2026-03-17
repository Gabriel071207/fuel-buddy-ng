import { motion, AnimatePresence } from 'framer-motion';
import { X, Fuel, Droplets, Flame } from 'lucide-react';
import type { FuelType } from '@/data/stations';

export interface Filters {
  fuelType: FuelType | 'all';
  maxDistance: number;
  availableOnly: boolean;
  sortBy: 'distance' | 'price' | 'rating';
}

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const fuelTypes: { value: FuelType | 'all'; label: string; icon?: React.ElementType }[] = [
  { value: 'all', label: 'All' },
  { value: 'petrol', label: 'Petrol', icon: Fuel },
  { value: 'diesel', label: 'Diesel', icon: Droplets },
  { value: 'gas', label: 'Gas', icon: Flame },
];

const sortOptions: { value: Filters['sortBy']; label: string }[] = [
  { value: 'distance', label: 'Distance' },
  { value: 'price', label: 'Lowest Price' },
  { value: 'rating', label: 'Top Rated' },
];

export default function FilterSheet({ open, onClose, filters, onFiltersChange }: FilterSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl p-6 pb-10 max-h-[70vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-card-foreground">Filters</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Fuel Type */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-card-foreground mb-3">Fuel Type</h3>
              <div className="flex flex-wrap gap-2">
                {fuelTypes.map((ft) => (
                  <button
                    key={ft.value}
                    onClick={() => onFiltersChange({ ...filters, fuelType: ft.value })}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filters.fuelType === ft.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {ft.icon && <ft.icon className="w-3.5 h-3.5" />}
                    {ft.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-card-foreground mb-3">
                Max Distance: <span className="text-primary">{filters.maxDistance}km</span>
              </h3>
              <input
                type="range"
                min={1}
                max={20}
                value={filters.maxDistance}
                onChange={(e) => onFiltersChange({ ...filters, maxDistance: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>

            {/* Available Only */}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-card-foreground">Available fuel only</h3>
              <button
                onClick={() => onFiltersChange({ ...filters, availableOnly: !filters.availableOnly })}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  filters.availableOnly ? 'bg-primary' : 'bg-secondary'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-card shadow absolute top-1 transition-transform ${
                    filters.availableOnly ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Sort By */}
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-card-foreground mb-3">Sort By</h3>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onFiltersChange({ ...filters, sortBy: opt.value })}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filters.sortBy === opt.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
