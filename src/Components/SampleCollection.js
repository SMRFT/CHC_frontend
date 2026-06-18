"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import apiRequest from "./apiRequest"

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh;
  background: #F9F7F7;
  margin-left: 260px;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  @media (max-width: 1024px) { margin-left: 240px; }
  @media (max-width: 768px)  { margin-left: 0; padding: 1rem; }
`
const Header    = styled.header`
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
  color: white; padding: 2rem; border-radius: 1rem;
  margin-bottom: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center;
`
const Title    = styled.h1`font-size:2rem;font-weight:bold;margin-bottom:0.5rem;color:white;`
const Subtitle = styled.p`font-size:1.125rem;opacity:0.9;font-weight:normal;color:white;`
const Card     = styled.div`
  background:white;border-radius:1rem;padding:2rem;margin-bottom:2rem;
  box-shadow:0 4px 6px rgba(0,0,0,0.07);border:1px solid #e2e8f0;
`
const SectionTitle = styled.h2`
  color:#1a202c;font-size:1.25rem;font-weight:600;margin-bottom:1.5rem;
  display:flex;align-items:center;gap:0.75rem;
  &::before{content:'';width:4px;height:24px;
    background:linear-gradient(135deg,#3F72AF 0%,#112D4E 100%);border-radius:2px;}
`
const FilterSection = styled.div`
  display:flex;gap:1.5rem;align-items:end;flex-wrap:wrap;margin-bottom:1.5rem;
`
const FilterGroup = styled.div`
  display:flex;flex-direction:column;gap:0.5rem;min-width:200px;
`
const Label = styled.label`
  font-weight:500;color:#4a5568;font-size:0.875rem;
  text-transform:uppercase;letter-spacing:0.5px;
`
const Input = styled.input`
  padding:0.75rem;border:2px solid #e2e8f0;border-radius:0.5rem;font-size:1rem;
  background:${p => p.readOnly ? "#f7fafc" : "white"};transition:all 0.3s ease;
  &:focus{border-color:#667eea;box-shadow:0 0 0 3px rgba(102,126,234,0.1);outline:none;}
  &:disabled{background-color:#f7fafc;cursor:not-allowed;}
`
const Button = styled.button`
  padding:0.75rem 1.5rem;
  background:${p => p.disabled ? "#cbd5e0" : "linear-gradient(135deg,#3F72AF 0%,#112D4E 100%)"};
  color:white;border:none;border-radius:0.5rem;font-size:1rem;font-weight:600;
  text-transform:uppercase;letter-spacing:0.5px;
  cursor:${p => p.disabled ? "not-allowed" : "pointer"};transition:all 0.3s ease;
  &:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 25px rgba(0,0,0,0.15);}
`
const Table = styled.table`
  width:100%;border-collapse:collapse;background:white;
  border-radius:0.5rem;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);
`
const TableHeader = styled.thead`
  background:linear-gradient(135deg,#3F72AF 0%,#112D4E 100%);color:white;
`
const TableRow = styled.tr`
  &:nth-child(even){background-color:#f7fafc;}
  &:hover{background-color:rgba(102,126,234,0.05);transition:background-color 0.3s ease;}
`
const TableHead = styled.th`
  padding:1rem;text-align:left;font-weight:600;
  font-size:0.875rem;text-transform:uppercase;letter-spacing:0.5px;
`
const TableCell   = styled.td`padding:1rem;border-bottom:1px solid #e2e8f0;font-size:0.875rem;color:#4a5568;`
const PatientName = styled.div`font-weight:600;color:#1a202c;margin-bottom:0.25rem;`
const PatientId   = styled.div`font-size:0.75rem;color:#718096;text-transform:uppercase;letter-spacing:0.5px;`
const PatientAge  = styled.div`
  font-size:0.75rem;color:#4a5568;margin-top:0.25rem;background:#e6fffa;
  padding:0.25rem 0.5rem;border-radius:0.25rem;display:inline-block;
`
const ViewButton = styled(Button)`
  padding:0.5rem 1rem;font-size:0.875rem;
  background:linear-gradient(135deg,#38b2ac 0%,#4fd1c7 100%);
`
const Modal = styled.div`
  position:fixed;top:0;left:0;width:100%;height:100%;
  background:rgba(0,0,0,0.6);display:flex;align-items:center;
  justify-content:center;z-index:1000;backdrop-filter:blur(4px);
`
const ModalContent = styled.div`
  background:white;border-radius:1rem;max-width:90vw;max-height:90vh;
  width:900px;overflow-y:auto;box-shadow:0 25px 50px rgba(0,0,0,0.25);
`
const ModalHeader = styled.div`
  background:linear-gradient(135deg,#3F72AF 0%,#112D4E 100%);color:white;
  padding:2rem;display:flex;justify-content:space-between;align-items:center;
  border-radius:1rem 1rem 0 0;
`
const ModalTitle   = styled.h3`font-size:1.25rem;font-weight:600;color:white;`
const CloseButton  = styled.button`
  background:none;color:white;font-size:1.5rem;width:40px;height:40px;border:none;
  border-radius:50%;display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:all 0.3s ease;
  &:hover{background:rgba(255,255,255,0.2);}
`
const ModalBody        = styled.div`padding:2rem;`
const PatientInfoGrid  = styled.div`
  display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.5rem;
  margin-bottom:2rem;padding:1.5rem;background:#f7fafc;border-radius:0.5rem;
`
const InfoItem  = styled.div`display:flex;flex-direction:column;gap:0.25rem;`
const InfoLabel = styled.span`
  font-size:0.75rem;font-weight:500;color:#4a5568;
  text-transform:uppercase;letter-spacing:0.5px;
`
const InfoValue = styled.span`font-size:1rem;font-weight:600;color:#1a202c;`
const TestsSection = styled.div`margin-top:2rem;`
const SectionHeader = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;
`
const TestCount = styled.span`
  background:#667eea;color:white;padding:0.25rem 0.5rem;
  border-radius:9999px;font-size:0.75rem;font-weight:bold;margin-left:0.5rem;
`
const SelectAllContainer = styled.div`
  display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;font-weight:500;
`
const Checkbox = styled.input`width:18px;height:18px;accent-color:#667eea;`
const SaveButton = styled(Button)`
  background:${p => p.disabled ? "#cbd5e0" : "linear-gradient(135deg,#38a169 0%,#2f855a 100%)"};
  margin-top:1.5rem;width:100%;
`
const Message = styled.div`
  padding:1rem;border-radius:0.5rem;margin:1rem 0;font-weight:500;
  display:flex;align-items:center;gap:0.5rem;
  &.error  {background:linear-gradient(135deg,#e53e3e 0%,#c53030 100%);color:white;}
  &.success{background:linear-gradient(135deg,#38a169 0%,#2f855a 100%);color:white;}
  &.loading{background:linear-gradient(135deg,#3182ce 0%,#2c5282 100%);color:white;}
`
const EmptyState = styled.div`
  text-align:center;padding:4rem;color:#718096;
  &::before{content:'📋';font-size:4rem;display:block;margin-bottom:1.5rem;}
`
// Colour-coded dropdown for Collected / Pending
const StatusSelect = styled.select`
  padding: 0.4rem 0.75rem;
  border: 2px solid ${p => p.value === "Collected" ? "#68d391" : "#f6e05e"};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${p => p.value === "Collected" ? "#f0fff4" : "#fffff0"};
  color: ${p => p.value === "Collected" ? "#276749" : "#744210"};
  cursor: pointer;
  transition: all 0.2s ease;
  &:focus { outline: none; box-shadow: 0 0 0 3px rgba(102,126,234,0.15); }
`

// ─── Component ────────────────────────────────────────────────────────────────

const SampleCollection = () => {
  const [patients,        setPatients]        = useState([])
  const [loading,         setLoading]         = useState(false)
  const [error,           setError]           = useState("")
  const [success,         setSuccess]         = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showModal,       setShowModal]       = useState(false)
  const [filters,         setFilters]         = useState({
    from_date:   new Date().toISOString().split("T")[0],
    to_date:     new Date().toISOString().split("T")[0],
    company_id:  "",
    employee_id: "",
    barcode:     "",
  })
  // { [testKey]: "Collected" | "Pending" }
  const [testStatuses, setTestStatuses] = useState({})
  const [saving,       setSaving]       = useState(false)
  const [companies,    setCompanies]    = useState([])

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await apiRequest(`${Labbaseurl}companies/`, "GET");
        if (res.success) {
          setCompanies(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompanies();
    
    // Initial fetch for all patients
    fetchPatients();
  }, [Labbaseurl])

  const getLoggedInUserId = () => localStorage.getItem("user_id") || "system"

  // ── Fetch patients — backend now returns only those with pending tests ──
  const fetchPatients = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const queryParams = new URLSearchParams()
      queryParams.append("from_date",  filters.from_date)
      queryParams.append("to_date",    filters.to_date)
      if (filters.company_id) queryParams.append("company_id", filters.company_id)
      if (filters.employee_id) queryParams.append("employee_id", filters.employee_id)
      if (filters.barcode)     queryParams.append("barcode",     filters.barcode)

      const response = await apiRequest(`${Labbaseurl}billing/patients/?${queryParams}`, "GET")
      if (response.success) {
        setPatients(response.data.results || response.data)
      } else {
        throw new Error(response.error || "Failed to fetch patients")
      }
    } catch (err) {
      console.error("Error fetching patients:", err)
      setError(`Failed to fetch patients: ${err.message}`)
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }))

  // ── Helpers ───────────────────────────────────────────────────────────────
  const parseTestDetails = (testStr) => {
    try {
      if (!testStr) return []
      if (typeof testStr === "string") return JSON.parse(testStr)
      if (Array.isArray(testStr))      return testStr
      if (typeof testStr === "object") return [testStr]
      return []
    } catch { return [] }
  }

  // testdetails on the patient object contains only pending tests (filtered by backend)
  const getValidTests = (testDetails) =>
    parseTestDetails(testDetails).filter(t => t && typeof t === "object" && t.test_id)

  // ── Open modal ────────────────────────────────────────────────────────────
  // All pending tests are PRE-SELECTED as Collected by default.
  // User can uncheck any test to leave it as Pending.
  const openModal = (patient) => {
    setSelectedPatient(patient)
    setShowModal(true)
    setError("")
    setSuccess("")

    const tests = getValidTests(patient.testdetails)
    const initialStatuses = {}
    tests.forEach(test => {
      // Default: Collected (pre-ticked) — user unchecks to keep as Pending
      initialStatuses[`${patient.employee_id}_${test.test_id}`] = "Collected"
    })
    setTestStatuses(initialStatuses)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPatient(null)
    setTestStatuses({})
    setError("")
    setSuccess("")
  }

  // ── Checkbox toggle ───────────────────────────────────────────────────────
  // checked  → Collected
  // unchecked → Pending
  const handleTestToggle = (testKey, checked) =>
    setTestStatuses(prev => ({ ...prev, [testKey]: checked ? "Collected" : "Pending" }))

  // Dropdown: directly set whatever value the user picks
  const handleStatusChange = (testKey, value) =>
    setTestStatuses(prev => ({ ...prev, [testKey]: value }))

  // ── Select-all ────────────────────────────────────────────────────────────
  const handleSelectAll = (checked) => {
    if (!selectedPatient) return
    const updated = {}
    getValidTests(selectedPatient.testdetails).forEach(test => {
      updated[`${selectedPatient.employee_id}_${test.test_id}`] =
        checked ? "Collected" : "Pending"
    })
    setTestStatuses(updated)
  }

  // Derived: all Collected?
  const isAllCollected = () => {
    if (!selectedPatient) return false
    const tests = getValidTests(selectedPatient.testdetails)
    if (!tests.length) return false
    return tests.every(t =>
      testStatuses[`${selectedPatient.employee_id}_${t.test_id}`] === "Collected"
    )
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  // Sends every test with its actual status: Collected or Pending.
  // Backend will update Collected ones and leave Pending ones unchanged —
  // so next search will still surface this patient if any Pending remain.
  const saveTestData = async () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const tests          = getValidTests(selectedPatient.testdetails)
      const loggedInUserId = getLoggedInUserId()

      const formattedTestDetails = tests.map(test => ({
        ...test,
        samplestatus:  testStatuses[`${selectedPatient.employee_id}_${test.test_id}`] || "Pending",
        specimen_type: test.collection_container || test.container || "Standard",
      }))

      if (!formattedTestDetails.length) {
        setError("No tests found to save.")
        setSaving(false)
        return
      }

      const sampleData = {
        employee_id:  selectedPatient.employee_id,
        barcode:      selectedPatient.barcode,
        company_id:   selectedPatient.company_id, // Use patient's own company_id
        testdetails:  formattedTestDetails,
        collected_by: loggedInUserId,
        from_date:    filters.from_date,
        to_date:      filters.to_date,
        date:         filters.from_date,
      }

      const response = await apiRequest(
        `${Labbaseurl}samples/?company_id=${selectedPatient.company_id}&barcode=${selectedPatient.barcode}`,
        "POST",
        sampleData
      )

      if (response.success) {
        setSuccess("Sample data saved successfully!")
        // Refresh list — patients whose every test is now Collected will disappear
        setTimeout(() => { closeModal(); fetchPatients() }, 1500)
      } else {
        throw new Error(response.error || "Failed to save sample data")
      }
    } catch (err) {
      console.error("Error saving test data:", err)
      setError(`Failed to save test data: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Container>
      <Header>
        <Title>Sample Collection</Title>
        <Subtitle>Manage patient sample collection efficiently</Subtitle>
      </Header>

      {/* Search */}
      <Card>
        <SectionTitle>Search Parameters</SectionTitle>
        <FilterSection>
          <FilterGroup>
            <Label htmlFor="from_date">From Date</Label>
            <Input id="from_date" type="date" value={filters.from_date}
              onChange={e => handleFilterChange("from_date", e.target.value)} />
          </FilterGroup>
          <FilterGroup>
            <Label htmlFor="to_date">To Date</Label>
            <Input id="to_date" type="date" value={filters.to_date}
              onChange={e => handleFilterChange("to_date", e.target.value)} />
          </FilterGroup>
          <FilterGroup>
            <Label htmlFor="company_id">Company</Label>
            <select
              id="company_id"
              value={filters.company_id}
              onChange={e => handleFilterChange("company_id", e.target.value)}
              style={{
                padding:"0.75rem",border:"2px solid #e2e8f0",borderRadius:"0.5rem",
                fontSize:"1rem",background:"white"
              }}
              required
            >
              <option value="">All Companies</option>
              {companies.map(c => (
                <option key={c.company_id} value={c.company_id}>
                  {c.company_name} ({c.company_id})
                </option>
              ))}
            </select>
          </FilterGroup>
          <FilterGroup>
            <Label htmlFor="employee_id">Employee ID</Label>
            <Input id="employee_id" type="text" value={filters.employee_id}
              onChange={e => handleFilterChange("employee_id", e.target.value)}
              placeholder="Enter Employee ID" />
          </FilterGroup>
          <FilterGroup>
            <Label htmlFor="barcode">Barcode</Label>
            <Input id="barcode" type="text" value={filters.barcode}
              onChange={e => handleFilterChange("barcode", e.target.value)}
              placeholder="Enter Barcode" />
          </FilterGroup>
          <Button onClick={fetchPatients} disabled={loading}>
            {loading ? "Loading..." : "Search Patients"}
          </Button>
        </FilterSection>

        {error   && <Message className="error">{error}</Message>}
        {success && <Message className="success">{success}</Message>}
        {loading && <Message className="loading">Loading patients…</Message>}
      </Card>

      {/* Empty */}
      {!loading && !error && patients.length === 0 && (
        <Card>
          <EmptyState>
            <h3>No Pending Patients Found</h3>
            <p>All samples may already be collected, or try adjusting your filters.</p>
          </EmptyState>
        </Card>
      )}

      {/* Patient table */}
      {!loading && !error && patients.length > 0 && (
        <Card>
          <SectionTitle>Patients with Pending Samples ({patients.length})</SectionTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Details</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Pending Tests</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {patients.map(patient => (
                <TableRow key={patient.barcode}>
                  <TableCell>
                    <PatientName>{patient.employee_name || "Unknown"}</PatientName>
                    <PatientId>{patient.employee_id}</PatientId>
                    {patient.age && (
                      <PatientAge>{patient.age} years • {patient.gender}</PatientAge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(patient.date).toLocaleDateString("en-GB")}</TableCell>
                  <TableCell>{patient.company_name || "-"}</TableCell>
                  <TableCell>{patient.barcode}</TableCell>
                  {/* pending_test_count is sent by updated backend */}
                  <TableCell>{patient.pending_test_count ?? patient.test_count ?? 0} pending</TableCell>
                  <TableCell>
                    <ViewButton onClick={() => openModal(patient)}>Collect Samples</ViewButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Modal */}
      {showModal && selectedPatient && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Sample Collection — Pending Tests</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            <ModalBody>
              <PatientInfoGrid>
                <InfoItem><InfoLabel>Employee Name</InfoLabel>
                  <InfoValue>{selectedPatient.employee_name || "Unknown"}</InfoValue></InfoItem>
                <InfoItem><InfoLabel>Employee ID</InfoLabel>
                  <InfoValue>{selectedPatient.employee_id}</InfoValue></InfoItem>
                <InfoItem><InfoLabel>Age &amp; Gender</InfoLabel>
                  <InfoValue>
                    {selectedPatient.age
                      ? `${selectedPatient.age} years • ${selectedPatient.gender}`
                      : "Unknown"}
                  </InfoValue></InfoItem>
                <InfoItem><InfoLabel>Barcode</InfoLabel>
                  <InfoValue>{selectedPatient.barcode}</InfoValue></InfoItem>
                <InfoItem><InfoLabel>Registration Date</InfoLabel>
                  <InfoValue>{new Date(selectedPatient.date).toLocaleDateString("en-GB")}</InfoValue></InfoItem>
                <InfoItem><InfoLabel>Payment Mode</InfoLabel>
                  <InfoValue>{selectedPatient.paymentMode}</InfoValue></InfoItem>
              </PatientInfoGrid>

              <TestsSection>
                <SectionHeader>
                  <SectionTitle>
                    Pending Tests
                    <TestCount>{getValidTests(selectedPatient.testdetails).length}</TestCount>
                  </SectionTitle>
                  {/* Select-all: checked = all Collected, unchecked = all Pending */}
                  <SelectAllContainer>
                    <Checkbox
                      type="checkbox"
                      checked={isAllCollected()}
                      onChange={e => handleSelectAll(e.target.checked)}
                    />
                    <span>Select All as Collected</span>
                  </SelectAllContainer>
                </SectionHeader>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{width:"60px"}}>Collected</TableHead>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Container</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <tbody>
                    {getValidTests(selectedPatient.testdetails).map(test => {
                      const key    = `${selectedPatient.employee_id}_${test.test_id}`
                      const status = testStatuses[key] || "Pending"
                      return (
                        <TableRow key={test.test_id}>
                          {/* Checkbox synced with dropdown — both control the same status */}
                          <TableCell>
                            <Checkbox
                              type="checkbox"
                              checked={status === "Collected"}
                              onChange={e => handleTestToggle(key, e.target.checked)}
                            />
                          </TableCell>
                          <TableCell>
                            <strong>{test.testname || test.test_name || "Unknown Test"}</strong>
                          </TableCell>
                          <TableCell>{test.collection_container || test.container || "—"}</TableCell>
                          {/* Colour-coded dropdown — changing it also updates the checkbox */}
                          <TableCell>
                            <StatusSelect
                              value={status}
                              onChange={e => handleStatusChange(key, e.target.value)}
                            >
                              <option value="Collected">Collected</option>
                              <option value="Pending">Pending</option>
                            </StatusSelect>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </tbody>
                </Table>

                {error   && <Message className="error">{error}</Message>}
                {success && <Message className="success">{success}</Message>}

                <SaveButton onClick={saveTestData} disabled={saving}>
                  {saving ? "Saving…" : "Save Sample Collection"}
                </SaveButton>
              </TestsSection>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Container>
  )
}

export default SampleCollection