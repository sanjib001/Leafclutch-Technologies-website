import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, Pencil, Trash2, X, Loader2, Eye, EyeOff, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Toast from "../../components/admin/Toast";
import { useRef } from "react";
import { cacheInvalidate } from "../../lib/cache";

interface Mentor {
  id: string;
  name: string;
  photo_url: string | null;
  specialization: string;
  is_visible: boolean;
}

const schema = z.object({
  name: z.string().min(2, "Min 2 chars"),
  specialization: z.string().min(1, "Required"),
  is_visible: z.boolean(),
});
type FormData = z.infer<typeof schema>;

function MentorForm({ mentor, onClose, onSaved }: { mentor?: Mentor | null; onClose: () => void; onSaved: (saved: Mentor) => void }) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(mentor?.photo_url ?? "");
  const [serverError, setServerError] = useState("");
  const photoRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: mentor?.name ?? "", specialization: mentor?.specialization ?? "", is_visible: mentor?.is_visible ?? true },
  });

  async function onSubmit(data: FormData) {
    setServerError("");
    try {
      let photo_url = mentor?.photo_url ?? null;
      if (mentor) {
        const { error } = await supabase.from("mentors").update({ ...data }).eq("id", mentor.id);
        if (error) throw error;
        if (photoFile) {
          const ext = photoFile.name.split(".").pop();
          const path = `mentor-${mentor.id}.${ext}`;
          await supabase.storage.from("profile-photos").upload(path, photoFile, { upsert: true });
          photo_url = supabase.storage.from("profile-photos").getPublicUrl(path).data.publicUrl;
          await supabase.from("mentors").update({ photo_url }).eq("id", mentor.id);
        }
        onSaved({ id: mentor.id, name: data.name, specialization: data.specialization, is_visible: data.is_visible, photo_url });
      } else {
        const { data: inserted, error } = await supabase.from("mentors").insert({ ...data }).select().single();
        if (error) throw error;
        if (photoFile) {
          const ext = photoFile.name.split(".").pop();
          const path = `mentor-${inserted.id}.${ext}`;
          await supabase.storage.from("profile-photos").upload(path, photoFile, { upsert: true });
          photo_url = supabase.storage.from("profile-photos").getPublicUrl(path).data.publicUrl;
          await supabase.from("mentors").update({ photo_url }).eq("id", inserted.id);
        }
        onSaved({ id: inserted.id, name: data.name, specialization: data.specialization, is_visible: data.is_visible, photo_url });
      }
    } catch (e: unknown) {
      setServerError((e as { message: string }).message);
    }
  }

  const inp = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">{mentor ? "Edit" : "Add"} Mentor</h2>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div onClick={() => photoRef.current?.click()} className="h-16 w-16 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer overflow-hidden">
              {photoPreview ? <img src={photoPreview} alt="" className="h-full w-full object-cover" /> : <Upload size={18} className="text-slate-400" />}
            </div>
            <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)); } }} />
            <p className="text-sm text-slate-500">Click to upload photo</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Name *</label>
            <input {...register("name")} className={inp} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Specialization *</label>
            <input {...register("specialization")} className={inp} placeholder="Backend, Frontend, AI…" />
            {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization.message}</p>}
          </div>
          <div className="flex items-center gap-2">
            <input {...register("is_visible")} type="checkbox" id="vis" className="h-4 w-4 rounded" />
            <label htmlFor="vis" className="text-sm text-slate-700">Visible on public site</label>
          </div>
          {serverError && <p className="text-red-500 text-sm bg-red-50 rounded p-2">{serverError}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2 text-sm">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg py-2 text-sm flex items-center justify-center gap-2">
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isSubmitting ? "Saving…" : mentor ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Mentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Mentor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Mentor | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function fetchMentors() {
    try {
      const { data } = await supabase.from("mentors").select("*").order("created_at", { ascending: false });
      setMentors(data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchMentors(); }, []);

  useEffect(() => {
    const channel = supabase
      .channel('rt-mentors')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mentors' }, payload => {
        if (payload.eventType === 'INSERT') {
          const m = payload.new as Mentor;
          setMentors(prev => prev.some(x => x.id === m.id) ? prev : [...prev, m]);
        } else if (payload.eventType === 'UPDATE') {
          setMentors(prev => prev.map(x => x.id === payload.new.id ? payload.new as Mentor : x));
        } else if (payload.eventType === 'DELETE') {
          const id = (payload.old as { id: string }).id;
          setMentors(prev => prev.filter(x => x.id !== id));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    const snapshot = [...mentors];
    setMentors(prev => prev.filter(m => m.id !== target.id));
    setDeleteTarget(null);
    setToast({ message: "Mentor deleted", type: "success" });
    const { error } = await supabase.from("mentors").delete().eq("id", target.id);
    if (error) {
      setMentors(snapshot);
      setToast({ message: "Delete failed: " + error.message, type: "error" });
    } else {
      cacheInvalidate("mentors:all");
    }
  }

  function toggleVisibility(m: Mentor) {
    const next = !m.is_visible;
    setMentors(prev => prev.map(x => x.id === m.id ? { ...x, is_visible: next } : x));
    supabase.from("mentors").update({ is_visible: next }).eq("id", m.id).then(({ error }) => {
      if (error) {
        setMentors(prev => prev.map(x => x.id === m.id ? { ...x, is_visible: m.is_visible } : x));
        setToast({ message: "Failed to update visibility", type: "error" });
      } else {
        cacheInvalidate("mentors:all");
      }
    });
  }

  function handleSaved(saved: Mentor) {
    setFormOpen(false);
    setEditTarget(null);
    setMentors(prev => {
      const idx = prev.findIndex(m => m.id === saved.id);
      if (idx >= 0) return prev.map(m => m.id === saved.id ? saved : m);
      return [saved, ...prev];
    });
    setToast({ message: "Saved", type: "success" });
    cacheInvalidate("mentors:all");
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteTarget && <ConfirmDialog title="Delete mentor" message={`Delete "${deleteTarget.name}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={false} />}
      {formOpen && <MentorForm mentor={editTarget} onClose={() => { setFormOpen(false); setEditTarget(null); }} onSaved={handleSaved} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mentors</h1>
          <p className="text-slate-500 text-sm mt-1">{mentors.length} total</p>
        </div>
        <button onClick={() => { setEditTarget(null); setFormOpen(true); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2.5 rounded-lg">
          <Plus size={16} /> Add Mentor
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
        ) : mentors.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">No mentors yet</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {mentors.map(m => (
              <div key={m.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50">
                <img src={m.photo_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=3b82f6&color=fff`} alt={m.name} className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{m.name}</p>
                  <p className="text-xs text-slate-400">{m.specialization}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${m.is_visible ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                  {m.is_visible ? "Visible" : "Hidden"}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleVisibility(m)} className="text-slate-400 hover:text-slate-700">
                    {m.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button onClick={() => { setEditTarget(m); setFormOpen(true); }} className="text-blue-500 hover:text-blue-700"><Pencil size={15} /></button>
                  <button onClick={() => setDeleteTarget(m)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
