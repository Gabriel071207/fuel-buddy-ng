import { Sun, Moon, User, Fuel } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { motion } from 'framer-motion';

export default function TopBar() {
  const { isDark, toggle } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card">
      <div className="container flex items-center justify-between h-14 px-4">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Fuel className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">
            Fuel<span className="text-primary">Finder</span> <span className="text-muted-foreground text-sm font-medium">NG</span>
          </span>
        </motion.div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center transition-colors hover:bg-muted"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-accent" />
            ) : (
              <Moon className="w-4 h-4 text-foreground" />
            )}
          </button>
          <button className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center transition-colors hover:bg-muted">
            <User className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
