import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { TonWalletProvider } from "@/contexts/TonWalletContext";
import { Navigation } from "@/components/Navigation";
import { BottomNav } from "@/components/BottomNav";
import { Games } from "@/pages/Games";
import { Profile } from "@/pages/Profile";
import { FAQPage } from "@/pages/FAQPage";
import { StatsPage } from "@/pages/StatsPage";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/">
          <Redirect to="/games" />
        </Route>
        <Route path="/games" component={Games} />
        <Route path="/profile" component={Profile} />
        <Route path="/faq" component={FAQPage} />
        <Route path="/stats" component={StatsPage} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const manifestUrl = window.location.origin + '/tonconnect-manifest.json';

  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/YOUR_APP_NAME'
      }}
    >
      <QueryClientProvider client={queryClient}>
        <TonWalletProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </TonWalletProvider>
      </QueryClientProvider>
    </TonConnectUIProvider>
  );
}

export default App;
