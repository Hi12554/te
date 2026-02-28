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
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      title: "Secure Execution",
      description: "Advanced protections built-in to keep your runtime safe.",
      icon: ShieldCheck,
      color: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent/20",
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
    <div className="flex flex-col space-y-32 pb-24">
      {/* Status Banner */}
      {!isLoading && settings && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            w-full max-w-xl mx-auto p-3 rounded-full border backdrop-blur-xl flex items-center justify-center space-x-3
            ${settings.newUiStatus?.toLowerCase() === 'working' 
              ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 box-glow-emerald shadow-[0_0_20px_rgba(52,211,153,0.1)]' 
              : settings.newUiStatus?.toLowerCase() === 'downgrade_required'
              ? 'bg-yellow-500/5 border-yellow-500/20 text-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.1)]'
              : 'bg-red-500/5 border-red-500/20 text-red-400 shadow-[0_0_20px_rgba(248,113,113,0.1)]'}
          `}
        >
          <div className="w-2 h-2 rounded-full bg-current animate-pulse shadow-[0_0_10px_currentColor]" />
          <span className="font-display text-xs font-bold tracking-[0.2em]">
            SYSTEM {(settings.newUiStatus || 'OFFLINE').toUpperCase()}
          </span>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="text-center space-y-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full -z-10" />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-3 bg-white/[0.03] border border-white/10 rounded-full px-5 py-2 mb-4 text-xs font-bold tracking-widest text-white/60 uppercase"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_hsla(var(--accent)/0.8)]" />
          <span>Next Gen Execution</span>
        </motion.div>
        
        <h1 className="text-7xl md:text-9xl font-display font-black tracking-tighter leading-[0.85]">
          <span className="text-white">
            QUORUM
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-accent bg-[length:200%_auto] animate-gradient text-glow-accent">
            HUB
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
          The ultimate utility suite for modern runtime dominance. Unparalleled speed, stealth, and raw execution power.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
          <Link 
            href="/downloads" 
            className="group relative px-10 py-5 bg-white text-black font-black rounded-full overflow-hidden hover:scale-105 transition-all duration-500 w-full sm:w-auto text-center tracking-tighter"
          >
            <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
            <span className="relative flex items-center justify-center space-x-3 group-hover:text-white transition-colors duration-500">
              <Download className="w-5 h-5" />
              <span>INITIALIZE DOWNLOAD</span>
            </span>
          </Link>
          
          <Link 
            href="/showcase" 
            className="group px-10 py-5 bg-white/[0.03] border border-white/10 hover:border-accent/40 hover:bg-accent/5 text-white font-black rounded-full transition-all duration-500 w-full sm:w-auto text-center flex items-center justify-center space-x-3 tracking-tighter"
          >
            <span>VIEW SHOWCASE</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel glass-panel-hover p-10 rounded-[2rem] group cursor-default relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/5 blur-3xl rounded-full group-hover:bg-accent/10 transition-all duration-500" />
              <div className={`w-16 h-16 rounded-2xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                <Icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}
