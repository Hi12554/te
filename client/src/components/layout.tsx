import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shield, Download, MonitorPlay, Users, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user } = useAuth();

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
    <div className="min-h-screen flex flex-col relative z-0">
      <div className="bg-blobs" />
      
      <header className="sticky top-0 z-50 glass-panel border-t-0 border-x-0 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:box-glow-primary transition-all duration-300">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display font-bold text-2xl tracking-wider text-glow-primary text-white">
                QUORUM
              </span>
            </Link>
            
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`
                      px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-all duration-300
                      ${isActive 
                        ? "bg-primary/10 text-primary border border-primary/20 box-glow-primary" 
                        : "text-muted-foreground hover:text-white hover:bg-white/5"}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

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
