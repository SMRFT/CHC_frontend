"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"

// Styled components (keeping the same styles from the original)
const Container = styled.div`
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

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
`

const Subtitle = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  font-weight: normal;
  color: white;
`

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  border: 1px solid #e2e8f0;
`

const SectionTitle = styled.h2`
  color: #1a202c;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
    border-radius: 2px;
  }
`

const FilterSection = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: end;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
`

const Label = styled.label`
  font-weight: 500;
  color: #4a5568;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: ${(props) => (props.readOnly ? "#f7fafc" : "white")};
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    outline: none;
  }
  
  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${(props) => (props.disabled ? "#cbd5e0" : "linear-gradient(135deg, #3F72AF 0%, #112D4E 100%)")};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
  color: white;
`

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f7fafc;
  }
  
  &:hover {
    background-color: rgba(102, 126, 234, 0.05);
    transition: background-color 0.3s ease;
  }
`

const TableHead = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #4a5568;
`

const PatientName = styled.div`
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
`

const PatientId = styled.div`
  font-size: 0.75rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const PatientAge = styled.div`
  font-size: 0.75rem;
  color: #4a5568;
  margin-top: 0.25rem;
  background: #e6fffa;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: inline-block;
`

const ViewButton = styled(Button)`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  background: linear-gradient(135deg, #38b2ac 0%, #4fd1c7 100%);
`

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  max-width: 90vw;
  max-height: 90vh;
  width: 900px;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
`

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
  color: white;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 1rem 1rem 0 0;
`

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
`

const CloseButton = styled.button`
  background: none;
  color: white;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

const ModalBody = styled.div`
  padding: 2rem;
`

const PatientInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 0.5rem;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const InfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const InfoValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
`

const TestsSection = styled.div`
  margin-top: 2rem;
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`

const TestCount = styled.span`
  background: #667eea;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: bold;
  margin-left: 0.5rem;
`

const SelectAllContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
`

const BulkActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f7fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
`

const BulkActionButton = styled(Button)`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  
  &.pending {
    background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
  }
  
  &.collected {
    background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
  }
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #667eea;
`

const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  
  &:focus {
    border-color: #667eea;
    outline: none;
  }
  
  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }
`

const SaveButton = styled(Button)`
  background: ${(props) => (props.disabled ? "#cbd5e0" : "linear-gradient(135deg, #38a169 0%, #2f855a 100%)")};
  margin-top: 1.5rem;
  width: 100%;
`

