"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import "./exit-form.css";

interface ExitFormData {
  beneficiaryFullName: string;
  beneficiaryRegistrationNumber: string;
  gender: "Male" | "Female";
  dateOfBirth: string;
  school: string;
  classLevel: string;
  district: string;

  parentGuardianName: string;
  parentGuardianContact: string;
  parentGuardianEmail: string;
  caretakerMentor: string;

  dateOfExit: string;
  exitReasons: string[];
  otherExitReason: string;

  dismissalReasons: string[];
  otherDismissalReason: string;

  previousDisciplinaryActions: string[];
  disciplinaryDatesOutcomes: string;

  committeeDecision: string;
  committeeReason: string;

  beneficiaryDeclarationName: string;

  propertyIdentityCard: boolean;
  propertyFoundationUniform: boolean;
  propertyBooksMaterials: boolean;
  propertyElectronicDevices: boolean;
  propertyOther: string;

  propertyVerifiedBy: string;

  foundationRepresentativeName: string;
  foundationRepresentativePosition: string;

  witnessName: string;
  witnessPositionRelationship: string;
}

const initialForm: ExitFormData = {
  beneficiaryFullName: "",
  beneficiaryRegistrationNumber: "",
  gender: "Male",
  dateOfBirth: "",
  school: "",
  classLevel: "",
  district: "",

  parentGuardianName: "",
  parentGuardianContact: "",
  parentGuardianEmail: "",
  caretakerMentor: "",

  dateOfExit: "",
  exitReasons: [],
  otherExitReason: "",

  dismissalReasons: [],
  otherDismissalReason: "",

  previousDisciplinaryActions: [],
  disciplinaryDatesOutcomes: "",

  committeeDecision: "",
  committeeReason: "",

  beneficiaryDeclarationName: "",

  propertyIdentityCard: false,
  propertyFoundationUniform: false,
  propertyBooksMaterials: false,
  propertyElectronicDevices: false,
  propertyOther: "",

  propertyVerifiedBy: "",

  foundationRepresentativeName: "",
  foundationRepresentativePosition: "",

  witnessName: "",
  witnessPositionRelationship: "",
};

const exitReasonOptions = [
  "Completed education successfully",
  "Family financial situation significantly improved",
  "Voluntary withdrawal by beneficiary",
  "Voluntary withdrawal by parent/guardian",
  "Relocated to another area/country",
  "Joined another sponsorship programme",
  "Long-term loss of contact",
  "Medical circumstances",
  "Death",
  "Dismissal for violation of Foundation Code of Conduct",
  "Other",
];

const dismissalReasonOptions = [
  "Violation of Foundation Code of Conduct",
  "Repeated disciplinary violations",
  "Misuse of Foundation resources",
  "Serious misconduct",
  "Other",
];

const disciplinaryOptions = [
  "Verbal warning",
  "Written warning",
  "Parent/Guardian meeting",
  "Suspension",
  "Other",
];

