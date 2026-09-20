import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type ValuationStatus = 'great' | 'fair' | 'overpriced' | 'pending';

interface ValuationBadgeProps {
  status: ValuationStatus;
}

export function ValuationBadge({ status }: ValuationBadgeProps) {
  if (status === 'pending') return null;

  let label = '';
  let colorClass = '';
  let dotClass = '';

  switch (status) {
    case 'great':
      label = 'Great Deal';
      colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
      dotClass = 'bg-emerald-500';
      break;
    case 'fair':
      label = 'Fair Price';
      colorClass = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
      dotClass = 'bg-amber-500';
      break;
    case 'overpriced':
      label = 'Overpriced';
      colorClass = 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      dotClass = 'bg-red-500';
      break;
  }

  return (
    <Badge variant="outline" className={cn("flex items-center gap-1.5 shadow-sm font-semibold rounded-full", colorClass)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", dotClass)}></span>
      {label}
    </Badge>
  );
}