const Message = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &.error {
    background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
    color: white;
  }
  
  &.success {
    background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
    color: white;
  }
  
  &.loading {
    background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
    color: white;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #718096;
  
  &::before {
    content: '📋';
    font-size: 4rem;
    display: block;
    margin-bottom: 1.5rem;
  }
`

const SampleCollection = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState({
    from_date: new Date().toISOString().split("T")[0],
    to_date: new Date().toISOString().split("T")[0],
    company_id: "",
    employee_id: "",
    barcode: "",
  })
  const [testSelections, setTestSelections] = useState({})
  const [testStatuses, setTestStatuses] = useState({})
  const [saving, setSaving] = useState(false)
  const [companies, setCompanies] = useState([])

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  // Fetch companies for dropdown
  useEffect(() => {
    fetch(`${Labbaseurl}companies/`)
      .then((r) => r.json())
      .then((data) => setCompanies(Array.isArray(data) ? data : []))
      .catch(console.error)
  }, [Labbaseurl])

  // Get logged in user ID from localStorage
  const getLoggedInUserId = () => {
    return localStorage.getItem("user_id") || "system"
  }

  const fetchPatients = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    // Require company_id for fetching patients
    if (!filters.company_id) {
      setError("Please select a company to search patients.")
      setLoading(false)
      return
    }

    try {
      const queryParams = new URLSearchParams()
      queryParams.append("from_date", filters.from_date)
      queryParams.append("to_date", filters.to_date)
      queryParams.append("company_id", filters.company_id) // Always include company_id
      if (filters.employee_id) queryParams.append("employee_id", filters.employee_id)
      if (filters.barcode) queryParams.append("barcode", filters.barcode)

      const response = await fetch(`${Labbaseurl}billing/patients/?${queryParams}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      setPatients(data.results || data)
    } catch (error) {
      console.error("Error fetching patients:", error)
      setError(`Failed to fetch patients: ${error.message}`)
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const parseTestDetails = (testStr) => {
    try {
      if (!testStr) return []

      if (typeof testStr === "string") {
        return JSON.parse(testStr)
      } else if (Array.isArray(testStr)) {
        return testStr
      } else if (typeof testStr === "object") {
        return [testStr]
      }

      return []
    } catch (error) {
      console.error("Error parsing test details:", error)
      return []
    }
  }

  // Filter tests that have test_id
  const getValidTests = (testDetails) => {
    const tests = parseTestDetails(testDetails)
    return tests.filter((test) => test && typeof test === "object" && test.test_id)
  }

  const openModal = async (patient) => {
    setSelectedPatient(patient)
    setShowModal(true)

    try {
      const queryParams = new URLSearchParams()
      queryParams.append("barcode", patient.barcode)
      queryParams.append("from_date", filters.from_date)
      queryParams.append("to_date", filters.to_date)
      queryParams.append("company_id", filters.company_id) // Include company_id
      queryParams.append("samplestatus", "Collected") // Only get Collected samples

      const response = await fetch(`${Labbaseurl}samples/?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        const existingSample = data.results && data.results.length > 0 ? data.results[0] : null

        if (existingSample && existingSample.testdetails) {
          const tests = parseTestDetails(existingSample.testdetails)
          const initialSelections = {}
          const initialStatuses = {}

          tests.forEach((test, index) => {
            const testKey = `${patient.employee_id}_${test.test_id}`
            const status = test.samplestatus || "Pending"
            initialSelections[testKey] = status === "Collected"
            initialStatuses[testKey] = status
          })

          setTestSelections(initialSelections)
          setTestStatuses(initialStatuses)
        } else {
          const tests = getValidTests(patient.testdetails)
          const initialSelections = {}
          const initialStatuses = {}

          tests.forEach((test, index) => {
            const testKey = `${patient.employee_id}_${test.test_id}`
            initialSelections[testKey] = false
            initialStatuses[testKey] = "Pending"
          })

          setTestSelections(initialSelections)
          setTestStatuses(initialStatuses)
        }
      }
    } catch (error) {
      console.error("Error fetching existing sample:", error)
      const tests = getValidTests(patient.testdetails)
      const initialSelections = {}
      const initialStatuses = {}

      tests.forEach((test, index) => {
        const testKey = `${patient.employee_id}_${test.test_id}`
        initialSelections[testKey] = false
        initialStatuses[testKey] = "Pending"
      })

      setTestSelections(initialSelections)
      setTestStatuses(initialStatuses)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPatient(null)
    setTestSelections({})
    setTestStatuses({})
    setError("")
    setSuccess("")
  }

  const handleTestSelection = (testKey, selected) => {
    setTestSelections((prev) => ({
      ...prev,
      [testKey]: selected,
    }))
  }

  // Modified handleSelectAll to only work with Collected status
  const handleSelectAll = (selectAll) => {
    if (!selectedPatient) return
    const tests = getValidTests(selectedPatient.testdetails)
    const updatedSelections = {}
    const updatedStatuses = {}

    tests.forEach((test, index) => {
      const testKey = `${selectedPatient.employee_id}_${test.test_id}`
      if (selectAll) {
        updatedSelections[testKey] = true
        updatedStatuses[testKey] = "Collected"
      } else {
        updatedSelections[testKey] = false
        updatedStatuses[testKey] = "Pending"
      }
    })

    setTestSelections(updatedSelections)
    setTestStatuses(updatedStatuses)
  }

  // Removed bulk action buttons, only keep Collected status
  const handleStatusChange = (testKey, status) => {
    setTestStatuses((prev) => ({
      ...prev,
      [testKey]: status,
    }))

    if (status === "Collected") {
      setTestSelections((prev) => ({
        ...prev,
        [testKey]: true,
      }))
    } else {
      setTestSelections((prev) => ({
        ...prev,
        [testKey]: false,
      }))
    }
  }

  const saveTestData = async () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const tests = getValidTests(selectedPatient.testdetails)
      const loggedInUserId = getLoggedInUserId()

      const formattedTestDetails = tests
        .map((test, index) => {
          const testKey = `${selectedPatient.employee_id}_${test.test_id}`
          const currentStatus = testStatuses[testKey] || "Pending"

          return {
            ...test,
            samplestatus: currentStatus,
            specimen_type: test.container || "Standard",
          }
        })
        .filter((test) => test !== null)

      if (formattedTestDetails.length === 0) {
        setError("No tests found to save.")
        setSaving(false)
        return
      }

      const sampleData = {
        employee_id: selectedPatient.employee_id,
        barcode: selectedPatient.barcode,
        company_id: filters.company_id, // Include company_id
        testdetails: formattedTestDetails,
        collected_by: loggedInUserId,
        from_date: filters.from_date,
        to_date: filters.to_date,
        date: filters.from_date, // Keep for backward compatibility if needed
      }

      const response = await fetch(`${Labbaseurl}samples/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sampleData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      setSuccess("Test data saved successfully!")
      setTimeout(() => {
        closeModal()
        fetchPatients() // Refresh the patient list
      }, 1500)
    } catch (error) {
      console.error("Error saving test data:", error)
      setError(`Failed to save test data: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  // Removed auto-fetch on mount to prevent 400 errors and improve UX
  // useEffect(() => {
  //   fetchPatients()
  // }, [])

  const hasSelectedTests =
    Object.values(testSelections).some((selected) => selected) ||
    Object.values(testStatuses).some((status) => status === "Collected")
  const hasSelectedTestsForBulkAction = Object.values(testSelections).some((selected) => selected)

  return (
    <Container>
      <Header>
        <Title>Sample Collection</Title>
        <Subtitle>Manage patient sample collection efficiently</Subtitle>
      </Header>

      <Card>
        <SectionTitle>Search Parameters</SectionTitle>
        <FilterSection>
          <FilterGroup>
            <Label htmlFor="from_date">From Date</Label>
            <Input
              id="from_date"
              type="date"
              value={filters.from_date}
              onChange={(e) => handleFilterChange("from_date", e.target.value)}
            />
          </FilterGroup>
          <FilterGroup>
            <Label htmlFor="to_date">To Date</Label>
            <Input
              id="to_date"
              type="date"
              value={filters.to_date}
              onChange={(e) => handleFilterChange("to_date", e.target.value)}
            />
          </FilterGroup>
          {/* Company dropdown */}
          <FilterGroup>
            <Label htmlFor="company_id">Company *</Label>
            <Select
              id="company_id"
              value={filters.company_id}
              onChange={(e) => handleFilterChange("company_id", e.target.value)}
              required
            >
              <option value="">-- Select Company --</option>
              {companies.map((c) => (
                <option key={c.company_id} value={c.company_id}>
                  {c.company_name} ({c.company_id})
                </option>
              ))}
            </Select>
          </FilterGroup>
          <FilterGroup>
            <Label htmlFor="employee_id">Employee ID</Label>
            <Input
              id="employee_id"
              type="text"
              value={filters.employee_id}
              onChange={(e) => handleFilterChange("employee_id", e.target.value)}
              placeholder="Enter Employee ID"
            />
          </FilterGroup>
          <FilterGroup>
            <Label htmlFor="barcode">Barcode</Label>
            <Input
              id="barcode"
              type="text"
              value={filters.barcode}
              onChange={(e) => handleFilterChange("barcode", e.target.value)}
              placeholder="Enter Barcode"
            />
          </FilterGroup>
          <Button onClick={fetchPatients} disabled={loading}>
            {loading ? "Loading..." : "Search Patients"}
          </Button>
        </FilterSection>

        {error && <Message className="error">{error}</Message>}
        {success && <Message className="success">{success}</Message>}
        {loading && <Message className="loading">Loading patients...</Message>}
      </Card>

      {!loading && !error && patients.length === 0 && (
        <Card>
          <EmptyState>
            <h3>No Patients Found</h3>
            <p>Try selecting a different date or check your filters</p>
          </EmptyState>
        </Card>
      )}

      {!loading && !error && patients.length > 0 && (
        <Card>
          <SectionTitle>Patients ({patients.length})</SectionTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Details</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Tests</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {patients.map((patient) => (
                <TableRow key={patient.barcode}>
                  <TableCell>
                    <PatientName>{patient.employee_name || "Unknown"}</PatientName>
                    <PatientId>{patient.employee_id}</PatientId>
                    {patient.age && (
                      <PatientAge>
                        {patient.age} years • {patient.gender}
                      </PatientAge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(patient.date).toLocaleDateString("en-GB")}</TableCell>
                  <TableCell>{patient.barcode}</TableCell>
                  <TableCell>{patient.test_count || 0} tests</TableCell>
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
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Sample Collection</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            <ModalBody>
              <PatientInfoGrid>
                <InfoItem>
                  <InfoLabel>Employee Name</InfoLabel>
                  <InfoValue>{selectedPatient.employee_name || "Unknown"}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Employee ID</InfoLabel>
                  <InfoValue>{selectedPatient.employee_id}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Age & Gender</InfoLabel>
                  <InfoValue>
                    {selectedPatient.age ? `${selectedPatient.age} years • ${selectedPatient.gender}` : "Unknown"}
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Barcode</InfoLabel>
                  <InfoValue>{selectedPatient.barcode}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Registration Date</InfoLabel>
                  <InfoValue>{new Date(selectedPatient.date).toLocaleDateString("en-GB")}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Payment Mode</InfoLabel>
                  <InfoValue>{selectedPatient.paymentMode}</InfoValue>
                </InfoItem>
              </PatientInfoGrid>

              <TestsSection>
                <SectionHeader>
                  <SectionTitle>
                    Tests
                    <TestCount>{getValidTests(selectedPatient.testdetails).length}</TestCount>
                  </SectionTitle>
                  <SelectAllContainer>
                    <Checkbox
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      checked={
                        Object.values(testSelections).every((selected) => selected) &&
                        Object.values(testSelections).length > 0
                      }
                    />
                    <span>Select All (Collected)</span>
                  </SelectAllContainer>
                </SectionHeader>

                {/* Removed bulk action buttons */}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Select</TableHead>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Container</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <tbody>
                    {getValidTests(selectedPatient.testdetails).map((test, index) => {
                      const testKey = `${selectedPatient.employee_id}_${test.test_id}`
                      const currentStatus = testStatuses[testKey] || "Pending"

                      return (
                        <TableRow key={test.test_id}>
                          <TableCell>
                            <Checkbox
                              type="checkbox"
                              checked={testSelections[testKey] || false}
                              onChange={(e) => handleTestSelection(testKey, e.target.checked)}
                            />
                          </TableCell>
                          <TableCell>
                            <strong>{test.testname || test.test_name || "Unknown Test"}</strong>
                          </TableCell>
                          <TableCell>{test.container || "Standard"}</TableCell>
                          <TableCell>
                            <Select value={currentStatus} onChange={(e) => handleStatusChange(testKey, e.target.value)}>
                              <option value="Pending">Pending</option>
                              <option value="Collected">Collected</option>
                            </Select>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </tbody>
                </Table>

                {error && <Message className="error">{error}</Message>}
                {success && <Message className="success">{success}</Message>}

                <SaveButton onClick={saveTestData} disabled={saving}>
                  {saving ? "Saving..." : "Save Test Data"}
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
