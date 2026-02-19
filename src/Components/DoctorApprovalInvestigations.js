"use client"

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

// --- Styled Components ---

const Page = styled.div`
  display: flex;
  min-height: 100vh;
  background: #F9F7F7;
  font-family: 'Inter', -apple-system, sans-serif;
`;

const SidebarSpace = styled.aside`
  width: 260px;
  flex-shrink: 0;
  @media (max-width: 1024px) { width: 0; display: none; }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100vh;
  overflow: hidden;
  
  @media (max-width: 1024px) { height: auto; overflow: visible; }
`;

const HeaderWrap = styled.header`
  background: white;
  padding: 20px;
  margin: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  @media (max-width: 768px) { margin: 10px; padding: 15px; }
`;

const SectionTitle = styled.h2`
  margin: 0 0 15px 0;
  color: #112D4E;
  font-size: clamp(1.2rem, 4vw, 1.6rem);
  font-weight: 800;
`;

const FiltersBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  align-items: center;
`;

const FilterBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 12px;
  
  span { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; }
  
  input, select {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
  }
`;

const Content = styled.section`
  flex: 1;
  padding: 0 16px 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  @media (max-width: 1024px) { overflow: visible; height: auto; }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: auto;
  flex: 1;
  
  /* Custom Scrollbar */
  &::-webkit-scrollbar { width: 6px; height: 6px; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1500px; /* Force desktop scroll */

  @media (max-width: 900px) {
    min-width: 100%;
    display: block;
    
    thead { display: none; }
    tbody { display: block; }
  }
`;

const Th = styled.th`
  position: sticky;
  top: 0;
  background: #112D4E;
  color: white;
  padding: 14px;
  font-size: 12px;
  text-transform: uppercase;
  z-index: 10;
  white-space: nowrap;
`;

const MobileRow = styled.tr`
  @media (max-width: 900px) {
    display: block;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    margin-bottom: 15px;
    padding: 10px;
    background: white;
    
    td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 5px;
      text-align: right;
      border-bottom: 1px solid #f1f5f9;
      
      &:before {
        content: attr(data-label);
        font-weight: 700;
        color: #3F72AF;
        font-size: 12px;
        text-align: left;
      }
      
      &:last-child { border: none; }
    }
  }
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #334155;
  text-align: center;
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: white;
  background: ${p => p.approved ? "#10b981" : "#f43f5e"};
`;

const ApproveBtn = styled.button`
  background: ${p => p.disabled ? "#e2e8f0" : "linear-gradient(135deg, #3F72AF, #112D4E)"};
  color: ${p => p.disabled ? "#94a3b8" : "white"};
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  cursor: ${p => p.disabled ? "not-allowed" : "pointer"};
  transition: 0.2s;
  &:hover { transform: ${p => p.disabled ? "none" : "translateY(-2px)"}; }
`;

const FileBox = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
  color: #3F72AF;
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
    border: 1px solid #e2e8f0;
  }
`;

const Notification = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  background: ${p => p.type === 'success' ? '#10b981' : '#f43f5e'};
  z-index: 1000;
  animation: slideIn 0.3s ease;
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
`;

// --- Main Component ---

