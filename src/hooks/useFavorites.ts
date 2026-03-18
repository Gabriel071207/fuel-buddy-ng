import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useFavorites() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['favorites', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('station_id')
        .eq('user_id', user!.id);
      if (error) throw error;
      return (data as any[]).map((f: any) => f.station_id as string);
    },
  });
}

export function useToggleFavorite() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ stationId, isFavorite }: { stationId: string; isFavorite: boolean }) => {
      if (!user) throw new Error('Must be logged in');
      if (isFavorite) {
        const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('station_id', stationId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('favorites').insert({ user_id: user.id, station_id: stationId });
        if (error) throw error;
      }
    },
    onSuccess: (_, { isFavorite }) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    },
    onError: (err: any) => toast.error(err.message),
  });
}
