import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, ShieldCheck, ShieldOff } from "lucide-react";
import MemberForm, { type MemberRow } from "./MemberForm";
import ConfirmDialog from "./ConfirmDialog";
import Toast from "./Toast";
import { cacheInvalidate } from "../../lib/cache";

interface Props {
  role: "TEAM" | "INTERN";
  title: string;
}

export default function MembersTable({ role, title }: Props) {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MemberRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MemberRow | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const cacheKey = role === "TEAM" ? "members:teams" : "members:interns";

  async function fetchMembers() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("members")
        .select("*")
        .eq("role", role)
        .order("created_at", { ascending: false });
      setMembers((data as MemberRow[]) ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchMembers(); }, [role]);

  useEffect(() => {
    const channel = supabase
      .channel(`rt-members-${role}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, payload => {
        if (payload.eventType === 'INSERT') {
          const m = payload.new as MemberRow;
          if (m.role === role) setMembers(prev => prev.some(x => x.id === m.id) ? prev : [m, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const m = payload.new as MemberRow;
          setMembers(prev => prev.map(x => x.id === m.id ? m : x));
        } else if (payload.eventType === 'DELETE') {
          const id = (payload.old as { id: string }).id;
          setMembers(prev => prev.filter(x => x.id !== id));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [role]);

  async function handleDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    const snapshot = [...members];
    setMembers(prev => prev.filter(m => m.id !== target.id));
    setDeleteTarget(null);
    setToast({ message: "Member deleted", type: "success" });
    if (target.photo_url) {
      const path = target.photo_url.split("/profile-photos/")[1];
      if (path) supabase.storage.from("profile-photos").remove([path]);
    }
    const { error } = await supabase.from("members").delete().eq("id", target.id);
    if (error) {
      setMembers(snapshot);
      setToast({ message: error.message, type: "error" });
    } else {
      cacheInvalidate(cacheKey);
    }
  }

  function toggleVisibility(member: MemberRow) {
    const next = !member.is_visible;
    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, is_visible: next } : m));
    supabase.from("members").update({ is_visible: next }).eq("id", member.id).then(({ error }) => {
      if (error) {
        setMembers(prev => prev.map(m => m.id === member.id ? { ...m, is_visible: member.is_visible } : m));
        setToast({ message: "Failed to update visibility", type: "error" });
      } else {
        cacheInvalidate(cacheKey);
      }
    });
  }

  function toggleVerified(member: MemberRow) {
    const next = !member.is_verified;
    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, is_verified: next } : m));
    supabase.from("members").update({ is_verified: next }).eq("id", member.id).then(({ error }) => {
      if (error) {
        setMembers(prev => prev.map(m => m.id === member.id ? { ...m, is_verified: member.is_verified } : m));
        setToast({ message: "Failed to update verification", type: "error" });
      } else {
        setToast({ message: next ? `${member.name} marked as Verified` : `${member.name} unverified`, type: "success" });
        cacheInvalidate(cacheKey);
      }
    });
  }

  function handleSaved(saved: MemberRow) {
    setFormOpen(false);
    setEditTarget(null);
    setMembers(prev => {
      const idx = prev.findIndex(m => m.id === saved.id);
      if (idx >= 0) return prev.map(m => m.id === saved.id ? saved : m);
      return [saved, ...prev];
    });
    setToast({ message: "Saved successfully", type: "success" });
    cacheInvalidate(cacheKey);
  }

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete member"
          message={`Delete "${deleteTarget.name}"? All their documents will also be deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={false}
        />
      )}
      {formOpen && (
        <MemberForm
          member={editTarget}
          defaultRole={role}
          onClose={() => { setFormOpen(false); setEditTarget(null); }}
          onSaved={handleSaved}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          <p className="text-slate-500 text-sm mt-1">{members.length} total</p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setFormOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add {role === "TEAM" ? "Member" : "Intern"}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or position…"
          className="w-full border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">No records found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Member</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Position</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Company Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Joined</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Verified</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(member => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.photo_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=3b82f6&color=fff`}
                          alt={member.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-slate-800">{member.name}</p>
                          {member.phone_number && <p className="text-xs text-slate-400">{member.phone_number}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{member.position}</td>
                    <td className="px-4 py-3 text-slate-500">{member.company_email ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{member.start_date}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                        ${member.end_date ? "bg-slate-100 text-slate-600" : "bg-green-100 text-green-700"}`}>
                        {member.end_date ? "Alumni" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleVerified(member)}
                        title={member.is_verified ? "Revoke verification" : "Mark as verified"}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors
                          ${member.is_verified
                            ? "bg-emerald-100 text-emerald-700 hover:bg-red-50 hover:text-red-600"
                            : "bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                          }`}
                      >
                        {member.is_verified
                          ? <><ShieldCheck size={13} /> Verified</>
                          : <><ShieldOff size={13} /> Not Verified</>
                        }
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleVisibility(member)}
                          title={member.is_visible ? "Hide from site" : "Show on site"}
                          className="text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          {member.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => { setEditTarget(member); setFormOpen(true); }}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(member)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
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
