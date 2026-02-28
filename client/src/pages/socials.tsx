import { motion } from "framer-motion";
import { MessageSquare, Youtube, ExternalLink } from "lucide-react";

export default function Socials() {
  const links = [
    {
      title: "Discord Community",
      description: "Join thousands of members, get support, and chat with developers.",
      icon: MessageSquare,
      color: "text-[#5865F2]",
      bg: "bg-[#5865F2]",
      url: "https://discord.gg/qUfz7Z43Em", // Replace with real URL
    },
    {
      title: "YouTube Channel",
      description: "Subscribe for tutorials, update showcases, and exclusive content.",
      icon: Youtube,
      color: "text-[#FF0000]",
      bg: "bg-[#FF0000]",
      url: "https://www.youtube.com/@QuorumHub", // Replace with real URL
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
          Connect With Us
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Stay updated and join the Quorum community across our official platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {links.map((link, i) => {
          const Icon = link.icon;
          return (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <a 
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300 block h-full relative overflow-hidden"
              >
                <div className={`absolute top-0 inset-x-0 h-1 opacity-0 group-hover:opacity-100 ${link.bg} transition-opacity duration-300`} />
                
                <div className={`w-20 h-20 rounded-full ${link.bg}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-10 h-10 ${link.color}`} />
                </div>
                
                <h2 className="text-2xl font-bold mb-3 flex items-center justify-center space-x-2">
                  <span>{link.title}</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h2>
                
                <p className="text-muted-foreground">
                  {link.description}
                </p>
              </a>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
