import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Reveal } from '../components/Reveal';

const FAQ_ITEMS = [
  {
    question: 'How does WishMint AI work?',
    answer: 'WishMint AI uses advanced language models to generate personalized birthday wishes based on your inputs like relationship, tone, and special memories. Simply fill in the form, and our AI creates multiple variations for you to choose from.',
  },
  {
    question: 'Is WishMint AI free to use?',
    answer: 'Yes! We offer a free plan with 3 wishes per day. For unlimited wishes and premium features like Surprise Mode and HD exports, you can upgrade to our Pro plan for just ₹49/month.',
  },
  {
    question: 'Can I customize the generated wishes?',
    answer: 'Absolutely! You can select different tones (emotional, funny, formal), languages (English, Hinglish, Hindi), and add special memories to make each wish unique. You can also choose from various card templates.',
  },
  {
    question: 'What is Surprise Mode?',
    answer: 'Surprise Mode (Pro feature) lets you create a special shareable link with a personalized birthday message. When the recipient opens it, they see a beautiful animated reveal with their name and your message.',
  },
  {
    question: 'Can I sell my own templates?',
    answer: 'Yes! With our Creator plan (₹149/month), you can create and sell your own templates in our marketplace. You\'ll get access to creator analytics and revenue tracking.',
  },
  {
    question: 'How do I export my wishes?',
    answer: 'You can copy wishes to clipboard, share directly to WhatsApp, or download as images. Pro users get HD exports without watermarks.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-16 w-full py-16 px-4 sm:px-6 lg:px-8 section-transition" style={{ backgroundColor: 'oklch(var(--background))' }}>
      <Reveal className="max-w-3xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-brand-purple/30">
            <HelpCircle className="w-4 h-4 text-brand-purple" />
            <span className="text-sm font-medium text-brand-purple">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold brand-gradient-text">Frequently Asked Questions</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'oklch(var(--text-body))' }}>
            Everything you need to know about WishMint AI
          </p>
        </div>

        <Card className="glass-card border-border/40 rounded-2xl">
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </Reveal>
    </section>
  );
}
