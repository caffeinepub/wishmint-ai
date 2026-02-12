import { Badge } from '@/components/ui/badge';
import { Crown, Sparkles, Zap } from 'lucide-react';
import type { PlanType } from '../backend';

interface PlanStatusProps {
  plan: PlanType;
  className?: string;
}

export function PlanStatus({ plan, className = '' }: PlanStatusProps) {
  if (plan === 'free') {
    return (
      <Badge
        variant="outline"
        className={`border-muted-foreground/50 bg-muted/10 text-muted-foreground ${className}`}
      >
        <Sparkles className="w-3 h-3 mr-1" />
        Free Plan
      </Badge>
    );
  }

  if (plan === 'pro') {
    return (
      <Badge
        variant="outline"
        className={`border-neon-purple/50 bg-neon-purple/10 text-neon-purple ${className}`}
      >
        <Zap className="w-3 h-3 mr-1" />
        Pro Plan
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={`border-neon-green/50 bg-neon-green/10 text-neon-green ${className}`}
    >
      <Crown className="w-3 h-3 mr-1" />
      Creator Plan
    </Badge>
  );
}
