import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  MessageSquareWarning,
  PencilLine,
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
} from "lucide-react";
import "../styles/system-admin.css";

const sidebarItems = [
  { label: "Manage Universities", to: "/system-admin/universities", icon: Building2 },
  { label: "Manage University Admin Accounts", to: "/system-admin/admin-accounts", icon: UserCog },
  { label: "Manage Users", to: "/system-admin/users", icon: Users },
  { label: "Moderate Reviews", to: "/system-admin/reviews", icon: MessageSquareWarning },
];

const initialUniversities = [
  { id: 1, university: "Paragon International University", country: "Cambodia", majors: 18, admin: "Sokha Vann", status: "Active", updated: "Today" },
  { id: 2, university: "Royal University of Phnom Penh", country: "Cambodia", majors: 24, admin: "Dara Chhay", status: "Pending Review", updated: "Today" },
  { id: 3, university: "Institute of Technology of Cambodia", country: "Cambodia", majors: 31, admin: "Malis Chan", status: "Active", updated: "Yesterday" },
  { id: 4, university: "Western University", country: "Cambodia", majors: 12, admin: "Rina Ly", status: "Suspended", updated: "2 days ago" },
  { id: 5, university: "University of Cambodia", country: "Cambodia", majors: 20, admin: "Nary Heng", status: "Active", updated: "2 days ago" },
  { id: 6, university: "National University of Management", country: "Cambodia", majors: 16, admin: "Piseth Long", status: "Active", updated: "3 days ago" },
  { id: 7, university: "Asian Institute of Technology", country: "Thailand", majors: 14, admin: "Sophea Kim", status: "Active", updated: "3 days ago" },
  { id: 8, university: "University of the Philippines", country: "Philippines", majors: 22, admin: "Lina Cruz", status: "Pending Review", updated: "4 days ago" },
];

const initialAdmins = [
  { id: 1, avatar: "SV", name: "Sokha Vann", email: "sokha.vann@campuspost.com", university: "Paragon International University", status: "Active", registeredDate: "12 Jan 2026", lastLogin: "2 hours ago" },
  { id: 2, avatar: "DC", name: "Dara Chhay", email: "dara.chhay@campuspost.com", university: "Royal University of Phnom Penh", status: "Pending Review", registeredDate: "20 Feb 2026", lastLogin: "Yesterday" },
  { id: 3, avatar: "MC", name: "Malis Chan", email: "malis.chan@campuspost.com", university: "Institute of Technology of Cambodia", status: "Active", registeredDate: "04 Mar 2026", lastLogin: "5 hours ago" },
  { id: 4, avatar: "RL", name: "Rina Ly", email: "rina.ly@campuspost.com", university: "Western University", status: "Inactive", registeredDate: "19 Apr 2026", lastLogin: "3 days ago" },
  { id: 5, avatar: "NH", name: "Nary Heng", email: "nary.heng@campuspost.com", university: "University of Cambodia", status: "Active", registeredDate: "08 May 2026", lastLogin: "30 minutes ago" },
];

const initialStudents = [
  { id: 1, avatar: "PH", name: "Piseth Heng", email: "piseth.heng@student.campuspost.com", role: "Student", registeredDate: "03 Jul 2026", status: "Active" },
  { id: 2, avatar: "JC", name: "Jasmine Chan", email: "jasmine.chan@student.campuspost.com", role: "Student", registeredDate: "01 Jul 2026", status: "Pending Review" },
  { id: 3, avatar: "VK", name: "Vuthy Khem", email: "vuthy.khem@student.campuspost.com", role: "Student", registeredDate: "28 Jun 2026", status: "Active" },
  { id: 4, avatar: "SL", name: "Sokliny Phan", email: "sokliny.phan@student.campuspost.com", role: "Student", registeredDate: "23 Jun 2026", status: "Suspended" },
  { id: 5, avatar: "MC", name: "Monica Choi", email: "monica.choi@student.campuspost.com", role: "Student", registeredDate: "19 Jun 2026", status: "Active" },
  { id: 6, avatar: "AR", name: "Ariya Rith", email: "ariya.rith@student.campuspost.com", role: "Student", registeredDate: "14 Jun 2026", status: "Active" },
];

