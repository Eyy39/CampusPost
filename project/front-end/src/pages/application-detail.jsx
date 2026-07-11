import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../utils/api";
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, BookOpen, Building2, BookMarked, FileText, CheckCircle, Clock, ArrowLeft, Download, Printer } from "lucide-react";
import html2pdf from "html2pdf.js";
import "./application-detail.css";

function Row({ label, value }) {
  return (
    <div className="ad-row">
      <span className="ad-label">{label}</span>
      <span className="ad-value">{value || "\u2014"}</span>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <Icon size={18} className="ad-section-icon" />
        <h3 className="ad-section-title">{title}</h3>
      </div>
      <div className="ad-section-body">{children}</div>
    </div>
  );
}

function Timeline({ status }) {
  const steps = [
    { label: "Submitted", date: "Just now" },
    { label: "Under Review", date: "Pending" },
    { label: "Approved", date: "Pending" },
    { label: "Completed", date: "Pending" },
  ];
  const order = { approved: 2, rejected: -1, pending_review: 1, pending: 1, draft: 0 };
  const current = order[status] ?? 1;

  return (
    <div className="ad-timeline">
      {steps.map((s, i) => {
        const idx = i + 1;
        let state = "upcoming";
        if (idx < current) state = "done";
        else if (idx === current) state = "active";
        if (current === -1 && i === 2) state = "rejected";

        return (
          <div key={s.label} className={`ad-timeline-step ${state}`}>
            <div className="ad-timeline-marker">
              {state === "done" ? <CheckCircle size={14} /> : state === "rejected" ? <span className="ad-timeline-x">\u2716</span> : <span>{idx}</span>}
            </div>
            <div className="ad-timeline-info">
              <span className="ad-timeline-label">{s.label}</span>
              <span className="ad-timeline-date">{idx <= current && current !== -1 ? s.date : ""}</span>
            </div>
            {i < steps.length - 1 && <div className={`ad-timeline-connector ${idx < current ? "done" : ""}`} />}
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    approved: { label: "Approved", icon: CheckCircle, cls: "badge-success" },
    rejected: { label: "Rejected", icon: Clock, cls: "badge-danger" },
    pending: { label: "Pending Review", icon: Clock, cls: "badge-warning" },
    draft: { label: "Draft", icon: Clock, cls: "badge-muted" },
  };
  const s = map[status] || map.pending;
  const Icon = s.icon;
  return (
    <span className={`ad-badge ${s.cls}`}>
      <Icon size={14} />
      {s.label}
    </span>
  );
}

export default function ApplicationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const printRef = useRef();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.application) {
      const app = location.state.application;
      setData({
        ...app,
        fullName: app.fullName || app.ApplicantProfile?.full_name || "",
        gender: app.gender || app.ApplicantProfile?.gender || "",
        dateOfBirth: app.dateOfBirth || app.ApplicantProfile?.date_of_birth || "",
        email: app.email || app.ApplicantProfile?.email || "",
        phone: app.phone || app.ApplicantProfile?.phone || "",
        parentPhone: app.parentPhone || "",
        referralSource: app.referralSource || "",
        city: app.city || app.ApplicantProfile?.city || "",
        address: app.address || app.ApplicantProfile?.address || "",
        highSchool: app.highSchool || app.AcademicInformation?.high_school || "",
        graduationYear: app.graduationYear || app.AcademicInformation?.graduation_year || "",
        gpa: app.gpa || app.AcademicInformation?.gpa || "",
        grade: app.grade || app.AcademicInformation?.grade || "",
        studyProgram: app.studyProgram || app.AcademicInformation?.study_program || "",
        englishProficiency: app.englishProficiency || app.AcademicInformation?.english_proficiency || "",
        awards: app.awards || app.AcademicInformation?.awards || "",
        university: app.university || app.University?.name || "",
        major: app.major || app.Major?.major_name || "",
        degreeLevel: app.degreeLevel || app.Major?.degree_level || "",
        status: app.admin_status || "pending",
      });
      setLoading(false);
      return;
    }

    api.get(`/applications/${id}`)
      .then((app) => {
        const profile = app.ApplicantProfile || {};
        const academic = app.AcademicInformation || {};
        setData({
          ...app,
          fullName: profile.full_name || "",
          gender: profile.gender || "",
          dateOfBirth: profile.date_of_birth || "",
          email: profile.email || "",
          phone: profile.phone || "",
          city: profile.city || "",
          address: profile.address || "",
          highSchool: academic.high_school || "",
          graduationYear: academic.graduation_year || "",
          gpa: academic.gpa || "",
          grade: academic.grade || "",
          studyProgram: academic.study_program || "",
          englishProficiency: academic.english_proficiency || "",
          awards: academic.awards || "",
          university: app.University?.name || "",
          major: app.Major?.major_name || "",
          degreeLevel: app.Major?.degree_level || "",
          status: app.admin_status || "pending",
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, location.state]);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "\u2014";

  const handlePrint = () => window.print();

  const handleDownloadPDF = () => {
    const element = printRef.current;
    element.classList.add("pdf-capture");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const opt = {
          margin: [0.5, 0.5],
          filename: `${data?.ref_no || "application"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 1, useCORS: true, logging: false },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };
        html2pdf().set(opt).from(element).save().then(() => {
          element.classList.remove("pdf-capture");
        }).catch(() => {
          element.classList.remove("pdf-capture");
        });
      });
    });
  };

  if (loading) {
    return (
      <Layout activePage="My Applications">
        <div className="ad-page">
          <div className="ad-empty"><p>Loading application...</p></div>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout activePage="My Applications">
        <div className="ad-page">
          <div className="ad-empty">
            <h2>Application not found</h2>
            <p>{error || "The application you're looking for doesn't exist or has been removed."}</p>
            <button className="ad-btn ad-btn-primary" onClick={() => navigate("/my-applications")}>Back to My Applications</button>
          </div>
        </div>
      </Layout>
    );
  }

  const initials = (data.fullName || "??").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Layout activePage="My Applications">
      <div className="ad-page">
        <div className="ad-container">
        <div className="ad-topbar">
          <button className="ad-back" onClick={() => navigate("/my-applications")}>
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="ad-topbar-right">
            <button className="ad-btn ad-btn-outline" onClick={handlePrint}>
              <Printer size={15} />
              Print
            </button>
            <button className="ad-btn ad-btn-primary" onClick={handleDownloadPDF}>
              <Download size={15} />
              Download PDF
            </button>
          </div>
        </div>

        <div ref={printRef}>
          <div className="ad-header">
            <div className="ad-header-left">
              <div className="ad-title-row">
                <h1 className="ad-title">Application for Admission</h1>
                <StatusBadge status={data.status} />
              </div>
              <div className="ad-meta-row">
                <span className="ad-ref">Ref: <strong>{data.ref_no || "N/A"}</strong></span>
                <span className="ad-date">Submitted {formatDate(data.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="ad-main">
          <div className="ad-personal-row">
            <Section icon={User} title="Personal Information">
              <div className="ad-personal-grid">
                <div className="ad-photo-col">
                  <div className="ad-photo">
                    <span>{initials}</span>
                  </div>
                </div>
                <div className="ad-personal-fields">
                  <Row label="Full Name" value={data.fullName} />
                  <Row label="Gender" value={data.gender} />
                  <Row label="Date of Birth" value={data.dateOfBirth} />
                  <Row label="Email" value={data.email} />
                  <Row label="Phone" value={data.phone} />
                  <Row label="City / Province" value={data.city} />
                  <Row label="Address" value={data.address} />
                </div>
              </div>
            </Section>

            <div className="ad-side-meta">
              <div className="ad-meta-card">
                <h4 className="ad-meta-title">Submission Details</h4>
                <div className="ad-meta-body">
                  <Row label="Reference No." value={data.ref_no} />
                  <Row label="Created" value={formatDate(data.created_at)} />
                  <Row label="Last Updated" value={formatDate(data.updated_at)} />
                </div>
              </div>
              <div className="ad-meta-card">
                <h4 className="ad-meta-title">Status Timeline</h4>
                <Timeline status={data.status} />
              </div>
            </div>
          </div>

          <Section icon={GraduationCap} title="Academic Information">
            <div className="ad-grid-2">
              <Row label="High School" value={data.highSchool} />
              <Row label="Graduation Year" value={data.graduationYear} />
              <Row label="GPA" value={data.gpa} />
              <Row label="Bac II Grade" value={data.grade} />
              <Row label="Study Program" value={data.studyProgram} />
              <Row label="English Proficiency" value={data.englishProficiency} />
              <Row label="Awards" value={data.awards} className="ad-full" />
            </div>
          </Section>

          <Section icon={Building2} title="Program Selection">
            <div className="ad-grid-2">
              <Row label="University" value={data.university} />
              <Row label="Major" value={data.major} />
              <Row label="Degree Level" value={data.degreeLevel} />
            </div>
          </Section>

          <Section icon={FileText} title="Uploaded Documents">
            <div className="ad-doc-list">
              {[
                { key: "nationalId", label: "National ID / Passport" },
                { key: "transcript", label: "High School Transcript" },
                { key: "diploma", label: "Diploma / Graduation Certificate" },
                { key: "passportPhoto", label: "Passport-size Photo" },
                { key: "englishCert", label: "English Certificate" },
              ].map((doc) => {
                const ok = !!data.documents?.[doc.key];
                return (
                  <div key={doc.key} className={`ad-doc-item ${ok ? "uploaded" : ""}`}>
                    {ok ? <CheckCircle size={16} className="ad-doc-ok" /> : <div className="ad-doc-no" />}
                    <span>{doc.label}</span>
                    {ok && <span className="ad-doc-tag">Uploaded</span>}
                  </div>
                );
              })}
            </div>
          </Section>

          {data.admin_note && (
            <Section icon={BookMarked} title="Reviewer Notes">
              <div className="ad-notes-empty">
                <p>{data.admin_note}</p>
              </div>
            </Section>
          )}
        </div>
        </div>
        </div>
      </div>
    </Layout>
  );
}
