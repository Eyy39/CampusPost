import React from "react";
import "./ProgressStepper.css";

const stepsMeta = [
  { label: "Personal Information" },
  { label: "Education" },
  { label: "University Selection" },
  { label: "Documents" },
  { label: "Review & Submit" },
];

export default function ProgressStepper({ currentStep }) {
  return (
    <div className="stepper stepper-responsive">
      {stepsMeta.map((step, i) => {
        const stepNum = i + 1;
        const active = stepNum === currentStep;
        const completed = stepNum < currentStep;
        return (
          <React.Fragment key={step.label}>
            <div className="step-item">
              <div className={`step-circle ${active ? "step-circle-active" : ""} ${completed ? "step-circle-completed" : ""}`}>
                {completed ? "\u2713" : stepNum}
              </div>
              <span className={`step-label ${active ? "step-label-active" : ""} ${completed ? "step-label-completed" : ""}`}>{step.label}</span>
            </div>
            {i < stepsMeta.length - 1 && (
              <div className={completed ? "step-connector step-connector-active" : "step-connector"} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
