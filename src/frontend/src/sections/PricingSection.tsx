import { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useAppContext } from '../App';
import type { Plan } from '../hooks/usePlanSelection';

export const PricingSection = forwardRef<HTMLDivElement>((_, ref) => {
  const { selectedPlan, selectPlan } = useAppContext();

  const plans: { id: Plan; name: string; price: string; features: string[] }[] = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      features: [
        'Generate unlimited wishes',
        '5 output formats',
        '8 card templates',
        'All languages',
        'Copy & share',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'Coming Soon',
      features: [
        'Everything in Free',
        'Premium templates',
        'Priority generation',
        'Advanced customization',
        'Export in HD',
      ],
    },
  ];

  return (
    <section ref={ref} className="section-padding px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-neon-purple/5 to-background">
      <div className="section-container max-w-5xl">
        <Reveal>
          <div className="text-center mb-12 space-y-3">
            <h2 className="section-heading bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="section-subheading">
              Start creating personalized birthday wishes today
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {plans.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 0.1}>
              <Card
                className={`relative bg-card/70 backdrop-blur-sm transition-all shadow-card ${
                  selectedPlan === plan.id
                    ? 'border-neon-purple shadow-neon scale-105'
                    : 'border-neon-purple/20 hover:border-neon-purple/40'
                }`}
              >
                {plan.id === 'pro' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-neon-purple to-neon-green text-white border-0 px-3 py-1">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Coming Soon
                    </Badge>
                  </div>
                )}
                <CardHeader className="space-y-3 pb-4">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-3xl font-bold text-foreground">
                    {plan.price}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => selectPlan(plan.id)}
                    disabled={selectedPlan === plan.id}
                    className={`w-full h-11 font-semibold rounded-lg ${
                      selectedPlan === plan.id
                        ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple'
                        : 'bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white'
                    }`}
                    variant={selectedPlan === plan.id ? 'outline' : 'default'}
                  >
                    {selectedPlan === plan.id ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
});

PricingSection.displayName = 'PricingSection';
