
-- 1. Create enums
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'station_owner');
CREATE TYPE public.confidence_level AS ENUM ('low', 'medium', 'high', 'outdated');
CREATE TYPE public.fuel_type AS ENUM ('petrol', 'diesel', 'gas');
CREATE TYPE public.availability_status AS ENUM ('available', 'limited', 'unavailable');
CREATE TYPE public.queue_level AS ENUM ('low', 'medium', 'high');

-- 2. Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  notifications_enabled BOOLEAN NOT NULL DEFAULT false,
  location_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- 3. User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 4. has_role function (after user_roles exists)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- 5. Stations table
CREATE TABLE public.stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  longitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  open_hours TEXT NOT NULL DEFAULT '24 Hours',
  open_now BOOLEAN NOT NULL DEFAULT true,
  verified BOOLEAN NOT NULL DEFAULT false,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Computed trust fields
  computed_petrol_price NUMERIC,
  computed_diesel_price NUMERIC,
  computed_gas_price NUMERIC,
  computed_petrol_avail availability_status DEFAULT 'unavailable',
  computed_diesel_avail availability_status DEFAULT 'unavailable',
  computed_gas_avail availability_status DEFAULT 'unavailable',
  computed_queue queue_level DEFAULT 'low',
  confidence confidence_level DEFAULT 'low',
  report_count INT NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  avg_rating NUMERIC NOT NULL DEFAULT 0,
  rating_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stations are publicly readable" ON public.stations FOR SELECT USING (true);
CREATE POLICY "Owners can update own stations" ON public.stations FOR UPDATE TO authenticated USING (owner_id = auth.uid());

-- 6. Station reports
CREATE TABLE public.station_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES public.stations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fuel_type fuel_type NOT NULL,
  reported_price NUMERIC,
  reported_availability availability_status,
  reported_queue queue_level,
  is_owner_report BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.station_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reports are publicly readable" ON public.station_reports FOR SELECT USING (true);
