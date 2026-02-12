import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useAppContext } from '../App';

const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    features: [
      '3 wishes per day',
      'Basic templates',
      'Standard export',
      'Community access',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '₹49',
    period: 'per month',
    features: [
      'Unlimited wishes',
      'Premium templates',
      'HD export',
      'Priority support',
      'Surprise Mode',
      'No watermarks',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    name: 'Creator',
    price: '₹149',
    period: 'per month',
    features: [
      'Everything in Pro',
      'Sell your templates',
      'Creator dashboard',
      'Revenue analytics',
      'Featured listings',
    ],
    cta: 'Become a Creator',
    highlighted: false,
  },
];

export function PricingSection() {
  const { openPricingModal } = useAppContext();

  return (
    <section id="pricing" className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8 section-transition" style={{ backgroundColor: 'oklch(var(--background-secondary))' }}>
      <Reveal className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-brand-purple/30">
            <Sparkles className="w-4 h-4 text-brand-purple" />
            <span className="text-sm font-medium text-brand-purple">Simple Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold brand-gradient-text">Choose Your Plan</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'oklch(var(--text-body))' }}>
            Start free, upgrade when you need more
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`glass-card border-border/40 rounded-2xl ${
                plan.highlighted ? 'ring-2 ring-brand-purple shadow-lg shadow-brand-purple/20' : ''
              }`}
            >
              <CardHeader className="text-center space-y-2">
                {plan.highlighted && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-medium mx-auto">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                )}
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="space-y-1">
                  <div className="text-4xl font-bold brand-gradient-text">{plan.price}</div>
                  <CardDescription>{plan.period}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={openPricingModal}
                  className={`w-full ${plan.highlighted ? 'premium-button' : ''}`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
