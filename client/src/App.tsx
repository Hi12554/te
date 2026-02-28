import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";

// Components
import { Layout } from "@/components/layout";

// Pages
import Home from "@/pages/home";
import Downloads from "@/pages/downloads";
import Showcase from "@/pages/showcase";
import Executor from "@/pages/executor";
import Socials from "@/pages/socials";
import Admin from "@/pages/admin";

function Router() {
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/downloads" component={Downloads} />
          <Route path="/showcase" component={Showcase} />
          <Route path="/executor" component={Executor} />
          <Route path="/socials" component={Socials} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
