import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, Pencil, Trash2, X, Loader2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Toast from "../../components/admin/Toast";
import { cacheInvalidate } from "../../lib/cache";

interface Project {
  id: string;
  title: string;
  description: string | null;
  photo_url: string | null;
  project_link: string | null;
  techs: string[];
  is_visible: boolean;
  display_order: number;
}

const schema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
  project_link: z.string().optional(),
  is_visible: z.boolean(),
  display_order: z.number(),
  techs: z.string(),
});
type FormData = z.infer<typeof schema>;

function ProjectForm({ project, onClose, onSaved }: { project?: Project | null; onClose: () => void; onSaved: (saved: Project) => void }) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(project?.photo_url ?? "");
  const [serverError, setServerError] = useState("");
  const photoRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: project?.title ?? "", description: project?.description ?? "",
      project_link: project?.project_link ?? "", is_visible: project?.is_visible ?? true,
      display_order: project?.display_order ?? 0, techs: (project?.techs ?? []).join("\n"),
    },
  });

  async function onSubmit(data: FormData) {
    setServerError("");
    try {
      const payload = {
        title: data.title, description: data.description || null,
        project_link: data.project_link || null, is_visible: data.is_visible,
        display_order: data.display_order, techs: data.techs.split("\n").map(t => t.trim()).filter(Boolean),
      };
      let id = project?.id;
      let photo_url = project?.photo_url ?? null;
      if (project) {
        const { error } = await supabase.from("projects").update(payload).eq("id", project.id);
        if (error) throw error;
      } else {
        const { data: ins, error } = await supabase.from("projects").insert(payload).select().single();
        if (error) throw error;
        id = ins.id;
      }
      if (photoFile && id) {
        const ext = photoFile.name.split(".").pop();
        const path = `project-${id}.${ext}`;
        await supabase.storage.from("assets").upload(path, photoFile, { upsert: true });
        photo_url = supabase.storage.from("assets").getPublicUrl(path).data.publicUrl;
        await supabase.from("projects").update({ photo_url }).eq("id", id);
      }
      onSaved({ id: id!, ...payload, photo_url });
    } catch (e: unknown) { setServerError((e as { message: string }).message); }
  }

  const inp = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">{project ? "Edit" : "Add"} Project</h2>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <form id="project-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Title *</label>
              <input {...register("title")} className={inp} />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
              <textarea {...register("description")} className={inp} rows={3} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Project Link</label>
              <input {...register("project_link")} className={inp} placeholder="https://…" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Technologies (one per line)</label>
              <textarea {...register("techs")} className={inp} rows={3} placeholder="React&#10;TypeScript&#10;Supabase" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Project Image</label>
              {photoPreview && <img src={photoPreview} alt="" className="h-24 rounded-lg object-cover mb-2" />}
              <input ref={photoRef} type="file" accept="image/*" className="text-sm" onChange={e => { const f = e.target.files?.[0]; if (f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)); } }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Display Order</label>
                <input {...register("display_order", { valueAsNumber: true })} type="number" className={inp} />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input {...register("is_visible")} type="checkbox" id="pvis" className="h-4 w-4 rounded" />
                <label htmlFor="pvis" className="text-sm text-slate-700">Visible on site</label>
              </div>
            </div>
            {serverError && <p className="text-red-500 text-sm bg-red-50 rounded p-2">{serverError}</p>}
          </form>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button type="button" onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2 text-sm">Cancel</button>
          <button form="project-form" type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg py-2 text-sm flex items-center justify-center gap-2">
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {isSubmitting ? "Saving…" : project ? "Save" : "Add Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function fetchProjects() {
    try {
      const { data } = await supabase.from("projects").select("*").order("display_order");
      setProjects(data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProjects(); }, []);

  useEffect(() => {
    const channel = supabase
      .channel('rt-projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, payload => {
        if (payload.eventType === 'INSERT') {
          const p = payload.new as Project;
          setProjects(prev => prev.some(x => x.id === p.id) ? prev : [...prev, p]);
        } else if (payload.eventType === 'UPDATE') {
          setProjects(prev => prev.map(x => x.id === payload.new.id ? payload.new as Project : x));
        } else if (payload.eventType === 'DELETE') {
          const id = (payload.old as { id: string }).id;
          setProjects(prev => prev.filter(x => x.id !== id));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    const snapshot = [...projects];
    setProjects(prev => prev.filter(p => p.id !== target.id));
    setDeleteTarget(null);
    setToast({ message: "Project deleted", type: "success" });
    const { error } = await supabase.from("projects").delete().eq("id", target.id);
    if (error) {
      setProjects(snapshot);
      setToast({ message: "Delete failed: " + error.message, type: "error" });
    } else {
      cacheInvalidate("projects:all");
    }
  }

  function toggleVisibility(p: Project) {
    const next = !p.is_visible;
    setProjects(prev => prev.map(x => x.id === p.id ? { ...x, is_visible: next } : x));
    supabase.from("projects").update({ is_visible: next }).eq("id", p.id).then(({ error }) => {
      if (error) {
        setProjects(prev => prev.map(x => x.id === p.id ? { ...x, is_visible: p.is_visible } : x));
        setToast({ message: "Failed to update visibility", type: "error" });
      } else {
        cacheInvalidate("projects:all");
      }
    });
  }

  function handleSaved(saved: Project) {
    setFormOpen(false);
    setEditTarget(null);
    setProjects(prev => {
      const idx = prev.findIndex(p => p.id === saved.id);
      if (idx >= 0) return prev.map(p => p.id === saved.id ? saved : p);
      return [...prev, saved];
    });
    setToast({ message: "Saved", type: "success" });
    cacheInvalidate("projects:all");
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteTarget && <ConfirmDialog title="Delete project" message={`Delete "${deleteTarget.title}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={false} />}
      {formOpen && <ProjectForm project={editTarget} onClose={() => { setFormOpen(false); setEditTarget(null); }} onSaved={handleSaved} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">{projects.length} total</p>
        </div>
        <button onClick={() => { setEditTarget(null); setFormOpen(true); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2.5 rounded-lg">
          <Plus size={16} /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white rounded-xl border border-slate-200 h-52 animate-pulse" />)
        ) : projects.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-400 text-sm">No projects yet</div>
        ) : (
          projects.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-36 bg-slate-100 overflow-hidden">
                {p.photo_url ? <img src={p.photo_url} alt={p.title} className="h-full w-full object-cover" /> : <div className="h-full flex items-center justify-center text-slate-300 text-4xl font-bold">{p.title[0]}</div>}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium text-slate-800 text-sm">{p.title}</p>
                  {p.project_link && <a href={p.project_link} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 shrink-0"><ExternalLink size={14} /></a>}
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{p.description ?? ""}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.techs.slice(0, 4).map(t => <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{t}</span>)}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_visible ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>{p.is_visible ? "Visible" : "Hidden"}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleVisibility(p)} className="text-slate-400 hover:text-slate-700">{p.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}</button>
                    <button onClick={() => { setEditTarget(p); setFormOpen(true); }} className="text-blue-500 hover:text-blue-700"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteTarget(p)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
