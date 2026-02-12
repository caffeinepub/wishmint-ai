import { forwardRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sparkles, Shuffle, Wand2, Loader2 } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useAppContext } from '../App';
import { generateBirthdayPack } from '../features/generator/generateBirthdayPack';
import { randomizeForm } from '../features/generator/randomize';
import { RELATIONSHIPS, TONES, LANGUAGES, PERSONALITIES } from '../features/generator/constants';
import { PromptModeInput } from '../features/promptStudio/components/PromptModeInput';
import { generateCardFromPrompt } from '../features/promptStudio/generateCardFromPrompt';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { toast } from 'sonner';
import type { GeneratorFormData } from '../features/generator/types';

interface GeneratorSectionProps {
  nameInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const GeneratorSection = forwardRef<HTMLDivElement, GeneratorSectionProps>(
  ({ nameInputRef }, ref) => {
    const { 
      formData, 
      setFormData, 
      setOutputs, 
      creationMode, 
      setCreationMode,
      promptStudioState,
      setPromptStudioState,
    } = useAppContext();
    const [isGenerating, setIsGenerating] = useState(false);
    const [promptText, setPromptText] = useState('');
    const prefersReducedMotion = usePrefersReducedMotion();

    const handleInputChange = (field: keyof GeneratorFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleRandomize = () => {
      const randomized = randomizeForm(formData.name);
      setFormData(randomized);
    };

    const handleQuickFormGenerate = async () => {
      if (!formData.name.trim()) {
        alert('Please enter a name');
        return;
      }

      setIsGenerating(true);
      
      // Simulate generation delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const pack = generateBirthdayPack(formData);
      setOutputs(pack);
      setIsGenerating(false);

      // Scroll to output section
      setTimeout(() => {
        const outputSection = document.querySelector('#output-section');
        if (outputSection) {
          outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    };

    const handlePromptGenerate = async () => {
      // Validation
      if (promptText.trim().length < 10) {
        toast.error('Please describe your card idea (min 10 characters).');
        return;
      }

      // Prevent double-click
      if (isGenerating) {
        return;
      }

      setIsGenerating(true);
      
      try {
        // Call AI generation
        const response = await generateCardFromPrompt(promptText);
        
        // Validate response
        if (!response.variations || response.variations.length !== 3) {
          throw new Error('Invalid response format');
        }

        // Validate each variation has required fields
        for (const variation of response.variations) {
          if (!variation.title || !variation.mainText || !variation.footerText) {
            throw new Error('Missing required fields in variation');
          }
        }

        // Update state with 3 variations
        setPromptStudioState({
          ...promptStudioState,
          prompt: promptText,
          aiVariations: response.variations,
          selectedVariationIndex: 0,
          regenerateCounter: promptStudioState.regenerateCounter + 1,
        });
        
        // Clear Quick Form outputs to show Prompt Studio outputs
        setOutputs(null);
        
        // Auto-scroll to Card Preview
        setTimeout(() => {
          const cardPreview = document.querySelector('#card-preview-section');
          if (cardPreview) {
            cardPreview.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } catch (error) {
        console.error('Card generation error:', error);
        toast.error('Couldn\'t generate card. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    };

    return (
      <section id="create-wish" ref={ref} className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8 section-transition" style={{ backgroundColor: 'oklch(var(--background-secondary))' }}>
        <Reveal className="max-w-3xl mx-auto">
          <Card className="glass-card border-border/40 rounded-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-brand-purple/30 mx-auto">
                <Sparkles className="w-4 h-4 text-brand-purple" />
                <span className="text-sm font-medium text-brand-purple">AI Card Studio</span>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold">Create Your Card</CardTitle>
              
              <Tabs value={creationMode} onValueChange={(value) => setCreationMode(value as 'quick-form' | 'prompt-studio')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                  <TabsTrigger value="quick-form">Quick Form Mode</TabsTrigger>
                  <TabsTrigger value="prompt-studio">
                    <Wand2 className="w-4 h-4 mr-2" />
                    Create Card With AI Prompt
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {creationMode === 'quick-form' ? (
                <>
                  <p className="text-sm text-center" style={{ color: 'oklch(var(--text-body))' }}>
                    Fill in the details below to generate a personalized birthday message
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Birthday Person's Name *</Label>
                    <Input
                      id="name"
                      ref={nameInputRef}
                      placeholder="e.g., Sarah"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-background/50 border-border/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yourName">Your Name (Optional)</Label>
                    <Input
                      id="yourName"
                      placeholder="e.g., John"
                      value={formData.yourName}
                      onChange={(e) => handleInputChange('yourName', e.target.value)}
                      className="bg-background/50 border-border/40"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Select value={formData.relationship} onValueChange={(value) => handleInputChange('relationship', value)}>
                        <SelectTrigger id="relationship" className="bg-background/50 border-border/40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RELATIONSHIPS.map((rel) => (
                            <SelectItem key={rel} value={rel}>
                              {rel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tone">Tone</Label>
                      <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                        <SelectTrigger id="tone" className="bg-background/50 border-border/40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TONES.map((tone) => (
                            <SelectItem key={tone} value={tone}>
                              {tone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                        <SelectTrigger id="language" className="bg-background/50 border-border/40">
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
                      <Label htmlFor="personality">Personality</Label>
                      <Select value={formData.personality} onValueChange={(value) => handleInputChange('personality', value)}>
                        <SelectTrigger id="personality" className="bg-background/50 border-border/40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PERSONALITIES.map((pers) => (
                            <SelectItem key={pers} value={pers}>
                              {pers}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memory">Special Memory (Optional)</Label>
                    <Textarea
                      id="memory"
                      placeholder="Share a special memory or inside joke..."
                      value={formData.memory}
                      onChange={(e) => handleInputChange('memory', e.target.value)}
                      rows={3}
                      className="bg-background/50 border-border/40 resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={handleRandomize}
                      variant="outline"
                      className="flex-1"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Surprise Me
                    </Button>
                    <Button
                      type="button"
                      onClick={handleQuickFormGenerate}
                      disabled={isGenerating}
                      className="flex-1 premium-button"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate Wishes'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-center" style={{ color: 'oklch(var(--text-body))' }}>
                    Describe your card or invitation idea and let AI create it for you
                  </p>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handlePromptGenerate();
                  }}>
                    <PromptModeInput
                      value={promptText}
                      onChange={setPromptText}
                      onGenerate={handlePromptGenerate}
                      isGenerating={isGenerating}
                    />
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </Reveal>
      </section>
    );
  }
);

GeneratorSection.displayName = 'GeneratorSection';
