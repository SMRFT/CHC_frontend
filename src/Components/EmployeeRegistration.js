import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaBarcode } from "react-icons/fa";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🎨 Styled Components
// Styled components (keeping the same styles from the original)
const StyledContainer = styled.div`
  min-height: 100vh;
  background: #F9F7F7; /* New color scheme - light background */
  margin-left: 260px; /* Match sidebar desktop width */
  padding: 2rem;
  font-family: 'Inter', sans-serif;

  @media (max-width: 1024px) {
    margin-left: 240px; /* Match sidebar tablet width */
  }

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const Header = styled.header`
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  text-align: center;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 0.75rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Card = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const CardHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 1rem;
  text-align: center;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  background: #2563eb;
  color: white;
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
`;

const TableCell = styled.td`
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: center;
  font-size: 0.9rem;
  color: #374151;
`;

const FormContainer = styled.form`
  background: white;
  border-radius: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 12px;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  label {
    margin-bottom: 0.25rem;
    font-weight: 600;
    color: #374151;
    font-size: 0.875rem;
  }
`;

const StyledInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  &:read-only {
    background: #f3f4f6;
    color: #6b7280;
    font-weight: 500;
  }
`;

const StyledSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
`;

const ScannerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const ScanButton = styled.button`
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 600px) {
    width: 100%;
    justify-content: center;
    padding: 0.75rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.75rem;
    
    button {
      width: 100%;
      padding: 0.75rem;
    }
  }
`;

const SubmitButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
`;

const BackButton = styled.button`
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
`;

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ScannerBox = styled.div`
  width: 500px;
  height: auto;
  min-height: 300px;
  background: black;
  border-radius: 8px;
  max-width: 95%;

  @media (max-width: 600px) {
    min-height: 250px;
  }
`;

const AlertBox = styled.div`
  background: #dbeafe;
  padding: 0.5rem;
  margin-top: 0.5rem;
  text-align: center;
  border-radius: 6px;
`;

// ---- Scanner Component ----
const Scanner = ({ onDetected }) => {
  useEffect(() => {
    // Initialize Html5QrcodeScanner with optimized settings
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 20, // Increased FPS for faster detection
        qrbox: { width: 350, height: 150 }, // Adjusted for 1D barcodes
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true, // Helpful in low light
        useBarCodeDetectorIfSupported: true, // Use native API if available
        formatsToSupport: [
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.ITF,
          Html5QrcodeSupportedFormats.QR_CODE
        ]
      },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        // Match the structure expected by onBarcodeDetected
        onDetected({ codeResult: { code: decodedText } });
      },
      (errorMessage) => {
        // parse error, ignore it.
      }
    );

    // Cleanup function
    return () => {
      scanner.clear().catch((error) => {
        console.error("Failed to clear html5-qrcode scanner. ", error);
      });
    };
  }, [onDetected]);

  return <ScannerBox id="reader" />;
};

