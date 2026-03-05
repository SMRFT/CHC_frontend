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

// Status badge for displaying sample status
const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  color: white;

  background: ${(props) =>
    props.status === "Transferred"
      ? "linear-gradient(135deg, #38a169 0%, #2f855a 100%)"
      : props.status === "Collected"
        ? "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)"
        : "linear-gradient(135deg, #718096 0%, #4a5568 100%)"};
`

// Info text showing transfer details
const TransferInfo = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  background: #f0fff4;
  border: 1px solid #c6f6d5;
  border-radius: 0.5rem;
`

// Test name inside modal
const TestName = styled.span`
  font-weight: 600;
  color: #1a202c;
`

// Container for each test row inside modal
const TestContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
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

const SampleTransfer = () => {
  const [samples, setSamples] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedSample, setSelectedSample] = useState(null)
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

  const getValidTests = (testDetails) => {
    const tests = parseTestDetails(testDetails)
    return tests.filter((test) => test && typeof test === "object" && test.test_id)
  }

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
        from_date: filters.from_date,
        to_date: filters.to_date,
        company_id: filters.company_id,
      })

      if (filters.employee_id) queryParams.append("employee_id", filters.employee_id)
      if (filters.barcode) queryParams.append("barcode", filters.barcode)

      const response = await fetch(`${Labbaseurl}samples/?${queryParams}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      setSamples(data.results || data)
    } catch (error) {
      console.error("Error fetching collected samples:", error)
      setError(`Failed to fetch collected samples: ${error.message}`)
      setSamples([])
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

  const openModal = async (sample) => {
    setSelectedSample(sample)
    setShowModal(true)

    const tests = getValidTests(sample.testdetails)
    const initialSelections = {}
    const initialStatuses = {}

    tests.forEach((test, index) => {
      const testKey = `${sample.employee_id}_${test.test_id}`
      const status = test.samplestatus || "Collected"
      const isSelected = status === "Transferred"

      initialSelections[testKey] = isSelected
      initialStatuses[testKey] = status
    })

    setTestSelections(initialSelections)
    setTestStatuses(initialStatuses)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedSample(null)
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

    setTestStatuses((prev) => ({
      ...prev,
      [testKey]: selected ? "Transferred" : "Collected",
    }))
  }

  const handleSelectAll = (selectAll) => {
    if (!selectedSample) return

    const tests = getValidTests(selectedSample.testdetails)
    const updatedSelections = {}
    const updatedStatuses = {}

    tests.forEach((test, index) => {
      const testKey = `${selectedSample.employee_id}_${test.test_id}`
      if (selectAll) {
        updatedSelections[testKey] = true
        updatedStatuses[testKey] = "Transferred"
      } else {
        updatedSelections[testKey] = false
        updatedStatuses[testKey] = "Collected"
      }
    })

    setTestSelections(updatedSelections)
    setTestStatuses(updatedStatuses)
  }

  const handleStatusChange = (testKey, status) => {
    setTestStatuses((prev) => ({
      ...prev,
      [testKey]: status,
    }))

    if (status === "Transferred") {
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
      const tests = getValidTests(selectedSample.testdetails)
      const loggedInUserId = getLoggedInUserId()

      const formattedTestDetails = tests.map((test) => {
        const testKey = `${selectedSample.employee_id}_${test.test_id}`
        const currentStatus = testStatuses[testKey] || "Collected"

        return {
          ...test,
          samplestatus: currentStatus,
          lastmodified_by: loggedInUserId,
          lastmodified_time: new Date().toISOString(),
        }
      })

      if (formattedTestDetails.length === 0) {
        setError("No tests found to transfer.")
        setSaving(false)
        return
      }

      // ✅ Include date range in PATCH payload
      const sampleData = {
        from_date: filters.from_date,
        to_date: filters.to_date,
        date: filters.from_date, // Required for backend compatibility
        company_id: filters.company_id,
        barcode: selectedSample.barcode,
        employee_id: selectedSample.employee_id,
        testdetails: formattedTestDetails,
        transferred_by: loggedInUserId,
        lastmodified_by: loggedInUserId,
        lastmodified_date: new Date().toISOString(),
      }

      const response = await fetch(
        `${Labbaseurl}samples/?company_id=${filters.company_id}&barcode=${selectedSample.barcode}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sampleData),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      setSuccess("Test data transferred successfully!")
      setTimeout(() => {
        closeModal()
        fetchCollectedSamples()
      }, 1500)
    } catch (error) {
      console.error("Error transferring test data:", error)
      setError(`Failed to transfer test data: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }


  const getLoggedInUserId = () => {
    return localStorage.getItem("user_id") || "system"
  }

  // Removed auto-fetch on mount to prevent 400 errors
  // useEffect(() => {
  //   fetchCollectedSamples()
  // }, [])

  const hasSelectedTestsForTransfer = Object.values(testSelections).some((selected) => selected)

  return (
    <>
      <Container>
        <Header>
          <Title>Sample Transfer</Title>
          <Subtitle>Transfer collected samples to the laboratory</Subtitle>
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
            <Button onClick={fetchCollectedSamples} disabled={loading}>
              {loading ? "Loading..." : "Search Collected Samples"}
            </Button>
          </FilterSection>

          {error && <Message className="error">{error}</Message>}
          {success && <Message className="success">{success}</Message>}
          {loading && <Message className="loading">Loading collected samples...</Message>}
        </Card>

        {!loading && !error && samples.length === 0 && (
          <Card>
            <EmptyState>
              <h3>No Collected Samples Found</h3>
              <p>No samples are ready for transfer on the selected date</p>
            </EmptyState>
          </Card>
        )}

        {!loading && !error && samples.length > 0 && (
          <Card>
            <SectionTitle>Collected Samples ({samples.length})</SectionTitle>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Details</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Collection Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {samples.map((sample) => {
                  const tests = getValidTests(sample.testdetails)
                  const allTransferred = tests.every((test) => test.samplestatus === "Transferred")
                  const anyCollected = tests.some((test) => test.samplestatus === "Collected")
                  const displayStatus = allTransferred ? "Transferred" : anyCollected ? "Collected" : "Collected"

                  return (
                    <TableRow key={sample.id || sample.employee_id}>
                      <TableCell>
                        <PatientName>{sample.employee_name || "Unknown"}</PatientName>
                        <PatientId>{sample.employee_id}</PatientId>
                        {sample.age && (
                          <PatientAge>
                            {sample.age} years • {sample.gender}
                          </PatientAge>
                        )}
                      </TableCell>
                      <TableCell>{sample.barcode || "N/A"}</TableCell>
                      <TableCell>
                        {new Date(sample.created_date || sample.collected_date).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={displayStatus}>{displayStatus}</StatusBadge>
                      </TableCell>
                      <TableCell>
                        <SaveButton onClick={() => openModal(sample)} disabled={allTransferred}>
                          {allTransferred ? "Transferred" : "Transfer"}
                        </SaveButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </tbody>
            </Table>
          </Card>
        )}

        {showModal && selectedSample && (
          <Modal onClick={closeModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>Sample Transfer Details</ModalTitle>
                <CloseButton onClick={closeModal}>&times;</CloseButton>
              </ModalHeader>
              <ModalBody>
                <PatientInfoGrid>
                  <InfoItem>
                    <InfoLabel>Employee Name</InfoLabel>
                    <InfoValue>{selectedSample.employee_name || "Unknown"}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Employee ID</InfoLabel>
                    <InfoValue>{selectedSample.employee_id}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Age & Gender</InfoLabel>
                    <InfoValue>
                      {selectedSample.age ? `${selectedSample.age} years • ${selectedSample.gender}` : "Unknown"}
                    </InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Barcode</InfoLabel>
                    <InfoValue>{selectedSample.barcode}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Collection Date</InfoLabel>
                    <InfoValue>
                      {new Date(selectedSample.created_date || selectedSample.collected_date).toLocaleDateString(
                        "en-GB",
                      )}
                    </InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Collected By</InfoLabel>
                    <InfoValue>{selectedSample.collected_by || "System"}</InfoValue>
                  </InfoItem>
                </PatientInfoGrid>

                <TransferInfo>Transferred to: Shanmuga Reference Lab</TransferInfo>

                <TestsSection>
                  <SectionHeader>
                    <SectionTitle>
                      Tests for Transfer
                      <TestCount>{getValidTests(selectedSample.testdetails).length}</TestCount>
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
                      <span>Select All (Transferred)</span>
                    </SelectAllContainer>
                  </SectionHeader>

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
                      {getValidTests(selectedSample.testdetails).map((test, index) => {
                        const testKey = `${selectedSample.employee_id}_${test.test_id}`

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
                              <TestName>{test.testname || test.test_name || "Unknown Test"}</TestName>
                            </TableCell>
                            <TableCell>
                              <TestContainer>{test.specimen_type || test.container || "Standard"}</TestContainer>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={testStatuses[testKey] || "Collected"}
                                onChange={(e) => handleStatusChange(testKey, e.target.value)}
                              >
                                <option value="Collected">Collected</option>
                                <option value="Transferred">Transferred</option>
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
                    {saving ? "Transferring..." : "Transfer Selected Samples"}
                  </SaveButton>
                </TestsSection>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </Container>
    </>
  )
}

export default SampleTransfer