const initialReviews = [
  { id: 1, student: "Piseth Heng", university: "Paragon International University", rating: 4.8, preview: "Great support team, but the enrollment process could be faster.", reason: "Spam flag", date: "Today", status: "Under Review" },
  { id: 2, student: "Jasmine Chan", university: "Royal University of Phnom Penh", rating: 2.1, preview: "The information looked outdated compared with the admission office.", reason: "Incorrect information", date: "Today", status: "Escalated" },
  { id: 3, student: "Vuthy Khem", university: "Institute of Technology of Cambodia", rating: 4.4, preview: "Solid academics and helpful counselors throughout the process.", reason: "User reported", date: "Yesterday", status: "Under Review" },
  { id: 4, student: "Sokliny Phan", university: "Western University", rating: 1.8, preview: "This review contains personal attacks and should be removed.", reason: "Abusive language", date: "Yesterday", status: "Escalated" },
  { id: 5, student: "Monica Choi", university: "University of Cambodia", rating: 4.9, preview: "Clear guidance and quick responses from the university admin.", reason: "False report", date: "2 days ago", status: "Resolved" },
];

const activityRows = [
  { activity: "Added new university", by: "System Administrator", date: "Today, 09:15", status: "Completed" },
  { activity: "Updated university information", by: "Dara Chhay", date: "Today, 08:42", status: "Updated" },
  { activity: "Created university admin account", by: "System Administrator", date: "Yesterday, 17:30", status: "Completed" },
  { activity: "Deleted inappropriate review", by: "Moderation Team", date: "Yesterday, 16:18", status: "Removed" },
  { activity: "Suspended user account", by: "System Administrator", date: "2 days ago, 11:05", status: "Removed" },
];

