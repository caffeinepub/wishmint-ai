import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import { Reveal } from '../components/Reveal';

export function PricingSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              Pricing
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose the plan that works for you
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Reveal delay={0.1}>
            <Card className="bg-card/50 backdrop-blur-sm border-neon-purple/20 hover:border-neon-purple/40 transition-all">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6 text-neon-purple" />
                  <CardTitle className="text-2xl">Free</CardTitle>
                </div>
                <CardDescription className="text-lg">Perfect for getting started</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/forever</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                    <span>Text generation for all wish types</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                    <span>Copy to clipboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                    <span>Share on WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                    <span>Basic templates</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full h-12 rounded-xl border-neon-purple/50">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={0.2}>
            <Card className="bg-gradient-to-br from-neon-purple/10 to-neon-green/10 border-neon-purple shadow-neon relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Crown className="w-8 h-8 text-neon-purple" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-6 h-6 text-neon-green" />
                  <CardTitle className="text-2xl">Pro</CardTitle>
                </div>
                <CardDescription className="text-lg">For the ultimate experience</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">$9.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                    <span>Unlimited premium templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                    <span>Export card images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                    <span>Premium styles & fonts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold">
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        </div>

        <Reveal delay={0.3}>
          <Card className="bg-card/30 backdrop-blur-sm border-neon-green/20">
            <CardHeader>
              <CardTitle className="text-xl text-center">Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-lg bg-neon-purple/5 border border-neon-purple/20">
                  <h4 className="font-semibold mb-2">🎤 Voice Wishes</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate personalized voice messages
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-neon-green/5 border border-neon-green/20">
                  <h4 className="font-semibold mb-2">🎬 Video Slideshow</h4>
                  <p className="text-sm text-muted-foreground">
                    Create beautiful video montages
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
