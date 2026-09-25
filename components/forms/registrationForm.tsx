"use client";

import { FormEvent, useState } from "react";
import "./registration-form.css";

interface RegistrationFormData {
  registrationNumber: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  nationalId: string;

  school: string;
  classLevel: string;
  educationLevel: string;

  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;

  parentGuardianName: string;
  parentGuardianContact: string;
  parentGuardianEmail: string;
  parentGuardianAddress: string;

  caretakerMentor: string;
  sponsorshipStartDate: string;
  sponsorshipType: string;

  orphanStatus: string;
  livingArrangement: string;
  specialNeeds: string;
  healthInformation: string;

  dateOfRegistration: string;
  registeredBy: string;
  notes: string;
}

const initialForm: RegistrationFormData = {
  registrationNumber: "",
  fullName: "",
  gender: "",
  dateOfBirth: "",
  nationalId: "",

  school: "",
  classLevel: "",
  educationLevel: "",

  province: "",
  district: "",
  sector: "",
  cell: "",
  village: "",

  parentGuardianName: "",
  parentGuardianContact: "",
  parentGuardianEmail: "",
  parentGuardianAddress: "",

  caretakerMentor: "",
  sponsorshipStartDate: "",
  sponsorshipType: "",

  orphanStatus: "",
  livingArrangement: "",
  specialNeeds: "",
  healthInformation: "",

  dateOfRegistration: "",
  registeredBy: "",
  notes: "",
};

