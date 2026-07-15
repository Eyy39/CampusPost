import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Eye,
  EyeOff,
  LockKeyhole,
  LogOut,
  Menu,
  MessageSquareWarning,
  PencilLine,
  PanelLeftClose,
  Plus,
  Search,
  ShieldAlert,
  Star,
  Trash2,
  UserCog,
  UserRound,
  Users,
  X,
  RotateCcw,
  ShieldCheck,
  User,
} from "lucide-react";
import { clearAuthSession } from "../api/auth";
import { LogoIcon } from "../components/Icons";
import "../styles/system-admin.css";

const sidebarSections = [
  {
    label: "Management",
    items: [
      { label: "Universities", to: "/system-admin/universities", icon: Building2 },
      { label: "University Admins", to: "/system-admin/admin-accounts", icon: UserCog },
      { label: "Students", to: "/system-admin/users", icon: Users },
    ],
  },
  {
    label: "Moderation",
    items: [
      { label: "Reviews", to: "/system-admin/reviews", icon: MessageSquareWarning },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "My Profile", to: "/system-admin/profile", icon: User },
    ],
  },
];

const activityRows = [
  { activity: "Added new university", by: "System Administrator", date: "Today, 09:15", status: "Completed" },
  { activity: "Updated university information", by: "Dara Chhay", date: "Today, 08:42", status: "Updated" },
  { activity: "Created university admin account", by: "System Administrator", date: "Yesterday, 17:30", status: "Completed" },
  { activity: "Deleted inappropriate review", by: "Moderation Team", date: "Yesterday, 16:18", status: "Removed" },
  { activity: "Suspended user account", by: "System Administrator", date: "2 days ago, 11:05", status: "Removed" },
];

const notificationRows = [
  { icon: UserRound, title: "New student registered.", time: "2m ago", tone: "purple" },
  { icon: Building2, title: "University information updated.", time: "12m ago", tone: "emerald" },
  { icon: MessageSquareWarning, title: "Review reported by a student.", time: "24m ago", tone: "amber" },
  { icon: UserCog, title: "University admin account created.", time: "1h ago", tone: "blue" },
  { icon: ShieldAlert, title: "User account suspended.", time: "3h ago", tone: "rose" },
];

const quickActions = [
  { label: "Add University", icon: CirclePlus, to: "/system-admin/universities" },
  { label: "Create University Admin", icon: UserCog, to: "/system-admin/admin-accounts" },
  { label: "Manage Users", icon: Users, to: "/system-admin/users" },
  { label: "Moderate Reviews", icon: MessageSquareWarning, to: "/system-admin/reviews" },
];

const reportStatusColors = {
  "Under Review": "warning",
  Escalated: "danger",
  Resolved: "success",
};

const statusColors = {
  Active: "success",
  active: "success",
  Suspended: "danger",
  suspended: "danger",
  Completed: "success",
  Updated: "info",
  Removed: "danger",
  Inactive: "neutral",
  "Pending Review": "warning",
  Approved: "success",
  Submitted: "info",
  Hidden: "neutral",
  Draft: "neutral",
};

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function getSection(pathname) {
  if (pathname.startsWith("/system-admin/universities")) return "universities";
  if (pathname.startsWith("/system-admin/admin-accounts")) return "admin-accounts";
  if (pathname.startsWith("/system-admin/users")) return "users";
  if (pathname.startsWith("/system-admin/reviews")) return "reviews";
  if (pathname.startsWith("/system-admin/profile")) return "profile";
  return "dashboard";
}

function fullName(user) {
  return `${user.first_name} ${user.last_name}`;
}

function statusLabel(status) {
  if (status === "suspended") return "Suspended";
  return "Active";
}

