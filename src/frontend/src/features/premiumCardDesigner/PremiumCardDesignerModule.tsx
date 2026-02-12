import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../App';
import { usePremiumDesignerState } from './usePremiumDesignerState';
import { PREMIUM_THEMES } from './themes';
import { PremiumCardPreview } from './PremiumCardPreview';
import { CustomizationPanel } from './CustomizationPanel';
import { ExportActions } from './ExportActions';
import { ComingSoonTiles } from './ComingSoonTiles';

type Step = 'theme-selection' | 'designer';

export function PremiumCardDesignerModule() {
  const { closePremiumDesigner, outputs, formData } = useAppContext();
  const [step, setStep] = useState<Step>('theme-selection');
  const designerState = usePremiumDesignerState();

  const handleThemeSelect = (themeId: string) => {
    designerState.setTheme(themeId as any);
    setStep('designer');
  };

  const handleBack = () => {
    if (step === 'designer') {
      setStep('theme-selection');
    } else {
      closePremiumDesigner();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-9 w-9"
              >
                {step === 'theme-selection' ? <X className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
              </Button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
                  Premium Card Designer
                </h1>
                <p className="text-sm text-muted-foreground">
                  {step === 'theme-selection' ? 'Choose your theme' : 'Customize your card'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={closePremiumDesigner}
              className="hidden sm:flex"
            >
              Exit Designer
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'theme-selection' ? (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">Select Your Card Theme</h2>
              <p className="text-muted-foreground">Choose from 5 stunning premium themes</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PREMIUM_THEMES.map((theme) => (
                <Card
                  key={theme.id}
                  className="cursor-pointer hover:border-neon-purple/60 transition-all hover:shadow-card group"
                  onClick={() => handleThemeSelect(theme.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">{theme.icon}</span>
                      <span>{theme.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className="h-32 rounded-lg"
                      style={{ background: theme.backgroundGradient }}
                    />
                    <p className="text-sm text-muted-foreground">{theme.description}</p>
                    <Button className="w-full" variant="outline">
                      Select Theme
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <ComingSoonTiles />
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Preview */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Preview</h2>
              <PremiumCardPreview
                designerState={designerState.state}
                wishText={outputs?.mainWish || 'Your birthday wish will appear here'}
                recipientName={formData.name || 'Friend'}
              />
              <ExportActions
                designerState={designerState.state}
                wishText={outputs?.mainWish || ''}
                recipientName={formData.name || 'Friend'}
              />
            </div>

            {/* Right: Customization Panel */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Customize</h2>
              <CustomizationPanel designerState={designerState} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
