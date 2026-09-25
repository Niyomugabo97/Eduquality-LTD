"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import jsPDF from "jspdf";

import "./exitFormByPdf.css";

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

export default function ExitFormByPdfPage() {
  const [form, setForm] = useState<ExitFormData>(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [autoDownload, setAutoDownload] = useState(false);

  useEffect(() => {
    if (!window.location.search.includes("download=1")) {
      return;
    }

    const savedForm = window.localStorage.getItem("exit-form-pdf-data");

    if (!savedForm) {
      return;
    }

    try {
      setForm({
        ...initialForm,
        ...JSON.parse(savedForm),
      });
      setAutoDownload(true);
    } catch {
      window.localStorage.removeItem("exit-form-pdf-data");
    }
  }, []);

  const updateField = <K extends keyof ExitFormData>(
    field: K,
    value: ExitFormData[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!form.beneficiaryFullName.trim()) {
      setError("Please enter the beneficiary full name.");
      return;
    }

    if (!form.beneficiaryRegistrationNumber.trim()) {
      setError("Please enter the beneficiary registration number.");
      return;
    }

    if (!form.parentGuardianName.trim()) {
      setError("Please enter the Parent/Guardian name.");
      return;
    }

    if (!form.dateOfExit) {
      setError("Please select the date of exit.");
      return;
    }

    setMessage(
      "Form information is ready. Click the PDF button below to download the form."
    );
  };

  const formatDate = (date: string) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-GB");
  };

  const getCheckedMark = (value: boolean) => {
    return value ? "☑" : "☐";
  };

  const addWrappedText = (
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight = 5
  ) => {
    const lines = doc.splitTextToSize(text || "-", maxWidth);

    doc.text(lines, x, y);

    return y + lines.length * lineHeight;
  };

  const addSectionTitle = (
    doc: jsPDF,
    title: string,
    y: number
  ) => {
    if (y > 265) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(238, 242, 247);
    doc.rect(15, y - 5, 180, 9, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title, 18, y + 1);

    return y + 10;
  };

  const addField = (
    doc: jsPDF,
    label: string,
    value: string,
    x: number,
    y: number,
    width: number
  ) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(label, x, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const displayValue = value || "____________________________";

    const lines = doc.splitTextToSize(
      displayValue,
      width
    );

    doc.text(lines, x, y + 5);

    return y + Math.max(11, lines.length * 4.5);
  };

  const addCheckboxList = (
    doc: jsPDF,
    title: string,
    options: string[],
    selected: string[],
    y: number
  ) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(title, 18, y);

    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    for (const option of options) {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }

      const mark = selected.includes(option) ? "☑" : "☐";

      const lines = doc.splitTextToSize(
        `${mark} ${option}`,
        165
      );

      doc.text(lines, 20, y);

      y += Math.max(5, lines.length * 4);
    }

    return y + 3;
  };

  const downloadExitFormPDF = () => {
    setError("");
    setMessage("");

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    const pageHeight = 297;

    let y = 18;

    /*
     * HEADER
     */

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(
      "NIBEZA FOUNDATION",
      pageWidth / 2,
      y,
      { align: "center" }
    );

    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      "A charitable organization supported and funded by My Equality Partner Ltd.",
      pageWidth / 2,
      y,
      { align: "center" }
    );

    y += 9;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(
      "BENEFICIARY EXIT FORM",
      pageWidth / 2,
      y,
      { align: "center" }
    );

    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      "Paper Form - Complete, Print and Sign by Hand",
      pageWidth / 2,
      y,
      { align: "center" }
    );

    y += 10;

    /*
     * FORM REFERENCE
     */

    doc.setDrawColor(180, 180, 180);
    doc.rect(15, y, 180, 13);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    doc.text("Form Type:", 20, y + 5);
    doc.text("Beneficiary Exit", 42, y + 5);

    doc.text("Date Prepared:", 110, y + 5);
    doc.text(
      new Date().toLocaleDateString("en-GB"),
      139,
      y + 5
    );

    doc.text("Reference:", 20, y + 10);
    doc.text(
      form.beneficiaryRegistrationNumber || "________________",
      42,
      y + 10
    );

    y += 20;

    /*
     * SECTION A
     */

    y = addSectionTitle(
      doc,
      "A. BENEFICIARY IDENTIFICATION",
      y
    );

    y = addField(
      doc,
      "Full Name",
      form.beneficiaryFullName,
      18,
      y,
      80
    );

    y = addField(
      doc,
      "Registration Number",
      form.beneficiaryRegistrationNumber,
      110,
      y - 11,
      80
    );

    y += 2;

    y = addField(
      doc,
      "Gender",
      form.gender,
      18,
      y,
      50
    );

    y = addField(
      doc,
      "Date of Birth",
      formatDate(form.dateOfBirth),
      75,
      y - 11,
      50
    );

    y = addField(
      doc,
      "School",
      form.school,
      132,
      y - 11,
      60
    );

    y += 2;

    y = addField(
      doc,
      "Class / Level",
      form.classLevel,
      18,
      y,
      50
    );

    y = addField(
      doc,
      "District",
      form.district,
      75,
      y - 11,
      50
    );

    y += 2;

    y = addField(
      doc,
      "Parent / Guardian Name",
      form.parentGuardianName,
      18,
      y,
      80
    );

    y = addField(
      doc,
      "Parent / Guardian Contact",
      form.parentGuardianContact,
      110,
      y - 11,
      80
    );

    y += 2;

    y = addField(
      doc,
      "Parent / Guardian Email",
      form.parentGuardianEmail,
      18,
      y,
      80
    );

    y = addField(
      doc,
      "Caretaker / Mentor",
      form.caretakerMentor,
      110,
      y - 11,
      80
    );

    /*
     * SECTION B
     */

    y += 5;

    y = addSectionTitle(
      doc,
      "B. REASON FOR EXIT",
      y
    );

    y = addField(
      doc,
      "Date of Exit",
      formatDate(form.dateOfExit),
      18,
      y,
      70
    );

    y += 2;

    y = addCheckboxList(
      doc,
      "Selected Reason(s):",
      exitReasonOptions,
      form.exitReasons,
      y
    );

    if (form.exitReasons.includes("Other")) {
      y = addField(
        doc,
        "Other Exit Reason",
        form.otherExitReason,
        18,
        y,
        170
      );
    }

    /*
     * SECTION C
     */

    y += 4;

    y = addSectionTitle(
      doc,
      "C. DISMISSAL REASONS",
      y
    );

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text(
      "Complete this section only if dismissal applies.",
      18,
      y
    );

    y += 6;

    y = addCheckboxList(
      doc,
      "Selected Dismissal Reason(s):",
      dismissalReasonOptions,
      form.dismissalReasons,
      y
    );

    if (form.dismissalReasons.includes("Other")) {
      y = addField(
        doc,
        "Other Dismissal Reason",
        form.otherDismissalReason,
        18,
        y,
        170
      );
    }

    /*
     * SECTION D
     */

    y += 4;

    y = addSectionTitle(
      doc,
      "D. PREVIOUS DISCIPLINARY ACTIONS",
      y
    );

    y = addCheckboxList(
      doc,
      "Previous Action(s):",
      disciplinaryOptions,
      form.previousDisciplinaryActions,
      y
    );

    y = addField(
      doc,
      "Dates and Outcomes",
      form.disciplinaryDatesOutcomes,
      18,
      y,
      170
    );

    /*
     * SECTION E
     */

    y += 4;

    y = addSectionTitle(
      doc,
      "E. COMMITTEE DECISION",
      y
    );

    y = addField(
      doc,
      "Committee Decision",
      form.committeeDecision,
      18,
      y,
      170
    );

    y = addField(
      doc,
      "Reason / Explanation",
      form.committeeReason,
      18,
      y,
      170
    );

    /*
     * SECTION F
     */

    y += 4;

    y = addSectionTitle(
      doc,
      "F. DECLARATION AND VERIFICATION",
      y
    );

    y = addField(
      doc,
      "Beneficiary Declaration Name",
      form.beneficiaryDeclarationName,
      18,
      y,
      170
    );

    y += 3;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    const declaration =
      "I confirm that the information provided in this form is accurate to the best of my knowledge. I understand that the beneficiary's participation with NIBEZA Foundation is being formally concluded according to the decision recorded above.";

    y = addWrappedText(
      doc,
      declaration,
      18,
      y,
      170,
      4
    );

    /*
     * SECTION G
     */

    y += 6;

    y = addSectionTitle(
      doc,
      "G. PROPERTY RETURN CHECKLIST",
      y
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const properties = [
      [
        getCheckedMark(form.propertyIdentityCard),
        "Identity Card",
      ],
      [
        getCheckedMark(form.propertyFoundationUniform),
        "Foundation Uniform",
      ],
      [
        getCheckedMark(form.propertyBooksMaterials),
        "Books / Learning Materials",
      ],
      [
        getCheckedMark(form.propertyElectronicDevices),
        "Electronic Devices",
      ],
    ];

    for (const [mark, label] of properties) {
      doc.text(`${mark} ${label}`, 20, y);
      y += 6;
    }

    y = addField(
      doc,
      "Other Property",
      form.propertyOther,
      18,
      y,
      170
    );

    y = addField(
      doc,
      "Property Verified By",
      form.propertyVerifiedBy,
      18,
      y,
      170
    );

    /*
     * SIGNATURE PAGE
     */

    doc.addPage();

    y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    doc.text(
      "SIGNATURES AND APPROVAL",
      pageWidth / 2,
      y,
      { align: "center" }
    );

    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const signatureIntro =
      "The following persons confirm that they have reviewed this beneficiary exit form and acknowledge the information and decision recorded above.";

    y = addWrappedText(
      doc,
      signatureIntro,
      18,
      y,
      170,
      5
    );

    y += 12;

    /*
     * BENEFICIARY SIGNATURE
     */

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("1. BENEFICIARY", 18, y);

    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
      `Name: ${
        form.beneficiaryDeclarationName ||
        form.beneficiaryFullName ||
        "________________________________________"
      }`,
      18,
      y
    );

    y += 12;

    doc.text(
      "Signature: ______________________________________________",
      18,
      y
    );

    doc.text(
      "Date: ____________________",
      130,
      y
    );

    y += 20;

    /*
     * PARENT / GUARDIAN
     */

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("2. PARENT / GUARDIAN", 18, y);

    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
      `Name: ${
        form.parentGuardianName ||
        "________________________________________"
      }`,
      18,
      y
    );

    y += 12;

    doc.text(
      "Signature: ______________________________________________",
      18,
      y
    );

    doc.text(
      "Date: ____________________",
      130,
      y
    );

    y += 20;

    /*
     * FOUNDATION REPRESENTATIVE
     */

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(
      "3. FOUNDATION REPRESENTATIVE",
      18,
      y
    );

    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
      `Name: ${
        form.foundationRepresentativeName ||
        "________________________________________"
      }`,
      18,
      y
    );

    y += 8;

    doc.text(
      `Position: ${
        form.foundationRepresentativePosition ||
        "________________________________"
      }`,
      18,
      y
    );

    y += 12;

    doc.text(
      "Signature: ______________________________________________",
      18,
      y
    );

    doc.text(
      "Date: ____________________",
      130,
      y
    );

    y += 20;

    /*
     * WITNESS
     */

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("4. WITNESS", 18, y);

    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
      `Name: ${
        form.witnessName ||
        "________________________________________"
      }`,
      18,
      y
    );

    y += 8;

    doc.text(
      `Position / Relationship: ${
        form.witnessPositionRelationship ||
        "____________________________"
      }`,
      18,
      y
    );

    y += 12;

    doc.text(
      "Signature: ______________________________________________",
      18,
      y
    );

    doc.text(
      "Date: ____________________",
      130,
      y
    );

    /*
     * OFFICIAL USE
     */

    y += 25;

    doc.setDrawColor(180, 180, 180);
    doc.line(18, y, 192, y);

    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text("FOR FOUNDATION OFFICIAL USE", 18, y);

    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
      "Reviewed By: ______________________________________________",
      18,
      y
    );

    y += 10;

    doc.text(
      "Position: _________________________________________________",
      18,
      y
    );

    y += 10;

    doc.text(
      "Signature: ________________________________________________",
      18,
      y
    );

    doc.text(
      "Date: ____________________",
      130,
      y
    );

    y += 20;

    /*
     * FOOTER ON EVERY PAGE
     */

    const totalPages = doc.getNumberOfPages();

    for (let page = 1; page <= totalPages; page++) {
      doc.setPage(page);

      doc.setDrawColor(200, 200, 200);
      doc.line(15, 285, 195, 285);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);

      doc.text(
        "NIBEZA Foundation - Beneficiary Exit Form",
        15,
        290
      );

      doc.text(
        `Page ${page} of ${totalPages}`,
        195,
        290,
        { align: "right" }
      );
    }

    const safeName =
      form.beneficiaryFullName
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, "_") ||
      "Beneficiary";

    doc.save(
      `NIBEZA_Beneficiary_Exit_Form_${safeName}.pdf`
    );

    setMessage(
      "PDF generated successfully. You can now print it and complete the signatures by hand."
    );
  };

  useEffect(() => {
    if (!autoDownload) {
      return;
    }

    const downloadTimer = window.setTimeout(() => {
      downloadExitFormPDF();
      window.localStorage.removeItem("exit-form-pdf-data");
      window.location.replace("/exit");
    }, 0);

    return () => window.clearTimeout(downloadTimer);
  }, [autoDownload]);

  const handleReset = () => {
    setForm(initialForm);
    setMessage("");
    setError("");
  };

  return (
    <main className="exit-pdf-page">
      <div className="exit-pdf-container">

        {/* HEADER */}

        <div className="page-title">
          <button
            type="button"
            className="download-pdf-button"
            onClick={downloadExitFormPDF}
          >
            Download Form in PDF to Sign by Hand
          </button>

          <h1>Beneficiary Exit Form</h1>

          <p>
            Complete this form and download the PDF for
            printing and handwritten signatures.
          </p>

          <div className="pdf-mode-badge">
            PAPER / PDF SIGNATURE FORM
          </div>
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

          {/* ================= PART A ================= */}

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
                    value={form.beneficiaryFullName}
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
                    value={form.dateOfBirth}
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
                    value={form.classLevel}
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
                  Parent / Guardian Email
                  <input
                    type="email"
                    value={
                      form.parentGuardianEmail
                    }
                    onChange={(e) =>
                      updateField(
                        "parentGuardianEmail",
                        e.target.value
                      )
                    }
                    placeholder="example@gmail.com"
                  />
                </label>

                <label>
                  Caretaker / Mentor *
                  <input
                    type="text"
                    value={form.caretakerMentor}
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

          {/* ================= PART B ================= */}

          <section className="form-section">

            <div className="section-number">
              B
            </div>

            <div className="section-content">

              <h2>
                Reason for Exit
              </h2>

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

              <h3>
                Select reason(s)
              </h3>

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

          {/* ================= PART C ================= */}

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

          {/* ================= PART D ================= */}

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

          {/* ================= PART E ================= */}

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

          {/* ================= PART F ================= */}

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

              <div className="declaration-box">

                <h3>
                  Declaration
                </h3>

                <p>
                  I confirm that the information
                  provided in this form is accurate
                  to the best of my knowledge. I
                  understand that the beneficiary's
                  participation with NIBEZA Foundation
                  is being formally concluded according
                  to the decision recorded above.
                </p>

              </div>

              <div className="form-grid">

                <label>
                  Foundation Representative

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
                  />
                </label>

                <label>
                  Representative Position

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

          {/* ================= PART G ================= */}

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
                  value={form.propertyOther}
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

          {/* ================= ACTION BUTTONS ================= */}

          <div className="form-actions">

            <button
              type="submit"
              className="prepare-button"
            >
              Prepare PDF
            </button>

            <button
              type="button"
              className="reset-button"
              onClick={handleReset}
            >
              Clear Form
            </button>

          </div>

        </form>

      </div>
    </main>
  );
}