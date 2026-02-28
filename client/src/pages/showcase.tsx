import { motion } from "framer-motion";
import { MonitorPlay } from "lucide-react";
import { useVideos } from "@/hooks/use-videos";
import { YouTubeEmbed } from "@/components/youtube-embed";

export default function Showcase() {
  const { data: videos, isLoading } = useVideos();

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
          Media Showcase
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Watch Quorum in action. Tutorials, feature highlights, and community showcases.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos?.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-4 rounded-2xl flex flex-col space-y-4 hover:border-white/20 transition-colors"
            >
              <YouTubeEmbed url={video.url} title={video.title} />
              <div className="px-2 pb-2">
                <h3 className="text-xl font-bold mb-1">{video.title}</h3>
                <p className="text-muted-foreground text-sm">{video.description}</p>
              </div>
            </motion.div>
          ))}

          {videos?.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground glass-panel rounded-2xl">
              <MonitorPlay className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No videos available. Stay tuned for new content!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
