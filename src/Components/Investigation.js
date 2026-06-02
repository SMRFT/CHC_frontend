

import { useState, useEffect, useMemo } from "react"
import styled from "styled-components"
import axios from "axios"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Printer, Edit2, AlertCircle, X } from "lucide-react"

import HeaderImg from "./Images/Header.png"
import FooterImg from "./Images/Footer.png"

// Styled Components (existing)
const Container = styled.div`
  /* margin: 24px auto; */
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  background: linear-gradient(180deg, #ffffff, #F9F7F7);
  margin-left: 260px; /* Match sidebar desktop width */
  width: calc(100% - 260px);
  box-sizing: border-box;
  margin-top: 24px;
  margin-bottom: 24px;
  min-height: calc(100vh - 48px);
  max-width: none;

  @media (max-width: 1024px) {
    margin-left: 240px; /* Match sidebar tablet width */
    width: calc(100% - 240px);
  }

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    margin: 24px auto; /* Centered on mobile */
    padding: 1rem;
  }
`

const Header = styled.header`
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  text-align: center;
`

const PlainHeader = styled.div`
  color: #2d3748;
  padding: 0;
  margin-bottom: 2rem;
  text-align: center;
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
`

const PlainTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #2d3748;
`

const FiltersBar = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
`

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border-radius: 10px;
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  input {
    width: 280px;
    border: none;
    outline: none;
    font-weight: 800;
    color: #2d3748;
  }
`

const DPWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 10px;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  .react-datepicker-wrapper { width: 180px; }
  input {
    width: 100%;
    border: none;
    outline: none;
    font-weight: 600;
    color: #2d3748;
    cursor: pointer;
  }
`

const SelectWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 10px;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
`

const Select = styled.select`
  border: none;
  outline: none;
  font-weight: 700;
  color: #2d3748;
  background: transparent;
`

const ClearBtn = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  border: 2px solid #667eea;
  background: transparent;
  color: #667eea;
  font-weight: 700;
  transition: 0.2s;
  &:hover { background: #667eea; color: #fff; }
`

const FilterBtn = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 800;
  font-size: 15px;
  transition: 0.2s;
  &:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(118, 75, 162, 0.3); }
  &:active { transform: translateY(0); }
`

// Export buttons
const ExportWrap = styled.div`
  display: flex;
  gap: 8px;
`

const ExportBtn = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  border: 2px solid #10b981;
  background: transparent;
  color: #047857;
  font-weight: 700;
  transition: 0.2s;
  &:hover { background: #10b981; color: #fff; }
`

const CountBadge = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #eff6ff;
  border: 2px solid #bfdbfe;
  border-radius: 10px;
  padding: 6px 14px;
  font-family: inherit;
  min-width: 100px;
  
  .label {
    font-size: 10px;
    font-weight: 800;
    color: #1d4ed8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
  }
  
  .value {
    font-size: 14px;
    font-weight: 800;
    color: #1e40af;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(107, 140, 255, 0.15);
`

const TableHeader = styled.th`
  background-color: #667eea;
  color: white;
  padding: 18px 20px;
  text-align: left;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  &::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1), rgba(255,255,255,0.3));
  }
`

const TableRow = styled.tr`
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  &:nth-child(even) { background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%); }
  &:hover {
    background: linear-gradient(135deg, #e8ebff 0%, #dde1ff 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(107, 140, 255, 0.1);
  }
`

const TableCell = styled.td`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(107, 140, 255, 0.08);
  font-size: 14px;
  color: #2d3748;
  font-weight: 500;
  position: relative;
  &:first-child { font-weight: 600; color: #667eea; }
  &:last-child { text-align: center; }
`

const ToastContainer = styled.div`
  position: fixed; top: 20px; right: 20px; z-index: 1000;
`

const Toast = styled.div`
  background: ${(p) =>
    p.type === "success"
      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
      : p.type === "error"
        ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
        : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"}; color: white; padding: 16px 24px; border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2); margin-bottom: 10px;
  animation: slideIn 0.3s ease-out; backdrop-filter: blur(10px);
  display: flex; align-items: center; gap: 12px; font-weight: 600; max-width: 350px;
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0;} to { transform: translateX(0); opacity: 1;} }
`

const Grid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
`

const RowGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  margin-bottom: 12px;
`

const TwoColGrid = styled.div`
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
  margin-bottom: 12px;
`

const Field = styled.div` display: flex; flex-direction: column; `
const Label = styled.label` font-size: 20px; margin-bottom: 6px; color: #333; `

const Input = styled.input`
  padding: 12px 14px; border-radius: 8px; border: 1.5px solid #cbd5e0;
  font-size: 16px; color: #2d3748;
  &:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3); }
`

const TextArea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  padding: 12px 14px; border-radius: 8px; border: 1.5px solid #cbd5e0;
  font-size: 16px; color: #2d3748;
  font-family: inherit;
  &:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3); }
`

const Button = styled.button`
  padding: 12px 20px; border-radius: 12px; cursor: pointer; border: none;
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%); color: white; font-weight: 600;
  transition: 0.3s; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; position: relative; overflow: hidden;
  &::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: left 0.5s; }
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); &::before { left: 100%; } }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; &:hover::before { left: -100%; } }
`

const BackButton = styled(Button)`
  background: linear-gradient(90deg, #ff6b6b, #ff8e53); margin-bottom: 20px;
  &:hover { box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3); }
`

const FormContainer = styled.div`
  animation: fadeIn 0.3s ease-in-out;
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
`

// New UI bits for uploaded status
const UploadedChip = styled.span`
  display: inline-block;
  align-self: flex-start;
  margin-bottom: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #e6ffe6;
  color: #046c4e;
  font-weight: 700;
  font-size: 12px;
  border: 1px solid #b7efc5;
`

const SmallNote = styled.div`
  font-size: 11px;
  color: #718096;
  margin-top: 4px;
  word-break: break-all;
  max-width: 100%;
