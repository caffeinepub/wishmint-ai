import { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useAppContext } from '../App';

export const PricingSection = forwardRef<HTMLDivElement>((props, ref) => {
  const { openPricingModal } = useAppContext();

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
    <section id="pricing" ref={ref} className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <Reveal className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 mb-2">
            <Crown className="w-4 h-4 text-neon-purple" />
            <span className="text-sm font-medium text-neon-purple">Pricing Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you need more
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`relative overflow-hidden transition-all hover:scale-105 ${
                  plan.highlight
                    ? 'border-neon-purple shadow-neon ring-2 ring-neon-purple/20'
                    : 'border-border/40'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-neon-purple to-neon-green text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center space-y-4 pb-8">
                  <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-neon-purple/20 to-neon-green/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-neon-purple" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-sm text-muted-foreground">/{plan.period}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    type="button"
                    onClick={() => plan.plan && openPricingModal(plan.plan)}
                    disabled={!plan.plan}
                    className={`w-full py-6 font-semibold transition-all ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white shadow-neon'
                        : 'bg-muted hover:bg-muted/80'
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
