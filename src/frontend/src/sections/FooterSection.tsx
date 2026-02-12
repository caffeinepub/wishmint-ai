import { Heart } from 'lucide-react';

export function FooterSection() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'wishmint-ai');

  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              WishMint AI
            </h3>
            <p className="text-sm text-muted-foreground">
              Make every birthday unforgettable with AI-powered personalized wishes.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#community" className="text-muted-foreground hover:text-neon-purple transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#marketplace" className="text-muted-foreground hover:text-neon-purple transition-colors">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="#dashboard" className="text-muted-foreground hover:text-neon-purple transition-colors">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#privacy" className="text-muted-foreground hover:text-neon-purple transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-muted-foreground hover:text-neon-purple transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#refund" className="text-muted-foreground hover:text-neon-purple transition-colors">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-neon-purple transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} WishMint AI. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Built with <Heart className="w-4 h-4 text-neon-purple fill-neon-purple" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-purple hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
