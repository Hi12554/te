import { useState } from "react";
import { Loader2 } from "lucide-react";

export function YouTubeEmbed({ url, title }: { url: string, title: string }) {
  const [isLoading, setIsLoading] = useState(true);

  // Extract video ID from common youtube url formats
  const extractId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = extractId(url);

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-surface rounded-xl border border-surface-border flex items-center justify-center flex-col text-muted-foreground">
        <p>Invalid YouTube URL</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10 group">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}
      <iframe
        className="w-full h-full absolute inset-0"
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