CREATE POLICY "Auth users can insert reports" ON public.station_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 7. Favorites
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  station_id UUID REFERENCES public.stations(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, station_id)
);
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own favorites" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 8. Ratings
CREATE TABLE public.station_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES public.stations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, station_id)
);
ALTER TABLE public.station_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ratings are publicly readable" ON public.station_ratings FOR SELECT USING (true);
CREATE POLICY "Auth users can insert ratings" ON public.station_ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON public.station_ratings FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 9. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Recalculate station truth function
CREATE OR REPLACE FUNCTION public.recalculate_station_truth(p_station_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_report_count INT;
  v_confidence confidence_level;
  v_latest_owner RECORD;
  v_user_price NUMERIC;
  v_user_price_count INT;
  v_fuel fuel_type;
  v_fuels fuel_type[] := ARRAY['petrol','diesel','gas']::fuel_type[];
  v_computed_price NUMERIC;
  v_computed_avail availability_status;
  v_queue_reports queue_level;
  v_last_update TIMESTAMPTZ;
BEGIN
  -- Count recent reports (last 3 hours)
  SELECT COUNT(*), MAX(created_at) INTO v_report_count, v_last_update
  FROM station_reports WHERE station_id = p_station_id AND created_at > now() - interval '3 hours';

  -- Confidence
  IF v_last_update IS NULL OR v_last_update < now() - interval '3 hours' THEN
    v_confidence := 'outdated';
  ELSIF v_report_count >= 4 THEN
    v_confidence := 'high';
  ELSIF v_report_count >= 2 THEN
    v_confidence := 'medium';
  ELSE
    v_confidence := 'low';
  END IF;

  -- Decay: if last update > 1 hour, lower confidence one step
  IF v_last_update IS NOT NULL AND v_last_update < now() - interval '1 hour' AND v_confidence = 'high' THEN
    v_confidence := 'medium';
  END IF;

  -- Process each fuel type
  FOREACH v_fuel IN ARRAY v_fuels LOOP
    -- Get latest owner report within 30 min
    SELECT reported_price, reported_availability INTO v_latest_owner
    FROM station_reports
    WHERE station_id = p_station_id AND fuel_type = v_fuel AND is_owner_report = true AND created_at > now() - interval '30 minutes'
    ORDER BY created_at DESC LIMIT 1;

    -- Get user consensus price (last 3 hours)
    SELECT AVG(reported_price), COUNT(*) INTO v_user_price, v_user_price_count
    FROM station_reports
    WHERE station_id = p_station_id AND fuel_type = v_fuel AND is_owner_report = false
      AND created_at > now() - interval '3 hours' AND reported_price IS NOT NULL;

    -- Price logic: owner wins if recent, unless 3+ users disagree
    IF v_latest_owner.reported_price IS NOT NULL AND (v_user_price_count < 3 OR v_user_price IS NULL) THEN
      v_computed_price := v_latest_owner.reported_price;
    ELSIF v_user_price IS NOT NULL THEN
      v_computed_price := ROUND(v_user_price);
    ELSE
      v_computed_price := NULL;
    END IF;

    -- Availability: similar logic
    IF v_latest_owner.reported_availability IS NOT NULL THEN
      v_computed_avail := v_latest_owner.reported_availability;
    ELSE
      SELECT reported_availability INTO v_computed_avail
      FROM station_reports
      WHERE station_id = p_station_id AND fuel_type = v_fuel AND reported_availability IS NOT NULL
        AND created_at > now() - interval '3 hours'
      GROUP BY reported_availability ORDER BY COUNT(*) DESC LIMIT 1;
    END IF;
    IF v_computed_avail IS NULL THEN v_computed_avail := 'unavailable'; END IF;

    -- Update computed fields per fuel
    IF v_fuel = 'petrol' THEN
      UPDATE stations SET computed_petrol_price = v_computed_price, computed_petrol_avail = v_computed_avail WHERE id = p_station_id;
    ELSIF v_fuel = 'diesel' THEN
      UPDATE stations SET computed_diesel_price = v_computed_price, computed_diesel_avail = v_computed_avail WHERE id = p_station_id;
    ELSIF v_fuel = 'gas' THEN
      UPDATE stations SET computed_gas_price = v_computed_price, computed_gas_avail = v_computed_avail WHERE id = p_station_id;
    END IF;
  END LOOP;

  -- Queue: most reported level
  SELECT reported_queue INTO v_queue_reports
  FROM station_reports
  WHERE station_id = p_station_id AND reported_queue IS NOT NULL AND created_at > now() - interval '3 hours'
  GROUP BY reported_queue ORDER BY COUNT(*) DESC LIMIT 1;

  UPDATE stations SET
    computed_queue = COALESCE(v_queue_reports, 'low'),
    confidence = v_confidence,
    report_count = v_report_count,
    last_updated = COALESCE(v_last_update, now())
  WHERE id = p_station_id;
END;
$$;

-- 11. Anti-spam trigger
CREATE OR REPLACE FUNCTION public.validate_report_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_recent_count INT;
BEGIN
  SELECT COUNT(*) INTO v_recent_count
  FROM station_reports
  WHERE user_id = NEW.user_id AND station_id = NEW.station_id AND created_at > now() - interval '1 hour';

  IF v_recent_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit: max 3 reports per station per hour';
  END IF;

  -- Check duplicate
  IF EXISTS (
    SELECT 1 FROM station_reports
    WHERE user_id = NEW.user_id AND station_id = NEW.station_id AND fuel_type = NEW.fuel_type
      AND reported_price = NEW.reported_price AND reported_availability = NEW.reported_availability
      AND created_at > now() - interval '10 minutes'
  ) THEN
    RAISE EXCEPTION 'Duplicate report detected';
  END IF;

  RETURN NEW;
END;
$$;
CREATE TRIGGER check_report_spam BEFORE INSERT ON public.station_reports FOR EACH ROW EXECUTE FUNCTION public.validate_report_insert();

-- 12. Auto-recalculate after report
CREATE OR REPLACE FUNCTION public.trigger_recalculate()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  PERFORM recalculate_station_truth(NEW.station_id);
  RETURN NEW;
END;
$$;
CREATE TRIGGER after_report_insert AFTER INSERT ON public.station_reports FOR EACH ROW EXECUTE FUNCTION public.trigger_recalculate();

-- 13. Auto-recalculate ratings
CREATE OR REPLACE FUNCTION public.update_station_rating()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE stations SET
    avg_rating = (SELECT COALESCE(AVG(rating), 0) FROM station_ratings WHERE station_id = NEW.station_id),
    rating_count = (SELECT COUNT(*) FROM station_ratings WHERE station_id = NEW.station_id)
  WHERE id = NEW.station_id;
  RETURN NEW;
END;
$$;
CREATE TRIGGER after_rating_upsert AFTER INSERT OR UPDATE ON public.station_ratings FOR EACH ROW EXECUTE FUNCTION public.update_station_rating();

-- 14. Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.stations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.station_reports;
