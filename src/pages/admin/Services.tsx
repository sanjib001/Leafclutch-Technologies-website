import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, Pencil, Trash2, X, Loader2, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Toast from "../../components/admin/Toast";
import { cacheInvalidate } from "../../lib/cache";

interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  photo_url: string | null;
  techs: string[];
  offerings: string[];
  features: string[];
  base_price: string | null;
  effective_price: string | null;
  is_visible: boolean;
  display_order: number;
}

const schema = z.object({
  title: z.string().min(1, "Required"),
  slug: z.string().min(1, "Required"),
  short_description: z.string().optional(),
  description: z.string().optional(),
  base_price: z.string().optional(),
  effective_price: z.string().optional(),
  is_visible: z.boolean(),
  display_order: z.number(),
  techs: z.string(),
  offerings: z.string(),
  features: z.string(),
});
type FormData = z.infer<typeof schema>;

function toArr(s: string) { return s.split("\n").map(x => x.trim()).filter(Boolean); }
function toStr(a: string[]) { return a.join("\n"); }

function ServiceForm({ service, onClose, onSaved }: { service?: Service | null; onClose: () => void; onSaved: (saved: Service) => void }) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(service?.photo_url ?? "");
  const [serverError, setServerError] = useState("");
  const photoRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: service?.title ?? "", slug: service?.slug ?? "",
      short_description: service?.short_description ?? "", description: service?.description ?? "",
      base_price: service?.base_price ?? "", effective_price: service?.effective_price ?? "",
      is_visible: service?.is_visible ?? true, display_order: service?.display_order ?? 0,
      techs: toStr(service?.techs ?? []), offerings: toStr(service?.offerings ?? []), features: toStr(service?.features ?? []),
    },
  });

  async function onSubmit(data: FormData) {
    setServerError("");
    try {
      const payload = {
        title: data.title, slug: data.slug,
        short_description: data.short_description || null, description: data.description || null,
        base_price: data.base_price || null, effective_price: data.effective_price || null,
        is_visible: data.is_visible, display_order: data.display_order,
        techs: toArr(data.techs), offerings: toArr(data.offerings), features: toArr(data.features),
      };
      let id = service?.id;
      let photo_url = service?.photo_url ?? null;
      if (service) {
        const { error } = await supabase.from("services").update(payload).eq("id", service.id);
        if (error) throw error;
      } else {
        const { data: ins, error } = await supabase.from("services").insert(payload).select().single();
        if (error) throw error;
        id = ins.id;
      }
      if (photoFile && id) {
        const ext = photoFile.name.split(".").pop();
        const path = `service-${id}.${ext}`;
        await supabase.storage.from("assets").upload(path, photoFile, { upsert: true });
        photo_url = supabase.storage.from("assets").getPublicUrl(path).data.publicUrl;
        await supabase.from("services").update({ photo_url }).eq("id", id);
      }
      onSaved({ id: id!, ...payload, photo_url, lottie_url: (service as unknown as { lottie_url?: string })?.lottie_url ?? "" } as Service);
    } catch (e: unknown) { setServerError((e as { message: string }).message); }
  }

  const inp = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const label = "block text-xs font-medium text-slate-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">{service ? "Edit" : "Add"} Service</h2>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <form id="service-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label}>Title *</label>
                <input {...register("title")} className={inp} />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className={label}>Slug *</label>
                <input {...register("slug")} className={inp} placeholder="web-development" />
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
              </div>
            </div>
            <div>
              <label className={label}>Short Description</label>
              <input {...register("short_description")} className={inp} />
            </div>
            <div>
              <label className={label}>Full Description</label>
              <textarea {...register("description")} className={inp} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label}>Base Price</label>
                <input {...register("base_price")} className={inp} placeholder="$999" />
              </div>
              <div>
                <label className={label}>Effective Price</label>
                <input {...register("effective_price")} className={inp} placeholder="$799" />
              </div>
            </div>
            <div>
              <label className={label}>Technologies (one per line)</label>
              <textarea {...register("techs")} className={inp} rows={3} placeholder="React&#10;Node.js&#10;PostgreSQL" />
            </div>
            <div>
              <label className={label}>Offerings (one per line)</label>
              <textarea {...register("offerings")} className={inp} rows={3} />
            </div>
            <div>
              <label className={label}>Features (one per line)</label>
              <textarea {...register("features")} className={inp} rows={3} />
            </div>
            <div>
              <label className={label}>Service Image</label>
              {photoPreview && <img src={photoPreview} alt="" className="h-24 rounded-lg object-cover mb-2" />}
              <input ref={photoRef} type="file" accept="image/*" className="text-sm" onChange={e => { const f = e.target.files?.[0]; if (f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)); } }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label}>Display Order</label>
                <input {...register("display_order", { valueAsNumber: true })} type="number" className={inp} />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input {...register("is_visible")} type="checkbox" id="svis" className="h-4 w-4 rounded" />
                <label htmlFor="svis" className="text-sm text-slate-700">Visible on site</label>
              </div>
            </div>
            {serverError && <p className="text-red-500 text-sm bg-red-50 rounded p-2">{serverError}</p>}
          </form>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button type="button" onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2 text-sm">Cancel</button>
          <button form="service-form" type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg py-2 text-sm flex items-center justify-center gap-2">
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {isSubmitting ? "Saving…" : service ? "Save" : "Add Service"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function fetchServices() {
    try {
      const { data } = await supabase.from("services").select("*").order("display_order");
      setServices(data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchServices(); }, []);

  useEffect(() => {
    const channel = supabase
      .channel('rt-services')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, payload => {
        if (payload.eventType === 'INSERT') {
          const s = payload.new as Service;
          setServices(prev => prev.some(x => x.id === s.id) ? prev : [...prev, s]);
        } else if (payload.eventType === 'UPDATE') {
          setServices(prev => prev.map(x => x.id === payload.new.id ? payload.new as Service : x));
        } else if (payload.eventType === 'DELETE') {
          const id = (payload.old as { id: string }).id;
          setServices(prev => prev.filter(x => x.id !== id));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    const snapshot = [...services];
    setServices(prev => prev.filter(s => s.id !== target.id));
    setDeleteTarget(null);
    setToast({ message: "Service deleted", type: "success" });
    const { error } = await supabase.from("services").delete().eq("id", target.id);
    if (error) {
      setServices(snapshot);
      setToast({ message: "Delete failed: " + error.message, type: "error" });
    } else {
      cacheInvalidate("services:all");
    }
  }

  function toggleVisibility(s: Service) {
    const next = !s.is_visible;
    setServices(prev => prev.map(x => x.id === s.id ? { ...x, is_visible: next } : x));
    supabase.from("services").update({ is_visible: next }).eq("id", s.id).then(({ error }) => {
      if (error) {
        setServices(prev => prev.map(x => x.id === s.id ? { ...x, is_visible: s.is_visible } : x));
        setToast({ message: "Failed to update visibility", type: "error" });
      } else {
        cacheInvalidate("services:all");
      }
    });
  }

  function handleSaved(saved: Service) {
    setFormOpen(false);
    setEditTarget(null);
    setServices(prev => {
      const idx = prev.findIndex(s => s.id === saved.id);
      if (idx >= 0) return prev.map(s => s.id === saved.id ? saved : s);
      return [...prev, saved];
    });
    setToast({ message: "Saved", type: "success" });
    cacheInvalidate("services:all");
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteTarget && <ConfirmDialog title="Delete service" message={`Delete "${deleteTarget.title}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={false} />}
      {formOpen && <ServiceForm service={editTarget} onClose={() => { setFormOpen(false); setEditTarget(null); }} onSaved={handleSaved} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Services</h1>
          <p className="text-slate-500 text-sm mt-1">{services.length} total</p>
        </div>
        <button onClick={() => { setEditTarget(null); setFormOpen(true); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2.5 rounded-lg">
          <Plus size={16} /> Add Service
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
        : services.length === 0 ? <div className="py-16 text-center text-slate-400 text-sm">No services yet</div>
        : (
          <div className="divide-y divide-slate-100">
            {services.map(s => (
              <div key={s.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50">
                {s.photo_url
                  ? <img src={s.photo_url} alt={s.title} className="h-10 w-10 rounded-lg object-cover" />
                  : <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">{s.title[0]}</div>
                }
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800">{s.title}</p>
                  <p className="text-xs text-slate-400">/{s.slug} · order {s.display_order}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.is_visible ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                  {s.is_visible ? "Visible" : "Hidden"}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleVisibility(s)} className="text-slate-400 hover:text-slate-700">{s.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                  <button onClick={() => { setEditTarget(s); setFormOpen(true); }} className="text-blue-500 hover:text-blue-700"><Pencil size={15} /></button>
                  <button onClick={() => setDeleteTarget(s)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
