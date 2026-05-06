import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Mail, Clock, CheckCircle, Reply, Archive } from "lucide-react";
import Toast from "../../components/admin/Toast";

interface Submission {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  country_code: string | null;
  course_interest: string | null;
  message: string | null;
  status: "new" | "read" | "replied" | "archived";
  submitted_at: string;
}

const STATUS_OPTIONS = [
  { value: "new",      label: "New",      color: "bg-blue-100 text-blue-700" },
  { value: "read",     label: "Read",     color: "bg-yellow-100 text-yellow-700" },
  { value: "replied",  label: "Replied",  color: "bg-green-100 text-green-700" },
  { value: "archived", label: "Archived", color: "bg-slate-100 text-slate-500" },
];

function statusColor(status: string) {
  return STATUS_OPTIONS.find(s => s.value === status)?.color ?? "bg-slate-100 text-slate-500";
}

export default function Contacts() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "replied" | "archived">("all");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function fetchSubmissions() {
    try {
      const { data } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("submitted_at", { ascending: false });
      setSubmissions((data as Submission[]) ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSubmissions(); }, []);

  useEffect(() => {
    const channel = supabase
      .channel('rt-contacts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_submissions' }, payload => {
        if (payload.eventType === 'INSERT') {
          const s = payload.new as Submission;
          setSubmissions(prev => prev.some(x => x.id === s.id) ? prev : [s, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setSubmissions(prev => prev.map(x => x.id === payload.new.id ? payload.new as Submission : x));
        } else if (payload.eventType === 'DELETE') {
          const id = (payload.old as { id: string }).id;
          setSubmissions(prev => prev.filter(x => x.id !== id));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  function updateStatus(id: string, status: string) {
    const typedStatus = status as Submission["status"];
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: typedStatus } : s));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: typedStatus } : null);
    setToast({ message: `Marked as ${status}`, type: "success" });
    supabase.from("contact_submissions").update({ status }).eq("id", id).then(({ error }) => {
      if (error) {
        fetchSubmissions();
        setToast({ message: "Failed to update status", type: "error" });
      }
    });
  }

  const filtered = filter === "all" ? submissions : submissions.filter(s => s.status === filter);
  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s.value] = submissions.filter(sub => sub.status === s.value).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Contact Submissions</h1>
        <p className="text-slate-500 text-sm mt-1">{submissions.length} total · {counts.new ?? 0} new</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilter("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === "all" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
          All ({submissions.length})
        </button>
        {STATUS_OPTIONS.map(s => (
          <button key={s.value} onClick={() => setFilter(s.value as typeof filter)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s.value ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            {s.label} ({counts[s.value] ?? 0})
          </button>
        ))}
      </div>

      <div className="flex gap-4 h-[calc(100vh-240px)]">
        {/* List */}
        <div className="w-full lg:w-80 xl:w-96 bg-white rounded-xl border border-slate-200 overflow-y-auto shrink-0">
          {loading ? <div className="py-16 text-center text-slate-400 text-sm">Loading…</div>
          : filtered.length === 0 ? <div className="py-16 text-center text-slate-400 text-sm">No submissions</div>
          : filtered.map(s => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors ${selected?.id === s.id ? "bg-blue-50 border-l-2 border-l-blue-500" : ""}`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-slate-800 text-sm truncate">{s.full_name}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ml-2 ${statusColor(s.status)}`}>{s.status}</span>
              </div>
              <p className="text-xs text-slate-400 truncate">{s.email}</p>
              <p className="text-xs text-slate-400 mt-1">{new Date(s.submitted_at).toLocaleDateString()}</p>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-y-auto">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Mail size={32} className="mb-2" />
              <p className="text-sm">Select a submission to view details</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{selected.full_name}</h2>
                  <a href={`mailto:${selected.email}`} className="text-blue-600 text-sm hover:underline">{selected.email}</a>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(selected.status)}`}>{selected.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {selected.phone && (
                  <div><p className="text-xs text-slate-400">Phone</p><p className="text-sm text-slate-700">{selected.country_code} {selected.phone}</p></div>
                )}
                {selected.course_interest && (
                  <div><p className="text-xs text-slate-400">Course Interest</p><p className="text-sm text-slate-700">{selected.course_interest}</p></div>
                )}
                <div><p className="text-xs text-slate-400">Submitted</p><p className="text-sm text-slate-700">{new Date(selected.submitted_at).toLocaleString()}</p></div>
              </div>

              {selected.message && (
                <div className="mb-6">
                  <p className="text-xs text-slate-400 mb-1">Message</p>
                  <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-4">{selected.message}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-slate-400 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "read",     icon: Clock,         label: "Mark Read" },
                    { value: "replied",  icon: Reply,         label: "Mark Replied" },
                    { value: "archived", icon: Archive,       label: "Archive" },
                    { value: "new",      icon: CheckCircle,   label: "Mark New" },
                  ].map(({ value, icon: Icon, label }) => (
                    <button
                      key={value}
                      onClick={() => updateStatus(selected.id, value)}
                      disabled={selected.status === value}
                      className="flex items-center gap-2 text-xs px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Icon size={13} /> {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
