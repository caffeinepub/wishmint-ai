import { forwardRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wand2, Shuffle, Copy, Share2, Lock } from 'lucide-react';
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
    const { formData, setFormData, setOutputs, isAuthenticated, selectedPlan } = useAppContext();
    const [nameError, setNameError] = useState('');

    const isGeneratorEnabled = isAuthenticated && !!selectedPlan;

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
                  {selectedPlan && <PlanStatus plan={selectedPlan} />}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Gating alert */}
                {!isGeneratorEnabled && (
                  <Alert className="border-neon-purple/30 bg-neon-purple/5">
                    <Lock className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {!isAuthenticated
                        ? 'Please sign in to generate wishes.'
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
                    Add 1 personal memory line (optional)
                  </Label>
                  <Textarea
                    id="memory"
                    placeholder="E.g., Remember that time we laughed until we cried at the beach?"
                    value={formData.memory}
                    onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
                    className="min-h-20 resize-none"
                    disabled={!isGeneratorEnabled}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={!isGeneratorEnabled}
                    className="bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold h-11 rounded-lg shadow-neon disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate
                  </Button>

                  <Button
                    onClick={handleSurpriseMe}
                    disabled={!isGeneratorEnabled}
                    variant="outline"
                    className="border-neon-green/50 hover:bg-neon-green/10 h-11 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Surprise Me
                  </Button>

                  <Button
                    onClick={handleCopyAll}
                    disabled={!isGeneratorEnabled}
                    variant="outline"
                    className="border-neon-purple/50 hover:bg-neon-purple/10 h-11 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </Button>

                  <Button
                    onClick={handleShareWhatsApp}
                    disabled={!isGeneratorEnabled}
                    variant="outline"
                    className="border-neon-green/50 hover:bg-neon-green/10 h-11 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    WhatsApp
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
