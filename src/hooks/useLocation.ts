import { useState, useEffect, useCallback } from 'react';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  permissionStatus: PermissionState | null;
}

export function useUserLocation() {
  const [state, setState] = useState<LocationState>({
    latitude: null, longitude: null, error: null, loading: false, permissionStatus: null,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'Geolocation not supported' }));
      return;
    }
    setState((s) => ({ ...s, loading: true }));
    navigator.geolocation.getCurrentPosition(
      (pos) => setState({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, error: null, loading: false, permissionStatus: 'granted' }),
      (err) => setState((s) => ({ ...s, error: err.message, loading: false, permissionStatus: 'denied' })),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Check permission status on mount
  useEffect(() => {
    navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
      setState((s) => ({ ...s, permissionStatus: result.state }));
      if (result.state === 'granted') requestLocation();
    });
  }, [requestLocation]);

  return { ...state, requestLocation };
}
