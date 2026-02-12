import { forwardRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wand2, Shuffle, Copy, Share2 } from 'lucide-react';
import { Reveal } from '../components/Reveal';
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
    const { formData, setFormData, setOutputs } = useAppContext();
    const [nameError, setNameError] = useState('');

    const handleGenerate = () => {
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
      <section ref={ref} className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <Card className="bg-card/50 backdrop-blur-sm border-neon-purple/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
                  Create Your Birthday Pack
                </CardTitle>
                <CardDescription className="text-base">
                  Fill in the details to generate a personalized birthday wish
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium">
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
                      className={`h-12 ${nameError ? 'border-destructive' : ''}`}
                    />
                    {nameError && <p className="text-sm text-destructive">{nameError}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yourName" className="text-base font-medium">
                      Your Name (optional)
                    </Label>
                    <Input
                      id="yourName"
                      placeholder="Your name"
                      value={formData.yourName}
                      onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship" className="text-base font-medium">
                      Relationship
                    </Label>
                    <Select
                      value={formData.relationship}
                      onValueChange={(value) => setFormData({ ...formData, relationship: value as any })}
                    >
                      <SelectTrigger className="h-12">
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
                    <Label htmlFor="tone" className="text-base font-medium">
                      Tone
                    </Label>
                    <Select
                      value={formData.tone}
                      onValueChange={(value) => setFormData({ ...formData, tone: value as any })}
                    >
                      <SelectTrigger className="h-12">
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
                    <Label htmlFor="language" className="text-base font-medium">
                      Language
                    </Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => setFormData({ ...formData, language: value as any })}
                    >
                      <SelectTrigger className="h-12">
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
                    <Label htmlFor="personality" className="text-base font-medium">
                      Personality
                    </Label>
                    <Select
                      value={formData.personality}
                      onValueChange={(value) => setFormData({ ...formData, personality: value as any })}
                    >
                      <SelectTrigger className="h-12">
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
                  <Label htmlFor="memory" className="text-base font-medium">
                    Add 1 personal memory line (optional)
                  </Label>
                  <Textarea
                    id="memory"
                    placeholder="E.g., Remember that time we laughed until we cried at the beach?"
                    value={formData.memory}
                    onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
                    className="min-h-24 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  <Button
                    onClick={handleGenerate}
                    className="bg-gradient-to-r from-neon-purple to-neon-green hover:opacity-90 text-white font-semibold h-12 rounded-xl shadow-neon"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate
                  </Button>

                  <Button
                    onClick={handleSurpriseMe}
                    variant="outline"
                    className="border-neon-green/50 hover:bg-neon-green/10 h-12 rounded-xl"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Surprise Me
                  </Button>

                  <Button
                    onClick={handleCopyAll}
                    variant="outline"
                    className="border-neon-purple/50 hover:bg-neon-purple/10 h-12 rounded-xl"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </Button>

                  <Button
                    onClick={handleShareWhatsApp}
                    variant="outline"
                    className="border-neon-green/50 hover:bg-neon-green/10 h-12 rounded-xl"
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
