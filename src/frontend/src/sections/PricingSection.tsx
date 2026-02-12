import { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useAppContext } from '../App';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export const PricingSection = forwardRef<HTMLDivElement>((props, ref) => {
  const { openPricingModal } = useAppContext();
  const prefersReducedMotion = usePrefersReducedMotion();

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      icon: Sparkles,
      features: [
        '3 messages per day',
        'Basic templates',
        'Standard export',
        'Community access',
      ],
      cta: 'Current Plan',
      highlight: false,
      plan: null,
    },
    {
      name: 'Pro',
      price: '₹49',
      period: 'per month',
      icon: Zap,
      features: [
        'Unlimited messages',
        'Premium templates',
        'HD export',
        'Surprise Mode',
        'Priority support',
      ],
      cta: 'Upgrade to Pro',
      highlight: true,
      plan: 'pro' as const,
    },
    {
      name: 'Creator',
      price: '₹149',
      period: 'per month',
      icon: Crown,
      features: [
        'Everything in Pro',
        'Marketplace access',
        'Sell templates',
        'Creator analytics',
        'Revenue sharing',
      ],
      cta: 'Upgrade to Creator',
      highlight: false,
      plan: 'creator' as const,
    },
  ];

  return (
    <section id="pricing" ref={ref} className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8 section-transition" style={{ backgroundColor: 'oklch(var(--background-secondary))' }}>
      <Reveal className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-brand-purple/30">
            <Crown className="w-4 h-4 text-brand-purple" />
            <span className="text-sm font-medium text-brand-purple">Pricing Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold brand-gradient-text">
            Choose Your Plan
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'oklch(var(--text-body))' }}>
            Start free, upgrade when you need more
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`relative overflow-hidden transition-all rounded-2xl ${
                  plan.highlight
                    ? 'glass-card border-brand-purple shadow-glow-brand ring-2 ring-brand-purple/20'
                    : 'glass-card border-border/40'
                } ${prefersReducedMotion ? '' : 'hover:scale-105'}`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 right-0 brand-gradient text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center space-y-4 pb-8">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-brand-purple/20 to-brand-green/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-brand-purple" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold brand-gradient-text">
                        {plan.price}
                      </span>
                      <span className="text-sm" style={{ color: 'oklch(var(--text-body))' }}>/{plan.period}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                        <span className="text-sm" style={{ color: 'oklch(var(--text-body))' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    type="button"
                    onClick={() => plan.plan && openPricingModal(plan.plan)}
                    disabled={!plan.plan}
                    className={`w-full py-6 font-semibold transition-all rounded-full ${
                      plan.highlight
                        ? `btn-primary-gradient text-white ${prefersReducedMotion ? '' : 'hover:scale-105'}`
                        : 'btn-secondary-gradient'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
});

PricingSection.displayName = 'PricingSection';
