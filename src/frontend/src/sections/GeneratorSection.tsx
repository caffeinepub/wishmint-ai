import { forwardRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Wand2, Shuffle, Copy, Share2, Sparkles } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { PlanStatus } from '../components/PlanStatus';
import { useAppContext } from '../App';
import { generateBirthdayPack } from '../features/generator/generateBirthdayPack';
import { randomizeForm } from '../features/generator/randomize';
import { formatBirthdayPack } from '../features/generator/format';
import { copyToClipboard } from '../lib/clipboard';
import { createWhatsAppLink } from '../lib/whatsapp';
import { RELATIONSHIPS, TONES, LANGUAGES, PERSONALITIES } from '../features/generator/constants';
import { toast } from 'sonner';

interface GeneratorSectionProps {
  nameInputRef: React.RefObject<HTMLInputElement>;
}

export const GeneratorSection = forwardRef<HTMLDivElement, GeneratorSectionProps>(
  ({ nameInputRef }, ref) => {
    const { formData, setFormData, setOutputs, isAuthenticated, selectedPlan, demoMode } = useAppContext();
    const [nameError, setNameError] = useState('');

    // Generator is enabled if user is authenticated with a plan OR in demo mode
    const isGeneratorEnabled = (isAuthenticated && !!selectedPlan) || demoMode;

    const handleGenerate = () => {
      if (!isGeneratorEnabled) return;
      
      if (!formData.name.trim()) {
        setNameError('Name is required');
        nameInputRef.current?.focus();
        return;
      }
      setNameError('');
      const pack = generateBirthdayPack(formData);
      setOutputs(pack);
      toast.success('Birthday Pack generated!');
      
      // Scroll to outputs
      setTimeout(() => {
        document.getElementById('outputs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    };

    const handleSurpriseMe = () => {
      if (!isGeneratorEnabled) return;
      
      const randomized = randomizeForm(formData.name);
      setFormData(randomized);
      setNameError('');
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
      if (!isGeneratorEnabled) return;
      
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
      if (!isGeneratorEnabled) return;
      
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
                  ) : (
                    selectedPlan && <PlanStatus plan={selectedPlan} />
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

                {/* Gating alert for non-demo users */}
                {!isGeneratorEnabled && (
                  <Alert className="border-neon-purple/30 bg-neon-purple/5">
                    <AlertDescription className="text-sm">
                      {!isAuthenticated
                        ? 'Try the demo or sign in to generate wishes.'
                        : 'Select a plan to continue.'}
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
                      placeholder="Enter their name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        setNameError('');
                      }}
                      className={`h-11 ${nameError ? 'border-destructive' : ''}`}
                      disabled={!isGeneratorEnabled}
                    />
                    {nameError && <p className="text-xs text-destructive">{nameError}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yourName" className="text-sm font-medium">
                      Your Name (optional)
                    </Label>
                    <Input
                      id="yourName"
                      placeholder="Your name"
                      value={formData.yourName}
                      onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                      className="h-11"
                      disabled={!isGeneratorEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship" className="text-sm font-medium">
                      Relationship
                    </Label>
                    <Select
                      value={formData.relationship}
                      onValueChange={(value) => setFormData({ ...formData, relationship: value as any })}
                      disabled={!isGeneratorEnabled}
                    >
                      <SelectTrigger className="h-11">
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
                      onValueChange={(value) => setFormData({ ...formData, tone: value as any })}
                      disabled={!isGeneratorEnabled}
                    >
                      <SelectTrigger className="h-11">
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
                      onValueChange={(value) => setFormData({ ...formData, language: value as any })}
                      disabled={!isGeneratorEnabled}
                    >
                      <SelectTrigger className="h-11">
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
                      onValueChange={(value) => setFormData({ ...formData, personality: value as any })}
                      disabled={!isGeneratorEnabled}
                    >
                      <SelectTrigger className="h-11">
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
                    Special Memory (optional)
                  </Label>
                  <Textarea
                    id="memory"
                    placeholder="Share a special memory to make it more personal..."
                    value={formData.memory}
                    onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
                    className="min-h-[100px] resize-none"
                    disabled={!isGeneratorEnabled}
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    onClick={handleGenerate}
                    size="lg"
                    className="flex-1 min-w-[200px] bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 h-11"
                    disabled={!isGeneratorEnabled}
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate
                  </Button>
                  <Button
                    onClick={handleSurpriseMe}
                    size="lg"
                    variant="outline"
                    className="flex-1 min-w-[200px] h-11"
                    disabled={!isGeneratorEnabled}
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Surprise Me
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleCopyAll}
                    variant="outline"
                    className="flex-1 min-w-[150px] h-10"
                    disabled={!isGeneratorEnabled}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </Button>
                  <Button
                    onClick={handleShareWhatsApp}
                    variant="outline"
                    className="flex-1 min-w-[150px] h-10"
                    disabled={!isGeneratorEnabled}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share on WhatsApp
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
