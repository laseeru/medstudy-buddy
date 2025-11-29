import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

export function StatsCard({ icon: Icon, label, value, variant = 'default' }: StatsCardProps) {
  const variantStyles = {
    default: 'bg-card border-border',
    primary: 'bg-primary/10 border-primary/20',
    secondary: 'bg-secondary/10 border-secondary/20',
    accent: 'bg-accent/20 border-accent/30',
  };

  const iconStyles = {
    default: 'text-muted-foreground bg-muted',
    primary: 'text-primary bg-primary/20',
    secondary: 'text-secondary bg-secondary/20',
    accent: 'text-accent-foreground bg-accent/30',
  };

  return (
    <div className={cn(
      'rounded-xl border p-5 shadow-card transition-all hover:shadow-elevated',
      variantStyles[variant]
    )}>
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
        iconStyles[variant]
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-semibold text-foreground font-serif">{value}</p>
    </div>
  );
}
