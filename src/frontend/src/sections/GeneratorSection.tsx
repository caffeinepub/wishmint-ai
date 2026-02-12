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
import type { Relationship, Tone, Language, Personality } from '../features/generator/types';

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
          action: {
            label: 'Upgrade',
            onClick: () => openPricingModal('pro'),
          },
        });
        return;
      }

      const pack = generateBirthdayPack(formData);
      setOutputs(pack);

      // Record generation for authenticated users
      if (isAuthenticated) {
        quotaQuery.recordGeneration();
      }

      toast.success('Birthday wish generated!', {
        description: 'Scroll down to see your personalized messages.',
      });
    };

    const handleRandomize = () => {
      const randomData = randomizeForm(formData.name);
      setFormData(randomData);
      toast.success('Form randomized!', {
        description: 'Try generating with these random values.',
      });
    };

    return (
      <section id="create-wish" ref={ref} className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
        <Reveal className="max-w-4xl mx-auto">
          <Card className="border-neon-purple/20 shadow-card">
            <CardHeader className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-6 h-6 text-neon-purple" />
                <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
                  Birthday Wish Generator
                </CardTitle>
              </div>
              <CardDescription className="text-base">
                Fill in the details below to create a personalized birthday message
              </CardDescription>
              {!isAuthenticated && (
                <Alert className="border-neon-purple/30 bg-neon-purple/5">
                  <AlertCircle className="h-4 w-4 text-neon-purple" />
                  <AlertDescription className="text-sm">
                    Demo mode: Sign in to save your wishes and unlock premium features
                  </AlertDescription>
                </Alert>
              )}
              {isAuthenticated && (
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="outline" className="border-neon-green/50 bg-neon-green/10 text-neon-green">
                    {quotaQuery.remaining} / {quotaQuery.total} messages remaining today
                  </Badge>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Birthday Person's Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    ref={nameInputRef}
                    placeholder="e.g., Sarah"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setNameError('');
                    }}
                    className={nameError ? 'border-destructive' : ''}
                  />
                  {nameError && <p className="text-sm text-destructive">{nameError}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yourName" className="text-sm font-medium">
                    Your Name (Optional)
                  </Label>
                  <Input
                    id="yourName"
                    placeholder="e.g., John"
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
                    onValueChange={(value) => setFormData({ ...formData, relationship: value as Relationship })}
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
                    onValueChange={(value) => setFormData({ ...formData, tone: value as Tone })}
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
                    onValueChange={(value) => setFormData({ ...formData, language: value as Language })}
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
                    onValueChange={(value) => setFormData({ ...formData, personality: value as Personality })}
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
                  placeholder="Share a special memory or inside joke to make it more personal..."
                  value={formData.memory}
                  onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!isGeneratorEnabled}
                  className="flex-1 bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold py-6 text-base shadow-neon transition-all hover:scale-105"
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate Wish
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRandomize}
                  className="border-neon-purple/50 hover:bg-neon-purple/10 py-6"
                >
                  <Shuffle className="w-5 h-5 mr-2" />
                  Surprise Me
                </Button>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </section>
    );
  }
);

GeneratorSection.displayName = 'GeneratorSection';