export default function BeneficiaryExitPage() {
  const [form, setForm] = useState<ExitFormData>(initialForm);

  const [exitId, setExitId] = useState<string | null>(null);

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [emailVerified, setEmailVerified] = useState(false);

  const [finalized, setFinalized] = useState(false);

  // =========================================================
  // UPDATE FIELD
  // =========================================================

  const updateField = <K extends keyof ExitFormData>(
    field: K,
    value: ExitFormData[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =========================================================
  // TOGGLE CHECKBOX
  // =========================================================

  const toggleArrayValue = (
    field:
      | "exitReasons"
      | "dismissalReasons"
      | "previousDisciplinaryActions",
    value: string
  ) => {
    setForm((previous) => {
      const current = previous[field];

      if (current.includes(value)) {
        return {
          ...previous,
          [field]: current.filter((item) => item !== value),
        };
      }

      return {
        ...previous,
        [field]: [...current, value],
      };
    });
  };

  // =========================================================
  // EMAIL VALIDATION
  // =========================================================

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email.trim());
  };

  // =========================================================
  // SAVE EXIT
  // =========================================================

  const saveExit = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const email = form.parentGuardianEmail.trim();

      if (!email) {
        setError("Parent/Guardian email is required.");
        return null;
      }

      if (!validateEmail(email)) {
        setError(
          "Please enter a valid Parent/Guardian email address."
        );
        return null;
      }

      const formToSave = {
        ...form,
        parentGuardianEmail: email,
        exitId,
      };

      const response = await fetch("/api/exits/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formToSave),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to save the form."
        );
      }

      const savedExitId = result?.data?.id;

      if (!savedExitId) {
        throw new Error(
          "Exit form was saved, but no exit ID was returned."
        );
      }

      setExitId(savedExitId);

      if (result.data.guardianEmailVerified) {
        setEmailVerified(true);
      }

      setMessage(
        exitId
          ? "Beneficiary exit form updated successfully."
          : "Beneficiary exit form saved successfully."
      );

      return savedExitId as string;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SEND VERIFICATION CODE
  // =========================================================

  const sendVerificationCode = async () => {
    setError("");
    setMessage("");

    const email = form.parentGuardianEmail.trim();

    if (!email) {
      setError(
        "Please enter the Parent/Guardian email address."
      );
      return;
    }

    if (!validateEmail(email)) {
      setError(
        "Please enter a valid email address, for example: parent@gmail.com"
      );
      return;
    }

    let currentExitId = exitId;

    if (!currentExitId) {
      currentExitId = await saveExit();
    }

    if (!currentExitId) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/exits/send-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exitId: currentExitId,
            email,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to send verification code."
        );
      }

      setMessage(
        `Verification code has been sent to ${email}.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // VERIFY OTP
  // =========================================================

  const verifyCode = async () => {
    setError("");
    setMessage("");

    if (!exitId) {
      setError(
        "Please save the exit form first."
      );
      return;
    }

    if (!otp) {
      setError(
        "Please enter the verification code."
      );
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError(
        "Please enter the 6-digit verification code."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/exits/verify-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exitId,
            code: otp,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Verification failed."
        );
      }

      setEmailVerified(true);
      setOtp("");

      setMessage(
        "Parent/Guardian email verified successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FINALIZE EXIT
  // =========================================================

  const finalizeExit = async () => {
    setError("");
    setMessage("");

    if (!exitId) {
      setError(
        "Please save the exit form first."
      );
      return;
    }

    if (!emailVerified) {
      setError(
        "Please verify the Parent/Guardian email before finalizing the exit."
      );
      return;
    }

    if (
      !form.foundationRepresentativeName.trim()
    ) {
      setError(
        "Foundation representative name is required."
      );
      return;
    }

    if (
      !form.foundationRepresentativePosition.trim()
    ) {
      setError(
        "Foundation representative position is required."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/exits/finalize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exitId,

            foundationRepresentativeName:
              form.foundationRepresentativeName,

            foundationRepresentativePosition:
              form.foundationRepresentativePosition,

            witnessName:
              form.witnessName,

            witnessPositionRelationship:
              form.witnessPositionRelationship,

            propertyVerifiedBy:
              form.propertyVerifiedBy,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to finalize exit."
        );
      }

      setFinalized(true);

      setMessage(
        "Beneficiary exit finalized successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to finalize exit."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FORM SUBMIT
  // =========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    await saveExit();
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="exit-page">
      <div className="exit-container">

        {/* PAGE TITLE */}

        <div className="page-title">

          <Link
            href="/exitFormByPdf?download=1"
            className="paper-form-button"
            onClick={() => {
              window.localStorage.setItem(
                "exit-form-pdf-data",
                JSON.stringify(form)
              );
            }}
          >
            Download Form in PDF to Sign by Hand
          </Link>

          <h1>Beneficiary Exit Form</h1>

          <p>
            Complete the form below to process a
            beneficiary exit.
          </p>

        </div>

        {/* MESSAGES */}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* =================================================
              PART A
          ================================================= */}

          <section className="form-section">

            <div className="section-number">
              A
            </div>

            <div className="section-content">

              <h2>
                Beneficiary Identification
              </h2>

              <div className="form-grid">

                <label>
                  Full Name *
                  <input
                    type="text"
                    value={
                      form.beneficiaryFullName
                    }
                    onChange={(e) =>
                      updateField(
                        "beneficiaryFullName",
                        e.target.value
                      )
                    }
                    required
                  />
                </label>

                <label>
                  Registration Number *
                  <input
                    type="text"
                    value={
                      form.beneficiaryRegistrationNumber
                    }
                    onChange={(e) =>
                      updateField(
                        "beneficiaryRegistrationNumber",
                        e.target.value
                      )
                    }
                    required
                  />
                </label>

                <label>
                  Gender *
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      updateField(
                        "gender",
                        e.target.value as
                          | "Male"
                          | "Female"
                      )
                    }
                  >
                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>
                  </select>
                </label>

                <label>
                  Date of Birth *
                  <input
                    type="date"
                    value={
                      form.dateOfBirth
                    }
                    onChange={(e) =>
                      updateField(
                        "dateOfBirth",
                        e.target.value
                      )
                    }
                    required
                  />
                </label>

                <label>
                  School *
                  <input
                    type="text"
                    value={form.school}
                    onChange={(e) =>
                      updateField(
                        "school",
                        e.target.value
                      )
                    }
                    required
                  />
                </label>

                <label>
                  Class / Level *
                  <input
                    type="text"
                    value={
                      form.classLevel
                    }
                    onChange={(e) =>
                      updateField(
                        "classLevel",
                        e.target.value
                      )
                    }
                    required
                  />
                </label>

                <label>
                  District *
                  <input
                    type="text"
                    value={form.district}
                    onChange={(e) =>
                      updateField(
                        "district",
                        e.target.value
                      )
                    }
                    required
                  />
                </label>

                <label>
                  Parent / Guardian Name *
                  <input
                    type="text"
                    value={
                      form.parentGuardianName
                    }
                    onChange={(e) =>
                      updateField(
                        "parentGuardianName",
                        e.target.value
                      )
                    }
                    required
                  />
                </label>

                <label>
                  Parent / Guardian Contact *
                  <input
                    type="tel"
                    value={
                      form.parentGuardianContact
                    }
                    onChange={(e) =>
                      updateField(
                        "parentGuardianContact",
                        e.target.value
                      )
                    }
                    required
                  />
                </label>

                <label>
                  Parent / Guardian Email *
                  <input
                    type="email"
                    value={
                      form.parentGuardianEmail
                    }
                    onChange={(e) => {
                      updateField(
                        "parentGuardianEmail",
                        e.target.value
                      );

                      if (emailVerified) {
                        setEmailVerified(false);
                        setOtp("");
                      }
                    }}
                    placeholder="example@gmail.com"
                    autoComplete="email"
                    spellCheck={false}
                    required
                  />
                </label>

                <label>
                  Caretaker / Mentor *
                  <input
                    type="text"
                    value={
                      form.caretakerMentor
                    }
                    onChange={(e) =>
                      updateField(
                        "caretakerMentor",
                        e.target.value
                      )
                    }
                    required
                  />
                </label>

              </div>
            </div>
          </section>

          {/* =================================================
              PART B
          ================================================= */}

          <section className="form-section">

            <div className="section-number">
              B
            </div>

            <div className="section-content">

              <h2>Reason for Exit</h2>

              <label>
                Date of Exit *
                <input
                  type="date"
                  value={form.dateOfExit}
                  onChange={(e) =>
                    updateField(
                      "dateOfExit",
                      e.target.value
                    )
                  }
                  required
                />
              </label>

              <h3>Select reason(s)</h3>

              <div className="checkbox-group">

                {exitReasonOptions.map(
                  (reason) => (
                    <label
                      key={reason}
                      className="checkbox-label"
                    >
                      <input
                        type="checkbox"
                        checked={form.exitReasons.includes(
                          reason
                        )}
                        onChange={() =>
                          toggleArrayValue(
                            "exitReasons",
                            reason
                          )
                        }
                      />

                      <span>
                        {reason}
                      </span>
                    </label>
                  )
                )}

              </div>

              {form.exitReasons.includes(
                "Other"
              ) && (
                <label>
                  Other Exit Reason
                  <textarea
                    value={
                      form.otherExitReason
                    }
                    onChange={(e) =>
                      updateField(
                        "otherExitReason",
                        e.target.value
                      )
                    }
                  />
                </label>
              )}

            </div>
          </section>

          {/* =================================================
              PART C
          ================================================= */}

          <section className="form-section">

            <div className="section-number">
              C
            </div>

            <div className="section-content">

              <h2>
                Dismissal Reasons
              </h2>

              <p className="helper-text">
                Complete this section only if
                dismissal applies.
              </p>

              <div className="checkbox-group">

                {dismissalReasonOptions.map(
                  (reason) => (
                    <label
                      key={reason}
                      className="checkbox-label"
                    >
                      <input
                        type="checkbox"
                        checked={form.dismissalReasons.includes(
                          reason
                        )}
                        onChange={() =>
                          toggleArrayValue(
                            "dismissalReasons",
                            reason
                          )
                        }
                      />

                      <span>
                        {reason}
                      </span>
                    </label>
                  )
                )}

              </div>

              {form.dismissalReasons.includes(
                "Other"
              ) && (
                <label>
                  Other Dismissal Reason
                  <textarea
                    value={
                      form.otherDismissalReason
                    }
                    onChange={(e) =>
                      updateField(
                        "otherDismissalReason",
                        e.target.value
                      )
                    }
                  />
                </label>
              )}

            </div>
          </section>

          {/* =================================================
              PART D
          ================================================= */}

          <section className="form-section">

            <div className="section-number">
              D
            </div>

            <div className="section-content">

              <h2>
                Previous Disciplinary Actions
              </h2>

              <div className="checkbox-group">

                {disciplinaryOptions.map(
                  (action) => (
                    <label
                      key={action}
                      className="checkbox-label"
                    >
                      <input
                        type="checkbox"
                        checked={form.previousDisciplinaryActions.includes(
                          action
                        )}
                        onChange={() =>
                          toggleArrayValue(
                            "previousDisciplinaryActions",
                            action
                          )
                        }
                      />

                      <span>
                        {action}
                      </span>
                    </label>
                  )
                )}

              </div>

              <label>
                Dates and Outcomes

                <textarea
                  value={
                    form.disciplinaryDatesOutcomes
                  }
                  onChange={(e) =>
                    updateField(
                      "disciplinaryDatesOutcomes",
                      e.target.value
                    )
                  }
                  placeholder="Record relevant dates and outcomes..."
                />
              </label>

            </div>
          </section>

          {/* =================================================
              PART E
          ================================================= */}

          <section className="form-section">

            <div className="section-number">
              E
            </div>

            <div className="section-content">

              <h2>
                Committee Decision
              </h2>

              <label>
                Committee Decision

                <textarea
                  value={
                    form.committeeDecision
                  }
                  onChange={(e) =>
                    updateField(
                      "committeeDecision",
                      e.target.value
                    )
                  }
                  placeholder="Enter the committee decision..."
                />
              </label>

              <label>
                Reason / Explanation

                <textarea
                  value={
                    form.committeeReason
                  }
                  onChange={(e) =>
                    updateField(
                      "committeeReason",
                      e.target.value
                    )
                  }
                  placeholder="Provide the reason or explanation..."
                />
              </label>

            </div>
          </section>

          {/* =================================================
              PART F
          ================================================= */}

          <section className="form-section">

            <div className="section-number">
              F
            </div>

            <div className="section-content">

              <h2>
                Declaration and Verification
              </h2>

              <label>
                Beneficiary Declaration Name

                <input
                  type="text"
                  value={
                    form.beneficiaryDeclarationName
                  }
                  onChange={(e) =>
                    updateField(
                      "beneficiaryDeclarationName",
                      e.target.value
                    )
                  }
                />
              </label>

              {/* EMAIL VERIFICATION */}

              <div className="verification-box">

                <div className="verification-header">

                  <h3>
                    Parent / Guardian Email
                    Verification
                  </h3>

                  <span className="verification-badge">
                    {emailVerified
                      ? "VERIFIED"
                      : "OTP"}
                  </span>

                </div>

                <p>
                  A six-digit verification
                  code will be sent to the
                  Parent/Guardian email
                  address entered in Part A.
                </p>

                <div className="email-display">
                  {form.parentGuardianEmail.trim()
                    ? form.parentGuardianEmail
                    : "Enter parent/guardian email first"}
                </div>

                {emailVerified && (
                  <div className="verified-message">
                    ✓ Email address verified
                    successfully.
                  </div>
                )}

                <button
                  type="button"
                  onClick={
                    sendVerificationCode
                  }
                  disabled={
                    loading ||
                    !form.parentGuardianEmail.trim() ||
                    emailVerified ||
                    finalized
                  }
                  className="secondary-button"
                >
                  {loading
                    ? "Sending..."
                    : emailVerified
                    ? "Email Verified"
                    : "Send Verification Code"}
                </button>

                <div className="otp-container">

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      const value =
                        e.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setOtp(value);
                    }}
                    placeholder="000000"
                    autoComplete="one-time-code"
                    disabled={
                      loading ||
                      emailVerified ||
                      finalized
                    }
                  />

                  <button
                    type="button"
                    onClick={verifyCode}
                    disabled={
                      loading ||
                      otp.length !== 6 ||
                      emailVerified ||
                      finalized
                    }
                  >
                    {emailVerified
                      ? "Verified"
                      : "Verify Code"}
                  </button>

                </div>
              </div>

              {/* FOUNDATION REPRESENTATIVE */}

              <div className="form-grid">

                <label>
                  Foundation Representative *

                  <input
                    type="text"
                    value={
                      form.foundationRepresentativeName
                    }
                    onChange={(e) =>
                      updateField(
                        "foundationRepresentativeName",
                        e.target.value
                      )
                    }
                    required
                  />
                </label>

                <label>
                  Representative Position *

                  <input
                    type="text"
                    value={
                      form.foundationRepresentativePosition
                    }
                    onChange={(e) =>
                      updateField(
                        "foundationRepresentativePosition",
                        e.target.value
                      )
                    }
                    required
                  />
                </label>

                <label>
                  Witness Name

                  <input
                    type="text"
                    value={form.witnessName}
                    onChange={(e) =>
                      updateField(
                        "witnessName",
                        e.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Witness Position / Relationship

                  <input
                    type="text"
                    value={
                      form.witnessPositionRelationship
                    }
                    onChange={(e) =>
                      updateField(
                        "witnessPositionRelationship",
                        e.target.value
                      )
                    }
                  />
                </label>

              </div>

            </div>
          </section>

          {/* =================================================
              PART G
          ================================================= */}

          <section className="form-section">

            <div className="section-number">
              G
            </div>

            <div className="section-content">

              <h2>
                Property Return Checklist
              </h2>

              <div className="checkbox-group">

                <label className="checkbox-label">

                  <input
                    type="checkbox"
                    checked={
                      form.propertyIdentityCard
                    }
                    onChange={(e) =>
                      updateField(
                        "propertyIdentityCard",
                        e.target.checked
                      )
                    }
                  />

                  <span>
                    Identity Card
                  </span>

                </label>

                <label className="checkbox-label">

                  <input
                    type="checkbox"
                    checked={
                      form.propertyFoundationUniform
                    }
                    onChange={(e) =>
                      updateField(
                        "propertyFoundationUniform",
                        e.target.checked
                      )
                    }
                  />

                  <span>
                    Foundation Uniform
                  </span>

                </label>

                <label className="checkbox-label">

                  <input
                    type="checkbox"
                    checked={
                      form.propertyBooksMaterials
                    }
                    onChange={(e) =>
                      updateField(
                        "propertyBooksMaterials",
                        e.target.checked
                      )
                    }
                  />

                  <span>
                    Books / Learning Materials
                  </span>

                </label>

                <label className="checkbox-label">

                  <input
                    type="checkbox"
                    checked={
                      form.propertyElectronicDevices
                    }
                    onChange={(e) =>
                      updateField(
                        "propertyElectronicDevices",
                        e.target.checked
                      )
                    }
                  />

                  <span>
                    Electronic Devices
                  </span>

                </label>

              </div>

              <label>
                Other Property

                <textarea
                  value={
                    form.propertyOther
                  }
                  onChange={(e) =>
                    updateField(
                      "propertyOther",
                      e.target.value
                    )
                  }
                  placeholder="Describe any other Foundation property..."
                />
              </label>

              <label>
                Property Verified By

                <input
                  type="text"
                  value={
                    form.propertyVerifiedBy
                  }
                  onChange={(e) =>
                    updateField(
                      "propertyVerifiedBy",
                      e.target.value
                    )
                  }
                />
              </label>

            </div>
          </section>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="form-actions">

            <button
              type="submit"
              disabled={
                loading || finalized
              }
              className="save-button"
            >
              {loading
                ? "Saving..."
                : "Save Exit Form"}
            </button>

            <button
              type="button"
              disabled={
                loading ||
                !exitId ||
                !emailVerified ||
                finalized
              }
              onClick={finalizeExit}
              className="finalize-button"
            >
              {finalized
                ? "Exit Finalized"
                : loading
                ? "Processing..."
                : "Finalize Exit"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}