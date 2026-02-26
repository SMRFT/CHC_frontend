import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Eye, Search, X, Check, Calendar, User, Hash, CheckCircle, Clock } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

// Add global styles for DatePicker
const GlobalDatePickerStyles = `
  .react-datepicker-wrapper {
    z-index: 100;
  }
  
  .react-datepicker-popper {
    z-index: 100 !important;
  }
  
  .date-picker {
    padding: 12px 16px;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    font-weight: 600;
    font-size: 14px;
    color: #1a202c;
    background: white;
    transition: all 0.3s ease;
    min-width: 140px;
    cursor: pointer;
  }
  
  .date-picker:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }
  
  .date-picker::placeholder {
    color: #94a3b8;
  }
  
  .react-datepicker {
    font-family: inherit;
    border: none;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }
  
  .react-datepicker__header {
    background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
    border-bottom: none;
    padding-top: 16px;
  }
  
  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: white;
    font-weight: 700;
  }
  
  .react-datepicker__day {
    color: #1a202c;
    font-weight: 600;
  }
  
  .react-datepicker__day:hover {
    background: #ede9fe;
    border-radius: 8px;
  }
  
  .react-datepicker__day--selected {
    background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
    border-radius: 8px;
    color: white;
    font-weight: 700;
  }
  
  .react-datepicker__day--keyboard-selected {
    background: #ede9fe;
    border-radius: 8px;
  }
`;

// Inject styles into head
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = GlobalDatePickerStyles;
  document.head.appendChild(styleTag);
}

const Container = styled.div`
  padding: 24px;
  margin-left: 260px; /* Match sidebar desktop width */
  min-height: 100vh;
  background: #F9F7F7; /* New color scheme - light background */
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.3), transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 1024px) {
    margin-left: 240px; /* Match sidebar tablet width */
    padding: 20px;
  }
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 16px;
  }
  @media (max-width: 320px) {
    padding: 12px;
  }
`;

const Header = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 24px;
  border-radius: 24px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  margin-bottom: 24px;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 20px;
  }
  @media (max-width: 320px) {
    padding: 16px;
    border-radius: 16px;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 16px;
  }
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
  display: grid;
  place-items: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);

  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    border-radius: 14px;
  }
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #1a202c;
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 26px;
  }
  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const FiltersBar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  z-index: 10;
`;

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #F9F7F7; /* New color scheme - light background */
  border-radius: 16px;
  padding: 12px 16px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 200px;

  &:focus-within {
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    font-weight: 600;
    color: #1a202c;
    font-size: 14px;
    background: transparent;

    &::placeholder {
      color: #94a3b8;
    }
  }

  @media (max-width: 480px) {
    min-width: 100%;
    padding: 10px 14px;
  }
`;

const ClearBtn = styled.button`
  padding: 12px 20px;
  border-radius: 14px;
  cursor: pointer;
  border: none;
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
  color: white;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TableCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  overflow: hidden;
  position: relative;
  z-index: 1;
  isolation: isolate;

  @media (max-width: 768px) {
    border-radius: 20px;
  }
`;

const TableWrapper = styled.div`
  overflow: auto;
  max-height: 70vh;

  &::-webkit-scrollbar { 
    height: 10px; 
    width: 10px; 
  }
  &::-webkit-scrollbar-track { 
    background: #f1f5f9; 
    border-radius: 10px; 
  }
  &::-webkit-scrollbar-thumb { 
    background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
    border-radius: 10px; 
  }
  &::-webkit-scrollbar-thumb:hover { 
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }

  @media (max-width: 480px) { 
    max-height: 60vh; 
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 900px;

  @media (min-width: 480px) {
    min-width: 1100px;
  }
  @media (min-width: 768px) {
    min-width: 1200px;
  }
`;

const Th = styled.th`
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
  color: white;
  padding: 16px 12px;
  text-align: center;
  font-weight: 700;
  font-size: 13px;
  white-space: nowrap;
  top: 0;
  z-index: 2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-right: 1px solid rgba(255, 255, 255, 0.2);

  &:first-child {
    border-top-left-radius: 0;
  }

  &:last-child { 
    border-right: none;
    border-top-right-radius: 0;
  }

  @media (min-width: 768px) {
    padding: 18px 14px;
    font-size: 13.5px;
  }
`;

