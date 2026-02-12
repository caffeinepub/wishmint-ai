import { Card, CardContent } from '@/components/ui/card';
import { Reveal } from '../components/Reveal';
import { useAppContext } from '../App';
import { TEMPLATES } from '../features/templates/templates';
import { applyTemplateClasses } from '../features/templates/applyTemplateClasses';
import { Check } from 'lucide-react';

export function TemplatesSection() {
  const { selectedTemplate, setSelectedTemplate, outputs } = useAppContext();

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              Choose Your Template
            </h2>
            <p className="text-muted-foreground text-lg">
              Select a style for your birthday card
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {TEMPLATES.map((template, index) => (
            <Reveal key={template.id} delay={index * 0.05}>
              <button
                onClick={() => setSelectedTemplate(template.id)}
                className="relative group"
                aria-label={`Select ${template.name} template`}
                aria-pressed={selectedTemplate === template.id}
              >
                <Card
                  className={`overflow-hidden transition-all cursor-pointer ${
                    selectedTemplate === template.id
                      ? 'border-neon-purple shadow-neon ring-2 ring-neon-purple/50'
                      : 'border-border hover:border-neon-purple/50'
                  }`}
                >
                  <CardContent className="p-0 aspect-square relative">
                    <div
                      className="w-full h-full bg-cover bg-center flex items-center justify-center"
                      style={{
                        backgroundImage: `url(${template.backgroundImage})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/20" />
                      <span className={`text-4xl relative z-10 ${template.previewIcon}`}>
                        {template.icon}
                      </span>
                    </div>
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 bg-neon-purple rounded-full p-1 z-20">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </CardContent>
                </Card>
                <p className="mt-2 text-sm font-medium text-center">{template.name}</p>
              </button>
            </Reveal>
          ))}
        </div>

        {outputs && (
          <Reveal delay={0.4}>
            <Card className="bg-card/50 backdrop-blur-sm border-neon-purple/20 overflow-hidden">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold py-4 px-8 text-center">Preview</h3>
                <div 
                  className={applyTemplateClasses(selectedTemplate)}
                  style={{
                    backgroundImage: `url(${TEMPLATES.find(t => t.id === selectedTemplate)?.backgroundImage})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/30 rounded-2xl" />
                  <p className="text-lg leading-relaxed whitespace-pre-wrap relative z-10 text-white text-center max-w-2xl">
                    {outputs.mainWish}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        )}
      </div>
    </section>
  );
}