function StatusPill({ status }) {
  const label = statusLabel(status);
  const tone = reportStatusColors[label] || statusColors[label] || "neutral";
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

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="sa-empty">
      <div className="sa-empty-icon"><Icon size={22} /></div>
      <h3 className="sa-empty-title">{title}</h3>
      <p className="sa-empty-desc">{description}</p>
    </div>
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

        {sidebarSections.map((section) => (
          <div key={section.label} className="sa-nav-section">
            <div className="sa-nav-section-label">{section.label}</div>
            <nav className="sa-nav">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `sa-nav-link${isActive ? " active" : ""}`} onClick={onClose}>
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}

        <button type="button" className="sa-logout" onClick={onLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}

function TopNav({ adminProfile, onToggleSidebar, onNavigateProfile }) {
  const displayName = adminProfile ? `${adminProfile.first_name} ${adminProfile.last_name}` : "System Administrator";
  return (
    <header className="sa-topnav">
      <button type="button" className="sa-mobile-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <Menu size={20} />
      </button>
      <div className="sa-topnav-right" onClick={onNavigateProfile} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onNavigateProfile()}>
        <div className="sa-avatar"><User size={18} /></div>
        <div>
          <div className="sa-role-label">{displayName}</div>
          <div className="sa-role-subtitle">System Administrator</div>
        </div>
      </div>
    </header>
  );
}

function ConfirmationModal({ open, title, description, confirmLabel = "Delete", onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="sa-modal-backdrop" role="presentation" onClick={onCancel}>
      <div className="sa-modal" role="dialog" aria-modal="true" aria-labelledby="sa-modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="sa-modal-icon"><Trash2 size={18} /></div>
        <div className="sa-modal-body">
          <h3 id="sa-modal-title" className="sa-modal-title">{title}</h3>
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

function SuspendModal({ open, user, onCancel, onConfirm }) {
  if (!open || !user) return null;
  const isSuspended = user.status === "suspended";
  const name = fullName(user);

  return (
    <div className="sa-modal-backdrop" role="presentation" onClick={onCancel}>
      <div className="sa-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="sa-modal-icon" style={{ color: isSuspended ? "#16a34a" : "#d97706" }}>
          {isSuspended ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
        </div>
        <div className="sa-modal-body">
          <h3 className="sa-modal-title">{isSuspended ? `Reactivate ${name}?` : `Suspend ${name}?`}</h3>
          <p className="sa-modal-description">
            {isSuspended
              ? "This user will be able to log in and use the platform again."
              : "This user will not be able to log in until an administrator reactivates their account."}
          </p>
        </div>
        <div className="sa-modal-actions">
          <button type="button" className="sa-secondary-btn" onClick={onCancel}>Cancel</button>
          <button
            type="button"
            className={isSuspended ? "sa-primary-btn" : "sa-danger-btn"}
            onClick={onConfirm}
          >
            {isSuspended ? "Reactivate" : "Suspend"}
          </button>
        </div>
      </div>
    </div>
  );
}

const emptyUniversity = { name: "", country: "Cambodia", city: "", website: "", email: "", phone: "" };

function UniversityModal({ open, university, onSave, onCancel }) {
  const [form, setForm] = useState(emptyUniversity);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (university) {
      setForm({
        name: university.name || "",
        country: university.country || "Cambodia",
        city: university.city || "",
        website: university.website || "",
        email: university.email || "",
        phone: university.phone || "",
      });
    } else {
      setForm(emptyUniversity);
    }
  }, [university, open]);

  if (!open) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sa-modal-backdrop" role="presentation" onClick={onCancel}>
      <div className="sa-modal" role="dialog" aria-modal="true" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
        <div className="sa-modal-body">
          <h3 className="sa-modal-title">{university ? "Edit University" : "Add University"}</h3>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, marginTop: 16 }}>
            <div className="ua-form-grid">
              <div className="ua-form-group ua-full">
                <label className="ua-form-label">University Name *</label>
                <input className="ua-form-input" required value={form.name} onChange={set("name")} />
              </div>
              <div className="ua-form-group">
                <label className="ua-form-label">Country</label>
                <input className="ua-form-input" value={form.country} onChange={set("country")} />
              </div>
              <div className="ua-form-group">
                <label className="ua-form-label">City</label>
                <input className="ua-form-input" value={form.city} onChange={set("city")} />
              </div>
              <div className="ua-form-group">
                <label className="ua-form-label">Website</label>
                <input className="ua-form-input" type="url" value={form.website} onChange={set("website")} placeholder="https://" />
              </div>
              <div className="ua-form-group">
                <label className="ua-form-label">Email</label>
                <input className="ua-form-input" type="email" value={form.email} onChange={set("email")} />
              </div>
              <div className="ua-form-group">
                <label className="ua-form-label">Phone</label>
                <input className="ua-form-input" value={form.phone} onChange={set("phone")} />
              </div>
            </div>
            <div className="sa-modal-actions" style={{ marginTop: 8 }}>
              <button type="button" className="sa-secondary-btn" onClick={onCancel}>Cancel</button>
              <button type="submit" className="sa-primary-btn" disabled={saving}>{saving ? "Saving..." : university ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const emptyAdmin = { first_name: "", last_name: "", email: "", university_id: "", password: "", confirmPassword: "" };

function AdminModal({ open, admin, universities, onSave, onCancel }) {
  const [form, setForm] = useState(emptyAdmin);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (admin) {
      setForm({
        first_name: admin.first_name || "",
        last_name: admin.last_name || "",
        email: admin.email || "",
        university_id: admin.university_id || "",
        password: "",
        confirmPassword: "",
      });
    } else {
      setForm(emptyAdmin);
    }
  }, [admin, open]);

  if (!open) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admin && form.password !== form.confirmPassword) return;
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sa-modal-backdrop" role="presentation" onClick={onCancel}>
      <div className="sa-modal" role="dialog" aria-modal="true" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
        <div className="sa-modal-body">
          <h3 className="sa-modal-title">{admin ? "Edit Admin Account" : "Create Admin Account"}</h3>
          {(!admin && form.password && form.confirmPassword && form.password !== form.confirmPassword) && (
            <div style={{ color: "#DC2626", fontSize: 12, marginTop: 8 }}>Passwords do not match.</div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, marginTop: 16 }}>
            <div className="ua-form-grid">
              <div className="ua-form-group">
                <label className="ua-form-label">First Name *</label>
                <input className="ua-form-input" required value={form.first_name} onChange={set("first_name")} />
              </div>
              <div className="ua-form-group">
                <label className="ua-form-label">Last Name *</label>
                <input className="ua-form-input" required value={form.last_name} onChange={set("last_name")} />
              </div>
              <div className="ua-form-group ua-full">
                <label className="ua-form-label">Email *</label>
                <input className="ua-form-input" type="email" required value={form.email} onChange={set("email")} />
              </div>
              <div className="ua-form-group ua-full">
                <label className="ua-form-label">Assigned University</label>
                <select className="ua-form-input" value={form.university_id} onChange={set("university_id")}>
                  <option value="">Select university</option>
                  {universities.map((u) => (
                    <option key={u.university_id} value={u.university_id}>{u.name}</option>
                  ))}
                </select>
              </div>
              {!admin && (
                <>
                  <div className="ua-form-group ua-full">
                    <label className="ua-form-label">Password *</label>
                    <input className="ua-form-input" type="password" required value={form.password} onChange={set("password")} minLength={6} />
                  </div>
                  <div className="ua-form-group ua-full">
                    <label className="ua-form-label">Confirm Password *</label>
                    <input className="ua-form-input" type="password" required value={form.confirmPassword} onChange={set("confirmPassword")} minLength={6} />
                  </div>
                </>
              )}
            </div>
            <div className="sa-modal-actions" style={{ marginTop: 8 }}>
              <button type="button" className="sa-secondary-btn" onClick={onCancel}>Cancel</button>
              <button type="submit" className="sa-primary-btn" disabled={saving}>{saving ? "Saving..." : admin ? "Update" : "Create"}</button>
            </div>
          </form>
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
          <div className="sa-toast-icon">{toast.tone === "danger" ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}</div>
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

