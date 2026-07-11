import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import DeleteModal from "../components/DeleteModal";
import EmptyState from "../components/EmptyState";
import { FilterIcon, PlusIcon, TrashIcon } from "../components/Icons";
import { api } from "../utils/api";
import "./myapplications.css";

const classMap = {
  Approved: "badge-approved",
  "Pending Review": "badge-pending",
  Draft: "badge-draft",
  Rejected: "badge-rejected",
};
const dotMap = {
  Approved: "#10B981",
  "Pending Review": "#F59E0B",
  Draft: "#9CA3AF",
  Rejected: "#EF4444",
};
function StatusBadge({ status }) {
  return (
    <span className={classMap[status]}>
      <svg width="8" height="8" viewBox="0 0 8 8" fill={dotMap[status]}>
        <circle cx="4" cy="4" r="3" />
      </svg>
      {status}
    </span>
  );
}

function mapStatus(app) {
  if (app.admin_status === "approved") return "Approved";
  if (app.admin_status === "rejected") return "Rejected";
  if (app.admin_status === "draft") return "Draft";
  return "Pending Review";
}

function ActionButton({ status, navigate, app }) {
  if (status === "Approved" || status === "Pending Review" || status === "Rejected") {
    return (
      <button
        className="action-btn"
        onClick={() =>
          navigate(`/application/${app.application_id}`, {
            state: { application: app },
          })
        }
      >
        {status === "Rejected" ? "View Feedback" : "View Details"}
      </button>
    );
  }
  if (status === "Draft") {
    return (
      <button
        className="action-btn-primary"
        onClick={() =>
          navigate("/application", {
            state: { draftId: app.application_id },
          })
        }
      >
        Continue Application
      </button>
    );
  }
  return null;
}

export default function MyApplications() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/applications")
      .then((data) => {
        const mapped = data.map((app) => {
          const profile = app.ApplicantProfile || {};
          const academic = app.AcademicInformation || {};
          const initials = (profile.full_name || "NA")
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          return {
            ...app,
            initials,
            university: app.University?.name || "Unknown University",
            location: [profile.city, "Cambodia"].filter(Boolean).join(", "),
            major: app.Major?.major_name || "Not specified",
            date: app.created_at
              ? new Date(app.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—",
            status: mapStatus(app),
            fullName: profile.full_name,
            gender: profile.gender,
            dateOfBirth: profile.date_of_birth,
            email: profile.email,
            phone: profile.phone,
            city: profile.city,
            address: profile.address,
            highSchool: academic.high_school,
            graduationYear: academic.graduation_year,
            gpa: academic.gpa,
            grade: academic.grade,
            studyProgram: academic.study_program,
            englishProficiency: academic.english_proficiency,
            awards: academic.awards,
            faculty: "",
            degreeLevel: app.Major?.degree_level || "",
            intakeYear: "",
            studyMode: "Full-time",
            documents: {},
          };
        });
        setApplications(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (app) => {
    try {
      await api.delete(`/applications/${app.application_id}`);
      setApplications((prev) => prev.filter((a) => a.application_id !== app.application_id));
    } catch {
      // If API fails, remove locally
      setApplications((prev) => prev.filter((a) => a.application_id !== app.application_id));
    }
    setDeleteTarget(null);
  };

  const activeCount = applications.filter((a) => a.status === "Pending Review").length;
  const approvedCount = applications.filter((a) => a.status === "Approved").length;
  const draftCount = applications.filter((a) => a.status === "Draft").length;

  const totalPages = Math.max(1, Math.ceil(applications.length / 4));
  const paged = applications.slice((page - 1) * 4, page * 4);

  return (
    <Layout activePage="My Applications">
      <div className="page">
        <div className="main">
          <div className="header-section">
            <div>
              <h1 className="title">My Applications</h1>
              <p className="subtitle">
                Track and manage your university applications in one place.
              </p>
            </div>
            <div className="header-actions">
              <button className="btn-filter">
                <FilterIcon /> Filter
              </button>
              <button
                className="btn-primary"
                onClick={() => navigate("/application")}
              >
                <PlusIcon /> New Application
              </button>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-top">
                <div>
                  <p
                    className="stat-desc"
                    style={{ marginTop: 0, marginBottom: 4 }}
                  >
                    Active Applications
                  </p>
                  <div className="stat-number">
                    {activeCount + approvedCount + draftCount}
                  </div>
                </div>
                <div className="icon-blue">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0F766E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
              </div>
              <p className="stat-desc">
                {activeCount} applications currently under review.
              </p>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <div>
                  <p
                    className="stat-desc"
                    style={{ marginTop: 0, marginBottom: 4 }}
                  >
                    Approved
                  </p>
                  <div className="stat-number">{approvedCount}</div>
                </div>
                <div className="icon-green">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              </div>
              {approvedCount > 0 ? (
                <p className="stat-desc">
                  {applications.find((a) => a.status === "Approved")?.university}
                </p>
              ) : (
                <p className="stat-desc">No approved applications yet.</p>
              )}
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <div>
                  <p
                    className="stat-desc"
                    style={{ marginTop: 0, marginBottom: 4 }}
                  >
                    Draft
                  </p>
                  <div className="stat-number">{draftCount}</div>
                </div>
                <div className="icon-orange">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
              </div>
              <p className="stat-desc">
                Continue completing your application.
              </p>
            </div>
          </div>

          <div className="card">
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
                Loading applications...
              </div>
            ) : error ? (
              <div style={{ padding: 40, textAlign: "center", color: "#ef4444" }}>
                {error}
              </div>
            ) : applications.length === 0 ? (
              <EmptyState onCreate={() => navigate("/application")} />
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th className="th">University</th>
                    <th className="th">Major</th>
                    <th className="th">Submission Date</th>
                    <th className="th">Status</th>
                    <th className="th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((app) => (
                    <tr key={app.application_id}>
                      <td className="td">
                        <div className="uni-cell">
                          <div className="uni-logo">{app.initials}</div>
                          <div>
                            <div className="uni-name">{app.university}</div>
                            <div className="uni-location">{app.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="td">{app.major}</td>
                      <td className="td">{app.date}</td>
                      <td className="td">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="td">
                        <div className="actions-cell">
                          <ActionButton
                            status={app.status}
                            navigate={navigate}
                            app={app}
                          />
                          <button
                            className="btn-delete"
                            title="Delete"
                            onClick={() => setDeleteTarget(app)}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {applications.length > 0 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      className={p === page ? "page-btn-active" : "page-btn"}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  className="page-btn"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        <DeleteModal
          target={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </Layout>
  );
}
