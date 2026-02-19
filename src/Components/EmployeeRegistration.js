import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaBarcode } from "react-icons/fa";
import { Html5QrcodeScanner } from "html5-qrcode";
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
    // Initialize Html5QrcodeScanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 150 } },
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
    barcode: "",
    title: "Ms",
    first_name: "",
    last_name: "",
    employee_name: "",
    employee_id: "",
    gender: "Female",
    age: "",
    company_name: "ACSEN TEX P LTD",
    department: "",
    email: "",
    mobile: "",
    registration_datetime: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    payment_mode: "Credit",
  });

  const [scanning, setScanning] = useState(false);
  const [holdScan, setHoldScan] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [packages, setPackages] = useState([]);
  const [lastScanned, setLastScanned] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [errors, setErrors] = useState({});



  // ✅ Validation function
  const validateForm = () => {
    const requiredFields = ["barcode", "employee_name", "employee_id", "department", "age"];
    let newErrors = {};
    let valid = true;

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = true;
        toast.error(`${field.replace("_", " ")} is required`);
        valid = false;
      }
    });

    setErrors(newErrors);
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

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${Labbaseurl}get_packages/`);
        const data = await res.json();
        if (data.status === "success") setPackages(data.data);
      } catch (err) {
        console.error("Error fetching packages:", err);
      }
    };
    fetchPackages();
  }, [Labbaseurl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // ❌ Stop if validation fails
    if (isSubmitting) return; // ❌ Prevent multiple clicks

    setIsSubmitting(true);

    const payload = {
      employee_id: formData.employee_id,
      barcode: formData.barcode,
      company_name: formData.company_name,
      testdetails: packages.flatMap((pkg) =>
        pkg.investigations.map((inv) => ({
          testname: inv.testname,
          test_id: inv.test_id,
        }))
      ),
      totalAmount: packages.reduce(
        (sum, pkg) => sum + (pkg.totalAmount || 0),
        0
      ),
      employee_name: formData.employee_name,
      gender: formData.gender,
      age: formData.age,
      department: formData.department,
      email: formData.email,
      mobile: formData.mobile,
    };

    try {
      const res = await fetch(`${Labbaseurl}chc_empregisterandbilling/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        toast.success("Employee registered successfully!");
        // ✅ Clear form
        setFormData({
          barcode: "",
          title: "Ms",
          first_name: "",
          last_name: "",
          employee_name: "",
          employee_id: "",
          gender: "Female",
          age: "",
          company_name: "JS AUTO CAST FOUNDRY INDIA PVT LTD,",
          department: "",
          email: "",
          mobile: "",
          registration_datetime: new Date(
            new Date().getTime() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, 16),
          payment_mode: "Credit",
        });
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
        <ScannerContainer>
          <ScanButton type="button" onClick={() => setScanning(true)}>
            <FaBarcode /> Scan Barcode
          </ScanButton>
          <StyledInput
            id="barcodeInput"
            type="text"
            name="barcode"
            value={formData.barcode}
            onChange={handleChange}
            placeholder="Enter or scan barcode"
          />
        </ScannerContainer>

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

        {/* Company Details */}
        <Card>
          <CardHeader>Company Details</CardHeader>
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
              <StyledInput value={formData.company_name} readOnly />
            </FormGroup>
          </FormRow>
        </Card>

        {/* Registration Details */}
        <Card>
          <CardHeader>Registration Details</CardHeader>
          <FormRow>
            <FormGroup>
              <label>Registration Date & Time</label>
              <StyledInput
                type="datetime-local"
                value={formData.registration_datetime}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <label>Payment Mode</label>
              <StyledInput value={formData.payment_mode} readOnly />
            </FormGroup>
          </FormRow>

          {/* ✅ Updated Package Table */}
          <CardHeader>Available Packages</CardHeader>
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <div key={pkg._id} style={{ marginBottom: "2rem" }}>
                {/* Package Name */}
                <h3
                  style={{
                    textAlign: "center",
                    margin: "1rem 0",
                    color: "#1f2937",
                    fontWeight: "700",
                    fontSize: "1.1rem",
                  }}
                >
                  {pkg.package_name}
                </h3>

                {/* Investigations Table - Reduced Width */}
                <div style={{ maxWidth: "600px", margin: "0 auto", overflowX: "auto" }}>
                  <StyledTable style={{ width: "100%", minWidth: "300px" }}>
                    <thead>
                      <tr>
                        <TableHeader style={{ width: "80px" }}>S.No</TableHeader>
                        <TableHeader style={{ textAlign: "left" }}>Investigations</TableHeader>
                      </tr>
                    </thead>
                    <tbody>
                      {pkg.investigations.map((inv, index) => (
                        <tr key={index}>
                          <TableCell style={{ textAlign: "center", width: "80px" }}>
                            {index + 1}
                          </TableCell>
                          <TableCell style={{ textAlign: "left" }}>
                            {inv.testname}
                          </TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </StyledTable>

                  {/* Total Amount Below Table */}
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
                    Total Amount: ₹{pkg.totalAmount}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#6b7280" }}>
              No packages available
            </p>
          )}
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