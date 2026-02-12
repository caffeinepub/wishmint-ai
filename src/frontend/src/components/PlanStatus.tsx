import { Badge } from '@/components/ui/badge';
import { Crown, Sparkles } from 'lucide-react';
import type { Plan } from '../hooks/usePlanSelection';

interface PlanStatusProps {
  plan: Plan;
  className?: string;
}

/**
 * Displays the current selected plan with an icon and label.
 */
export function PlanStatus({ plan, className = '' }: PlanStatusProps) {
  if (!plan) return null;

  return (
    <Badge
      variant="outline"
      className={`border-neon-purple/50 bg-neon-purple/10 text-neon-purple ${className}`}
    >
      {plan === 'pro' ? (
        <>
          <Crown className="w-3 h-3 mr-1" />
          Current plan: Pro
        </>
      ) : (
        <>
          <Sparkles className="w-3 h-3 mr-1" />
          Current plan: Free
        </>
      )}
    </Badge>
  );
}
