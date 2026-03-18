import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Loader2 } from 'lucide-react';
import { useSubmitRating } from '@/hooks/useRatings';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface RatingSheetProps {
  open: boolean;
  onClose: () => void;
  stationId: string;
  stationName: string;
}

export default function RatingSheet({ open, onClose, stationId, stationName }: RatingSheetProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { mutate: submit, isPending } = useSubmitRating();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    if (!user) { navigate('/auth'); onClose(); return; }
    if (rating === 0) return;
    submit({ stationId, rating, review }, { onSuccess: () => { onClose(); setRating(0); setReview(''); } });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/20 z-50" onClick={onClose} />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl p-6 pb-10"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-card-foreground">Rate Station</h2>
                <p className="text-xs text-muted-foreground">{stationName}</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(s)}
                  className="p-1"
                >
                  <Star className={`w-8 h-8 transition-colors ${s <= (hovered || rating) ? 'text-accent fill-accent' : 'text-muted-foreground'}`} />
                </button>
              ))}
            </div>

            <textarea
              placeholder="Write a short review (optional)"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none mb-4"
            />

            <button
              onClick={handleSubmit}
              disabled={isPending || rating === 0}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.97] transition-transform disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Submit Rating
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
