import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import About from "./pages/about.jsx";
import Universities from "./pages/universities.jsx";
import UniversityDetail from "./pages/university-detail.jsx";
import Scholarships from "./pages/scholarships.jsx";
import ScholarshipDetail from "./pages/scholarship-detail.jsx";
// import Forum from "./pages/forum.jsx";
import ApplicationDashboard from "./pages/application";
import MyApplications from "./pages/myapplications";
import ApplicationDetail from "./pages/application-detail";
import Profile from "./pages/profile.jsx";
import StaffPage from "./pages/staff.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import SystemAdmin from "./pages/system-admin.jsx";
import UniversityAdmin from "./pages/university-admin.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/universities" element={<Universities />} />
        <Route path="/universities/:id" element={<UniversityDetail />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/scholarships/:id" element={<ScholarshipDetail />} />
        {/* <Route path="/forum" element={<Forum />} /> */}
        <Route path="/application" element={<ApplicationDashboard />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/application/:id" element={<ApplicationDetail />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute><StaffPage /></ProtectedRoute>} />
        <Route path="/system-admin/*" element={<SystemAdmin />} />
        <Route path="/admin/*" element={<SystemAdmin />} />
        <Route path="/university-admin/*" element={<UniversityAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}