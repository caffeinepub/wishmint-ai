import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Share2, Download, Sparkles, Check } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useAppContext } from '../App';
import { formatBirthdayPack } from '../features/generator/format';
import { copyToClipboard } from '../lib/clipboard';
import { createWhatsAppLink } from '../lib/whatsapp';
import { exportCardToCanvas } from '../features/cardExport/canvasExport';
import { generateCardVariations } from '../features/cardExport/generateCardVariations';
import { CardVariationsCarousel } from '../features/cardExport/components/CardVariationsCarousel';
import { GenerationConfetti } from '../features/cardExport/components/GenerationConfetti';
import { PromptVariationsCarousel } from '../features/promptStudio/components/PromptVariationsCarousel';
import { PromptAnalysisSummary } from '../features/promptStudio/components/PromptAnalysisSummary';
import { PromptModeEditorPanel } from '../features/promptStudio/components/PromptModeEditorPanel';
import { PremiumComingSoonActions } from '../features/promptStudio/components/PremiumComingSoonActions';
import { getRecommendedTheme } from '../features/promptStudio/eventThemeMapping';
import { regenerateCardContent } from '../features/promptStudio/promptContentGeneration';
import { useEntitlements } from '../features/subscription/useEntitlements';
import { toast } from 'sonner';
import type { CardTheme } from '../features/cardExport/cardThemes';
import type { ToneType } from '../features/promptStudio/types';

