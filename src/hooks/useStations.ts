import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Station, FuelInfo } from '@/data/stations';

interface DbStation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  open_hours: string;
  open_now: boolean;
  verified: boolean;
  computed_petrol_price: number | null;
  computed_diesel_price: number | null;
  computed_gas_price: number | null;
  computed_petrol_avail: string | null;
  computed_diesel_avail: string | null;
  computed_gas_avail: string | null;
  computed_queue: string;
  confidence: string;
  report_count: number;
  last_updated: string;
  avg_rating: number;
  rating_count: number;
}

function toStation(db: DbStation, userLat?: number, userLng?: number): Station {
  const fuels: FuelInfo[] = [];
  if (db.computed_petrol_price != null) {
    fuels.push({ type: 'petrol', price: db.computed_petrol_price, availability: (db.computed_petrol_avail as any) || 'unavailable' });
  }
  if (db.computed_diesel_price != null) {
    fuels.push({ type: 'diesel', price: db.computed_diesel_price, availability: (db.computed_diesel_avail as any) || 'unavailable' });
  }
  if (db.computed_gas_price != null) {
    fuels.push({ type: 'gas', price: db.computed_gas_price, availability: (db.computed_gas_avail as any) || 'unavailable' });
  }

  let distance: number | undefined;
  if (userLat != null && userLng != null) {
    const R = 6371;
    const dLat = ((db.latitude - userLat) * Math.PI) / 180;
    const dLng = ((db.longitude - userLng) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((userLat * Math.PI) / 180) * Math.cos((db.latitude * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    distance = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
  }

  const now = new Date();
  const updated = new Date(db.last_updated);
  const diffMin = Math.round((now.getTime() - updated.getTime()) / 60000);
  const lastUpdated = diffMin < 1 ? 'just now' : diffMin < 60 ? `${diffMin} mins ago` : `${Math.round(diffMin / 60)}h ago`;

  return {
    id: db.id,
    name: db.name,
    address: db.address,
    latitude: db.latitude,
    longitude: db.longitude,
    fuels,
    queueLevel: (db.computed_queue as any) || 'low',
    rating: Number(db.avg_rating) || 0,
    reviewCount: db.rating_count || 0,
    verified: db.verified,
    lastUpdated,
    openNow: db.open_now,
    openHours: db.open_hours,
    distance,
    confidence: db.confidence as any,
    reportCount: db.report_count,
  };
}

export function useStations(userLat?: number, userLng?: number) {
  const queryClient = useQueryClient();

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('stations-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stations' }, () => {
        queryClient.invalidateQueries({ queryKey: ['stations'] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      const { data, error } = await supabase.from('stations').select('*');
      if (error) throw error;
      return (data as unknown as DbStation[]).map((s) => toStation(s, userLat, userLng));
    },
  });
}

export function useStation(id: string | undefined) {
  return useQuery({
    queryKey: ['station', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('stations').select('*').eq('id', id!).single();
      if (error) throw error;
      return toStation(data as unknown as DbStation);
    },
  });
}