export default function DoctorApprovalInvestigations() {
  const [investigations, setInvestigations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, msg: "", type: "" });

  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${Labbaseurl}get_investigations/`);
      setInvestigations(res.data || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const showToast = (msg, type) => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "" }), 3000);
  };

  const handleApprove = async (barcode) => {
    try {
      await axios.patch(`${Labbaseurl}approve_investigation/${barcode}/`);
      setInvestigations(prev => prev.map(inv => inv.barcode === barcode ? { ...inv, status: "approved" } : inv));
      showToast("Investigation Approved!", "success");
    } catch (err) { showToast("Approval Failed", "error"); }
  };

  const filteredData = useMemo(() => {
    return investigations.filter(inv => {
      const q = searchInput.toLowerCase();
      const matchesSearch = !q || inv.employee_name?.toLowerCase().includes(q) || inv.barcode?.includes(q) || inv.employee_id?.includes(q);

      const statusMatch = statusFilter === "all" || (inv.status || "pending") === statusFilter;

      const date = inv.date ? new Date(inv.date).setHours(0, 0, 0, 0) : null;
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null;
      const dateMatch = (!start || (date && date >= start)) && (!end || (date && date <= end));

      return matchesSearch && statusMatch && dateMatch;
    });
  }, [investigations, searchInput, statusFilter, startDate, endDate]);

  const renderFile = (fileId) => {
    if (!fileId) return "-";
    const url = `${Labbaseurl}get_file/${fileId}/`;
    return (
      <FileBox href={url} target="_blank">
        <img src={url} alt="file" onError={(e) => e.target.src = "https://via.placeholder.com/40?text=File"} />
        View
      </FileBox>
    );
  };

  return (
    <Page>
      <SidebarSpace />
      <Main>
        {toast.show && <Notification type={toast.type}>{toast.msg}</Notification>}

        <HeaderWrap>
          <SectionTitle>Investigation Approvals</SectionTitle>
          <FiltersBar>
            <FilterBox>
              <span>Search</span>
              <input placeholder="Name/Barcode/ID" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
            </FilterBox>
            <FilterBox>
              <span>Status</span>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </FilterBox>
            <FilterBox>
              <span>From</span>
              <DatePicker selected={startDate} onChange={d => setStartDate(d)} dateFormat="dd/MM/yyyy" placeholderText="Start Date" />
            </FilterBox>
            <FilterBox>
              <span>To</span>
              <DatePicker selected={endDate} onChange={d => setEndDate(d)} dateFormat="dd/MM/yyyy" placeholderText="End Date" />
            </FilterBox>
          </FiltersBar>
        </HeaderWrap>

        <Content>
          <TableContainer>
            {loading ? <div style={{ padding: 20 }}>Loading...</div> : (
              <Table>
                <thead>
                  <tr>
                    <Th>Date</Th><Th>Employee</Th><Th>ID</Th><Th>Gender</Th>
                    <Th>Age</Th><Th>Barcode</Th><Th>Patient History</Th>
                    <Th>ECG Notes</Th><Th>PFT Notes</Th><Th>X-Ray</Th>
                    <Th>X-Ray Film</Th><Th>ECG File</Th><Th>PFT File</Th>
                    <Th>Status</Th><Th>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(inv => (
                    <MobileRow key={inv.barcode}>
                      <Td data-label="Date">{inv.date ? new Date(inv.date).toLocaleDateString() : "-"}</Td>
                      <Td data-label="Employee" style={{ fontWeight: 700 }}>{inv.employee_name}</Td>
                      <Td data-label="ID">{inv.employee_id}</Td>
                      <Td data-label="Gender">{inv.gender}</Td>
                      <Td data-label="Age">{inv.age}</Td>
                      <Td data-label="Barcode">{inv.barcode}</Td>
                      <Td data-label="History">{inv.patient_history || "-"}</Td>
                      <Td data-label="ECG Notes">{inv.ecg_notes || "-"}</Td>
                      <Td data-label="PFT Notes">{inv.pft_notes || "-"}</Td>
                      <Td data-label="X-Ray Report">{inv.xray_report || "-"}</Td>
                      <Td data-label="X-Ray Film">{renderFile(inv.xrayfilm_file)}</Td>
                      <Td data-label="ECG File">{renderFile(inv.ecg_file)}</Td>
                      <Td data-label="PFT File">{renderFile(inv.pft_file)}</Td>
                      <Td data-label="Status">
                        <Badge approved={inv.status === 'approved'}>{inv.status || 'pending'}</Badge>
                      </Td>
                      <Td data-label="Action">
                        <ApproveBtn
                          disabled={inv.status === 'approved'}
                          onClick={() => handleApprove(inv.barcode)}
                        >
                          {inv.status === 'approved' ? "Done" : "Approve"}
                        </ApproveBtn>
                      </Td>
                    </MobileRow>
                  ))}
                </tbody>
              </Table>
            )}
          </TableContainer>
        </Content>
      </Main>
    </Page>
  );
}