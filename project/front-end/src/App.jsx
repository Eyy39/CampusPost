import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Universities from "./pages/universities.jsx";
import ApplicationDashboard from "./pages/application";
import MyApplications from "./pages/myapplications";
import ApplicationDetail from "./pages/application-detail";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/universities" element={<Universities />} />
        <Route path="/application" element={<ApplicationDashboard />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/application/:id" element={<ApplicationDetail />} />
      </Routes>
    </BrowserRouter>
  );
}