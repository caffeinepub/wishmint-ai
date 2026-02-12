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

  const isPromptMode = creationMode === 'prompt-studio' && promptStudioState.content !== null;
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
    } else if (isPromptMode && promptStudioState.content) {
      generatePromptModePreviews();
      
      // Show confetti
      if (!hasGenerated.current || promptStudioState.regenerateCounter > 0) {
        setShowConfetti(true);
        hasGenerated.current = true;
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  }, [outputs, selectedTheme, selectedTemplate, isPromptMode, promptStudioState.content, promptStudioState.regenerateCounter]);

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
    
    for (const variation of variations) {
      const canvas = await exportCardToCanvas(
        promptStudioState.content.message,
        selectedTheme,
        variation,
        {
          title: promptStudioState.content.title,
          footer: promptStudioState.content.footer,
        }
      );
      previews.push(canvas.toDataURL('image/png'));
    }
    
    setCardPreviews(previews);
    setSelectedVariation(0);
  };

  const handleCopyAll = async () => {
    if (!outputs) return;
    
    const text = formatBirthdayPack(outputs);
    await copyToClipboard(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (!outputs) return;
    
    const text = formatBirthdayPack(outputs);
    const url = createWhatsAppLink(text);
    window.open(url, '_blank');
  };

  const handleDownloadCard = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to download cards');
      return;
    }

    setIsExporting(true);
    
    try {
      const variation = generateCardVariations()[selectedVariation];
      
      // Determine export options based on entitlements
      const exportOptions = {
        resolution: entitlements.hdExport ? 1080 : 720,
        watermark: !entitlements.hdExport,
      };
      
      let canvas: HTMLCanvasElement;
      
      if (isPromptMode && promptStudioState.content) {
        canvas = await exportCardToCanvas(
          promptStudioState.content.message,
          selectedTheme,
          variation,
          {
            title: promptStudioState.content.title,
            footer: promptStudioState.content.footer,
            ...exportOptions,
          }
        );
      } else if (outputs) {
        canvas = await exportCardToCanvas(
          outputs.mainWish,
          selectedTheme,
          variation,
          exportOptions
        );
      } else {
        return;
      }
      
      // Download
      const link = document.createElement('a');
      link.download = `wishmint-card-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('Card downloaded!');
      
      // Show upgrade prompt for free users
      if (!entitlements.hdExport) {
        setTimeout(() => {
          toast.info('Upgrade to Pro for HD downloads without watermark', {
            action: {
              label: 'Upgrade',
              onClick: () => openPricingModal('pro'),
            },
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to download card');
    } finally {
      setIsExporting(false);
    }
  };

  const handleThemeChange = (theme: CardTheme) => {
    setSelectedTheme(theme);
    setUserOverrodeTheme(true);
  };

  const handleToneChange = (tone: ToneType) => {
    if (!promptStudioState.analysis) return;
    
    setPromptStudioState({
      ...promptStudioState,
      selectedTone: tone,
    });
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
    toast.success('Text regenerated!');
  };

  const handleRegenerateDesigns = async () => {
    setIsRegenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setPromptStudioState({
      ...promptStudioState,
      regenerateCounter: promptStudioState.regenerateCounter + 1,
    });
    
    setIsRegenerating(false);
    toast.success('Designs regenerated!');
  };

  const handleContentChange = (newContent: typeof promptStudioState.content) => {
    if (!newContent) return;
    
    setPromptStudioState({
      ...promptStudioState,
      content: newContent,
    });
  };

  if (!isQuickFormMode && !isPromptMode) {
    return null;
  }

  return (
    <section id="output-section" className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'oklch(var(--background))' }}>
      <GenerationConfetti trigger={showConfetti} />
      
      <Reveal className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold">
            {isPromptMode ? 'Your Card' : 'Your Birthday Pack'}
          </h2>
          <p className="text-lg" style={{ color: 'oklch(var(--text-body))' }}>
            {isPromptMode 
              ? 'Your AI-generated card is ready!'
              : 'Your personalized birthday wishes are ready!'}
          </p>
        </div>

        {isQuickFormMode && outputs && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass-card border-border/40 rounded-xl hover-glow">
                <CardHeader>
                  <CardTitle className="text-lg">Main Wish</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap" style={{ color: 'oklch(var(--text-body))' }}>
                    {outputs.mainWish}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/40 rounded-xl hover-glow">
                <CardHeader>
                  <CardTitle className="text-lg">WhatsApp Short</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap" style={{ color: 'oklch(var(--text-body))' }}>
                    {outputs.whatsappShort}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/40 rounded-xl hover-glow">
                <CardHeader>
                  <CardTitle className="text-lg">Instagram Caption</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap" style={{ color: 'oklch(var(--text-body))' }}>
                    {outputs.instagramCaption}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/40 rounded-xl hover-glow">
                <CardHeader>
                  <CardTitle className="text-lg">Mini Speech</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap" style={{ color: 'oklch(var(--text-body))' }}>
                    {outputs.miniSpeech}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/40 rounded-xl hover-glow">
                <CardHeader>
                  <CardTitle className="text-lg">Hashtags</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm" style={{ color: 'oklch(var(--text-body))' }}>
                    {outputs.hashtags}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={handleCopyAll} variant="outline" className="gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy All'}
              </Button>
              <Button onClick={handleWhatsAppShare} variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share on WhatsApp
              </Button>
            </div>
          </>
        )}

        {isPromptMode && promptStudioState.analysis && promptStudioState.content && (
          <div className="space-y-6">
            <PromptAnalysisSummary analysis={promptStudioState.analysis} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card className="glass-card border-border/40 rounded-xl">
                  <CardHeader>
                    <CardTitle>Card Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cardPreviews.length > 0 && (
                      <CardVariationsCarousel
                        variations={cardPreviews}
                        selectedIndex={selectedVariation}
                        onVariationSelect={setSelectedVariation}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <Card className="glass-card border-border/40 rounded-xl">
                  <CardHeader>
                    <CardTitle>Customize</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <PromptModeEditorPanel
                      content={promptStudioState.content}
                      selectedTone={promptStudioState.selectedTone || promptStudioState.analysis.tone}
                      onContentChange={handleContentChange}
                      onToneChange={handleToneChange}
                      onRegenerateText={handleRegenerateText}
                      onRegenerateDesigns={handleRegenerateDesigns}
                      isRegenerating={isRegenerating}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        <Card className="glass-card border-border/40 rounded-xl">
          <CardHeader>
            <CardTitle>Card Design</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme-select">Theme</Label>
              <Select value={selectedTheme} onValueChange={(value) => handleThemeChange(value as CardTheme)}>
                <SelectTrigger id="theme-select" className="bg-background/50 border-border/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="luxury">Luxury</SelectItem>
                  <SelectItem value="cute">Cute</SelectItem>
                  <SelectItem value="cinematic">Cinematic</SelectItem>
                  <SelectItem value="modern-instagram">Modern Instagram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {cardPreviews.length > 0 && (
              <div className="space-y-4">
                <CardVariationsCarousel
                  variations={cardPreviews}
                  selectedIndex={selectedVariation}
                  onVariationSelect={setSelectedVariation}
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleDownloadCard}
                disabled={isExporting}
                className="flex-1 premium-button"
              >
                <Download className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Download Card Image'}
              </Button>
              <Button
                onClick={openPremiumDesigner}
                variant="outline"
                className="flex-1"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Premium Card
              </Button>
            </div>

            {isPromptMode && <PremiumComingSoonActions />}
          </CardContent>
        </Card>
      </Reveal>
    </section>
  );
}
