import { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Check } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useAppContext } from '../App';
import { TEMPLATES } from '../features/templates/templates';
import { applyTemplateClasses } from '../features/templates/applyTemplateClasses';
import type { TemplateId } from '../features/generator/types';

export const TemplatesSection = forwardRef<HTMLDivElement>((props, ref) => {
  const { selectedTemplate, setSelectedTemplate } = useAppContext();

  return (
    <section id="templates" ref={ref} className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <Reveal className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 mb-2">
            <Palette className="w-4 h-4 text-neon-purple" />
            <span className="text-sm font-medium text-neon-purple">Card Templates</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
            Choose Your Style
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a beautiful template for your birthday card
          </p>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATES.map((template) => {
            const isSelected = selectedTemplate === template.id;
            return (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id as TemplateId)}
                className={`group relative overflow-hidden rounded-xl transition-all hover:scale-105 ${
                  isSelected ? 'ring-2 ring-neon-purple ring-offset-2 ring-offset-background' : ''
                }`}
              >
                <div
                  className={`aspect-square ${applyTemplateClasses(
                    template.id as TemplateId
                  )} flex items-center justify-center p-6 transition-all`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-neon-purple text-white rounded-full p-1.5">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  <div className="text-center space-y-2">
                    <div className="text-3xl mb-2">{template.icon}</div>
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">{template.name}</h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Preview Card */}
        <div className="mt-12 max-w-2xl mx-auto">
          <Card className="border-neon-purple/20 shadow-card overflow-hidden">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold">Preview</CardTitle>
              <CardDescription>Your selected template</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div
                className={`aspect-square ${applyTemplateClasses(
                  selectedTemplate
                )} flex items-center justify-center p-8`}
              >
                <div className="text-center space-y-4 max-w-md">
                  <h3 className="text-3xl font-bold text-white drop-shadow-lg">Happy Birthday!</h3>
                  <p className="text-lg text-white/95 drop-shadow leading-relaxed">
                    Your personalized message will appear here with this beautiful design.
                  </p>
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Reveal>
    </section>
  );
});

TemplatesSection.displayName = 'TemplatesSection';
