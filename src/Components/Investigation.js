

import { useState, useEffect, useMemo } from "react"
import styled from "styled-components"
import axios from "axios"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

// Styled Components (existing)
const Container = styled.div`
  max-width: 1600px;
  /* margin: 24px auto; */
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  background: linear-gradient(180deg, #ffffff, #F9F7F7);
  margin-left: 260px; /* Match sidebar desktop width */
  margin-top: 24px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    margin-left: 240px; /* Match sidebar tablet width */
  }

  @media (max-width: 768px) {
    margin-left: 0;
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
  gap: 8px;
  background: #fff;
  border-radius: 10px;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  input {
    width: 240px;
    border: none;
    outline: none;
    font-weight: 600;
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
  padding: 12px 14px; border-radius: 8px; border: 1.5px solid #cbd5e0;
  font-size: 16px; color: #2d3748;
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
`

const ViewLink = styled.a`
  font-size: 12px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  margin-left: 10px;
  &:hover { text-decoration: underline; color: #1d4ed8; }
`

const DEFAULT_VITALS = {
  height_cm: "",
  weight_kg: "",
  bmi: "",
  blood_pressure: "",
  spo2: "",
}

export default function Investigation() {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  const [form, setForm] = useState({
    employee_id: "",
    age: "",
    gender: "",
    barcode: "",
    vitals: { height_cm: "", weight_kg: "", bmi: "", blood_pressure: "", spo2: "" },
    patient_history: "",
    test_results: [], // Dynamic array of test objects
  })

  const [employees, setEmployees] = useState([])
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

  // Overall status filter
  const [statusFilter, setStatusFilter] = useState("any")

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
    return merged
  }

  // Fetch employees & investigations on mount or date change
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
  }, [Labbaseurl, startDate, endDate])

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

  // Compose filters: search + date range + file filters (AND) + overall status filter
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Search filter
      const q = debouncedSearch
      const matchesSearch =
        !q ||
        (emp.barcode && String(emp.barcode).toLowerCase().includes(q)) ||
        (emp.employee_id && String(emp.employee_id).toLowerCase().includes(q)) ||
        (emp.employee_name && String(emp.employee_name).toLowerCase().includes(q))
      if (!matchesSearch) return false

      // Overall status filter (check if ALL tests have files)
      const testResults = emp.test_results
      const isArray = Array.isArray(testResults)
      const overallApproved = isArray && testResults.length > 0 && testResults.every(t => (t.files || []).length > 0)

      if (statusFilter === "approved" && !overallApproved) return false
      if (statusFilter === "pending" && overallApproved) return false

      return true
    })
  }, [employees, debouncedSearch, startDate, endDate, statusFilter])

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
          return {
            test_id: bt.test_id,
            test_name: bt.test_name || bt.testname,
            is_fileuploaded: bt.is_fileuploaded,
            is_notes: bt.is_notes,
            is_report: bt.is_report,
            is_active: bt.is_active,
            results: saved
              ? saved.results
              : { report: bt.report || "" }, // Use master report template if new
            files: saved ? saved.files : [],
            notes: saved
              ? saved.notes
              : (bt.notes || "") // Use master note template if new
          }
        })

      setForm((prev) => ({
        ...prev,
        employee_id: selectedEmployee.employee_id,
        age: selectedEmployee.age,
        gender: selectedEmployee.gender,
        barcode: selectedEmployee.barcode,
        vitals: parseJson(selectedEmployee.vitals),
        patient_history: selectedEmployee.patient_history || "",
        test_results: activeTests || []
      }))
    }
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBackToList = () => {
    setShowForm(false)
    setForm({
      employee_id: "",
      age: "",
      gender: "",
      barcode: "",
      vitals: DEFAULT_VITALS,
      patient_history: "",
      test_results: [],
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
    setForm(prev => ({
      ...prev,
      visual_acuity: {
        ...prev.visual_acuity,
        [key]: {
          ...prev.visual_acuity[key],
          [eye]: value
        }
      }
    }))
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
    const results = emp.test_results || []

    const overallStatus = results.length > 0 && results.every(t => (t.files || []).length > 0) ? "Complete" : "Pending"
    const pendingTests = results.filter(t => (t.files || []).length === 0).map(t => t.test_name).join(", ")

    return {
      employee_id: emp.employee_id ?? "",
      employee_name: emp.employee_name ?? "",
      age: emp.age ?? "",
      gender: emp.gender ?? "",
      barcode: emp.barcode ?? "",
      created_date: emp.created_date ?? "",
      status: overallStatus,
      pending_for: pendingTests,
    }
  }

  const exportFilteredCsv = () => {
    const rows = filteredEmployees.map(mapEmployeeToCsvRow)
    const headers = [
      "employee_id",
      "employee_name",
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
          const testResults = emp.test_results || [];
          return testResults.some(t => (t.files || []).length === 0);
        }
      )
      .map(mapEmployeeToCsvRow)
    const headers = [
      "employee_id",
      "employee_name",
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

      // Sending the dynamic test_results array
      fd.append("test_results", JSON.stringify(form.test_results))

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
              </Select>
            </SelectWrap>

            {(searchInput ||
              startDate ||
              endDate ||
              statusFilter !== "any") && (
                <ClearBtn
                  onClick={() => {
                    setSearchInput("")
                    setDebouncedSearch("")
                    setStartDate(new Date())
                    setEndDate(new Date())
                    setStatusFilter("any")
                  }}
                >
                  Clear Filters
                </ClearBtn>
              )}

            {/* Export actions */}
            <ExportWrap>
              <ExportBtn onClick={exportFilteredCsv}>Download CSV (Filtered)</ExportBtn>
              <ExportBtn onClick={exportPendingCsv}>Download CSV (Pending)</ExportBtn>
            </ExportWrap>
          </FiltersBar>

          {filteredEmployees.length === 0 ? (
            <p>No employees found.</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <TableHeader>Employee ID</TableHeader>
                  <TableHeader>Employee Name</TableHeader>
                  <TableHeader>Age</TableHeader>
                  <TableHeader>Gender</TableHeader>
                  <TableHeader>Barcode</TableHeader>
                  <TableHeader>Action</TableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <TableRow key={emp.barcode || emp.employee_id} style={{ background: emp.vitals ? "#e6ffe6" : "inherit" }}>
                    <TableCell>{emp.employee_id || "N/A"}</TableCell>
                    <TableCell>{emp.employee_name}</TableCell>
                    <TableCell>{emp.age}</TableCell>
                    <TableCell>{emp.gender}</TableCell>
                    <TableCell>{emp.barcode}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleSelectEmployee(emp.barcode || emp.employee_id)}>Open Investigation</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}
        </>
      ) : (
        <FormContainer>
          <BackButton onClick={handleBackToList}>← Back to Employee List</BackButton>
          <PlainHeader>
            <PlainTitle>Employee Investigation</PlainTitle>
          </PlainHeader>

          <form onSubmit={handleSubmit}>
            <Grid>
              <Field>
                <Label>Employee ID</Label>
                <Input name="employee_id" value={form.employee_id} readOnly />
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
                <Label>Blood Pressure</Label>
                <Input name="blood_pressure" value={form.vitals.blood_pressure} onChange={handleVitalsChange} />
              </Field>
              <Field>
                <Label>SpO2</Label>
                <Input name="spo2" value={form.vitals.spo2} onChange={handleVitalsChange} />
              </Field>

              <Field style={{ gridColumn: "1 / -1" }}>
                <Label>Patient History</Label>
                <TextArea name="patient_history" rows="4" value={form.patient_history} onChange={handleChange} />
              </Field>
            </Grid>
            <br />
            <br />
            {/* 100% Dynamic Rendering of Test Sections */}
            {form.test_results.map((test, idx) => {
              const testName = (test.test_name || "").toUpperCase();
              const isOphth = testName.includes("OPHTHALMOLOGY") || testName.includes("OPTHOLMOLOGY") || testName.includes("EYE") || testName.includes("VISUAL");
              const isXray = testName.includes("X-RAY") || testName.includes("XRAY");

              // 1. Ophthalmology (Specialized)
              if (isOphth) {
                const va = test.results?.visual_acuity || {
                  distance: { right: "", left: "" },
                  nearVision: { right: "", left: "" },
                  colourVision: { right: "", left: "" },
                  ocularmovement: { right: "", left: "" },
                };
                const setVA = (key, eye, val) => {
                  const newVA = { ...va, [key]: { ...va[key], [eye]: val } };
                  handleTestChange(idx, "results", { visual_acuity: newVA }, true);
                };

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
                        <Input placeholder="Right Eye" value={va[item.key].right} onChange={e => setVA(item.key, 'right', e.target.value)} />
                        <Input placeholder="Left Eye" value={va[item.key].left} onChange={e => setVA(item.key, 'left', e.target.value)} />
                      </RowGrid>
                    ))}
                    <br />
                    <TwoColGrid>
                      <Field>
                        <Label>Patient Complaints</Label>
                        <TextArea
                          value={test.results?.complaints || ""}
                          onChange={e => handleTestChange(idx, "results", { complaints: e.target.value }, true)}
                          placeholder="Complaints..."
                          rows={3}
                        />
                      </Field>
                      <Field>
                        <Label>Remarks</Label>
                        <TextArea
                          value={test.results?.remarks || ""}
                          onChange={e => handleTestChange(idx, "results", { remarks: e.target.value }, true)}
                          placeholder="Remarks..."
                          rows={3}
                        />
                      </Field>
                    </TwoColGrid>
                    {test.is_notes === true && (
                      <Field style={{ marginTop: '15px' }}>
                        <Label>Notes</Label>
                        <TextArea
                          value={test.notes || ""}
                          onChange={e => handleTestChange(idx, "notes", e.target.value)}
                          placeholder="Notes..."
                          rows={3}
                        />
                      </Field>
                    )}
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
                      <Input type="file" multiple onChange={(e) => handleTestFileChange(e, idx)} />
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
                          <Input type="file" multiple onChange={(e) => handleTestFileChange(e, idx)} />
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
                        <Field>
                          <Label>Notes</Label>
                          <TextArea
                            value={test.notes || ""}
                            onChange={(e) => handleTestChange(idx, 'notes', e.target.value)}
                            placeholder="Notes..."
                            rows={3}
                          />
                        </Field>
                      )}
                    </TwoColGrid>
                    {test.is_report === true && (
                      <Field style={{ marginTop: '12px', gridColumn: "1 / -1" }}>
                        <Label>Report / Findings</Label>
                        <TextArea
                          value={test.results?.report || ""}
                          onChange={(e) => handleTestChange(idx, 'results', { report: e.target.value }, true)}
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
                        <Input type="file" multiple onChange={(e) => handleTestFileChange(e, idx)} />
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
                      <Field>
                        <Label>Notes</Label>
                        <TextArea
                          value={test.notes || ""}
                          onChange={(e) => handleTestChange(idx, 'notes', e.target.value)}
                          placeholder="Enter notes..."
                          rows={4}
                        />
                      </Field>
                    )}
                    {test.is_report === true && (
                      <Field style={{ gridColumn: test.is_notes === true ? "1 / -1" : "auto", marginTop: test.is_notes === true ? "15px" : "0" }}>
                        <Label>Observations / Results / Report</Label>
                        <TextArea
                          value={test.results?.report || ""}
                          onChange={(e) => handleTestChange(idx, 'results', { report: e.target.value }, true)}
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

            <Button type="submit" disabled={uploading}>
              {uploading ? `Uploading ${progress}%` : "Submit All Results"}
            </Button>
          </form>
        </FormContainer>
      )}
    </Container>
  )
}