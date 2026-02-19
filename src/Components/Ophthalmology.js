"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import styled from "styled-components"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

// --- Responsive Styled Components ---

const Container = styled.div`
  min-height: 100vh;
  background: #F9F7F7;
  margin-left: 260px; /* Desktop Sidebar */
  padding: clamp(1rem, 3vw, 2rem);
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    margin-left: 0; /* Full width on mobile/tablet */
  }
`

const Card = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 24px;
  padding: clamp(1rem, 4vw, 2.5rem);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
`

const Title = styled.h2`
  background: linear-gradient(135deg, #3F72AF, #112D4E);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: clamp(1.5rem, 5vw, 2.2rem);
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
`

const FiltersBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const FilterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 14px;
  
  span { font-weight: 700; color: #4a5568; white-space: nowrap; font-size: 0.9rem; }
  
  input, select {
    border: none;
    outline: none;
    width: 100%;
    font-weight: 600;
    color: #2d3748;
    background: transparent;
  }
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  @media (max-width: 768px) {
    thead { display: none; } /* Hide headers on mobile */
    tr {
      display: block;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      margin-bottom: 1rem;
      padding: 1rem;
    }
    td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      text-align: right;
      border-bottom: 1px solid #f1f5f9;
      
      &:before {
        content: attr(data-label);
        font-weight: 700;
        text-align: left;
        color: #3F72AF;
      }
      &:last-child { border-bottom: none; display: block; text-align: center; padding-top: 15px; }
    }
  }
`

const Th = styled.th`
  background: #112D4E;
  color: white;
  padding: 14px;
  font-size: 0.85rem;
  text-transform: uppercase;
  text-align: left;
  &:first-child { border-radius: 12px 0 0 0; }
  &:last-child { border-radius: 0 12px 0 0; }
`

const Td = styled.td`
  padding: 14px;
  border-bottom: 1px solid #edf2f7;
  color: #4a5568;
  font-size: 0.95rem;
`

const ActionButton = styled.button`
  background: #3F72AF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
`

// --- Form Specific Mobile Styles ---

const FormResponsiveTable = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr; /* Stack inputs on mobile */
  }

  .field-title {
    font-weight: 800;
    color: #112D4E;
    display: flex;
    align-items: center;
  }
`

const EmployeeInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 1rem;
`

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`

const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  &:focus { border-color: #3F72AF; outline: none; }
`

const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
`

const SubmitButton = styled.button`
  background: #48bb78;
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 50px;
  font-weight: 700;
  margin: 2rem auto;
  display: block;
  cursor: pointer;
  @media (max-width: 480px) { width: 100%; }
