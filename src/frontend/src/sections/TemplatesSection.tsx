import { Card, CardContent } from '@/components/ui/card';
import { Reveal } from '../components/Reveal';
import { useAppContext } from '../App';
import { TEMPLATES } from '../features/templates/templates';
import { applyTemplateClasses } from '../features/templates/applyTemplateClasses';
import { Check } from 'lucide-react';

export function TemplatesSection() {
  const { selectedTemplate, setSelectedTemplate, outputs, formData } = useAppContext();

  return (
    <section className="w-full section-padding px-4 sm:px-6 lg:px-8">
      <div className="section-container max-w-6xl">
        <Reveal>
          <div className="text-center mb-12 space-y-3">
            <h2 className="section-heading bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              Choose Your Template
            </h2>
            <p className="section-subheading">
              Select a design for your birthday card
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {TEMPLATES.map((template, index) => (
            <Reveal key={template.id} delay={index * 0.05}>
              <button
                onClick={() => setSelectedTemplate(template.id)}
                className={`relative group rounded-xl overflow-hidden transition-all ${
                  selectedTemplate === template.id
                    ? 'ring-2 ring-neon-purple ring-offset-2 ring-offset-background scale-105'
                    : 'hover:scale-105'
                }`}
                aria-label={`Select ${template.name} template`}
              >
                <div
                  className={`aspect-square ${applyTemplateClasses(template.id)} flex items-center justify-center`}
                >
                  <span className="text-white font-semibold text-sm sm:text-base drop-shadow-lg px-2 text-center">
                    {template.name}
                  </span>
                </div>
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-neon-purple rounded-full p-1.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            </Reveal>
          ))}
        </div>

        {outputs && (
          <Reveal delay={0.4}>
            <Card className="bg-card/70 backdrop-blur-sm border-neon-purple/20 shadow-card overflow-hidden">
              <CardContent className="p-0">
                <div
                  className={`aspect-square ${applyTemplateClasses(selectedTemplate)} flex flex-col items-center justify-center p-8 sm:p-12 text-center`}
                >
                  <div className="space-y-6 max-w-md">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                      Happy Birthday
                    </h3>
                    <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                      {formData.name}! 🎉
                    </p>
                    <p className="text-base sm:text-lg text-white/90 leading-relaxed drop-shadow-md">
                      {outputs.mainWish}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        )}
      </div>
    </section>
  );
}
