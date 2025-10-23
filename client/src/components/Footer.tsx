import { SiX, SiDiscord, SiTelegram } from 'react-icons/si';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    games: [
      { label: 'Coin Flip', href: '#games' },
      { label: 'Dice', href: '#games' },
      { label: 'Roulette', href: '#games' },
    ],
    resources: [
      { label: 'How to Play', href: '#how-it-works' },
      { label: 'Provably Fair', href: '#how-it-works' },
      { label: 'FAQ', href: '#faq' },
    ],
    legal: [
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Responsible Gaming', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: SiX, href: '#', label: 'X' },
    { icon: SiDiscord, href: '#', label: 'Discord' },
    { icon: SiTelegram, href: '#', label: 'Telegram' },
  ];

  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-bold font-mono mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SOLANA CASINO
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Experience the future of online gaming with provably fair, blockchain-powered casino games.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-md bg-muted hover-elevate active-elevate-2 transition-all"
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Games */}
          <div>
            <h4 className="font-semibold mb-4">Games</h4>
            <ul className="space-y-2">
              {footerLinks.games.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {currentYear} Solana Casino. All rights reserved.</p>
            <p className="flex items-center gap-2">
              Powered by
              <span className="font-mono font-semibold text-primary">Solana</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