`

const Ophthalmology = () => {
  const [employees, setEmployees] = useState([])
  const [allEmployees, setAllEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [filledBarcodes, setFilledBarcodes] = useState({ approved: [], pending: [] })

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState("not_filled")

  const [visualAcuity, setVisualAcuity] = useState({
    distance: { right: "", left: "" },
    nearVision: { right: "", left: "" },
    colourVision: { right: "", left: "" },
    ocularmovement: { right: "", left: "" },
  })

  const [patientComplaints, setPatientComplaints] = useState("")
  const [remarks, setRemarks] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, ophRes] = await Promise.all([
          axios.get(`${Labbaseurl}get_all_employees/`),
          axios.get(`${Labbaseurl}get_all_ophthalmology/`),
        ])
        const approved = (ophRes.data.approved || []).map(i => i.barcode)
        const pending = (ophRes.data.pending || []).map(i => i.barcode)

        setAllEmployees(empRes.data || [])
        setFilledBarcodes({ approved, pending })

        // Default "Not Filled" list
        const notFilled = (empRes.data || []).filter(e => !approved.includes(e.barcode) && !pending.includes(e.barcode))
        setEmployees(notFilled)
      } catch (err) {
        toast.error("Error loading data")
      }
    }
    fetchData()
  }, [])

  const filteredList = useMemo(() => {
    let list = []
    const approvedSet = new Set(filledBarcodes.approved)
    const pendingSet = new Set(filledBarcodes.pending)

    if (statusFilter === "approved") list = allEmployees.filter(e => approvedSet.has(e.barcode))
    else if (statusFilter === "pending") list = allEmployees.filter(e => pendingSet.has(e.barcode))
    else list = employees // "not_filled"

    return list.filter(emp => {
      const q = searchInput.toLowerCase()
      const matchesSearch = !q || emp.employee_name?.toLowerCase().includes(q) || emp.barcode?.toLowerCase().includes(q)

      const created = emp.created_date ? new Date(emp.created_date).setHours(0, 0, 0, 0) : null
      const s = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null
      const e = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null
      const matchesDate = (!s || (created && created >= s)) && (!e || (created && created <= e))

      return matchesSearch && matchesDate
    })
  }, [statusFilter, allEmployees, employees, filledBarcodes, searchInput, startDate, endDate])

  const handleSelectEmployee = async (emp) => {
    setSelectedEmployee(emp)
    try {
      const res = await axios.get(`${Labbaseurl}get_ophthalmology_by_barcode/${emp.barcode}/`)
      if (res.data) {
        const va = typeof res.data.visual_acuity === 'string' ? JSON.parse(res.data.visual_acuity) : res.data.visual_acuity
        setVisualAcuity(va || visualAcuity)
        setPatientComplaints(res.data.patient_complaints || "")
        setRemarks(res.data.remarks || "")
      }
    } catch {
      // Reset if new
      setVisualAcuity({ distance: { right: "", left: "" }, nearVision: { right: "", left: "" }, colourVision: { right: "", left: "" }, ocularmovement: { right: "", left: "" } })
      setPatientComplaints(""); setRemarks("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { barcode: selectedEmployee.barcode, visual_acuity: visualAcuity, patient_complaints: patientComplaints, remarks }
    try {
      await axios.post(`${Labbaseurl}save_ophthalmology/`, payload)
      toast.success("Saved Successfully")
      setEmployees(prev => prev.filter(e => e.barcode !== selectedEmployee.barcode))
      setSelectedEmployee(null)
    } catch (err) { toast.error("Error saving data") }
  }

  return (
    <Container>
      <ToastContainer theme="colored" />
      <Card>
        {!selectedEmployee ? (
          <>
            <Title>Ophthalmology Management</Title>
            <FiltersBar>
              <FilterItem>
                <span>Search</span>
                <input placeholder="Name / Barcode" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
              </FilterItem>
              <FilterItem>
                <span>Status</span>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="not_filled">Not Filled</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
              </FilterItem>
              <FilterItem>
                <span>From</span>
                <DatePicker selected={startDate} onChange={d => setStartDate(d)} dateFormat="dd/MM/yyyy" placeholderText="Start" />
              </FilterItem>
              <FilterItem>
                <span>To</span>
                <DatePicker selected={endDate} onChange={d => setEndDate(d)} dateFormat="dd/MM/yyyy" placeholderText="End" />
              </FilterItem>
            </FiltersBar>

            <StyledTable>
              <thead>
                <tr>
                  <Th>ID</Th><Th>Name</Th><Th>Age/Sex</Th><Th>Barcode</Th><Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map(emp => (
                  <tr key={emp.barcode}>
                    <Td data-label="ID">{emp.employee_id}</Td>
                    <Td data-label="Name"><b>{emp.employee_name}</b></Td>
                    <Td data-label="Details">{emp.age}Y / {emp.gender}</Td>
                    <Td data-label="Barcode">{emp.barcode}</Td>
                    <Td>
                      <ActionButton onClick={() => handleSelectEmployee(emp)}>Open Form</ActionButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </>
        ) : (
          <div>
            <ActionButton onClick={() => setSelectedEmployee(null)} style={{ background: '#718096', marginBottom: '1rem' }}>
              ← Back to List
            </ActionButton>

            <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#112D4E' }}>Patient: {selectedEmployee.employee_name}</h4>
              <EmployeeInfoGrid>
                <div><small>ID:</small> {selectedEmployee.employee_id}</div>
                <div><small>Age:</small> {selectedEmployee.age}</div>
                <div><small>Gender:</small> {selectedEmployee.gender}</div>
                <div><small>Barcode:</small> {selectedEmployee.barcode}</div>
              </EmployeeInfoGrid>
            </div>

            <form onSubmit={handleSubmit}>
              <h3 style={{ borderLeft: '4px solid #3F72AF', paddingLeft: '10px', marginBottom: '1.5rem' }}>Visual Examination</h3>

              {/* Distance & Near Vision Inputs */}
              {[
                { label: "Distance", key: "distance" },
                { label: "Near Vision", key: "nearVision" },
                { label: "Colour Vision", key: "colourVision" },
                { label: "Ocular Movement", key: "ocularmovement" }
              ].map(item => (
                <FormResponsiveTable key={item.key}>
                  <div className="field-title">{item.label}</div>
                  <StyledInput
                    placeholder="Right Eye"
                    value={visualAcuity[item.key].right}
                    onChange={e => setVisualAcuity({ ...visualAcuity, [item.key]: { ...visualAcuity[item.key], right: e.target.value } })}
                  />
                  <StyledInput
                    placeholder="Left Eye"
                    value={visualAcuity[item.key].left}
                    onChange={e => setVisualAcuity({ ...visualAcuity, [item.key]: { ...visualAcuity[item.key], left: e.target.value } })}
                  />
                </FormResponsiveTable>
              ))}

              <TwoColumnGrid>
                <div>
                  <h4 style={{ color: '#4a5568' }}>Complaints</h4>
                  <StyledTextarea value={patientComplaints} onChange={e => setPatientComplaints(e.target.value)} placeholder="Symptoms..." />
                </div>
                <div>
                  <h4 style={{ color: '#4a5568' }}>Remarks</h4>
                  <StyledTextarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Clinical observations..." />
                </div>
              </TwoColumnGrid>

              <SubmitButton type="submit">Save Examination Results</SubmitButton>
            </form>
          </div>
        )}
      </Card>
    </Container>
  )
}

export default Ophthalmology