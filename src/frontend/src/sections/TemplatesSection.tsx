import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useAppContext } from '../App';
import { TEMPLATES } from '../features/templates/templates';
import type { TemplateId } from '../features/generator/types';

export function TemplatesSection() {
  const { selectedTemplate, setSelectedTemplate } = useAppContext();

  const handleTemplateSelect = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
  };

  return (
    <section id="templates" className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8 section-transition" style={{ backgroundColor: 'oklch(var(--background))' }}>
      <Reveal className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-brand-purple/30">
            <Palette className="w-4 h-4 text-brand-purple" />
            <span className="text-sm font-medium text-brand-purple">Card Templates</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold brand-gradient-text">Choose Your Style</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'oklch(var(--text-body))' }}>
            Select from our collection of beautiful card templates
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {TEMPLATES.map((template) => (
            <Card
              key={template.id}
              onClick={() => handleTemplateSelect(template.id)}
              className={`cursor-pointer transition-all hover:scale-105 glass-card ${
                selectedTemplate === template.id
                  ? 'ring-2 ring-brand-purple shadow-lg shadow-brand-purple/20'
                  : 'hover:shadow-md'
              }`}
            >
              <CardHeader className="p-4">
                <div 
                  className={`aspect-square rounded-lg mb-3 flex items-center justify-center text-4xl ${template.previewBg}`}
                >
                  {template.icon}
                </div>
                <CardTitle className="text-sm text-center">{template.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
