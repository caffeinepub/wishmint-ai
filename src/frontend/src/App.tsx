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
import { StickyNavbar } from './components/navigation/StickyNavbar';
import { ScrollProgressBar } from './components/navigation/ScrollProgressBar';
import { FloatingBackToTopButton } from './components/navigation/FloatingBackToTopButton';
import { FloatingCreateWishButton } from './components/navigation/FloatingCreateWishButton';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useUserAuthUpsert } from './features/auth/useUserAuthUpsert';
import { generateBirthdayPack } from './features/generator/generateBirthdayPack';
import { smoothScrollToAnchor } from './lib/scroll';
import type { GeneratorFormData, BirthdayPack, TemplateId } from './features/generator/types';
import type { PromptStudioState } from './features/promptStudio/types';
import type { PlanType } from './backend';

type CreationMode = 'quick-form' | 'prompt-studio';

interface AppContextValue {
  formData: GeneratorFormData;
  setFormData: (data: GeneratorFormData | ((prev: GeneratorFormData) => GeneratorFormData)) => void;
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
  creationMode: CreationMode;
  setCreationMode: (mode: CreationMode) => void;
  promptStudioState: PromptStudioState;
  setPromptStudioState: (state: PromptStudioState | ((prev: PromptStudioState) => PromptStudioState)) => void;
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
  
  // Creation mode state
  const [creationMode, setCreationMode] = useState<CreationMode>('quick-form');
  const [promptStudioState, setPromptStudioState] = useState<PromptStudioState>({
    prompt: '',
    analysis: null,
    content: null,
    selectedTone: null,
    regenerateCounter: 0,
  });

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

  // Handle /pricing route on initial load and navigation
  useEffect(() => {
    const handlePricingRoute = () => {
      const path = window.location.pathname;
      if (path === '/pricing' || path.endsWith('/pricing')) {
        // Scroll to pricing section using new scroll utility
        setTimeout(() => {
          smoothScrollToAnchor('pricing');
          // Also open the pricing modal
          setPricingModalOpen(true);
        }, 300);
      }
    };

    // Check on mount
    handlePricingRoute();

    // Listen for browser navigation
    window.addEventListener('popstate', handlePricingRoute);
    return () => window.removeEventListener('popstate', handlePricingRoute);
  }, []);

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
        smoothScrollToAnchor('dashboard');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const scrollToGenerator = () => {
    smoothScrollToAnchor('create-wish');
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 500);
  };

  const scrollToPricing = () => {
    smoothScrollToAnchor('pricing');
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
      smoothScrollToAnchor('create-wish');
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
    // Debug log for upgrade click tracking
    console.log('Upgrade clicked', plan ? `(${plan})` : '');
    
    setHighlightPlan(plan);
    setPricingModalOpen(true);
    
    // Update URL to /pricing for shareable links
    if (window.location.pathname !== '/pricing') {
      window.history.pushState({}, '', '/pricing');
    }
    
    // Scroll to pricing section
    setTimeout(() => {
      smoothScrollToAnchor('pricing');
    }, 100);
  };

  const closePricingModal = () => {
    setPricingModalOpen(false);
    setHighlightPlan(undefined);
    
    // Reset URL when closing modal
    if (window.location.pathname === '/pricing') {
      window.history.pushState({}, '', '/');
    }
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
    creationMode,
    setCreationMode,
    promptStudioState,
    setPromptStudioState,
  };

  // Show navigation only in main app view (not in surprise or premium designer modes)
  const showNavigation = !surpriseMode && !premiumDesignerOpen;

  return (
    <AppContext.Provider value={contextValue}>
      <div className="w-full min-h-screen">
        <DeployDiagnosticsBanner />
        {showNavigation && <ScrollProgressBar />}
        {showNavigation && <StickyNavbar />}
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
            {showNavigation && <FloatingCreateWishButton />}
            {showNavigation && <FloatingBackToTopButton />}
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
