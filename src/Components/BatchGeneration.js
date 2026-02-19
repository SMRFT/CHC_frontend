"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"

// Add jsPDF imports - you'll need to install these packages
// npm install jspdf jspdf-autotable

// For now, we'll simulate the imports with CDN
// In your actual project, uncomment these lines after installing the packages:
// import jsPDF from "jspdf"
// import autoTable from "jspdf-autotable"

// Styled components (from your first document)
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

const CreateBatchButton = styled(Button)`
  background: ${(props) => (props.disabled ? "#cbd5e0" : "linear-gradient(135deg, #38a169 0%, #2f855a 100%)")};
  font-size: 1.125rem;
  padding: 1rem 2rem;
`

const DownloadButton = styled(Button)`
  background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  background: ${(props) => {
    switch (props.status) {
      case "transferred":
        return "linear-gradient(135deg, #38a169 0%, #2f855a 100%)"
      case "pending":
        return "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)"
      default:
        return "#cbd5e0"
    }
  }};
  color: white;
`

const BatchSummary = styled.div`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 2px solid #667eea;
  border-radius: 1rem;
  padding: 2rem;
  margin: 2rem 0;
`

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
`

const SummaryItem = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`

const SummaryValue = styled.div`
  font-size: 1.875rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
`

const SummaryLabel = styled.div`
  font-size: 0.875rem;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
`

const SpecimenSummary = styled.div`
  background: #f7fafc;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin: 1.5rem 0;
`

const SpecimenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

const SpecimenItem = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`

const SpecimenType = styled.div`
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
`

const SpecimenCount = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #667eea;
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
  padding: 2rem;
  border-radius: 1rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
`

const ModalTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: #1a202c;
  font-size: 1.25rem;
`

const ModalText = styled.p`
  margin: 1rem 0;
  color: #4a5568;
  line-height: 1.6;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`

const SecondaryButton = styled(Button)`
  background: #cbd5e0;
  color: #4a5568;
  
  &:hover:not(:disabled) {
    background: #a0aec0;
  }
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
    content: '📦';
    font-size: 4rem;
    display: block;
    margin-bottom: 1.5rem;
  }