function DashboardView({ navigate, students, reviews, onDeleteReview, onHideReview }) {
  return (
    <div className="sa-dashboard-grid">
      <div className="sa-dashboard-left">
        <SectionCard title="Recent Activity" subtitle="Most recent actions across the platform.">
          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Performed By</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activityRows.map((row, idx) => (
                  <tr key={`${row.activity}-${row.date}`}>
                    <td>{row.activity}</td>
                    <td>{row.by}</td>
                    <td>{row.date}</td>
                    <td><StatusPill status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          title="Recently Registered Users"
          subtitle="Newest student accounts created in CampusPost."
          action={<button type="button" className="sa-link-btn" onClick={() => navigate("/system-admin/users")}>View All</button>}
        >
          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Registered</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 5).map((student, idx) => (
                  <tr key={student.user_id}>
                    <td>
                      <div className="sa-person-cell">
                        <div className="sa-avatar-sm"><User size={14} /></div>
                        <div>
                          <div className="sa-person-name">{fullName(student)}</div>
                          <div className="sa-person-meta">{student.Role?.role_name || "Student"}</div>
                        </div>
                      </div>
                    </td>
                    <td>{student.email}</td>
                    <td>{formatDate(student.createdAt)}</td>
                    <td><StatusPill status={student.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>

      <div className="sa-dashboard-right">
        <SectionCard title="Quick Actions" subtitle="Fast access to the most common admin tasks.">
          <div className="sa-quick-grid">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              const colors = ["sa-quick-icon-purple", "sa-quick-icon-blue", "sa-quick-icon-emerald", "sa-quick-icon-amber"];
              return (
                <button key={action.label} type="button" className="sa-quick-action" onClick={() => navigate(action.to)}>
                  <div className={`sa-quick-icon ${colors[idx % colors.length]}`}><Icon size={16} /></div>
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Recent Notifications" subtitle="Important system updates and moderation alerts.">
          <div className="sa-notification-list">
            {notificationRows.map((notification) => {
              const Icon = notification.icon;
              return (
                <div key={`${notification.title}-${notification.time}`} className="sa-notification-item">
                  <div className={`sa-notification-icon sa-notification-icon-${notification.tone}`}><Icon size={14} /></div>
                  <div style={{ minWidth: 0 }}>
                    <div className="sa-notification-title">{notification.title}</div>
                    <div className="sa-notification-time">{notification.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Reviews Awaiting Attention" subtitle="Reported reviews that need a quick moderation decision.">
          <div className="sa-review-list">
            {reviews.slice(0, 4).map((review) => (
              <div key={review.review_id} className="sa-review-item">
                <div className="sa-review-topline">
                  <div>
                    <div className="sa-review-name">{review.User ? fullName(review.User) : "Unknown"}</div>
                    <div className="sa-review-university">{review.University?.name || "Unknown"}</div>
                  </div>
                  <div className="sa-rating-pill"><Star size={12} />{review.rating.toFixed(1)}</div>
                </div>
                <p className="sa-review-preview">{review.comment || ""}</p>
                <div className="sa-review-actions">
                  <ActionButton icon={Eye} compact ghost onClick={() => navigate("/system-admin/reviews")}>View</ActionButton>
                  <ActionButton icon={EyeOff} compact ghost onClick={() => onHideReview(review)}>Hide</ActionButton>
                  <ActionButton icon={Trash2} compact destructive ghost onClick={() => onDeleteReview(review)}>Delete</ActionButton>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function UniversitiesView({ universities, onDelete, onAdd, onEdit, onView }) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All Countries");
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [query, country]);

  const filtered = useMemo(() => {
    return universities.filter((u) => {
      const matchesQuery = [u.name, u.country].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesCountry = country === "All Countries" || u.country === country;
      return matchesQuery && matchesCountry;
    });
  }, [universities, query, country]);

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const countries = ["All Countries", ...Array.from(new Set(universities.map((u) => u.country).filter(Boolean)))];

  return (
    <div className="sa-page-section">
      <div className="sa-page-heading">
        <h1>Manage Universities</h1>
        <button type="button" className="sa-primary-btn" onClick={onAdd}><Plus size={15} />Add University</button>
      </div>

      <div className="sa-toolbar">
        <div className="sa-toolbar-search">
          <Search size={15} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search universities..." />
        </div>
        <select value={country} onChange={(event) => setCountry(event.target.value)}>
          {countries.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <SectionCard className="sa-card-table">
        {paged.length === 0 ? (
          <EmptyState icon={Building2} title="No universities found" description={query || country !== "All Countries" ? "Try adjusting your search or filter." : "Add a university to get started."} />
        ) : (
          <>
            <div className="sa-table-wrap">
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>University</th>
                    <th>Country</th>
                    <th style={{ textAlign: "center" }}>Majors</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((u, idx) => {
                    return (
                      <tr key={u.university_id}>
                        <td>
                          <div className="sa-person-cell">
                            <div className="sa-avatar-sm sa-avatar-uni"><Building2 size={14} /></div>
                            <div>
                              <div className="sa-person-name">{u.name}</div>
                            </div>
                          </div>
                        </td>
                        <td>{u.country || "—"}</td>
                        <td style={{ textAlign: "center" }}>{u.Majors?.length || 0}</td>
                        <td><StatusPill status="Active" /></td>
                        <td>
                          <div className="sa-row-actions">
                            <ActionButton icon={Eye} compact ghost onClick={() => onView(u)}>View</ActionButton>
                            <ActionButton icon={PencilLine} compact ghost onClick={() => onEdit(u)}>Edit</ActionButton>
                            <ActionButton icon={Trash2} compact destructive ghost onClick={() => onDelete(u.university_id, u.name)}>Delete</ActionButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="sa-pagination">
              <button type="button" className="sa-page-btn" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}><ChevronLeft size={14} /></button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button key={pageNumber} type="button" className={`sa-page-btn ${page === pageNumber ? "active" : ""}`} onClick={() => setPage(pageNumber)}>
                  {pageNumber}
                </button>
              ))}
              <button type="button" className="sa-page-btn" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}><ChevronRight size={14} /></button>
            </div>
          </>
        )}
      </SectionCard>
    </div>
  );
}

function AdminAccountsView({ admins, onAdd, onEdit, onView, onResetPassword, onSuspend, onDelete }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return admins.filter((a) => [fullName(a), a.email, a.AssignedUniversity?.name || ""].join(" ").toLowerCase().includes(query.toLowerCase()));
  }, [admins, query]);

  return (
    <div className="sa-page-section">
      <div className="sa-page-heading">
        <h1>Manage University Admins</h1>
        <button type="button" className="sa-primary-btn" onClick={onAdd}><Plus size={15} />Create Admin</button>
      </div>

      <div className="sa-toolbar">
        <div className="sa-toolbar-search">
          <Search size={15} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search admins..." />
        </div>
      </div>

      <SectionCard className="sa-card-table">
        {filtered.length === 0 ? (
          <EmptyState icon={UserCog} title="No admin accounts found" description={query ? "Try a different search term." : "Create an admin account to get started."} />
        ) : (
          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>University</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, idx) => (
                  <tr key={a.user_id}>
                    <td>
                      <div className="sa-person-cell">
                        <div className="sa-avatar-sm"><User size={14} /></div>
                        <div className="sa-person-name">{fullName(a)}</div>
                      </div>
                    </td>
                    <td>{a.email}</td>
                    <td>{a.AssignedUniversity?.name || "—"}</td>
                    <td><StatusPill status={a.status} /></td>
                    <td>{formatDate(a.createdAt)}</td>
                    <td>
                      <div className="sa-row-actions">
                        <ActionButton icon={Eye} compact ghost onClick={() => onView(a)}>View</ActionButton>
                        <ActionButton icon={PencilLine} compact ghost onClick={() => onEdit(a)}>Edit</ActionButton>
                        <ActionButton icon={LockKeyhole} compact ghost onClick={() => onResetPassword(a)}>Reset</ActionButton>
                        <ActionButton icon={ShieldAlert} compact ghost onClick={() => onSuspend(a)}>
                          {a.status === "suspended" ? "Reactivate" : "Suspend"}
                        </ActionButton>
                        <ActionButton icon={Trash2} compact destructive ghost onClick={() => onDelete("admin", a.user_id, fullName(a))}>Delete</ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function UsersView({ students, onDeleteUser, onSuspend, onViewProfile }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    return students.filter((u) => {
      const searchable = [fullName(u), u.email].join(" ").toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesStatus = statusFilter === "All" || u.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [students, query, statusFilter]);

  return (
    <div className="sa-page-section">
      <div className="sa-page-heading">
        <h1>Manage Users</h1>
      </div>

      <div className="sa-toolbar">
        <div className="sa-toolbar-search">
          <Search size={15} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search students..." />
        </div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="All">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <SectionCard className="sa-card-table">
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No students found" description={query || statusFilter !== "All" ? "Try adjusting your search or filter." : "No student accounts yet."} />
        ) : (
          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Registered</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, idx) => (
                  <tr key={u.user_id}>
                    <td>
                      <div className="sa-person-cell">
                        <div className="sa-avatar-sm"><User size={14} /></div>
                        <div className="sa-person-name">{fullName(u)}</div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone || "—"}</td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td><StatusPill status={u.status} /></td>
                    <td>
                      <div className="sa-row-actions">
                        <ActionButton icon={Eye} compact ghost onClick={() => onViewProfile(u)}>Profile</ActionButton>
                        <ActionButton icon={ShieldAlert} compact ghost onClick={() => onSuspend(u)}>
                          {u.status === "suspended" ? "Reactivate" : "Suspend"}
                        </ActionButton>
                        <ActionButton icon={Trash2} compact destructive ghost onClick={() => onDeleteUser("student", u.user_id, fullName(u))}>Delete</ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function ReviewsView({ reviews, onDelete, onHide, onToast }) {
  const [query, setQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All Ratings");

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const studentName = r.User ? fullName(r.User) : "";
      const uniName = r.University?.name || "";
      const matchesQuery = [studentName, uniName, r.comment || ""].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesRating = ratingFilter === "All Ratings" || (ratingFilter === "4+" ? r.rating >= 4 : r.rating < 4);
      return matchesQuery && matchesRating;
    });
  }, [reviews, query, ratingFilter]);

  return (
    <div className="sa-page-section">
      <div className="sa-page-heading">
        <h1>Moderate Reviews</h1>
      </div>

      <div className="sa-toolbar">
        <div className="sa-toolbar-search">
          <Search size={15} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reviews..." />
        </div>
        <select value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)}>
          <option>All Ratings</option>
          <option>4+</option>
          <option>Below 4</option>
        </select>
      </div>

      <SectionCard className="sa-card-table">
        {filtered.length === 0 ? (
          <EmptyState icon={MessageSquareWarning} title="No reviews found" description={query || ratingFilter !== "All Ratings" ? "Try adjusting your search or filter." : "No reviews to moderate."} />
        ) : (
          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>University</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.review_id}>
                    <td>{r.User ? fullName(r.User) : "Unknown"}</td>
                    <td>{r.University?.name || "Unknown"}</td>
                    <td>
                      <div className="sa-rating-inline"><Star size={11} />{r.rating.toFixed(1)}</div>
                    </td>
                    <td className="sa-td-wrap" style={{ maxWidth: 280 }}>{r.comment || ""}</td>
                    <td>{formatDate(r.createdAt)}</td>
                    <td>
                      <div className="sa-row-actions">
                        <ActionButton icon={Eye} compact ghost onClick={() => onToast("info", `${r.User ? fullName(r.User) : "Unknown"} review opened`, "Moderation details loaded.")}>View</ActionButton>
                        <ActionButton icon={EyeOff} compact ghost onClick={() => onHide(r)}>Hide</ActionButton>
                        <ActionButton icon={Trash2} compact destructive ghost onClick={() => onDelete(r)}>Delete</ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function ProfileView({ adminProfile, onSave }) {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (adminProfile) {
      setForm({
        first_name: adminProfile.first_name || "",
        last_name: adminProfile.last_name || "",
        email: adminProfile.email || "",
        phone: adminProfile.phone || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [adminProfile]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) return;
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  if (!adminProfile) return null;

  return (
    <div className="sa-page-section" style={{ maxWidth: 640 }}>
      <div className="sa-page-heading">
        <h1>My Profile</h1>
      </div>

      <SectionCard title="Account Details" subtitle="Manage your personal information.">
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
            <div style={{ color: "#DC2626", fontSize: 12 }}>Passwords do not match.</div>
          )}
          <div className="ua-form-grid">
            <div className="ua-form-group">
              <label className="ua-form-label">First Name *</label>
              <input className="ua-form-input" required value={form.first_name} onChange={set("first_name")} />
            </div>
            <div className="ua-form-group">
              <label className="ua-form-label">Last Name *</label>
              <input className="ua-form-input" required value={form.last_name} onChange={set("last_name")} />
            </div>
            <div className="ua-form-group ua-full">
              <label className="ua-form-label">Email *</label>
              <input className="ua-form-input" type="email" required value={form.email} onChange={set("email")} />
            </div>
            <div className="ua-form-group ua-full">
              <label className="ua-form-label">Phone</label>
              <input className="ua-form-input" value={form.phone} onChange={set("phone")} placeholder="Optional" />
            </div>
            <div className="ua-form-group ua-full">
              <label className="ua-form-label">New Password</label>
              <input className="ua-form-input" type="password" value={form.password} onChange={set("password")} placeholder="Leave blank to keep current" minLength={6} />
            </div>
            {form.password && (
              <div className="ua-form-group ua-full">
                <label className="ua-form-label">Confirm New Password</label>
                <input className="ua-form-input" type="password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Re-enter new password" minLength={6} />
              </div>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button type="submit" className="sa-primary-btn" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Account Information" subtitle="Your account details and role.">
        <div style={{ display: "grid", gap: 10 }}>
          <div className="ua-detail-row"><dt>Email</dt><dd>{adminProfile.email}</dd></div>
          <div className="ua-detail-row"><dt>Role</dt><dd>System Administrator</dd></div>
          <div className="ua-detail-row"><dt>Registered</dt><dd>{formatDate(adminProfile.createdAt)}</dd></div>
          <div className="ua-detail-row"><dt>Status</dt><dd><StatusPill status={adminProfile.status} /></dd></div>
        </div>
      </SectionCard>
    </div>
  );
}

export default function SystemAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const section = getSection(location.pathname);

  const [universities, setUniversities] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [students, setStudents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [adminProfile, setAdminProfile] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [universityModal, setUniversityModal] = useState({ open: false, university: null });
  const [adminModal, setAdminModal] = useState({ open: false, admin: null });
  const [viewTarget, setViewTarget] = useState(null);
  const [profileTarget, setProfileTarget] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toastTimers = useRef(new Map());
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("campuspost_token");
    if (!token) {
      navigate("/login");
      return;
    }
    setAuthChecked(true);
  }, [navigate]);

  useEffect(() => {
    if (!authChecked) return;
    Promise.all([
      api.get("/universities").catch(() => null),
      api.get("/users").catch(() => null),
      api.get("/reviews").catch(() => null),
    ]).then(([uniData, userData, reviewData]) => {
      if (Array.isArray(uniData)) setUniversities(uniData);
      if (Array.isArray(userData)) {
        setAdmins(userData.filter((u) => u.role_id === 2));
        setStudents(userData.filter((u) => u.role_id === 1));
        // Find the current logged-in system admin (role_id=3) for profile
        const sysAdmin = userData.find((u) => u.role_id === 3);
        if (sysAdmin) setAdminProfile(sysAdmin);
      }
      if (Array.isArray(reviewData)) setReviews(reviewData);
    }).catch(() => {});
  }, [authChecked]);

  useEffect(() => {
    return () => {
      toastTimers.current.forEach((timerId) => clearTimeout(timerId));
      toastTimers.current.clear();
    };
  }, []);

  const dismissToast = (toastId) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId));
    const timerId = toastTimers.current.get(toastId);
    if (timerId) {
      clearTimeout(timerId);
      toastTimers.current.delete(toastId);
    }
  };

  const pushToast = (tone, title, description) => {
    const id = makeId("toast");
    setToasts((current) => [...current, { id, tone, title, description }]);
    const timerId = window.setTimeout(() => dismissToast(id), 3600);
    toastTimers.current.set(id, timerId);
  };

  const handleDeleteUniversity = (id, name) => {
    setDeleteTarget({ type: "university", id, name });
  };

  const handleDeleteUser = (tab, id, name) => {
    setDeleteTarget({ type: tab === "students" ? "student" : "admin", id, name });
  };

  const handleDeleteReview = (review) => {
    setDeleteTarget({ type: "review", id: review.review_id, name: review.User ? fullName(review.User) : "Unknown" });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "university") {
        await api.delete(`/universities/${deleteTarget.id}`).catch(() => null);
        setUniversities((current) => current.filter((u) => u.university_id !== deleteTarget.id));
        pushToast("success", `${deleteTarget.name} deleted`, "University record removed from the platform.");
      }

      if (deleteTarget.type === "student") {
        await api.delete(`/users/${deleteTarget.id}`).catch(() => null);
        setStudents((current) => current.filter((u) => u.user_id !== deleteTarget.id));
        pushToast("success", `${deleteTarget.name} deleted`, "Student account removed from the platform.");
      }

      if (deleteTarget.type === "admin") {
        await api.delete(`/users/${deleteTarget.id}`).catch(() => null);
        setAdmins((current) => current.filter((u) => u.user_id !== deleteTarget.id));
        pushToast("success", `${deleteTarget.name} deleted`, "Admin account removed from the platform.");
      }

      if (deleteTarget.type === "review") {
        await api.delete(`/reviews/${deleteTarget.id}`).catch(() => null);
        setReviews((current) => current.filter((r) => r.review_id !== deleteTarget.id));
        pushToast("success", `${deleteTarget.name} deleted`, "Reported review removed from moderation queue.");
      }
    } catch (err) {
      pushToast("danger", "Error", err.message || "Failed to delete.");
    }

    setDeleteTarget(null);
  };

  const handleHideReview = (review) => {
    pushToast("info", `${review.User ? fullName(review.User) : "Unknown"} review hidden`, "The review was hidden from public view.");
  };

  const handleSuspend = (user) => {
    setSuspendTarget(user);
  };

  const handleSuspendConfirm = async () => {
    if (!suspendTarget) return;
    const isSuspended = suspendTarget.status === "suspended";
    const newStatus = isSuspended ? "active" : "suspended";
    const name = fullName(suspendTarget);

    try {
      const updated = await api.put(`/users/${suspendTarget.user_id}`, { status: newStatus });
      setStudents((current) => current.map((u) => u.user_id === suspendTarget.user_id ? { ...u, status: updated.status } : u));
      setAdmins((current) => current.map((u) => u.user_id === suspendTarget.user_id ? { ...u, status: updated.status } : u));
      pushToast("success", isSuspended ? `${name} reactivated` : `${name} suspended`, isSuspended ? "Account has been reactivated." : "Account has been suspended. They can no longer log in.");
    } catch (err) {
      pushToast("danger", "Error", err.message || "Failed to update status.");
    }

    setSuspendTarget(null);
  };

  const handleSaveUniversity = async (form) => {
    try {
      if (universityModal.university) {
        await api.put(`/universities/${universityModal.university.university_id}`, {
          name: form.name,
          country: form.country,
          city: form.city,
          website: form.website,
          email: form.email,
          phone: form.phone,
        });
        setUniversities((current) => current.map((u) => u.university_id === universityModal.university.university_id ? { ...u, ...form } : u));
        pushToast("success", `${form.name} updated`, "University record updated successfully.");
      } else {
        const created = await api.post("/universities", {
          name: form.name,
          country: form.country,
          city: form.city,
          website: form.website,
          email: form.email,
          phone: form.phone,
        });
        setUniversities((current) => [{ ...created, Majors: [], Admins: [] }, ...current]);
        pushToast("success", `${form.name} created`, "New university added to the platform.");
      }
      setUniversityModal({ open: false, university: null });
    } catch (err) {
      pushToast("danger", "Error", err.message || "Failed to save university.");
    }
  };

  const handleSaveAdmin = async (form) => {
    try {
      const universityId = form.university_id ? Number(form.university_id) : null;
      if (adminModal.admin) {
        const payload = {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          university_id: universityId,
        };
        if (form.password) payload.password = form.password;
        const updated = await api.put(`/users/${adminModal.admin.user_id}`, payload);
        const updatedUni = universities.find((u) => u.university_id === universityId) || null;
        setAdmins((current) => current.map((a) => a.user_id === adminModal.admin.user_id ? { ...a, ...updated, AssignedUniversity: updatedUni } : a));
        pushToast("success", `${form.first_name} ${form.last_name} updated`, "Admin account updated successfully.");
      } else {
        const created = await api.post("/users", {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
          role_id: 2,
          university_id: universityId,
        });
        setAdmins((current) => [{ ...created, AssignedUniversity: universities.find((u) => u.university_id === universityId) || null }, ...current]);
        pushToast("success", `${form.first_name} ${form.last_name} created`, "New admin account created.");
      }
      setAdminModal({ open: false, admin: null });
    } catch (err) {
      pushToast("danger", "Error", err.message || "Failed to save admin.");
    }
  };

  const handleResetPassword = async (admin) => {
    try {
      const tempPassword = "Reset" + Math.random().toString(36).slice(2, 8) + "!";
      await api.put(`/users/${admin.user_id}`, { password: tempPassword });
      pushToast("warning", `Password reset: ${fullName(admin)}`, `Password has been reset. New password: ${tempPassword}`);
    } catch (err) {
      pushToast("danger", "Error", err.message || "Failed to reset password.");
    }
  };

  const handleSaveProfile = async (form) => {
    if (!adminProfile) return;
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone || null,
      };
      if (form.password) payload.password = form.password;
      const updated = await api.put(`/users/${adminProfile.user_id}`, payload);
      setAdminProfile((prev) => ({ ...prev, ...updated }));
      pushToast("success", "Profile updated", "Your profile has been saved successfully.");
    } catch (err) {
      pushToast("danger", "Error", err.message || "Failed to update profile.");
    }
  };

  const currentTitle = {
    dashboard: "Dashboard",
    universities: "Manage Universities",
    "admin-accounts": "Manage University Admins",
    users: "Manage Users",
    reviews: "Moderate Reviews",
    profile: "My Profile",
  }[section];

  const handleSystemAdminLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  if (!authChecked) return null;

  return (
    <div className="sa-shell">
      <button type="button" className="sa-mobile-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
        <Menu size={20} />
      </button>
      <Sidebar onLogout={handleSystemAdminLogout} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="sa-content">
        <TopNav adminProfile={adminProfile} onToggleSidebar={() => setSidebarOpen(true)} />

        <main className="sa-main">
          {section === "dashboard" && (
            <div className="sa-page-title-block">
              <h1>{currentTitle}</h1>
              <p className="sa-page-subtitle">Here's today's overview of your platform.</p>
            </div>
          )}

          {section === "dashboard" && (
            <DashboardView
              navigate={navigate}
              students={students}
              reviews={reviews}
              onDeleteReview={handleDeleteReview}
              onHideReview={handleHideReview}
            />
          )}

          {section === "universities" && (
            <UniversitiesView
              universities={universities}
              onDelete={handleDeleteUniversity}
              onAdd={() => setUniversityModal({ open: true, university: null })}
              onEdit={(uni) => setUniversityModal({ open: true, university: uni })}
              onView={(uni) => setViewTarget({ type: "university", data: uni })}
            />
          )}

          {section === "admin-accounts" && (
            <AdminAccountsView
              admins={admins}
              onAdd={() => setAdminModal({ open: true, admin: null })}
              onEdit={(adm) => setAdminModal({ open: true, admin: adm })}
              onView={(adm) => setViewTarget({ type: "admin", data: adm })}
              onResetPassword={handleResetPassword}
              onSuspend={handleSuspend}
              onDelete={handleDeleteUser}
            />
          )}

          {section === "users" && (
            <UsersView
              students={students}
              onDeleteUser={handleDeleteUser}
              onSuspend={handleSuspend}
              onViewProfile={(u) => setProfileTarget(u)}
            />
          )}

          {section === "reviews" && <ReviewsView reviews={reviews} onDelete={handleDeleteReview} onHide={handleHideReview} onToast={pushToast} />}

          {section === "profile" && (
            <ProfileView adminProfile={adminProfile} onSave={handleSaveProfile} />
          )}
        </main>
      </div>

      <ConfirmationModal
        open={Boolean(deleteTarget)}
        title={deleteTarget ? `Delete ${deleteTarget.name}?` : "Delete item?"}
        description={deleteTarget ? "This action cannot be undone. The selected record will be permanently removed." : "This action cannot be undone."}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      <SuspendModal
        open={Boolean(suspendTarget)}
        user={suspendTarget}
        onCancel={() => setSuspendTarget(null)}
        onConfirm={handleSuspendConfirm}
      />

      <UniversityModal
        open={universityModal.open}
        university={universityModal.university}
        onSave={handleSaveUniversity}
        onCancel={() => setUniversityModal({ open: false, university: null })}
      />

      <AdminModal
        open={adminModal.open}
        admin={adminModal.admin}
        universities={universities}
        onSave={handleSaveAdmin}
        onCancel={() => setAdminModal({ open: false, admin: null })}
      />

      {viewTarget && (
        <div className="sa-modal-backdrop" role="presentation" onClick={() => setViewTarget(null)}>
          <div className="sa-modal" role="dialog" aria-modal="true" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div className="sa-modal-body">
              <h3 className="sa-modal-title">{viewTarget.type === "university" ? viewTarget.data.name : fullName(viewTarget.data)}</h3>
              <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                {viewTarget.type === "university" ? (
                  <>
                    <div className="ua-detail-row"><dt>Country</dt><dd>{viewTarget.data.country || "—"}</dd></div>
                    <div className="ua-detail-row"><dt>City</dt><dd>{viewTarget.data.city || "—"}</dd></div>
                    <div className="ua-detail-row"><dt>Website</dt><dd>{viewTarget.data.website || "—"}</dd></div>
                    <div className="ua-detail-row"><dt>Email</dt><dd>{viewTarget.data.email || "—"}</dd></div>
                    <div className="ua-detail-row"><dt>Phone</dt><dd>{viewTarget.data.phone || "—"}</dd></div>
                    <div className="ua-detail-row"><dt>Majors</dt><dd>{viewTarget.data.Majors?.length || 0}</dd></div>
                    <div className="ua-detail-row"><dt>Admin</dt><dd>{viewTarget.data.Admins?.[0] ? fullName(viewTarget.data.Admins[0]) : "—"}</dd></div>
                    <div className="ua-detail-row"><dt>Status</dt><dd><StatusPill status="Active" /></dd></div>
                  </>
                ) : (
                  <>
                    <div className="ua-detail-row"><dt>Email</dt><dd>{viewTarget.data.email}</dd></div>
                    <div className="ua-detail-row"><dt>Phone</dt><dd>{viewTarget.data.phone || "—"}</dd></div>
                    <div className="ua-detail-row"><dt>University</dt><dd>{viewTarget.data.AssignedUniversity?.name || "—"}</dd></div>
                    <div className="ua-detail-row"><dt>Registered</dt><dd>{formatDate(viewTarget.data.createdAt)}</dd></div>
                    <div className="ua-detail-row"><dt>Status</dt><dd><StatusPill status={viewTarget.data.status} /></dd></div>
                  </>
                )}
              </div>
              <div className="sa-modal-actions" style={{ marginTop: 20 }}>
                <button type="button" className="sa-secondary-btn" onClick={() => setViewTarget(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {profileTarget && (
        <div className="sa-modal-backdrop" role="presentation" onClick={() => setProfileTarget(null)}>
          <div className="sa-modal" role="dialog" aria-modal="true" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div className="sa-modal-body">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div className="sa-avatar-sm" style={{ width: 48, height: 48 }}><User size={22} /></div>
                <div>
                  <h3 className="sa-modal-title" style={{ margin: 0 }}>{fullName(profileTarget)}</h3>
                  <div style={{ color: "#64748b", fontSize: 13 }}>Student</div>
                </div>
              </div>
              <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                <div className="ua-detail-row"><dt>Email</dt><dd>{profileTarget.email}</dd></div>
                <div className="ua-detail-row"><dt>Phone</dt><dd>{profileTarget.phone || "—"}</dd></div>
                <div className="ua-detail-row"><dt>Registered</dt><dd>{formatDate(profileTarget.createdAt)}</dd></div>
                <div className="ua-detail-row"><dt>Status</dt><dd><StatusPill status={profileTarget.status} /></dd></div>
              </div>
              <div className="sa-modal-actions" style={{ marginTop: 20 }}>
                <button type="button" className="sa-secondary-btn" onClick={() => setProfileTarget(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
