import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import FilterSheet, { type Filters } from '@/components/FilterSheet';
import MapPlaceholder from '@/components/MapPlaceholder';
import QuickStats from '@/components/QuickStats';
import StationCard from '@/components/StationCard';
import { useStations } from '@/hooks/useStations';
import { useUserLocation } from '@/hooks/useLocation';

const defaultFilters: Filters = {
  fuelType: 'all',
  maxDistance: 10,
  availableOnly: false,
  sortBy: 'distance',
};

export default function Index() {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const { latitude, longitude } = useUserLocation();
  const { data: stations = [], isLoading } = useStations(latitude ?? undefined, longitude ?? undefined);

  const filtered = useMemo(() => {
    let result = [...stations];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q));
    }

    if (filters.fuelType !== 'all') {
      result = result.filter((s) => s.fuels.some((f) => f.type === filters.fuelType));
    }

    if (filters.maxDistance < 20) {
      result = result.filter((s) => (s.distance ?? 0) <= filters.maxDistance);
    }

    if (filters.availableOnly) {
      result = result.filter((s) => s.fuels.some((f) => f.availability === 'available'));
    }

    result.sort((a, b) => {
      if (filters.sortBy === 'distance') return (a.distance ?? 0) - (b.distance ?? 0);
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'price') {
        const aMin = Math.min(...a.fuels.map((f) => f.price));
        const bMin = Math.min(...b.fuels.map((f) => f.price));
        return aMin - bMin;
      }
      return 0;
    });

    return result;
  }, [search, filters, stations]);

  return (
    <div className="min-h-screen pb-24 pt-16">
      <div className="container px-4 py-4 space-y-4 max-w-lg mx-auto">
        <SearchBar value={search} onChange={setSearch} onFilterToggle={() => setFilterOpen(true)} />
        <MapPlaceholder stations={filtered} />
        <QuickStats />

        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Nearby Stations</h2>
          <span className="text-xs text-muted-foreground">
            {isLoading ? 'Loading...' : `${filtered.length} found`}
          </span>
        </div>

        <div className="space-y-3">
          {filtered.map((station, i) => (
            <StationCard key={station.id} station={station} index={i} />
          ))}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No stations found. Try adjusting your filters.
            </div>
          )}
        </div>
      </div>

      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} onFiltersChange={setFilters} />
    </div>
  );
}
