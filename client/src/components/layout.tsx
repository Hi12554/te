import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shield, Download, MonitorPlay, Users, Settings, Activity } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  const { data: robloxVersion } = useQuery<{ version: string }>({
    queryKey: ["/api/proxy/roblox-version"],
    queryFn: async () => {
      const res = await fetch("/api/proxy/roblox-version");
      if (!res.ok) throw new Error("Failed to fetch version");
      const data = await res.json();
      return data;
    },
    refetchInterval: 60000,
    placeholderData: { version: "Checking..." }
  });

  const navItems = [
    { href: "/", label: "Home", icon: Shield },
    { href: "/downloads", label: "Downloads", icon: Download },
    { href: "/showcase", label: "Showcase", icon: MonitorPlay },
    { href: "/executor", label: "Executor", icon: Settings },
    { href: "/socials", label: "Socials", icon: Users },
  ];

  if (user) {
    navItems.push({ href: "/admin", label: "Admin", icon: Shield });
  }

  return (
    <div className="min-h-screen flex flex-col relative z-0 selection:bg-accent/30 selection:text-accent">
      <div className="bg-blobs" />
      
      <header className="sticky top-0 z-50 glass-panel border-t-0 border-x-0 rounded-none h-24 flex items-center backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex items-center justify-between h-full">
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center group-hover:box-glow-accent transition-all duration-500 group-hover:rotate-12">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <span className="font-display font-black text-3xl tracking-tighter text-glow-accent text-white uppercase italic">
                QUORUM
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center p-1.5 bg-white/[0.03] border border-white/10 rounded-2xl">
              {navItems.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`
                      px-6 py-2.5 rounded-[14px] flex items-center space-x-3 text-xs font-black uppercase tracking-widest transition-all duration-500
                      ${isActive 
                        ? "bg-accent text-white shadow-[0_0_20px_hsla(var(--accent)/0.4)]" 
                        : "text-white/40 hover:text-white hover:bg-white/5"}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center space-x-4 ml-4 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Activity className="w-3 h-3 text-accent animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Roblox:</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                  {robloxVersion?.version || "Loading..."}
                </span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <a 
                href="https://sunc.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-accent transition-colors"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">sUNC:</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Check</span>
              </a>
            </div>

            <div className="md:hidden flex items-center">
              {/* Mobile menu could go here, omitting for brevity to focus on desktop premium feel */}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="glass-panel border-b-0 border-x-0 rounded-none mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold tracking-wide">QUORUM HUB</span>
          </div>
          <p className="mt-4 md:mt-0 text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Quorum Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