`

const ViewLink = styled.a`
  font-size: 12px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  margin-left: 10px;
  &:hover { text-decoration: underline; color: #1d4ed8; }
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const NoteButton = styled.button`
  background: #f3f4f6;
  border: 1.5px dashed #cbd5e0;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  color: #4a5568;
  font-weight: 600;
  transition: 0.2s;
  &:hover { background: #e2e8f0; border-color: #667eea; color: #667eea; }
`;

const DEFAULT_VITALS = {
  height_cm: "",
  weight_kg: "",
  bmi: "",
  blood_pressure: "",
  spo2: "",
}

const StatusBanner = styled.div`
  background: #fff3cd;
  color: #856404;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #ffeeba;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  font-size: 16px;
  animation: fadeIn 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);

  svg { color: #856404; }
`;

const TestStatsWrapper = styled.div`
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const TestStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const TestStatItem = styled.div`
  padding: 1rem;
  background: ${props => props.isActive ? '#eff6ff' : '#f8fafc'};
  border: 2px solid ${props => props.isActive ? '#3b82f6' : '#e2e8f0'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &:hover { 
    transform: translateY(-2px); 
    border-color: #3b82f6;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  &:active { transform: translateY(0); }

  .name { font-size: 0.8rem; font-weight: 700; color: ${props => props.isActive ? '#1d4ed8' : '#475569'}; margin-bottom: 0.5rem; }
  .count { font-size: 1.25rem; font-weight: 800; color: #1e40af; }
  .total { font-size: 0.75rem; color: #94a3b8; font-weight: 500; }
  
  ${props => props.isActive && `
    &::after {
      content: 'FILTER ACTIVE';
      position: absolute;
      top: -10px;
      right: 10px;
      background: #3b82f6;
      color: white;
      font-size: 0.6rem;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
    }
  `}
`;

const hasVitals = (emp) => {
  if (!emp || !emp.vitals) return false;
  let v = emp.vitals;
  if (typeof v === "string") {
    try {
      v = JSON.parse(v);
    } catch (e) {
      return false;
    }
  }
  return !!(
    (v.height_cm && String(v.height_cm).trim() !== "") ||
    (v.weight_kg && String(v.weight_kg).trim() !== "") ||
    (v.blood_pressure && String(v.blood_pressure).trim() !== "") ||
    (v.spo2 && String(v.spo2).trim() !== "") ||
    (v.bmi && String(v.bmi).trim() !== "")
  );
};

const SimpleSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid #e2e8f0;
  border-top-color: #3F72AF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function Investigation() {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  const [form, setForm] = useState({
    employee_id: "",
    age: "",
    gender: "",
    barcode: "",
    vitals: { height_cm: "", weight_kg: "", bmi: "", blood_pressure: "", spo2: "" },
    patient_history: "No Clinical History",
    visual_acuity: {
      distance: { right: "", left: "" },
      nearVision: { right: "", left: "" },
      colourVision: { right: "", left: "" },
      ocularmovement: { right: "", left: "" },
      complaints: "",
      remarks: "",
    },
    test_results: [], // Dynamic array of test objects
    dynamic_fields: [], // Dynamic investigation fields
    status: "pending",
  })

  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState({}) // Indices mapping to arrays

  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [toasts, setToasts] = useState([])

  // Date range state
  const [startDate, setStartDate] = useState(new Date()) // from
  const [endDate, setEndDate] = useState(new Date()) // to

  // Search state + debounce
  const [searchInput, setSearchInput] = useState("") // raw input
  const [debouncedSearch, setDebouncedSearch] = useState("") // debounced value
  // Inside Investigation component
  const [activeNoteIdx, setActiveNoteIdx] = useState(null); // Tracks the index of the test being edited
  const [statusFilter, setStatusFilter] = useState("any")
  const [pendingTestFilter, setPendingTestFilter] = useState("any")
  const [vitalsFilter, setVitalsFilter] = useState("any")
  const [companyFilter, setCompanyFilter] = useState("any")

  // Bulk Upload State
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkUploadTestId, setBulkUploadTestId] = useState("");
  const [bulkUploadFiles, setBulkUploadFiles] = useState([]);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(0);

  // New states for company and package selection in Bulk Upload
  const [companies, setCompanies] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bulkUploadCompanyId, setBulkUploadCompanyId] = useState("");
  const [bulkUploadPackageId, setBulkUploadPackageId] = useState("");
  const [bulkUploadAvailableTests, setBulkUploadAvailableTests] = useState([]);

  // Fetch companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${Labbaseurl}companies/`);
        setCompanies(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching companies:", err);
        showToast("Failed to load companies", "error");
      }
    };
    fetchCompanies();
  }, [Labbaseurl]);

  // Fetch packages when company changes
  useEffect(() => {
    if (bulkUploadCompanyId) {
      const fetchPackages = async () => {
        try {
          const res = await axios.get(`${Labbaseurl}get_packages/?company_id=${bulkUploadCompanyId}`);
          // The API returns an object { status: "success", data: [...] }
          setPackages(res.data?.data || []);
        } catch (err) {
          console.error("Error fetching packages:", err);
          showToast("Failed to load packages", "error");
        }
      };
      fetchPackages();
    } else {
      setPackages([]);
      setBulkUploadPackageId("");
      setBulkUploadAvailableTests([]);
      setBulkUploadTestId("");
    }
  }, [bulkUploadCompanyId, Labbaseurl]);

  // Update available tests when package changes
  useEffect(() => {
    if (bulkUploadPackageId) {
      const selectedPkg = packages.find(p => p.package_id === bulkUploadPackageId);
      if (selectedPkg && selectedPkg.investigations) {
        setBulkUploadAvailableTests(selectedPkg.investigations);
      } else {
        setBulkUploadAvailableTests([]);
      }
    } else {
      setBulkUploadAvailableTests([]);
    }
    setBulkUploadTestId(""); // Reset selected test
  }, [bulkUploadPackageId, packages]);


  const handleBulkUploadSubmit = async () => {
    if (!bulkUploadTestId || bulkUploadFiles.length === 0) {
      showToast("Please select a test type and files to upload", "error");
      return;
    }

    const formData = new FormData();
    formData.append("test_id", bulkUploadTestId);
    bulkUploadFiles.forEach(file => {
      formData.append("files", file);
    });

    setIsBulkUploading(true);
    setBulkUploadProgress(0);

    try {
      const response = await axios.post(`${Labbaseurl}bulk_upload_investigation_files/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setBulkUploadProgress(percentCompleted);
        }
      });

      if (response.status === 200) {
        showToast(`Bulk upload successful! ${response.data.results?.success || 0} files processed.`, "success");
        if (response.data.results?.failed > 0) {
          console.warn("Bulk upload errors:", response.data.results.errors);
          showToast(`${response.data.results.failed} files failed. See console for details.`, "error");
        }
        setShowBulkUpload(false);
        setBulkUploadFiles([]);
        setBulkUploadTestId("");
        // Refresh data
        refreshData(startDate, endDate);
      }
    } catch (error) {
      console.error("Bulk upload error:", error);
      showToast(error.response?.data?.error || "Bulk upload failed", "error");
    } finally {
      setIsBulkUploading(false);
      setBulkUploadProgress(0);
    }
  };

  // Get all unique CHC test names from all loaded employee test results
  const uniqueCHCTests = useMemo(() => {
    const testNames = new Set()
    employees.forEach(emp => {
      const results = emp.test_results || []
      results.forEach(t => {
        if (t.test_name) {
          testNames.add(t.test_name)
        }
      })
    })
    return Array.from(testNames).sort()
  }, [employees])

  // Helper filtered list of employees matching all active filters EXCEPT the pending test filter
  const filteredEmployeesForStats = useMemo(() => {
    return employees.filter((emp) => {
      // Search filter
      const q = debouncedSearch
      const matchesSearch =
        !q ||
        (emp.barcode && String(emp.barcode).toLowerCase().includes(q)) ||
        (emp.employee_id && String(emp.employee_id).toLowerCase().includes(q)) ||
        (emp.employee_name && String(emp.employee_name).toLowerCase().includes(q))
      if (!matchesSearch) return false

      // Overall status filter (check if ALL tests are complete)
      const billable = emp.billing_testdetails || []
      const chcBillable = billable.filter(bt => String(bt.test_id || "").toUpperCase().startsWith("CHCT"))
      const testResults = emp.test_results || []

      const pendingList = chcBillable.filter(bt => {
        const saved = testResults.find(t => String(t.test_id) === String(bt.test_id))
        return saved ? (bt.is_fileuploaded ? !(saved.files && saved.files.length > 0) : false) : true
      })

      const overallApproved = pendingList.length === 0
      const hasNoFiles = chcBillable.every(bt => {
        const saved = testResults.find(t => String(t.test_id) === String(bt.test_id))
        return saved ? (saved.files || []).length === 0 : true
      })

      if (statusFilter === "approved" && !overallApproved) return false
      if (statusFilter === "pending" && overallApproved) return false
      if (statusFilter === "no_files" && !hasNoFiles) return false

      // Vitals filter
      if (vitalsFilter !== "any") {
        const hasV = hasVitals(emp)
        if (vitalsFilter === "yes" && !hasV) return false
        if (vitalsFilter === "no" && hasV) return false
      }

      // Company filter
      if (companyFilter !== "any" && companyFilter !== "") {
        const matchesCompany =
          (emp.company_id && emp.company_id === companyFilter) ||
          (emp.company_name && emp.company_name === companyFilter)
        if (!matchesCompany) return false
      }

      return true
    })
  }, [employees, debouncedSearch, statusFilter, vitalsFilter, companyFilter])

  // Compose filters: search + date range + file filters (AND) + overall status filter + pending test filter
  const filteredEmployees = useMemo(() => {
    if (pendingTestFilter === "any") return filteredEmployeesForStats

    return filteredEmployeesForStats.filter((emp) => {
      const billable = emp.billing_testdetails || []
      const chcBillable = billable.filter(bt => String(bt.test_id || "").toUpperCase().startsWith("CHCT"))
      const testResults = emp.test_results || []

      const bt = chcBillable.find(b => (b.test_name || b.testname) === pendingTestFilter)
      if (!bt) return false
      
      const saved = testResults.find(t => String(t.test_id) === String(bt.test_id))
      const isCompleted = saved ? (bt.is_fileuploaded ? (saved.files && saved.files.length > 0) : true) : false
      return !isCompleted
    })
  }, [filteredEmployeesForStats, pendingTestFilter])

  // Get completion stats per test dynamically from all filtered employees (except pending test filter)
  const testStats = useMemo(() => {
    const stats = {}
    filteredEmployeesForStats.forEach(emp => {
      // Get all tests this employee is registered/billed for
      const billable = emp.billing_testdetails || []
      const chcBillable = billable.filter(bt => String(bt.test_id || "").toUpperCase().startsWith("CHCT"))
      
      // Get the saved test results if they exist
      const results = emp.test_results || []
      
      chcBillable.forEach(bt => {
        const testName = bt.test_name || bt.testname
        if (testName) {
          if (!stats[testName]) {
            stats[testName] = { total: 0, completed: 0 }
          }
          stats[testName].total += 1
          
          // Check if there is a saved result for this test
          const saved = results.find(t => String(t.test_id) === String(bt.test_id))
          if (saved) {
            const isDone = bt.is_fileuploaded ? (saved.files && saved.files.length > 0) : true
            if (isDone) {
              stats[testName].completed += 1
            }
          }
        }
      })
    })
    return stats
  }, [filteredEmployeesForStats])

  const handlePrintVitals = (emp) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;

    const vitals = emp.vitals || {};
    const dateStr = emp.created_date ? new Date(emp.created_date).toLocaleDateString() : new Date().toLocaleDateString();

    doc.open();
    doc.write(`
        <html>
            <head>
                <title>Vitals - ${emp.employee_name}</title>
                <style>
                    @page { size: portrait; margin: 10mm; }
                    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; margin: 0; padding: 0; color: #000; font-size: 13px; }
                    .report-header-space { height: 35mm; }
                    .report-footer-space { height: 35mm; }
                    .report-header { position: fixed; top: 0; left: 0; width: 100%; height: 35mm; }
                    .report-footer { position: fixed; bottom: 0; left: 0; width: 100%; height: 35mm; }
                    .header-img { width: 100%; height: auto; }
                    .footer-img { width: 100%; height: auto; }
                    .content-table { width: 100%; border-collapse: collapse; }
                    .main-content { padding: 5mm 5mm; }
                    .info-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
                    .info-table td { padding: 5px 0; vertical-align: top; width: 25%; }
                    .label { font-weight: bold; font-size: 13px; }
                    .value { font-size: 13px; }
                    .vitals-section { margin-top: 30px; }
                    .vitals-header { font-weight: bold; font-size: 16px; margin-bottom: 15px; text-decoration: underline; }
                    .vitals-grid { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    .vitals-grid td { padding: 8px; border: 1px solid #ccc; font-size: 13px; }
                    .vitals-label { font-weight: bold; width: 40%; }
                </style>
            </head>
            <body>
                <div class="report-header"><img src="${HeaderImg}" class="header-img" /></div>
                <div class="report-footer"><img src="${FooterImg}" class="footer-img" /></div>
                <table class="content-table">
                    <thead><tr><td><div class="report-header-space"></div></td></tr></thead>
                    <tbody>
                        <tr>
                            <td>
                                <div class="main-content">
                                    <table class="info-table">
                                        <tr>
                                            <td class="label">Name:</td>
                                            <td class="value">${emp.employee_name || "-"}</td>
                                            <td class="label">Date:</td>
                                            <td class="value">${dateStr}</td>
                                        </tr>
                                        <tr>
                                            <td class="label">Age/Gender:</td>
                                            <td class="value">${emp.age || "-"}/${emp.gender || "-"}</td>
                                            <td class="label">Ref.By:</td>
                                            <td class="value">${emp.company_name || "-"}</td>
                                        </tr>
                                        <tr>
                                            <td class="label">Barcode:</td>
                                            <td class="value" colspan="3">${emp.barcode || "-"}</td>
                                        </tr>
                                    </table>
                                    <table>
                                        <tr>
                                            <td class="label">Patient History:</td>
                                            <td class="value">${emp.patient_history || "No Clinical History"}</td>
                                        </tr>
                                    </table>
                                    <div class="vitals-section">
                                        <div class="vitals-header">VITALS:</div>
                                        <table class="vitals-grid">
                                            <thead>
                                                <tr>
                                                    <th style="background: #f7f7f7; border: 1px solid #ccc; padding: 8px; text-align: left;">Parameter</th>
                                                    <th style="background: #f7f7f7; border: 1px solid #ccc; padding: 8px; text-align: left;">Value</th>
                                                    <th style="background: #f7f7f7; border: 1px solid #ccc; padding: 8px; text-align: left;">Ref Range</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr><td class="vitals-label">Height (cm)</td><td>${vitals.height_cm || "-"}</td><td>-</td></tr>
                                                <tr><td class="vitals-label">Weight (kg)</td><td>${vitals.weight_kg || "-"}</td><td>-</td></tr>
                                                <tr><td class="vitals-label">BMI</td><td>${vitals.bmi || "-"} ${vitals.bmi_status ? `(${vitals.bmi_status})` : ""}</td><td>&lt;25</td></tr>
                                                <tr><td class="vitals-label">Blood Pressure</td><td>${vitals.blood_pressure || "-"} ${vitals.BP_status ? `(${vitals.BP_status})` : ""}</td><td>140/90 - 90/60</td></tr>
                                                <tr><td class="vitals-label">SpO2</td><td>${vitals.spo2 || "-"} ${vitals.spo2_status ? `(${vitals.spo2_status})` : ""}</td><td>60 - 100</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot><tr><td><div class="report-footer-space"></div></td></tr></tfoot>
                </table>
            </body>
        </html>
    `);
    doc.close();

    iframe.contentWindow.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
      }, 500);
    };
  };

  const showToast = (message, type = "info") => {
    const id = Date.now()
    const newToast = { id, message, type }
    setToasts((prev) => [...prev, newToast])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  // Reusable fetch + merge (Backend filtering)
  const refreshData = async (fDate, tDate) => {
    setLoading(true)
    let empUrl = `${Labbaseurl}get_all_employees/`
    let invUrl = `${Labbaseurl}get_investigations/`

    if (fDate) {
      const fd = fDate.toISOString().split("T")[0]
      empUrl += `?from_date=${fd}`
      invUrl += `?from_date=${fd}`
      if (tDate) {
        const td = tDate.toISOString().split("T")[0]
        empUrl += `&to_date=${td}`
        invUrl += `&to_date=${td}`
      }
    }

    try {
      const empRes = await axios.get(empUrl)
      const employeesData = empRes.data || []
      const invRes = await axios.get(invUrl)
      const investigationsData = invRes.data || []

      const merged = employeesData.map((emp) => {
        // Improved matching: use barcode if available, else fallback to employee_id
        const inv = investigationsData.find((i) => (i.barcode && emp.barcode && i.barcode === emp.barcode) || (i.employee_id === emp.employee_id && !i.barcode))
        return inv ? { ...emp, ...inv } : emp
      })

      setEmployees(merged)
      setLoading(false)
      return merged
    } catch (err) {
      setLoading(false)
      throw err
    }
  }

  const handleFilterSubmit = async () => {
    try {
      const merged = await refreshData(startDate, endDate)
      showToast(`${merged.length} records filtered successfully`, "success")
    } catch (err) {
      console.error(err)
      showToast("Failed to filter employees", "error")
    }
  }

  // Fetch employees & investigations on mount
  useEffect(() => {
    ; (async () => {
      try {
        const merged = await refreshData(startDate, endDate)
        if (merged.length > 0) showToast(`${merged.length} employees loaded successfully`, "success")
      } catch (err) {
        console.error(err)
        showToast("Failed to load employees or investigations", "error")
      }
    })()
  }, [Labbaseurl])

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase())
    }, 350)
    return () => clearTimeout(t)
  }, [searchInput])

  // Helpers
  const toMidnight = (d) => {
    if (!d) return null
    const dt = new Date(d)
    dt.setHours(0, 0, 0, 0)
    return dt
  }

  const hasValue = (x) => x !== null && x !== undefined && String(x).trim() !== ""



  const handleSelectEmployee = (empIdentifier) => {
    // Lookup by either employee_id or barcode
    const selectedEmployee = employees.find((emp) =>
      (emp.employee_id && emp.employee_id === empIdentifier) ||
      (emp.barcode && emp.barcode === empIdentifier)
    )
    if (selectedEmployee) {
      // Helper to parse JSON if string, or return as is
      const parseJson = (val, defaultVal = {}) => {
        if (typeof val === "string") {
          try {
            return JSON.parse(val)
          } catch (e) {
            return defaultVal
          }
        }
        return val || defaultVal
      }

      // Build the test_results array for the form
      let savedTests = parseJson(selectedEmployee.test_results, [])
      if (!Array.isArray(savedTests)) savedTests = []

      const billableTests = selectedEmployee.billing_testdetails || []

      // Combine: for each billable test, use saved results if available
      // Filter to only include CHCT tests as requested
      let activeTests = billableTests
        .filter(bt => String(bt.test_id || "").toUpperCase().startsWith("CHCT"))
        .map((bt) => {
          const saved = savedTests.find((st) => String(st.test_id) === String(bt.test_id))

          // Determine the report value.
          // Fallback order: saved.results.report -> saved.report -> bt.report (master template)
          let reportValue = "";
          if (saved) {
            if (saved.results && typeof saved.results.report === "string") {
              reportValue = saved.results.report;
            } else if (typeof saved.report === "string") {
              reportValue = saved.report;
            }
          }
          if (!reportValue && bt.report) {
            reportValue = bt.report;
          }

          return {
            test_id: bt.test_id,
            test_name: bt.test_name || bt.testname,
            is_fileuploaded: bt.is_fileuploaded,
            is_notes: bt.is_notes,
            is_report: bt.is_report,
            is_active: bt.is_active,
            results: saved && saved.results
              ? { ...saved.results, report: reportValue }
              : { report: reportValue },
            files: saved ? saved.files : [],
            notes: saved
              ? saved.notes
              : (bt.notes || "") // Use master note template if new
          }
        })

      setForm((prev) => ({
        ...prev,
        employee_id: selectedEmployee.employee_id,
        employee_name: selectedEmployee.employee_name,
        age: selectedEmployee.age,
        gender: selectedEmployee.gender,
        barcode: selectedEmployee.barcode,
        vitals: parseJson(selectedEmployee.vitals),
        patient_history: selectedEmployee.patient_history || "No Clinical History",
        visual_acuity: (() => {
          const defaultVA = {
            distance: { right: "", left: "" },
            nearVision: { right: "", left: "" },
            colourVision: { right: "", left: "" },
            ocularmovement: { right: "", left: "" },
            complaints: "",
            remarks: "",
          };
          const savedVA = parseJson(selectedEmployee.visual_acuity, defaultVA);
          const mergedVA = { ...defaultVA };
          Object.keys(defaultVA).forEach(key => {
            if (savedVA && savedVA[key]) {
              if (typeof defaultVA[key] === 'object' && defaultVA[key] !== null) {
                mergedVA[key] = { ...defaultVA[key], ...savedVA[key] };
              } else {
                mergedVA[key] = savedVA[key];
              }
            }
          });
          return mergedVA;
        })(),
        test_results: activeTests || [],
        dynamic_fields: parseJson(selectedEmployee.dynamic_fields, []),
        status: selectedEmployee.status || "pending"
      }))
    }
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBackToList = () => {
    setShowForm(false)
    setForm({
      employee_id: "",
      employee_name: "",
      age: "",
      gender: "",
      barcode: "",
      vitals: DEFAULT_VITALS,
      patient_history: "No Clinical History",
      test_results: [],
      status: "pending",
    })
    setFiles({})
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleVitalsChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, vitals: { ...prev.vitals, [name]: value } }))
  }

  const handleFileChange = (e, key) => {
    const fileList = Array.from(e.target.files)
    setFiles((prev) => ({ ...prev, [key]: fileList }))
  }

  const handleVisualAcuityChange = (key, eye, value) => {
    setForm(prev => {
      if (eye) { // Nested update (right/left)
        return {
          ...prev,
          visual_acuity: {
            ...prev.visual_acuity,
            [key]: {
              ...(prev.visual_acuity[key] || {}),
              [eye]: value
            }
          }
        }
      } else { // Top level update (complaints)
        return {
          ...prev,
          visual_acuity: {
            ...prev.visual_acuity,
            [key]: value
          }
        }
      }
    })
  }

  const handleTestChange = (testIdx, field, value, isResult = false) => {
    setForm(prev => {
      const newResults = [...prev.test_results]
      if (isResult) {
        newResults[testIdx].results = { ...newResults[testIdx].results, ...value }
      } else {
        newResults[testIdx][field] = value
      }
      return { ...prev, test_results: newResults }
    })
  }

  const handleTestFileChange = (e, testIdx) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length === 0) return
    setFiles(prev => {
      const existing = prev[testIdx] || []
      return {
        ...prev,
        [testIdx]: [...existing, ...selectedFiles]
      }
    })
    e.target.value = null; // Reset so same files can be selected again
  }

  const handleRemoveSelectedFile = (testIdx, fileIdx) => {
    setFiles(prev => {
      const list = [...(prev[testIdx] || [])]
      list.splice(fileIdx, 1)
      const next = { ...prev, [testIdx]: list }
      if (list.length === 0) delete next[testIdx]
      return next
    })
  }

  const handleDeleteFile = async (testIdx, fileId) => {
    if (!window.confirm("Are you sure you want to delete this file? This action cannot be undone.")) return

    try {
      const resp = await axios.post(`${Labbaseurl}delete_file_from_investigation/`, {
        barcode: form.barcode,
        test_id: form.test_results[testIdx].test_id,
        file_id: fileId
      })

      if (resp.data.status === "success") {
        showToast("File deleted successfully", "success")
        // Update local state to remove the file ID
        setForm(prev => {
          const newTests = [...prev.test_results]
          newTests[testIdx].files = newTests[testIdx].files.filter(fid => fid !== fileId)
          return { ...prev, test_results: newTests }
        })
      }
    } catch (err) {
      console.error("Delete error:", err)
      showToast(err.response?.data?.error || "Failed to delete file", "error")
    }
  }

  // Auto-calc BMI
  useEffect(() => {
    const h = Number.parseFloat(form.vitals.height_cm)
    const w = Number.parseFloat(form.vitals.weight_kg)
    if (h > 0 && w > 0) {
      const bmi = w / (h / 100) ** 2
      setForm((prev) => ({ ...prev, vitals: { ...prev.vitals, bmi: bmi.toFixed(2) } }))
    } else {
      setForm((prev) => ({ ...prev, vitals: { ...prev.vitals, bmi: "" } }))
    }
  }, [form.vitals.height_cm, form.vitals.weight_kg])

  // ----- CSV helpers -----
  const csvEscape = (val) => {
    if (val === null || val === undefined) return ""
    const s = String(val)
    const needsWrap = /[",\n]/.test(s)
    const doubled = s.replace(/"/g, '""')
    return needsWrap ? `"${doubled}"` : doubled
  }

  const toCsv = (rows, headers) => {
    const headerLine = headers.map(csvEscape).join(",")
    const lines = rows.map((r) => headers.map((h) => csvEscape(r[h])).join(","))
    return [headerLine, ...lines].join("\n")
  }

  const downloadCsv = (csvString, filenameBase) => {
    const BOM = "\uFEFF" // UTF-8 BOM for Excel
    const blob = new Blob([BOM, csvString], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")
    a.download = `${filenameBase}-${stamp}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const mapEmployeeToCsvRow = (emp) => {
    const billable = emp.billing_testdetails || []
    const chcBillable = billable.filter(bt => String(bt.test_id || "").toUpperCase().startsWith("CHCT"))
    const results = emp.test_results || []
    
    const pendingList = chcBillable.filter(bt => {
      const saved = results.find(t => String(t.test_id) === String(bt.test_id))
      return saved ? (bt.is_fileuploaded ? !(saved.files && saved.files.length > 0) : false) : true
    })
    
    const overallStatus = pendingList.length === 0 ? "Complete" : "Pending"
    const pendingNames = pendingList.map(bt => bt.test_name || bt.testname).join(", ")

    return {
      employee_id: emp.employee_id ?? "",
      employee_name: emp.employee_name ?? "",
      company_name: emp.company_name ?? "",
      age: emp.age ?? "",
      gender: emp.gender ?? "",
      barcode: emp.barcode ?? "",
      created_date: emp.created_date ?? "",
      status: overallStatus,
      pending_for: pendingNames,
    }
  }

  const exportFilteredCsv = () => {
    const rows = filteredEmployees.map(mapEmployeeToCsvRow)
    const headers = [
      "employee_id",
      "employee_name",
      "company_name",
      "age",
      "gender",
      "barcode",
      "created_date",
      "status",
      "pending_for",
    ]
    const csv = toCsv(rows, headers)
    downloadCsv(csv, "employees_filtered")
  }

  const exportPendingCsv = () => {
    const pendingRows = filteredEmployees
      .filter(
        (emp) => {
          const billable = emp.billing_testdetails || []
          const chcBillable = billable.filter(bt => String(bt.test_id || "").toUpperCase().startsWith("CHCT"))
          const results = emp.test_results || []
          
          return chcBillable.some(bt => {
            const saved = results.find(t => String(t.test_id) === String(bt.test_id))
            return saved ? (bt.is_fileuploaded ? !(saved.files && saved.files.length > 0) : false) : true
          })
        }
      )
      .map(mapEmployeeToCsvRow)
    const headers = [
      "employee_id",
      "employee_name",
      "company_name",
      "age",
      "gender",
      "barcode",
      "created_date",
      "status",
      "pending_for",
    ]
    const csv = toCsv(pendingRows, headers)
    downloadCsv(csv, "employees_pending")
  }
  // ----- End CSV helpers -----

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.employee_id) {
      showToast("Please select an employee first", "error")
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      const fd = new FormData()
      fd.append("employee_id", form.employee_id)
      fd.append("age", form.age)
      fd.append("gender", form.gender)
      fd.append("barcode", form.barcode)
      fd.append("patient_history", form.patient_history)

      const empData = employees.find(e =>
        (e.barcode && e.barcode === form.barcode) ||
        (e.employee_id && e.employee_id === form.employee_id)
      );
      fd.append("company_id", empData?.company_id || "CHC002")

      const vitalsToSend = {
        height_cm: form.vitals.height_cm || "",
        weight_kg: form.vitals.weight_kg || "",
        bmi: form.vitals.bmi || "",
        blood_pressure: form.vitals.blood_pressure || "",
        spo2: form.vitals.spo2 || "",
      }
      fd.append("vitals", JSON.stringify(vitalsToSend))
      fd.append("visual_acuity", JSON.stringify(form.visual_acuity))

      // Sending the dynamic test_results array
      fd.append("test_results", JSON.stringify(form.test_results))
      fd.append("dynamic_fields", JSON.stringify(form.dynamic_fields))

      // Mapping files: we'll use keys like "file_{idx}"
      Object.keys(files).forEach(testIdx => {
        if (files[testIdx] && files[testIdx].length > 0) {
          files[testIdx].forEach(file => {
            fd.append(`file_${testIdx}`, file)
          })
        }
      })

      await axios.post(`${Labbaseurl}save_investigation/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (evt.total) {
            const percent = Math.round((evt.loaded * 100) / evt.total)
            setProgress(percent)
          }
        },
      })

      showToast("Investigation results saved successfully!", "success")
      handleBackToList()
      await refreshData(startDate, endDate)
      setUploading(false)
      setProgress(0)
    } catch (err) {
      console.error("Submit error:", err)
      showToast("Failed to save investigation. Please check your data.", "error")
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <Container>
      <ToastContainer>
        {toasts.map((t) => (
          <Toast key={t.id} type={t.type}>
            <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
            {t.message}
          </Toast>
        ))}
      </ToastContainer>

      {!showForm ? (
        <>
          <Header>
            <Title>Employee List</Title>
          </Header>

          {/* Filters + Export */}
          <FiltersBar>
            <SearchWrap>
              <span style={{ fontWeight: 700, color: "#4a5568" }}>Search</span>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Barcode, Employee ID, Name"
              />
            </SearchWrap>
            <DPWrap>
              <span style={{ fontWeight: 700, color: "#4a5568" }}>From</span>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate || null}
                dateFormat="dd/MM/yyyy"
                isClearable
                placeholderText="Start date"
                popperPlacement="bottom-start"
              />
            </DPWrap>

            <DPWrap>
              <span style={{ fontWeight: 700, color: "#4a5568" }}>To</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || null}
                dateFormat="dd/MM/yyyy"
                isClearable
                placeholderText="End date"
                popperPlacement="bottom-start"
              />
            </DPWrap>

            {/* Overall Status filter */}
            <SelectWrap>
              <span style={{ fontWeight: 700, color: "#4a5568" }}>Status</span>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="any">Any</option>
                <option value="approved">Approved / Complete</option>
                <option value="pending">Pending</option>
                <option value="no_files">No Files Uploaded</option>
              </Select>
            </SelectWrap>

            {/* Vitals filter */}
            <SelectWrap>
              <span style={{ fontWeight: 700, color: "#4a5568" }}>Vitals</span>
              <Select value={vitalsFilter} onChange={(e) => setVitalsFilter(e.target.value)}>
                <option value="any">Any</option>
                <option value="yes">With Vitals</option>
                <option value="no">Without Vitals</option>
              </Select>
            </SelectWrap>

            {/* Company filter */}
            <SelectWrap>
              <span style={{ fontWeight: 700, color: "#4a5568" }}>Company</span>
              <Select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
                <option value="any">Any</option>
                {companies.map(comp => (
                  <option key={comp.company_id} value={comp.company_id}>{comp.company_name}</option>
                ))}
              </Select>
            </SelectWrap>

            <FilterBtn onClick={handleFilterSubmit}>
              Filter
            </FilterBtn>

            {(searchInput ||
              startDate ||
              endDate ||
              statusFilter !== "any" ||
              vitalsFilter !== "any" ||
              companyFilter !== "any" ||
              pendingTestFilter !== "any") && (
                <ClearBtn
                  onClick={async () => {
                    setSearchInput("")
                    setDebouncedSearch("")
                    const today = new Date()
                    setStartDate(today)
                    setEndDate(today)
                    setStatusFilter("any")
                    setVitalsFilter("any")
                    setCompanyFilter("any")
                    setPendingTestFilter("any")
                    try {
                      await refreshData(today, today)
                    } catch (err) {
                      console.error(err)
                    }
                  }}
                >
                  Clear Filters
                </ClearBtn>
              )}

            <CountBadge>
              <span className="label">Filtered Patients</span>
              <span className="value">{filteredEmployees.length} of {employees.length}</span>
            </CountBadge>

            {/* Export actions */}
            <ExportWrap>
              <ExportBtn onClick={exportFilteredCsv}>Download CSV (Filtered)</ExportBtn>
              <ExportBtn onClick={exportPendingCsv}>Download CSV (Pending)</ExportBtn>
              <FilterBtn onClick={() => setShowBulkUpload(true)}>Bulk Upload</FilterBtn>
            </ExportWrap>
          </FiltersBar>

          {showBulkUpload && (
            <ModalOverlay onClick={(e) => { if (e.target === e.currentTarget) setShowBulkUpload(false); }}>
              <ModalContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, color: '#3F72AF' }}>Bulk Upload Investigation Files</h3>
                  <X size={24} style={{ cursor: 'pointer', color: '#a0aec0' }} onClick={() => setShowBulkUpload(false)} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <Label>Select Company</Label>
                  <Select 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e0', marginBottom: '15px', background: '#fff' }}
                    value={bulkUploadCompanyId}
                    onChange={(e) => setBulkUploadCompanyId(e.target.value)}
                  >
                    <option value="">-- Select a Company --</option>
                    {companies.map(comp => (
                      <option key={comp.company_id} value={comp.company_id}>{comp.company_name}</option>
                    ))}
                  </Select>

                  {bulkUploadCompanyId && (
                    <>
                      <Label>Select Package</Label>
                      <Select 
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e0', marginBottom: '15px', background: '#fff' }}
                        value={bulkUploadPackageId}
                        onChange={(e) => setBulkUploadPackageId(e.target.value)}
                      >
                        <option value="">-- Select a Package --</option>
                        {packages.map(pkg => (
                          <option key={pkg.package_id} value={pkg.package_id}>{pkg.package_name}</option>
                        ))}
                      </Select>
                    </>
                  )}

                  {bulkUploadPackageId && (
                    <>
                      <Label>Select Test Type</Label>
                      <Select 
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e0', marginBottom: '15px', background: '#fff' }}
                        value={bulkUploadTestId}
                        onChange={(e) => setBulkUploadTestId(e.target.value)}
                      >
                        <option value="">-- Select a Test --</option>
                        {bulkUploadAvailableTests.map((test, idx) => (
                           <option key={test.test_id || idx} value={test.test_id}>{test.testname}</option>
                        ))}
                      </Select>
                    </>
                  )}

                  {bulkUploadTestId && (
                    <>
                      <Label>Select Files (Filenames must contain/be barcodes)</Label>
                      <Input 
                        type="file" 
                        multiple 
                        style={{ width: '100%', boxSizing: 'border-box' }}
                        onChange={(e) => setBulkUploadFiles(Array.from(e.target.files))}
                      />
                      {bulkUploadFiles.length > 0 && (
                        <div style={{ marginTop: '10px', fontSize: '14px', color: '#4a5568' }}>
                          {bulkUploadFiles.length} file(s) selected
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <ClearBtn onClick={() => setShowBulkUpload(false)}>Cancel</ClearBtn>
                  <Button 
                    onClick={handleBulkUploadSubmit} 
                    disabled={isBulkUploading || !bulkUploadTestId || bulkUploadFiles.length === 0}
                  >
                    {isBulkUploading ? `Uploading... ${bulkUploadProgress}%` : "Upload Files"}
                  </Button>
                </div>
              </ModalContent>
            </ModalOverlay>
          )}

          {/* Completion per test cards */}
          {Object.keys(testStats).length > 0 && (
            <TestStatsWrapper>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                  COMPLETION PER TEST
                  <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginTop: '4px' }}>Click a test card to filter patients with <strong>PENDING</strong> status</div>
                </div>
                {pendingTestFilter !== "any" && (
                  <ClearBtn 
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={() => setPendingTestFilter("any")}
                  >
                    <X size={12} style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }} /> Clear Filter
                  </ClearBtn>
                )}
              </div>
              <TestStatsGrid>
                {Object.entries(testStats).map(([name, data]) => (
                  <TestStatItem 
                    key={name} 
                    onClick={() => {
                      if (pendingTestFilter === name) {
                        setPendingTestFilter("any")
                      } else {
                        setPendingTestFilter(name)
                      }
                    }}
                    isActive={pendingTestFilter === name}
                  >
                    <div className="name" style={{ textTransform: 'uppercase' }}>{name}</div>
                    <div className="count">{data.completed} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>done</span></div>
                    <div className="total">of {data.total} patients</div>
                  </TestStatItem>
                ))}
              </TestStatsGrid>
            </TestStatsWrapper>
          )}

          <Table>
            <thead>
              <tr>
                <TableHeader style={{ width: "50px" }}>S.No</TableHeader>
                <TableHeader>Employee ID</TableHeader>
                <TableHeader>Employee Name</TableHeader>
                <TableHeader>Company</TableHeader>
                <TableHeader>Age</TableHeader>
                <TableHeader>Gender</TableHeader>
                <TableHeader>Barcode</TableHeader>
                <TableHeader>Pending CHC Tests</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <TableCell colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#666', fontWeight: 600 }}>
                    <SimpleSpinner /> Loading records...
                  </TableCell>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <TableCell colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    No employees found.
                  </TableCell>
                </tr>
              ) : (
                filteredEmployees.map((emp, index) => {
                  const billable = emp.billing_testdetails || []
                  const chcBillable = billable.filter(bt => String(bt.test_id || "").toUpperCase().startsWith("CHCT"))
                  const results = emp.test_results || []
                  const pendingTests = chcBillable.filter(bt => {
                    const saved = results.find(t => String(t.test_id) === String(bt.test_id))
                    return saved ? (bt.is_fileuploaded ? !(saved.files && saved.files.length > 0) : false) : true
                  })

                  return (
                    <TableRow key={emp.barcode || emp.employee_id} style={{ background: hasVitals(emp) ? "#e6ffe6" : "inherit" }}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{emp.employee_id || "N/A"}</TableCell>
                      <TableCell>{emp.employee_name}</TableCell>
                      <TableCell>{emp.company_name || "-"}</TableCell>
                      <TableCell>{emp.age}</TableCell>
                      <TableCell>{emp.gender}</TableCell>
                      <TableCell>{emp.barcode}</TableCell>
                      <TableCell>
                        {pendingTests.length === 0 ? (
                          <span style={{ color: "#10b981", fontWeight: "bold" }}>None (Complete)</span>
                        ) : (
                          <div>
                            <span style={{ color: "#e53e3e", fontWeight: "bold" }}>
                              {pendingTests.length} Pending
                            </span>
                            <div style={{ fontSize: "11px", color: "#718096", marginTop: "4px" }}>
                              {pendingTests.map(bt => bt.test_name || bt.testname).join(", ")}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <Button onClick={() => handleSelectEmployee(emp.barcode || emp.employee_id)}>Open Investigation</Button>
                          <Button
                            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                            onClick={() => handlePrintVitals(emp)}
                          >
                            <Printer size={14} style={{ marginRight: '5px' }} /> Print Vitals
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </tbody>
          </Table>
        </>
      ) : (
        <FormContainer>
          <BackButton onClick={handleBackToList}>← Back to Employee List</BackButton>
          <PlainHeader>
            <PlainTitle>Employee Investigation</PlainTitle>
          </PlainHeader>

          {form.status === 'approved' && (
            <StatusBanner>
              <AlertCircle size={24} />
              This report is approved and cannot be edited.
            </StatusBanner>
          )}

          <form onSubmit={handleSubmit}>
            <Grid>
              <Field>
                <Label>Employee ID</Label>
                <Input name="employee_id" value={form.employee_id} readOnly />
              </Field>
              <Field>
                <Label>Employee Name</Label>
                <Input name="employee_name" value={form.employee_name} readOnly />
              </Field>              
              <Field>
                <Label>Barcode</Label>
                <Input name="barcode" value={form.barcode} readOnly />
              </Field>
              <Field>
                <Label>Age</Label>
                <Input name="age" value={form.age} readOnly />
              </Field>
              <Field>
                <Label>Gender</Label>
                <Input name="gender" value={form.gender} readOnly />
              </Field>
              <Field>
                <Label>Height (cm)</Label>
                <Input name="height_cm" type="number" value={form.vitals.height_cm} onChange={handleVitalsChange} />
              </Field>
              <Field>
                <Label>Weight (kg)</Label>
                <Input name="weight_kg" type="number" value={form.vitals.weight_kg} onChange={handleVitalsChange} />
              </Field>
              <Field>
                <Label>BMI</Label>
                <Input name="bmi" value={form.vitals.bmi} readOnly />
              </Field>
              <Field>
                <Label>Blood Pressure (mmHg)</Label>
                <Input name="blood_pressure" value={form.vitals.blood_pressure} onChange={handleVitalsChange} disabled={form.status === 'approved'} />
              </Field>
              <Field>
                <Label>SpO2 (%)</Label>
                <Input name="spo2" value={form.vitals.spo2} onChange={handleVitalsChange} disabled={form.status === 'approved'} />
              </Field>

              <Field style={{ gridColumn: "1 / -1" }}>
                <Label>Patient History</Label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <TextArea 
                    name="patient_history" 
                    rows="4" 
                    value={form.patient_history} 
                    onChange={handleChange} 
                    disabled={form.status === 'approved'}
                    style={{ paddingRight: '100px' }}
                    placeholder="Enter patient history or use the Edit tool..."
                  />
                  <button
                    type="button"
                    onClick={() => setActiveNoteIdx(-1)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '12px',
                      background: '#fff',
                      border: '1.5px solid #edf2f7',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      color: '#4A5568',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.target.style.background = '#f7fafc'; e.target.style.borderColor = '#cbd5e0'; }}
                    onMouseOut={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#edf2f7'; }}
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                </div>
              </Field>
            </Grid>

            {/* Dynamic Fields Section (Moved after Patient History) */}
            {form.dynamic_fields && form.dynamic_fields.length > 0 && (
              <div style={{ marginTop: '25px', marginBottom: '25px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                <h3 style={{ color: '#3F72AF', marginBottom: '20px', textTransform: 'uppercase' }}>Additional Investigation Fields</h3>
                {form.dynamic_fields.map((field, fIdx) => (
                  <div key={field.field_id} style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#4A5568', marginBottom: '10px', fontSize: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px' }}>{field.field_name}</h4>
                    <TwoColGrid>
                      {(field.field_values || []).map((valObj, vIdx) => {
                        // Support both formats: {key: val} and {key: "...", value: "..."}
                        const key = valObj.key || Object.keys(valObj)[0];
                        const value = valObj.value !== undefined ? valObj.value : valObj[key];
                        
                        return (
                          <Field key={vIdx}>
                            <Label style={{ fontSize: '14px', color: '#718096', fontWeight: '600' }}>{key}</Label>
                            <Input 
                              value={value || ""}
                              placeholder={`Enter ${key}...`}
                              onChange={(e) => {
                                const newFields = [...form.dynamic_fields];
                                const newValObj = {...newFields[fIdx].field_values[vIdx]};
                                if (newValObj.value !== undefined) {
                                  newValObj.value = e.target.value;
                                } else {
                                  newValObj[key] = e.target.value;
                                }
                                newFields[fIdx].field_values[vIdx] = newValObj;
                                setForm({...form, dynamic_fields: newFields});
                              }}
                              disabled={form.status === 'approved'}
                            />
                          </Field>
                        );
                      })}
                    </TwoColGrid>
                  </div>
                ))}
              </div>
            )}
            <br />
            <br />
            {/* 100% Dynamic Rendering of Test Sections */}
            {form.test_results.map((test, idx) => {
              const testName = (test.test_name || "").toUpperCase();
              const isOphth = testName.includes("OPHTHALMOLOGY") || testName.includes("OPTHOLMOLOGY") || testName.includes("EYE") || testName.includes("VISUAL");
              const isXray = testName.includes("X-RAY") || testName.includes("XRAY");

              // 1. Ophthalmology (Specialized)
              if (isOphth || String(test.test_id).toUpperCase() === "CHCT001") {
                const va = form.visual_acuity;
                const setVA = handleVisualAcuityChange;

                return (
                  <div key={idx} style={{ marginBottom: '25px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff' }}>
                    <h3 style={{ color: '#3F72AF', marginBottom: '15px', textTransform: 'uppercase' }}>{test.test_name} Investigation</h3>
                    {[
                      { label: "Distance", key: "distance" },
                      { label: "Near Vision", key: "nearVision" },
                      { label: "Colour Vision", key: "colourVision" },
                      { label: "Ocular Movement", key: "ocularmovement" }
                    ].map(item => (
                      <RowGrid key={item.key} style={{ alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ fontWeight: 800, color: '#112D4E', width: '150px' }}>{item.label}</div>
                        <Input placeholder="Right Eye" value={va[item.key]?.right ?? ""} onChange={e => setVA(item.key, 'right', e.target.value)} disabled={form.status === 'approved'} />
                        <Input placeholder="Left Eye" value={va[item.key]?.left ?? ""} onChange={e => setVA(item.key, 'left', e.target.value)} disabled={form.status === 'approved'} />
                      </RowGrid>
                    ))}
                    <br />
                    <TwoColGrid>
                      <Field>
                        <Label>Patient Complaints</Label>
                        <TextArea
                          value={form.visual_acuity.complaints || ""}
                          onChange={e => handleVisualAcuityChange("complaints", null, e.target.value)}
                          disabled={form.status === 'approved'}
                          placeholder="Complaints..."
                          rows={3}
                        />
                      </Field>
                      <Field>
                        <Label>Remarks</Label>
                        <TextArea
                          value={form.visual_acuity.remarks || ""}
                          onChange={e => handleVisualAcuityChange("remarks", null, e.target.value)}
                          disabled={form.status === 'approved'}
                          placeholder="Remarks..."
                          rows={3}
                        />
                      </Field>
                    </TwoColGrid>
                    {test.is_notes === true && (
                      <Field style={{ marginTop: '15px', gridColumn: '1 / -1' }}>
                        <Label>Notes</Label>
                        <div style={{ position: 'relative', width: '100%' }}>
                          <TextArea
                            value={test.notes || ""}
                            onChange={e => handleTestChange(idx, "notes", e.target.value)}
                            disabled={form.status === 'approved'}
                            placeholder="Enter notes..."
                            rows={3}
                            style={{ paddingRight: '100px' }}
                          />
                          <button
                            type="button"
                            onClick={() => setActiveNoteIdx(idx)}
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '12px',
                              background: '#fff',
                              border: '1.5px solid #edf2f7',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                              color: '#4A5568',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '12px'
                            }}
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                        </div>
                        {test.notes && <SmallNote style={{ marginTop: '5px' }}>Total characters: {test.notes.length}</SmallNote>}
                      </Field>
                    )}
                    {test.is_fileuploaded === true && (
                      <Field style={{ marginTop: '15px' }}>
                        <Label>File Upload (Optional)</Label>
                        {(test.files || []).length > 0 && (
                          <div style={{ marginBottom: '8px' }}>
                            <UploadedChip>Already uploaded</UploadedChip>
                            {test.files.map((fid, i) => (
                              <div key={fid} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                <ViewLink href={`${Labbaseurl}get_file/${fid}/`} target="_blank" rel="noreferrer">
                                  View File {test.files.length > 1 ? i + 1 : ""}
                                </ViewLink>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFile(idx, fid)}
                                  style={{ background: 'none', border: 'none', color: '#ef4444', marginLeft: '10px', cursor: 'pointer', fontSize: '14px' }}
                                  title="Delete File"
                                >
                                  🗑️
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <Input type="file" multiple onChange={(e) => handleTestFileChange(e, idx)} disabled={form.status === 'approved'} />
                        {files[idx] && files[idx].length > 0 && (
                          <div style={{ marginTop: '5px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '12px', fontWeight: 700, color: '#4a5568' }}>Selected ({files[idx].length}):</span>
                              <button type="button" onClick={() => setFiles(prev => { const n = { ...prev }; delete n[idx]; return n; })} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}>Clear All</button>
                            </div>
                            {files[idx].map((f, i) => (
                              <SmallNote key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>● {f.name}</span>
                                <button type="button" onClick={() => handleRemoveSelectedFile(idx, i)} style={{ background: 'none', border: 'none', color: '#ef4444', padding: '0 5px', cursor: 'pointer' }}>×</button>
                              </SmallNote>
                            ))}
                          </div>
                        )}
                        {(test.files || []).length > 0 && <SmallNote>Uploaded File IDs: {test.files.join(", ")}</SmallNote>}
                      </Field>
                    )}
                  </div>
                );
              }

              // 2. X-Ray (Specialized)
              if (isXray) {
                return (
                  <div key={idx} style={{ marginBottom: '25px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff' }}>
                    <h3 style={{ color: '#3F72AF', marginBottom: '15px', textTransform: 'uppercase' }}>{test.test_name} Investigation</h3>
                    <TwoColGrid>
                      {test.is_fileuploaded === true && (
                        <Field>
                          <Label>Film Upload</Label>
                          {(test.files || []).length > 0 && (
                            <div style={{ marginBottom: '8px' }}>
                              <UploadedChip>Already uploaded</UploadedChip>
                              {test.files.map((fid, i) => (
                                <div key={fid} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                  <ViewLink href={`${Labbaseurl}get_file/${fid}/`} target="_blank" rel="noreferrer">
                                    View File {test.files.length > 1 ? i + 1 : ""}
                                  </ViewLink>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteFile(idx, fid)}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', marginLeft: '10px', cursor: 'pointer', fontSize: '14px' }}
                                    title="Delete File"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <Input type="file" multiple onChange={(e) => handleTestFileChange(e, idx)} disabled={form.status === 'approved'} />
                          {files[idx] && files[idx].length > 0 && (
                            <div style={{ marginTop: '5px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#4a5568' }}>Selected ({files[idx].length}):</span>
                                <button type="button" onClick={() => setFiles(prev => { const n = { ...prev }; delete n[idx]; return n; })} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}>Clear All</button>
                              </div>
                              {files[idx].map((f, i) => (
                                <SmallNote key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span>● {f.name}</span>
                                  <button type="button" onClick={() => handleRemoveSelectedFile(idx, i)} style={{ background: 'none', border: 'none', color: '#ef4444', padding: '0 5px', cursor: 'pointer' }}>×</button>
                                </SmallNote>
                              ))}
                            </div>
                          )}
                          {(test.files || []).length > 0 && <SmallNote>Uploaded File IDs: {test.files.join(", ")}</SmallNote>}
                        </Field>
                      )}
                      {test.is_notes === true && (
                        <Field style={{ gridColumn: '1 / -1' }}>
                          <Label>Notes</Label>
                          <div style={{ position: 'relative', width: '100%' }}>
                            <TextArea
                              value={test.notes || ""}
                              onChange={(e) => handleTestChange(idx, 'notes', e.target.value)}
                              disabled={form.status === 'approved'}
                              placeholder="Notes..."
                              rows={3}
                              style={{ width: '100%', paddingRight: '100px' }}
                            />
                            <button
                              type="button"
                              onClick={() => setActiveNoteIdx(idx)}
                              style={{
                                position: 'absolute',
                                right: '12px',
                                top: '12px',
                                background: '#fff',
                                border: '1.5px solid #edf2f7',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                                color: '#4A5568',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12px'
                              }}
                            >
                              <Edit2 size={12} /> Edit
                            </button>
                          </div>
                        </Field>
                      )}
                    </TwoColGrid>
                    {test.is_report === true && (
                      <Field style={{ marginTop: '12px', gridColumn: "1 / -1" }}>
                        <Label>Report / Findings</Label>
                        <TextArea
                          value={test.results?.report || ""}
                          onChange={(e) => handleTestChange(idx, 'results', { report: e.target.value }, true)}
                          disabled={form.status === 'approved'}
                          placeholder="Clinical Report..."
                          rows={6}
                        />
                      </Field>
                    )}
                  </div>
                );
              }

              // 3. Generic Rendering
              return (
                <div key={idx} style={{ marginBottom: '25px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff' }}>
                  <h3 style={{ color: '#3F72AF', marginBottom: '15px', textTransform: 'uppercase' }}>{test.test_name} Investigation</h3>
                  <TwoColGrid>
                    {test.is_fileuploaded === true && (
                      <Field>
                        <Label>File Upload</Label>
                        {(test.files || []).length > 0 && (
                          <div style={{ marginBottom: '8px' }}>
                            <UploadedChip>Already uploaded</UploadedChip>
                            {test.files.map((fid, i) => (
                              <div key={fid} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                                <ViewLink href={`${Labbaseurl}get_file/${fid}/`} target="_blank" rel="noreferrer">
                                  View File {test.files.length > 1 ? i + 1 : ""}
                                </ViewLink>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFile(idx, fid)}
                                  style={{ background: 'none', border: 'none', color: '#ef4444', marginLeft: '10px', cursor: 'pointer', fontSize: '14px' }}
                                  title="Delete File"
                                >
                                  🗑️
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <Input type="file" multiple onChange={(e) => handleTestFileChange(e, idx)} disabled={form.status === 'approved'} />
                        {files[idx] && files[idx].length > 0 && (
                          <div style={{ marginTop: '5px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '12px', fontWeight: 700, color: '#4a5568' }}>Selected ({files[idx].length}):</span>
                              <button type="button" onClick={() => setFiles(prev => { const n = { ...prev }; delete n[idx]; return n; })} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}>Clear All</button>
                            </div>
                            {files[idx].map((f, i) => (
                              <SmallNote key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>● {f.name}</span>
                                <button type="button" onClick={() => handleRemoveSelectedFile(idx, i)} style={{ background: 'none', border: 'none', color: '#ef4444', padding: '0 5px', cursor: 'pointer' }}>×</button>
                              </SmallNote>
                            ))}
                          </div>
                        )}
                        {(test.files || []).length > 0 && <SmallNote>Uploaded File IDs: {test.files.join(", ")}</SmallNote>}
                      </Field>
                    )}
                    {test.is_notes === true && (
                      <Field style={{ gridColumn: '1 / -1' }}>
                        <Label>Notes</Label>
                        <div style={{ position: 'relative', width: '100%' }}>
                          <TextArea
                            value={test.notes || ""}
                            onChange={(e) => handleTestChange(idx, 'notes', e.target.value)}
                            disabled={form.status === 'approved'}
                            placeholder="Enter detailed notes..."
                            rows={4}
                            style={{ paddingRight: '100px' }}
                          />
                          <button
                            type="button"
                            onClick={() => setActiveNoteIdx(idx)}
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '12px',
                              background: '#fff',
                              border: '1.5px solid #edf2f7',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                              color: '#4A5568',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '12px'
                            }}
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                        </div>
                      </Field>
                    )}
                    {test.is_report === true && (
                      <Field style={{ gridColumn: test.is_notes === true ? "1 / -1" : "auto", marginTop: test.is_notes === true ? "15px" : "0" }}>
                        <Label>Observations / Results / Report</Label>
                        <TextArea
                          value={test.results?.report || ""}
                          onChange={(e) => handleTestChange(idx, 'results', { report: e.target.value }, true)}
                          disabled={form.status === 'approved'}
                          placeholder="Enter clinical report..."
                          rows={6}
                        />
                      </Field>
                    )}
                  </TwoColGrid>
                </div>
              );
            })}
            <br />

            <Button type="submit" disabled={uploading || form.status === 'approved'}>
              {form.status === 'approved' ? "Report Approved (Read Only)" : uploading ? `Uploading ${progress}%` : "Submit All Results"}
            </Button>
          </form>
        </FormContainer>
      )}

      {/* Note Edit Modal */}
      {activeNoteIdx !== null && (
        <ModalOverlay onClick={() => setActiveNoteIdx(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #f0f2f5', paddingBottom: '15px' }}>
              <div>
                <h2 style={{ margin: 0, color: '#112D4E', fontSize: '1.5rem' }}>
                  {activeNoteIdx === -1 ? "Patient Medical History" : (form.test_results[activeNoteIdx]?.test_name || "Investigation Note")} 
                </h2>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Clinical Findings & Observations</span>
              </div>
              <button 
                onClick={() => setActiveNoteIdx(null)} 
                style={{ 
                  background: '#f8fafc', 
                  border: 'none', 
                  fontSize: '24px', 
                  cursor: 'pointer', 
                  color: '#94a3b8', 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  transition: '0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                ×
              </button>
            </div>
            
            <Field style={{ marginBottom: '20px' }}>
              <TextArea
                style={{ 
                  width: '100%', 
                  minHeight: '400px', 
                  fontSize: '16px', 
                  lineHeight: '1.6', 
                  padding: '20px', 
                  border: '2px solid #e2e8f0', 
                  borderRadius: '16px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                  fontFamily: 'inherit'
                }}
                autoFocus
                value={activeNoteIdx === -1 ? (form.patient_history || "") : (form.test_results[activeNoteIdx]?.notes || "")}
                onChange={(e) => {
                  if (activeNoteIdx === -1) {
                    setForm(prev => ({ ...prev, patient_history: e.target.value }));
                  } else {
                    handleTestChange(activeNoteIdx, 'notes', e.target.value);
                  }
                }}
                placeholder="Enter detailed clinical content here... Use shift+enter for new lines."
              />
            </Field>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <Button 
                onClick={() => setActiveNoteIdx(null)}
                style={{ 
                  background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                  boxShadow: '0 4px 12px rgba(148, 163, 184, 0.3)'
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setActiveNoteIdx(null)}
                style={{ 
                  background: 'linear-gradient(135deg, #3F72AF 0%, #112D4E 100%)',
                  boxShadow: '0 4px 12px rgba(63, 114, 175, 0.3)',
                  padding: '12px 30px'
                }}
              >
                Save Findings
              </Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}