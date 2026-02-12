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
        'WhatsApp sharing',
        'Community access',
      ],
      cta: 'Get Started',
      variant: 'outline' as const,
      highlight: false,
    },
    {
      name: 'Pro',
      price: '₹99',
      period: 'per month',
      icon: Zap,
      features: [
        'Unlimited messages',
        'Premium templates',
        'Card downloads',
        'Surprise Mode',
        'Priority support',
      ],
      cta: 'Upgrade to Pro',
      variant: 'default' as const,
      highlight: true,
    },
    {
      name: 'Creator',
      price: '₹299',
      period: 'per month',
      icon: Crown,
      features: [
        'Everything in Pro',
        'Sell templates',
        'Marketplace access',
        'Creator dashboard',
        'Revenue sharing',
      ],
      cta: 'Become a Creator',
      variant: 'outline' as const,
      highlight: false,
    },
  ];

  return (
    <section ref={ref} className="w-full section-padding px-4 sm:px-6 lg:px-8">
      <div className="section-container max-w-7xl">
        <Reveal>
          <div className="text-center mb-12 space-y-3">
            <h2 className="section-heading bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="section-subheading">
              Unlock more features and create unlimited wishes
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Reveal key={plan.name} delay={index * 0.1}>
                <Card
                  className={`relative bg-card/60 backdrop-blur-sm border-neon-purple/20 shadow-card h-full flex flex-col ${
                    plan.highlight ? 'ring-2 ring-neon-purple' : ''
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-neon-purple to-neon-green text-white border-0">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center space-y-4 pb-6">
                    <div className="mx-auto w-12 h-12 rounded-full bg-neon-purple/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-neon-purple" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <div className="mt-3">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => openPricingModal(plan.name.toLowerCase() as 'pro' | 'creator')}
                      variant={plan.variant}
                      className={
                        plan.variant === 'default'
                          ? 'w-full bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold'
                          : 'w-full border-neon-purple/50 hover:bg-neon-purple/10'
                      }
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.4}>
          <Card className="bg-card/60 backdrop-blur-sm border-neon-purple/20 shadow-card overflow-x-auto">
            <CardHeader>
              <CardTitle className="text-center">Feature Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">Feature</th>
                      <th className="text-center py-3 px-4">Free</th>
                      <th className="text-center py-3 px-4">Pro</th>
                      <th className="text-center py-3 px-4">Creator</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Messages per day</td>
                      <td className="text-center py-3 px-4">3</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Templates</td>
                      <td className="text-center py-3 px-4">Basic</td>
                      <td className="text-center py-3 px-4">Premium</td>
                      <td className="text-center py-3 px-4">Premium</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Card Downloads</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-5 h-5 text-neon-green mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-5 h-5 text-neon-green mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Surprise Mode</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-5 h-5 text-neon-green mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Check className="w-5 h-5 text-neon-green mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Marketplace</td>
                      <td className="text-center py-3 px-4">Browse</td>
                      <td className="text-center py-3 px-4">Browse</td>
                      <td className="text-center py-3 px-4">Sell</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
});

PricingSection.displayName = 'PricingSection';