const notificationRows = [
  { icon: UserRound, title: "New student registered.", time: "2m ago", tone: "info" },
  { icon: Building2, title: "University information updated.", time: "12m ago", tone: "success" },
  { icon: MessageSquareWarning, title: "Review reported by a student.", time: "24m ago", tone: "warning" },
  { icon: UserCog, title: "University admin account created.", time: "1h ago", tone: "info" },
  { icon: ShieldAlert, title: "User account suspended.", time: "3h ago", tone: "danger" },
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
  Completed: "success",
  Updated: "info",
  Removed: "danger",
  Suspended: "danger",
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

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getSection(pathname) {
  if (pathname.startsWith("/system-admin/universities")) return "universities";
  if (pathname.startsWith("/system-admin/admin-accounts")) return "admin-accounts";
  if (pathname.startsWith("/system-admin/users")) return "users";
  if (pathname.startsWith("/system-admin/reviews")) return "reviews";
  return "dashboard";
}

function StatusPill({ status }) {
  const tone = reportStatusColors[status] || statusColors[status] || "neutral";
  return <span className={`sa-pill sa-pill-${tone}`}>{status}</span>;
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

function Sidebar({ onLogout }) {
  return (
    <aside className="sa-sidebar">
      <div className="sa-brand">
        <div className="sa-brand-mark">CP</div>
        <div>
          <div className="sa-brand-name">CampusPost Admin</div>
          <div className="sa-brand-subtitle">System workspace</div>
        </div>
      </div>

      <nav className="sa-nav">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.label} to={item.to} end={item.end} className={({ isActive }) => `sa-nav-link${isActive ? " active" : ""}`}>
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button type="button" className="sa-logout" onClick={onLogout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

function TopNav() {
  return (
    <header className="sa-topnav">
      <div className="sa-topnav-right">
        <div className="sa-avatar">SA</div>
        <div>
          <div className="sa-role-label">System Administrator</div>
          <div className="sa-role-subtitle">CampusPost</div>
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
                {activityRows.map((row) => (
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
          action={<button type="button" className="sa-link-btn" onClick={() => navigate("/system-admin/users")}>View All Users</button>}
        >
          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 5).map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="sa-person-cell">
                        <div className="sa-avatar-sm">{student.avatar}</div>
                        <div>
                          <div className="sa-person-name">{student.name}</div>
                          <div className="sa-person-meta">{student.role}</div>
                        </div>
                      </div>
                    </td>
                    <td>{student.email}</td>
                    <td>{student.registeredDate}</td>
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
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button key={action.label} type="button" className="sa-quick-action" onClick={() => navigate(action.to)}>
                  <Icon size={18} />
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
                <div key={`${notification.title}-${notification.time}`} className={`sa-notification-item tone-${notification.tone}`}>
                  <div className="sa-notification-icon"><Icon size={16} /></div>
                  <div className="sa-notification-copy">
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
              <div key={review.id} className="sa-review-item">
                <div className="sa-review-topline">
                  <div>
                    <div className="sa-review-name">{review.student}</div>
                    <div className="sa-review-university">{review.university}</div>
                  </div>
                  <div className="sa-rating-pill"><Star size={12} />{review.rating.toFixed(1)}</div>
                </div>
                <p className="sa-review-preview">{review.preview}</p>
                <div className="sa-review-actions">
                  <ActionButton icon={Eye} compact ghost onClick={() => navigate("/system-admin/reviews")}>View</ActionButton>
                  <ActionButton icon={EyeOff} compact ghost onClick={() => onHideReview(review.id, review.student)}>Hide</ActionButton>
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

function UniversitiesView({ universities, onDelete, onToast }) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All Countries");
  const [status, setStatus] = useState("All Statuses");
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [query, country, status]);

  const filtered = useMemo(() => {
    return universities.filter((item) => {
      const matchesQuery = [item.university, item.country, item.admin].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesCountry = country === "All Countries" || item.country === country;
      const matchesStatus = status === "All Statuses" || item.status === status;
      return matchesQuery && matchesCountry && matchesStatus;
    });
  }, [universities, query, country, status]);

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const countries = ["All Countries", ...Array.from(new Set(universities.map((item) => item.country)))];
  const statuses = ["All Statuses", ...Array.from(new Set(universities.map((item) => item.status)))];

  return (
    <div className="sa-page-section">
      <div className="sa-page-heading">
        <h1>Manage Universities</h1>
        <button type="button" className="sa-primary-btn" onClick={() => onToast("info", "Add University", "University creation flow is not connected in this prototype.") }><Plus size={16} />Add University</button>
      </div>

      <div className="sa-toolbar">
        <div className="sa-toolbar-search">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search universities..." />
        </div>
        <select value={country} onChange={(event) => setCountry(event.target.value)}>
          {countries.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          {statuses.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <SectionCard className="sa-card-table">
        <div className="sa-section-label">University Records</div>
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead>
              <tr>
                <th>University</th>
                <th>Country</th>
                <th>Number of Majors</th>
                <th>University Admin</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="sa-person-cell">
                      <div className="sa-avatar-sm sa-avatar-uni">{getInitials(row.university)}</div>
                      <div>
                        <div className="sa-person-name">{row.university}</div>
                      </div>
                    </div>
                  </td>
                  <td>{row.country}</td>
                  <td>{row.majors}</td>
                  <td>{row.admin}</td>
                  <td><StatusPill status={row.status} /></td>
                  <td>
                    <div className="sa-row-actions">
                      <ActionButton icon={Eye} compact ghost onClick={() => onToast("info", `${row.university} opened`, "View university profile.")}>View</ActionButton>
                      <ActionButton icon={PencilLine} compact ghost onClick={() => onToast("success", `${row.university} updated`, "Edit mode opened.")}>Edit</ActionButton>
                      <ActionButton icon={Trash2} compact destructive ghost onClick={() => onDelete(row.id, row.university)}>Delete</ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sa-pagination">
          <button type="button" className="sa-page-btn" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}><ChevronLeft size={16} /></button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button key={pageNumber} type="button" className={`sa-page-btn ${page === pageNumber ? "active" : ""}`} onClick={() => setPage(pageNumber)}>
              {pageNumber}
            </button>
          ))}
          <button type="button" className="sa-page-btn" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}><ChevronRight size={16} /></button>
        </div>
      </SectionCard>
    </div>
  );
}

function AdminAccountsView({ admins, onToast }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return admins.filter((item) => [item.name, item.email, item.university].join(" ").toLowerCase().includes(query.toLowerCase()));
  }, [admins, query]);

  return (
    <div className="sa-page-section">
      <div className="sa-page-heading">
        <h1>Manage University Admin Accounts</h1>
        <button type="button" className="sa-primary-btn" onClick={() => onToast("info", "Create Admin", "Admin creation flow is not connected in this prototype.") }><Plus size={16} />Create Admin</button>
      </div>

      <div className="sa-toolbar">
        <div className="sa-toolbar-search">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search admins..." />
        </div>
      </div>

      <SectionCard className="sa-card-table">
        <div className="sa-section-label">Admin Directory</div>
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Assigned University</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td><div className="sa-avatar-sm">{row.avatar}</div></td>
                  <td>
                    <div className="sa-person-name">{row.name}</div>
                  </td>
                  <td>{row.email}</td>
                  <td>{row.university}</td>
                  <td><StatusPill status={row.status} /></td>
                  <td>{row.lastLogin}</td>
                  <td>
                    <div className="sa-row-actions">
                      <ActionButton icon={Eye} compact ghost onClick={() => onToast("info", `${row.name} profile opened`, "View admin profile.")}>View</ActionButton>
                      <ActionButton icon={PencilLine} compact ghost onClick={() => onToast("success", `${row.name} edited`, "Edit mode opened.")}>Edit</ActionButton>
                      <ActionButton icon={LockKeyhole} compact ghost onClick={() => onToast("warning", `${row.name} password reset`, "Password reset link prepared.")}>Reset Password</ActionButton>
                      <ActionButton icon={RotateCcw} compact ghost onClick={() => onToast("info", `${row.name} status updated`, row.status === "Active" ? "Admin deactivated." : "Admin reactivated.")}>{row.status === "Active" ? "Deactivate" : "Reactivate"}</ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function UsersView({ students, admins, onDeleteUser, onToggleStatus, onToast }) {
  const [tab, setTab] = useState("students");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Statuses");

  const source = tab === "students" ? students : admins;
  const filtered = useMemo(() => {
    return source.filter((item) => {
      const searchable = [item.name, item.email, item.status, item.role, item.university || ""].join(" ").toLowerCase();
      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesStatus = status === "All Statuses" || item.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [source, query, status]);

  const statuses = ["All Statuses", ...Array.from(new Set(source.map((item) => item.status)))];

  return (
    <div className="sa-page-section">
      <div className="sa-page-heading">
        <h1>Manage Users</h1>
      </div>

      <div className="sa-tabs">
        <button type="button" className={`sa-tab ${tab === "students" ? "active" : ""}`} onClick={() => setTab("students")}>Students</button>
        <button type="button" className={`sa-tab ${tab === "admins" ? "active" : ""}`} onClick={() => setTab("admins")}>University Admins</button>
      </div>

      <div className="sa-toolbar">
        <div className="sa-toolbar-search">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users..." />
        </div>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          {statuses.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <SectionCard className="sa-card-table">
        <div className="sa-section-label">User Accounts</div>
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Registered Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={`${tab}-${row.id}`}>
                  <td><div className="sa-avatar-sm">{row.avatar}</div></td>
                  <td>
                    <div className="sa-person-name">{row.name}</div>
                  </td>
                  <td>{row.email}</td>
                  <td>{tab === "students" ? "Student" : "University Admin"}</td>
                  <td>{row.registeredDate}</td>
                  <td><StatusPill status={row.status} /></td>
                  <td>
                    <div className="sa-row-actions">
                      <ActionButton icon={Eye} compact ghost onClick={() => onToast("info", `${row.name} profile opened`, "Profile view opened.")}>View Profile</ActionButton>
                      <ActionButton icon={ShieldAlert} compact ghost onClick={() => onToggleStatus(tab, row.id, row.status)}>{row.status === "Suspended" ? "Reactivate" : "Suspend"}</ActionButton>
                      <ActionButton icon={Trash2} compact destructive ghost onClick={() => onDeleteUser(tab, row.id, row.name)}>Delete</ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function ReviewsView({ reviews, onDelete, onHide, onToast }) {
  const [query, setQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All Ratings");
  const [reportFilter, setReportFilter] = useState("All Report Statuses");

  const filtered = useMemo(() => {
    return reviews.filter((review) => {
      const matchesQuery = [review.student, review.university, review.preview, review.reason].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesRating = ratingFilter === "All Ratings" || (ratingFilter === "4+" ? review.rating >= 4 : ratingFilter === "Below 4" ? review.rating < 4 : true);
      const matchesReport = reportFilter === "All Report Statuses" || review.status === reportFilter;
      return matchesQuery && matchesRating && matchesReport;
    });
  }, [reviews, query, ratingFilter, reportFilter]);

  return (
    <div className="sa-page-section">
      <div className="sa-page-heading">
        <h1>Moderate Reviews</h1>
      </div>

      <div className="sa-toolbar">
        <div className="sa-toolbar-search">
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reviews..." />
        </div>
        <select value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)}>
          <option>All Ratings</option>
          <option>4+</option>
          <option>Below 4</option>
        </select>
        <select value={reportFilter} onChange={(event) => setReportFilter(event.target.value)}>
          <option>All Report Statuses</option>
          <option>Under Review</option>
          <option>Escalated</option>
          <option>Resolved</option>
        </select>
      </div>

      <SectionCard className="sa-card-table">
        <div className="sa-section-label">Review Queue</div>
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>University</th>
                <th>Rating</th>
                <th>Review Preview</th>
                <th>Report Reason</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((review) => (
                <tr key={review.id}>
                  <td>{review.student}</td>
                  <td>{review.university}</td>
                  <td>
                    <div className="sa-rating-inline"><Star size={12} />{review.rating.toFixed(1)}</div>
                  </td>
                  <td className="sa-review-preview-cell">{review.preview}</td>
                  <td>
                    <div className="sa-report-cell">
                      <span>{review.reason}</span>
                      <StatusPill status={review.status} />
                    </div>
                  </td>
                  <td>{review.date}</td>
                  <td>
                    <div className="sa-row-actions">
                      <ActionButton icon={Eye} compact ghost onClick={() => onToast("info", `${review.student} review opened`, "Moderation details loaded.")}>View</ActionButton>
                      <ActionButton icon={EyeOff} compact ghost onClick={() => onHide(review.id, review.student)}>Hide</ActionButton>
                      <ActionButton icon={Trash2} compact destructive ghost onClick={() => onDelete(review.id, review.student)}>Delete</ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

export default function SystemAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const section = getSection(location.pathname);

  const [universities, setUniversities] = useState(initialUniversities);
  const [admins, setAdmins] = useState(initialAdmins);
  const [students, setStudents] = useState(initialStudents);
  const [reviews, setReviews] = useState(initialReviews);
  const [toasts, setToasts] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toastTimers = useRef(new Map());

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
    setDeleteTarget({ type: "review", id: review.id, name: review.student });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "university") {
      setUniversities((current) => current.filter((item) => item.id !== deleteTarget.id));
      pushToast("success", `${deleteTarget.name} deleted`, "University record removed from the platform.");
    }

    if (deleteTarget.type === "student") {
      setStudents((current) => current.filter((item) => item.id !== deleteTarget.id));
      pushToast("success", `${deleteTarget.name} deleted`, "Student account removed from the platform.");
    }

    if (deleteTarget.type === "admin") {
      setAdmins((current) => current.filter((item) => item.id !== deleteTarget.id));
      pushToast("success", `${deleteTarget.name} deleted`, "Admin account removed from the platform.");
    }

    if (deleteTarget.type === "review") {
      setReviews((current) => current.filter((item) => item.id !== deleteTarget.id));
      pushToast("success", `${deleteTarget.name} deleted`, "Reported review removed from moderation queue.");
    }

    setDeleteTarget(null);
  };

  const handleHideReview = (reviewId, studentName) => {
    setReviews((current) => current.map((review) => (review.id === reviewId ? { ...review, status: "Hidden" } : review)));
    pushToast("info", `${studentName} review hidden`, "The review was hidden from public view.");
  };

  const handleToggleStatus = (tab, id, currentStatus) => {
    const nextStatus = currentStatus === "Suspended" ? "Active" : "Suspended";
    if (tab === "students") {
      setStudents((current) => current.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)));
    } else {
      setAdmins((current) => current.map((item) => (item.id === id ? { ...item, status: nextStatus === "Suspended" ? "Inactive" : "Active" } : item)));
    }
    pushToast("warning", "Status updated", tab === "students" ? `Student account ${nextStatus.toLowerCase()}.` : "Admin account updated.");
  };

  const currentTitle = {
    dashboard: "Dashboard",
    universities: "Manage Universities",
    "admin-accounts": "Manage University Admin Accounts",
    users: "Manage Users",
    reviews: "Moderate Reviews",
  }[section];

  return (
    <div className="sa-shell">
      <Sidebar onLogout={() => pushToast("info", "Logout requested", "Session end is not wired in this prototype.")} />

      <div className="sa-content">
        <TopNav />

        <main className="sa-main">
          {section === "dashboard" && (
            <div className="sa-page-title-block">
              <h1>{currentTitle}</h1>
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

          {section === "universities" && <UniversitiesView universities={universities} onDelete={handleDeleteUniversity} onToast={pushToast} />}

          {section === "admin-accounts" && <AdminAccountsView admins={admins} onToast={pushToast} />}

          {section === "users" && <UsersView students={students} admins={admins} onDeleteUser={handleDeleteUser} onToggleStatus={handleToggleStatus} onToast={pushToast} />}

          {section === "reviews" && <ReviewsView reviews={reviews} onDelete={handleDeleteReview} onHide={handleHideReview} onToast={pushToast} />}
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

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}