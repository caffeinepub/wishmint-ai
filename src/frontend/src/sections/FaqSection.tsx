import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Reveal } from '../components/Reveal';

export function FaqSection() {
  const faqs = [
    {
      question: 'How does WishMint AI work?',
      answer:
        'WishMint AI uses advanced template-based generation to create personalized birthday wishes. Simply fill in the details about the person, select your preferences for tone and style, and our system generates a complete Birthday Pack with multiple formats perfect for different platforms.',
    },
    {
      question: 'Is my data private and secure?',
      answer:
        'Yes! All generation happens locally in your browser. We do not store or transmit any personal information you enter. Your privacy is our top priority, and no data leaves your device during the wish generation process.',
    },
    {
      question: 'What languages are supported?',
      answer:
        'WishMint AI currently supports English, Hinglish (a mix of Hindi and English), and Hindi. We are working on adding more languages to serve a wider audience. Each language option generates culturally appropriate wishes.',
    },
    {
      question: 'How can I share the wishes?',
      answer:
        'You can share wishes in multiple ways: copy individual sections to your clipboard, copy the entire Birthday Pack, share directly to WhatsApp with our one-click button, or download a beautiful card image to share on any platform.',
    },
    {
      question: 'Can I customize the templates?',
      answer:
        'Yes! We offer 8 different template styles ranging from Minimal to Anime. Select any template to preview how your wish will look, and download it as a shareable card image. Pro users get access to unlimited premium templates.',
    },
    {
      question: 'What is included in the Birthday Pack?',
      answer:
        'Each Birthday Pack includes 5 components: a Main Wish (detailed and heartfelt), WhatsApp Short (perfect for quick messages), Instagram Caption (social media ready), Mini Speech (10-15 seconds when spoken), and Hashtags (for social posts).',
    },
  ];

  return (
    <section className="section-padding px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-neon-purple/5">
      <div className="section-container max-w-4xl">
        <Reveal>
          <div className="text-center mb-12 space-y-3">
            <h2 className="section-heading bg-gradient-to-r from-neon-purple to-neon-green bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="section-subheading">
              Everything you need to know about WishMint AI
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card/70 backdrop-blur-sm border border-neon-purple/20 rounded-lg px-5 data-[state=open]:border-neon-purple/40 shadow-card"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="font-semibold text-base">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
