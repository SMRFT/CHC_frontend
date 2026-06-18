import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FaBarcode, FaSearch, FaPlus } from "react-icons/fa";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JsBarcode from "jsbarcode";
import apiRequest from "./apiRequest";

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

const SearchWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
  padding-right: 1rem; // Add padding to push it back from the edge

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
    padding-right: 0;
    margin-bottom: 1.5rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 380px; // Slightly reduced to ensure it fits
  box-sizing: border-box;
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.8rem; // Slightly more padding-left for icon
  border: 2px solid #3F72AF; // Use a more visible border color
  border-radius: 50px;
  background: white;
  color: #112D4E;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box; // Critical for preventing overflow

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    background: white;
    border-color: #3F72AF;
    box-shadow: 0 0 10px rgba(63, 114, 175, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #3F72AF;
`;

const SearchResultsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  margin-top: 0.5rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  z-index: 1001;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
`;

const SearchResultItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f0f7ff;
  }

  .name {
    font-weight: 600;
    color: #112D4E;
    display: block;
  }

  .details {
    font-size: 0.8rem;
    color: #6b7280;
  }
`;

const ContainerTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.85rem;

  th {
    background: #f3f4f6;
    color: #112D4E;
    padding: 8px;
    text-align: left;
    border: 1px solid #e5e7eb;
    font-weight: 700;
  }

  td {
    padding: 8px;
    border: 1px solid #e5e7eb;
    color: #374151;
  }

  tr:nth-child(even) {
    background: #f9fafb;
  }

  .id-col { font-weight: 600; color: #4b5563; }
  .name-col { font-weight: 600; color: #1e40af; }
  .container-col { font-weight: 700; color: #059669; }
`;

// ---- Scanner Component ----
const Scanner = ({ onDetected, scanning }) => {
  useEffect(() => {
    if (!scanning) return;

    const html5QrCode = new Html5Qrcode("reader");
    const qrCodeSuccessCallback = (decodedText) => {
      onDetected({ codeResult: { code: decodedText } });
    };

    const config = { 
      fps: 20, 
      qrbox: { width: 350, height: 150 },
      aspectRatio: 1.0
    };

    // Delay start slightly to ensure DOM is ready
    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" }, 
          config, 
          qrCodeSuccessCallback
        );
      } catch (err) {
        console.error("Camera access error:", err);
        // Fallback or detailed error message
        if (err.name === 'NotAllowedError') {
          toast.error("Camera permission denied. Please allow camera access in browser settings.");
        } else {
          toast.error("Unable to access camera. Ensure no other app is using it.");
        }
      }
    };

    startScanner();

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
        }).catch(err => console.error("Failed to stop scanner", err));
      }
    };
  }, [onDetected, scanning]);

  return <ScannerBox id="reader" />;
};

