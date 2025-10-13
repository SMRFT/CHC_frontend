import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

/* Full-page layout with a fixed-width sidebar area and flexible content */
const Page = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr; /* Sidebar 240px, main content */
  grid-template-rows: 100vh;       /* Full viewport height */
  overflow: hidden;                 /* Prevent body scroll bleed */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;     /* Collapse sidebar on small screens */
    grid-template-rows: auto 1fr;
  }
`;

/* Placeholder for the sidebar area; integrate real sidebar here if needed */
const SidebarSpace = styled.aside`
  background: transparent; /* Let app set bg; or use a neutral tone */
  @media (max-width: 768px) {
    display: none;          /* Hide when collapsed */
  }
`;

/* Main content column: full-height with internal scrolling regions */
const Main = styled.main`
  display: flex;
  flex-direction: column;
  min-width: 0;           /* Important for flex overflow handling */
  height: 100vh;
  overflow: hidden;       /* Header fixed, table scrolls */
  background: transparent;
`;

const HeaderWrap = styled.header`
  background: white;
  padding: 14px 16px;
  border-radius: 10px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
  margin: 16px 16px 12px;
  @media (max-width: 768px) {
    margin: 12px;
    border-radius: 8px;
  }
`;

const SectionTitle = styled.h2`
  margin: 0 0 10px 0;
  color: #1f2937;
  font-size: 24px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
  @media (max-width: 768px) { font-size: 19px; }
`;

const FiltersBar = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchWrap = styled.div`
  display: flex; align-items: center; gap: 8px;
  background: #fff; border-radius: 10px; padding: 8px 12px; border: 2px solid #e5e7eb;
  input {
    width: 240px; border: none; outline: none; font-weight: 600; color: #1f2937;
  }
  @media (max-width: 480px) {
    input { width: 180px; }
  }
`;

const DPWrap = styled.div`
  display: flex; align-items: center; gap: 8px;
  background: #fff; border-radius: 10px; padding: 8px 12px; border: 2px solid #e5e7eb;
  .react-datepicker-wrapper { width: 180px; }
  input {
    width: 100%; border: none; outline: none; font-weight: 600; color: #1f2937; cursor: pointer;
  }
`;

const SelectWrap = styled.div`
  display: flex; align-items: center; gap: 8px;
  background: #fff; border-radius: 10px; padding: 8px 12px; border: 2px solid #e5e7eb;
  select {
    border: none; outline: none; font-weight: 600; color: #1f2937; cursor: pointer;
    background: transparent; min-width: 120px;
  }
`;

const ClearBtn = styled.button`
  padding: 9px 12px; border-radius: 10px; cursor: pointer;
  border: 2px solid #6366f1; background: transparent; color: #6366f1; font-weight: 800;
  transition: 0.2s;
  &:hover { background: #6366f1; color: #fff; }
`;

/* Content area: scrollable table card fills remaining height */
const Content = styled.section`
  flex: 1 1 auto;
  min-height: 0;      /* Required so child can scroll */
  padding: 0 16px 16px;
  @media (max-width: 768px) { padding: 0 12px 12px; }
`;

const TableCard = styled.div`
  background: white; border-radius: 10px; box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06); overflow: hidden;
  height: 100%;      /* Fill available height */
  display: flex;     /* Let wrapper fill */
  flex-direction: column;
