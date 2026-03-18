import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Fuel, Droplets, Flame, Send, Loader2 } from 'lucide-react';
import { useSubmitReport } from '@/hooks/useReports';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ReportSheetProps {
  open: boolean;
  onClose: () => void;
  stationId: string;
  stationName: string;
}

const fuelOptions = [
  { value: 'petrol' as const, label: 'Petrol', icon: Fuel },
  { value: 'diesel' as const, label: 'Diesel', icon: Droplets },
  { value: 'gas' as const, label: 'Gas', icon: Flame },
];

const availOptions = [
  { value: 'available' as const, label: 'Available', cls: 'bg-fuel-available text-primary-foreground' },
  { value: 'limited' as const, label: 'Limited', cls: 'bg-fuel-limited text-primary-foreground' },
  { value: 'unavailable' as const, label: 'Out of Stock', cls: 'bg-fuel-unavailable text-primary-foreground' },
];

const queueOptions = [
  { value: 'low' as const, label: 'Low' },
  { value: 'medium' as const, label: 'Medium' },
  { value: 'high' as const, label: 'High' },
];

export default function ReportSheet({ open, onClose, stationId, stationName }: ReportSheetProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { mutate: submit, isPending } = useSubmitReport();
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'gas'>('petrol');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState<'available' | 'limited' | 'unavailable' | ''>('');
  const [queue, setQueue] = useState<'low' | 'medium' | 'high' | ''>('');

  const handleSubmit = () => {
    if (!user) {
      navigate('/auth');
      onClose();
      return;
    }
    submit(
      {
        stationId,
        fuelType,
        price: price ? Number(price) : undefined,
        availability: availability || undefined,
        queue: queue || undefined,
      },
      { onSuccess: () => { onClose(); setPrice(''); setAvailability(''); setQueue(''); } }
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/20 z-50" onClick={onClose} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-card-foreground">Report Update</h2>
                <p className="text-xs text-muted-foreground">{stationName}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Fuel type */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-card-foreground mb-2">Fuel Type</h3>
              <div className="flex gap-2">
                {fuelOptions.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFuelType(f.value)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      fuelType === f.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <f.icon className="w-3.5 h-3.5" /> {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-card-foreground mb-2">Price (₦/litre)</h3>
              <input
                type="number"
                placeholder="e.g. 620"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Availability */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-card-foreground mb-2">Availability</h3>
              <div className="flex gap-2">
                {availOptions.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => setAvailability(a.value)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      availability === a.value ? a.cls : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Queue */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-card-foreground mb-2">Queue Level</h3>
              <div className="flex gap-2">
                {queueOptions.map((q) => (
                  <button
                    key={q.value}
                    onClick={() => setQueue(q.value)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      queue === q.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.97] transition-transform disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit Report
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
