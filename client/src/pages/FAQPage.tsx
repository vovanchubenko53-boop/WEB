import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQPage() {
  const faqs = [
    {
      question: 'How does provably fair gaming work?',
      answer: 'Our games use blockchain technology to ensure complete transparency and fairness. Every game result is verifiable on the TON blockchain, allowing you to independently verify that outcomes are truly random and not manipulated.',
    },
    {
      question: 'How fast are payouts?',
      answer: 'Payouts are instant! Thanks to TON\'s high-speed blockchain, winnings are credited to your wallet immediately after each game. No waiting periods or processing delays.',
    },
    {
      question: 'What are the minimum and maximum bets?',
      answer: 'Minimum bets start at just 0.1 TON, making our games accessible to everyone. Maximum bets vary by game but can go up to 100 TON. Higher limits may be available for VIP players.',
    },
    {
      question: 'Is my wallet safe?',
      answer: 'Yes! We never hold your funds. Your TON stays in your wallet until you place a bet, and winnings are sent directly back to your wallet. We only request transaction signatures when you actively play games.',
    },
    {
      question: 'Which wallets are supported?',
      answer: 'We support all TON Connect compatible wallets including Tonkeeper, OpenMask, MyTonWallet, and more. Simply connect your preferred wallet to start playing.',
    },
    {
      question: 'Can I verify game results?',
      answer: 'Absolutely! Every game result is recorded on the TON blockchain with a unique transaction hash. You can verify the fairness of any game by checking the blockchain explorer.',
    },
    {
      question: 'What is a Telegram Mini App?',
      answer: 'This casino runs as a Telegram Mini App, which means you can play directly within Telegram without downloading any additional apps. It\'s fast, secure, and convenient!',
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FAQ
              </span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about TON Casino
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-card-border rounded-lg px-6"
              data-testid={`faq-item-${index}`}
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
