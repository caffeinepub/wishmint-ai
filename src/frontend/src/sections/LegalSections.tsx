import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LegalSections() {
  return (
    <div className="py-20 px-4 space-y-20">
      <section id="privacy" className="max-w-4xl mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm border-neon-purple/20">
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p className="text-muted-foreground mb-4">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <h3 className="text-xl font-semibold mb-3">Data Collection</h3>
            <p className="text-muted-foreground mb-4">
              WishMint AI is designed with privacy in mind. All wish generation happens locally in
              your browser. We do not collect, store, or transmit any personal information you enter
              into the generator form.
            </p>
            <h3 className="text-xl font-semibold mb-3">Local Processing</h3>
            <p className="text-muted-foreground mb-4">
              All data you input (names, relationships, memories, etc.) is processed entirely on your
              device. No information is sent to our servers or any third-party services.
            </p>
            <h3 className="text-xl font-semibold mb-3">Analytics</h3>
            <p className="text-muted-foreground">
              We may use anonymous analytics to understand how users interact with our application,
              but this data cannot be used to identify individual users.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="terms" className="max-w-4xl mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm border-neon-purple/20">
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <p className="text-muted-foreground mb-4">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <h3 className="text-xl font-semibold mb-3">Acceptance of Terms</h3>
            <p className="text-muted-foreground mb-4">
              By using WishMint AI, you agree to these terms of service. If you do not agree, please
              do not use our service.
            </p>
            <h3 className="text-xl font-semibold mb-3">Use of Service</h3>
            <p className="text-muted-foreground mb-4">
              WishMint AI is provided for personal, non-commercial use. You may generate wishes for
              yourself and others, and share them freely. The generated content is yours to use as you
              see fit.
            </p>
            <h3 className="text-xl font-semibold mb-3">Content Responsibility</h3>
            <p className="text-muted-foreground mb-4">
              While we strive to generate appropriate content, you are responsible for reviewing and
              editing any generated wishes before sharing them. WishMint AI is not liable for any
              consequences arising from the use of generated content.
            </p>
            <h3 className="text-xl font-semibold mb-3">Service Availability</h3>
            <p className="text-muted-foreground">
              We aim to provide reliable service but do not guarantee uninterrupted access. We reserve
              the right to modify or discontinue features at any time.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="contact" className="max-w-4xl mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm border-neon-purple/20">
          <CardHeader>
            <CardTitle className="text-3xl">Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Have questions, feedback, or suggestions? We'd love to hear from you!
            </p>
            <div className="space-y-3 text-muted-foreground">
              <p>
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:support@wishmint.ai"
                  className="text-neon-purple hover:text-neon-green transition-colors"
                >
                  support@wishmint.ai
                </a>
              </p>
              <p>
                <strong>Response Time:</strong> We typically respond within 24-48 hours
              </p>
              <p className="pt-4">
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
