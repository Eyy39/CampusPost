import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../utils/api";
import { ArrowLeft, Download, Printer, CheckCircle, Eye, X } from "lucide-react";
import html2pdf from "html2pdf.js";
import "./application-detail.css";

export default function ApplicationDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const printRef = useRef();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    if (location.state?.application) {
      const app = location.state.application;
      const profile = app.ApplicantProfile || {};
      const academic = app.AcademicInformation || {};
      setData({
        ...app,
        fullName: app.fullName || profile.full_name || "",
        gender: app.gender || profile.gender || "",
        dateOfBirth: app.dateOfBirth || profile.date_of_birth || "",
        email: app.email || profile.email || "",
        phone: app.phone || profile.phone || "",
        parentPhone: app.parentPhone || profile.parent_phone || "",
        city: app.city || profile.city || "",
        address: app.address || profile.address || "",
        photo: app.photo || profile.photo || "",
        highSchool: app.highSchool || academic.high_school || "",
        graduationYear: app.graduationYear || academic.graduation_year || "",
        gpa: app.gpa || academic.gpa || "",
        grade: app.grade || academic.grade || "",
        studyProgram: app.studyProgram || academic.study_program || "",
        englishProficiency: app.englishProficiency || academic.english_proficiency || "",
        awards: app.awards || academic.awards || "",
        university: app.university || app.University?.name || "",
        major: app.major || app.Major?.major_name || "",
        degreeLevel: app.degreeLevel || app.Major?.degree_level || "",
        status: app.admin_status || "pending",
        documents: app.ApplicationDocuments || app.documents || [],
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
          parentPhone: profile.parent_phone || "",
          city: profile.city || "",
          address: profile.address || "",
          photo: profile.photo || "",
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
          documents: app.ApplicationDocuments || [],
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, location.state]);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";

  const handlePrint = () => window.print();

  const handleDownloadPDF = () => {
    const element = printRef.current;
    element.classList.add("pdf-capture");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const opt = {
          margin: [10, 10],
          filename: `${data?.ref_no || "application"}.pdf`,
          image: { type: "jpeg", quality: 0.95 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            width: 850,
            windowWidth: 850,
            letterRendering: true,
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
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

  const docTypes = [
    { key: "nationalId", label: "National ID / Passport" },
    { key: "transcript", label: "High School Transcript" },
    { key: "diploma", label: "Diploma / Graduation Certificate" },
    { key: "passportPhoto", label: "Photo" },
  ];

  const getDocUrl = (docType) => {
    if (!data?.documents) return null;
    const doc = Array.isArray(data.documents)
      ? data.documents.find((d) => d.document_type === docType)
      : data.documents[docType];
    return doc?.file_url || doc?.url || null;
  };

  return (
    <>
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

          <div ref={printRef} className="ad-pdf-wrapper">
            <div className="ad-header">
              <div className="ad-header-left">
                <h1 className="ad-title">Application for Admission</h1>
                <p className="ad-subtitle">CampusPost University Application Portal</p>
              </div>
              <div className="ad-header-right">
                <p className="ad-ref-line">Ref: <strong>{data.ref_no || "N/A"}</strong></p>
                <p className="ad-date-line">Submitted {formatDate(data.created_at)}</p>
                <span className={`ad-status-badge ad-status-${data.status}`}>{data.status}</span>
              </div>
            </div>
            <hr className="ad-divider" />

            <div className="ad-section">
              <h2 className="ad-section-title">Personal Information</h2>
              <div className="ad-personal-wrapper">
                <div className="ad-profile-img">
                  {data.photo ? (
                    <img src={data.photo} alt="Applicant" />
                  ) : (
                    <span className="ad-initials">{(data.fullName || "??").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div className="ad-data-grid">
                  <div className="ad-data-row"><span className="ad-data-label">Full Name:</span><span className="ad-data-value bold">{data.fullName || "N/A"}</span></div>
                  <div className="ad-data-row"><span className="ad-data-label">Gender:</span><span className="ad-data-value">{data.gender || "N/A"}</span></div>
                  <div className="ad-data-row"><span className="ad-data-label">Date of Birth:</span><span className="ad-data-value">{data.dateOfBirth || "N/A"}</span></div>
                  <div className="ad-data-row"><span className="ad-data-label">Email:</span><span className="ad-data-value">{data.email || "N/A"}</span></div>
                  <div className="ad-data-row"><span className="ad-data-label">Phone:</span><span className="ad-data-value">{data.phone || "N/A"}</span></div>
                  <div className="ad-data-row"><span className="ad-data-label">Parent Phone:</span><span className="ad-data-value">{data.parentPhone || "N/A"}</span></div>
                  <div className="ad-data-row"><span className="ad-data-label">City:</span><span className="ad-data-value">{data.city || "N/A"}</span></div>
                  <div className="ad-data-row"><span className="ad-data-label">Address:</span><span className="ad-data-value">{data.address || "N/A"}</span></div>
                </div>
              </div>
            </div>

            <div className="ad-section">
              <h2 className="ad-section-title">Academic Information</h2>
              <div className="ad-data-grid">
                <div className="ad-data-row"><span className="ad-data-label">High School:</span><span className="ad-data-value">{data.highSchool || "N/A"}</span></div>
                <div className="ad-data-row"><span className="ad-data-label">Graduation Year:</span><span className="ad-data-value">{data.graduationYear || "N/A"}</span></div>
                <div className="ad-data-row"><span className="ad-data-label">GPA:</span><span className="ad-data-value">{data.gpa || "N/A"}</span></div>
                <div className="ad-data-row"><span className="ad-data-label">Bac II Grade:</span><span className="ad-data-value">{data.grade || "N/A"}</span></div>
                <div className="ad-data-row"><span className="ad-data-label">Study Program:</span><span className="ad-data-value">{data.studyProgram || "N/A"}</span></div>
                <div className="ad-data-row"><span className="ad-data-label">English Proficiency:</span><span className="ad-data-value">{data.englishProficiency || "N/A"}</span></div>
                <div className="ad-data-row"><span className="ad-data-label">Awards:</span><span className="ad-data-value">{data.awards || "N/A"}</span></div>
                <div></div>
              </div>
            </div>

            <div className="ad-section">
              <h2 className="ad-section-title">Program Selection</h2>
              <div className="ad-data-grid">
                <div className="ad-data-row"><span className="ad-data-label">University:</span><span className="ad-data-value bold">{data.university || "N/A"}</span></div>
                <div className="ad-data-row"><span className="ad-data-label">Degree Level:</span><span className="ad-data-value">{data.degreeLevel || "N/A"}</span></div>
                <div className="ad-data-row"><span className="ad-data-label">Major:</span><span className="ad-data-value bold">{data.major || "N/A"}</span></div>
              </div>
            </div>

            <div className="ad-section ad-section-last">
              <h2 className="ad-section-title">Uploaded Documents</h2>
              <div className="ad-documents-grid">
                {docTypes.map((doc) => {
                  const url = getDocUrl(doc.key);
                  return (
                    <div key={doc.key} className="ad-doc-item">
                      {url ? (
                        <>
                          <CheckCircle size={16} className="ad-doc-check" /> {doc.label}
                          <button className="ad-doc-view" onClick={() => setPreviewDoc({ url, label: doc.label })}>
                            <Eye size={12} /> View
                          </button>
                        </>
                      ) : (
                        <span className="ad-doc-missing"><div className="ad-doc-no" /> {doc.label}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>

    {previewDoc && (() => {
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/i.test(previewDoc.url);
      if (isImage) {
        return (
          <div className="ad-preview-fullscreen" onClick={() => setPreviewDoc(null)}>
            <button className="ad-preview-fullscreen-close" onClick={() => setPreviewDoc(null)}>
              <X size={24} />
            </button>
            <img src={previewDoc.url} alt={previewDoc.label} className="ad-preview-fullscreen-img" />
          </div>
        );
      }
      return (
        <div className="ad-preview-overlay" onClick={() => setPreviewDoc(null)}>
          <div className="ad-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ad-preview-header">
              <span className="ad-preview-title">{previewDoc.label}</span>
              <button className="ad-preview-close" onClick={() => setPreviewDoc(null)}>
                <X size={18} />
              </button>
            </div>
            <iframe src={previewDoc.url} className="ad-preview-frame" title={previewDoc.label} />
          </div>
        </div>
      );
    })()}
  </>
  );
}
