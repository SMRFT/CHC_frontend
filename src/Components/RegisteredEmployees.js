import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Download, Search, Calendar } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Beautiful Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 20px;
  h2 {
    background: linear-gradient(135deg, #667EEA, #764BA2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  position: relative;
  z-index: 10;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: linear-gradient(145deg, #FFFFFF, #F0F0F0);
  border: 2px solid transparent;
  border-radius: 20px;
  padding: 12px 20px;
  width: 320px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 2px;
    background: linear-gradient(135deg, #667EEA, #764BA2);
    border-radius: 20px;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: xor;
    -webkit-mask-composite: xor;
    pointer-events: none;
  }
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
  }
  &:focus-within {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
  }
  input {
    border: none;
    outline: none;
    flex: 1;
    font-size: 16px;
    background: transparent;
    margin-left: 8px;
    color: #333;
    font-weight: 500;
    &::placeholder {
      color: #999;
    }
  }
  svg {
    color: #667EEA;
    filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
  }
`;

const DatePickerWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: linear-gradient(145deg, #FFFFFF, #F0F0F0);
  border: 2px solid transparent;
  border-radius: 20px;
  padding: 12px 20px;
  min-width: 220px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 1000;
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 2px;
    background: linear-gradient(135deg, #667EEA, #764BA2);
    border-radius: 20px;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: xor;
    -webkit-mask-composite: xor;
    pointer-events: none;
  }
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
  }
  &:focus-within {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
  }
  svg {
    color: #667EEA;
    filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
    margin-right: 8px;
  }
  .react-datepicker-wrapper { width: 100%; position: relative; z-index: 1001; }
  .react-datepicker__input-container input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    font-weight: 500;
    color: #333;
    width: 100%;
    cursor: pointer;
    &::placeholder { color: #999; }
  }
  .react-datepicker-popper { z-index: 2000 !important; }
  .react-datepicker {
    border: 2px solid #667EEA;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    z-index: 2001 !important;
  }
  .react-datepicker__header {
    background: linear-gradient(135deg, #667EEA, #764BA2);
    border-bottom: none;
    border-top-left-radius: 14px;
    border-top-right-radius: 14px;
  }
  .react-datepicker__current-month, .react-datepicker__day-name {
    color: white; font-weight: 600;
  }
  .react-datepicker__day {
    border-radius: 8px; transition: all 0.2s ease;
    &:hover { background: rgba(102, 126, 234, 0.1); color: #667EEA; }
  }
  .react-datepicker__day--selected {
    background: #667EEA; color: white;
    &:hover { background: #5a67d8; }
  }
  .react-datepicker__day--today {
    background: rgba(102, 126, 234, 0.1); color: #667EEA; font-weight: 600;
  }
`;

const ClearFiltersButton = styled.button`
  background: linear-gradient(135deg, #F56565, #E53E3E);
  border: none; cursor: pointer; color: white;
  display: flex; align-items: center; font-size: 14px; font-weight: 600;
  gap: 8px; padding: 12px 20px; border-radius: 16px; transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(245, 101, 101, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  &:hover { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(245, 101, 101, 0.4); background: linear-gradient(135deg, #E53E3E, #C53030); }
  &:active { transform: translateY(-1px); }
`;

const StatsAndActions = styled.div`
  display: flex; align-items: center; gap: 24px;
  .total-count {
    background: linear-gradient(135deg, #667EEA, #764BA2);
    color: white; padding: 12px 24px; border-radius: 16px; font-weight: 600; font-size: 16px;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
`;

const DownloadButton = styled.button`
  background: linear-gradient(135deg, #48BB78, #38A169);
  border: none; cursor: pointer; color: white; display: flex; align-items: center;
  font-size: 16px; font-weight: 600; gap: 10px; padding: 14px 28px; border-radius: 16px;
  transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(72, 187, 120, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);
  &:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(72, 187, 120, 0.4); background: linear-gradient(135deg, #38A169, #2F855A); }
  &:active { transform: translateY(-1px); }
`;

const TableContainer = styled.div`
  background: white; border-radius: 20px; overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.1);
  position: relative; z-index: 1;
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse; margin: 0;
`;

const TableHeader = styled.th`
  background: linear-gradient(135deg, #667EEA, #764BA2);
  color: white; padding: 20px 16px; text-align: left; font-weight: 600; font-size: 15px;
  letter-spacing: 0.5px; text-transform: uppercase; border: none; position: relative;
  &:not(:last-child):after { content: ''; position: absolute; right: 0; top: 25%; height: 50%; width: 1px; background: rgba(255, 255, 255, 0.2); }
`;

const TableRow = styled.tr`
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  &:nth-child(even) { background: linear-gradient(90deg, rgba(102, 126, 234, 0.03), rgba(118, 75, 162, 0.03)); }
  &:hover { background: linear-gradient(90deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08)); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1); }
  &:last-child { border-bottom: none; }
`;

const TableCell = styled.td`
  padding: 18px 16px; border: none; font-size: 15px; color: #444; font-weight: 500; vertical-align: middle;
  &:first-child { font-weight: 600; color: #667EEA; }
  &:nth-child(2) { font-weight: 600; color: #333; }
`;

const EmptyState = styled.div`
  text-align: center; padding: 60px 20px; color: #999;
  svg { margin-bottom: 20px; color: #ccc; }
  h3 { margin: 0 0 10px 0; color: #666; font-size: 1.5rem; }
  p { margin: 0; font-size: 16px; }
`;

const PaginationContainer = styled.div`
  display: flex; justify-content: center; align-items: center; margin-top: 20px; gap: 10px;
`;

const PageButton = styled.button`
  padding: 6px 12px; border-radius: 8px; border: 1px solid #667EEA;
  background: ${(props) => (props.active ? "#667EEA" : "#fff")};
  color: ${(props) => (props.active ? "#fff" : "#667EEA")};
  cursor: pointer; font-weight: 600; transition: 0.2s;
  &:hover { background: #667EEA; color: #fff; }
`;

export default function RegisteredEmployees() {
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [employees, setEmployees] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // New: date range
  const [startDate, setStartDate] = useState(null); // from
  const [endDate, setEndDate] = useState(null);     // to

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${Labbaseurl}get_all_registered_employees/`);
        setEmployees(res.data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, [Labbaseurl]);

  // debounce search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  // Clear all filters
  const clearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
  };

  // Reset to first page when date filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate]);

  // Helper: normalize a date to midnight local for inclusive compare
  const toMidnight = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    return dt;
  };

  // filter employees
  const filteredEmployees = employees.filter((emp) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      emp.employee_id?.toString().toLowerCase().includes(search) ||
      emp.employee_name?.toLowerCase().includes(search) ||
      emp.barcode?.toLowerCase().includes(search) ||
      emp.department?.toLowerCase().includes(search);

    // Date range inclusive: created_date between startDate and endDate
    const created = emp.created_date ? new Date(emp.created_date) : null;
    if (created) created.setHours(0, 0, 0, 0);

    const start = toMidnight(startDate);
    const end = toMidnight(endDate);

    const matchesRange =
      (!start && !end) ||
      (start && !end && created && created.getTime() >= start.getTime()) ||
      (!start && end && created && created.getTime() <= end.getTime()) ||
      (start &&
        end &&
        created &&
        created.getTime() >= start.getTime() &&
        created.getTime() <= end.getTime());

    return matchesSearch && matchesRange;
  }); // [web:37]

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // export to excel with total row
  const handleDownload = () => {
    const rows = filteredEmployees.map((emp) => ({
      "Employee ID": emp.employee_id,
      Barcode: emp.barcode || "-",
      "Employee Name": emp.employee_name,
      Gender: emp.gender,
      Age: emp.age,
      DOB: emp.dob ? new Date(emp.dob).toLocaleDateString() : "",
      Department: emp.department,
      Email: emp.email || "-",
      Mobile: emp.mobile || "-",
      "Created Date": emp.created_date ? new Date(emp.created_date).toLocaleDateString() : "",
    }));

    // Add summary row
    rows.push({
      "Employee ID": "",
      Barcode: "",
      "Employee Name": "",
      Gender: "",
      Age: "",
      DOB: "",
      Department: "Total Employees",
      Email: "",
      Mobile: filteredEmployees.length,
      "Created Date": "",
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array", cellStyles: true });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Employee_List.xlsx");
  }; // [web:38]

  return (
    <Container>
      <ContentWrapper>
        <HeaderContainer>
          <h2>Employee Directory</h2>
          <StatsAndActions>
            <div className="total-count">Total: {filteredEmployees.length}</div>
            <DownloadButton onClick={handleDownload}>
              <Download size={20} /> Export Excel
            </DownloadButton>
          </StatsAndActions>
        </HeaderContainer>

        <FiltersContainer>
          <SearchBox>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by ID, Name, Department..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </SearchBox>

          {/* From Date */}
          <DatePickerWrapper>
            <Calendar size={20} />
            <DatePicker
              placeholderText="From date"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={endDate || null}
              dateFormat="dd/MM/yyyy"
              isClearable
              popperPlacement="bottom-start"
            />
          </DatePickerWrapper>

          {/* To Date */}
          <DatePickerWrapper>
            <Calendar size={20} />
            <DatePicker
              placeholderText="To date"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || null}
              dateFormat="dd/MM/yyyy"
              isClearable
              popperPlacement="bottom-start"
            />
          </DatePickerWrapper>

          {(searchTerm || startDate || endDate) && (
            <ClearFiltersButton onClick={clearFilters}>Clear Filters</ClearFiltersButton>
          )}
        </FiltersContainer>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <TableHeader>Employee ID</TableHeader>
                <TableHeader>Barcode</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Gender</TableHeader>
                <TableHeader>Age</TableHeader>
                <TableHeader>DOB</TableHeader>
                <TableHeader>Department</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Mobile</TableHeader>
                <TableHeader>Created Date</TableHeader>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.length > 0 ? (
                currentEmployees.map((emp, index) => (
                  <TableRow key={emp.employee_id || index}>
                    <TableCell>{emp.employee_id}</TableCell>
                    <TableCell>{emp.barcode || "-"}</TableCell>
                    <TableCell>{emp.employee_name}</TableCell>
                    <TableCell>{emp.gender}</TableCell>
                    <TableCell>{emp.age}</TableCell>
                    <TableCell>{emp.dob ? new Date(emp.dob).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>{emp.email || "-"}</TableCell>
                    <TableCell>{emp.mobile || "-"}</TableCell>
                    <TableCell>
                      {emp.created_date ? new Date(emp.created_date).toLocaleDateString() : "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <tr>
                  <TableCell colSpan="10">
                    <EmptyState>
                      <Search size={48} />
                      <h3>No employees found</h3>
                      <p>Try adjusting the search or date range</p>
                    </EmptyState>
                  </TableCell>
                </tr>
              )}
            </tbody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <PaginationContainer>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PageButton key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
                {page}
              </PageButton>
            ))}
          </PaginationContainer>
        )}
      </ContentWrapper>
    </Container>
  );
}
