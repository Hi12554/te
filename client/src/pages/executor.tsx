import { motion } from "framer-motion";
import { Terminal, Copy, CheckCircle2, Settings } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

export default function Executor() {
  const { data: settings, isLoading } = useSettings();

  if (isLoading) {
    return (
      <div className="flex justify-center py-40">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const versions = [
    {
      name: "New UI",
      version: settings?.newUiVersion,
      status: settings?.newUiStatus,
      url: settings?.newUiUrl,
      isPrimary: true,
    },
    {
      name: "Classic UI",
      version: settings?.oldUiVersion,
      status: settings?.oldUiStatus,
      url: settings?.oldUiUrl,
      isPrimary: false,
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-glow-primary">
          Executor Clients
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choose your preferred interface. Both clients connect to the same powerful core.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {versions.map((v, i) => (
          <motion.div
            key={v.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className={`
              glass-panel rounded-3xl p-8 relative overflow-hidden flex flex-col
              ${v.isPrimary ? 'border-primary/30 box-glow-primary' : 'border-white/10'}
            `}
          >
            {v.isPrimary && (
              <div className="absolute top-0 right-0 bg-primary text-black text-xs font-bold px-4 py-1 rounded-bl-xl z-10">
                RECOMMENDED
              </div>
            )}
            
            <div className="flex items-center space-x-4 mb-8">
              <div className={`p-4 rounded-2xl ${v.isPrimary ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white'}`}>
                {v.isPrimary ? <Terminal className="w-8 h-8" /> : <Settings className="w-8 h-8" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{v.name}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-muted-foreground">Version {v.version}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className={`text-xs font-bold uppercase ${v.status === 'working' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                    {v.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-grow space-y-4">
              <div className="bg-black/50 border border-white/5 rounded-xl p-4 font-mono text-sm text-white/70">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-xs">Direct Link</span>
                  <Copy className="w-3 h-3 hover:text-white cursor-pointer" />
                </div>
                <div className="truncate">{v.url || "URL Not Configured"}</div>
              </div>
            </div>

            <div className="mt-8">
              <a 
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all duration-300
                  ${v.isPrimary 
                    ? 'bg-primary text-black hover:bg-white hover:shadow-[0_0_20px_var(--primary)]' 
                    : 'bg-white/10 text-white hover:bg-white/20'}
                `}
              >
                <span>Launch {v.name}</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
