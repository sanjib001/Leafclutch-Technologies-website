import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, Pencil, Trash2, X, Loader2, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import Toast from "../../components/admin/Toast";
import { cacheInvalidate } from "../../lib/cache";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  photo_url: string | null;
  base_price: number | null;
  effective_price: number | null;
  duration: string | null;
  level: string | null;
  mode: string | null;
  is_visible: boolean;
  display_order: number;
}

const schema = z.object({
  title: z.string().min(1, "Required"),
  slug: z.string().min(1, "Required"),
  description: z.string().optional(),
  full_description: z.string().optional(),
  base_price: z.string().optional(),
  effective_price: z.string().optional(),
  enroll_from_price: z.string().optional(),
  installment_price: z.string().optional(),
  duration: z.string().optional(),
  level: z.string().optional(),
  mode: z.string().optional(),
  who_is_this_for: z.string().optional(),
  is_visible: z.boolean(),
  display_order: z.number(),
  benefits: z.string(),
  tools: z.string(),
  career_paths: z.string(),
  learning_outcomes: z.string(),
});
type FormData = z.infer<typeof schema>;

function CourseForm({ course, onClose, onSaved }: { course?: Course | null; onClose: () => void; onSaved: (saved: Course) => void }) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(course?.photo_url ?? "");
  const [serverError, setServerError] = useState("");
  const photoRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: course?.title ?? "", slug: course?.slug ?? "",
      description: course?.description ?? "",
      base_price: course?.base_price?.toString() ?? "", effective_price: course?.effective_price?.toString() ?? "",
      duration: course?.duration ?? "", level: course?.level ?? "", mode: course?.mode ?? "",
      is_visible: course?.is_visible ?? true, display_order: course?.display_order ?? 0,
      benefits: "", tools: "", career_paths: "", learning_outcomes: "",
    },
  });

  async function onSubmit(data: FormData) {
    setServerError("");
    try {
      const toArr = (s: string) => s.split("\n").map(x => x.trim()).filter(Boolean);
      const payload = {
        title: data.title, slug: data.slug, description: data.description || null,
        full_description: data.full_description || null,
        base_price: data.base_price ? Number(data.base_price) : null,
        effective_price: data.effective_price ? Number(data.effective_price) : null,
        enroll_from_price: data.enroll_from_price ? Number(data.enroll_from_price) : null,
        installment_price: data.installment_price || null,
        duration: data.duration || null, level: data.level || null, mode: data.mode || null,
        who_is_this_for: data.who_is_this_for || null,
        is_visible: data.is_visible, display_order: data.display_order,
        benefits: toArr(data.benefits), tools: toArr(data.tools),
        career_paths: toArr(data.career_paths), learning_outcomes: toArr(data.learning_outcomes),
      };
      let id = course?.id;
      let photo_url = course?.photo_url ?? null;
      if (course) {
        const { error } = await supabase.from("courses").update(payload).eq("id", course.id);
        if (error) throw error;
      } else {
        const { data: ins, error } = await supabase.from("courses").insert(payload).select().single();
        if (error) throw error;
        id = ins.id;
      }
      if (photoFile && id) {
        const ext = photoFile.name.split(".").pop();
        const path = `course-${id}.${ext}`;
        await supabase.storage.from("assets").upload(path, photoFile, { upsert: true });
        photo_url = supabase.storage.from("assets").getPublicUrl(path).data.publicUrl;
        await supabase.from("courses").update({ photo_url }).eq("id", id);
      }
      onSaved({
        id: id!, title: data.title, slug: data.slug, description: data.description || null,
        photo_url, base_price: payload.base_price, effective_price: payload.effective_price,
        duration: data.duration || null, level: data.level || null, mode: data.mode || null,
        is_visible: data.is_visible, display_order: data.display_order,
      });
    } catch (e: unknown) { setServerError((e as { message: string }).message); }
  }

  const inp = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const lbl = "block text-xs font-medium text-slate-600 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">{course ? "Edit" : "Add"} Course</h2>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <form id="course-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Title *</label>
                <input {...register("title")} className={inp} />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className={lbl}>Slug *</label>
                <input {...register("slug")} className={inp} placeholder="full-stack-development" />
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
              </div>
            </div>
            <div>
              <label className={lbl}>Short Description</label>
              <input {...register("description")} className={inp} />
            </div>
            <div>
              <label className={lbl}>Full Description</label>
              <textarea {...register("full_description")} className={inp} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Duration</label><input {...register("duration")} className={inp} placeholder="6 months" /></div>
              <div><label className={lbl}>Level</label><input {...register("level")} className={inp} placeholder="Beginner / Intermediate" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Mode</label><input {...register("mode")} className={inp} placeholder="Online / Offline" /></div>
              <div><label className={lbl}>Who is this for?</label><input {...register("who_is_this_for")} className={inp} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Base Price (NPR)</label><input {...register("base_price")} type="number" className={inp} /></div>
              <div><label className={lbl}>Effective Price (NPR)</label><input {...register("effective_price")} type="number" className={inp} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Enroll From Price</label><input {...register("enroll_from_price")} type="number" className={inp} /></div>
              <div><label className={lbl}>Installment Price</label><input {...register("installment_price")} className={inp} /></div>
            </div>
            <div>
              <label className={lbl}>Benefits (one per line)</label>
              <textarea {...register("benefits")} className={inp} rows={3} />
            </div>
            <div>
              <label className={lbl}>Tools (one per line)</label>
              <textarea {...register("tools")} className={inp} rows={3} />
            </div>
            <div>
              <label className={lbl}>Career Paths (one per line)</label>
              <textarea {...register("career_paths")} className={inp} rows={3} />
            </div>
            <div>
              <label className={lbl}>Learning Outcomes (one per line)</label>
              <textarea {...register("learning_outcomes")} className={inp} rows={3} />
            </div>
            <div>
              <label className={lbl}>Course Image</label>
              {photoPreview && <img src={photoPreview} alt="" className="h-24 rounded-lg object-cover mb-2" />}
              <input ref={photoRef} type="file" accept="image/*" className="text-sm" onChange={e => { const f = e.target.files?.[0]; if (f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)); } }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Display Order</label><input {...register("display_order", { valueAsNumber: true })} type="number" className={inp} /></div>
              <div className="flex items-center gap-2 pt-5">
                <input {...register("is_visible")} type="checkbox" id="cvis" className="h-4 w-4 rounded" />
                <label htmlFor="cvis" className="text-sm text-slate-700">Visible on site</label>
              </div>
            </div>
            {serverError && <p className="text-red-500 text-sm bg-red-50 rounded p-2">{serverError}</p>}
          </form>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button type="button" onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2 text-sm">Cancel</button>
          <button form="course-form" type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg py-2 text-sm flex items-center justify-center gap-2">
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {isSubmitting ? "Saving…" : course ? "Save" : "Add Course"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Course | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function fetchCourses() {
    try {
      const { data } = await supabase.from("courses").select("*").order("display_order");
      setCourses((data as Course[]) ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchCourses(); }, []);

  useEffect(() => {
    const channel = supabase
      .channel('rt-courses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, payload => {
        if (payload.eventType === 'INSERT') {
          const c = payload.new as Course;
          setCourses(prev => prev.some(x => x.id === c.id) ? prev : [...prev, c]);
        } else if (payload.eventType === 'UPDATE') {
          setCourses(prev => prev.map(x => x.id === payload.new.id ? payload.new as Course : x));
        } else if (payload.eventType === 'DELETE') {
          const id = (payload.old as { id: string }).id;
          setCourses(prev => prev.filter(x => x.id !== id));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    const snapshot = [...courses];
    setCourses(prev => prev.filter(c => c.id !== target.id));
    setDeleteTarget(null);
    setToast({ message: "Course deleted", type: "success" });
    const { error } = await supabase.from("courses").delete().eq("id", target.id);
    if (error) {
      setCourses(snapshot);
      setToast({ message: "Delete failed: " + error.message, type: "error" });
    } else {
      cacheInvalidate("trainings:all");
    }
  }

  function toggleVisibility(c: Course) {
    const next = !c.is_visible;
    setCourses(prev => prev.map(x => x.id === c.id ? { ...x, is_visible: next } : x));
    supabase.from("courses").update({ is_visible: next }).eq("id", c.id).then(({ error }) => {
      if (error) {
        setCourses(prev => prev.map(x => x.id === c.id ? { ...x, is_visible: c.is_visible } : x));
        setToast({ message: "Failed to update visibility", type: "error" });
      } else {
        cacheInvalidate("trainings:all");
      }
    });
  }

  function handleSaved(saved: Course) {
    setFormOpen(false);
    setEditTarget(null);
    setCourses(prev => {
      const idx = prev.findIndex(c => c.id === saved.id);
      if (idx >= 0) return prev.map(c => c.id === saved.id ? saved : c);
      return [...prev, saved];
    });
    setToast({ message: "Saved", type: "success" });
    cacheInvalidate("trainings:all");
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteTarget && <ConfirmDialog title="Delete course" message={`Delete "${deleteTarget.title}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={false} />}
      {formOpen && <CourseForm course={editTarget} onClose={() => { setFormOpen(false); setEditTarget(null); }} onSaved={handleSaved} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Courses</h1>
          <p className="text-slate-500 text-sm mt-1">{courses.length} total</p>
        </div>
        <button onClick={() => { setEditTarget(null); setFormOpen(true); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2.5 rounded-lg">
          <Plus size={16} /> Add Course
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
        : courses.length === 0 ? <div className="py-16 text-center text-slate-400 text-sm">No courses yet</div>
        : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Course</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Duration</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{c.title}</p>
                      <p className="text-xs text-slate-400">/{c.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{c.duration ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{c.effective_price ? `NPR ${c.effective_price}` : "—"}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${c.is_visible ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>{c.is_visible ? "Visible" : "Hidden"}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleVisibility(c)} className="text-slate-400 hover:text-slate-700">{c.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}</button>
                        <button onClick={() => { setEditTarget(c); setFormOpen(true); }} className="text-blue-500 hover:text-blue-700"><Pencil size={15} /></button>
                        <button onClick={() => setDeleteTarget(c)} className="text-red-400 hover:text-red-600"><Trash2 size={15} /></button>
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
