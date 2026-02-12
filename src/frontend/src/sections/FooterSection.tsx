import { Heart } from 'lucide-react';

export function FooterSection() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'wishmint-ai'
  );

  return (
    <footer className="py-12 px-4 border-t border-neon-purple/20 bg-card/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              WishMint AI
            </h3>
            <p className="text-muted-foreground">
              Make birthdays feel personal in seconds with AI-powered wishes.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#privacy" className="hover:text-neon-purple transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-neon-purple transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-neon-purple transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <p className="text-muted-foreground">
              Have questions or feedback? We'd love to hear from you!
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-neon-purple/20 text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span>© {currentYear} WishMint AI. All rights reserved.</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-4 h-4 text-neon-purple fill-neon-purple" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-purple hover:text-neon-green transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
