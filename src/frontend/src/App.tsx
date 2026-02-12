import { useState, useRef, createContext, useContext } from 'react';
import { HeroSection } from './sections/HeroSection';
import { GeneratorSection } from './sections/GeneratorSection';
import { OutputSection } from './sections/OutputSection';
import { TemplatesSection } from './sections/TemplatesSection';
import { ExamplesSection } from './sections/ExamplesSection';
import { PricingSection } from './sections/PricingSection';
import { FaqSection } from './sections/FaqSection';
import { FooterSection } from './sections/FooterSection';
import { LegalSections } from './sections/LegalSections';
import type { GeneratorFormData, BirthdayPack, TemplateId } from './features/generator/types';

interface AppContextValue {
  formData: GeneratorFormData;
  setFormData: (data: GeneratorFormData) => void;
  outputs: BirthdayPack | null;
  setOutputs: (outputs: BirthdayPack | null) => void;
  selectedTemplate: TemplateId;
  setSelectedTemplate: (template: TemplateId) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

function App() {
  const [formData, setFormData] = useState<GeneratorFormData>({
    name: '',
    yourName: '',
    relationship: 'friend',
    tone: 'emotional',
    language: 'English',
    personality: 'kind',
    memory: '',
  });

  const [outputs, setOutputs] = useState<BirthdayPack | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('minimal');

  const generatorRef = useRef<HTMLDivElement>(null);
  const examplesRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 500);
  };

  const scrollToExamples = () => {
    examplesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const contextValue: AppContextValue = {
    formData,
    setFormData,
    outputs,
    setOutputs,
    selectedTemplate,
    setSelectedTemplate,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background text-foreground">
        <HeroSection onGenerateClick={scrollToGenerator} onExamplesClick={scrollToExamples} />
        <GeneratorSection ref={generatorRef} nameInputRef={nameInputRef as React.RefObject<HTMLInputElement>} />
        {outputs && <OutputSection />}
        <TemplatesSection />
        <ExamplesSection ref={examplesRef} />
        <PricingSection />
        <FaqSection />
        <LegalSections />
        <FooterSection />
      </div>
    </AppContext.Provider>
  );
}

export default App;
