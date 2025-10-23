import { Gamepad2, User, HelpCircle, BarChart3 } from 'lucide-react';
import { useLocation } from 'wouter';

export function BottomNav() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: '/games', icon: Gamepad2, label: 'Games', testId: 'nav-games' },
    { path: '/stats', icon: BarChart3, label: 'Stats', testId: 'nav-stats' },
    { path: '/profile', icon: User, label: 'Profile', testId: 'nav-profile' },
    { path: '/faq', icon: HelpCircle, label: 'FAQ', testId: 'nav-faq' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-2 py-2">
          {navItems.map(({ path, icon: Icon, label, testId }) => {
            const isActive = location === path;
            return (
              <button
                key={path}
                onClick={() => setLocation(path)}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                data-testid={testId}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
