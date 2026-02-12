import { useState, useRef, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { Toaster } from '@/components/ui/sonner';
import { HeroSection } from './sections/HeroSection';
import { GeneratorSection } from './sections/GeneratorSection';
import { OutputSection } from './sections/OutputSection';
import { TemplatesSection } from './sections/TemplatesSection';
import { ExamplesSection } from './sections/ExamplesSection';
import { PricingSection } from './sections/PricingSection';
import { FaqSection } from './sections/FaqSection';
import { FooterSection } from './sections/FooterSection';
import { LegalSections } from './sections/LegalSections';
import { CommunitySection } from './sections/CommunitySection';
import { MarketplaceSection } from './sections/MarketplaceSection';
import { DashboardSection } from './sections/DashboardSection';
import { StickyNavbar } from './components/navigation/StickyNavbar';
import { ScrollProgressBar } from './components/navigation/ScrollProgressBar';
import { FloatingBackToTopButton } from './components/navigation/FloatingBackToTopButton';
import { FloatingCreateWishButton } from './components/navigation/FloatingCreateWishButton';
import { SparkleOverlay } from './components/decor/SparkleOverlay';
import { PremiumCardDesignerModule } from './features/premiumCardDesigner/PremiumCardDesignerModule';
import { PricingComparisonModal } from './features/subscription/PricingComparisonModal';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { smoothScrollToAnchor } from './lib/scroll';
import type { BirthdayPack, GeneratorFormData, TemplateId } from './features/generator/types';
import type { PromptStudioState } from './features/promptStudio/types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

interface AppContextType {
  formData: GeneratorFormData;
  setFormData: React.Dispatch<React.SetStateAction<GeneratorFormData>>;
  outputs: BirthdayPack | null;
  setOutputs: React.Dispatch<React.SetStateAction<BirthdayPack | null>>;
  selectedTemplate: TemplateId;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<TemplateId>>;
  openPremiumDesigner: () => void;
  closePremiumDesigner: () => void;
  openPricingModal: () => void;
  creationMode: 'quick-form' | 'prompt-studio';
  setCreationMode: React.Dispatch<React.SetStateAction<'quick-form' | 'prompt-studio'>>;
  promptStudioState: PromptStudioState;
  setPromptStudioState: React.Dispatch<React.SetStateAction<PromptStudioState>>;
  isAuthenticated: boolean;
}

const AppContext = React.createContext<AppContextType | null>(null);

export function useAppContext() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

import React from 'react';

function AppContent() {
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
  const [showPremiumDesigner, setShowPremiumDesigner] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [creationMode, setCreationMode] = useState<'quick-form' | 'prompt-studio'>('quick-form');
  const [promptStudioState, setPromptStudioState] = useState<PromptStudioState>({
    prompt: '',
    analysis: null,
    content: null,
    selectedTone: null,
    regenerateCounter: 0,
    aiVariations: null,
    selectedVariationIndex: 0,
  });

  const nameInputRef = useRef<HTMLInputElement>(null);
  const authControlsRef = useRef<HTMLButtonElement>(null);
  const { identity, loginStatus } = useInternetIdentity();

  const isAuthenticated = !!identity && loginStatus === 'success';

  const openPremiumDesigner = () => {
    setShowPremiumDesigner(true);
  };

  const closePremiumDesigner = () => {
    setShowPremiumDesigner(false);
  };

  const openPricingModal = () => {
    setShowPricingModal(true);
  };

  const handleGenerateClick = () => {
    smoothScrollToAnchor('create-wish');
    if (nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 500);
    }
  };

  const handleTryDemo = () => {
    smoothScrollToAnchor('create-wish');
  };

  const handleExamplesClick = () => {
    smoothScrollToAnchor('examples');
  };

  const contextValue: AppContextType = {
    formData,
    setFormData,
    outputs,
    setOutputs,
    selectedTemplate,
    setSelectedTemplate,
    openPremiumDesigner,
    closePremiumDesigner,
    openPricingModal,
    creationMode,
    setCreationMode,
    promptStudioState,
    setPromptStudioState,
    isAuthenticated,
  };

  if (showPremiumDesigner) {
    return (
      <AppContext.Provider value={contextValue}>
        <PremiumCardDesignerModule />
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen w-full overflow-x-hidden">
        <ScrollProgressBar />
        <StickyNavbar />
        <SparkleOverlay />

        <main className="w-full">
          <HeroSection
            onGenerateClick={handleGenerateClick}
            onTryDemo={handleTryDemo}
            onExamplesClick={handleExamplesClick}
            isAuthenticated={isAuthenticated}
            authControlsRef={authControlsRef}
          />
          <GeneratorSection nameInputRef={nameInputRef} />
          <OutputSection />
          <TemplatesSection />
          <ExamplesSection />
          <CommunitySection />
          <MarketplaceSection />
          <DashboardSection />
          <PricingSection />
          <FaqSection />
          <LegalSections />
        </main>

        <FooterSection />

        <FloatingBackToTopButton />
        <FloatingCreateWishButton />

        <PricingComparisonModal
          open={showPricingModal}
          onClose={() => setShowPricingModal(false)}
        />
      </div>
    </AppContext.Provider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <AppContent />
        <Toaster />
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}
