import { User, Settings, Shield, Bell, HelpCircle, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: Bell, label: 'Notifications', desc: 'Manage alerts & push notifications' },
  { icon: Shield, label: 'Privacy & Security', desc: 'Account security settings' },
  { icon: Settings, label: 'Settings', desc: 'App preferences' },
  { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs and contact support' },
];

export default function Profile() {
  return (
    <div className="min-h-screen pb-24 pt-16">
      <div className="container px-4 py-4 space-y-4 max-w-lg mx-auto">
        {/* Guest prompt */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 border border-border text-center"
        >
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-base font-bold text-card-foreground mb-1">Welcome, Guest</h2>
          <p className="text-xs text-muted-foreground mb-4">Sign in to save favorites, report updates, and more.</p>
          <button className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 mx-auto active:scale-[0.97] transition-transform">
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        </motion.div>

        {/* Menu items */}
        <div className="space-y-2">
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

        <p className="text-center text-xs text-muted-foreground pt-4">FuelFinder NG v1.0 · Made in Lagos 🇳🇬</p>
      </div>
    </div>
  );
}
