import { useState, useRef, createContext, useContext } from 'react';
import { HeroSection } from './sections/HeroSection';
import { GeneratorSection } from './sections/GeneratorSection';
import { OutputSection } from './sections/OutputSection';
import { TemplatesSection } from './sections/TemplatesSection';
import { ExamplesSection } from './sections/ExamplesSection';
import { PricingSection } from './sections/PricingSection';
import { FaqSection } from './sections/FaqSection';
import { CommunitySection } from './sections/CommunitySection';
import { MarketplaceSection } from './sections/MarketplaceSection';
import { FooterSection } from './sections/FooterSection';
import { LegalSections } from './sections/LegalSections';
import { DeployDiagnosticsBanner } from './components/DeployDiagnosticsBanner';
import { PremiumCardDesignerModule } from './features/premiumCardDesigner/PremiumCardDesignerModule';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { usePlanSelection, type Plan } from './hooks/usePlanSelection';
import { generateBirthdayPack } from './features/generator/generateBirthdayPack';
import type { GeneratorFormData, BirthdayPack, TemplateId } from './features/generator/types';

interface AppContextValue {
  formData: GeneratorFormData;
  setFormData: (data: GeneratorFormData) => void;
  outputs: BirthdayPack | null;
  setOutputs: (outputs: BirthdayPack | null) => void;
  selectedTemplate: TemplateId;
  setSelectedTemplate: (template: TemplateId) => void;
  isAuthenticated: boolean;
  selectedPlan: Plan;
  selectPlan: (plan: Plan) => void;
  demoMode: boolean;
  startDemo: () => void;
  exitDemo: () => void;
  premiumDesignerOpen: boolean;
  openPremiumDesigner: () => void;
  closePremiumDesigner: () => void;
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
  const [demoMode, setDemoMode] = useState(false);
  const [premiumDesignerOpen, setPremiumDesignerOpen] = useState(false);

  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const principal = isAuthenticated ? identity.getPrincipal().toString() : null;
  const { selectedPlan, selectPlan } = usePlanSelection(principal);

  const generatorRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const examplesRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const marketplaceRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const authControlsRef = useRef<HTMLButtonElement>(null);

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 500);
  };

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToExamples = () => {
    examplesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const startDemo = () => {
    // Pre-fill form with demo data
    const demoFormData: GeneratorFormData = {
      name: 'Sarah',
      yourName: '',
      relationship: 'best friend',
      tone: 'emotional',
      language: 'English',
      personality: 'kind',
      memory: '',
    };
    
    setFormData(demoFormData);
    setDemoMode(true);
    
    // Generate outputs immediately
    const pack = generateBirthdayPack(demoFormData);
    setOutputs(pack);
    
    // Scroll to generator section
    setTimeout(() => {
      generatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const exitDemo = () => {
    setDemoMode(false);
  };

  const openPremiumDesigner = () => {
    setPremiumDesignerOpen(true);
  };

  const closePremiumDesigner = () => {
    setPremiumDesignerOpen(false);
  };

  const handleHeroCTA = () => {
    if (!isAuthenticated) {
      // Focus sign-in button
      authControlsRef.current?.focus();
      authControlsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (!selectedPlan) {
      // Scroll to pricing
      scrollToPricing();
    } else {
      // Scroll to generator
      scrollToGenerator();
    }
  };

  const handlePlanSelect = (plan: Plan) => {
    selectPlan(plan);
    // Exit demo mode when user selects a plan
    if (demoMode) {
      exitDemo();
    }
    // After selecting plan, scroll to generator
    setTimeout(() => {
      scrollToGenerator();
    }, 300);
  };

  const contextValue: AppContextValue = {
    formData,
    setFormData,
    outputs,
    setOutputs,
    selectedTemplate,
    setSelectedTemplate,
    isAuthenticated,
    selectedPlan,
    selectPlan: handlePlanSelect,
    demoMode,
    startDemo,
    exitDemo,
    premiumDesignerOpen,
    openPremiumDesigner,
    closePremiumDesigner,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background text-foreground">
        <DeployDiagnosticsBanner />
        {premiumDesignerOpen ? (
          <PremiumCardDesignerModule />
        ) : (
          <>
            <HeroSection
              onGenerateClick={handleHeroCTA}
              onTryDemo={startDemo}
              onExamplesClick={scrollToExamples}
              isAuthenticated={isAuthenticated}
              selectedPlan={selectedPlan}
              authControlsRef={authControlsRef}
            />
            <GeneratorSection ref={generatorRef} nameInputRef={nameInputRef as React.RefObject<HTMLInputElement>} />
            {outputs && <OutputSection />}
            <TemplatesSection />
            <ExamplesSection ref={examplesRef} />
            <PricingSection ref={pricingRef} />
            <CommunitySection ref={communityRef} />
            <MarketplaceSection ref={marketplaceRef} />
            <FaqSection />
            <LegalSections />
            <FooterSection />
          </>
        )}
      </div>
    </AppContext.Provider>
  );
}

export default App;
