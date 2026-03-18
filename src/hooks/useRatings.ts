import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useStationRatings(stationId: string | undefined) {
  return useQuery({
    queryKey: ['ratings', stationId],
    enabled: !!stationId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('station_ratings')
        .select('*')
        .eq('station_id', stationId!)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
  });
}

export function useSubmitRating() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ stationId, rating, review }: { stationId: string; rating: number; review?: string }) => {
      if (!user) throw new Error('Must be logged in');
      const { error } = await supabase.from('station_ratings').upsert(
        { station_id: stationId, user_id: user.id, rating, review: review || null },
        { onConflict: 'user_id,station_id' }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
      queryClient.invalidateQueries({ queryKey: ['station'] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      toast.success('Rating submitted!');
    },
    onError: (err: any) => toast.error(err.message),
  });
}