`;

const TableWrapper = styled.div`
  overflow: auto; 
  flex: 1 1 auto;    /* Grow to fill card and scroll inside */
  scrollbar-gutter: stable both-edges;

  &::-webkit-scrollbar { height: 8px; width: 8px; }
  &::-webkit-scrollbar-track { background: #f3f4f6; border-radius: 4px; }
  &::-webkit-scrollbar-thumb { background: #c7cdd6; border-radius: 4px; }
  &::-webkit-scrollbar-thumb:hover { background: #9aa3ae; }
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse; min-width: 1200px;
  @media (max-width: 768px) { min-width: 1000px; }
`;

const Th = styled.th`
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
  color: white; padding: 12px 10px; text-align: center; font-weight: 800; font-size: 12.5px; white-space: nowrap;
  position: sticky; top: 0; z-index: 2; border-right: 1px solid rgba(255,255,255,0.18);
  &:last-child { border-right: none; }
  @media (max-width: 768px) { padding: 10px 8px; font-size: 12px; }
`;

const Td = styled.td`
  padding: 10px 10px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 13.5px; color: #374151; vertical-align: middle; background: #fff;
  @media (max-width: 768px) { padding: 9px 8px; font-size: 13px; }
`;

const TdRow = styled.tr`
  transition: background-color 0.2s ease;
  &:nth-child(even) td { background-color: #fafbff; }
  &:hover td { background-color: #f5f7ff; }
  &:last-child td { border-bottom: none; }
`;

const Button = styled.button`
  padding: 7px 12px;
  background: ${(p) => p.disabled ? "#9aa3af" : "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)"};
  color: white; border: none; border-radius: 8px; cursor: ${(p)=>p.disabled?"not-allowed":"pointer"};
  font-weight: 800; font-size: 12px; transition: all 0.25s ease; white-space: nowrap;
  &:hover { transform: ${(p)=>p.disabled?"none":"translateY(-2px)"}; box-shadow: ${(p)=>p.disabled?"none":"0 6px 16px rgba(99,102,241,0.35)"}; }
  &:active { transform: translateY(0); }
`;

const FilePreview = styled.img`
  width: 50px; height: 50px; cursor: pointer; border: 2px solid #e5e7eb; border-radius: 8px; transition: all 0.25s ease; object-fit: cover; background: #fff;
  &:hover { transform: scale(1.08); border-color: #6366f1; box-shadow: 0 4px 10px rgba(99,102,241,0.25); }
  @media (max-width: 768px) { width: 46px; height: 46px; }
`;

const FileLink = styled.a`
  display: inline-flex; flex-direction: column; align-items: center; gap: 6px; text-decoration: none; color: #5b6ee5; font-size: 12px; font-weight: 800;
  &:hover { color: #6b46a5; }
`;

const StatusBadge = styled.span`
  padding: 5px 10px; border-radius: 999px; font-size: 11.5px; font-weight: 900; text-transform: capitalize; white-space: nowrap; color: white;
  background: ${(p)=> p.status==="approved" ? "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
    : p.status==="pending" ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"};
`;

/* Lightweight notifications */
const NotificationContainer = styled.div`
  position: fixed; top: 16px; right: 16px; z-index: 40; animation: slideIn 0.3s ease-out;
  @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @media (max-width: 768px) { top: 72px; right: 10px; left: 10px; }
`;
const NotificationBox = styled.div`
  background: ${(p)=> p.type==="success" ? "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" : "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)"};
  color: white; padding: 12px 14px; border-radius: 10px; box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  display: flex; align-items: center; gap: 12px; min-width: 260px; max-width: 360px; font-weight: 900;
  @media (max-width: 768px) { min-width: unset; max-width: unset; width: 100%; font-size: 14px; }
`;
const NotificationIcon = styled.span` font-size: 20px; `;
const NotificationMessage = styled.span` flex: 1; `;

const Loading = styled.div`
  display: grid; place-items: center; height: 100%;
  color: #6366f1; font-weight: 800;
`;
const ErrorMsg = styled(Loading)` color: #f5576c; `;

export default function DoctorApprovalInvestigations() {
  const [investigations, setInvestigations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Filters
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [startDate, setStartDate] = useState(null); // from
  const [endDate, setEndDate] = useState(null);     // to
  const [statusFilter, setStatusFilter] = useState("all"); // all, approved, pending

  useEffect(() => {
    const fetchInvestigations = async () => {
      try {
        const response = await axios.get(`${Labbaseurl}get_investigations/`);
        setInvestigations(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch investigations.");
        setLoading(false);
      }
    };
    fetchInvestigations();
  }, []);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim().toLowerCase()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const toMidnight = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    return dt;
  };

  // Apply filters
  const filteredInvestigations = investigations.filter((inv) => {
    // Status filter - check this FIRST
    if (statusFilter !== "all") {
      const invStatus = inv.status ? inv.status.toString().trim().toLowerCase() : "pending";
      if (statusFilter === "approved" && invStatus !== "approved") {
        return false;
      }
      if (statusFilter === "pending" && invStatus !== "pending") {
        return false;
      }
    }

    // Search: barcode, employee_id, employee_name
    const q = debouncedSearch;
    if (q) {
      const matchesSearch =
        (inv.barcode && String(inv.barcode).toLowerCase().includes(q)) ||
        (inv.employee_id && String(inv.employee_id).toLowerCase().includes(q)) ||
        (inv.employee_name && String(inv.employee_name).toLowerCase().includes(q));
      
      if (!matchesSearch) return false;
    }

    // Date range inclusive on inv.date (if provided)
    if (startDate || endDate) {
      const created = inv.date ? new Date(inv.date) : null;
      if (created) created.setHours(0, 0, 0, 0);

      const s = toMidnight(startDate);
      const e = toMidnight(endDate);

      const inRange =
        (!s && !e) ||
        (s && !e && created && created.getTime() >= s.getTime()) ||
        (!s && e && created && created.getTime() <= e.getTime()) ||
        (s && e && created && created.getTime() >= s.getTime() && created.getTime() <= e.getTime());

      if (!inRange) return false;
    }

    return true;
  });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleApprove = async (barcode) => {
    try {
      await axios.patch(`${Labbaseurl}approve_investigation/${barcode}/`);
      setInvestigations((prev) =>
        prev.map((inv) => (inv.barcode === barcode ? { ...inv, status: "approved" } : inv))
      );
      showNotification("Investigation approved successfully!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to approve record. Please try again.", "error");
    }
  };

  const renderFile = (fileId) => {
    if (!fileId) return "-";
    const fileUrl = `${Labbaseurl}get_file/${fileId}/`;
    return (
      <FileLink href={fileUrl} target="_blank" rel="noreferrer">
        <FilePreview
          src={fileUrl}
          alt="preview"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        View
      </FileLink>
    );
  };

  return (
    <Page>
      <SidebarSpace />
      <Main>
        {notification.show && (
          <NotificationContainer>
            <NotificationBox type={notification.type}>
              <NotificationIcon>{notification.type === "success" ? "✓" : "✕"}</NotificationIcon>
              <NotificationMessage>{notification.message}</NotificationMessage>
            </NotificationBox>
          </NotificationContainer>
        )}

        <HeaderWrap>
          <SectionTitle>📋 Investigation</SectionTitle>
          <FiltersBar>
            <SearchWrap>
              <span style={{ fontWeight: 800, color: "#4b5563" }}>Search</span>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Barcode, Employee ID, Name"
              />
            </SearchWrap>

            <DPWrap>
              <span style={{ fontWeight: 800, color: "#4b5563" }}>From</span>
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
            </DPWrap>

            <DPWrap>
              <span style={{ fontWeight: 800, color: "#4b5563" }}>To</span>
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
            </DPWrap>

            <SelectWrap>
              <span style={{ fontWeight: 800, color: "#4b5563" }}>Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </SelectWrap>

            {(searchInput || startDate || endDate || statusFilter !== "all") && (
              <ClearBtn onClick={() => { setSearchInput(""); setDebouncedSearch(""); setStartDate(null); setEndDate(null); setStatusFilter("all"); }}>
                Clear Filters
              </ClearBtn>
            )}
          </FiltersBar>
        </HeaderWrap>

        <Content>
          <TableCard role="region" aria-label="Investigations table">
            {loading ? (
              <Loading>Loading...</Loading>
            ) : error ? (
              <ErrorMsg>{error}</ErrorMsg>
            ) : (
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
                      <Th>Patient History</Th>
                      <Th>ECG Notes</Th>
                      <Th>PFT Notes</Th>
                      <Th>Audiometry Notes</Th>
                      <Th>X-Ray Notes</Th>
                      <Th>X-Ray Report</Th>
                      <Th>X-Ray Film</Th>
                      <Th>ECG</Th>
                      <Th>PFT</Th>
                      <Th>Audiometric</Th>
                      <Th>Status</Th>
                      <Th>Action</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvestigations.length === 0 ? (
                      <tr>
                        <Td colSpan="18">
                          <div style={{ padding: 16, color: "#6b7280", fontWeight: 600 }}>
                            No investigation data match current filters
                          </div>
                        </Td>
                      </tr>
                    ) : (
                      filteredInvestigations.map((inv) => (
                        <TdRow key={inv.barcode}>
                          <Td>
                        {inv.date
                          ? new Date(inv.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "-"}
                      </Td>

                          <Td>{inv.employee_name || "-"}</Td>
                          <Td>{inv.employee_id || "-"}</Td>
                          <Td>{inv.gender || "-"}</Td>
                          <Td>{inv.age || "-"}</Td>
                          <Td>{inv.barcode || "-"}</Td>
                          <Td style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
                          {inv.patient_history || "-"}
                        </Td>

                        <Td style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
                          {inv.ecg_notes || "-"}
                        </Td>

                        <Td style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
                          {inv.pft_notes || "-"}
                        </Td>

                        <Td style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
                          {inv.audiometry_notes || "-"}
                        </Td>

                        <Td style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
                          {inv.xray_notes || "-"}
                        </Td>

                        <Td style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
                          {inv.xray_report || "-"}
                        </Td>

                          <Td>{renderFile(inv.xrayfilm_file)}</Td>
                          <Td>{renderFile(inv.ecg_file)}</Td>
                          <Td>{renderFile(inv.pft_file)}</Td>
                          <Td>{renderFile(inv.audiometric_file)}</Td>
                          <Td>
                            <StatusBadge status={inv.status}>{inv.status || "pending"}</StatusBadge>
                          </Td>
                          <Td>
                            <Button
                              onClick={() => handleApprove(inv.barcode)}
                              disabled={inv.status === "approved"}
                              aria-disabled={inv.status === "approved"}
                              aria-label={inv.status === "approved" ? "Approved" : "Approve record"}
                            >
                              {inv.status === "approved" ? "✓ Approved" : "Approve"}
                            </Button>
                          </Td>
                        </TdRow>
                      ))
                    )}
                  </tbody>
                </Table>
              </TableWrapper>
            )}
          </TableCard>
        </Content>
      </Main>
    </Page>
  );
}