export default function BeneficiaryRegistrationPage() {
  const [formData, setFormData] =
    useState<RegistrationFormData>(initialForm);

  const [photoFile, setPhotoFile] =
    useState<File | null>(null);

  const [photoPreview, setPhotoPreview] =
    useState<string>("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  function updateField(
    field: keyof RegistrationFormData,
    value: string
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  /* =========================
     PHOTO UPLOAD
  ========================== */

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      setPhotoFile(null);
      setPhotoPreview("");
      return;
    }

    /* Check file type */

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    /* Maximum 5MB */

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Photo size must not exceed 5MB."
      );

      event.target.value = "";
      return;
    }

    setError("");
    setPhotoFile(file);

    /* Create preview */

    const previewUrl =
      URL.createObjectURL(file);

    setPhotoPreview(previewUrl);
  }

  /* =========================
     SUBMIT
  ========================== */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      /* Require photo */

      if (!photoFile) {
        throw new Error(
          "Please upload the beneficiary's photo."
        );
      }

      /*
       * FormData allows us to send
       * text fields + image file.
       */

      const data = new FormData();

      /* Add all form fields */

      Object.entries(formData).forEach(
        ([key, value]) => {
          data.append(
            key,
            value
          );
        }
      );

      /* Add photo */

      data.append(
        "photo",
        photoFile
      );

      const response =
        await fetch(
          "/api/beneficiaries/create",
          {
            method: "POST",

            /*
             * IMPORTANT:
             * Do NOT set Content-Type manually.
             * Browser will automatically set:
             * multipart/form-data + boundary
             */

            body: data,
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Registration failed."
        );
      }

      setMessage(
        `Beneficiary registered successfully. Registration Number: ${result.data.registrationNumber}`
      );

      /* Reset form */

      setFormData(initialForm);

      setPhotoFile(null);
      setPhotoPreview("");

      /*
       * Reset file input
       */

      const fileInput =
        document.getElementById(
          "beneficiary-photo"
        ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="registration-page">
      <div className="registration-container">

        {/* PAGE TITLE */}

        <div className="page-title">
          <h1>
            Child / Beneficiary Registration Form
          </h1>

          <p>
            Complete the form below to register
            a new beneficiary
          </p>
        </div>

        {/* SUCCESS */}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
        >

          {/* ================= PART A ================= */}

          <section className="form-section">

            <div className="section-title">
              <span>1</span>

              <div>
                <h2>
                  Child Identification
                </h2>

                <p>
                  Basic information about the beneficiary.
                </p>
              </div>
            </div>

            <div className="form-grid">

              {/* Registration Number */}

              <div className="form-group">
                <label>
                  Registration Number *
                </label>

                <input
                  type="text"
                  value={
                    formData.registrationNumber
                  }
                  onChange={(e) =>
                    updateField(
                      "registrationNumber",
                      e.target.value
                    )
                  }
                  placeholder="e.g. NBF-2026-0001"
                  required
                />
              </div>

              {/* Full Name */}

              <div className="form-group">
                <label>
                  Full Name *
                </label>

                <input
                  type="text"
                  value={
                    formData.fullName
                  }
                  onChange={(e) =>
                    updateField(
                      "fullName",
                      e.target.value
                    )
                  }
                  placeholder="Enter child's full name"
                  required
                />
              </div>

              {/* Gender */}

              <div className="form-group">
                <label>
                  Gender *
                </label>

                <select
                  value={
                    formData.gender
                  }
                  onChange={(e) =>
                    updateField(
                      "gender",
                      e.target.value
                    )
                  }
                  required
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>
                </select>
              </div>

              {/* Date of Birth */}

              <div className="form-group">
                <label>
                  Date of Birth *
                </label>

                <input
                  type="date"
                  value={
                    formData.dateOfBirth
                  }
                  onChange={(e) =>
                    updateField(
                      "dateOfBirth",
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              {/* National ID */}

              <div className="form-group">
                <label>
                  National ID
                </label>

                <input
                  type="text"
                  value={
                    formData.nationalId
                  }
                  onChange={(e) =>
                    updateField(
                      "nationalId",
                      e.target.value
                    )
                  }
                  placeholder="If applicable"
                />
              </div>

              {/* ================= PHOTO UPLOAD ================= */}

              <div className="form-group photo-upload-group">

                <label htmlFor="beneficiary-photo">
                  Beneficiary Photo *
                </label>

                <input
                  id="beneficiary-photo"
                  name="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handlePhotoChange
                  }
                  required
                />

                <small className="photo-help">
                  Upload a JPG, PNG, or WEBP
                  image. Maximum size: 5MB.
                </small>

                {/* PHOTO PREVIEW */}

                {photoPreview && (
                  <div className="photo-preview">

                    <img
                      src={photoPreview}
                      alt="Beneficiary preview"
                    />

                    <div>
                      <strong>
                        Selected photo
                      </strong>

                      <p>
                        {photoFile?.name}
                      </p>

                      <small>
                        {photoFile
                          ? (
                              photoFile.size /
                              1024 /
                              1024
                            ).toFixed(2)
                          : "0"}{" "}
                        MB
                      </small>
                    </div>

                  </div>
                )}

              </div>

            </div>
          </section>

          {/* ================= PART B ================= */}

          <section className="form-section">

            <div className="section-title">
              <span>2</span>

              <div>
                <h2>
                  Education Information
                </h2>

                <p>
                  Current education details.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>
                  School *
                </label>

                <input
                  type="text"
                  value={
                    formData.school
                  }
                  onChange={(e) =>
                    updateField(
                      "school",
                      e.target.value
                    )
                  }
                  placeholder="School name"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Class / Level *
                </label>

                <input
                  type="text"
                  value={
                    formData.classLevel
                  }
                  onChange={(e) =>
                    updateField(
                      "classLevel",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Primary 5"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Education Level
                </label>

                <select
                  value={
                    formData.educationLevel
                  }
                  onChange={(e) =>
                    updateField(
                      "educationLevel",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select education level
                  </option>

                  <option value="Pre-Primary">
                    Pre-Primary
                  </option>

                  <option value="Primary">
                    Primary
                  </option>

                  <option value="Secondary">
                    Secondary
                  </option>

                  <option value="TVET">
                    TVET
                  </option>

                  <option value="University">
                    University
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

            </div>
          </section>

          {/* ================= PART C ================= */}

          <section className="form-section">

            <div className="section-title">
              <span>3</span>

              <div>
                <h2>
                  Location Information
                </h2>

                <p>
                  Child's current location.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>
                  Province
                </label>

                <input
                  type="text"
                  value={
                    formData.province
                  }
                  onChange={(e) =>
                    updateField(
                      "province",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  District *
                </label>

                <input
                  type="text"
                  value={
                    formData.district
                  }
                  onChange={(e) =>
                    updateField(
                      "district",
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Sector
                </label>

                <input
                  type="text"
                  value={
                    formData.sector
                  }
                  onChange={(e) =>
                    updateField(
                      "sector",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Cell
                </label>

                <input
                  type="text"
                  value={
                    formData.cell
                  }
                  onChange={(e) =>
                    updateField(
                      "cell",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Village
                </label>

                <input
                  type="text"
                  value={
                    formData.village
                  }
                  onChange={(e) =>
                    updateField(
                      "village",
                      e.target.value
                    )
                  }
                />
              </div>

            </div>
          </section>

          {/* ================= PART D ================= */}

          <section className="form-section">

            <div className="section-title">
              <span>4</span>

              <div>
                <h2>
                  Parent / Guardian Information
                </h2>

                <p>
                  Contact information of the parent
                  or guardian.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>
                  Parent / Guardian Name *
                </label>

                <input
                  type="text"
                  value={
                    formData.parentGuardianName
                  }
                  onChange={(e) =>
                    updateField(
                      "parentGuardianName",
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Contact Number *
                </label>

                <input
                  type="tel"
                  value={
                    formData.parentGuardianContact
                  }
                  onChange={(e) =>
                    updateField(
                      "parentGuardianContact",
                      e.target.value
                    )
                  }
                  placeholder="+250..."
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={
                    formData.parentGuardianEmail
                  }
                  onChange={(e) =>
                    updateField(
                      "parentGuardianEmail",
                      e.target.value
                    )
                  }
                  placeholder="guardian@example.com"
                />
              </div>

              <div className="form-group full-width">
                <label>
                  Address
                </label>

                <textarea
                  value={
                    formData.parentGuardianAddress
                  }
                  onChange={(e) =>
                    updateField(
                      "parentGuardianAddress",
                      e.target.value
                    )
                  }
                  rows={3}
                />
              </div>

            </div>
          </section>

          {/* ================= PART E ================= */}

          <section className="form-section">

            <div className="section-title">
              <span>5</span>

              <div>
                <h2>
                  Care & Sponsorship Information
                </h2>

                <p>
                  Information about care and support.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>
                  Caretaker / Mentor
                </label>

                <input
                  type="text"
                  value={
                    formData.caretakerMentor
                  }
                  onChange={(e) =>
                    updateField(
                      "caretakerMentor",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Sponsorship Start Date
                </label>

                <input
                  type="date"
                  value={
                    formData.sponsorshipStartDate
                  }
                  onChange={(e) =>
                    updateField(
                      "sponsorshipStartDate",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Sponsorship Type
                </label>

                <select
                  value={
                    formData.sponsorshipType
                  }
                  onChange={(e) =>
                    updateField(
                      "sponsorshipType",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select sponsorship type
                  </option>

                  <option value="Education">
                    Education
                  </option>

                  <option value="Education and Basic Needs">
                    Education and Basic Needs
                  </option>

                  <option value="Full Sponsorship">
                    Full Sponsorship
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Orphan / Vulnerability Status
                </label>

                <select
                  value={
                    formData.orphanStatus
                  }
                  onChange={(e) =>
                    updateField(
                      "orphanStatus",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select status
                  </option>

                  <option value="Orphan">
                    Orphan
                  </option>

                  <option value="Single Parent">
                    Single Parent
                  </option>

                  <option value="Vulnerable Child">
                    Vulnerable Child
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Living Arrangement
                </label>

                <select
                  value={
                    formData.livingArrangement
                  }
                  onChange={(e) =>
                    updateField(
                      "livingArrangement",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select arrangement
                  </option>

                  <option value="With Parent">
                    With Parent
                  </option>

                  <option value="With Guardian">
                    With Guardian
                  </option>

                  <option value="With Relative">
                    With Relative
                  </option>

                  <option value="Foster Care">
                    Foster Care
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

            </div>
          </section>

          {/* ================= PART F ================= */}

          <section className="form-section">

            <div className="section-title">
              <span>6</span>

              <div>
                <h2>
                  Child Support Information
                </h2>

                <p>
                  Additional information that may
                  affect support.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group full-width">
                <label>
                  Special Needs
                </label>

                <textarea
                  value={
                    formData.specialNeeds
                  }
                  onChange={(e) =>
                    updateField(
                      "specialNeeds",
                      e.target.value
                    )
                  }
                  placeholder="Describe any special educational or accessibility needs."
                  rows={4}
                />
              </div>

              <div className="form-group full-width">
                <label>
                  Health Information
                </label>

                <textarea
                  value={
                    formData.healthInformation
                  }
                  onChange={(e) =>
                    updateField(
                      "healthInformation",
                      e.target.value
                    )
                  }
                  placeholder="Relevant information required for appropriate support."
                  rows={4}
                />
              </div>

            </div>
          </section>

          {/* ================= PART G ================= */}

          <section className="form-section">

            <div className="section-title">
              <span>7</span>

              <div>
                <h2>
                  Registration Details
                </h2>

                <p>
                  Information about this registration.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>
                  Registration Date *
                </label>

                <input
                  type="date"
                  value={
                    formData.dateOfRegistration
                  }
                  onChange={(e) =>
                    updateField(
                      "dateOfRegistration",
                      e.target.value
                    )
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Registered By
                </label>

                <input
                  type="text"
                  value={
                    formData.registeredBy
                  }
                  onChange={(e) =>
                    updateField(
                      "registeredBy",
                      e.target.value
                    )
                  }
                  placeholder="Foundation staff name"
                />
              </div>

              <div className="form-group full-width">
                <label>
                  Notes
                </label>

                <textarea
                  value={
                    formData.notes
                  }
                  onChange={(e) =>
                    updateField(
                      "notes",
                      e.target.value
                    )
                  }
                  rows={4}
                />
              </div>

            </div>
          </section>

          {/* ================= DECLARATION ================= */}

          <section className="declaration">

            <h2>
              Declaration
            </h2>

            <p>
              I confirm that the information
              provided in this registration form
              is accurate to the best of my
              knowledge and is provided for the
              purpose of beneficiary registration
              and support by NIBEZA Foundation.
            </p>

            <label className="consent-row">

              <input
                type="checkbox"
                required
              />

              <span>
                I confirm that the information
                provided is accurate and may be
                used for beneficiary registration
                and programme administration.
              </span>

            </label>

          </section>

          {/* ================= BUTTONS ================= */}

          <div className="form-actions">

            <button
              type="reset"
              className="secondary-button"
              onClick={() => {
                setFormData(
                  initialForm
                );

                setPhotoFile(null);
                setPhotoPreview("");

                setMessage("");
                setError("");

                const fileInput =
                  document.getElementById(
                    "beneficiary-photo"
                  ) as HTMLInputElement | null;

                if (fileInput) {
                  fileInput.value = "";
                }
              }}
            >
              Clear Form
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Registering..."
                : "Register Beneficiary"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}