import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import {
  Award,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  LogOut,
  Menu,
  PencilLine,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  User,
  X,
  XCircle,
} from "lucide-react";
import { clearAuthSession } from "../api/auth";
import { LogoIcon } from "../components/Icons";
import "../styles/system-admin.css";
import "../styles/university-admin.css";

const sidebarItems = [
  { label: "Manage Scholarships", to: "/university-admin/scholarships", icon: Award },
  { label: "Manage Applications", to: "/university-admin/applications", icon: FileText },
];

const statusColors = {
  Active: "success",
  Completed: "success",
  Updated: "info",
  Removed: "danger",
  Suspended: "danger",
  Inactive: "neutral",
  "Pending Review": "warning",
  Approved: "success",
  Rejected: "danger",
  Submitted: "info",
  Hidden: "neutral",
  Draft: "neutral",
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getSection(pathname) {
  if (pathname.startsWith("/university-admin/scholarships")) return "scholarships";
  if (pathname.startsWith("/university-admin/applications")) return "applications";
  return "dashboard";
}

function StatusPill({ status }) {
  const tone = statusColors[status] || "neutral";
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "—";
  return <span className={`sa-pill sa-pill-${tone}`}>{label}</span>;
}

function SectionCard({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`sa-card ${className}`.trim()}>
      {(title || subtitle || action) && (
        <div className="sa-card-head">
          <div>
            {title && <h2 className="sa-card-title">{title}</h2>}
            {subtitle && <p className="sa-card-subtitle">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function ActionButton({ icon: Icon, children, onClick, destructive = false, ghost = false, compact = false }) {
  const className = [
    "sa-action-btn",
    destructive ? "sa-action-btn-danger" : "",
    ghost ? "sa-action-btn-ghost" : "",
    compact ? "sa-action-btn-compact" : "",
  ].join(" ");

  return (
    <button type="button" className={className} onClick={onClick}>
      {Icon && <Icon size={15} />}
      <span>{children}</span>
    </button>
  );
}

function Sidebar({ onLogout, isOpen, onClose }) {
  return (
    <>
      <div className={`sa-mobile-overlay ${isOpen ? "visible" : ""}`} onClick={onClose} />
      <aside className={`sa-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sa-brand">
          <div className="sa-brand-mark"><LogoIcon /></div>
          <div className="sa-brand-name">Campus<span style={{ color: "#8BB8F0" }}>Post</span></div>
        </div>

        <div className="sa-nav-section">
          <div className="sa-nav-section-label">Management</div>
          <nav className="sa-nav">
            <NavLink to="/university-admin" end className={({ isActive }) => `sa-nav-link${isActive ? " active" : ""}`} onClick={onClose}>
              <Building2 size={15} />
              <span>Dashboard</span>
            </NavLink>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.label} to={item.to} className={({ isActive }) => `sa-nav-link${isActive ? " active" : ""}`} onClick={onClose}>
                  <Icon size={15} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <button type="button" className="sa-logout" onClick={onLogout}>
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}

function TopNav({ onToggleSidebar }) {
  return (
    <header className="sa-topnav">
      <button type="button" className="sa-mobile-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <Menu size={20} />
      </button>
      <div className="sa-topnav-right">
        <div className="sa-topnav-profile">
          <div className="sa-avatar"><User size={18} /></div>
          <div>
            <div className="sa-role-label">University Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function ConfirmationModal({ open, title, description, confirmLabel = "Delete", onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="sa-modal-backdrop" role="presentation" onClick={onCancel}>
      <div className="sa-modal" role="dialog" aria-modal="true" aria-labelledby="ua-modal-title" onClick={(e) => e.stopPropagation()}>
        <div className="sa-modal-icon"><Trash2 size={18} /></div>
        <div className="sa-modal-body">
          <h3 id="ua-modal-title" className="sa-modal-title">{title}</h3>
          <p className="sa-modal-description">{description}</p>
        </div>
        <div className="sa-modal-actions">
          <button type="button" className="sa-secondary-btn" onClick={onCancel}>Cancel</button>
          <button type="button" className="sa-danger-btn" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="sa-toast-stack" aria-live="polite" aria-relevant="additions removals">
      {toasts.map((toast) => (
        <div key={toast.id} className={`sa-toast sa-toast-${toast.tone}`}>
          <div className="sa-toast-icon">{toast.tone === "danger" ? <XCircle size={16} /> : <CheckCircle2 size={16} />}</div>
          <div className="sa-toast-copy">
            <div className="sa-toast-title">{toast.title}</div>
            {toast.description && <div className="sa-toast-description">{toast.description}</div>}
          </div>
          <button type="button" className="sa-toast-close" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

const emptyScholarship = { title: "", amount: "", eligibility: "", deadline: "", description: "", spots: "", registration_url: "", contact_info: "" };

function ScholarshipModal({ open, scholarship, onSave, onCancel }) {
  const [form, setForm] = useState(emptyScholarship);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (scholarship) {
      setForm({
        title: scholarship.title || "",
        amount: scholarship.amount ?? "",
        eligibility: scholarship.eligibility || "",
        deadline: scholarship.deadline || "",
        description: scholarship.description || "",
        spots: scholarship.spots ?? "",
        registration_url: scholarship.registration_url || "",
        contact_info: scholarship.contact_info || "",
      });
    } else {
      setForm(emptyScholarship);
    }
  }, [scholarship, open]);

  if (!open) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        amount: form.amount !== "" ? Number(form.amount) : null,
        spots: form.spots !== "" ? Number(form.spots) : null,
      };
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sa-modal-backdrop" role="presentation" onClick={onCancel}>
      <div className="sa-modal" role="dialog" aria-modal="true" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
        <div className="sa-modal-body">
          <h3 className="sa-modal-title">{scholarship ? "Edit Scholarship" : "Create Scholarship"}</h3>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, marginTop: 16 }}>
            <div className="ua-form-grid">
              <div className="ua-form-group ua-full">
                <label className="ua-form-label">Title *</label>
                <input className="ua-form-input" required value={form.title} onChange={set("title")} />
              </div>
              <div className="ua-form-group">
                <label className="ua-form-label">Amount ($)</label>
                <input className="ua-form-input" type="number" min="0" step="0.01" value={form.amount} onChange={set("amount")} placeholder="0 for full scholarship" />
              </div>
              <div className="ua-form-group">
                <label className="ua-form-label">Available Spots</label>
                <input className="ua-form-input" type="number" min="0" value={form.spots} onChange={set("spots")} />
              </div>
              <div className="ua-form-group">
                <label className="ua-form-label">Deadline</label>
                <input className="ua-form-input" type="date" value={form.deadline} onChange={set("deadline")} />
              </div>
              <div className="ua-form-group">
                <label className="ua-form-label">Registration URL</label>
                <input className="ua-form-input" type="url" value={form.registration_url} onChange={set("registration_url")} placeholder="https://" />
              </div>
              <div className="ua-form-group ua-full">
                <label className="ua-form-label">Eligibility</label>
                <textarea className="ua-form-textarea" value={form.eligibility} onChange={set("eligibility")} />
              </div>
              <div className="ua-form-group ua-full">
                <label className="ua-form-label">Description</label>
                <textarea className="ua-form-textarea" value={form.description} onChange={set("description")} />
              </div>
              <div className="ua-form-group ua-full">
                <label className="ua-form-label">Contact Info</label>
                <input className="ua-form-input" value={form.contact_info} onChange={set("contact_info")} />
              </div>
            </div>
            <div className="sa-modal-actions" style={{ marginTop: 8 }}>
              <button type="button" className="sa-secondary-btn" onClick={onCancel}>Cancel</button>
              <button type="submit" className="sa-primary-btn" disabled={saving}>{saving ? "Saving..." : scholarship ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ApplicationDetailModal({ open, application, onApprove, onReject, onClose }) {
  const [note, setNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { setNote(""); }, [open]);

  if (!open || !application) return null;

  const profile = application.ApplicantProfile || {};
  const academic = application.AcademicInformation || {};
  const docs = application.ApplicationDocuments || [];

  const handleApprove = async () => {
    setActionLoading(true);
    try { await onApprove(application.application_id, note); } finally { setActionLoading(false); }
  };
  const handleReject = async () => {
    setActionLoading(true);
    try { await onReject(application.application_id, note); } finally { setActionLoading(false); }
  };

  return (
    <div className="sa-modal-backdrop" role="presentation" onClick={onClose}>
      <div className="sa-modal" role="dialog" aria-modal="true" style={{ maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
        <div className="sa-modal-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h3 className="sa-modal-title">Application #{application.ref_no || application.application_id}</h3>
              <p className="sa-modal-description" style={{ margin: "4px 0 0" }}>
                {application.User ? `${application.User.first_name} ${application.User.last_name}` : "—"} &middot; {application.Major?.major_name || "—"}
              </p>
            </div>
            <StatusPill status={application.admin_status || "pending"} />
          </div>

          <div className="ua-detail-grid">
            <div className="ua-detail-section">
              <div className="ua-detail-section-title">Applicant Profile</div>
              <dl style={{ display: "grid", gap: 8 }}>
                <div className="ua-detail-row"><dt>Full Name</dt><dd>{profile.full_name || "—"}</dd></div>
                <div className="ua-detail-row"><dt>Gender</dt><dd>{profile.gender || "—"}</dd></div>
                <div className="ua-detail-row"><dt>Date of Birth</dt><dd>{profile.date_of_birth || "—"}</dd></div>
                <div className="ua-detail-row"><dt>Email</dt><dd>{profile.email || application.User?.email || "—"}</dd></div>
                <div className="ua-detail-row"><dt>Phone</dt><dd>{profile.phone || "—"}</dd></div>
                <div className="ua-detail-row"><dt>City</dt><dd>{profile.city || "—"}</dd></div>
                <div className="ua-detail-row"><dt>Address</dt><dd>{profile.address || "—"}</dd></div>
              </dl>
            </div>

            <div className="ua-detail-section">
              <div className="ua-detail-section-title">Academic Information</div>
              <dl style={{ display: "grid", gap: 8 }}>
                <div className="ua-detail-row"><dt>High School</dt><dd>{academic.high_school || "—"}</dd></div>
                <div className="ua-detail-row"><dt>Graduation Year</dt><dd>{academic.graduation_year || "—"}</dd></div>
                <div className="ua-detail-row"><dt>GPA</dt><dd>{academic.gpa || "—"}</dd></div>
                <div className="ua-detail-row"><dt>Grade</dt><dd>{academic.grade || "—"}</dd></div>
                <div className="ua-detail-row"><dt>Study Program</dt><dd>{academic.study_program || "—"}</dd></div>
                <div className="ua-detail-row"><dt>English Proficiency</dt><dd>{academic.english_proficiency || "—"}</dd></div>
                <div className="ua-detail-row"><dt>Awards</dt><dd>{academic.awards || "—"}</dd></div>
              </dl>
            </div>
          </div>

          {application.Scholarship && (
            <div style={{ marginTop: 16 }}>
              <div className="ua-detail-section-title">Scholarship</div>
              <div className="ua-note-box">{application.Scholarship.title}</div>
            </div>
          )}

          {docs.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div className="ua-detail-section-title">Documents ({docs.length})</div>
              <div style={{ display: "grid", gap: 6 }}>
                {docs.map((doc) => (
                  <div key={doc.document_id} className="ua-note-box" style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{doc.document_type || "Document"}</span>
                    {doc.file_url && <a href={doc.file_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--sa-primary)", fontWeight: 700 }}>View</a>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {application.admin_note && (
            <div style={{ marginTop: 16 }}>
              <div className="ua-detail-section-title">Admin Note</div>
              <div className="ua-note-box">{application.admin_note}</div>
            </div>
          )}

          {(application.admin_status === "pending" || !application.admin_status) && (
            <div style={{ marginTop: 16 }}>
              <div className="ua-form-group">
                <label className="ua-form-label">Note (optional)</label>
                <textarea className="ua-form-textarea" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note for the applicant..." />
              </div>
            </div>
          )}

          <div className="sa-modal-actions" style={{ marginTop: 16 }}>
            <button type="button" className="sa-secondary-btn" onClick={onClose}>Close</button>
            {(application.admin_status === "pending" || !application.admin_status) && (
              <>
                <button type="button" className="sa-danger-btn" onClick={handleReject} disabled={actionLoading}>
                  <XCircle size={15} /> Reject
                </button>
                <button type="button" className="sa-primary-btn" onClick={handleApprove} disabled={actionLoading} style={{ background: "var(--sa-success)" }}>
                  <CheckCircle2 size={15} /> Approve
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView({ stats, navigate }) {
  const notificationTones = ["sa-notification-icon-purple", "sa-notification-icon-emerald", "sa-notification-icon-amber"];
  return (
    <div className="sa-dashboard-grid">
      <div className="sa-dashboard-left">
        <SectionCard>
          <div className="ua-stat-grid">
            <div className="ua-stat-card ua-stat-card-info">
              <div className="ua-stat-label">Total Applications</div>
              <div className="ua-stat-value">{stats.totalApplications}</div>
            </div>
            <div className="ua-stat-card ua-stat-card-warning">
              <div className="ua-stat-label">Pending Review</div>
              <div className="ua-stat-value">{stats.pendingApplications}</div>
            </div>
            <div className="ua-stat-card ua-stat-card-success">
              <div className="ua-stat-label">Approved</div>
              <div className="ua-stat-value">{stats.approvedApplications}</div>
            </div>
            <div className="ua-stat-card ua-stat-card-danger">
              <div className="ua-stat-label">Rejected</div>
              <div className="ua-stat-value">{stats.rejectedApplications}</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          action={<button type="button" className="sa-link-btn" onClick={() => navigate("/university-admin/applications")}>View All</button>}
        >
          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Program</th>
                  <th>Scholarship</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(stats.recentApplications || []).length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--sa-muted)", padding: 24 }}>No applications yet.</td></tr>
                )}
                {(stats.recentApplications || []).map((app, idx) => (
                  <tr key={app.application_id}>
                    <td>
                      <div className="sa-person-cell">
                        <div className="sa-avatar-sm"><User size={14} /></div>
                        <div>
                          <div className="sa-person-name">{app.User ? `${app.User.first_name} ${app.User.last_name}` : "—"}</div>
                          <div className="sa-person-meta">{app.User?.email || ""}</div>
                        </div>
                      </div>
                    </td>
                    <td>{app.Major?.major_name || "—"}</td>
                    <td>{app.Scholarship?.title || "—"}</td>
                    <td>{formatDate(app.createdAt)}</td>
                    <td><StatusPill status={app.admin_status || "pending"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <div className="sa-dashboard-right">
        <SectionCard>
          <div className="sa-quick-grid">
            <button type="button" className="sa-quick-action" onClick={() => navigate("/university-admin/scholarships")}>
              <div className="sa-quick-icon sa-quick-icon-purple"><Award size={16} /></div>
              <span>Manage Scholarships</span>
            </button>
            <button type="button" className="sa-quick-action" onClick={() => navigate("/university-admin/applications")}>
              <div className="sa-quick-icon sa-quick-icon-blue"><FileText size={16} /></div>
              <span>Review Applications</span>
            </button>
          </div>
        </SectionCard>

        <SectionCard>
          <div style={{ display: "grid", gap: 10 }}>
            <div className="sa-notification-item tone-purple">
              <div className="sa-notification-icon sa-notification-icon-purple"><Clock size={14} /></div>
              <div className="sa-notification-copy">
                <div className="sa-notification-title">Pending: {stats.pendingApplications}</div>
                <div className="sa-notification-time">Awaiting your review</div>
              </div>
            </div>
            <div className="sa-notification-item tone-emerald">
              <div className="sa-notification-icon sa-notification-icon-emerald"><CheckCircle2 size={14} /></div>
              <div className="sa-notification-copy">
                <div className="sa-notification-title">Approved: {stats.approvedApplications}</div>
                <div className="sa-notification-time">Successfully processed</div>
              </div>
            </div>
            <div className="sa-notification-item tone-amber">
              <div className="sa-notification-icon sa-notification-icon-amber"><XCircle size={14} /></div>
              <div className="sa-notification-copy">
                <div className="sa-notification-title">Rejected: {stats.rejectedApplications}</div>
                <div className="sa-notification-time">Applications declined</div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function ScholarshipsView({ scholarships, onEdit, onDelete, onToast }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [query]);

  const filtered = useMemo(() => {
    return scholarships.filter((s) => {
      return [s.title, s.eligibility, s.description].join(" ").toLowerCase().includes(query.toLowerCase());
    });
  }, [scholarships, query]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="sa-page-section">
      <div className="sa-page-heading">
        <h1>Manage Scholarships</h1>
        <button type="button" className="sa-primary-btn" onClick={() => onEdit(null)}><Plus size={15} />Add Scholarship</button>
      </div>

      <div className="sa-toolbar">
        <div className="sa-toolbar-search">
          <Search size={15} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search scholarships..." />
        </div>
      </div>

      <SectionCard className="sa-card-table">
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Spots</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--sa-muted)", padding: 24 }}>No scholarships found.</td></tr>
              )}
              {paged.map((s) => {
                const isExpired = s.deadline && new Date(s.deadline) < new Date();
                return (
                  <tr key={s.scholarship_id}>
                    <td>
                      <div className="sa-person-cell">
                        <div className="sa-avatar-sm sa-avatar-uni"><Award size={14} /></div>
                        <div>
                          <div className="sa-person-name">{s.title}</div>
                          {s.eligibility && <div className="sa-person-meta" style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.eligibility}</div>}
                        </div>
                      </div>
                    </td>
                    <td>{s.amount !== null && s.amount !== undefined ? (Number(s.amount) === 0 ? "Full" : `$${Number(s.amount).toLocaleString()}`) : "—"}</td>
                    <td>{s.spots ?? "—"}</td>
                    <td>{s.deadline ? formatDate(s.deadline) : "—"}</td>
                    <td><StatusPill status={isExpired ? "rejected" : "approved"} /></td>
                    <td>
                      <div className="sa-row-actions">
                        <ActionButton icon={PencilLine} compact ghost onClick={() => onEdit(s)}>Edit</ActionButton>
                        <ActionButton icon={Trash2} compact destructive ghost onClick={() => onDelete(s)}>Delete</ActionButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="sa-pagination">
          <button type="button" className="sa-page-btn" onClick={() => setPage((c) => Math.max(1, c - 1))} disabled={page === 1}><ChevronLeft size={15} /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" className={`sa-page-btn ${page === n ? "active" : ""}`} onClick={() => setPage(n)}>{n}</button>
          ))}
          <button type="button" className="sa-page-btn" onClick={() => setPage((c) => Math.min(totalPages, c + 1))} disabled={page === totalPages}><ChevronRight size={15} /></button>
        </div>
      </SectionCard>
    </div>
  );
}

function ApplicationsView({ applications, onView, onApprove, onReject, onToast }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [query, statusFilter]);

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const user = app.User || {};
      const name = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
      const email = (user.email || "").toLowerCase();
      const ref = (app.ref_no || "").toLowerCase();
      const major = (app.Major?.major_name || "").toLowerCase();
      const searchable = `${name} ${email} ${ref} ${major}`.toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const appStatus = app.admin_status || "pending";
      const matchesStatus = statusFilter === "All Statuses" || appStatus === statusFilter.toLowerCase();
      return matchesQuery && matchesStatus;
    });
  }, [applications, query, statusFilter]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="sa-page-section">
      <div className="sa-page-heading">
        <h1>Manage Applications</h1>
      </div>

      <div className="sa-toolbar">
        <div className="sa-toolbar-search">
          <Search size={15} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email, ref no, or program..." />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <SectionCard className="sa-card-table">
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Ref No</th>
                <th>Program</th>
                <th>Scholarship</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--sa-muted)", padding: 24 }}>No applications found.</td></tr>
              )}
              {paged.map((app, idx) => {
                const user = app.User || {};
                const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "—";
                const appStatus = app.admin_status || "pending";
                return (
                  <tr key={app.application_id}>
                    <td>
                      <div className="sa-person-cell">
                        <div className="sa-avatar-sm"><User size={14} /></div>
                        <div>
                          <div className="sa-person-name">{name}</div>
                          <div className="sa-person-meta">{user.email || ""}</div>
                        </div>
                      </div>
                    </td>
                    <td>{app.ref_no || "—"}</td>
                    <td>{app.Major?.major_name || "—"}</td>
                    <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.Scholarship?.title || "—"}</td>
                    <td>{formatDate(app.createdAt)}</td>
                    <td><StatusPill status={appStatus} /></td>
                    <td>
                      <div className="sa-row-actions">
                        <ActionButton icon={Eye} compact ghost onClick={() => onView(app)}>Review</ActionButton>
                        {appStatus === "pending" && (
                          <>
                            <ActionButton icon={CheckCircle2} compact ghost onClick={() => onApprove(app.application_id, "")}>Approve</ActionButton>
                            <ActionButton icon={XCircle} compact destructive ghost onClick={() => onReject(app.application_id, "")}>Reject</ActionButton>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="sa-pagination">
          <button type="button" className="sa-page-btn" onClick={() => setPage((c) => Math.max(1, c - 1))} disabled={page === 1}><ChevronLeft size={15} /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" className={`sa-page-btn ${page === n ? "active" : ""}`} onClick={() => setPage(n)}>{n}</button>
          ))}
          <button type="button" className="sa-page-btn" onClick={() => setPage((c) => Math.min(totalPages, c + 1))} disabled={page === totalPages}><ChevronRight size={15} /></button>
        </div>
      </SectionCard>
    </div>
  );
}

export default function UniversityAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const section = getSection(location.pathname);

  const [stats, setStats] = useState({
    university: null,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalScholarships: 0,
    recentApplications: [],
  });
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [scholarshipModal, setScholarshipModal] = useState({ open: false, scholarship: null });
  const [viewApplication, setViewApplication] = useState(null);
  const toastTimers = useRef(new Map());
  const [authChecked, setAuthChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("campuspost_token");
    if (!token) {
      navigate("/login");
      return;
    }
    setAuthChecked(true);
  }, [navigate]);

  const loadData = () => {
    Promise.all([
      api.get("/university-admin/dashboard").catch(() => null),
      api.get("/university-admin/scholarships").catch(() => null),
      api.get("/university-admin/applications").catch(() => null),
    ]).then(([dashData, scholData, appData]) => {
      if (dashData) setStats(dashData);
      if (Array.isArray(scholData)) setScholarships(scholData);
      if (Array.isArray(appData)) setApplications(appData);
    }).catch(() => {});
  };

  useEffect(() => { if (authChecked) loadData(); }, [authChecked]);

  useEffect(() => {
    return () => {
      toastTimers.current.forEach((id) => clearTimeout(id));
      toastTimers.current.clear();
    };
  }, []);

  const dismissToast = (toastId) => {
    setToasts((c) => c.filter((t) => t.id !== toastId));
    const tid = toastTimers.current.get(toastId);
    if (tid) { clearTimeout(tid); toastTimers.current.delete(toastId); }
  };

  const pushToast = (tone, title, description) => {
    const id = makeId("toast");
    setToasts((c) => [...c, { id, tone, title, description }]);
    const tid = window.setTimeout(() => dismissToast(id), 3600);
    toastTimers.current.set(id, tid);
  };

  const handleSaveScholarship = async (payload) => {
    try {
      if (scholarshipModal.scholarship) {
        await api.put(`/university-admin/scholarships/${scholarshipModal.scholarship.scholarship_id}`, payload).catch(() => null);
        setScholarships((current) => current.map((s) => s.scholarship_id === scholarshipModal.scholarship.scholarship_id ? { ...s, ...payload } : s));
        pushToast("success", "Scholarship updated", "The scholarship has been updated successfully.");
      } else {
        await api.post("/university-admin/scholarships", payload).catch(() => null);
        const newSchol = { ...payload, scholarship_id: Date.now() };
        setScholarships((current) => [newSchol, ...current]);
        pushToast("success", "Scholarship created", "A new scholarship has been added.");
      }
      setScholarshipModal({ open: false, scholarship: null });
    } catch (err) {
      pushToast("danger", "Error", err.message || "Failed to save scholarship.");
    }
  };

  const handleDeleteScholarship = () => {
    if (!deleteTarget) return;
    api.delete(`/university-admin/scholarships/${deleteTarget.id}`).catch(() => null);
    setScholarships((current) => current.filter((s) => s.scholarship_id !== deleteTarget.id));
    pushToast("success", `${deleteTarget.name} deleted`, "Scholarship removed.");
    setDeleteTarget(null);
  };

  const handleApprove = async (appId, note) => {
    try {
      await api.put(`/university-admin/applications/${appId}/approve`, { note: note || undefined }).catch(() => null);
      setApplications((current) => current.map((a) => a.application_id === appId ? { ...a, admin_status: "approved", admin_note: note || a.admin_note } : a));
      setStats((s) => ({ ...s, pendingApplications: Math.max(0, s.pendingApplications - 1), approvedApplications: s.approvedApplications + 1 }));
      pushToast("success", "Application approved", "The application has been approved.");
      setViewApplication(null);
    } catch (err) {
      pushToast("danger", "Error", err.message || "Failed to approve.");
    }
  };

  const handleReject = async (appId, note) => {
    try {
      await api.put(`/university-admin/applications/${appId}/reject`, { note: note || undefined }).catch(() => null);
      setApplications((current) => current.map((a) => a.application_id === appId ? { ...a, admin_status: "rejected", admin_note: note || a.admin_note } : a));
      setStats((s) => ({ ...s, pendingApplications: Math.max(0, s.pendingApplications - 1), rejectedApplications: s.rejectedApplications + 1 }));
      pushToast("success", "Application rejected", "The application has been rejected.");
      setViewApplication(null);
    } catch (err) {
      pushToast("danger", "Error", err.message || "Failed to reject.");
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  if (!authChecked) return null;

  return (
    <div className="sa-shell">
      <Sidebar onLogout={handleLogout} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="sa-content">
        <TopNav onToggleSidebar={() => setSidebarOpen((o) => !o)} />

        <main className="sa-main">
          {section === "dashboard" && (
            <>
              <div className="sa-page-title-block">
                <h1>Dashboard</h1>
              </div>
              <DashboardView stats={stats} navigate={navigate} />
            </>
          )}

          {section === "scholarships" && (
            <ScholarshipsView
              scholarships={scholarships}
              onEdit={(s) => setScholarshipModal({ open: true, scholarship: s })}
              onDelete={(s) => setDeleteTarget({ type: "scholarship", id: s.scholarship_id, name: s.title })}
              onToast={pushToast}
            />
          )}

          {section === "applications" && (
            <ApplicationsView
              applications={applications}
              onView={(app) => setViewApplication(app)}
              onApprove={handleApprove}
              onReject={handleReject}
              onToast={pushToast}
            />
          )}
        </main>
      </div>

      <ConfirmationModal
        open={Boolean(deleteTarget)}
        title={deleteTarget ? `Delete ${deleteTarget.name}?` : "Delete item?"}
        description="This action cannot be undone. The selected record will be permanently removed."
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteScholarship}
      />

      <ScholarshipModal
        open={scholarshipModal.open}
        scholarship={scholarshipModal.scholarship}
        onSave={handleSaveScholarship}
        onCancel={() => setScholarshipModal({ open: false, scholarship: null })}
      />

      <ApplicationDetailModal
        open={Boolean(viewApplication)}
        application={viewApplication}
        onApprove={handleApprove}
        onReject={handleReject}
        onClose={() => setViewApplication(null)}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
