import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useDownloads, useCreateDownload, useUpdateDownload, useDeleteDownload } from "@/hooks/use-downloads";
import { useVideos, useCreateVideo, useUpdateVideo, useDeleteVideo } from "@/hooks/use-videos";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { LogOut, Trash2, Edit2, Plus, RefreshCw, ShieldAlert } from "lucide-react";
import type { Download, Video, Settings } from "@shared/schema";

export default function Admin() {
  const { user, login, logout, isLoggingIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"downloads" | "videos" | "settings">("downloads");

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 glass-panel p-8 rounded-2xl border-t-2 border-t-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
        <div className="text-center mb-8 relative z-10">
          <ShieldAlert className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-muted-foreground text-sm mt-2">Restricted personnel only</p>
        </div>
        
        <form 
          className="space-y-4 relative z-10"
          onSubmit={async (e) => {
            e.preventDefault();
            await login({ username, password });
          }}
        >
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>
          <button 
            disabled={isLoggingIn}
            className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-white hover:shadow-[0_0_15px_var(--primary)] transition-all mt-4 disabled:opacity-50"
          >
            {isLoggingIn ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 p-4 rounded-2xl">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-lg border border-primary/30">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">Logged in as</p>
            <p className="text-white font-bold">{user.username}</p>
          </div>
        </div>
        <button 
          onClick={() => logout()}
          className="flex items-center space-x-2 text-red-400 hover:bg-red-400/10 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-400/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="flex border-b border-white/10 space-x-8">
        {[
          { id: "downloads", label: "Downloads" },
          { id: "videos", label: "Showcase" },
          { id: "settings", label: "Executor" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_var(--primary)]" />
            )}
          </button>
        ))}
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        {activeTab === "downloads" && <DownloadsAdmin />}
        {activeTab === "videos" && <VideosAdmin />}
        {activeTab === "settings" && <SettingsAdmin />}
      </div>
    </div>
  );
}

function DownloadsAdmin() {
  const { data: downloads } = useDownloads();
  const createMutation = useCreateDownload();
  const updateMutation = useUpdateDownload();
  const deleteMutation = useDeleteDownload();
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", url: "", status: "working" });

  const resetForm = () => {
    setForm({ title: "", description: "", url: "", status: "working" });
    setEditingId(null);
  };

  const handleEdit = (d: Download) => {
    setEditingId(d.id);
    setForm({ title: d.title, description: d.description, url: d.url, status: d.status });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, ...form });
    } else {
      await createMutation.mutateAsync(form);
    }
    resetForm();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 border-r border-white/10 pr-0 lg:pr-8">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-primary" />
          {editingId ? "Edit Download" : "New Download"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-primary focus:outline-none" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <textarea className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-primary focus:outline-none h-24 resize-none" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
          <input className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-primary focus:outline-none" placeholder="Download URL" value={form.url} onChange={e => setForm({...form, url: e.target.value})} required />
          <select className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-primary focus:outline-none text-white" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
            <option value="working" className="bg-background">Working</option>
            <option value="downgrade_required" className="bg-background">Downgrade Required</option>
            <option value="down" className="bg-background">Down</option>
          </select>
          <div className="flex space-x-2 pt-2">
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 bg-primary text-black font-bold py-2 rounded-lg hover:opacity-90 transition-opacity">
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="lg:col-span-2 space-y-4">
        {downloads?.map(d => (
          <div key={d.id} className="bg-black/20 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-white/10 transition-colors">
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-white">{d.title}</h4>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${d.status === 'working' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                  {d.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 truncate max-w-md">{d.url}</p>
            </div>
            <div className="flex space-x-2 opacity-50 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(d)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => { if(confirm('Delete?')) deleteMutation.mutate(d.id); }} className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {downloads?.length === 0 && <p className="text-muted-foreground text-center py-10">No downloads created yet.</p>}
      </div>
    </div>
  );
}

function VideosAdmin() {
  const { data: videos } = useVideos();
  const createMutation = useCreateVideo();
  const updateMutation = useUpdateVideo();
  const deleteMutation = useDeleteVideo();
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", url: "" });

  const resetForm = () => {
    setForm({ title: "", description: "", url: "" });
    setEditingId(null);
  };

  const handleEdit = (v: Video) => {
    setEditingId(v.id);
    setForm({ title: v.title, description: v.description, url: v.url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, ...form });
    } else {
      await createMutation.mutateAsync(form);
    }
    resetForm();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 border-r border-white/10 pr-0 lg:pr-8">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-accent" />
          {editingId ? "Edit Video" : "New Video"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-accent focus:outline-none" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <textarea className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-accent focus:outline-none h-24 resize-none" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
          <input className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-accent focus:outline-none" placeholder="YouTube URL" value={form.url} onChange={e => setForm({...form, url: e.target.value})} required />
          <div className="flex space-x-2 pt-2">
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 bg-accent text-white font-bold py-2 rounded-lg hover:opacity-90 transition-opacity">
              {editingId ? "Update" : "Add Video"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="lg:col-span-2 space-y-4">
        {videos?.map(v => (
          <div key={v.id} className="bg-black/20 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-white/10 transition-colors">
            <div>
              <h4 className="font-bold text-white">{v.title}</h4>
              <p className="text-sm text-muted-foreground mt-1 truncate max-w-md">{v.url}</p>
            </div>
            <div className="flex space-x-2 opacity-50 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(v)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => { if(confirm('Delete?')) deleteMutation.mutate(v.id); }} className="p-2 hover:bg-white/10 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {videos?.length === 0 && <p className="text-muted-foreground text-center py-10">No videos added yet.</p>}
      </div>
    </div>
  );
}

function SettingsAdmin() {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const [form, setForm] = useState<Partial<Settings>>({});

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings.mutateAsync(form);
  };

  const statusOptions = ["working", "downgrade_required", "down"];

  if (!settings) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg font-bold">New UI Config</h3>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Status</label>
            <select className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" value={form.newUiStatus || ""} onChange={e => setForm({...form, newUiStatus: e.target.value})}>
              {statusOptions.map(o => <option key={o} value={o} className="bg-background">{o.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Download URL</label>
            <input className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" value={form.newUiUrl || ""} onChange={e => setForm({...form, newUiUrl: e.target.value})} />
          </div>
        </div>

        <div className="space-y-4 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-muted-foreground">Old UI Config</h3>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Status</label>
            <select className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" value={form.oldUiStatus || ""} onChange={e => setForm({...form, oldUiStatus: e.target.value})}>
              {statusOptions.map(o => <option key={o} value={o} className="bg-background">{o.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Download URL</label>
            <input className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" value={form.oldUiUrl || ""} onChange={e => setForm({...form, oldUiUrl: e.target.value})} />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <button 
          type="submit" 
          disabled={updateSettings.isPending}
          className="flex items-center space-x-2 bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-primary transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${updateSettings.isPending ? 'animate-spin' : ''}`} />
          <span>Save All Settings</span>
        </button>
      </div>
    </form>
  );
}