// ---- Main Component ----
const EmployeeRegistration = () => {
  const [formData, setFormData] = useState({
    registration_mode: "Onsite", // "Onsite" or "Offsite"
    barcode: "",
    title: "Ms",
    first_name: "",
    last_name: "",
    employee_name: "",
    employee_id: "",
    gender: "Female",
    age: "",
    company_name: "",
    department: "",
    email: "",
    mobile: "",
    registration_datetime: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    payment_type: "Credit", // "Cash" or "Credit"
    cash_mode: "Cash",      // "Cash", "UPI", or "Card"
    transaction_id: "",
    company_id: "",
    package_id: "",
  });

  const [scanning, setScanning] = useState(false);
  const [holdScan, setHoldScan] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [packages, setPackages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [companies, setCompanies] = useState([]);

  // Fetch Companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${Labbaseurl}companies/`);
        const data = await res.json();
        // The backend returns a list directly based on the view code
        setCompanies(data);
      } catch (err) {
        console.error("Error fetching companies:", err);
        toast.error("Failed to load companies");
      }
    };
    fetchCompanies();
  }, [Labbaseurl]);



  // ✅ Validation function
  const validateForm = () => {
    const requiredFields = ["barcode", "employee_name", "employee_id", "department", "age", "package_id"];


    let newErrors = {};
    let valid = true;

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = true;
        toast.error(`${field.replace("_", " ")} is required`);
        valid = false;
      }
    });

    return valid;
  };


  // 🔹 Barcode detected handler
  const onBarcodeDetected = (result) => {
    if (holdScan) return;
    setHoldScan(true);

    const code = result.codeResult?.code || "Unavailable Barcode!";
    setScannedBarcode(code);
    setFormData((prev) => ({ ...prev, barcode: code }));

    setTimeout(() => setHoldScan(false), 2000);
    setScanning(false);
  };


  // Auto-generate employee full name
  useEffect(() => {
    const employee_name = `${formData.title} ${formData.first_name} ${formData.last_name}`.trim();
    setFormData((prev) => ({ ...prev, employee_name }));
  }, [formData.title, formData.first_name, formData.last_name]);

  // Auto-select gender based on title
  useEffect(() => {
    let gender = "Others"; // default
    if (formData.title === "Mr") {
      gender = "Male";
    } else if (formData.title === "Ms" || formData.title === "Mrs") {
      gender = "Female";
    }
    setFormData((prev) => ({ ...prev, gender }));
  }, [formData.title]);

  // Fetch next offsite barcode when mode is switched to Offsite
  const fetchNextBarcode = async () => {
    try {
      const res = await fetch(`${Labbaseurl}get_next_offsite_barcode/`);
      const data = await res.json();
      if (data.status === "success") {
        setFormData(prev => ({ ...prev, barcode: data.barcode }));
      }
    } catch (err) {
      console.error("Error fetching next barcode:", err);
      toast.error("Failed to fetch auto-barcode");
    }
  };

  const handleModeChange = (mode) => {
    if (mode === "Offsite") {
      fetchNextBarcode();
    } else {
      setFormData(prev => ({ ...prev, barcode: "" }));
    }
    setFormData(prev => ({ ...prev, registration_mode: mode }));
  };

  // Fetch packages based on company_id
  const fetchPackages = async (companyId) => {
    if (!companyId) {
      setPackages([]);
      return;
    }
    try {
      const res = await fetch(`${Labbaseurl}get_packages/?company_id=${companyId}`);
      const data = await res.json();
      if (data.status === "success") {
        setPackages(data.data);
      } else {
        setPackages([]);
      }
    } catch (err) {
      console.error("Error fetching packages:", err);
      toast.error("Error fetching packages");
    }
  };

  const handleCompanyChange = (e) => {
    const selectedCompanyId = e.target.value;
    const selectedCompany = companies.find(c => c.company_id === selectedCompanyId);

    if (selectedCompany) {
      setFormData(prev => ({
        ...prev,
        company_id: selectedCompanyId,
        company_name: selectedCompany.company_name,
        package_id: "" // Reset package when company changes
      }));
      fetchPackages(selectedCompanyId);
    } else {
      setFormData(prev => ({
        ...prev,
        company_id: "",
        company_name: "",
        package_id: ""
      }));
      setPackages([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // ❌ Stop if validation fails
    if (isSubmitting) return; // ❌ Prevent multiple clicks

    setIsSubmitting(true);

    const selectedPackage = packages.find(pkg => pkg._id === formData.package_id);

    // Safety check (validation should have caught this, but just in case)
    if (!selectedPackage) {
      toast.error("Please select a valid package");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      employee_id: formData.employee_id,
      barcode: formData.barcode,
      company_name: formData.company_name,
      company_id: formData.company_id,
      testdetails: selectedPackage.investigations.map((inv) => ({
        testname: inv.testname,
        test_id: inv.test_id,
      })),
      totalAmount: selectedPackage.totalAmount || 0,
      employee_name: formData.employee_name,
      gender: formData.gender,
      age: formData.age,
      department: formData.department,
      email: formData.email,
      mobile: formData.mobile,
      payment_mode: formData.payment_type === "Credit" ? "Credit" : formData.cash_mode,
      transaction_id: formData.transaction_id || "",
      registration_mode: formData.registration_mode,
    };

    try {
      const res = await fetch(`${Labbaseurl}chc_empregisterandbilling/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        toast.success(`Employee registered successfully! (${formData.registration_mode} Mode)`);
        // ✅ Clear personal/employee fields only — keep company & package
        setFormData((prev) => ({
          ...prev,
          registration_mode: "Onsite",
          barcode: "",
          title: "Ms",
          first_name: "",
          last_name: "",
          employee_name: "",
          employee_id: "",
          gender: "Female",
          age: "",
          department: "",
          email: "",
          mobile: "",
          registration_datetime: new Date(
            new Date().getTime() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, 16),
          payment_type: "Credit",
          cash_mode: "Cash",
          transaction_id: "",
          // company_id, company_name, package_id are preserved from prev
        }));
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Error submitting form. Check console for details.");
    } finally {
      setIsSubmitting(false); // ✅ Re-enable submit
    }
  };

  // ...
  return (
    <StyledContainer>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header>
        <Title>Employee Registration Form</Title>
      </Header>

      {scanning && (
        <StyledModal>
          <div>
            <h3 style={{ color: "white", textAlign: "center" }}>Scan Barcode</h3>
            <Scanner onDetected={onBarcodeDetected} />
            {holdScan && (
              <AlertBox>
                {scannedBarcode && scannedBarcode !== "Unavailable Barcode!"
                  ? `Scanned: ${scannedBarcode}`
                  : "Unavailable Barcode!"}
              </AlertBox>
            )}
          </div>
        </StyledModal>
      )}

      <FormContainer onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center", background: "#f3f4f6", padding: "1rem", borderRadius: "10px" }}>
          <FormGroup>
            <label style={{ marginBottom: "0.5rem" }}>Registration Mode</label>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontWeight: "600" }}>
                <input
                  type="radio"
                  name="registration_mode"
                  value="Onsite"
                  checked={formData.registration_mode === "Onsite"}
                  onChange={() => handleModeChange("Onsite")}
                  style={{ width: "18px", height: "18px" }}
                />
                Onsite
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontWeight: "600" }}>
                <input
                  type="radio"
                  name="registration_mode"
                  value="Offsite"
                  checked={formData.registration_mode === "Offsite"}
                  onChange={() => handleModeChange("Offsite")}
                  style={{ width: "18px", height: "18px" }}
                />
                Offsite
              </label>
            </div>
          </FormGroup>

          <div style={{ flex: "1", minWidth: "300px" }}>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: "600", color: "#374151", fontSize: "0.875rem" }}>
              Barcode {formData.registration_mode === "Offsite" && "(Auto-generated)"}
            </label>
            <ScannerContainer style={{ marginBottom: 0 }}>
              <ScanButton
                type="button"
                onClick={() => setScanning(true)}
                disabled={formData.registration_mode === "Offsite"}
                style={{
                  opacity: formData.registration_mode === "Offsite" ? 0.5 : 1,
                  background: formData.registration_mode === "Offsite" ? "#9ca3af" : "#4f46e5"
                }}
              >
                <FaBarcode /> Scan Barcode
              </ScanButton>
              <StyledInput
                id="barcodeInput"
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder={formData.registration_mode === "Offsite" ? "Fetching barcode..." : "Enter or scan barcode"}
                disabled={formData.registration_mode === "Offsite"}
                style={{
                  background: formData.registration_mode === "Offsite" ? "#e5e7eb" : "white",
                  borderColor: formData.registration_mode === "Offsite" ? "#d1d5db" : "#3F72AF",
                  fontWeight: formData.registration_mode === "Offsite" ? "bold" : "normal",
                  color: formData.registration_mode === "Offsite" ? "#112D4E" : "inherit"
                }}
              />
            </ScannerContainer>
          </div>
        </div>

        {/* Personal Details */}
        <Card>
          <CardHeader>Personal Details</CardHeader>
          <FormRow>
            <FormGroup>
              <label>Title</label>
              <StyledSelect
                name="title"
                value={formData.title}
                onChange={handleChange}
              >
                <option>Ms</option>
                <option>Mr</option>
                <option>Mrs</option>
              </StyledSelect>
            </FormGroup>
            <FormGroup>
              <label>First Name</label>
              <StyledInput
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Last Name</label>
              <StyledInput
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Employee Name</label>
              <StyledInput
                name="employee_name"
                value={formData.employee_name}
                onChange={handleChange}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <label>Gender</label>
              <StyledSelect
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option>Female</option>
                <option>Male</option>
                <option>Others</option>
              </StyledSelect>
            </FormGroup>
            <FormGroup>
              <label>Age</label>
              <StyledInput
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
              />
            </FormGroup>
            <FormGroup>
              <label>Mobile Number</label>
              <StyledInput
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </FormGroup>
          </FormRow>
        </Card>

        {/* Company & Package Details */}
        <Card>
          <CardHeader>Company & Package Details</CardHeader>
          <FormRow>
            <FormGroup>
              <label>Employee ID</label>
              <StyledInput
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Department</label>
              <StyledInput
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Email ID</label>
              <StyledInput
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Company Name</label>
              <StyledSelect
                name="company_name"
                value={formData.company_id}
                onChange={handleCompanyChange}
              >
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </option>
                ))}
              </StyledSelect>
            </FormGroup>
            <FormGroup>
              <label>Package</label>
              <StyledSelect
                name="package_id"
                value={formData.package_id}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, package_id: e.target.value }))
                }
                disabled={packages.length === 0}
              >
                <option value="">
                  {formData.company_id ? "Select Package" : "Select Company First"}
                </option>
                {packages.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.package_name}
                  </option>
                ))}
              </StyledSelect>
            </FormGroup>
            <FormGroup>
              <label>Payment Mode</label>
              <StyledSelect
                name="payment_type"
                value={formData.payment_type}
                onChange={handleChange}
              >
                <option value="Credit">Credit</option>
                <option value="Cash">Cash</option>
              </StyledSelect>
            </FormGroup>

            {formData.payment_type === "Cash" && (
              <>
                <FormGroup>
                  <label>Cash Mode</label>
                  <StyledSelect
                    name="cash_mode"
                    value={formData.cash_mode}
                    onChange={handleChange}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                  </StyledSelect>
                </FormGroup>

                {(formData.cash_mode === "UPI" || formData.cash_mode === "Card") && (
                  <FormGroup>
                    <label>Transaction ID (Optional)</label>
                    <StyledInput
                      name="transaction_id"
                      value={formData.transaction_id}
                      onChange={handleChange}
                      placeholder="Enter transaction ID"
                    />
                  </FormGroup>
                )}
              </>
            )}
          </FormRow>

          {/* Display Selected Package Investigations */}
          {formData.package_id && (() => {
            const selectedPkg = packages.find(pkg => pkg._id === formData.package_id);
            if (!selectedPkg) return null;
            return (
              <div style={{ marginTop: "1.5rem" }}>
                <h3 style={{ textAlign: "center", margin: "1rem 0", color: "#1f2937", fontWeight: "700", fontSize: "1.1rem" }}>
                  {selectedPkg.package_name}
                </h3>
                <div style={{ maxWidth: "600px", margin: "0 auto", overflowX: "auto" }}>
                  <StyledTable style={{ width: "100%", minWidth: "300px" }}>
                    <thead>
                      <tr>
                        <TableHeader style={{ width: "80px" }}>S.No</TableHeader>
                        <TableHeader style={{ textAlign: "left" }}>Investigations</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPkg.investigations.map((inv, index) => (
                        <tr key={index}>
                          <TableCell style={{ textAlign: "center", width: "80px" }}>{index + 1}</TableCell>
                          <TableCell style={{ textAlign: "left" }}>{inv.testname}</TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </StyledTable>
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "1rem",
                      padding: "0.75rem",
                      backgroundColor: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.375rem",
                      fontWeight: "700",
                      fontSize: "1.1rem",
                      color: "#1f2937"
                    }}
                  >
                    Total Amount: ₹{selectedPkg.totalAmount}
                  </div>
                </div>
              </div>
            );
          })()}
        </Card>

        {/* Payment Details */}
        <Card>

        </Card>

        <ButtonGroup>
          <BackButton type="button" onClick={() => window.history.back()}>
            Back
          </BackButton>
          <SubmitButton type="submit">Submit</SubmitButton>


        </ButtonGroup>
      </FormContainer>
    </StyledContainer>
  );
};

export default EmployeeRegistration;