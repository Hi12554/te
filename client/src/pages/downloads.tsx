import { motion } from "framer-motion";
import { Download as DownloadIcon, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useDownloads } from "@/hooks/use-downloads";

export default function Downloads() {
  const { data: downloads, isLoading } = useDownloads();

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'working':
        return { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' };
      case 'downgrade_required':
        return { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' };
      case 'down':
        return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' };
      default:
        return { icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/30' };
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
          Downloads
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          All official Quorum DLL files, always up-to-date. Click to download any component.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloads?.map((item, i) => {
            const config = getStatusConfig(item.status);
            const StatusIcon = config.icon;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 rounded-2xl flex flex-col h-full relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                
                <div className="flex justify-end items-start mb-4">
                  <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg border ${config.bg} ${config.border} ${config.color} text-xs font-bold uppercase tracking-wider`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span>{item.status.replace('_', ' ')}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-display font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground mb-8 flex-grow">{item.description}</p>
                
                <div className="mt-auto">
                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-black hover:shadow-[0_0_15px_var(--primary)] transition-all duration-300 font-bold"
                  >
                    <DownloadIcon className="w-5 h-5" />
                    <span>Download Now</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
          
          {downloads?.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground glass-panel rounded-2xl">
              <DownloadIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No downloads available right now. Check back later.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