const Td = styled.td`
  padding: 16px 12px;
  text-align: center;
  font-size: 13.5px;
  color: #334155;
  vertical-align: middle;
  background: white;
  border-bottom: 1px solid #f1f5f9;

  @media (min-width: 768px) {
    padding: 18px 14px;
    font-size: 14px;
  }
`;

const TdRow = styled.tr`
  transition: all 0.2s ease;

  &:nth-child(even) td { 
    background-color: #f8fafc; 
  }
  
  &:hover td { 
    background-color: #ede9fe;
    transform: scale(1.001);
  }
  
  &:last-child td:first-child {
    border-bottom-left-radius: 0;
  }
  
  &:last-child td:last-child {
    border-bottom-right-radius: 0;
  }
  
  &:last-child td { 
    border-bottom: none; 
  }
`;

const Button = styled.button`
  padding: 10px 18px;
  background: ${(p) => p.disabled
    ? "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)"
    : "linear-gradient(135deg, #10b981 0%, #059669 100%)"};
  color: white;
  border: none;
  border-radius: 12px;
  cursor: ${(p) => p.disabled ? "not-allowed" : "pointer"};
  font-weight: 700;
  font-size: 13px;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: ${(p) => p.disabled
    ? "none"
    : "0 4px 12px rgba(16, 185, 129, 0.3)"};

  &:hover {
    transform: ${(p) => p.disabled ? "none" : "translateY(-2px)"};
    box-shadow: ${(p) => p.disabled ? "none" : "0 6px 20px rgba(16, 185, 129, 0.4)"};
  }

  &:active { 
    transform: translateY(0); 
  }
`;

const StatusBadge = styled.span`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: white;
  background: ${(p) => p.status === "approved"
    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"};
  box-shadow: ${(p) => p.status === "approved"
    ? "0 4px 12px rgba(16, 185, 129, 0.3)"
    : "0 4px 12px rgba(245, 158, 11, 0.3)"};
`;

const DataCell = styled.div`
  text-align: left;
  line-height: 1.8;
  font-size: 12.5px;
  color: #475569;

  strong {
    color: #1e293b;
    font-weight: 700;
  }

  @media (min-width: 768px) {
    font-size: 13px;
  }
`;

const InfoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  color: #0369a1;
  border: 1px solid #bae6fd;
`;

const LoadingContainer = styled.div`
  display: grid;
  place-items: center;
  min-height: 60vh;
  color: white;
  font-weight: 800;
  font-size: 18px;
  position: relative;
  z-index: 1;
