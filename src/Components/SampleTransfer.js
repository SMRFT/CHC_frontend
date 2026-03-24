"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"

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
const Header = styled.header`
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
  color: white; padding: 2rem; border-radius: 1rem;
  margin-bottom: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center;
`
const Title    = styled.h1`font-size:2rem;font-weight:bold;margin-bottom:0.5rem;color:white;`
const Subtitle = styled.p`font-size:1.125rem;opacity:0.9;font-weight:normal;color:white;`
const Card = styled.div`
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
const Select = styled.select`
  padding:0.75rem;border:2px solid #e2e8f0;border-radius:0.5rem;font-size:1rem;
  background:white;transition:all 0.3s ease;
  &:focus{border-color:#667eea;box-shadow:0 0 0 3px rgba(102,126,234,0.1);outline:none;}
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
const ActionButton = styled(Button)`
  padding:0.5rem 1rem;font-size:0.875rem;
  background:${p => p.disabled
    ? "#cbd5e0"
    : "linear-gradient(135deg,#38b2ac 0%,#4fd1c7 100%)"};
`
const Modal = styled.div`
  position:fixed;top:0;left:0;width:100%;height:100%;
  background:rgba(0,0,0,0.6);display:flex;align-items:center;
  justify-content:center;z-index:1000;backdrop-filter:blur(4px);
`
const ModalContent = styled.div`
  background:white;border-radius:1rem;max-width:90vw;max-height:90vh;
  width:960px;overflow-y:auto;box-shadow:0 25px 50px rgba(0,0,0,0.25);
`
const ModalHeader = styled.div`
  background:linear-gradient(135deg,#3F72AF 0%,#112D4E 100%);color:white;
  padding:2rem;display:flex;justify-content:space-between;align-items:center;
  border-radius:1rem 1rem 0 0;
`
const ModalTitle  = styled.h3`font-size:1.25rem;font-weight:600;color:white;`
const CloseButton = styled.button`
  background:none;color:white;font-size:1.5rem;width:40px;height:40px;border:none;
  border-radius:50%;display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:all 0.3s ease;
  &:hover{background:rgba(255,255,255,0.2);}
`
const ModalBody       = styled.div`padding:2rem;`
const PatientInfoGrid = styled.div`
  display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.5rem;
  margin-bottom:2rem;padding:1.5rem;background:#f7fafc;border-radius:0.5rem;
`
const InfoItem  = styled.div`display:flex;flex-direction:column;gap:0.25rem;`
const InfoLabel = styled.span`
  font-size:0.75rem;font-weight:500;color:#4a5568;
  text-transform:uppercase;letter-spacing:0.5px;
`
const InfoValue = styled.span`font-size:1rem;font-weight:600;color:#1a202c;`

// "Transfer To" section highlighted box
const TransferToBox = styled.div`
  background:#ebf8ff;border:1.5px solid #90cdf4;border-radius:0.5rem;
  padding:1rem 1.25rem;margin-bottom:1.5rem;
  display:flex;align-items:center;gap:1rem;flex-wrap:wrap;
`
const TransferToLabel = styled.span`
  font-size:0.875rem;font-weight:600;color:#2b6cb0;text-transform:uppercase;
  letter-spacing:0.5px;white-space:nowrap;
`
const TransferToSelect = styled.select`
  flex:1;min-width:220px;padding:0.6rem 1rem;
  border:2px solid #90cdf4;border-radius:0.375rem;font-size:0.95rem;
  font-weight:600;background:white;color:#1a202c;
  &:focus{outline:none;border-color:#3182ce;box-shadow:0 0 0 3px rgba(49,130,206,0.15);}
`

const TestsSection  = styled.div`margin-top:1rem;`
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

// Colour-coded status dropdown (green=Transferred, orange=Collected)
const StatusSelect = styled.select`
  padding:0.4rem 0.75rem;
  border:2px solid ${p => p.value === "Transferred" ? "#68d391" : "#f6ad55"};
  border-radius:0.375rem;font-size:0.875rem;font-weight:600;
  background:${p => p.value === "Transferred" ? "#f0fff4" : "#fffaf0"};
  color:${p => p.value === "Transferred" ? "#276749" : "#744210"};
  cursor:pointer;transition:all 0.2s ease;
  &:focus{outline:none;box-shadow:0 0 0 3px rgba(102,126,234,0.15);}
`
const StatusBadge = styled.span`
  display:inline-block;padding:0.25rem 0.75rem;border-radius:9999px;
  font-size:0.75rem;font-weight:600;text-transform:capitalize;color:white;
  background:${p =>
    p.status === "Transferred"
      ? "linear-gradient(135deg,#38a169 0%,#2f855a 100%)"
      : p.status === "Collected"
      ? "linear-gradient(135deg,#ed8936 0%,#dd6b20 100%)"
      : "linear-gradient(135deg,#718096 0%,#4a5568 100%)"};
`
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
  &::before{content:'🧪';font-size:4rem;display:block;margin-bottom:1.5rem;}
`

// ─── Lab destinations ─────────────────────────────────────────────────────────
const LAB_DESTINATIONS = [
  "Shanmuga Reference Lab",
]

// ─── Component ────────────────────────────────────────────────────────────────

const SampleTransfer = () => {
  const [samples,        setSamples]        = useState([])
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState("")
  const [success,        setSuccess]        = useState("")
  const [selectedSample, setSelectedSample] = useState(null)
  const [showModal,      setShowModal]      = useState(false)
  const [filters,        setFilters]        = useState({
    from_date:   new Date().toISOString().split("T")[0],
    to_date:     new Date().toISOString().split("T")[0],
    company_id:  "",
    employee_id: "",
    barcode:     "",
  })
  // { [testKey]: "Transferred" | "Collected" }
  const [testStatuses,  setTestStatuses]  = useState({})
  const [transferredTo, setTransferredTo] = useState(LAB_DESTINATIONS[0])
  const [saving,        setSaving]        = useState(false)
  const [companies,     setCompanies]     = useState([])

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  useEffect(() => {
    fetch(`${Labbaseurl}companies/`)
      .then(r => r.json())
      .then(data => setCompanies(Array.isArray(data) ? data : []))
      .catch(console.error)
  }, [Labbaseurl])

  const getLoggedInUserId = () => localStorage.getItem("user_id") || "system"

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

  const getValidTests = (td) =>
    parseTestDetails(td).filter(t => t && typeof t === "object" && t.test_id)

  // ── Fetch collected samples ───────────────────────────────────────────────
  const fetchCollectedSamples = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    if (!filters.company_id) {
      setError("Please select a company to search collected samples.")
      setLoading(false)
      return
    }

    try {
      const queryParams = new URLSearchParams({
        samplestatus: "Collected",
        from_date:    filters.from_date,
        to_date:      filters.to_date,
        company_id:   filters.company_id,
      })
      if (filters.employee_id) queryParams.append("employee_id", filters.employee_id)
      if (filters.barcode)     queryParams.append("barcode",     filters.barcode)

      const response = await fetch(`${Labbaseurl}samples/?${queryParams}`)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setSamples(data.results || data)
    } catch (err) {
      console.error("Error fetching collected samples:", err)
      setError(`Failed to fetch samples: ${err.message}`)
      setSamples([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }))

  // ── Open modal — all Collected tests pre-set as Transferred ───────────────
  const openModal = (sample) => {
    setSelectedSample(sample)
    setShowModal(true)
    setError("")
    setSuccess("")

    const tests = getValidTests(sample.testdetails)
    const initial = {}
    tests.forEach(test => {
      const key = `${sample.employee_id}_${test.test_id}`
      // Pre-select all as Transferred; user can change back to Collected
      initial[key] = test.samplestatus === "Transferred" ? "Transferred" : "Transferred"
    })
    setTestStatuses(initial)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedSample(null)
    setTestStatuses({})
    setError("")
    setSuccess("")
  }

  // ── Per-test handlers — checkbox and dropdown both write to testStatuses ──
  // Checkbox: checked = Transferred, unchecked = Collected
  const handleTestToggle = (testKey, checked) =>
    setTestStatuses(prev => ({ ...prev, [testKey]: checked ? "Transferred" : "Collected" }))

  // Dropdown: directly set value
  const handleStatusChange = (testKey, value) =>
    setTestStatuses(prev => ({ ...prev, [testKey]: value }))

  // ── Select-all ────────────────────────────────────────────────────────────
  const handleSelectAll = (checked) => {
    if (!selectedSample) return
    const updated = {}
    getValidTests(selectedSample.testdetails).forEach(test => {
      updated[`${selectedSample.employee_id}_${test.test_id}`] =
        checked ? "Transferred" : "Collected"
    })
    setTestStatuses(updated)
  }

  // Derived: all Transferred?
  const isAllTransferred = () => {
    if (!selectedSample) return false
    const tests = getValidTests(selectedSample.testdetails)
    if (!tests.length) return false
    return tests.every(t =>
      testStatuses[`${selectedSample.employee_id}_${t.test_id}`] === "Transferred"
    )
  }

  // ── Save (PATCH) ──────────────────────────────────────────────────────────
  // Sends each test with its actual status (Transferred or Collected).
  // Samples left as Collected will still appear on next search.
  const saveTestData = async () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const tests          = getValidTests(selectedSample.testdetails)
      const loggedInUserId = getLoggedInUserId()

      const formattedTestDetails = tests.map(test => ({
        ...test,
        samplestatus:      testStatuses[`${selectedSample.employee_id}_${test.test_id}`] || "Collected",
        lastmodified_by:   loggedInUserId,
        lastmodified_time: new Date().toISOString(),
      }))

      if (!formattedTestDetails.length) {
        setError("No tests found to transfer.")
        setSaving(false)
        return
      }

      const payload = {
        from_date:      filters.from_date,
        to_date:        filters.to_date,
        date:           filters.from_date,
        company_id:     filters.company_id,
        barcode:        selectedSample.barcode,
        employee_id:    selectedSample.employee_id,
        testdetails:    formattedTestDetails,
        transferred_by: loggedInUserId,
        transferred_to: transferredTo,          // ← destination lab
      }

      const response = await fetch(
        `${Labbaseurl}samples/?company_id=${filters.company_id}&barcode=${selectedSample.barcode}`,
        {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || `HTTP error! status: ${response.status}`)
      }

      setSuccess(`Samples transferred to ${transferredTo} successfully!`)
      setTimeout(() => { closeModal(); fetchCollectedSamples() }, 1500)
    } catch (err) {
      console.error("Error transferring samples:", err)
      setError(`Failed to transfer: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Container>
      <Header>
        <Title>Sample Transfer</Title>
        <Subtitle>Transfer collected samples to the laboratory</Subtitle>
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
            <Label htmlFor="company_id">Company *</Label>
            <Select id="company_id" value={filters.company_id}
              onChange={e => handleFilterChange("company_id", e.target.value)} required>
              <option value="">-- Select Company --</option>
              {companies.map(c => (
                <option key={c.company_id} value={c.company_id}>
                  {c.company_name} ({c.company_id})
                </option>
              ))}
            </Select>
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
          <Button onClick={fetchCollectedSamples} disabled={loading}>
            {loading ? "Loading..." : "Search Collected Samples"}
          </Button>
        </FilterSection>

        {error   && <Message className="error">{error}</Message>}
        {success && <Message className="success">{success}</Message>}
        {loading && <Message className="loading">Loading collected samples…</Message>}
      </Card>

      {/* Empty */}
      {!loading && !error && samples.length === 0 && (
        <Card>
          <EmptyState>
            <h3>No Collected Samples Found</h3>
            <p>No samples are ready for transfer on the selected date range.</p>
          </EmptyState>
        </Card>
      )}

      {/* Samples table */}
      {!loading && !error && samples.length > 0 && (
        <Card>
          <SectionTitle>Collected Samples ({samples.length})</SectionTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Details</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Collection Date</TableHead>
                <TableHead>Tests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {samples.map(sample => {
                const tests         = getValidTests(sample.testdetails)
                const allTransferred = tests.every(t => t.samplestatus === "Transferred")
                const displayStatus  = allTransferred ? "Transferred" : "Collected"

                return (
                  <TableRow key={sample._id || sample.employee_id}>
                    <TableCell>
                      <PatientName>{sample.employee_name || "Unknown"}</PatientName>
                      <PatientId>{sample.employee_id}</PatientId>
                      {sample.age && (
                        <PatientAge>{sample.age} years • {sample.gender}</PatientAge>
                      )}
                    </TableCell>
                    <TableCell>{sample.barcode || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(sample.created_date || sample.collected_date).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell>{tests.length} test{tests.length !== 1 ? "s" : ""}</TableCell>
                    <TableCell>
                      <StatusBadge status={displayStatus}>{displayStatus}</StatusBadge>
                    </TableCell>
                    <TableCell>
                      <ActionButton
                        onClick={() => openModal(sample)}
                        disabled={allTransferred}
                      >
                        {allTransferred ? "Transferred" : "Transfer"}
                      </ActionButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Modal */}
      {showModal && selectedSample && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Sample Transfer Details</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            <ModalBody>
              {/* Patient info */}
              <PatientInfoGrid>
                <InfoItem><InfoLabel>Employee Name</InfoLabel>
                  <InfoValue>{selectedSample.employee_name || "Unknown"}</InfoValue></InfoItem>
                <InfoItem><InfoLabel>Employee ID</InfoLabel>
                  <InfoValue>{selectedSample.employee_id}</InfoValue></InfoItem>
                <InfoItem><InfoLabel>Age &amp; Gender</InfoLabel>
                  <InfoValue>
                    {selectedSample.age
                      ? `${selectedSample.age} years • ${selectedSample.gender}`
                      : "Unknown"}
                  </InfoValue></InfoItem>
                <InfoItem><InfoLabel>Barcode</InfoLabel>
                  <InfoValue>{selectedSample.barcode}</InfoValue></InfoItem>
                <InfoItem><InfoLabel>Collection Date</InfoLabel>
                  <InfoValue>
                    {new Date(
                      selectedSample.created_date || selectedSample.collected_date
                    ).toLocaleDateString("en-GB")}
                  </InfoValue></InfoItem>
                <InfoItem><InfoLabel>Collected By</InfoLabel>
                  <InfoValue>{selectedSample.collected_by || "System"}</InfoValue></InfoItem>
              </PatientInfoGrid>

              {/* Transfer To dropdown */}
              <TransferToBox>
                <TransferToLabel>Transfer To:</TransferToLabel>
                <TransferToSelect
                  value={transferredTo}
                  onChange={e => setTransferredTo(e.target.value)}
                >
                  {LAB_DESTINATIONS.map(lab => (
                    <option key={lab} value={lab}>{lab}</option>
                  ))}
                </TransferToSelect>
              </TransferToBox>

              {/* Tests */}
              <TestsSection>
                <SectionHeader>
                  <SectionTitle>
                    Tests for Transfer
                    <TestCount>{getValidTests(selectedSample.testdetails).length}</TestCount>
                  </SectionTitle>
                  {/* Select-all: checked = all Transferred, unchecked = all Collected */}
                  <SelectAllContainer>
                    <Checkbox
                      type="checkbox"
                      checked={isAllTransferred()}
                      onChange={e => handleSelectAll(e.target.checked)}
                    />
                    <span>Select All as Transferred</span>
                  </SelectAllContainer>
                </SectionHeader>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: "60px" }}>Transfer</TableHead>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Collection Container</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <tbody>
                    {getValidTests(selectedSample.testdetails).map(test => {
                      const key    = `${selectedSample.employee_id}_${test.test_id}`
                      const status = testStatuses[key] || "Collected"
                      return (
                        <TableRow key={test.test_id}>
                          {/* Checkbox: checked = Transferred, unchecked = Collected */}
                          <TableCell>
                            <Checkbox
                              type="checkbox"
                              checked={status === "Transferred"}
                              onChange={e => handleTestToggle(key, e.target.checked)}
                            />
                          </TableCell>
                          <TableCell>
                            <strong>{test.testname || test.test_name || "Unknown Test"}</strong>
                          </TableCell>
                          {/* collection_container from backend-enriched testdetails */}
                          <TableCell>
                            {test.collection_container || test.specimen_type || test.container || "—"}
                          </TableCell>
                          {/* Colour-coded dropdown — synced with checkbox */}
                          <TableCell>
                            <StatusSelect
                              value={status}
                              onChange={e => handleStatusChange(key, e.target.value)}
                            >
                              <option value="Transferred">Transferred</option>
                              <option value="Collected">Collected</option>
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
                  {saving ? "Transferring…" : `Transfer to ${transferredTo}`}
                </SaveButton>
              </TestsSection>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Container>
  )
}

export default SampleTransfer