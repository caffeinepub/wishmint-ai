import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { PricingComparisonTable } from '../features/subscription/PricingComparisonTable';
import { useAppContext } from '../App';
import { PLAN_DEFINITIONS } from '../features/subscription/plans';

export const PricingSection = forwardRef<HTMLDivElement>((_, ref) => {
  const { openPricingModal } = useAppContext();

  return (
    <section ref={ref} className="section-padding px-4 sm:px-6 lg:px-8">
      <div className="section-container">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="section-heading bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="section-subheading mt-4">
              Unlock premium features and create unforgettable moments
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Free Plan */}
          <Reveal>
            <Card className="bg-card/60 backdrop-blur-sm border-border shadow-card">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-muted-foreground" />
                  <CardTitle>{PLAN_DEFINITIONS.free.name}</CardTitle>
                </div>
                <div className="text-3xl font-bold mb-2">{PLAN_DEFINITIONS.free.price}</div>
                <CardDescription>{PLAN_DEFINITIONS.free.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {PLAN_DEFINITIONS.free.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              </CardContent>
            </Card>
          </Reveal>

          {/* Pro Plan */}
          <Reveal>
            <Card className="bg-card/60 backdrop-blur-sm border-neon-purple shadow-neon relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-neon-purple to-neon-green text-white">
                  POPULAR
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-neon-purple" />
                  <CardTitle>{PLAN_DEFINITIONS.pro.name}</CardTitle>
                </div>
                <div className="text-3xl font-bold mb-2">{PLAN_DEFINITIONS.pro.price}</div>
                <CardDescription>{PLAN_DEFINITIONS.pro.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {PLAN_DEFINITIONS.pro.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-neon-purple mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => openPricingModal('pro')}
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold"
                >
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </Reveal>

          {/* Creator Plan */}
          <Reveal>
            <Card className="bg-card/60 backdrop-blur-sm border-neon-green/50 shadow-card">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-neon-green" />
                  <CardTitle>{PLAN_DEFINITIONS.creator.name}</CardTitle>
                </div>
                <div className="text-3xl font-bold mb-2">{PLAN_DEFINITIONS.creator.price}</div>
                <CardDescription>{PLAN_DEFINITIONS.creator.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {PLAN_DEFINITIONS.creator.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-neon-green mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => openPricingModal('creator')}
                  className="w-full bg-gradient-to-r from-neon-green to-neon-purple hover:opacity-90 text-white font-semibold"
                >
                  Upgrade to Creator
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        </div>

        <Reveal>
          <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold mb-6 text-center">Feature Comparison</h3>
            <PricingComparisonTable />
          </div>
        </Reveal>
      </div>
    </section>
  );
});

PricingSection.displayName = 'PricingSection';
