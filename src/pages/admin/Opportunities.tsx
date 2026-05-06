import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, Pencil, Trash2, X, Loader2, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Toast from "../../components/admin/Toast";

interface Opportunity {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  type: "JOB" | "INTERNSHIP";
  job_details: { employment_type: string; salary_range: string } | null;
  internship_details: { duration_months: number; stipend: string } | null;
  requirements: string[];
  is_visible: boolean;
}

const schema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
  location: z.string().optional(),
  type: z.enum(["JOB", "INTERNSHIP"]),
  is_visible: z.boolean(),
  requirements: z.string(),
  employment_type: z.string().optional(),
  salary_range: z.string().optional(),
  duration_months: z.string().optional(),
  stipend: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function OpportunityForm({ opportunity, onClose, onSaved }: { opportunity?: Opportunity | null; onClose: () => void; onSaved: (saved: Opportunity) => void }) {
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: opportunity?.title ?? "", description: opportunity?.description ?? "",
      location: opportunity?.location ?? "", type: opportunity?.type ?? "JOB",
      is_visible: opportunity?.is_visible ?? true,
      requirements: (opportunity?.requirements ?? []).join("\n"),
      employment_type: opportunity?.job_details?.employment_type ?? "",
      salary_range: opportunity?.job_details?.salary_range ?? "",
      duration_months: opportunity?.internship_details?.duration_months?.toString() ?? "",
      stipend: opportunity?.internship_details?.stipend ?? "",
    },
  });
  const type = watch("type");

  async function onSubmit(data: FormData) {
    setServerError("");
    try {
      const payload: Record<string, unknown> = {
        title: data.title, description: data.description || null,
        location: data.location || null, type: data.type,
        is_visible: data.is_visible,
        requirements: data.requirements.split("\n").map(r => r.trim()).filter(Boolean),
        job_details: data.type === "JOB" ? { employment_type: data.employment_type, salary_range: data.salary_range } : null,
        internship_details: data.type === "INTERNSHIP" ? { duration_months: Number(data.duration_months), stipend: data.stipend } : null,
      };
      if (opportunity) {
        const { error } = await supabase.from("opportunities").update(payload).eq("id", opportunity.id);
        if (error) throw error;
        onSaved({ ...opportunity, ...payload } as Opportunity);
      } else {
        const { data: ins, error } = await supabase.from("opportunities").insert(payload).select().single();
        if (error) throw error;
        onSaved(ins as Opportunity);
      }
    } catch (e: unknown) { setServerError((e as { message: string }).message); }
  }

  const inp = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const label = "block text-xs font-medium text-slate-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">{opportunity ? "Edit" : "Add"} Opportunity</h2>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <form id="opp-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label}>Title *</label>
                <input {...register("title")} className={inp} />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className={label}>Type *</label>
                <select {...register("type")} className={inp}>
                  <option value="JOB">Job</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
            </div>
            <div>
              <label className={label}>Description</label>
              <textarea {...register("description")} className={inp} rows={3} />
            </div>
            <div>
              <label className={label}>Location</label>
              <input {...register("location")} className={inp} placeholder="Remote / Kathmandu" />
            </div>
            {type === "JOB" ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label}>Employment Type</label>
                  <input {...register("employment_type")} className={inp} placeholder="Full-time" />
                </div>
                <div>
                  <label className={label}>Salary Range</label>
                  <input {...register("salary_range")} className={inp} placeholder="$1000–$1500/mo" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label}>Duration (months)</label>
                  <input {...register("duration_months")} type="number" className={inp} />
                </div>
                <div>
                  <label className={label}>Stipend</label>
                  <input {...register("stipend")} className={inp} placeholder="$300/mo" />
                </div>
              </div>
            )}
            <div>
              <label className={label}>Requirements (one per line)</label>
              <textarea {...register("requirements")} className={inp} rows={4} placeholder="React&#10;TypeScript&#10;3+ years experience" />
            </div>
            <div className="flex items-center gap-2">
              <input {...register("is_visible")} type="checkbox" id="ovis" className="h-4 w-4 rounded" />
              <label htmlFor="ovis" className="text-sm text-slate-700">Visible on site</label>
            </div>
            {serverError && <p className="text-red-500 text-sm bg-red-50 rounded p-2">{serverError}</p>}
          </form>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button type="button" onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2 text-sm">Cancel</button>
          <button form="opp-form" type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg py-2 text-sm flex items-center justify-center gap-2">
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {isSubmitting ? "Saving…" : opportunity ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Opportunities() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "JOB" | "INTERNSHIP">("ALL");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Opportunity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Opportunity | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function fetchItems() {
    try {
      const { data } = await supabase.from("opportunities").select("*").order("created_at", { ascending: false });
      setItems((data as Opportunity[]) ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchItems(); }, []);

  useEffect(() => {
    const channel = supabase
      .channel('rt-opportunities')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'opportunities' }, payload => {
        if (payload.eventType === 'INSERT') {
          const o = payload.new as Opportunity;
          setItems(prev => prev.some(x => x.id === o.id) ? prev : [...prev, o]);
        } else if (payload.eventType === 'UPDATE') {
          setItems(prev => prev.map(x => x.id === payload.new.id ? payload.new as Opportunity : x));
        } else if (payload.eventType === 'DELETE') {
          const id = (payload.old as { id: string }).id;
          setItems(prev => prev.filter(x => x.id !== id));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = filter === "ALL" ? items : items.filter(i => i.type === filter);

  async function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    const snapshot = [...items];
    setItems(prev => prev.filter(i => i.id !== target.id));
    setDeleteTarget(null);
    setToast({ message: "Deleted", type: "success" });
    const { error } = await supabase.from("opportunities").delete().eq("id", target.id);
    if (error) {
      setItems(snapshot);
      setToast({ message: "Delete failed: " + error.message, type: "error" });
    }
  }

  function toggleVisibility(o: Opportunity) {
    const next = !o.is_visible;
    setItems(prev => prev.map(x => x.id === o.id ? { ...x, is_visible: next } : x));
    supabase.from("opportunities").update({ is_visible: next }).eq("id", o.id).then(({ error }) => {
      if (error) {
        setItems(prev => prev.map(x => x.id === o.id ? { ...x, is_visible: o.is_visible } : x));
        setToast({ message: "Failed to update visibility", type: "error" });
      }
    });
  }

  function handleSaved(saved: Opportunity) {
    setFormOpen(false);
    setEditTarget(null);
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === saved.id);
      if (idx >= 0) return prev.map(i => i.id === saved.id ? saved : i);
      return [saved, ...prev];
    });
    setToast({ message: "Saved", type: "success" });
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteTarget && <ConfirmDialog title="Delete opportunity" message={`Delete "${deleteTarget.title}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={false} />}
      {formOpen && <OpportunityForm opportunity={editTarget} onClose={() => { setFormOpen(false); setEditTarget(null); }} onSaved={handleSaved} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Opportunities</h1>
          <p className="text-slate-500 text-sm mt-1">{items.length} total</p>
        </div>
        <button onClick={() => { setEditTarget(null); setFormOpen(true); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2.5 rounded-lg">
          <Plus size={16} /> Add Opportunity
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {(["ALL", "JOB", "INTERNSHIP"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
        : filtered.length === 0 ? <div className="py-16 text-center text-slate-400 text-sm">No opportunities found</div>
        : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{o.title}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.type === "JOB" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{o.type}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{o.location ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${o.is_visible ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>{o.is_visible ? "Visible" : "Hidden"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleVisibility(o)} className="text-slate-400 hover:text-slate-700">{o.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}</button>
                        <button onClick={() => { setEditTarget(o); setFormOpen(true); }} className="text-blue-500 hover:text-blue-700"><Pencil size={15} /></button>
                        <button onClick={() => setDeleteTarget(o)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
