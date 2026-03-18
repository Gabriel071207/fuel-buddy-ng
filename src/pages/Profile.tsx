import { User, Settings, Shield, Bell, HelpCircle, LogIn, LogOut, MapPin, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { useUserLocation } from '@/hooks/useLocation';
import { useUserReports } from '@/hooks/useReports';
import { useFavorites } from '@/hooks/useFavorites';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  const { permissionStatus, requestLocation } = useUserLocation();
  const { data: reports = [] } = useUserReports();
  const { data: favIds = [] } = useFavorites();

  const menuItems = [
    { icon: Bell, label: 'Notifications', desc: 'Manage alerts & push notifications' },
    { icon: Shield, label: 'Privacy & Security', desc: 'Account security settings' },
    { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs and contact support' },
  ];

  return (
    <div className="min-h-screen pb-24 pt-16">
      <div className="container px-4 py-4 space-y-4 max-w-lg mx-auto">
        {/* User card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 border border-border text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          {user ? (
            <>
              <h2 className="text-base font-bold text-card-foreground mb-1">
                {user.user_metadata?.full_name || user.email}
              </h2>
              <p className="text-xs text-muted-foreground mb-4">{user.email}</p>
              <div className="flex justify-center gap-6 text-center mb-4">
                <div>
                  <p className="text-lg font-bold text-primary">{favIds.length}</p>
                  <p className="text-[10px] text-muted-foreground">Favorites</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-primary">{(reports as any[]).length}</p>
                  <p className="text-[10px] text-muted-foreground">Reports</p>
                </div>
              </div>
              <button
                onClick={async () => { await signOut(); }}
                className="h-10 px-5 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm flex items-center justify-center gap-2 mx-auto active:scale-[0.97] transition-transform"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <h2 className="text-base font-bold text-card-foreground mb-1">Welcome, Guest</h2>
              <p className="text-xs text-muted-foreground mb-4">Sign in to save favorites, report updates, and more.</p>
              <button
                onClick={() => navigate('/auth')}
                className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 mx-auto active:scale-[0.97] transition-transform"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            </>
          )}
        </motion.div>

        {/* Settings */}
        <div className="space-y-2">
          {/* Theme toggle */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <span className="text-sm font-semibold text-card-foreground">Dark Mode</span>
                <p className="text-xs text-muted-foreground">{isDark ? 'On' : 'Off'}</p>
              </div>
            </div>
            <button
              onClick={toggle}
              className={`w-12 h-7 rounded-full transition-colors relative ${isDark ? 'bg-primary' : 'bg-secondary'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-card shadow absolute top-1 transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </motion.div>

          {/* Location permission */}
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            onClick={requestLocation}
            className="w-full bg-card rounded-xl p-4 border border-border flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <span className="text-sm font-semibold text-card-foreground">Location</span>
              <p className="text-xs text-muted-foreground">
                {permissionStatus === 'granted' ? 'Enabled ✓' : permissionStatus === 'denied' ? 'Denied — tap to retry' : 'Tap to enable'}
              </p>
            </div>
          </motion.button>

          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="w-full bg-card rounded-xl p-4 border border-border flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <span className="text-sm font-semibold text-card-foreground">{item.label}</span>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground pt-4">FuelFinder NG v2.0 · Made in Lagos 🇳🇬</p>
      </div>
    </div>
  );
}
