

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
  font-size: 12px;
  color: #4a5568;
  margin-top: 6px;
  word-break: break-all;
`
const DEFAULT_XRAY_REPORT = `The cardiac size and configuration are within normal limits.
The lung fields are clear. The broncho-vascular markings are normal.
The costo- and cardio-phrenic angles are free.
Both domes of the diaphragm are normal.
No abnormality is seen in the bones and soft tissues of the chest wall.
The visualized abdominal structures appear normal.
No significant finding in the lungs or mediastinum.`;

const DEFAULT_XRAY_NOTES = `No significant finding in the lungs or mediastinum.`;

export default function Investigation() {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  const [form, setForm] = useState({
    employee_id: "",
    age: "",
    gender: "",
    barcode: "",
    vitals: { height_cm: "", weight_kg: "", bmi: "", blood_pressure: "", spo2: "" },
    patient_history: "",
    xray_notes: "",
    xray_report: "",
    ecg_notes: "",
    pft_notes: "",
    audiometry_notes: "",
  })

  const [employees, setEmployees] = useState([])
  const [files, setFiles] = useState({ xrayfilm: [], ecg: [], pft: [], audiometric: [] })

  // Tracks already-uploaded files for selected employee
  const [existingFiles, setExistingFiles] = useState({
    xrayfilm: null,
    ecg: null,
    pft: null,
    audiometric: null,

  })

  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [toasts, setToasts] = useState([])

  // Date range state
  const [startDate, setStartDate] = useState(null) // from
  const [endDate, setEndDate] = useState(null) // to

  // Search state + debounce
  const [searchInput, setSearchInput] = useState("") // raw input
  const [debouncedSearch, setDebouncedSearch] = useState("") // debounced value

  // File status filters
  const [fileFilters, setFileFilters] = useState({
    xrayfilm: "any",
    ecg: "any",
    pft: "any",
    audiometric: "any",
  })

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

  // Reusable fetch + merge
  const refreshData = async () => {
    const empRes = await axios.get(`${Labbaseurl}get_all_employees/`)
    const employeesData = empRes.data || []
    const invRes = await axios.get(`${Labbaseurl}get_investigations/`)
    const investigationsData = invRes.data || []

    const merged = employeesData.map((emp) => {
      const inv = investigationsData.find((i) => i.employee_id === emp.employee_id)
      return inv ? { ...emp, ...inv } : emp
    })

    setEmployees(merged)
    return merged
  }

  // Fetch employees & investigations on mount
  useEffect(() => {
    ; (async () => {
      try {
        const merged = await refreshData()
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

  // Compose filters: search + date range + file filters (AND) + overall status filter
  const filteredEmployees = useMemo(() => {
    const s = toMidnight(startDate)
    const e = toMidnight(endDate)

    return employees.filter((emp) => {
      // Search filter
      const q = debouncedSearch
      const matchesSearch =
        !q ||
        (emp.barcode && String(emp.barcode).toLowerCase().includes(q)) ||
        (emp.employee_id && String(emp.employee_id).toLowerCase().includes(q)) ||
        (emp.employee_name && String(emp.employee_name).toLowerCase().includes(q))
      if (!matchesSearch) return false

      // Date range inclusive on created_date if present
      if (s || e) {
        const created = emp.created_date ? new Date(emp.created_date) : null
        if (created) created.setHours(0, 0, 0, 0)
        const inRange =
          (!s && !e) ||
          (s && !e && created && created.getTime() >= s.getTime()) ||
          (!s && e && created && created.getTime() <= e.getTime()) ||
          (s && e && created && created.getTime() >= s.getTime() && created.getTime() <= e.getTime())
        if (!inRange) return false
      }

      // File filters (AND)
      const filesState = {
        xrayfilm: hasValue(emp?.xrayfilm_file),
        ecg: hasValue(emp?.ecg_file),
        pft: hasValue(emp?.pft_file),
        audiometric: hasValue(emp?.audiometric_file),
      }

      for (const key of Object.keys(fileFilters)) {
        const f = fileFilters[key]
        if (f === "any") continue
        if (f === "uploaded" && !filesState[key]) return false
        if (f === "not_uploaded" && filesState[key]) return false
      }

      // Overall status filter (approved if ALL files uploaded)
      const overallApproved = filesState.xrayfilm && filesState.ecg && filesState.pft && filesState.audiometric
      if (statusFilter === "approved" && !overallApproved) return false
      if (statusFilter === "pending" && overallApproved) return false

      return true
    })
  }, [employees, debouncedSearch, startDate, endDate, fileFilters, statusFilter])

  const handleSelectEmployee = (employee_id) => {
    const selectedEmployee = employees.find((emp) => emp.employee_id === employee_id)
    if (selectedEmployee) {
      setForm((prev) => ({
        ...prev,
        employee_id: selectedEmployee.employee_id,
        age: selectedEmployee.age,
        gender: selectedEmployee.gender,
        barcode: selectedEmployee.barcode,
        vitals:
          typeof selectedEmployee.vitals === "string"
            ? JSON.parse(selectedEmployee.vitals)
            : selectedEmployee.vitals || prev.vitals,
        patient_history: selectedEmployee.patient_history || "",
        xray_notes: selectedEmployee.xray_notes || DEFAULT_XRAY_NOTES,
        xray_report: selectedEmployee.xray_report || DEFAULT_XRAY_REPORT,
        ecg_notes: selectedEmployee.ecg_notes || "",
        pft_notes: selectedEmployee.pft_notes || "",
        audiometry_notes: selectedEmployee.audiometry_notes || "",
      }))


      // Populate existing file IDs
      setExistingFiles({
        xrayfilm: selectedEmployee.xrayfilm_file || null,
        ecg: selectedEmployee.ecg_file || null,
        pft: selectedEmployee.pft_file || null,
        audiometric: selectedEmployee.audiometric_file || null,
      })

      // Clear local file selections
      setFiles({ xrayfilm: [], ecg: [], pft: [], audiometric: [] })
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
      vitals: { height_cm: "", weight_kg: "", bmi: "", blood_pressure: "", spo2: "" },
      patient_history: "",
      ecg_notes: "",
      pft_notes: "",
      audiometry_notes: "",
    })
    setExistingFiles({ xrayfilm: null, ecg: null, pft: null, audiometric: null })
    setFiles({ xrayfilm: [], ecg: [], pft: [], audiometric: [] })
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
    const status = (v) => (hasValue(v) ? "Uploaded" : "Pending")
    const pendingList = [
      !hasValue(emp?.xrayfilm_file) ? "xrayfilm" : null,
      !hasValue(emp?.ecg_file) ? "ecg" : null,
      !hasValue(emp?.pft_file) ? "pft" : null,
      !hasValue(emp?.audiometric_file) ? "audiometric" : null,
    ]
      .filter(Boolean)
      .join("|")

    return {
      employee_id: emp.employee_id ?? "",
      employee_name: emp.employee_name ?? "",
      age: emp.age ?? "",
      gender: emp.gender ?? "",
      barcode: emp.barcode ?? "",
      created_date: emp.created_date ?? "",
      xrayfilm_status: status(emp?.xrayfilm_file),
      ecg_status: status(emp?.ecg_file),
      pft_status: status(emp?.pft_file),
      audiometric_status: status(emp?.audiometric_file),
      pending_for: pendingList,
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
      "xrayfilm_status",
      "ecg_status",
      "pft_status",
      "audiometric_status",
      "pending_for",
    ]
    const csv = toCsv(rows, headers)
    downloadCsv(csv, "employees_filtered")
  }

  const exportPendingCsv = () => {
    const pendingRows = filteredEmployees
      .filter(
        (emp) =>
          !hasValue(emp?.xrayfilm_file) ||
          !hasValue(emp?.ecg_file) ||
          !hasValue(emp?.pft_file) ||
          !hasValue(emp?.audiometric_file),
      )
      .map(mapEmployeeToCsvRow)
    const headers = [
      "employee_id",
      "employee_name",
      "age",
      "gender",
      "barcode",
      "created_date",
      "xrayfilm_status",
      "ecg_status",
      "pft_status",
      "audiometric_status",
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
      fd.append("xray_notes", form.xray_notes || DEFAULT_XRAY_NOTES);
      fd.append("xray_report", form.xray_report || DEFAULT_XRAY_REPORT);
      fd.append("ecg_notes", form.ecg_notes)
      fd.append("pft_notes", form.pft_notes)
      fd.append("audiometry_notes", form.audiometry_notes)

      const vitalsToSend = {
        height_cm: form.vitals.height_cm || "",
        weight_kg: form.vitals.weight_kg || "",
        bmi: form.vitals.bmi || "",
        blood_pressure: form.vitals.blood_pressure || "",
        spo2: form.vitals.spo2 || "",
      }
      fd.append("vitals", JSON.stringify(vitalsToSend))

      // Append only new files; existing ones remain unchanged
      if (files.xrayfilm.length > 0) fd.append("xrayfilm_file", files.xrayfilm[0])
      if (files.ecg.length > 0) fd.append("ecg_file", files.ecg[0])
      if (files.pft.length > 0) fd.append("pft_file", files.pft[0])
      if (files.audiometric.length > 0) fd.append("audiometric_file", files.audiometric[0])

      await axios.post(`${Labbaseurl}save_investigation/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (evt.total) {
            const percent = Math.round((evt.loaded * 100) / evt.total)
            setProgress(percent)
          }
        },
      })

      showToast("Investigation saved successfully!", "success")
      handleBackToList()
      await refreshData()
      setUploading(false)
      setProgress(0)
      // Optionally refreshData();
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

            {/* File status filters */}
            <SelectWrap>
              <span style={{ fontWeight: 700, color: "#4a5568" }}>X-Ray Film</span>
              <Select
                value={fileFilters.xrayfilm}
                onChange={(e) => setFileFilters((prev) => ({ ...prev, xrayfilm: e.target.value }))}
              >
                <option value="any">Any</option>
                <option value="uploaded">Uploaded</option>
                <option value="not_uploaded">Not uploaded</option>
              </Select>
            </SelectWrap>

            <SelectWrap>
              <span style={{ fontWeight: 700, color: "#4a5568" }}>ECG</span>
              <Select
                value={fileFilters.ecg}
                onChange={(e) => setFileFilters((prev) => ({ ...prev, ecg: e.target.value }))}
              >
                <option value="any">Any</option>
                <option value="uploaded">Uploaded</option>
                <option value="not_uploaded">Not uploaded</option>
              </Select>
            </SelectWrap>

            <SelectWrap>
              <span style={{ fontWeight: 700, color: "#4a5568" }}>PFT</span>
              <Select
                value={fileFilters.pft}
                onChange={(e) => setFileFilters((prev) => ({ ...prev, pft: e.target.value }))}
              >
                <option value="any">Any</option>
                <option value="uploaded">Uploaded</option>
                <option value="not_uploaded">Not uploaded</option>
              </Select>
            </SelectWrap>

            <SelectWrap>
              <span style={{ fontWeight: 700, color: "#4a5568" }}>Audiometric</span>
              <Select
                value={fileFilters.audiometric}
                onChange={(e) => setFileFilters((prev) => ({ ...prev, audiometric: e.target.value }))}
              >
                <option value="any">Any</option>
                <option value="uploaded">Uploaded</option>
                <option value="not_uploaded">Not uploaded</option>
              </Select>
            </SelectWrap>

            {/* Overall Status combobox */}
            <SelectWrap>
              <span style={{ fontWeight: 700, color: "#4a5568" }}>Status</span>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="any">Any</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </Select>
            </SelectWrap>

            {(searchInput ||
              startDate ||
              endDate ||
              Object.values(fileFilters).some((v) => v !== "any") ||
              statusFilter !== "any") && (
                <ClearBtn
                  onClick={() => {
                    setSearchInput("")
                    setDebouncedSearch("")
                    setStartDate(null)
                    setEndDate(null)
                    setFileFilters({ xrayfilm: "any", ecg: "any", pft: "any", audiometric: "any" })
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
                  <TableRow key={emp.employee_id} style={{ background: emp.vitals ? "#e6ffe6" : "inherit" }}>
                    <TableCell>{emp.employee_id}</TableCell>
                    <TableCell>{emp.employee_name}</TableCell>
                    <TableCell>{emp.age}</TableCell>
                    <TableCell>{emp.gender}</TableCell>
                    <TableCell>{emp.barcode}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleSelectEmployee(emp.employee_id)}>Open Investigation</Button>
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
            {/* X-Ray Film Upload, X-Ray Notes, X-Ray Report - Same Row */}
            <RowGrid>
              <Field>
                <Label>X-Ray Film Upload</Label>
                {existingFiles.xrayfilm && <UploadedChip>Already uploaded</UploadedChip>}
                <Input
                  type="file"
                  onChange={(e) => handleFileChange(e, "xrayfilm")}
                  disabled={!!existingFiles.xrayfilm}
                />
                {existingFiles.xrayfilm && <SmallNote>File ID: {existingFiles.xrayfilm}</SmallNote>}
              </Field>
              <Field>
                <Label>X-Ray Notes</Label>
                <TextArea
                  name="xray_notes"
                  value={form.xray_notes}
                  onChange={handleChange}
                  placeholder="Enter X-Ray observations or notes"
                  rows={3}
                />
              </Field>
            </RowGrid>

            <Field style={{ gridColumn: "1 / -1" }}>
              <Label>X-Ray Report</Label>
              <TextArea
                name="xray_report"
                value={form.xray_report}
                onChange={handleChange}
                placeholder="Enter X-Ray report details"
                rows={3}
              />
            </Field>

            <br />

            {/* PFT Upload, PFT Notes - Same Row */}
            <TwoColGrid>
              <Field>
                <Label>PFT Upload</Label>
                {existingFiles.pft && <UploadedChip>Already uploaded</UploadedChip>}
                <Input type="file" onChange={(e) => handleFileChange(e, "pft")} disabled={!!existingFiles.pft} />
                {existingFiles.pft && <SmallNote>File ID: {existingFiles.pft}</SmallNote>}
              </Field>
              <Field>
                <Label>PFT Notes</Label>
                <TextArea name="pft_notes" rows="3" value={form.pft_notes} onChange={handleChange} />
              </Field>
            </TwoColGrid>

            {/* Audiometric Upload, Audiometry Notes - Same Row */}
            <TwoColGrid>
              <Field>
                <Label>Audiometric Upload</Label>
                {existingFiles.audiometric && <UploadedChip>Already uploaded</UploadedChip>}
                <Input
                  type="file"
                  onChange={(e) => handleFileChange(e, "audiometric")}
                  disabled={!!existingFiles.audiometric}
                />
                {existingFiles.audiometric && <SmallNote>File ID: {existingFiles.audiometric}</SmallNote>}
              </Field>
              <Field>
                <Label>Audiometry Notes</Label>
                <TextArea name="audiometry_notes" rows="3" value={form.audiometry_notes} onChange={handleChange} />
              </Field>
            </TwoColGrid>

            {/* ECG Upload, ECG Notes - Same Row */}
            <TwoColGrid>
              <Field>
                <Label>ECG Upload</Label>
                {existingFiles.ecg && <UploadedChip>Already uploaded</UploadedChip>}
                <Input type="file" onChange={(e) => handleFileChange(e, "ecg")} disabled={!!existingFiles.ecg} />
                {existingFiles.ecg && <SmallNote>File ID: {existingFiles.ecg}</SmallNote>}
              </Field>
              <Field>
                <Label>ECG Notes</Label>
                <TextArea name="ecg_notes" rows="3" value={form.ecg_notes} onChange={handleChange} />
              </Field>
            </TwoColGrid>

            <Button type="submit" disabled={uploading}>
              {uploading ? `Uploading ${progress}%` : "Submit Investigation"}
            </Button>
          </form>
        </FormContainer>
      )}
    </Container>
  )
}