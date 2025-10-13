"use client"

import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import styled from "styled-components"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  margin-left: 100px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
`

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`

const Title = styled.h2`
  color: #2d3748;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const FiltersBar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 12px;
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

const DatePickerWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 12px;
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

const StatusFilterWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 12px;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;

  select {
    width: 180px;
    border: none;
    outline: none;
    font-weight: 600;
    color: #2d3748;
    background: transparent;
    cursor: pointer;
  }
`

const ClearBtn = styled.button`
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background: #667eea; color: #fff; }
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  background: white;
`

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #667eea, #764ba2);
  th {
    color: white;
    padding: 1rem;
    text-align: center;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`

const TableBody = styled.tbody`
  tr {
    transition: all 0.3s ease;
    &:nth-child(even) { background-color: #f8fafc; }
    &:hover {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      transform: translateY(-1px);
    }
  }
  td {
    padding: 1rem;
    text-align: center;
    color: #4a5568;
    font-weight: 500;
    border-bottom: 1px solid #e2e8f0;
  }
`

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    background: linear-gradient(135deg, #5a6fd8, #6b46a5);
  }
  &:active { transform: translateY(0); }
`

const BackButton = styled.button`
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  display: flex; align-items: center; gap: 0.5rem;
  &:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
  }
`

const FormSection = styled.div` margin-bottom: 2.5rem; `
const SectionTitle = styled.h3`
  color: #2d3748; font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; padding-left: 0.5rem; border-left: 4px solid #667eea;
`

const FormTable = styled.table`
  width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  background: white; margin-bottom: 1.5rem;
`

const FormTableHeader = styled.thead`
  background: linear-gradient(135deg, #f7fafc, #edf2f7);
  th { color: #2d3748; padding: 1rem; text-align: center; font-weight: 600; font-size: 0.9rem; border-bottom: 2px solid #e2e8f0; }
`

const FormTableBody = styled.tbody`
  td {
    padding: 1rem; text-align: center; color: #4a5568; font-weight: 500; border-bottom: 1px solid #f1f5f9;
    &:first-child { font-weight: 600; background: #f8fafc; color: #2d3748; }
  }
`

const StyledInput = styled.input`
  width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; transition: 0.3s; background: white;
  &:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); transform: translateY(-1px); }
  &:hover { border-color: #cbd5e0; }
`

const StyledTextarea = styled.textarea`
  width: 100%; min-height: 120px; padding: 1rem; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 0.9rem; font-family: inherit; transition: 0.3s; resize: vertical; background: white;
  &:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
  &:hover { border-color: #cbd5e0; }
`

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`

const TextareaColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const EmployeeInfoCard = styled.div`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; backdrop-filter: blur(10px);
`

const EmployeeInfoGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem; margin-top: 1rem;
`

const EmployeeInfoItem = styled.div`
  background: rgba(255, 255, 255, 0.7); padding: 1rem; border-radius: 12px; text-align: center; border: 1px solid rgba(102, 126, 234, 0.1);
  .label { font-size: 0.8rem; color: #718096; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 0.5rem; }
  .value { font-size: 1.1rem; color: #2d3748; font-weight: 700; }
`

const EmployeeInfoTitle = styled.h3` color: #2d3748; font-size: 1.2rem; font-weight: 600; margin: 0; text-align: center; `

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white; border: none; padding: 1rem 2rem; border-radius: 50px; font-weight: 600; cursor: pointer; transition: 0.3s;
  font-size: 1rem; text-transform: uppercase; letter-spacing: 0.5px; width: 200px; margin: 2rem auto 0; display: block;
  &:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(72, 187, 120, 0.3); background: linear-gradient(135deg, #38a169, #2f855a); }
  &:active { transform: translateY(-1px); }
`

const NoDataMessage = styled.p`
  text-align: center; color: #718096; font-size: 1.1rem; padding: 3rem; background: rgba(255, 255, 255, 0.5); border-radius: 12px; border: 2px dashed #cbd5e0;
`

const Ophthalmology = () => {
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [status, setStatus] = useState("")

  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const [visualAcuity, setVisualAcuity] = useState({
    distance: { right: "", left: "" },
    nearVision: { right: "", left: "" },
    colourVision: { right: "", left: "" },
    ocularmovement: { right: "", left: "" },
  })

  const [patientComplaints, setPatientComplaints] = useState("")
  const [remarks, setRemarks] = useState("")

  const [allEmployees, setAllEmployees] = useState([])
  const [filledBarcodes, setFilledBarcodes] = useState([]) // store as array; convert to Set via useMemo
  const [statusFilter, setStatusFilter] = useState("pending") // "pending" | "approved"

  useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const [empRes, ophRes] = await Promise.all([
        axios.get(`${Labbaseurl}get_all_employees/`),
        axios.get(`${Labbaseurl}get_all_ophthalmology/`),
      ]);

      const allEmployeesLocal = empRes.data || [];
      const approvedSet = new Set((ophRes.data.approved || []).map((item) => item.barcode));
      const pendingSet = new Set((ophRes.data.pending || []).map((item) => item.barcode));

      const notFilledEmployees = allEmployeesLocal.filter(
        (emp) => !approvedSet.has(emp.barcode) && !pendingSet.has(emp.barcode)
      );

      setAllEmployees(allEmployeesLocal);
      setFilledBarcodes({
        approved: Array.from(approvedSet),
        pending: Array.from(pendingSet),
      });

      setEmployees(notFilledEmployees);
    } catch (err) {
      console.error("Error fetching employees:", err);
      toast.error("Failed to fetch employees. Please try again.");
    }
  };

  fetchEmployees();
}, []);


  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase())
    }, 350)
    return () => clearTimeout(t)
  }, [searchInput])

  const filterBySearchAndDate = (list) => {
    const q = debouncedSearch

    const toMidnight = (d) => {
      if (!d) return null
      const dt = new Date(d)
      dt.setHours(0, 0, 0, 0)
      return dt
    }

    const s = toMidnight(startDate)
    const e = toMidnight(endDate)

    return list.filter((emp) => {
      const matchesSearch =
        !q ||
        (emp.employee_id && String(emp.employee_id).toLowerCase().includes(q)) ||
        (emp.employee_name && emp.employee_name.toLowerCase().includes(q)) ||
        (emp.barcode && String(emp.barcode).toLowerCase().includes(q))

      if (!matchesSearch) return false

      if (!startDate && !endDate) return true
      const created = emp.created_date ? new Date(emp.created_date) : null
      if (created) created.setHours(0, 0, 0, 0)

      const inRange =
        (!s && !e) ||
        (s && !e && created && created.getTime() >= s.getTime()) ||
        (!s && e && created && created.getTime() <= e.getTime()) ||
        (s && e && created && created.getTime() >= s.getTime() && created.getTime() <= e.getTime())

      return inRange
    })
  }

 const filledSets = useMemo(() => ({
  approved: new Set(filledBarcodes.approved || []),
  pending: new Set(filledBarcodes.pending || []),
}), [filledBarcodes]);

const baseList = useMemo(() => {
  if (statusFilter === "approved") {
    return allEmployees.filter(emp => filledSets.approved.has(emp.barcode));
  }
  if (statusFilter === "pending") {
    return allEmployees.filter(emp => filledSets.pending.has(emp.barcode));
  }
  if (statusFilter === "not_filled") {
    return employees; // already filtered as not filled
  }
  return allEmployees;
}, [statusFilter, allEmployees, employees, filledSets]);


  const filteredList = useMemo(() => filterBySearchAndDate(baseList), [baseList, debouncedSearch, startDate, endDate])

 const handleSelectEmployee = async (empId) => {
  const employee =
    allEmployees.find((emp) => emp.employee_id === empId) ||
    employees.find((emp) => emp.employee_id === empId);

  setSelectedEmployee(employee || null);

  if (!employee) return;

  try {
    // Fetch saved ophthalmology record if exists
    const res = await axios.get(`${Labbaseurl}get_ophthalmology_by_barcode/${employee.barcode}/`);

    if (res.data) {
      const data = res.data;

      // Parse the visual_acuity JSON safely
      let parsedVA = {};
      try {
        parsedVA = JSON.parse(data.visual_acuity);
      } catch {
        parsedVA = data.visual_acuity || {};
      }

      setVisualAcuity({
        distance: parsedVA.distance || { right: "", left: "" },
        nearVision: parsedVA.nearVision || { right: "", left: "" },
        colourVision: parsedVA.colourVision || { right: "", left: "" },
        ocularmovement: parsedVA.ocularmovement || { right: "", left: "" },
      });

      setPatientComplaints(data.patient_complaints || "");
      setRemarks(data.remarks || "");
      setStatus(data.status || "");
    }
  } catch (err) {
    console.log("No saved data found (new form).");
    // Reset fields if no data
    setVisualAcuity({
      distance: { right: "", left: "" },
      nearVision: { right: "", left: "" },
      colourVision: { right: "", left: "" },
      ocularmovement: { right: "", left: "" },
    });
    setPatientComplaints("");
    setRemarks("");
    setStatus("");
  }
};



  const handleBackToList = () => {
    setSelectedEmployee(null)
    setVisualAcuity({
      distance: { right: "", left: "" },
      nearVision: { right: "", left: "" },
      colourVision: { right: "", left: "" },
      ocularmovement: { right: "", left: "" },
    })

    setPatientComplaints("")
    setRemarks("")
    setStatus("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedEmployee) return

    const payload = {
      barcode: selectedEmployee.barcode,
      visual_acuity: {
        distance: visualAcuity.distance,
        nearVision: visualAcuity.nearVision,
        colourVision: visualAcuity.colourVision,
        ocularmovement: visualAcuity.ocularmovement,
      },
      patient_complaints: patientComplaints,
      remarks,
    }

    try {
      await axios.post(`${Labbaseurl}save_ophthalmology/`, payload)
      toast.success("Ophthalmology data saved successfully!")

      // 🆕 Remove employee from list immediately
      setEmployees((prev) => prev.filter((emp) => emp.barcode !== selectedEmployee.barcode))

      handleBackToList()
    } catch (error) {
      console.error("Error saving:", error)
      toast.error("Ophthalmology with this employee already exists.")
    }
  }

  return (
    <Container>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Card>
        {!selectedEmployee ? (
          <>
            <Title>Employee Management System</Title>

            <FiltersBar>
              <SearchWrap>
                <span style={{ fontWeight: 700, color: "#4a5568" }}>Search</span>
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Barcode, Name, Employee ID"
                />
              </SearchWrap>

              <DatePickerWrap>
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
              </DatePickerWrap>

              <DatePickerWrap>
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
              </DatePickerWrap>

              {/* NEW: Status filter combobox (pending/approved) */}
              <StatusFilterWrap>
  <span style={{ fontWeight: 700, color: "#4a5568" }}>Status</span>
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    aria-label="Filter by status"
  >
    <option value="not_filled">Not Filled</option>
    <option value="pending">Pending</option>
    <option value="approved">Approved</option>
  </select>
</StatusFilterWrap>


              {(searchInput || startDate || endDate) && (
                <ClearBtn
                  onClick={() => {
                    setSearchInput("")
                    setDebouncedSearch("")
                    setStartDate(null)
                    setEndDate(null)
                  }}
                >
                  Clear Filters
                </ClearBtn>
              )}
            </FiltersBar>

            {filteredList.length === 0 ? (
              <NoDataMessage>No employees match the current filters.</NoDataMessage>
            ) : (
              <StyledTable>
                <TableHeader>
                  <tr>
                    <th>Employee ID</th>
                    <th>Employee Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Barcode</th>
                    <th>Action</th>
                  </tr>
                </TableHeader>
                <TableBody>
                  {filteredList.map((emp) => (
                    <tr key={emp.employee_id}>
                      <td>{emp.employee_id}</td>
                      <td>{emp.employee_name}</td>
                      <td>{emp.age}</td>
                      <td>{emp.gender}</td>
                      <td>{emp.barcode}</td>
                      <td>
                    <ActionButton onClick={() => handleSelectEmployee(emp.employee_id)}>
                      Fill Ophthalmology Form
                    </ActionButton>

                  </td>

                    </tr>
                  ))}
                </TableBody>
              </StyledTable>
            )}
          </>
        ) : (
          <div>
            <BackButton onClick={handleBackToList}>← Back to Employee List</BackButton>

            <EmployeeInfoCard>
              <EmployeeInfoTitle>Patient Information</EmployeeInfoTitle>
              <EmployeeInfoGrid>
                <EmployeeInfoItem>
                  <div className="label">Employee ID</div>
                  <div className="value">{selectedEmployee.employee_id}</div>
                </EmployeeInfoItem>
                <EmployeeInfoItem>
                  <div className="label">Name</div>
                  <div className="value">{selectedEmployee.employee_name}</div>
                </EmployeeInfoItem>
                <EmployeeInfoItem>
                  <div className="label">Age</div>
                  <div className="value">{selectedEmployee.age} years</div>
                </EmployeeInfoItem>
                <EmployeeInfoItem>
                  <div className="label">Gender</div>
                  <div className="value">{selectedEmployee.gender}</div>
                </EmployeeInfoItem>
                <EmployeeInfoItem>
                  <div className="label">Barcode</div>
                  <div className="value">{selectedEmployee.barcode}</div>
                </EmployeeInfoItem>
               <EmployeeInfoItem>
            <div className="label">Status</div>
            <div className="value">
              {filledSets.approved.has(selectedEmployee.barcode)
                ? "Approved"
                : filledSets.pending.has(selectedEmployee.barcode)
                ? "Pending"
                : "Not Filled"}
            </div>
          </EmployeeInfoItem>


              </EmployeeInfoGrid>
            </EmployeeInfoCard>

            <Title>Ophthalmology Examination Form</Title>
            <form onSubmit={handleSubmit}>
              <FormSection>
                <SectionTitle>Visual Acuity Assessment</SectionTitle>

                {/* ===== Distance ===== */}
                <FormTable>
                  <FormTableHeader>
                    <tr>
                      <th>Distance</th>
                      <th>Right Eye</th>
                      <th>Left Eye</th>
                    </tr>
                  </FormTableHeader>
                  <FormTableBody>
                    <tr>
                      <td>Distance</td>
                      <td>
                        <StyledInput
                          value={visualAcuity.distance.right}
                          onChange={(e) =>
                            setVisualAcuity({
                              ...visualAcuity,
                              distance: { ...visualAcuity.distance, right: e.target.value },
                            })
                          }
                        />
                      </td>
                      <td>
                        <StyledInput
                          value={visualAcuity.distance.left}
                          onChange={(e) =>
                            setVisualAcuity({
                              ...visualAcuity,
                              distance: { ...visualAcuity.distance, left: e.target.value },
                            })
                          }
                        />
                      </td>
                    </tr>
                  </FormTableBody>
                </FormTable>

                {/* ===== Near Vision ===== */}
                <FormTable>
                  <FormTableHeader>
                    <tr>
                      <th>Near Vision</th>
                      <th>Right Eye</th>
                      <th>Left Eye</th>
                    </tr>
                  </FormTableHeader>
                  <FormTableBody>
                    <tr>
                      <td>Near Vision</td>
                      <td>
                        <StyledInput
                          value={visualAcuity.nearVision.right}
                          onChange={(e) =>
                            setVisualAcuity({
                              ...visualAcuity,
                              nearVision: { ...visualAcuity.nearVision, right: e.target.value },
                            })
                          }
                        />
                      </td>
                      <td>
                        <StyledInput
                          value={visualAcuity.nearVision.left}
                          onChange={(e) =>
                            setVisualAcuity({
                              ...visualAcuity,
                              nearVision: { ...visualAcuity.nearVision, left: e.target.value },
                            })
                          }
                        />
                      </td>
                    </tr>
                  </FormTableBody>
                </FormTable>

                {/* ===== Colour Vision ===== */}
                <FormTable>
                  <FormTableHeader>
                    <tr>
                      <th>Colour Vision</th>
                      <th>Right Eye</th>
                      <th>Left Eye</th>
                    </tr>
                  </FormTableHeader>
                  <FormTableBody>
                    <tr>
                      <td>Colour Vision</td>
                      <td>
                        <StyledInput
                          value={visualAcuity.colourVision.right}
                          onChange={(e) =>
                            setVisualAcuity({
                              ...visualAcuity,
                              colourVision: { ...visualAcuity.colourVision, right: e.target.value },
                            })
                          }
                        />
                      </td>
                      <td>
                        <StyledInput
                          value={visualAcuity.colourVision.left}
                          onChange={(e) =>
                            setVisualAcuity({
                              ...visualAcuity,
                              colourVision: { ...visualAcuity.colourVision, left: e.target.value },
                            })
                          }
                        />
                      </td>
                    </tr>
                  </FormTableBody>
                </FormTable>

                {/* ===== ocular movement ===== */}
                <FormTable>
                  <FormTableHeader>
                    <tr>
                      <th>ocular movement</th>
                      <th>Right Eye</th>
                      <th>Left Eye</th>
                    </tr>
                  </FormTableHeader>
                  <FormTableBody>
                    <tr>
                      <td>ocular movement</td>
                      <td>
                        <StyledInput
                          value={visualAcuity.ocularmovement.right}
                          onChange={(e) =>
                            setVisualAcuity({
                              ...visualAcuity,
                              ocularmovement: { ...visualAcuity.ocularmovement, right: e.target.value },
                            })
                          }
                        />
                      </td>
                      <td>
                        <StyledInput
                          value={visualAcuity.ocularmovement.left}
                          onChange={(e) =>
                            setVisualAcuity({
                              ...visualAcuity,
                              ocularmovement: { ...visualAcuity.ocularmovement, left: e.target.value },
                            })
                          }
                        />
                      </td>
                    </tr>
                  </FormTableBody>
                </FormTable>
              </FormSection>

              <TwoColumnGrid>
                <TextareaColumn>
                  <SectionTitle>Patient Complaints</SectionTitle>
                  <StyledTextarea
                    value={patientComplaints}
                    onChange={(e) => setPatientComplaints(e.target.value)}
                    placeholder="Enter patient complaints and symptoms..."
                  />
                </TextareaColumn>

                <TextareaColumn>
                  <SectionTitle>Clinical Remarks</SectionTitle>
                  <StyledTextarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter any additional observations, recommendations, or clinical notes..."
                  />
                </TextareaColumn>
              </TwoColumnGrid>

              <SubmitButton type="submit">Save Examination</SubmitButton>
            </form>
          </div>
        )}
      </Card>
    </Container>
  )
}

export default Ophthalmology