`;

const ErrorContainer = styled(LoadingContainer)`
  color: #fee2e2;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 24px;
  color: #64748b;
  font-size: 15px;
  font-weight: 500;

  @media (min-width: 768px) {
    padding: 80px 32px;
    font-size: 16px;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 50;
  animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  @keyframes slideIn {
    from { 
      transform: translateX(400px) scale(0.8); 
      opacity: 0; 
    }
    to { 
      transform: translateX(0) scale(1); 
      opacity: 1; 
    }
  }

  @media (max-width: 768px) {
    top: 80px;
    right: 16px;
    left: 16px;
  }
`;

const NotificationBox = styled.div`
  background: ${(p) => p.type === "success"
    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"};
  color: white;
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 280px;
  max-width: 400px;
  font-weight: 700;
  backdrop-filter: blur(10px);

  @media (min-width: 480px) {
    min-width: 320px;
    max-width: 440px;
  }
`;

const NotificationIcon = styled.span` 
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotificationMessage = styled.span` 
  flex: 1;
  font-size: 14px;
`;

export default function DoctorApprovalOphthalmology() {
  const [ophthalmology, setOphthalmology] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchOphthalmology();
  }, [startDate, endDate]);

  const fetchOphthalmology = async () => {
    setLoading(true);
    try {
      let url = `${Labbaseurl}get_ophthalmology/`;
      if (startDate) {
        url += `${url.includes('?') ? '&' : '?'}from_date=${startDate.toISOString().split('T')[0]}`;
        if (endDate) {
          url += `&to_date=${endDate.toISOString().split('T')[0]}`;
        }
      }
      const response = await axios.get(url);
      setOphthalmology(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch ophthalmology data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleApprove = async (barcode) => {
    try {
      await axios.patch(`${Labbaseurl}approve_ophthalmology/${barcode}/`);
      setOphthalmology((prev) =>
        prev.map((op) => (op.barcode === barcode ? { ...op, status: "approved" } : op))
      );
      showNotification("Ophthalmology record approved successfully!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to approve record. Please try again.", "error");
    }
  };

  const filtered = ophthalmology.filter((op) => {
    const q = debouncedSearch;
    const recordDate = op.date ? new Date(op.date) : null;

    const matchesSearch =
      !q ||
      (op.barcode && String(op.barcode).toLowerCase().includes(q)) ||
      (op.employee_id && String(op.employee_id).toLowerCase().includes(q)) ||
      (op.employee_name && String(op.employee_name).toLowerCase().includes(q));

    // Back-end now filters by date, but keeping useMemo for search/status
    /*
    let matchesDate = true;
    if (startDate || endDate) {
      if (!recordDate) {
        matchesDate = false;
      } else {
        const normalizedRecordDate = new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate());
        const normalizedStartDate = startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()) : null;
        const normalizedEndDate = endDate ? new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()) : null;

        matchesDate =
          (!normalizedStartDate || normalizedRecordDate >= normalizedStartDate) &&
          (!normalizedEndDate || normalizedRecordDate <= normalizedEndDate);
      }
    }
    */
    const matchesDate = true;

    // Status filter
    const matchesStatus = !statusFilter || (op.status && op.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesDate && matchesStatus;
  });

  if (loading) return <Container><LoadingContainer>Loading ophthalmology records...</LoadingContainer></Container>;
  if (error) return <Container><ErrorContainer>{error}</ErrorContainer></Container>;

  return (
    <Container>
      {notification.show && (
        <NotificationContainer>
          <NotificationBox type={notification.type}>
            <NotificationIcon>
              {notification.type === "success" ? <CheckCircle size={24} /> : <X size={24} />}
            </NotificationIcon>
            <NotificationMessage>{notification.message}</NotificationMessage>
          </NotificationBox>
        </NotificationContainer>
      )}

      <Header>
        <TitleSection>
          <IconWrapper>
            <Eye size={32} color="white" strokeWidth={2.5} />
          </IconWrapper>
          <SectionTitle>Ophthalmology Dashboard</SectionTitle>
        </TitleSection>

        <FiltersBar>
          <SearchWrap>
            <Search size={20} color="#667eea" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by Barcode, Employee ID, or Name..."
            />
          </SearchWrap>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ color: "#1e3a8a", fontWeight: "600" }}>From:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd-MM-yyyy"
              placeholderText="Start Date"
              className="date-picker"
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ color: "#1e3a8a", fontWeight: "600" }}>To:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd-MM-yyyy"
              placeholderText="End Date"
              className="date-picker"
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label style={{ color: "#1e3a8a", fontWeight: "600" }}>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                fontWeight: "600",
                fontSize: "14px",
                color: "#1a202c",
                background: "white",
                cursor: "pointer",
                minWidth: "140px",
                transition: "all 0.3s ease",
              }}
            >
              <option value="">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {(searchInput || startDate || endDate || statusFilter) && (
            <ClearBtn onClick={() => {
              setSearchInput("");
              setDebouncedSearch("");
              setStartDate(null);
              setEndDate(null);
              setStatusFilter("");
            }}>
              <X size={18} />
              Clear
            </ClearBtn>
          )}
        </FiltersBar>
      </Header>

      <TableCard>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Employee Name</Th>
                <Th>Employee ID</Th>
                <Th>Gender</Th>
                <Th>Age</Th>
                <Th>Barcode</Th>
                <Th>Visual Acuity</Th>
                <Th>Patient Complaints</Th>
                <Th>Remarks</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <Td colSpan="11">
                    <EmptyState>
                      No ophthalmology records match your search criteria
                    </EmptyState>
                  </Td>
                </tr>
              ) : (
                filtered.map((op) => {
                  let visualAcuity = {};
                  try {
                    visualAcuity = typeof op.visual_acuity === 'string'
                      ? JSON.parse(op.visual_acuity)
                      : op.visual_acuity || {};
                  } catch (e) {
                    visualAcuity = op.visual_acuity || {};
                  }

                  return (
                    <TdRow key={op.barcode}>
                      <Td>
                        <InfoBadge>
                          <Calendar size={14} />
                          {op.date
                            ? new Date(op.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                            : "-"}
                        </InfoBadge>
                      </Td>

                      <Td>
                        <InfoBadge>
                          <User size={14} />
                          {op.employee_name || "-"}
                        </InfoBadge>
                      </Td>

                      <Td>
                        <InfoBadge>
                          {op.employee_id || "-"}
                        </InfoBadge>
                      </Td>

                      <Td>{op.gender || "-"}</Td>
                      <Td>{op.age || "-"}</Td>

                      <Td>
                        <InfoBadge>
                          {op.barcode || "-"}
                        </InfoBadge>
                      </Td>

                      <Td>
                        <DataCell>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "6px",
                              minWidth: "280px",
                            }}
                          >
                            {/* ===== Distance Vision ===== */}
                            <div
                              style={{
                                background: "linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%)",
                                padding: "8px 10px",
                                borderRadius: "8px",
                                border: "1px solid #c7d2fe",
                              }}
                            >
                              <div
                                style={{
                                  color: "#3730a3",
                                  fontWeight: "700",
                                  fontSize: "11px",
                                  marginBottom: "4px",
                                }}
                              >
                                DISTANCE VISION
                              </div>
                              <div style={{ fontSize: "11.5px", lineHeight: "1.6", color: "#1e293b" }}>
                                R: {visualAcuity.distance?.right || "-"}, L: {visualAcuity.distance?.left || "-"}
                              </div>
                            </div>

                            {/* ===== Near Vision ===== */}
                            <div
                              style={{
                                background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                                padding: "8px 10px",
                                borderRadius: "8px",
                                border: "1px solid #bae6fd",
                              }}
                            >
                              <div
                                style={{
                                  color: "#1e3a8a",
                                  fontWeight: "700",
                                  fontSize: "11px",
                                  marginBottom: "4px",
                                }}
                              >
                                NEAR VISION
                              </div>
                              <div style={{ fontSize: "11.5px", lineHeight: "1.6", color: "#1e293b" }}>
                                R: {visualAcuity.nearVision?.right || "-"}, L: {visualAcuity.nearVision?.left || "-"}
                              </div>
                            </div>

                            {/* ===== Colour Vision ===== */}
                            <div
                              style={{
                                background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                                padding: "8px 10px",
                                borderRadius: "8px",
                                border: "1px solid #bbf7d0",
                              }}
                            >
                              <div
                                style={{
                                  color: "#166534",
                                  fontWeight: "700",
                                  fontSize: "11px",
                                  marginBottom: "4px",
                                }}
                              >
                                COLOUR VISION
                              </div>
                              <div style={{ fontSize: "11.5px", lineHeight: "1.6", color: "#1e293b" }}>
                                R: {visualAcuity.colourVision?.right || "-"}, L: {visualAcuity.colourVision?.left || "-"}
                              </div>
                            </div>

                            {/* ===== Ocular Movement ===== */}
                            <div
                              style={{
                                background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                                padding: "8px 10px",
                                borderRadius: "8px",
                                border: "1px solid #bae6fd",
                              }}
                            >
                              <div
                                style={{
                                  color: "#1e3a8a",
                                  fontWeight: "700",
                                  fontSize: "11px",
                                  marginBottom: "4px",
                                }}
                              >
                                Ocular Movement
                              </div>
                              <div style={{ fontSize: "11.5px", lineHeight: "1.6", color: "#1e293b" }}>
                                R: {visualAcuity.ocularmovement?.right || "-"}, L: {visualAcuity.ocularmovement?.left || "-"}
                              </div>
                            </div>
                          </div>
                        </DataCell>
                      </Td>

                      <Td style={{ maxWidth: '200px', textAlign: 'left', fontSize: '12.5px', lineHeight: '1.6' }}>
                        {op.patient_complaints || "-"}
                      </Td>

                      <Td style={{ maxWidth: '200px', textAlign: 'left', fontSize: '12.5px', lineHeight: '1.6' }}>
                        {op.remarks || "-"}
                      </Td>

                      <Td>
                        <StatusBadge status={op.status}>
                          {op.status === "approved" ? <CheckCircle size={14} /> : <Clock size={14} />}
                          {op.status || "pending"}
                        </StatusBadge>
                      </Td>

                      <Td>
                        <Button
                          onClick={() => handleApprove(op.barcode)}
                          disabled={op.status === "approved"}
                          aria-disabled={op.status === "approved"}
                          aria-label={op.status === "approved" ? "Approved" : "Approve record"}
                        >
                          {op.status === "approved" ? (
                            <>
                              <Check size={16} />
                              Approved
                            </>
                          ) : (
                            <>
                              <Check size={16} />
                              Approve
                            </>
                          )}
                        </Button>
                      </Td>
                    </TdRow>
                  );
                })
              )}
            </tbody>
          </Table>
        </TableWrapper>
      </TableCard>
    </Container>
  );
}