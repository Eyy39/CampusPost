import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Footer } from "../components/Layout";
import ProgressStepper from "../components/ProgressStepper";
import Sidebar from "../components/Sidebar";
import { Arrow, BackArrow, DocumentIcon, UploadIcon, CheckCircle } from "../components/Icons";
import { saveDraftToDB, loadDraftFromDB } from "../utils/draftDB";
import "./application.css";

function Field({ label, children, fullWidth, error, required }) {
  return (
    <div className={fullWidth ? "field-full" : undefined}>
      <label className="label">{label}{required && <span className="required-star"> *</span>}</label>
      {children}
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}

export default function ApplicationDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRefs = useRef({});
  const [step, setStep] = useState(1);

  useEffect(() => {
    const draftId = location.state?.draftId;
    if (draftId) {
      loadDraftFromDB(draftId).then((draft) => {
        if (draft) {
          const { id, ...rest } = draft;
          setData((prev) => ({ ...prev, ...rest, draftId: id }));
        }
      });
    }
  }, []);
  const [data, setData] = useState({
    fullName: "", gender: "", dateOfBirth: "2004-01-01",
    email: "", phone: "", parentPhone: "", referralSource: "", city: "", address: "",
    highSchool: "", graduationYear: "", gpa: "", grade: "", studyProgram: "",
    englishProficiency: "", awards: "",
    university: "", faculty: "", major: "", degreeLevel: "",
    intakeYear: "2024", studyMode: "Full-time", compareUniversity: "",
    documents: { nationalId: null, transcript: null, diploma: null, passportPhoto: null, englishCert: null },
    confirmed: false,
  });

  const set = (key) => (e) => setData((prev) => ({ ...prev, [key]: e.target.value }));
  const handleFileUpload = (key) => (e) => {
    const file = e.target.files[0];
    if (file) {
      setData((prev) => ({
        ...prev,
        documents: { ...prev.documents, [key]: { name: file.name, size: (file.size / 1024 / 1024).toFixed(1) + " MB", file, status: "Uploaded" } },
      }));
    }
  };
  const triggerFileInput = (key) => {
    fileInputRefs.current[key]?.click();
  };

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isCADT = data.university === "Cambodia Academy of Digital Technology";

  const cadtFaculties = ["Institute of Digital Technology (IDT)"];
  const cadtMajors = {
    "Institute of Digital Technology (IDT)": [
      "Computer Science (Software Engineering)",
      "Computer Science (Data Science)",
      "Telecoms & Networking (Cyber Security)",
      "Telecoms & Networking (Telecoms & Network Engineering)",
      "Digital Business (e-Commerce)",
    ],
  };

  const serializeDocs = (docs) =>
    Object.fromEntries(
      Object.entries(docs).map(([key, val]) => [
        key,
        val ? { name: val.name, size: val.size, status: "Uploaded" } : null,
      ])
    );

  const buildEntry = (status) => ({
    id: data.draftId || Date.now(),
    initials: (data.fullName || "NA").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    university: data.university || "Not specified",
    location: data.city || "Not specified",
    major: data.major || "Not specified",
    date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    status,
    fullName: data.fullName,
    gender: data.gender,
    dateOfBirth: data.dateOfBirth,
    email: data.email,
    phone: data.phone,
    parentPhone: data.parentPhone,
    referralSource: data.referralSource,
    city: data.city,
    address: data.address,
    highSchool: data.highSchool,
    graduationYear: data.graduationYear,
    gpa: data.gpa,
    grade: data.grade,
    studyProgram: data.studyProgram,
    englishProficiency: data.englishProficiency,
    awards: data.awards,
    faculty: data.faculty,
    degreeLevel: data.degreeLevel,
    intakeYear: data.intakeYear,
    studyMode: data.studyMode,
    documents: serializeDocs(data.documents),
    photo: data.documents.passportPhoto?.file
      ? URL.createObjectURL(data.documents.passportPhoto.file)
      : null,
  });

  const handleSaveDraft = () => {
    const drafts = JSON.parse(localStorage.getItem("campuspost_drafts") || "[]");
    const existing = drafts.findIndex((d) => d.id === data.draftId);
    const entry = buildEntry("Draft");
    if (existing > -1) {
      drafts[existing] = { ...drafts[existing], ...entry };
    } else {
      drafts.unshift(entry);
    }
    localStorage.setItem("campuspost_drafts", JSON.stringify(drafts));
    setData((prev) => ({ ...prev, draftId: entry.id }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    saveDraftToDB(entry.id, { ...data, id: entry.id });
  };

  const handleSubmit = () => {
    if (!validateStep(5)) return;
    const drafts = JSON.parse(localStorage.getItem("campuspost_drafts") || "[]");
    const existing = drafts.findIndex((d) => d.id === data.draftId);
    const entry = { ...buildEntry("Pending Review"), confirmed: true };
    if (existing > -1) {
      drafts[existing] = { ...drafts[existing], ...entry };
    } else {
      drafts.unshift(entry);
    }
    localStorage.setItem("campuspost_drafts", JSON.stringify(drafts));
    setData((prev) => ({ ...prev, draftId: entry.id }));
    setSubmitted(true);
    setStep(6);
    saveDraftToDB(entry.id, { ...data, id: entry.id, confirmed: true });
  };

  const validateStep = (step) => {
    const errs = {};
    switch (step) {
      case 1:
        if (!data.fullName.trim()) errs.fullName = "Full name is required";
        if (!data.gender) errs.gender = "Gender is required";
        if (!data.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
        if (!data.phone.trim()) errs.phone = "Phone number is required";
        if (!data.parentPhone.trim()) errs.parentPhone = "Parent/Guardian phone number is required";
        if (!data.city.trim()) errs.city = "City is required";
        if (!data.address.trim()) errs.address = "Address is required";
        break;
      case 2:
        if (!data.highSchool.trim()) errs.highSchool = "High school name is required";
        if (!data.graduationYear) errs.graduationYear = "Graduation year is required";
        // GPA is optional
        // Bac II grade — no validation (admin reviews/approves)
        if (!data.studyProgram.trim()) errs.studyProgram = "Study program is required";
        break;
      case 3:
        if (!data.university) errs.university = "University is required";
        if (!data.faculty.trim()) errs.faculty = "Faculty is required";
        if (!data.major.trim()) errs.major = "Major is required";
        if (!data.degreeLevel) errs.degreeLevel = "Degree level is required";
        break;
      case 4:
        if (!data.documents.nationalId) errs.nationalId = "National ID / Passport is required";
        if (!data.documents.transcript) errs.transcript = "High school transcript is required";
        if (!data.documents.diploma) errs.diploma = "Diploma / Graduation Certificate is required";
        if (!data.documents.passportPhoto) errs.passportPhoto = "Your photo is required";
        break;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (step < 6 && validateStep(step)) {
      setStep((s) => Math.min(s + 1, 7));
    }
  };
  const prev = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };
  const goTo = (s) => {
    setErrors({});
    setStep(s);
  };

  const renderStep = () => {
    switch (step) {
      case 1: return step1();
      case 2: return step2();
      case 3: return step3();
      case 4: return step4();
      case 5: return step5();
      case 6: return step6();
      default: return null;
    }
  };

  const docsList = [
    { key: "nationalId", label: "National ID / Passport" },
    { key: "transcript", label: "High School Transcript" },
    { key: "diploma", label: "Diploma / Graduation Certificate" },
    { key: "passportPhoto", label: "Your Photo" },
    { key: "englishCert", label: "English Certificate (optional)" },
  ];

  const step1 = () => (
    <div className="card">
      <div className="save-draft-wrap">
        <div>
          <h2 className="card-title">Step 1: Personal Information</h2>
          <p className="card-subtitle">Provide your basic personal details to start the application.</p>
        </div>
        <button className="btn-save-draft" onClick={handleSaveDraft}>{saved ? "Saved!" : "Save Draft"}</button>
      </div>
      <div className="form-grid">
        <div className="field-full" style={{ fontSize: 13, color: "#6E8098", marginBottom: -8 }}>
          Fields marked with <span style={{ color: "#E53E3E" }}>*</span> are required
        </div>
        <Field label="Full Name" required error={errors.fullName}>
          <input className={`input ${errors.fullName ? "input-error" : ""}`} placeholder="e.g. Sopheak Vann" value={data.fullName} onChange={set("fullName")} />
        </Field>
        <Field label="Gender" required error={errors.gender}>
          <select className={`select ${errors.gender ? "input-error" : ""}`} value={data.gender} onChange={set("gender")}>
            <option value="" disabled>Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </Field>
        <Field label="Date of Birth" required error={errors.dateOfBirth}>
          <input className={`input ${errors.dateOfBirth ? "input-error" : ""}`} type="date" value={data.dateOfBirth} onChange={set("dateOfBirth")} />
        </Field>
        <Field label="Email Address" error={errors.email}>
          <input className={`input ${errors.email ? "input-error" : ""}`} type="email" placeholder="sopheak@example.com" value={data.email} onChange={set("email")} />
        </Field>
        <Field label="Phone Number" required error={errors.phone}>
          <input className={`input ${errors.phone ? "input-error" : ""}`} type="tel" placeholder="+855 12 345 678" value={data.phone} onChange={set("phone")} />
        </Field>
        <Field label="Parent/Guardian Phone Number" required error={errors.parentPhone}>
          <input className={`input ${errors.parentPhone ? "input-error" : ""}`} type="tel" placeholder="+855 12 345 678" value={data.parentPhone} onChange={set("parentPhone")} />
        </Field>
        <Field label="How did you know about us?" required error={errors.referralSource}>
          <select className={`select ${errors.referralSource ? "input-error" : ""}`} value={data.referralSource} onChange={set("referralSource")}>
            <option value="" disabled>Select an option</option>
            <option value="Friend / Family">Friend / Family</option>
            <option value="Social Media">Social Media</option>
            <option value="School / Teacher">School / Teacher</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Other">Other</option>
          </select>
        </Field>
        <Field label="City / Province" required error={errors.city}>
          <input className={`input ${errors.city ? "input-error" : ""}`} placeholder="e.g. Phnom Penh" value={data.city} onChange={set("city")} />
        </Field>
        <Field label="Permanent Address" fullWidth required error={errors.address}>
          <input className={`input ${errors.address ? "input-error" : ""}`} placeholder="Street, village, commune, district" value={data.address} onChange={set("address")} />
        </Field>
      </div>
      <div className="actions-nav actions-buttons">
        <button className="btn-secondary" onClick={() => {}}><BackArrow /> Back</button>
        <button className="btn-primary" onClick={next}>Next Step <Arrow /></button>
      </div>
    </div>
  );

  const step2 = () => (
    <div className="card">
      <div className="save-draft-wrap">
        <div>
          <h2 className="card-title">Step 2: Education Information</h2>
          <p className="card-subtitle">Tell us about your academic background.</p>
        </div>
        <button className="btn-save-draft" onClick={handleSaveDraft}>{saved ? "Saved!" : "Save Draft"}</button>
      </div>
      <div className="form-grid">
        <Field label="High School Name" fullWidth error={errors.highSchool}>
          <input className={`input ${errors.highSchool ? "input-error" : ""}`} placeholder="e.g. Paragon International School" value={data.highSchool} onChange={set("highSchool")} />
        </Field>
        <Field label="Graduation Year" error={errors.graduationYear}>
          <select className={`select ${errors.graduationYear ? "input-error" : ""}`} value={data.graduationYear} onChange={set("graduationYear")}>
            <option value="" disabled>Select year</option>
            {["2026", "2025", "2024", "2023", "2022", "2021", "2020"].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </Field>
        <Field label="GPA / Overall Grade (optional)" error={errors.gpa}>
          <input className={`input ${errors.gpa ? "input-error" : ""}`} placeholder="e.g. 3.8 / 4.0" value={data.gpa} onChange={set("gpa")} />
        </Field>
        <Field label="Bac II Grade (A, B, or C only)" error={errors.grade}>
          <select className={`select ${errors.grade ? "input-error" : ""}`} value={data.grade} onChange={set("grade")}>
            <option value="" disabled>Select your grade</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </Field>
        <Field label="Study Program" error={errors.studyProgram}>
          <select className={`select ${errors.studyProgram ? "input-error" : ""}`} value={data.studyProgram} onChange={set("studyProgram")}>
            <option value="" disabled>Select your study program</option>
            <option value="Science">Science</option>
            <option value="Khmer Literature">Khmer Literature</option>
          </select>
        </Field>
        <Field label="English Proficiency (optional)">
          <select className="select" value={data.englishProficiency} onChange={set("englishProficiency")}>
            <option value="">Not specified</option>
            <option value="IELTS 6.0">IELTS 6.0</option>
            <option value="IELTS 6.5">IELTS 6.5</option>
            <option value="IELTS 7.0">IELTS 7.0</option>
            <option value="TOEFL 80">TOEFL 80</option>
            <option value="TOEFL 90">TOEFL 90</option>
            <option value="TOEFL 100">TOEFL 100</option>
          </select>
        </Field>
        <Field label="Awards or Achievements (optional)" fullWidth>
          <textarea className="textarea" placeholder="List any academic awards, scholarships, or achievements..." value={data.awards} onChange={set("awards")} />
        </Field>
      </div>
      <div className="actions-nav actions-buttons">
        <button className="btn-secondary" onClick={prev}><BackArrow /> Previous</button>
        <button className="btn-primary" onClick={next}>Next Step <Arrow /></button>
      </div>
    </div>
  );

  const step3 = () => (
    <div className="card">
      <div className="save-draft-wrap">
        <div>
          <h2 className="card-title">Step 3: University Selection</h2>
          <p className="card-subtitle">Choose where and what you want to study.</p>
        </div>
        <button className="btn-save-draft" onClick={handleSaveDraft}>{saved ? "Saved!" : "Save Draft"}</button>
      </div>
      <div className="form-grid">
        <Field label="University" fullWidth error={errors.university}>
          <select className={`select ${errors.university ? "input-error" : ""}`} value={data.university} onChange={set("university")}>
            <option value="" disabled>Select university</option>
            <option value="Cambodia Academy of Digital Technology">Cambodia Academy of Digital Technology</option>
            <option value="Institute of Foreign Languages">Institute of Foreign Languages</option>
            <option value="Institute of Technology of Cambodia">Institute of Technology of Cambodia</option>
            <option value="Paragon International University">Paragon International University</option>
            <option value="Royal University of Phnom Penh">Royal University of Phnom Penh</option>
            <option value="University of Cambodia">University of Cambodia</option>
            <option value="American University of Phnom Penh">American University of Phnom Penh</option>
          </select>
        </Field>
        {isCADT ? (
          <>
            <Field label="Faculty" error={errors.faculty}>
              <select className={`select ${errors.faculty ? "input-error" : ""}`} value={data.faculty} onChange={(e) => { setData((prev) => ({ ...prev, faculty: e.target.value, major: "" })); }}>
                <option value="" disabled>Select faculty</option>
                {cadtFaculties.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="Major" error={errors.major}>
              <select className={`select ${errors.major ? "input-error" : ""}`} value={data.major} onChange={set("major")}>
                <option value="" disabled>Select major</option>
                {data.faculty && cadtMajors[data.faculty]?.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
          </>
        ) : (
          <>
            <Field label="Faculty" error={errors.faculty}>
              <input className={`input ${errors.faculty ? "input-error" : ""}`} placeholder="e.g. Computer Science" value={data.faculty} onChange={set("faculty")} />
            </Field>
            <Field label="Major" error={errors.major}>
              <input className={`input ${errors.major ? "input-error" : ""}`} placeholder="e.g. Software Engineering" value={data.major} onChange={set("major")} />
            </Field>
          </>
        )}
        <Field label="Degree Level" error={errors.degreeLevel}>
          <select className={`select ${errors.degreeLevel ? "input-error" : ""}`} value={data.degreeLevel} onChange={set("degreeLevel")}>
            <option value="" disabled>Select level</option>
            <option value="Bachelor's">Bachelor's</option>
            <option value="Master's">Master's</option>
            <option value="PhD">PhD</option>
            <option value="Associate">Associate</option>
          </select>
        </Field>
        <Field label="Intake Year">
          <select className="select" value={data.intakeYear} onChange={set("intakeYear")}>
            {["2024", "2025", "2026"].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </Field>
        <Field label="Study Mode">
          <select className="select" value={data.studyMode} onChange={set("studyMode")}>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
        </Field>
        <Field label="Compare with another university (optional)" fullWidth>
          <select className="select" value={data.compareUniversity} onChange={set("compareUniversity")}>
            <option value="">None</option>
            <option value="Cambodia Academy of Digital Technology">Cambodia Academy of Digital Technology</option>
            <option value="Royal University of Phnom Penh">Royal University of Phnom Penh</option>
            <option value="Institute of Technology of Cambodia">Institute of Technology of Cambodia</option>
            <option value="University of Cambodia">University of Cambodia</option>
          </select>
        </Field>
      </div>
      <div className="actions-nav actions-buttons">
        <button className="btn-secondary" onClick={prev}><BackArrow /> Previous</button>
        <button className="btn-primary" onClick={next}>Next Step <Arrow /></button>
      </div>
    </div>
  );

  const step4 = () => (
    <div className="card">
      <div className="save-draft-wrap">
        <div>
          <h2 className="card-title">Step 4: Document Upload</h2>
          <p className="card-subtitle">Upload the required documents for your application.</p>
        </div>
        <button className="btn-save-draft" onClick={handleSaveDraft}>{saved ? "Saved!" : "Save Draft"}</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {docsList.map((doc) => {
          const file = data.documents[doc.key];
          return (
            <div key={doc.key} className="upload-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <DocumentIcon />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#243B5A" }}>{doc.label}</div>
                  {file && (
                    <div style={{ fontSize: 11, color: "#6E8098", marginTop: 2 }}>
                      {file.name} &middot; {file.size}
                    </div>
                  )}
                  </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {file ? (
                  <span style={{ fontSize: 12, color: "#16A34A", fontWeight: 600 }}>Uploaded</span>
                ) : (
                  <>
                    <input
                      type="file"
                      ref={(el) => (fileInputRefs.current[doc.key] = el)}
                      onChange={handleFileUpload(doc.key)}
                      style={{ display: "none" }}
                      accept={doc.key === "passportPhoto" ? "image/*" : ".pdf,.doc,.docx,.jpg,.png"}
                    />
                    <button className="upload-btn" onClick={() => triggerFileInput(doc.key)}>
                      <UploadIcon /> Upload
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="actions-nav actions-buttons">
        <button className="btn-secondary" onClick={prev}><BackArrow /> Previous</button>
        <button className="btn-primary" onClick={next}>Next Step <Arrow /></button>
      </div>
    </div>
  );

  const step5 = () => (
    <div className="card">
      <div className="save-draft-wrap">
        <div>
          <h2 className="card-title">Step 5: Review & Submit</h2>
          <p className="card-subtitle">Verify all information before submitting your application.</p>
        </div>
        <button className="btn-save-draft" onClick={handleSaveDraft}>{saved ? "Saved!" : "Save Draft"}</button>
      </div>

      <div className="review-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0C1A3C", margin: 0 }}>Personal Information</h3>
          <button className="edit-btn" onClick={() => goTo(1)}>Edit</button>
        </div>
        {[
          ["Full Name", data.fullName || "\u2014"],
          ["Gender", data.gender || "\u2014"],
          ["Date of Birth", data.dateOfBirth],
          ["Email", data.email || "\u2014"],
          ["Phone", data.phone || "\u2014"],
          ["Parent/Guardian Phone", data.parentPhone || "\u2014"],
          ["How did you know about us?", data.referralSource || "\u2014"],
          ["City / Province", data.city || "\u2014"],
          ["Address", data.address || "\u2014"],
        ].map(([label, value]) => (
          <div key={label} className="review-row">
            <span className="review-label">{label}</span>
            <span className="review-value">{value}</span>
          </div>
        ))}
      </div>

      <div className="review-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0C1A3C", margin: 0 }}>Education</h3>
          <button className="edit-btn" onClick={() => goTo(2)}>Edit</button>
        </div>
        {[
          ["High School", data.highSchool || "\u2014"],
          ["Graduation Year", data.graduationYear || "\u2014"],
          ["GPA", data.gpa || "\u2014"],
          ["Bac II Grade", data.grade || "\u2014"],
          ["Study Program", data.studyProgram || "\u2014"],
          ["English Proficiency", data.englishProficiency || "Not specified"],
          ["Awards", data.awards || "None"],
        ].map(([label, value]) => (
          <div key={label} className="review-row">
            <span className="review-label">{label}</span>
            <span className="review-value">{value}</span>
          </div>
        ))}
      </div>

      <div className="review-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0C1A3C", margin: 0 }}>University Selection</h3>
          <button className="edit-btn" onClick={() => goTo(3)}>Edit</button>
        </div>
        {[
          ["University", data.university || "\u2014"],
          ["Faculty", data.faculty || "\u2014"],
          ["Major", data.major || "\u2014"],
          ["Degree Level", data.degreeLevel || "\u2014"],
          ["Intake Year", data.intakeYear],
          ["Study Mode", data.studyMode],
        ].map(([label, value]) => (
          <div key={label} className="review-row">
            <span className="review-label">{label}</span>
            <span className="review-value">{value}</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0C1A3C", margin: 0 }}>Documents</h3>
          <button className="edit-btn" onClick={() => goTo(4)}>Edit</button>
        </div>
        {docsList.map((doc) => (
          <div key={doc.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13 }}>
            {data.documents[doc.key] ? <CheckCircle /> : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" fill="#E8EDF5" />
                <circle cx="9" cy="9" r="3" fill="#CBD5E1" />
              </svg>
            )}
            <span style={{ color: data.documents[doc.key] ? "#16A34A" : "#6E8098" }}>{doc.label}</span>
          </div>
        ))}
      </div>

      <div className="confirm-wrap">
        <input
          type="checkbox"
          className="checkbox"
          checked={data.confirmed}
          onChange={(e) => setData((prev) => ({ ...prev, confirmed: e.target.checked }))}
        />
        <span style={{ fontSize: 13, color: "#243B5A" }}>
          I confirm that all information provided is accurate.
        </span>
      </div>

      <div className="actions-nav actions-buttons">
        <button className="btn-secondary" onClick={prev}><BackArrow /> Previous</button>
        <button
          className={`btn-primary ${!data.confirmed ? "btn-primary-disabled" : ""}`}
          disabled={!data.confirmed}
          onClick={handleSubmit}
        >
          Submit Application
        </button>
      </div>
    </div>
  );

  const step6 = () => (
    <div className="card">
      <div className="success-page">
        <div className="success-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#16A34A" />
            <path d="M7.5 12.5L10.5 15.5L16.5 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="success-title">Application Submitted Successfully</h2>
        <p className="success-text">
          Thank you for applying through CampusPost.<br />
          Your application has been submitted successfully.
        </p>

        <div className="success-grid">
          <div className="success-card">
            <div className="success-card-title">Application ID</div>
            <div className="success-card-value">#CP-984410</div>
          </div>
          <div className="success-card">
            <div className="success-card-title">Application Status</div>
            <div className="success-card-value" style={{ color: "#16A34A" }}>Submitted</div>
          </div>
          <div className="success-card" style={{ gridColumn: "1 / -1" }}>
            <div className="success-card-title">University</div>
            <div className="success-card-value">Paragon International University</div>
          </div>
        </div>

        <div className="next-steps">
          <div className="next-steps-title">Next Steps</div>
          {[
            "Your application is under review.",
            "You may receive additional requests for documents.",
            "Check your email for updates.",
            "Track your application status from My Applications.",
          ].map((text, i) => (
            <div key={i} className="next-step-item">
              <svg width="6" height="6" viewBox="0 0 6 6" fill="#16A34A">
                <circle cx="3" cy="3" r="3" />
              </svg>
              {text}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn-primary" onClick={() => navigate("/my-applications")}>View My Applications</button>
          <button className="btn-secondary">Return to Dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="bg-deco" />
      <div className="bg-deco2" />
      <Navbar activePage="My Applications" />

      {step < 6 && (
        <div className="main main-padding">
          <div className="header-section">
            <h1 className="title">2024 Academic Enrollment</h1>
            <p className="subtitle">Undergraduate Application</p>
          </div>

          <ProgressStepper currentStep={step} />

          <div className="layout layout-grid">
            {renderStep()}
            <Sidebar currentStep={step} formData={data} />
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="main main-padding">
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            {renderStep()}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}


