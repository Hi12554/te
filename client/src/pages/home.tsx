import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Download, Zap, ShieldCheck, Cpu, TerminalSquare } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

export default function Home() {
  const { data: settings, isLoading } = useSettings();

  const features = [
    {
      title: "High Performance",
      description: "Optimized engine running at maximum efficiency without drops.",
      icon: Zap,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/20",
    },
    {
      title: "Secure Execution",
      description: "Advanced protections built-in to keep your runtime safe.",
      icon: ShieldCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
    },
    {
      title: "Custom UI",
      description: "Sleek, customizable interface matching modern aesthetics.",
      icon: TerminalSquare,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      title: "Constant Updates",
      description: "We patch rapidly to ensure compatibility with every version.",
      icon: Cpu,
      color: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent/20",
    }
  ];

  return (
    <div className="flex flex-col space-y-24 pb-12">
      {/* Status Banner */}
      {!isLoading && settings && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            w-full max-w-3xl mx-auto p-4 rounded-xl border backdrop-blur-md flex items-center justify-center space-x-3
            ${settings.systemStatus.toLowerCase() === 'operational' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : settings.systemStatus.toLowerCase() === 'maintenance'
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'}
          `}
        >
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span className="font-semibold tracking-wide">
            SYSTEM STATUS: {settings.systemStatus.toUpperCase()}
          </span>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="text-center space-y-8 pt-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4 text-sm font-medium text-white/80"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Welcome to the next generation of execution</span>
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
            DOMINATE
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent text-glow-primary">
            THE RUNTIME
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed">
          Quorum Hub brings you the ultimate utility suite. Experience unparalleled speed, stealth, and execution power in one stunning package.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Link 
            href="/downloads" 
            className="group relative px-8 py-4 bg-primary text-black font-bold rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 w-full sm:w-auto text-center"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative flex items-center justify-center space-x-2">
              <Download className="w-5 h-5" />
              <span>GET QUORUM</span>
            </span>
          </Link>
          
          <Link 
            href="/showcase" 
            className="group px-8 py-4 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white font-bold rounded-xl transition-all duration-300 w-full sm:w-auto text-center flex items-center justify-center space-x-2"
          >
            <span>WATCH SHOWCASE</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="glass-panel glass-panel-hover p-8 rounded-2xl group cursor-default"
            >
              <div className={`w-14 h-14 rounded-xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}