// ---- Main Component ----
const SimpleSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid #e2e8f0;
  border-top-color: #3F72AF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  vertical-align: middle;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const EmployeeRegistration = () => {
  const [formData, setFormData] = useState({
    registration_mode: "Offsite", // Default to "Offsite"
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
    dob: "",
    doj: "",
    experience: "",
    designation: "",
    employee_type: "",
    contractor: "",
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
  const [companySearch, setCompanySearch] = useState("");
  const [packageSearch, setPackageSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [companies, setCompanies] = useState([]);
  const [testContainers, setTestContainers] = useState([]);
  const [dynamicEmployeeTypes, setDynamicEmployeeTypes] = useState([]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");

  const fetchEmployeeTypes = async () => {
    try {
      const res = await apiRequest(`${Labbaseurl}get_employee_types/`, "GET");
      if (res.success && res.data.status === "success") {
        setDynamicEmployeeTypes(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching employee types:", err);
    }
  };

  // Fetch unique employee types
  useEffect(() => {
    fetchEmployeeTypes();
  }, [Labbaseurl]);

  const handleCreateEmployeeType = async () => {
     if (!newTypeName.trim()) return toast.warning("Please enter a type name.");
     try {
       const res = await apiRequest(`${Labbaseurl}create_employee_type/`, "POST", { name: newTypeName.trim() });
       if (res.success && res.data.status === "success") {
         toast.success("Employee Type created!");
         setNewTypeName("");
         setShowTypeModal(false);
         fetchEmployeeTypes(); // Refresh suggestions
       } else {
         toast.error((res.data && res.data.message) || res.error || "Failed to create type.");
       }
     } catch (err) {
       console.error("Error creating type:", err);
       toast.error("Error connecting to server.");
     }
  };

  // Fetch Test Container Details based on selected package
  useEffect(() => {
    const fetchContainers = async () => {
      if (formData.package_id && packages.length > 0) {
        const selectedPkg = packages.find(pkg => pkg._id === formData.package_id);
        if (selectedPkg && selectedPkg.investigations) {
          const tids = selectedPkg.investigations.map(inv => inv.test_id).filter(id => id);
          try {
            const res = await apiRequest(`${Labbaseurl}get_test_details/`, "POST", { test_ids: tids });
            if (res.success && res.data.status === "success") {
               const filteredTests = (res.data.data || []).filter(test => {
                  const name = (test.test_name || "").toLowerCase();
                  const container = (test.collection_container || "").toLowerCase();
                  return name !== "unknown" && container !== "n/a" && container !== "";
               });
               setTestContainers(filteredTests);
            }
          } catch (err) {
            console.error("Error fetching containers:", err);
          }
        }
      } else {
        setTestContainers([]);
      }
    };
    fetchContainers();
  }, [formData.package_id, packages, Labbaseurl]);

  const handlePrintBarcode = (barcode, empName, age, gender) => {
    // Group by both container and suffix
    const containerSuffixPairs = testContainers.reduce((acc, t) => {
      const container = (t.collection_container || "").trim();
      if (container === "" || container.toLowerCase() === "n/a") return acc;
      
      const suffix = (t.suffix || "").trim();
      const key = `${container}|${suffix}`;
      
      if (!acc[key]) {
        acc[key] = { container, suffix };
      }
      return acc;
    }, {});

    const uniquePairs = Object.values(containerSuffixPairs);
    
    // Get dynamic extra barcode count from package
    const selectedPkg = packages.find(pkg => pkg._id === formData.package_id);
    const extraCount = selectedPkg && selectedPkg.extra_barcode != null 
      ? parseInt(selectedPkg.extra_barcode, 10) 
      : 3;
      
    const extraBarcodes = Array(extraCount).fill({ container: "", suffix: "" });
    const pairsToPrint = [...uniquePairs, ...extraBarcodes];
    
    // Create a temporary container for barcodes to generate their bases
    const tempDiv = document.createElement("div");
    tempDiv.style.display = "none";
    document.body.appendChild(tempDiv);

    const barcodeData = pairsToPrint.map(pair => {
      const canvas = document.createElement("canvas");
      const barcodeVal = pair.suffix ? `${barcode}-${pair.suffix}` : barcode;
      
      JsBarcode(canvas, barcodeVal, {
        format: "CODE128",
        width: 2,
        height: 40,
        displayValue: false,
        margin: 0
      });
      return {
        img: canvas.toDataURL("image/png"),
        label: pair.container,
        barcodeNum: barcodeVal
      };
    });

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <style>
            @page { size: 50mm 25mm; margin: 0; }
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            .barcode-page {
              width: 50mm; height: 25mm;
              padding: 1.5mm; box-sizing: border-box;
              display: flex; flex-direction: column; align-items: flex-start;
              page-break-after: always; overflow: hidden;
            }
            
            .header-text { font-size: 10px; font-weight: bold; margin-bottom: 1px; white-space: nowrap; }
            .sub-text { font-size: 7px; margin-bottom: 2px; }
            .barcode-img { width: 40mm; height: 8mm; }
            .barcode-num { font-size: 17px; font-weight: bold; margin-top: 1px; line-height: 1; }
            .container-tag { font-size: 10px; font-weight: bold; color: #333; margin-top: 1px; width: 100%; text-align: right; }
          </style>
        </head>
        <body>
          ${barcodeData.map(data => `
            <div class="barcode-page">
              <div class="header-text">${empName} ${age}Y/${gender.charAt(0)}</div>
              <div class="sub-text">${new Date().toLocaleString()}</div>
              <img class="barcode-img" src="${data.img}" />
              <div class="barcode-num">${data.barcodeNum}</div>
              <div class="container-tag">${data.label}</div>
            </div>
          `).join('')}
          <script>
            window.onload = function() { window.print(); setTimeout(() => { window.frameElement.remove(); }, 100); };
          </script>
        </body>
      </html>
    `);
    doc.close();
    document.body.removeChild(tempDiv);
  };

// Fetch Companies
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoadingCompanies(true);
      try {
        const res = await apiRequest(`${Labbaseurl}companies/`, "GET");
        if (res.success) {
          const data = res.data;
          setCompanies(data);

          // ✅ Default selection logic
          if (data && data.length === 1) {
            const singleCompany = data[0];
            setFormData(prev => ({
              ...prev,
              company_id: singleCompany.company_id,
              company_name: singleCompany.company_name
            }));
            // Fetch packages for this single company immediately
            fetchPackages(singleCompany.company_id);
          }
        } else {
          toast.error(res.error || "Failed to load companies");
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
        toast.error("Failed to load companies");
      } finally {
        setLoadingCompanies(false);
      }
    };
    fetchCompanies();
    if (formData.registration_mode === "Offsite") {
      fetchNextBarcode();
    }
  }, [Labbaseurl]);


  // ✅ Validation function
  const validateForm = () => {
    const requiredFields = ["barcode", "employee_name", "age", "package_id"];


    let newErrors = {};
    let valid = true;

    requiredFields.forEach((field) => {
      const fieldValue = formData[field];
      // Convert to string safely to handle numbers (like age) or nulls
      if (!fieldValue || String(fieldValue).trim() === "") {
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

  const formatDate = (dateField) => {
    if (!dateField) return "";
    if (typeof dateField === 'object' && dateField.$date) {
      return dateField.$date.split('T')[0];
    }
    if (typeof dateField === 'string' && dateField.includes('T')) {
      return dateField.split('T')[0];
    }
    return dateField;
  };

  const calculateAge = (dobString) => {
    if (!dobString) return "";
    const today = new Date();
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return "";
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? age : 0;
  };

  const handleDOBChange = (e) => {
    const dob = e.target.value;
    const computedAge = calculateAge(dob);
    setFormData(prev => ({
        ...prev,
        dob: dob,
        age: computedAge !== "" ? computedAge : prev.age
    }));
  };

  const calculateExperience = (dojString) => {
    if (!dojString) return "";
    const joinDate = new Date(dojString);
    const today = new Date();
    if (isNaN(joinDate.getTime())) return "";
    let years = today.getFullYear() - joinDate.getFullYear();
    const monthDiff = today.getMonth() - joinDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < joinDate.getDate())) {
      years--;
    }
    return years >= 0 ? years : 0;
  };

  const handleDOJChange = (e) => {
    const doj = e.target.value;
    const computedExp = calculateExperience(doj);
    setFormData(prev => ({
        ...prev,
        doj: doj,
        experience: computedExp !== "" ? computedExp : prev.experience
    }));
  };


  // Auto-generate employee full name
  useEffect(() => {
    const employee_name = `${formData.title} ${formData.first_name} ${formData.last_name}`.trim();
    setFormData((prev) => ({ ...prev, employee_name }));
  }, [formData.title, formData.first_name, formData.last_name]);

  const [unregisteredSearch, setUnregisteredSearch] = useState("");
  const [unregisteredResults, setUnregisteredResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("#search-container")) {
        setUnregisteredResults([]);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Search unregistered employees
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (unregisteredSearch.length >= 2) {
        fetchUnregisteredEmployees();
      } else {
        setUnregisteredResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [unregisteredSearch]);

  const fetchUnregisteredEmployees = async () => {
    setIsSearching(true);
    try {
      const res = await apiRequest(`${Labbaseurl}get_unregistered_employees/?search=${unregisteredSearch}`, "GET");
      if (res.success && res.data.status === "success") {
        setUnregisteredResults(res.data.data);
      }
    } catch (err) {
      console.error("Error searching employees:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUnregistered = (emp) => {
    setFormData((prev) => ({
      ...prev,
      title: emp.gender === "Male" ? "Mr" : (emp.gender === "Female" ? "Ms" : prev.title),
      first_name: emp.employee_name ? emp.employee_name.split(' ')[0] : "",
      last_name: emp.employee_name.split(' ').slice(1).join(' ') || "",
      employee_id: emp.employee_id || "",
      gender: emp.gender || "Female",
      age: emp.age || "",
      dob: formatDate(emp.dob),
      doj: formatDate(emp.doj),
      experience: emp.experience || calculateExperience(formatDate(emp.doj)) || "",
      designation: emp.designation || "",
      employee_type: (typeof emp.employee_type === 'object' ? '' : (emp.employee_type || "")),
      company_id: emp.company_id || prev.company_id,
      company_name: emp.company_name || prev.company_name,
      department: emp.department || "",
      contractor: emp.contractor || "",
    }));

    // If company changed, fetch its packages
    if (emp.company_id && emp.company_id !== formData.company_id) {
        fetchPackages(emp.company_id);
    }

    setUnregisteredSearch("");
    setUnregisteredResults([]);
  };

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
      const res = await apiRequest(`${Labbaseurl}get_next_offsite_barcode/`, "GET");
      if (res.success && res.data.status === "success") {
        setFormData(prev => ({ ...prev, barcode: res.data.barcode }));
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
    setLoadingPackages(true);
    try {
      const res = await apiRequest(`${Labbaseurl}get_packages/?company_id=${companyId}`, "GET");
      
      if (res.success && res.data.status === "success") {
        const data = res.data;
        setPackages(data.data);

        // ✅ Auto-select if only one package exists
        if (data.data && data.data.length > 0) {
          const genderMatched = data.data.filter(p => {
             const pg = p.gender || "Common";
             return pg === "Common" || pg === formData.gender;
          });

          if (genderMatched.length === 1) {
             const sel = genderMatched[0];
             setFormData(prev => ({ ...prev, package_id: sel._id }));
          }
        }
      } else {
        setPackages([]);
      }
    } catch (err) {
      console.error("Error fetching packages:", err);
      toast.error("Error fetching packages");
    } finally {
      setLoadingPackages(false);
    }
  };

  // ✅ Auto-select or validate package when gender changes
  useEffect(() => {
    if (packages.length > 0 && formData.gender) {
       const filtered = packages.filter(p => {
         const pg = p.gender || "Common";
         return pg === "Common" || pg === formData.gender;
       });

       // 1. If we have a package selected, check if it's still valid
       if (formData.package_id) {
         const currentPkg = packages.find(p => p._id === formData.package_id);
         const currentPkgGender = currentPkg?.gender || "Common";
         
         // If not valid for current gender, clear it
         if (currentPkgGender !== "Common" && currentPkgGender !== formData.gender) {
           setFormData(prev => ({ ...prev, package_id: "" }));
           setTestContainers([]);
           // After clearing, see if we can auto-select a new one
           if (filtered.length === 1) {
             setFormData(prev => ({ ...prev, package_id: filtered[0]._id }));
           }
         }
       } else {
         // 2. If nothing selected, auto-select if only one option exists
         if (filtered.length === 1) {
           setFormData(prev => ({ ...prev, package_id: filtered[0]._id }));
         }
       }
    }
  }, [formData.gender, packages]);

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
      package_id: selectedPackage.package_id,
      testdetails: selectedPackage.investigations.map((inv) => ({
        testname: inv.testname,
        test_id: inv.test_id,
      })),
      totalAmount: selectedPackage.totalAmount || 0,
      employee_name: formData.employee_name,
      gender: formData.gender,
      age: formData.age,
      dob: formData.dob || null,
      doj: formData.doj || null,
      experience: formData.experience || "",
      designation: formData.designation || "",
      employee_type: formData.employee_type || "",
      department: formData.department,
      email: formData.email,
      mobile: formData.mobile,
      contractor: formData.contractor || "",
      dynamic_fields: selectedPackage.dynamic_fields || [],
      addon_investigation: selectedPackage.addon_investigation || [],
      payment_mode: formData.payment_type === "Credit" ? "Credit" : formData.cash_mode,
      transaction_id: formData.transaction_id || "",
      registration_mode: formData.registration_mode,
      extra_barcode: selectedPackage.extra_barcode ?? 3
    };

    try {
      const res = await apiRequest(`${Labbaseurl}chc_empregisterandbilling/`, "POST", payload);
      const data = res.data || {};

      if (res.success && data.status === "success") {
        toast.success(`Employee registered successfully! (${formData.registration_mode} Mode)`);
        
        // --- PRINT BARCODE FOR OFFSITE ---
        if (formData.registration_mode === "Offsite") {
           handlePrintBarcode(formData.barcode, formData.employee_name, formData.age, formData.gender);
        }

        // ✅ Clear personal/employee fields only — keep company & package
        setFormData((prev) => ({
          ...prev,
          registration_mode: "Offsite", // Keep "Offsite" as the default after reset
          barcode: "",
          title: "Ms",
          first_name: "",
          last_name: "",
          employee_name: "",
          employee_id: "",
          gender: "Female",
          age: "",
          dob: "",
          doj: "",
          experience: "",
          designation: "",
          employee_type: "",
          department: "",
          email: "",
          mobile: "",
          contractor: "",
          registration_datetime: new Date(
            new Date().getTime() - new Date().getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, 16),
          payment_type: "Credit",
          cash_mode: "Cash",
          transaction_id: "",
          doj: "",
          // company_id, company_name, package_id are preserved from prev
        }));
        
        // Auto-fetch the next barcode for the next offsite registration
        fetchNextBarcode();
      } else {
        // Handle field-specific validation errors (e.g., duplicate employee_id)
        if (data.message && typeof data.message === "object" && !Array.isArray(data.message)) {
          Object.entries(data.message).forEach(([field, errors]) => {
            const fieldName = field.replace("_", " ").toUpperCase();
            if (Array.isArray(errors)) {
              errors.forEach((err) => toast.error(`${fieldName}: ${err}`));
            } else {
              toast.error(`${fieldName}: ${errors}`);
            }
          });
        } else {
          toast.error(data.message || "Registration failed");
        }
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
          <div style={{ position: 'relative', background: 'white', padding: '1rem', borderRadius: '12px' }}>
            <h3 style={{ color: "#112D4E", textAlign: "center", marginBottom: '1rem' }}>Scan Barcode</h3>
            <Scanner onDetected={onBarcodeDetected} scanning={scanning} />
            <button 
              onClick={() => setScanning(false)}
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                background: '#ef4444',
                color: 'white',
                border: '4px solid white',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              X
            </button>
            {holdScan && (
              <AlertBox style={{ background: '#fef2f2', color: '#b91c1c', fontWeight: 'bold' }}>
                {scannedBarcode && scannedBarcode !== "Unavailable Barcode!"
                  ? `SUCCESS: ${scannedBarcode}`
                  : "Scanning..."}
              </AlertBox>
            )}
            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#6b7280' }}>
              Center the barcode within the box to scan
            </p>
          </div>
        </StyledModal>
      )}

      <FormContainer onSubmit={handleSubmit}>
        <SearchWrapper>
          <SearchContainer id="search-container">
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput 
              type="text" 
              placeholder="Search Unregistered Employee by ID or Name..."
              value={unregisteredSearch}
              onChange={(e) => setUnregisteredSearch(e.target.value)}
              style={{ background: '#f8fafc' }}
            />
            {isSearching && (
              <SearchResultsDropdown>
                <SearchResultItem style={{ textAlign: "center", color: "#6b7280" }}>
                  <SimpleSpinner style={{ width: "14px", height: "14px", borderWidth: "2px", marginRight: "8px" }} />
                  Searching...
                </SearchResultItem>
              </SearchResultsDropdown>
            )}
            {!isSearching && unregisteredResults.length > 0 && (
              <SearchResultsDropdown>
                {unregisteredResults.map((emp) => (
                  <SearchResultItem key={emp.employee_id} onClick={() => handleSelectUnregistered(emp)}>
                    <span className="name">{emp.employee_name} ({emp.employee_id})</span>
                    <div className="details">
                      {emp.company_name} | {emp.department} | {emp.gender}, {emp.age}yrs
                      {emp.contractor ? ` | Contractor: ${emp.contractor}` : ""}
                    </div>
                  </SearchResultItem>
                ))}
              </SearchResultsDropdown>
            )}
            {unregisteredSearch.length >= 2 && unregisteredResults.length === 0 && !isSearching && (
              <SearchResultsDropdown>
                  <SearchResultItem>No unregistered employees found</SearchResultItem>
              </SearchResultsDropdown>
            )}
          </SearchContainer>
        </SearchWrapper>
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
              <label>DOB</label>
              <StyledInput
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleDOBChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Age</label>
              <StyledInput
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
              />
            </FormGroup>
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
              <label>DOJ (Joining)</label>
              <StyledInput
                type="date"
                name="doj"
                value={formData.doj}
                onChange={handleDOJChange}
              />
            </FormGroup>
            <FormGroup>
              <label>Experience (Years)</label>
              <StyledInput
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Auto-calculated"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
                <label>Designation</label>
                <StyledInput
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <label style={{ margin: 0 }}>Employee Type</label>
                    <button 
                      type="button" 
                      onClick={() => setShowTypeModal(true)}
                      style={{ 
                        border: 'none', background: 'none', color: '#3F72AF', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center'
                      }}
                      title="Create new employee type in master"
                    >
                      <FaPlus />
                    </button>
                </div>
                <StyledInput
                  list="employee-types-list"
                  name="employee_type"
                  value={formData.employee_type}
                  onChange={handleChange}
                  placeholder="Select or enter type"
                />
                <datalist id="employee-types-list">
                   {dynamicEmployeeTypes.map((type, idx) => (
                     <option key={idx} value={type} />
                   ))}
                </datalist>
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
              <label>Contractor</label>
              <StyledInput
                name="contractor"
                value={formData.contractor}
                onChange={handleChange}
              />
            </FormGroup>

<FormGroup>
  <label>Company Name</label>
  {companies.length > 1 && (
    <StyledInput
      type="text"
      placeholder="🔍 Search company..."
      value={companySearch}
      onChange={(e) => setCompanySearch(e.target.value)}
      style={{ marginBottom: '5px' }}
    />
  )}
  
  <StyledSelect
    name="company_name"
    value={formData.company_id}
    onChange={handleCompanyChange}
    disabled={companies.length === 1 || loadingCompanies} // Disable if only one option exists or loading
    style={{ 
      background: (companies.length === 1 || loadingCompanies) ? "#f3f4f6" : "white",
      cursor: (companies.length === 1 || loadingCompanies) ? "not-allowed" : "pointer" 
    }}
  >
    {loadingCompanies ? (
      <option value="">Loading companies...</option>
    ) : (
      <>
        {companies.length !== 1 && <option value="">Select Company</option>}
        {companies
          .filter(c => 
            c.company_name.toLowerCase().includes(companySearch.toLowerCase()) || 
            c.company_id.toLowerCase().includes(companySearch.toLowerCase())
          )
          .map((company) => (
            <option key={company.company_id} value={company.company_id}>
              {company.company_name}
            </option>
          ))}
      </>
    )}
  </StyledSelect>
  {companies.length === 1 && (
    <small style={{ color: "#059669", marginTop: "4px", fontWeight: "600" }}>
      ✓ 
    </small>
  )}
</FormGroup>
<FormGroup>
  <label>Package</label>
  {/* Hide search if only one package exists */}
  {packages.length > 1 && (
    <StyledInput
      type="text"
      placeholder="🔍 Search package..."
      value={packageSearch}
      onChange={(e) => setPackageSearch(e.target.value)}
      style={{ marginBottom: '5px' }}
      disabled={packages.length === 0}
    />
  )}

  <StyledSelect
    name="package_id"
    value={formData.package_id}
    onChange={(e) =>
      setFormData(prev => ({ ...prev, package_id: e.target.value }))
    }
    disabled={packages.length <= 1 || loadingPackages} // Disable if empty OR only one choice OR loading
    style={{ 
      background: (packages.length === 1 || loadingPackages) ? "#f3f4f6" : "white",
      cursor: (packages.length === 1 || loadingPackages) ? "not-allowed" : "pointer"
    }}
  >
    {loadingPackages ? (
      <option value="">Loading packages...</option>
    ) : (
      <>
        {/* Show placeholder only if there are multiple or zero options */}
        {packages.length !== 1 && (
          <option value="">
            {formData.company_id ? "Select Package" : "Select Company First"}
          </option>
        )}

        {packages
          .filter((p) => {
            const matchesSearch = p.package_name.toLowerCase().includes(packageSearch.toLowerCase());
            const pkgGender = p.gender || "Common";
            const matchesGender = pkgGender === "Common" || pkgGender === formData.gender;
            return matchesSearch && matchesGender;
          })
          .map((pkg) => (
            <option key={pkg._id} value={pkg._id}>
              {pkg.package_name}
            </option>
          ))}
      </>
    )}
  </StyledSelect>
  
  {packages.length === 1 && (
    <small style={{ color: "#059669", marginTop: "4px", fontWeight: "600" }}>
      ✓ 
    </small>
  )}
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
                    <div style={{ fontSize: "0.9rem", color: "#6b7280", marginTop: "4px" }}>
                      Extra Barcodes: {parseInt(selectedPkg.extra_barcode ?? 3, 10)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </Card>

        {/* Payment Details */}
        <Card>

        </Card>

        {/* Collection Container Table (Only for Offsite) */}
        {formData.registration_mode === "Offsite" && testContainers.length > 0 && (
          <Card>
            <CardHeader style={{ color: '#059669', borderBottomColor: '#059669' }}>
               Required Collection Containers (Offsite Mode)
            </CardHeader>
            <ContainerTable>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Test Name</th>
                  <th>Collection Container</th>
                  <th>Suffix</th>
                </tr>
              </thead>
              <tbody>
                {testContainers.map((test, index) => (
                  <tr key={index}>
                    <td className="id-col">{test.test_id}</td>
                    <td className="name-col">{test.test_name}</td>
                    <td className="container-col">{test.collection_container}</td>
                    <td style={{ fontWeight: '700', color: '#E53E3E' }}>{test.suffix || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </ContainerTable>
          </Card>
        )}

        <ButtonGroup>
          <BackButton type="button" onClick={() => window.history.back()}>
            Back
          </BackButton>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <SimpleSpinner style={{ width: '12px', height: '12px', borderWidth: '2px', marginRight: '8px', borderTopColor: '#fff', display: 'inline-block' }} />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </SubmitButton>


        </ButtonGroup>
      </FormContainer>
      {showTypeModal && (
        <StyledModal>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', verticalAlign: 'middle' }}>
            <h3 style={{ marginBottom: '1rem', color: '#112D4E', marginTop: 0 }}>Create New Employee Type</h3>
            <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem' }}>This type will be saved as a standard category in the database.</p>
            <StyledInput 
              placeholder="E.g. Full-Time, Consultant..."
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              style={{ marginBottom: '1.5rem', borderColor: '#3F72AF' }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                type="button"
                onClick={() => setShowTypeModal(false)}
                style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}
              >Cancel</button>
              <button 
                type="button"
                onClick={handleCreateEmployeeType}
                style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: '#3F72AF', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
              >Create Category</button>
            </div>
          </div>
        </StyledModal>
      )}
    </StyledContainer>
  );
};

export default EmployeeRegistration;