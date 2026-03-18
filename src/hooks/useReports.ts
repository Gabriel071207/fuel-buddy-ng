import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ReportInput {
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'gas';
  price?: number;
  availability?: 'available' | 'limited' | 'unavailable';
  queue?: 'low' | 'medium' | 'high';
}

export function useSubmitReport() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ReportInput) => {
      if (!user) throw new Error('Must be logged in');
      const { error } = await supabase.from('station_reports').insert({
        station_id: input.stationId,
        user_id: user.id,
        fuel_type: input.fuelType,
        reported_price: input.price ?? null,
        reported_availability: input.availability ?? null,
        reported_queue: input.queue ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      queryClient.invalidateQueries({ queryKey: ['station'] });
      queryClient.invalidateQueries({ queryKey: ['user-reports'] });
      toast.success('Report submitted! Thank you.');
    },
    onError: (err: any) => toast.error(err.message),
  });
}

export function useUserReports() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user-reports', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('station_reports')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });
}
