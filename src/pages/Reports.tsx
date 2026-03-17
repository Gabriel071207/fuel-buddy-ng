import { BarChart3, TrendingUp, Fuel, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const reports = [
  { icon: Fuel, title: 'Fuel Availability', desc: 'Track which stations have fuel across Lagos', value: '68%', sub: 'stations with petrol' },
  { icon: TrendingUp, title: 'Price Trends', desc: 'Average petrol price in Lagos today', value: '₦612', sub: 'per litre avg.' },
  { icon: Users, title: 'Community Reports', desc: 'User-submitted updates in last 24 hours', value: '1,247', sub: 'reports today' },
  { icon: BarChart3, title: 'Queue Index', desc: 'Overall queue status across Lagos stations', value: 'Medium', sub: 'avg. wait ~25 mins' },
];

export default function Reports() {
  return (
    <div className="min-h-screen pb-24 pt-16">
      <div className="container px-4 py-4 space-y-4 max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-lg font-bold text-foreground">Reports & Insights</h1>
          <p className="text-xs text-muted-foreground">Real-time fuel intelligence for Lagos</p>
        </motion.div>

        <div className="space-y-3">
          {reports.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl p-4 border border-border"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <r.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-card-foreground">{r.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">{r.value}</span>
                    <span className="text-xs text-muted-foreground">{r.sub}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
