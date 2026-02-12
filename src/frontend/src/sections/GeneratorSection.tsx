import { forwardRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Wand2, Shuffle, Copy, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useAppContext } from '../App';
import { generateBirthdayPack } from '../features/generator/generateBirthdayPack';
import { randomizeForm } from '../features/generator/randomize';
import { formatBirthdayPack } from '../features/generator/format';
import { copyToClipboard } from '../lib/clipboard';
import { createWhatsAppLink } from '../lib/whatsapp';
import { RELATIONSHIPS, TONES, LANGUAGES, PERSONALITIES } from '../features/generator/constants';
import { useMessageQuota } from '../features/quota/useMessageQuota';
import { toast } from 'sonner';

interface GeneratorSectionProps {
  nameInputRef: React.RefObject<HTMLInputElement>;
}

export const GeneratorSection = forwardRef<HTMLDivElement, GeneratorSectionProps>(
  ({ nameInputRef }, ref) => {
    const { formData, setFormData, setOutputs, isAuthenticated, demoMode, openPricingModal } = useAppContext();
    const [nameError, setNameError] = useState('');
    const quotaQuery = useMessageQuota();

    const isGeneratorEnabled = (isAuthenticated && quotaQuery.canGenerate) || demoMode;

    const handleGenerate = async () => {
      if (!formData.name.trim()) {
        setNameError('Name is required');
        nameInputRef.current?.focus();
        return;
      }
      setNameError('');

      // Check quota for authenticated users
      if (isAuthenticated && !quotaQuery.canGenerate) {
        toast.error('Daily limit reached', {
          description: 'Upgrade to Pro for unlimited messages.',
        });
        openPricingModal('pro');
        return;
      }

      // Record generation
      if (isAuthenticated) {
        try {
          await quotaQuery.recordGeneration();
        } catch (error: any) {
          if (error.message.includes('quota exceeded')) {
            toast.error('Daily limit reached', {
              description: 'Upgrade to Pro for unlimited messages.',
            });
            openPricingModal('pro');
            return;
          }
        }
      } else if (!demoMode) {
        // Anonymous user not in demo mode
        if (quotaQuery.remaining <= 0) {
          toast.error('Daily limit reached', {
            description: 'Sign in or upgrade to continue.',
          });
          return;
        }
        await quotaQuery.recordGeneration();
      }

      const pack = generateBirthdayPack(formData);
      setOutputs(pack);
      toast.success('Birthday Pack generated!');
      
      setTimeout(() => {
        document.getElementById('outputs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };

    const handleSurpriseMe = async () => {
      if (!isGeneratorEnabled && !demoMode) {
        if (!isAuthenticated) {
          toast.error('Sign in required', {
            description: 'Please sign in to use Surprise Me.',
          });
          return;
        }
        if (!quotaQuery.canGenerate) {
          toast.error('Daily limit reached', {
            description: 'Upgrade to Pro for unlimited messages.',
          });
          openPricingModal('pro');
          return;
        }
      }

      const randomized = randomizeForm(formData.name);
      setFormData(randomized);
      setNameError('');

      // Record generation for authenticated users
      if (isAuthenticated && !demoMode) {
        try {
          await quotaQuery.recordGeneration();
        } catch (error: any) {
          if (error.message.includes('quota exceeded')) {
            toast.error('Daily limit reached', {
              description: 'Upgrade to Pro for unlimited messages.',
            });
            openPricingModal('pro');
            return;
          }
        }
      } else if (!demoMode && !isAuthenticated) {
        if (quotaQuery.remaining <= 0) {
          toast.error('Daily limit reached', {
            description: 'Sign in or upgrade to continue.',
          });
          return;
        }
        await quotaQuery.recordGeneration();
      }

      setTimeout(() => {
        const pack = generateBirthdayPack(randomized);
        setOutputs(pack);
        toast.success('Surprise! Birthday Pack generated!');
        setTimeout(() => {
          document.getElementById('outputs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }, 300);
    };

    const handleCopyAll = () => {
      if (!formData.name.trim()) {
        setNameError('Name is required');
        nameInputRef.current?.focus();
        return;
      }
      setNameError('');
      const pack = generateBirthdayPack(formData);
      const formatted = formatBirthdayPack(pack);
      copyToClipboard(formatted);
      toast.success('Birthday Pack copied to clipboard!');
    };

    const handleShareWhatsApp = () => {
      if (!formData.name.trim()) {
        setNameError('Name is required');
        nameInputRef.current?.focus();
        return;
      }
      setNameError('');
      const pack = generateBirthdayPack(formData);
      const formatted = formatBirthdayPack(pack);
      const url = createWhatsAppLink(formatted);
      window.open(url, '_blank');
    };

    return (
      <section ref={ref} className="section-padding px-4 sm:px-6 lg:px-8">
        <div className="section-container max-w-5xl">
          <Reveal>
            <Card className="bg-card/60 backdrop-blur-sm border-neon-purple/20 shadow-card">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-2">
                    <CardTitle className="section-heading text-3xl bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
                      Create Your Birthday Pack
                    </CardTitle>
                    <CardDescription className="section-subheading text-base">
                      Fill in the details to generate a personalized birthday wish
                    </CardDescription>
                  </div>
                  {demoMode ? (
                    <Badge variant="outline" className="border-neon-purple/50 text-neon-purple">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Demo Mode
                    </Badge>
                  ) : isAuthenticated && (
                    <Badge variant="outline" className="border-neon-green/50 text-neon-green">
                      {quotaQuery.remaining === 999999 ? '∞' : quotaQuery.remaining} / {quotaQuery.total === 999999 ? '∞' : quotaQuery.total} today
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Demo mode info */}
                {demoMode && (
                  <Alert className="border-neon-purple/30 bg-neon-purple/5">
                    <Sparkles className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      You're in Demo mode. Sign in to unlock all features including card downloads.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Quota warning */}
                {!demoMode && isAuthenticated && quotaQuery.remaining <= 1 && quotaQuery.remaining !== 999999 && (
                  <Alert className="border-neon-purple/30 bg-neon-purple/5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      You have {quotaQuery.remaining} message{quotaQuery.remaining !== 1 ? 's' : ''} remaining today. Upgrade to Pro for unlimited messages.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      ref={nameInputRef}
                      placeholder="Enter the birthday person's name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={nameError ? 'border-destructive' : ''}
                    />
                    {nameError && <p className="text-xs text-destructive">{nameError}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yourName" className="text-sm font-medium">
                      Your Name (Optional)
                    </Label>
                    <Input
                      id="yourName"
                      placeholder="Your name"
                      value={formData.yourName}
                      onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship" className="text-sm font-medium">
                      Relationship
                    </Label>
                    <Select
                      value={formData.relationship}
                      onValueChange={(value) => setFormData({ ...formData, relationship: value as typeof formData.relationship })}
                    >
                      <SelectTrigger id="relationship">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONSHIPS.map((rel) => (
                          <SelectItem key={rel} value={rel}>
                            {rel.charAt(0).toUpperCase() + rel.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone" className="text-sm font-medium">
                      Tone
                    </Label>
                    <Select
                      value={formData.tone}
                      onValueChange={(value) => setFormData({ ...formData, tone: value as typeof formData.tone })}
                    >
                      <SelectTrigger id="tone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TONES.map((tone) => (
                          <SelectItem key={tone} value={tone}>
                            {tone.charAt(0).toUpperCase() + tone.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-sm font-medium">
                      Language
                    </Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => setFormData({ ...formData, language: value as typeof formData.language })}
                    >
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personality" className="text-sm font-medium">
                      Personality
                    </Label>
                    <Select
                      value={formData.personality}
                      onValueChange={(value) => setFormData({ ...formData, personality: value as typeof formData.personality })}
                    >
                      <SelectTrigger id="personality">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PERSONALITIES.map((pers) => (
                          <SelectItem key={pers} value={pers}>
                            {pers.charAt(0).toUpperCase() + pers.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memory" className="text-sm font-medium">
                    Special Memory (Optional)
                  </Label>
                  <Textarea
                    id="memory"
                    placeholder="Share a special memory to make the wish more personal..."
                    value={formData.memory}
                    onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={!isGeneratorEnabled && !demoMode}
                    className="bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                  <Button
                    onClick={handleSurpriseMe}
                    disabled={!isGeneratorEnabled && !demoMode}
                    variant="outline"
                    className="border-neon-purple/50 hover:bg-neon-purple/10"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Surprise Me
                  </Button>
                  <Button
                    onClick={handleCopyAll}
                    variant="outline"
                    className="border-neon-green/50 hover:bg-neon-green/10"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </Button>
                  <Button
                    onClick={handleShareWhatsApp}
                    variant="outline"
                    className="border-neon-green/50 hover:bg-neon-green/10"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>
    );
  }
);

GeneratorSection.displayName = 'GeneratorSection';
