import { forwardRef } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Reveal } from '../components/Reveal';

export const FaqSection = forwardRef<HTMLDivElement>((props, ref) => {
  const faqs = [
    {
      question: 'How does WishMint AI work?',
      answer:
        'WishMint AI uses advanced language models to generate personalized birthday wishes based on your inputs like relationship, tone, and special memories. Simply fill in the form and let AI create heartfelt messages for you.',
    },
    {
      question: 'Is WishMint AI free to use?',
      answer:
        'Yes! WishMint AI offers a free plan with 3 messages per day. For unlimited messages and premium features, you can upgrade to Pro (₹49/month) or Creator (₹149/month) plans.',
    },
    {
      question: 'Can I customize the generated wishes?',
      answer:
        'Absolutely! You can adjust the tone, language, personality, and add special memories to make each wish unique. You can also choose from multiple card templates to match your style.',
    },
    {
      question: 'What is Surprise Mode?',
      answer:
        'Surprise Mode (Pro feature) lets you create a special shareable link with a birthday wish. When the recipient opens it, they see a beautiful animated reveal with your personalized message.',
    },
    {
      question: 'How do I sign in with Google?',
      answer:
        'Click "Continue with Google" to sign in using Internet Identity, a secure authentication system. For developers: This uses the Internet Computer\'s Internet Identity service. Configure II_URL in your environment to use a custom identity provider.',
    },
    {
      question: 'Can I sell my own templates?',
      answer:
        'Yes! With the Creator plan (₹149/month), you can create and sell your own templates on the WishMint Marketplace. Earn revenue from your creative designs.',
    },
  ];

  return (
    <section id="faq" ref={ref} className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/20 to-background">
      <Reveal className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 mb-2">
            <HelpCircle className="w-4 h-4 text-neon-purple" />
            <span className="text-sm font-medium text-neon-purple">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about WishMint AI
          </p>
        </div>

        <Card className="border-neon-purple/20 shadow-card">
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold hover:text-neon-purple transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </Reveal>
    </section>
  );
});

FaqSection.displayName = 'FaqSection';
