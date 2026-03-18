import { ShieldCheck, ShieldAlert, ShieldQuestion, Clock } from 'lucide-react';

const config: Record<string, { icon: React.ElementType; label: string; cls: string }> = {
  high: { icon: ShieldCheck, label: 'High Confidence', cls: 'bg-fuel-available/15 text-fuel-available' },
  medium: { icon: ShieldAlert, label: 'Medium Confidence', cls: 'bg-fuel-limited/15 text-fuel-limited' },
  low: { icon: ShieldQuestion, label: 'Low Confidence', cls: 'bg-muted text-muted-foreground' },
  outdated: { icon: Clock, label: 'Outdated', cls: 'bg-fuel-unavailable/15 text-fuel-unavailable' },
};

export default function ConfidenceBadge({ level, reportCount }: { level: string; reportCount?: number }) {
  const c = config[level] || config.low;
  const Icon = c.icon;
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${c.cls}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{c.label}</span>
      {reportCount != null && reportCount > 0 && (
        <span className="opacity-70">· {reportCount} report{reportCount !== 1 ? 's' : ''}</span>
      )}
    </div>
  );
}
