import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQ() {
  const faqs = [
    {
      question: 'How does provably fair gaming work?',
      answer: 'Our games use blockchain technology to ensure complete transparency and fairness. Every game result is verifiable on the Solana blockchain, allowing you to independently verify that outcomes are truly random and not manipulated.',
    },
    {
      question: 'How fast are payouts?',
      answer: 'Payouts are instant! Thanks to Solana\'s high-speed blockchain, winnings are credited to your wallet immediately after each game. No waiting periods or processing delays.',
    },
    {
      question: 'What are the minimum and maximum bets?',
      answer: 'Minimum bets start at just 0.1 SOL, making our games accessible to everyone. Maximum bets vary by game but can go up to 100 SOL. Higher limits may be available for VIP players.',
    },
    {
      question: 'Is my wallet safe?',
      answer: 'Yes! We never hold your funds. Your SOL stays in your wallet until you place a bet, and winnings are sent directly back to your wallet. We only request transaction signatures when you actively play games.',
    },
    {
      question: 'Which wallets are supported?',
      answer: 'We support all major Solana wallets including Phantom, Solflare, Sollet, and more. Simply connect your preferred wallet to start playing.',
    },
    {
      question: 'Can I verify game results?',
      answer: 'Absolutely! Every game result is recorded on the Solana blockchain with a unique transaction hash. You can verify the fairness of any game by checking the blockchain explorer.',
    },
  ];

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Solana Casino
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
    </section>
  );
}
