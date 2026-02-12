import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { smoothScrollToAnchor } from '../../lib/scroll';
import { useActiveSection, type SectionId } from '../../hooks/useActiveSection';

const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'create-wish', label: 'Create Wish' },
  { id: 'templates', label: 'Templates' },
  { id: 'examples', label: 'Examples' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'faq', label: 'FAQ' },
];

export function StickyNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeSection = useActiveSection();

  const handleNavClick = (sectionId: SectionId) => {
    // Close mobile menu first
    setMobileMenuOpen(false);
    
    // Small delay to allow sheet to close smoothly before scrolling
    setTimeout(() => {
      smoothScrollToAnchor(sectionId);
    }, 100);
  };

  return (
    <nav 
      id="sticky-navbar"
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background-secondary/80 backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand with brand gradient */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="text-lg font-bold brand-gradient-text hover:opacity-80 transition-opacity"
          >
            WishMint AI
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.id}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'text-brand-purple'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 brand-gradient rounded-full" />
                )}
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="md:hidden">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 pt-12 bg-background-secondary/95 backdrop-blur-lg">
              <nav className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    variant="ghost"
                    onClick={() => handleNavClick(item.id)}
                    className={`justify-start text-base ${
                      activeSection === item.id
                        ? 'bg-brand-purple/10 text-brand-purple font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
