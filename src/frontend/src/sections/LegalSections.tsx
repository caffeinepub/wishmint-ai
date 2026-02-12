import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LegalSections() {
  return (
    <div className="section-padding px-4 sm:px-6 lg:px-8 space-y-20">
      <section id="privacy" className="section-container max-w-4xl">
        <Card className="bg-card/70 backdrop-blur-sm border-neon-purple/20 shadow-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground text-sm">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Data Collection</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  WishMint AI is designed with privacy in mind. All wish generation happens locally in
                  your browser. We do not collect, store, or transmit any personal information you enter
                  into the generator form.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Local Processing</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  All data you input (names, relationships, memories, etc.) is processed entirely on your
                  device. No information is sent to our servers or any third-party services.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Analytics</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We may use anonymous analytics to understand how users interact with our application,
                  but this data cannot be used to identify individual users.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="terms" className="section-container max-w-4xl">
        <Card className="bg-card/70 backdrop-blur-sm border-neon-purple/20 shadow-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground text-sm">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Acceptance of Terms</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  By using WishMint AI, you agree to these terms of service. If you do not agree, please
                  do not use our service.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Use of Service</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  WishMint AI is provided for personal, non-commercial use. You may generate wishes for
                  yourself and others, and share them freely. The generated content is yours to use as you
                  see fit.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Content Responsibility</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  While we strive to generate appropriate content, you are responsible for reviewing and
                  editing any generated wishes before sharing them. WishMint AI is not liable for any
                  consequences arising from the use of generated content.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Service Availability</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We aim to provide reliable service but do not guarantee uninterrupted access. We reserve
                  the right to modify or discontinue features at any time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="contact" className="section-container max-w-4xl">
        <Card className="bg-card/70 backdrop-blur-sm border-neon-purple/20 shadow-card">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Have questions, feedback, or suggestions? We'd love to hear from you!
            </p>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                <strong className="text-foreground">Email:</strong>{' '}
                <a
                  href="mailto:support@wishmint.ai"
                  className="text-neon-purple hover:text-neon-green transition-colors"
                >
                  support@wishmint.ai
                </a>
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Response Time:</strong> We typically respond within 24-48 hours
              </p>
              <p className="text-muted-foreground pt-2 leading-relaxed">
                For bug reports or feature requests, please include as much detail as possible to help
                us assist you better.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
