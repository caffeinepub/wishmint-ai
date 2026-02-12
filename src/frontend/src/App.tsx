import { useState, useRef, createContext, useContext, useEffect } from 'react';
import { HeroSection } from './sections/HeroSection';
import { GeneratorSection } from './sections/GeneratorSection';
import { OutputSection } from './sections/OutputSection';
import { TemplatesSection } from './sections/TemplatesSection';
import { ExamplesSection } from './sections/ExamplesSection';
import { PricingSection } from './sections/PricingSection';
import { FaqSection } from './sections/FaqSection';
import { CommunitySection } from './sections/CommunitySection';
import { MarketplaceSection } from './sections/MarketplaceSection';
import { DashboardSection } from './sections/DashboardSection';
import { FooterSection } from './sections/FooterSection';
import { LegalSections } from './sections/LegalSections';
import { DeployDiagnosticsBanner } from './components/DeployDiagnosticsBanner';
import { PremiumCardDesignerModule } from './features/premiumCardDesigner/PremiumCardDesignerModule';
import { SurpriseView } from './features/surprise/SurpriseView';
import { PricingComparisonModal } from './features/subscription/PricingComparisonModal';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useUserAuthUpsert } from './features/auth/useUserAuthUpsert';
import { generateBirthdayPack } from './features/generator/generateBirthdayPack';
import type { GeneratorFormData, BirthdayPack, TemplateId } from './features/generator/types';
import type { PlanType } from './backend';

interface AppContextValue {
  formData: GeneratorFormData;
  setFormData: (data: GeneratorFormData) => void;
  outputs: BirthdayPack | null;
  setOutputs: (outputs: BirthdayPack | null) => void;
  selectedTemplate: TemplateId;
  setSelectedTemplate: (template: TemplateId) => void;
  isAuthenticated: boolean;
  demoMode: boolean;
  startDemo: () => void;
  exitDemo: () => void;
  premiumDesignerOpen: boolean;
  openPremiumDesigner: () => void;
  closePremiumDesigner: () => void;
  openPricingModal: (highlightPlan?: 'pro' | 'creator') => void;
  closePricingModal: () => void;
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
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [highlightPlan, setHighlightPlan] = useState<'pro' | 'creator' | undefined>(undefined);
  const [surpriseMode, setSurpriseMode] = useState<string | null>(null);
  const [hasTriggeredAuthUpsert, setHasTriggeredAuthUpsert] = useState(false);

  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const { mutate: upsertUserAuth } = useUserAuthUpsert();

  const generatorRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const examplesRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const marketplaceRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const authControlsRef = useRef<HTMLButtonElement>(null);

  // Check for surprise mode in URL
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    const surpriseId = params.get('surprise');
    if (surpriseId) {
      setSurpriseMode(surpriseId);
    }
  });

  // Upsert user auth record after successful login (only once per session)
  useEffect(() => {
    if (isAuthenticated && !hasTriggeredAuthUpsert) {
      upsertUserAuth();
      setHasTriggeredAuthUpsert(true);
    }
    
    // Reset flag when user logs out
    if (!isAuthenticated && hasTriggeredAuthUpsert) {
      setHasTriggeredAuthUpsert(false);
    }
  }, [isAuthenticated, hasTriggeredAuthUpsert, upsertUserAuth]);

  // Scroll to dashboard after successful authentication (only on transition)
  useEffect(() => {
    if (isAuthenticated && dashboardRef.current) {
      const timer = setTimeout(() => {
        dashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

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
    
    const pack = generateBirthdayPack(demoFormData);
    setOutputs(pack);
    
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

  const openPricingModal = (plan?: 'pro' | 'creator') => {
    setHighlightPlan(plan);
    setPricingModalOpen(true);
  };

  const closePricingModal = () => {
    setPricingModalOpen(false);
    setHighlightPlan(undefined);
  };

  const handleHeroCTA = () => {
    if (!isAuthenticated) {
      authControlsRef.current?.focus();
      authControlsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      scrollToGenerator();
    }
  };

  const handleBackFromSurprise = () => {
    setSurpriseMode(null);
    window.history.replaceState({}, '', window.location.pathname);
  };

  const contextValue: AppContextValue = {
    formData,
    setFormData,
    outputs,
    setOutputs,
    selectedTemplate,
    setSelectedTemplate,
    isAuthenticated,
    demoMode,
    startDemo,
    exitDemo,
    premiumDesignerOpen,
    openPremiumDesigner,
    closePremiumDesigner,
    openPricingModal,
    closePricingModal,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="w-full min-h-screen bg-background text-foreground">
        <DeployDiagnosticsBanner />
        {surpriseMode ? (
          <SurpriseView surpriseId={surpriseMode} onBackHome={handleBackFromSurprise} />
        ) : premiumDesignerOpen ? (
          <PremiumCardDesignerModule />
        ) : (
          <>
            <HeroSection
              onGenerateClick={handleHeroCTA}
              onTryDemo={startDemo}
              onExamplesClick={scrollToExamples}
              isAuthenticated={isAuthenticated}
              authControlsRef={authControlsRef}
            />
            <GeneratorSection ref={generatorRef} nameInputRef={nameInputRef as React.RefObject<HTMLInputElement>} />
            {outputs && <OutputSection />}
            <TemplatesSection />
            <ExamplesSection ref={examplesRef} />
            <PricingSection ref={pricingRef} />
            <CommunitySection ref={communityRef} />
            <MarketplaceSection ref={marketplaceRef} />
            {isAuthenticated && <DashboardSection ref={dashboardRef} />}
            <FaqSection />
            <LegalSections />
            <FooterSection />
          </>
        )}
        <PricingComparisonModal
          open={pricingModalOpen}
          onClose={closePricingModal}
          highlightPlan={highlightPlan}
        />
      </div>
    </AppContext.Provider>
  );
}

export default App;
