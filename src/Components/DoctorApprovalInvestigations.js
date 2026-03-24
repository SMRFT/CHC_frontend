"use client"
import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Eye, X, Maximize2, CheckCircle2, AlertCircle } from "lucide-react";

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

const ViewBtn = styled.button`
  background: #3F72AF;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0 auto;
  &:hover { background: #112D4E; }
`;

const FileBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: relative;
  cursor: pointer;
  
  img {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid #e2e8f0;
    transition: transform 0.2s;
    &:hover { transform: scale(1.05); }
  }

  .preview-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.4);
    color: white;
    padding: 4px;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover .preview-icon { opacity: 1; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  position: relative;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
  h3 { margin: 0; color: #112D4E; }
`;

const CloseIcon = styled(X)`
  cursor: pointer;
  color: #666;
  &:hover { color: #f43f5e; }
`;

const ModalBody = styled.div`
  overflow-y: auto;
  flex: 1;
  padding-right: 8px;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
`;

const PreviewOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
`;

const PreviewClose = styled(X)`
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  cursor: pointer;
  width: 32px;
  height: 32px;
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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal & Preview State
  const [showModal, setShowModal] = useState(false);
  const [selectedInv, setSelectedInv] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${Labbaseurl}get_investigations/`;
      if (startDate) {
        url += `${url.includes('?') ? '&' : '?'}from_date=${startDate.toISOString().split('T')[0]}`;
        if (endDate) {
          url += `&to_date=${endDate.toISOString().split('T')[0]}`;
        }
      }
      const res = await axios.get(url);
      setInvestigations(res.data || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      return matchesSearch && statusMatch;
    });
  }, [investigations, searchInput, statusFilter]);

  const renderFiles = (files) => {
    if (!files || files.length === 0) return "-";
    return (
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {files.map(fileId => {
          const url = `${Labbaseurl}get_file/${fileId}/`;
          return (
            <FileBox key={fileId} onClick={() => setPreviewImage(url)}>
              <img src={url} alt="file" onError={(e) => e.target.src = "https://via.placeholder.com/60?text=File"} />
              <div className="preview-icon"><Maximize2 size={16} /></div>
            </FileBox>
          );
        })}
      </div>
    );
  };

  const renderVitals = (vitals) => {
    if (!vitals) return "-";
    const parts = [];
    if (vitals.height_cm) parts.push(`H: ${vitals.height_cm}cm`);
    if (vitals.weight_kg) parts.push(`W: ${vitals.weight_kg}kg`);
    if (vitals.bmi) parts.push(`BMI: ${vitals.bmi}`);
    if (vitals.blood_pressure) parts.push(`BP: ${vitals.blood_pressure}`);
    if (vitals.spo2) parts.push(`SpO2: ${vitals.spo2}%`);
    return parts.length > 0 ? parts.join(", ") : "-";
  };

  const handleOpenModal = (inv) => {
    setSelectedInv(inv);
    setShowModal(true);
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
                    <Th>Age</Th><Th>Barcode</Th><Th>Vitals</Th>
                    <Th>Test Details</Th>
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
                      <Td data-label="Vitals">{renderVitals(inv.vitals)}</Td>
                      <Td data-label="Test Details">
                        <ViewBtn onClick={() => handleOpenModal(inv)}>
                          <Eye size={14} /> View Results
                        </ViewBtn>
                      </Td>
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

      {/* Test Results Modal */}
      {showModal && selectedInv && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <div>
                <h3>Test Reports & Investigations</h3>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Patient: <strong>{selectedInv.employee_name}</strong> | ID: {selectedInv.employee_id}
                </div>
              </div>
              <CloseIcon onClick={() => setShowModal(false)} />
            </ModalHeader>
            <ModalBody>
              <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#112D4E', fontSize: '14px' }}>Patient Context</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                  <div><strong>History:</strong> {selectedInv.patient_history || "No history provided"}</div>
                  <div><strong>Vitals:</strong> {renderVitals(selectedInv.vitals)}</div>
                </div>
              </div>

              {selectedInv.visual_acuity && Object.values(selectedInv.visual_acuity).some(v => v.right || v.left) && (
                <div style={{ background: '#fff9e6', padding: '15px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #ffe699' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#856404', fontSize: '14px', textTransform: 'uppercase' }}>Ophthalmology Results (Visual Acuity)</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ffe699' }}>Parameter</th>
                        <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ffe699' }}>Right Eye</th>
                        <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ffe699' }}>Left Eye</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Distance", key: "distance" },
                        { label: "Near Vision", key: "nearVision" },
                        { label: "Colour Vision", key: "colourVision" },
                        { label: "Ocular Movement", key: "ocularmovement" }
                      ].map(item => (
                        <tr key={item.key}>
                          <td style={{ padding: '8px', borderBottom: '1px solid #fff3cd', fontWeight: 'bold' }}>{item.label}</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #fff3cd', textAlign: 'center' }}>{selectedInv.visual_acuity[item.key]?.right || "-"}</td>
                          <td style={{ padding: '8px', borderBottom: '1px solid #fff3cd', textAlign: 'center' }}>{selectedInv.visual_acuity[item.key]?.left || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ marginTop: '12px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div><strong>Patient Complaints:</strong> {selectedInv.visual_acuity.complaints || "-"}</div>
                    <div><strong>Remarks:</strong> {selectedInv.visual_acuity.remarks || "-"}</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {selectedInv.test_results?.length > 0 ? selectedInv.test_results.map((test, idx) => (
                  <div key={idx} style={{ padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9', background: '#fff', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ margin: 0, color: '#112D4E', fontSize: '16px', fontWeight: '800' }}>{test.test_name}</h4>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#64748b', fontSize: '13px' }}>REPORT :</span>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{test.report || "No report"}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#64748b', fontSize: '13px' }}>FILES :</span>
                        {renderFiles(test.files)}
                      </div>
                    </div>

                    {test.notes && (
                      <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#64748b', fontSize: '13px' }}>NOTE :</span>
                        <span style={{ fontSize: '13px', marginLeft: '8px', color: '#1e293b' }}>{test.notes}</span>
                      </div>
                    )}
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <AlertCircle size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
                    <p>No detailed test results found for this investigation.</p>
                  </div>
                )}
              </div>
            </ModalBody>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <ApproveBtn
                disabled={selectedInv.status === 'approved'}
                onClick={() => { handleApprove(selectedInv.barcode); setShowModal(false); }}
                style={{ fontSize: '14px' }}
              >
                {selectedInv.status === 'approved' ? <><CheckCircle2 size={16} /> Approved</> : "Approve All Results"}
              </ApproveBtn>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #dbe2ef', background: 'white', fontWeight: 700, cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )
      }

      {/* Image Full-screen Preview */}
      {
        previewImage && (
          <PreviewOverlay onClick={() => setPreviewImage(null)}>
            <PreviewClose onClick={() => setPreviewImage(null)} />
            <PreviewImage src={previewImage} onClick={e => e.stopPropagation()} />
          </PreviewOverlay>
        )
      }
    </Page >
  );
}
