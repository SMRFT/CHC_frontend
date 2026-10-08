import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { Download, Search, Calendar, FilterX, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiRequest from "./apiRequest";

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

const FilterBtn = styled.button`
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
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
  color: white;
  transition: all 0.2s;
  &:hover { opacity: 0.9; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
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

const SimpleSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid #e2e8f0;
  border-top-color: #3F72AF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default function RegisteredEmployees() {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedContractor, setSelectedContractor] = useState("");

  // Fetch Companies for dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await apiRequest(`${Labbaseurl}companies/`, "GET");
        setCompanies(res.success ? res.data : []);
      } catch (err) { console.error("Companies error:", err); }
    };
    fetchCompanies();
  }, [Labbaseurl]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      let url = `${Labbaseurl}get_all_registered_employees/?`;
      if (selectedCompany) url += `company_id=${selectedCompany}&`;
      if (startDate) url += `from_date=${startDate.toISOString().split('T')[0]}&`;
      if (endDate) url += `to_date=${endDate.toISOString().split('T')[0]}&`;
      
      const res = await apiRequest(url, "GET");
      setEmployees(res.success ? res.data : []);
    } catch (err) { console.error("Fetch Error:", err); }
    setLoading(false);
  };

  const handleFilterSubmit = () => {
    fetchEmployees();
    setCurrentPage(1);
  };

  const handleClearFilters = async () => {
    setSearchInput("");
    setStartDate(null);
    setEndDate(null);
    setSelectedCompany("");
    setSelectedContractor("");
    setLoading(true);
    try {
      const res = await apiRequest(`${Labbaseurl}get_all_registered_employees/`, "GET");
      setEmployees(res.success ? res.data : []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Clear Filters Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, [Labbaseurl]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(delay);
  }, [searchInput]);

  const contractors = useMemo(() => {
    const list = employees
      .map(emp => emp.contractor)
      .filter(c => c && c.trim() !== "");
    return [...new Set(list)].sort();
  }, [employees]);

  const hasContractor = useMemo(() => {
    return (selectedContractor && selectedContractor !== "none") || employees.some(emp => emp.contractor && emp.contractor.trim() !== "");
  }, [employees, selectedContractor]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        emp.employee_name?.toLowerCase().includes(s) ||
        emp.employee_id?.toString().includes(s) ||
        emp.barcode?.toLowerCase().includes(s) ||
        emp.department?.toLowerCase().includes(s) ||
        emp.contractor?.toLowerCase().includes(s);

      const matchesContractor =
        !selectedContractor ? true :
        selectedContractor === "none" ? (!emp.contractor || emp.contractor.trim() === "") :
        emp.contractor === selectedContractor;

      return matchesSearch && matchesContractor;
    });
  }, [employees, searchTerm, selectedContractor]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const currentData = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDownload = () => {
    const exportData = filteredEmployees.map(emp => {
      return {
        "Employee ID": emp.employee_id,
        "Barcode": emp.barcode || "-",
        "Name": emp.employee_name,
        "Company Name": emp.company_name || "-",
        "Company ID": emp.company_id || "-",
        "Contractor": emp.contractor || "-",
        "Gender": emp.gender || "-",
        "Age": emp.age || "-",
        "DOB": emp.dob ? new Date(emp.dob).toLocaleDateString() : "-",
        "Designation": emp.designation || "-",
        "Employee Type": emp.employee_type || "-",
        "Department": emp.department || "-",
        "Email": emp.email || "-",
        "Mobile": emp.mobile || "-",
        "Package": emp.package_name || "-",
        "Amount": emp.amount || "-",
        "Payment Mode": emp.payment_mode || "-",
        "DOJ": emp.doj ? new Date(emp.doj).toLocaleDateString() : "-",
        "Experience": emp.experience || "-",
        "Created Date": emp.created_date ? new Date(emp.created_date).toLocaleDateString() : "-",
        "Created Time": emp.created_date ? new Date(emp.created_date).toLocaleTimeString() : "-"
      };
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "Employee_Directory.xlsx");
  };

  const handleDownloadCSV = () => {
    const exportData = filteredEmployees.map(emp => {
      return {
        "Employee ID": emp.employee_id,
        "Barcode": emp.barcode || "-",
        "Name": emp.employee_name,
        "Company Name": emp.company_name || "-",
        "Company ID": emp.company_id || "-",
        "Contractor": emp.contractor || "-",
        "Gender": emp.gender || "-",
        "Age": emp.age || "-",
        "DOB": emp.dob ? new Date(emp.dob).toLocaleDateString() : "-",
        "Designation": emp.designation || "-",
        "Employee Type": emp.employee_type || "-",
        "Department": emp.department || "-",
        "Email": emp.email || "-",
        "Mobile": emp.mobile || "-",
        "Package": emp.package_name || "-",
        "Amount": emp.amount || "-",
        "Payment Mode": emp.payment_mode || "-",
        "DOJ": emp.doj ? new Date(emp.doj).toLocaleDateString() : "-",
        "Experience": emp.experience || "-",
        "Created Date": emp.created_date ? new Date(emp.created_date).toLocaleDateString() : "-",
        "Created Time": emp.created_date ? new Date(emp.created_date).toLocaleTimeString() : "-"
      };
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const csvContent = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Employee_Directory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            {/* <IconButton onClick={handleDownloadCSV} style={{ background: '#3182CE', color: '#fff' }}>
              <Download size={18} /> Export CSV
            </IconButton> */}
            {(searchTerm || startDate || endDate || selectedCompany || selectedContractor) && (
              <IconButton onClick={handleClearFilters} style={{ background: '#F56565', color: '#fff' }}>
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
            <DatePicker selected={startDate} onChange={d => { setStartDate(d); }} placeholderText="From Date" dateFormat="dd/MM/yyyy" />
          </InputGroup>
          <InputGroup>
            <Calendar size={18} color="#999" />
            <DatePicker selected={endDate} onChange={d => { setEndDate(d); }} placeholderText="To Date" dateFormat="dd/MM/yyyy" />
          </InputGroup>
          <InputGroup>
            <FilterX size={18} color="#999" />
            <select 
              value={selectedCompany} 
              onChange={e => { setSelectedCompany(e.target.value); }}
              style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: '#3F72AF' }}
            >
              <option value="">All Companies</option>
              {companies.map(c => (
                <option key={c.company_id} value={c.company_id}>{c.company_name}</option>
              ))}
            </select>
          </InputGroup>
          <InputGroup>
            <FilterX size={18} color="#999" />
            <select 
              value={selectedContractor} 
              onChange={e => { setSelectedContractor(e.target.value); }}
              style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: '#3F72AF' }}
            >
              <option value="">All</option>
              <option value="none">No Contractor</option>
              {contractors.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
              
            </select>
          </InputGroup>
          <FilterBtn onClick={handleFilterSubmit}>
            Filter
          </FilterBtn>
        </FiltersGrid>

        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <th>ID</th>
                <th>Barcode</th>
                <th>Name</th>
                <th>Company</th>
                {hasContractor && <th>Contractor</th>}
                <th>Gender</th>
                <th>Age</th>
                <th>Dept</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Package</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <Td colSpan={hasContractor ? 15 : 14} style={{ textAlign: 'center', padding: '40px', color: '#666', fontWeight: 600 }}>
                    <SimpleSpinner /> Loading records...
                  </Td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((emp, i) => (
                  <tr key={emp.employee_id || i}>
                    <Td data-label="Employee ID">{emp.employee_id}</Td>
                    <Td data-label="Barcode">{emp.barcode || "-"}</Td>
                    <Td data-label="Name" style={{ fontWeight: '600' }}>{emp.employee_name}</Td>
                    <Td data-label="Company">{emp.company_name || "-"}</Td>
                    {hasContractor && <Td data-label="Contractor">{emp.contractor || "-"}</Td>}
                    <Td data-label="Gender">{emp.gender}</Td>
                    <Td data-label="Age">{emp.age}</Td>
                    <Td data-label="Dept">{emp.department || "N/A"}</Td>
                    <Td data-label="Email">{emp.email || "-"}</Td>
                    <Td data-label="Mobile">{emp.mobile || "-"}</Td>
                    <Td data-label="Package">{emp.package_name || "-"}</Td>
                    <Td data-label="Amount">{emp.amount || "-"}</Td>
                    <Td data-label="Payment Mode">{emp.payment_mode || "-"}</Td>
                    <Td data-label="Created Date">
                      {emp.created_date ? new Date(emp.created_date).toLocaleDateString() : "-"}
                    </Td>
                    <Td data-label="Created Time">
                      {emp.created_date ? new Date(emp.created_date).toLocaleTimeString() : "-"}
                    </Td>
                  </tr>
                ))
              ) : (
                <tr><Td colSpan={hasContractor ? 15 : 14} style={{ textAlign: 'center', padding: '40px' }}>No records found.</Td></tr>
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