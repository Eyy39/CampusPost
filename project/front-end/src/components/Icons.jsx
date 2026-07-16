import React from "react";

export function LogoIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Graduation Cap */}
      <path d="M16 4L4 10L16 16L28 10L16 4Z" fill="#fff" />
      <path d="M7 12V20C7 20 10 24 16 24C22 24 25 20 25 20V12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 10V20" stroke="#8BB8F0" strokeWidth="1.5" strokeLinecap="round" />
      {/* Open Book */}
      <path d="M6 22C6 22 9 20 16 20C23 20 26 22 26 22" stroke="#8BB8F0" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 25C6 25 9 23 16 23C23 23 26 25 26 25" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="20" x2="16" y2="25" stroke="#8BB8F0" strokeWidth="1.5" />
    </svg>
  );
}

export function DocumentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="#6E8098" strokeWidth="1.2" />
      <path d="M4.5 4.5H9.5" stroke="#6E8098" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M4.5 7H9.5" stroke="#6E8098" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M4.5 9.5H7.5" stroke="#6E8098" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 11V3M8 3L5 6M8 3L11 6" stroke="#0C1A3C" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12V13.5C2 14.328 2.672 15 3.5 15H12.5C13.328 15 14 14.328 14 13.5V12" stroke="#0C1A3C" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function CheckCircle() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" fill="#16A34A" />
      <path d="M5.5 9.5L7.5 11.5L12.5 6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h12M4 8h8M7 12h2" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

export function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3L9 7L5 11" />
    </svg>
  );
}

export function BackArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3L5 7L9 11" />
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export function DangerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
