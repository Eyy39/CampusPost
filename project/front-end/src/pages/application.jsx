import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import ProgressStepper from "../components/ProgressStepper";
import Sidebar from "../components/Sidebar";
import {
  Arrow,
  BackArrow,
  DocumentIcon,
  UploadIcon,
  CheckCircle,
} from "../components/Icons";
import { api } from "../utils/api";
import { saveDraftToDB, loadDraftFromDB } from "../utils/draftDB";
import "./application.css";

function Field({ label, children, fullWidth, error, required }) {
  return (
    <div className={fullWidth ? "field-full" : undefined}>
      <label className="label">
        {label}
        {required && <span className="required-star"> *</span>}
      </label>
      {children}
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}

export default function ApplicationDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRefs = useRef({});
  const fileUploadStartRef = useRef({});
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
    fullName: "",
    gender: "",
    dateOfBirth: "2004-01-01",
    email: "",
    phone: "",
    parentPhone: "",
    referralSource: "",
    city: "",
    address: "",
    highSchool: "",
    graduationYear: "",
    gpa: "",
    grade: "",
    studyProgram: "",
    englishProficiency: "",
    awards: "",
    university: "",
    faculty: "",
    major: "",
    degreeLevel: "",
    intakeYear: "2026",
    studyMode: "Full-time",
    compareUniversity: "",
    documents: {
      nationalId: null,
      transcript: null,
      diploma: null,
      passportPhoto: null,
      englishCert: null,
    },
    confirmed: false,
  });

  const set = (key) => (e) => {
    const value = e.target.value;
    setData((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "university") {
        updated.studyMode = value.includes("CADT") ? "Full-time" : prev.studyMode;
      }
      return updated;
    });
  };
  const handleFileUpload = (key) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const startedAt = fileUploadStartRef.current[key];
      const elapsedSeconds = startedAt
        ? ((Date.now() - startedAt) / 1000).toFixed(2)
        : null;
      setData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [key]: {
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(1) + " MB",
            file,
            status: "Uploaded",
          },
        },
      }));
      fileUploadStartRef.current[key] = null;
    }
  };
  const triggerFileInput = (key) => {
    fileUploadStartRef.current[key] = Date.now();
    fileInputRefs.current[key]?.click();
  };

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverAppId, setServerAppId] = useState(null);
  const [serverRefNo, setServerRefNo] = useState(null);
  const [universitiesList, setUniversitiesList] = useState([]);
  const [majorsList, setMajorsList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/universities").then((data) => setUniversitiesList(data)).catch(() => {});
  }, []);

  const isCADT = data.university.includes("CADT");

  const photoPreview = data.documents.passportPhoto?.file
    ? URL.createObjectURL(data.documents.passportPhoto.file)
    : null;

  const cadtFaculties = ["Institute of Digital Technology (IDT)"];
  const cadtMajors = {
    "Institute of Digital Technology (IDT)": [
      "Software Engineering",
      "Data Science",
      "e-Commerce",
      "Telecommunications and Networking Engineering (Including Satellite)",
      "Cybersecurity",
    ],
  };

  const serializeDocs = (docs) =>
    Object.fromEntries(
      Object.entries(docs).map(([key, val]) => [
        key,
        val ? { name: val.name, size: val.size, status: "Uploaded" } : null,
      ]),
    );

  const buildEntry = (status) => ({
    id: data.draftId || Date.now(),
    initials: (data.fullName || "NA")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    university: data.university || "Not specified",
    location: data.city || "Not specified",
    major: data.major || "Not specified",
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
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

  const findUniId = (name) => {
    const u = universitiesList.find((u) => u.name === name);
    return u ? u.university_id : null;
  };

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("campuspost_user") || "{}");
      if (user.user_id) return user.user_id;
      const token = localStorage.getItem("campuspost_token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id || null;
      }
    } catch { return null; }
    return null;
  };

  const [scholarshipsList, setScholarshipsList] = useState([]);

  useEffect(() => {
    api.get("/scholarships").then((data) => setScholarshipsList(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!data.university || !universitiesList.length) {
      setMajorsList([]);
      return;
    }
    const uni = universitiesList.find((u) => u.name === data.university);
    if (uni) {
      api.get(`/universities/${uni.university_id}/majors`).then((majors) => setMajorsList(majors)).catch(() => setMajorsList([]));
    }
  }, [data.university, universitiesList]);

  const findScholarshipId = (uniId) => {
    if (!uniId || !scholarshipsList.length) return null;
    const match = scholarshipsList.find((s) => s.university_id === uniId);
    return match ? match.scholarship_id : null;
  };

  const API_BASE = "http://localhost:4000/api";

  const uploadFileToImageKit = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("campuspost_token");
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error("File upload failed");
    const result = await res.json();
    return result.url;
  };

  const buildApiPayload = async () => {
    const uniId = findUniId(data.university);
    const matchedMajor = majorsList.find((m) => m.major_name === data.major);

    const docEntries = Object.entries(data.documents).filter(([, v]) => v);
    const documents = await Promise.all(
      docEntries.map(async ([key, val]) => {
        let fileUrl = val.name || "";
        if (val.file) {
          try {
            fileUrl = await uploadFileToImageKit(val.file);
          } catch (e) {
            console.error("Upload failed for", key, e);
          }
        }
        return { document_type: key, file_url: fileUrl };
      })
    );

    return {
      user_id: getUserId(),
      scholarship_id: findScholarshipId(uniId),
      university_id: uniId || 1,
      major_id: matchedMajor ? matchedMajor.major_id : 1,
      profile: {
        full_name: data.fullName,
        gender: data.gender,
        date_of_birth: data.dateOfBirth,
        email: data.email,
        phone: data.phone,
        parent_number: data.parentPhone,
        city: data.city,
        address: data.address,
      },
      academic: {
        high_school: data.highSchool,
        graduation_year: data.graduationYear,
        gpa: data.gpa || null,
        grade: data.grade,
        study_program: data.studyProgram,
        english_proficiency: data.englishProficiency,
        awards: data.awards,
      },
      documents,
    };
  };

  const handleSaveDraft = async () => {
    if (!localStorage.getItem("campuspost_token")) {
      alert("You need an account to save your draft. Please sign up or login first.");
      navigate("/signup");
      return;
    }
    const drafts = JSON.parse(
      localStorage.getItem("campuspost_drafts") || "[]",
    );
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
    saveDraftToDB(entry.id, { ...data, id: entry.id });

    try {
      const payload = await buildApiPayload();
      let res;
      if (serverAppId) {
        res = await api.put(`/applications/${serverAppId}`, payload);
      } else {
        res = await api.post("/applications", payload);
      }
      setServerAppId(res.application_id);
      setServerRefNo(res.ref_no);
      saveDraftToDB(res.application_id, { ...data, id: res.application_id, draftId: res.application_id });
      setData((prev) => ({ ...prev, draftId: res.application_id, serverAppId: res.application_id }));
    } catch (err) {
      console.error("Failed to save draft to server:", err);
    }

    setTimeout(() => {
      setSaved(false);
      navigate("/my-applications");
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!localStorage.getItem("campuspost_token")) {
      alert("You need an account to submit an application. Please sign up or login first.");
      navigate("/signup");
      return;
    }
    if (!validateStep(5)) return;
    setSubmitting(true);

    try {
      const payload = await buildApiPayload();
      let res;
      if (serverAppId) {
        res = await api.put(`/applications/${serverAppId}`, {
          ...payload,
          admin_status: "pending",
        });
      } else {
        res = await api.post("/applications", {
          ...payload,
          admin_status: "pending",
        });
      }
      setServerAppId(res.application_id);
      setServerRefNo(res.ref_no);

      const drafts = JSON.parse(
        localStorage.getItem("campuspost_drafts") || "[]",
      );
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
    } catch (err) {
      console.error("Submit failed:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to submit application. Please try again.";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const validateStep = (step) => {
    const errs = {};
    switch (step) {
      case 1:
        if (!data.fullName.trim()) errs.fullName = "Full name is required";
        if (!data.gender) errs.gender = "Gender is required";
        if (!data.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
        if (!data.phone.trim()) errs.phone = "Phone number is required";
        if (!data.parentPhone.trim())
          errs.parentPhone = "Parent/Guardian phone number is required";
        if (!data.city.trim()) errs.city = "City is required";
        if (!data.address.trim()) errs.address = "Address is required";
        break;
      case 2:
        if (!data.highSchool.trim())
          errs.highSchool = "High school name is required";
        if (!data.graduationYear)
          errs.graduationYear = "Graduation year is required";
        // GPA is optional
        // Bac II grade — no validation (admin reviews/approves)
        if (!data.studyProgram.trim())
          errs.studyProgram = "Study program is required";
        break;
      case 3:
        if (!data.university) errs.university = "University is required";
        if (!data.faculty.trim()) errs.faculty = "Faculty is required";
        if (!data.major.trim()) errs.major = "Major is required";
        if (!data.degreeLevel) errs.degreeLevel = "Degree level is required";
        break;
      case 4:
        if (!data.documents.nationalId)
          errs.nationalId = "National ID / Passport is required";
        if (!data.documents.transcript)
          errs.transcript = "High school transcript is required";
        if (!data.documents.diploma)
          errs.diploma = "Diploma / Graduation Certificate is required";
        if (!data.documents.passportPhoto)
          errs.passportPhoto = "Photo is required";
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
      case 1:
        return step1();
      case 2:
        return step2();
      case 3:
        return step3();
      case 4:
        return step4();
      case 5:
        return step5();
      case 6:
        return step6();
      default:
        return null;
    }
  };

  const docsList = [
    { key: "nationalId", label: "National ID / Passport" },
    { key: "transcript", label: "High School Transcript" },
    { key: "diploma", label: "Diploma / Graduation Certificate" },
    { key: "passportPhoto", label: "Photo" },
    { key: "englishCert", label: "English Certificate (optional)" },
  ];

  const step1 = () => (
    <div className="card">
      <div className="save-draft-wrap">
        <div>
          <h2 className="card-title">Step 1: Personal Information</h2>
          <p className="card-subtitle">
            Provide your basic personal details to start the application.
          </p>
        </div>
        <button className="btn-save-draft" onClick={handleSaveDraft}>
          {saved ? "Saved!" : "Save Draft"}
        </button>
      </div>
      <div className="form-grid">
        <div
          className="field-full"
          style={{ fontSize: 13, color: "#6E8098", marginBottom: -8 }}
        >
          Fields marked with <span style={{ color: "#E53E3E" }}>*</span> are
          required
        </div>
        <Field label="Full Name" required error={errors.fullName}>
              <input
                className={`input ${errors.fullName ? "input-error" : ""}`}
                placeholder="e.g. Sopheak Vann"
                value={data.fullName}
                onChange={set("fullName")}
              />
            </Field>
        <Field label="Gender" required error={errors.gender}>
          <select
            className={`select ${errors.gender ? "input-error" : ""}`}
            value={data.gender}
            onChange={set("gender")}
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </Field>
        <Field label="Date of Birth" required error={errors.dateOfBirth}>
          <input
            className={`input ${errors.dateOfBirth ? "input-error" : ""}`}
            type="date"
            value={data.dateOfBirth}
            onChange={set("dateOfBirth")}
          />
        </Field>
        <Field label="Email Address" error={errors.email}>
          <input
            className={`input ${errors.email ? "input-error" : ""}`}
            type="email"
            placeholder="sopheak@example.com"
            value={data.email}
            onChange={set("email")}
          />
        </Field>
        <Field label="Phone Number" required error={errors.phone}>
          <input
            className={`input ${errors.phone ? "input-error" : ""}`}
            type="tel"
            placeholder="+855 12 345 678"
            value={data.phone}
            onChange={set("phone")}
          />
        </Field>
        <Field
          label="Parent/Guardian Phone Number"
          required
          error={errors.parentPhone}
        >
          <input
            className={`input ${errors.parentPhone ? "input-error" : ""}`}
            type="tel"
            placeholder="+855 12 345 678"
            value={data.parentPhone}
            onChange={set("parentPhone")}
          />
        </Field>
        <Field
          label="How did you know about us?"
          required
          error={errors.referralSource}
        >
          <select
            className={`select ${errors.referralSource ? "input-error" : ""}`}
            value={data.referralSource}
            onChange={set("referralSource")}
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="Friend / Family">Friend / Family</option>
            <option value="Social Media">Social Media</option>
            <option value="School / Teacher">School / Teacher</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Other">Other</option>
          </select>
        </Field>
        <Field label="City / Province" required error={errors.city}>
          <input
            className={`input ${errors.city ? "input-error" : ""}`}
            placeholder="e.g. Phnom Penh"
            value={data.city}
            onChange={set("city")}
          />
        </Field>
        <Field
          label="Permanent Address"
          fullWidth
          required
          error={errors.address}
        >
          <input
            className={`input ${errors.address ? "input-error" : ""}`}
            placeholder="Street, village, commune, district"
            value={data.address}
            onChange={set("address")}
          />
        </Field>
      </div>
      <div className="actions-nav actions-buttons">
        <button className="btn-secondary" onClick={() => {}}>
          <BackArrow /> Back
        </button>
        <button className="btn-primary" onClick={next}>
          Next Step <Arrow />
        </button>
      </div>
    </div>
  );

  const step2 = () => (
    <div className="card">
      <div className="save-draft-wrap">
        <div>
          <h2 className="card-title">Step 2: Education Information</h2>
          <p className="card-subtitle">
            Tell us about your academic background.
          </p>
        </div>
        <button className="btn-save-draft" onClick={handleSaveDraft}>
          {saved ? "Saved!" : "Save Draft"}
        </button>
      </div>
      <div className="form-grid">
        <Field label="High School Name" fullWidth error={errors.highSchool}>
          <input
            className={`input ${errors.highSchool ? "input-error" : ""}`}
            placeholder="e.g. Paragon International School"
            value={data.highSchool}
            onChange={set("highSchool")}
          />
        </Field>
        <Field label="Graduation Year" error={errors.graduationYear}>
          <select
            className={`select ${errors.graduationYear ? "input-error" : ""}`}
            value={data.graduationYear}
            onChange={set("graduationYear")}
          >
            <option value="" disabled>
              Select year
            </option>
            {["2026", "2025", "2024", "2023", "2022", "2021", "2020"].map(
              (y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ),
            )}
          </select>
        </Field>
        <Field label="GPA / Overall Grade (optional)" error={errors.gpa}>
          <input
            className={`input ${errors.gpa ? "input-error" : ""}`}
            placeholder="e.g. 3.8 / 4.0"
            value={data.gpa}
            onChange={set("gpa")}
          />
        </Field>
        <Field label="Bac II Grade (A, B, or C only)" error={errors.grade}>
          <select
            className={`select ${errors.grade ? "input-error" : ""}`}
            value={data.grade}
            onChange={set("grade")}
          >
            <option value="" disabled>
              Select your grade
            </option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </Field>
        <Field label="Study Program" error={errors.studyProgram}>
          <select
            className={`select ${errors.studyProgram ? "input-error" : ""}`}
            value={data.studyProgram}
            onChange={set("studyProgram")}
          >
            <option value="" disabled>
              Select your study program
            </option>
            <option value="Science">Science</option>
            <option value="Khmer Literature">Khmer Literature</option>
          </select>
        </Field>
        <Field label="English Proficiency (optional)">
          <select
            className="select"
            value={data.englishProficiency}
            onChange={set("englishProficiency")}
          >
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
          <textarea
            className="textarea"
            placeholder="List any academic awards, scholarships, or achievements..."
            value={data.awards}
            onChange={set("awards")}
          />
        </Field>
      </div>
      <div className="actions-nav actions-buttons">
        <button className="btn-secondary" onClick={prev}>
          <BackArrow /> Previous
        </button>
        <button className="btn-primary" onClick={next}>
          Next Step <Arrow />
        </button>
      </div>
    </div>
  );

  const step3 = () => (
    <div className="card">
      <div className="save-draft-wrap">
        <div>
          <h2 className="card-title">Step 3: University Selection</h2>
          <p className="card-subtitle">
            Choose where and what you want to study.
          </p>
        </div>
        <button className="btn-save-draft" onClick={handleSaveDraft}>
          {saved ? "Saved!" : "Save Draft"}
        </button>
      </div>
      <div className="form-grid">
        <Field label="University" fullWidth error={errors.university}>
          <select
            className={`select ${errors.university ? "input-error" : ""}`}
            value={data.university}
            onChange={set("university")}
          >
            <option value="" disabled>
              Select university
            </option>
            {universitiesList.map((u) => (
              <option key={u.university_id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>
        </Field>
        {isCADT ? (
          <>
            <Field label="Faculty" error={errors.faculty}>
              <select
                className={`select ${errors.faculty ? "input-error" : ""}`}
                value={data.faculty}
                onChange={(e) => {
                  setData((prev) => ({
                    ...prev,
                    faculty: e.target.value,
                    major: "",
                  }));
                }}
              >
                <option value="" disabled>
                  Select faculty
                </option>
                {cadtFaculties.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Major" error={errors.major}>
              <select
                className={`select ${errors.major ? "input-error" : ""}`}
                value={data.major}
                onChange={set("major")}
              >
                <option value="" disabled>
                  Select major
                </option>
                {data.faculty &&
                  cadtMajors[data.faculty]?.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
              </select>
            </Field>
          </>
        ) : (
          <>
            <Field label="Faculty" error={errors.faculty}>
              <input
                className={`input ${errors.faculty ? "input-error" : ""}`}
                placeholder="e.g. Computer Science"
                value={data.faculty}
                onChange={set("faculty")}
              />
            </Field>
            <Field label="Major" error={errors.major}>
              <select
                className={`select ${errors.major ? "input-error" : ""}`}
                value={data.major}
                onChange={set("major")}
              >
                <option value="" disabled>
                  Select major
                </option>
                {majorsList.map((m) => (
                  <option key={m.major_id} value={m.major_name}>
                    {m.major_name}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}
        <Field label="Degree Level" error={errors.degreeLevel}>
          <select
            className={`select ${errors.degreeLevel ? "input-error" : ""}`}
            value={data.degreeLevel}
            onChange={set("degreeLevel")}
          >
            <option value="" disabled>
              Select level
            </option>
            <option value="Bachelor's">Bachelor's</option>
            <option value="Master's">Master's</option>
            <option value="PhD">PhD</option>
            <option value="Associate">Associate</option>
          </select>
        </Field>
        <Field label="Intake Year">
          <select
            className="select"
            value={data.intakeYear}
            onChange={set("intakeYear")}
          >
            {["2026", "2027", "2028"].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Study Mode">
          {isCADT ? (
            <input
              className="select"
              value="Full-time"
              disabled
              style={{ background: "#f1f5f9" }}
            />
          ) : (
            <select
              className="select"
              value={data.studyMode}
              onChange={set("studyMode")}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          )}
        </Field>
        <Field label="Compare with another university (optional)" fullWidth>
          <select
            className="select"
            value={data.compareUniversity}
            onChange={set("compareUniversity")}
          >
            <option value="">None</option>
            {universitiesList.map((u) => (
              <option key={u.university_id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="actions-nav actions-buttons">
        <button className="btn-secondary" onClick={prev}>
          <BackArrow /> Previous
        </button>
        <button className="btn-primary" onClick={next}>
          Next Step <Arrow />
        </button>
      </div>
    </div>
  );

  const step4 = () => (
    <div className="card">
      <div className="save-draft-wrap">
        <div>
          <h2 className="card-title">Step 4: Document Upload</h2>
          <p className="card-subtitle">
            Upload the required documents for your application.
          </p>
        </div>
        <button className="btn-save-draft" onClick={handleSaveDraft}>
          {saved ? "Saved!" : "Save Draft"}
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {docsList.map((doc) => {
          const file = data.documents[doc.key];
          return (
            <div key={doc.key} className="upload-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <DocumentIcon />
                <div>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: "#243B5A" }}
                  >
                    {doc.label}
                  </div>
                  {file && (
                    <div
                      style={{ fontSize: 11, color: "#6E8098", marginTop: 2 }}
                    >
                      {file.name} &middot; {file.size}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {file ? (
                  <span
                    style={{ fontSize: 12, color: "#16A34A", fontWeight: 600 }}
                  >
                    Uploaded
                  </span>
                ) : (
                  <>
                    <input
                      type="file"
                      ref={(el) => (fileInputRefs.current[doc.key] = el)}
                      onChange={handleFileUpload(doc.key)}
                      style={{ display: "none" }}
                      accept={
                        doc.key === "passportPhoto"
                          ? "image/*"
                          : ".pdf,.doc,.docx,.jpg,.png"
                      }
                    />
                    <button
                      className="upload-btn"
                      onClick={() => triggerFileInput(doc.key)}
                    >
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
        <button className="btn-secondary" onClick={prev}>
          <BackArrow /> Previous
        </button>
        <button className="btn-primary" onClick={next}>
          Next Step <Arrow />
        </button>
      </div>
    </div>
  );

  const step5 = () => (
    <div className="card">
      <div className="save-draft-wrap">
        <div>
          <h2 className="card-title">Step 5: Review & Submit</h2>
          <p className="card-subtitle">
            Verify all information before submitting your application.
          </p>
        </div>
        <button className="btn-save-draft" onClick={handleSaveDraft}>
          {saved ? "Saved!" : "Save Draft"}
        </button>
      </div>

      <div className="review-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#0C1A3C",
              margin: 0,
            }}
          >
            Personal Information
          </h3>
          <button className="edit-btn" onClick={() => goTo(1)}>
            Edit
          </button>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#0C1A3C",
              margin: 0,
            }}
          >
            Education
          </h3>
          <button className="edit-btn" onClick={() => goTo(2)}>
            Edit
          </button>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#0C1A3C",
              margin: 0,
            }}
          >
            University Selection
          </h3>
          <button className="edit-btn" onClick={() => goTo(3)}>
            Edit
          </button>
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#0C1A3C",
              margin: 0,
            }}
          >
            Documents
          </h3>
          <button className="edit-btn" onClick={() => goTo(4)}>
            Edit
          </button>
        </div>
        {docsList.map((doc) => (
          <div
            key={doc.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 0",
              fontSize: 13,
            }}
          >
            {data.documents[doc.key] ? (
              <CheckCircle />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="8" fill="#E8EDF5" />
                <circle cx="9" cy="9" r="3" fill="#CBD5E1" />
              </svg>
            )}
            <span
              style={{ color: data.documents[doc.key] ? "#16A34A" : "#6E8098" }}
            >
              {doc.label}
            </span>
          </div>
        ))}
      </div>

      <div className="confirm-wrap">
        <input
          type="checkbox"
          className="checkbox"
          checked={data.confirmed}
          onChange={(e) =>
            setData((prev) => ({ ...prev, confirmed: e.target.checked }))
          }
        />
        <span style={{ fontSize: 13, color: "#243B5A" }}>
          I confirm that all information provided is accurate.
        </span>
      </div>

      <div className="actions-nav actions-buttons">
        <button className="btn-secondary" onClick={prev}>
          <BackArrow /> Previous
        </button>
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
            <path
              d="M7.5 12.5L10.5 15.5L16.5 9"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="success-title">Application Submitted Successfully</h2>
        <p className="success-text">
          Thank you for applying through CampusPost.
          <br />
          Your application has been submitted successfully.
        </p>

        <div className="success-grid">
          <div className="success-card">
            <div className="success-card-title">Application ID</div>
            <div className="success-card-value">#{serverRefNo || data.ref_no || "Pending"}</div>
          </div>
          <div className="success-card">
            <div className="success-card-title">Submitted On</div>
            <div className="success-card-value">
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              {new Date().toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          <div className="success-card">
            <div className="success-card-title">Application Status</div>
            <div className="success-card-value" style={{ color: "#16A34A" }}>
              Submitted
            </div>
          </div>
          <div className="success-card" style={{ gridColumn: "1 / -1" }}>
            <div className="success-card-title">University</div>
            <div className="success-card-value">
              {data.university || "Not specified"}
            </div>
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
          <button
            className="btn-primary"
            onClick={() => navigate("/my-applications")}
          >
            View My Applications
          </button>
          <button className="btn-secondary">Return to Dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout activePage="My Applications">
      <div className="page">
        <div className="bg-deco" />
        <div className="bg-deco2" />

        {step < 6 && (
          <div className="main main-padding">
            <button
              onClick={() => navigate('/scholarships')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10,
                color: '#334155', cursor: 'pointer', padding: '12px 20px',
                fontWeight: 600, marginBottom: 20, fontSize: 16,
              }}
            >
              <BackArrow /> Back
            </button>

            <div className="header-section">
              <h1 className="title">2026 Academic Enrollment</h1>
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
            <div style={{ maxWidth: 680, margin: "0 auto" }}>{renderStep()}</div>
          </div>
        )}
      </div>
    </Layout>
  );
}
