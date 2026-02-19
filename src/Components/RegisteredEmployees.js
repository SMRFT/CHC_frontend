import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { Download, Search, Calendar, FilterX, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// --- Styled Components ---

const Container = styled.div`
  min-height: 100vh;
  background: #F9F7F7;
  margin-left: 260px; 
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px;
  padding: clamp(16px, 3vw, 32px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }

  h2 {
    color: #112D4E;
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 700;
    margin: 0;
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #dbe2ef;
  border-radius: 10px;
  padding: 8px 12px;
  
  input {
    border: none;
    outline: none;
    width: 100%;
    margin-left: 8px;
    font-size: 14px;
    color: #3F72AF;
    &::placeholder { color: #999; }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  @media (max-width: 480px) { flex-direction: column; }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 14px;
  transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
`;

const TableContainer = styled.div`
  border: 1px solid #dbe2ef;
  border-radius: 12px;
  overflow-x: auto; /* Desktop scroll if needed */
  background: white;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px; /* Ensures desktop doesn't squash columns */

  thead {
    background: #f8fafd;
    @media (max-width: 1100px) { display: none; }
  }

  th {
    padding: 14px 12px;
    text-align: left;
    color: #112D4E;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    border-bottom: 2px solid #dbe2ef;
    white-space: nowrap;
  }

  @media (max-width: 1100px) {
    min-width: 100%;
    tr {
      display: block;
      padding: 16px;
      border-bottom: 2px solid #f0f4f8;
      background: #fff;
      margin-bottom: 10px;
      border-radius: 12px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.02);
    }
    td {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      border-bottom: 1px solid #f9f9f9;
      text-align: right;
      
      &:before {
        content: attr(data-label);
        font-weight: 700;
        color: #3F72AF;
        text-align: left;
        margin-right: 15px;
      }
      &:last-child { border-bottom: none; }
    }
  }
`;

const Td = styled.td`
  padding: 12px;
  color: #444;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: #666;
  b { color: #112D4E; }
`;

const PageControls = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const PageBtn = styled.button`
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid ${props => props.active ? '#3F72AF' : '#dbe2ef'};
  background: ${props => props.active ? '#3F72AF' : '#fff'};
  color: ${props => props.active ? '#fff' : '#3F72AF'};
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

export default function RegisteredEmployees() {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [employees, setEmployees] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${Labbaseurl}get_all_registered_employees/`);
        setEmployees(res.data || []);
      } catch (err) { console.error("Fetch Error:", err); }
    };
    fetchEmployees();
  }, [Labbaseurl]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(delay);
  }, [searchInput]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        emp.employee_name?.toLowerCase().includes(s) ||
        emp.employee_id?.toString().includes(s) ||
        emp.barcode?.toLowerCase().includes(s) ||
        emp.department?.toLowerCase().includes(s);

      const created = emp.created_date ? new Date(emp.created_date).setHours(0, 0, 0, 0) : null;
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null;

      const matchesDate = (!start || (created && created >= start)) && (!end || (created && created <= end));
      return matchesSearch && matchesDate;
    });
  }, [employees, searchTerm, startDate, endDate]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const currentData = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDownload = () => {
    const exportData = filteredEmployees.map(emp => ({
      "Employee ID": emp.employee_id,
      "Barcode": emp.barcode || "-",
      "Name": emp.employee_name,
      "Gender": emp.gender,
      "Age": emp.age,
      "DOB": emp.dob ? new Date(emp.dob).toLocaleDateString() : "-",
      "Department": emp.department,
      "Email": emp.email || "-",
      "Mobile": emp.mobile || "-",
      "Created Date": emp.created_date ? new Date(emp.created_date).toLocaleDateString() : "-"
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "Employee_Directory.xlsx");
  };

  const getPaginationRange = () => {
    const delta = 1;
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    if (currentPage > 1 + delta) range.unshift("...");
    if (currentPage < totalPages - delta) range.push("...");
    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);
    return range;
  };

  return (
    <Container>
      <ContentWrapper>
        <HeaderContainer>
          <h2>Employee Directory</h2>
          <ActionButtons>
            <IconButton onClick={handleDownload} style={{ background: '#48BB78', color: '#fff' }}>
              <Download size={18} /> Export Excel
            </IconButton>
            {(searchTerm || startDate || endDate) && (
              <IconButton onClick={() => { setSearchInput(""); setStartDate(null); setEndDate(null); }} style={{ background: '#F56565', color: '#fff' }}>
                <FilterX size={18} /> Clear Filters
              </IconButton>
            )}
          </ActionButtons>
        </HeaderContainer>

        <FiltersGrid>
          <InputGroup>
            <Search size={18} color="#999" />
            <input placeholder="Search ID, Barcode, Name..." value={searchInput} onChange={e => setSearchInput(e.target.value)} />
          </InputGroup>
          <InputGroup>
            <Calendar size={18} color="#999" />
            <DatePicker selected={startDate} onChange={d => { setStartDate(d); setCurrentPage(1); }} placeholderText="From Date" dateFormat="dd/MM/yyyy" />
          </InputGroup>
          <InputGroup>
            <Calendar size={18} color="#999" />
            <DatePicker selected={endDate} onChange={d => { setEndDate(d); setCurrentPage(1); }} placeholderText="To Date" dateFormat="dd/MM/yyyy" />
          </InputGroup>
        </FiltersGrid>

        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <th>ID</th>
                <th>Barcode</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>DOB</th>
                <th>Dept</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? currentData.map((emp, i) => (
                <tr key={emp.employee_id || i}>
                  <Td data-label="Employee ID">{emp.employee_id}</Td>
                  <Td data-label="Barcode">{emp.barcode || "-"}</Td>
                  <Td data-label="Name" style={{ fontWeight: '600' }}>{emp.employee_name}</Td>
                  <Td data-label="Gender">{emp.gender}</Td>
                  <Td data-label="Age">{emp.age}</Td>
                  <Td data-label="DOB">{emp.dob ? new Date(emp.dob).toLocaleDateString() : "-"}</Td>
                  <Td data-label="Dept">{emp.department || "N/A"}</Td>
                  <Td data-label="Email">{emp.email || "-"}</Td>
                  <Td data-label="Mobile">{emp.mobile || "-"}</Td>
                  <Td data-label="Created Date">
                    {emp.created_date ? new Date(emp.created_date).toLocaleDateString() : "-"}
                  </Td>
                </tr>
              )) : (
                <tr><Td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>No records found.</Td></tr>
              )}
            </tbody>
          </StyledTable>
        </TableContainer>

        {totalPages > 0 && (
          <PaginationWrapper>
            <PageInfo>
              Showing <b>{Math.min(filteredEmployees.length, (currentPage - 1) * itemsPerPage + 1)}</b> to <b>{Math.min(filteredEmployees.length, currentPage * itemsPerPage)}</b> of <b>{filteredEmployees.length}</b> entries
            </PageInfo>

            <PageControls>
              <PageBtn disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                <ChevronLeft size={18} />
              </PageBtn>

              {getPaginationRange().map((page, index) => (
                page === "..." ? (
                  <span key={`dots-${index}`} style={{ padding: '0 8px' }}>...</span>
                ) : (
                  <PageBtn key={page} active={currentPage === page} onClick={() => setCurrentPage(page)}>
                    {page}
                  </PageBtn>
                )
              ))}

              <PageBtn disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                <ChevronRight size={18} />
              </PageBtn>
            </PageControls>
          </PaginationWrapper>
        )}
      </ContentWrapper>
    </Container>
  );
}