export function OutputSection() {
  const { 
    outputs, 
    selectedTemplate, 
    openPremiumDesigner, 
    openPricingModal,
    creationMode,
    promptStudioState,
    setPromptStudioState,
    isAuthenticated,
  } = useAppContext();
  
  const [copied, setCopied] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('luxury');
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [cardPreviews, setCardPreviews] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [userOverrodeTheme, setUserOverrodeTheme] = useState(false);
  
  const { entitlements, isAuthenticated: hasAuth } = useEntitlements();
  const hasGenerated = useRef(false);

  const isPromptMode = creationMode === 'prompt-studio' && promptStudioState.aiVariations !== null;
  const isQuickFormMode = creationMode === 'quick-form' && outputs !== null;

  // Auto-select theme based on event type for Prompt Mode
  useEffect(() => {
    if (isPromptMode && promptStudioState.analysis && !userOverrodeTheme) {
      const recommendedTheme = getRecommendedTheme(promptStudioState.analysis.eventType);
      setSelectedTheme(recommendedTheme);
    }
  }, [isPromptMode, promptStudioState.analysis, userOverrodeTheme]);

  // Generate card previews when outputs or theme changes
  useEffect(() => {
    if (isQuickFormMode && outputs) {
      generatePreviews();
      
      // Show confetti only on first generation
      if (!hasGenerated.current) {
        setShowConfetti(true);
        hasGenerated.current = true;
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } else if (isPromptMode && promptStudioState.aiVariations) {
      // Show confetti for prompt mode
      if (!hasGenerated.current || promptStudioState.regenerateCounter > 0) {
        setShowConfetti(true);
        hasGenerated.current = true;
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  }, [outputs, selectedTheme, selectedTemplate, isPromptMode, promptStudioState.aiVariations, promptStudioState.regenerateCounter]);

  const generatePreviews = async () => {
    if (!outputs) return;
    
    const variations = generateCardVariations();
    const previews: string[] = [];
    
    for (const variation of variations) {
      const canvas = await exportCardToCanvas(
        outputs.mainWish,
        selectedTheme,
        variation
      );
      previews.push(canvas.toDataURL('image/png'));
    }
    
    setCardPreviews(previews);
    setSelectedVariation(0);
  };

  const generatePromptModePreviews = async () => {
    if (!promptStudioState.content) return;
    
    const variations = generateCardVariations();
    const previews: string[] = [];
    
    const cardText = `${promptStudioState.content.title}\n\n${promptStudioState.content.message}`;
    
    for (const variation of variations) {
      const canvas = await exportCardToCanvas(
        cardText,
        selectedTheme,
        variation
      );
      previews.push(canvas.toDataURL('image/png'));
    }
    
    setCardPreviews(previews);
    setSelectedVariation(0);
  };

  const handleCopyAll = async () => {
    let success = false;
    if (isQuickFormMode && outputs) {
      const formatted = formatBirthdayPack(outputs);
      success = await copyToClipboard(formatted);
    } else if (isPromptMode && promptStudioState.aiVariations) {
      const currentVariation = promptStudioState.aiVariations[promptStudioState.selectedVariationIndex];
      const text = `${currentVariation.title}\n\n${currentVariation.mainText}\n\n${currentVariation.footerText}`;
      success = await copyToClipboard(text);
    }
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    if (isQuickFormMode && outputs) {
      const formatted = formatBirthdayPack(outputs);
      const url = createWhatsAppLink(formatted);
      window.open(url, '_blank');
    } else if (isPromptMode && promptStudioState.aiVariations) {
      const currentVariation = promptStudioState.aiVariations[promptStudioState.selectedVariationIndex];
      const text = `${currentVariation.title}\n\n${currentVariation.mainText}\n\n${currentVariation.footerText}`;
      const url = createWhatsAppLink(text);
      window.open(url, '_blank');
    }
  };

  const handleDownloadCard = async () => {
    if (!cardPreviews[selectedVariation]) return;
    
    setIsExporting(true);
    
    try {
      const link = document.createElement('a');
      link.download = `wishmint-card-${Date.now()}.png`;
      link.href = cardPreviews[selectedVariation];
      link.click();
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleThemeChange = (theme: CardTheme) => {
    setSelectedTheme(theme);
    setUserOverrodeTheme(true);
  };

  const handleToneChange = async (newTone: ToneType) => {
    if (!promptStudioState.analysis) return;
    
    setIsRegenerating(true);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newContent = regenerateCardContent(promptStudioState.analysis, newTone);
    
    setPromptStudioState({
      ...promptStudioState,
      content: newContent,
      selectedTone: newTone,
    });
    
    setIsRegenerating(false);
  };

  const handleRegenerateText = async () => {
    if (!promptStudioState.analysis) return;
    
    setIsRegenerating(true);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newContent = regenerateCardContent(
      promptStudioState.analysis,
      promptStudioState.selectedTone || undefined
    );
    
    setPromptStudioState({
      ...promptStudioState,
      content: newContent,
    });
    
    setIsRegenerating(false);
  };

  const handleContentEdit = (field: 'title' | 'message' | 'footer', value: string) => {
    if (!promptStudioState.content) return;
    
    setPromptStudioState({
      ...promptStudioState,
      content: {
        ...promptStudioState.content,
        [field]: value,
      },
    });
  };

  const handlePromptVariationSelect = (index: number) => {
    setPromptStudioState({
      ...promptStudioState,
      selectedVariationIndex: index,
    });
  };

  if (!isQuickFormMode && !isPromptMode) {
    return null;
  }

  return (
    <section id="output-section" className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8">
      <Reveal className="max-w-6xl mx-auto space-y-8">
        <GenerationConfetti trigger={showConfetti} />
        
        {isQuickFormMode && outputs && (
          <>
            {/* Quick Form Mode Output */}
            <Card className="glass-card border-border/40 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Your Birthday Pack</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Main Birthday Wish</Label>
                    <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                      <p className="whitespace-pre-wrap">{outputs.mainWish}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">WhatsApp Short Message</Label>
                    <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                      <p className="whitespace-pre-wrap">{outputs.whatsappShort}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Instagram Caption</Label>
                    <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                      <p className="whitespace-pre-wrap">{outputs.instagramCaption}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Mini Speech</Label>
                    <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                      <p className="whitespace-pre-wrap">{outputs.miniSpeech}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Hashtags</Label>
                    <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                      <p className="whitespace-pre-wrap">{outputs.hashtags}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button onClick={handleCopyAll} variant="outline" className="flex-1">
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy All'}
                  </Button>
                  <Button onClick={handleWhatsAppShare} variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share on WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card Preview for Quick Form */}
            <Card id="card-preview-section" className="glass-card border-border/40 rounded-2xl scroll-mt-16">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Card Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Card Theme</Label>
                  <Select value={selectedTheme} onValueChange={handleThemeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="luxury">Luxury Black & Gold</SelectItem>
                      <SelectItem value="cute">Cute Pastel</SelectItem>
                      <SelectItem value="cinematic">Cinematic Warm</SelectItem>
                      <SelectItem value="modern">Modern Instagram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {cardPreviews.length > 0 && (
                  <>
                    <CardVariationsCarousel
                      variations={cardPreviews}
                      selectedIndex={selectedVariation}
                      onVariationSelect={setSelectedVariation}
                    />

                    <Button
                      onClick={handleDownloadCard}
                      disabled={isExporting}
                      className="w-full premium-button"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isExporting ? 'Downloading...' : 'Download Card'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {isPromptMode && promptStudioState.aiVariations && (
          <>
            {/* Prompt Mode Output */}
            <Card id="card-preview-section" className="glass-card border-border/40 rounded-2xl scroll-mt-16">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Your AI-Generated Card</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Variation Selector */}
                <PromptVariationsCarousel
                  totalVariations={promptStudioState.aiVariations.length}
                  selectedIndex={promptStudioState.selectedVariationIndex}
                  onSelectVariation={handlePromptVariationSelect}
                />

                {/* Current Variation Display */}
                {promptStudioState.aiVariations[promptStudioState.selectedVariationIndex] && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Title</Label>
                      <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                        <p className="text-lg font-semibold">
                          {promptStudioState.aiVariations[promptStudioState.selectedVariationIndex].title}
                        </p>
                      </div>
                    </div>

                    {promptStudioState.aiVariations[promptStudioState.selectedVariationIndex].subtitle && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Subtitle</Label>
                        <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                          <p className="text-sm text-muted-foreground">
                            {promptStudioState.aiVariations[promptStudioState.selectedVariationIndex].subtitle}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Main Text</Label>
                      <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                        <p className="whitespace-pre-wrap">
                          {promptStudioState.aiVariations[promptStudioState.selectedVariationIndex].mainText}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Footer</Label>
                      <div className="p-4 rounded-lg bg-background/50 border border-border/40">
                        <p className="text-sm">
                          {promptStudioState.aiVariations[promptStudioState.selectedVariationIndex].footerText}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {promptStudioState.aiVariations[promptStudioState.selectedVariationIndex].themeTags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs rounded-full bg-brand-purple/10 text-brand-purple border border-brand-purple/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button onClick={handleCopyAll} variant="outline" className="flex-1">
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy Text'}
                  </Button>
                  <Button onClick={handleWhatsAppShare} variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share on WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </Reveal>
    </section>
  );
}