`

const BatchGeneration = () => {
  const [selectedDate, setSelectedDate] = useState("")
  const [transferredSamples, setTransferredSamples] = useState([])
  const [loadingSamples, setLoadingSamples] = useState(false)
  const [sampleError, setSampleError] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [loadingBatch, setLoadingBatch] = useState(false)
  const [batchError, setBatchError] = useState(null)
  const [batchSuccess, setBatchSuccess] = useState(null)
  const [createdBatchData, setCreatedBatchData] = useState(null)

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  const getCurrentDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  useEffect(() => {
    setSelectedDate(getCurrentDate())
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchTransferredSamples()
    }
  }, [selectedDate])

  const fetchTransferredSamples = async () => {
    setLoadingSamples(true)
    setSampleError(null)
    setTransferredSamples([])

    try {
      let url = `${Labbaseurl}samples/transferred/?samplestatus=Transferred`
      if (selectedDate) {
        url += `&date=${selectedDate}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch transferred samples.")
      }

      const data = await response.json()
      if (data.transferred_samples && Array.isArray(data.transferred_samples)) {
        setTransferredSamples(data.transferred_samples)
      }
    } catch (error) {
      setSampleError(error.message)
    } finally {
      setLoadingSamples(false)
    }
  }

  const handleBatchCreation = () => {
    if (transferredSamples.length === 0) {
      setBatchError("No samples to batch. Please fetch samples first.")
      return
    }
    setShowConfirmModal(true)
  }

  const confirmBatchCreation = async () => {
    setShowConfirmModal(false)
    setLoadingBatch(true)
    setBatchError(null)
    setBatchSuccess(null)

    try {
      const batchDetails = transferredSamples.map((sample) => ({
        barcode: sample.barcode,
      }))

      const payload = {
        batch_details: batchDetails,
        received: false,
        remarks: null,
      }

      const response = await fetch(`${Labbaseurl}batch/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || JSON.stringify(errorData) || "Failed to create batch.")
      }

      const data = await response.json()
      setBatchSuccess("Batch created successfully!")
      setCreatedBatchData({
        ...data,
        samples: transferredSamples,
      })

      setTransferredSamples([])
    } catch (error) {
      setBatchError(error.message)
    } finally {
      setLoadingBatch(false)
    }
  }

  const downloadPDF = async () => {
    if (!createdBatchData) return

    try {
      // Create scripts for jsPDF and autoTable if they don't exist
      if (!window.jsPDF) {
        // Load jsPDF
        const jsPDFScript = document.createElement('script')
        jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        document.head.appendChild(jsPDFScript)

        await new Promise((resolve, reject) => {
          jsPDFScript.onload = resolve
          jsPDFScript.onerror = reject
        })

        // Load autoTable plugin
        const autoTableScript = document.createElement('script')
        autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js'
        document.head.appendChild(autoTableScript)

        await new Promise((resolve, reject) => {
          autoTableScript.onload = resolve
          autoTableScript.onerror = reject
        })
      }

      // Access jsPDF from the global window object
      const jsPDF = window.jsPDF || window.jspdf?.jsPDF
      if (!jsPDF) {
        throw new Error('jsPDF library failed to load')
      }

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.width
      const currentDate = new Date()
      const formattedDate = currentDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      const formattedTime = currentDate.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })

      // Barcode (simple representation)
      doc.setFontSize(10)
      doc.setFont("courier", "normal")
      doc.text("||||| || ||| | |||| ||| || | |||||| | || ||| ||||", 20, 20)

      // Main Header
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text("Shanmuga Diagnostics", pageWidth / 2, 35, { align: "center" })

      doc.setFontSize(16)
      doc.setFont("helvetica", "normal")
      doc.text("Shipment Report", pageWidth / 2, 45, { align: "center" })

      // Add underline for Shipment Report
      const textWidth = doc.getTextWidth("Shipment Report")
      doc.line((pageWidth - textWidth) / 2, 47, (pageWidth + textWidth) / 2, 47)

      // Left column details
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")

      const leftX = 20
      const rightX = pageWidth / 2 + 20
      let yPos = 65

      // Left side information
      doc.text(`Shipment No    : ${createdBatchData.batch_number || "N/A"}`, leftX, yPos)
      doc.text(`Shipment Date  : ${formattedDate} ${formattedTime}`, rightX, yPos)
      yPos += 10

      // Main table
      const tableHeaders = [
        "Specimen Id",
        "Collection Date",
        "Patient Name",
        "Test Name",
        "Received On",
      ]

      const tableData = createdBatchData.samples.map((sample, index) => [
        sample.barcode || "N/A",
        formattedDate + " " + formattedTime.substring(0, 5),
        sample.patient_name || `Patient ${index + 1}`,
        sample.testdetails?.testname || "N/A",
        "", // Received On
      ])

      // Use autoTable
      doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: yPos,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [173, 216, 230], // Light blue
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 20 },
          2: { cellWidth: 18 },
          3: { cellWidth: 20 },
          4: { cellWidth: 25 },
        },
        margin: { left: 20, right: 20 },
      })

      // Specimen Summary Table
      yPos = doc.lastAutoTable.finalY + 15

      const specimenHeaders = ["Specimen Name", "Count"]
      const specimenData = []

      if (createdBatchData.specimen_count) {
        createdBatchData.specimen_count.forEach((spec) => {
          specimenData.push([spec.specimen_type, spec.count.toString()])
        })

        const totalCount = createdBatchData.specimen_count.reduce((sum, spec) => sum + spec.count, 0)
        specimenData.push(["Total", totalCount.toString()])
      }

      if (specimenData.length > 0) {
        doc.autoTable({
          head: [specimenHeaders],
          body: specimenData,
          startY: yPos,
          styles: {
            fontSize: 10,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [173, 216, 230], // Light blue
            textColor: [0, 0, 0],
            fontStyle: "bold",
          },
          columnStyles: {
            0: { cellWidth: 80 },
            1: { cellWidth: 30, halign: "center" },
          },
          margin: { left: 20, right: 20 },
        })

        yPos = doc.lastAutoTable.finalY + 30
      } else {
        yPos += 30
      }

      // Signature section
      doc.setFontSize(10)
      doc.text("Signature      :", leftX, yPos)

      // Save the PDF
      doc.save(`shipment_${createdBatchData.batch_number}.pdf`)

    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("PDF generation failed. Please ensure you have a stable internet connection and try again.")
    }
  }

  return (
    <>
      <Container>
        <Header>
          <Title>Batch Generation</Title>
          <Subtitle>Create and manage sample batches for laboratory processing</Subtitle>
        </Header>

        <Card>
          <SectionTitle>Search Parameters</SectionTitle>
          <FilterSection>
            <FilterGroup>
              <Label htmlFor="selectedDate">Select Date</Label>
              <Input
                id="selectedDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </FilterGroup>
          </FilterSection>

          {sampleError && <Message className="error">{sampleError}</Message>}
          {loadingSamples && <Message className="loading">Loading samples...</Message>}
        </Card>

        {transferredSamples.length > 0 && (
          <Card>
            <SectionTitle>Transferred Samples ({transferredSamples.length} samples)</SectionTitle>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Transfer Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {transferredSamples.map((sample, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{sample.employee_id}</TableCell>
                    <TableCell>{sample.barcode}</TableCell>
                    <TableCell>
                      {sample.transferred_date ? new Date(sample.transferred_date).toLocaleDateString("en-GB") : "N/A"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status="transferred">Transferred</StatusBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <CreateBatchButton onClick={handleBatchCreation}>Create Batch</CreateBatchButton>
            </div>
          </Card>
        )}

        {transferredSamples.length === 0 && !loadingSamples && !sampleError && (
          <Card>
            <EmptyState>
              <h3>No Transferred Samples Found</h3>
              <p>Try selecting a different date</p>
            </EmptyState>
          </Card>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <Modal>
            <ModalContent>
              <ModalTitle>Confirm Batch Creation</ModalTitle>
              <ModalText>Are you sure you want to create a batch with {transferredSamples.length} samples?</ModalText>
              <ModalText>
                <strong>Note:</strong> Shipment details will be automatically populated.
              </ModalText>
              <ButtonGroup>
                <Button onClick={confirmBatchCreation} disabled={loadingBatch}>
                  {loadingBatch ? "Creating..." : "Confirm"}
                </Button>
                <SecondaryButton onClick={() => setShowConfirmModal(false)} disabled={loadingBatch}>
                  Cancel
                </SecondaryButton>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}

        {batchError && <Message className="error">{batchError}</Message>}
        {batchSuccess && <Message className="success">{batchSuccess}</Message>}

        {createdBatchData && (
          <Card>
            <SectionTitle>Batch Created Successfully</SectionTitle>
            <BatchSummary>
              <h3>Batch Details</h3>
              <SummaryGrid>
                <SummaryItem>
                  <SummaryValue>{createdBatchData.batch_number}</SummaryValue>
                  <SummaryLabel>Batch Number</SummaryLabel>
                </SummaryItem>
                <SummaryItem>
                  <SummaryValue>{createdBatchData.samples?.length || 0}</SummaryValue>
                  <SummaryLabel>Total Samples</SummaryLabel>
                </SummaryItem>
                <SummaryItem>
                  <SummaryValue>{new Date().toLocaleDateString()}</SummaryValue>
                  <SummaryLabel>Created Date</SummaryLabel>
                </SummaryItem>
                <SummaryItem>
                  <SummaryValue>Shanmuga Reference Lab</SummaryValue>
                  <SummaryLabel>Shipment To</SummaryLabel>
                </SummaryItem>
              </SummaryGrid>

              {/* Specimen Summary */}
              {createdBatchData.specimen_count && createdBatchData.specimen_count.length > 0 && (
                <SpecimenSummary>
                  <h4>Specimen Summary</h4>
                  <SpecimenGrid>
                    {createdBatchData.specimen_count.map((specimen, index) => (
                      <SpecimenItem key={index}>
                        <SpecimenType>{specimen.specimen_type}</SpecimenType>
                        <SpecimenCount>{specimen.count}</SpecimenCount>
                      </SpecimenItem>
                    ))}
                    <SpecimenItem>
                      <SpecimenType style={{ color: "white" }}>Total</SpecimenType>
                      <SpecimenCount style={{ color: "white" }}>
                        {createdBatchData.specimen_count.reduce((sum, spec) => sum + spec.count, 0)}
                      </SpecimenCount>
                    </SpecimenItem>
                  </SpecimenGrid>
                </SpecimenSummary>
              )}

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <DownloadButton onClick={downloadPDF}>📄 Download PDF Report</DownloadButton>
              </div>
            </BatchSummary>
          </Card>
        )}
      </Container>
    </>
  )
}

export default BatchGeneration