import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaSave, FaSearch, FaFileDownload, FaUsers, FaCheckDouble, FaVial, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from 'xlsx';

// 🎨 Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: #f1f5f9;
  padding: 2rem;
  margin-left: 260px;
  font-family: 'Inter', sans-serif;

  @media (max-width: 1024px) { margin-left: 240px; }
  @media (max-width: 768px) { margin-left: 0; padding: 1rem; }
`;

const Header = styled.div`
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const DateGroup = styled.div`
  display: flex;
  align-items: center;
  background: #f8fafc;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  gap: 0.75rem;
  
  label { font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
  input { border: none; background: transparent; font-size: 0.85rem; color: #1e293b; outline: none; cursor: pointer; font-weight: 600; }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;

  input {
    width: 100%;
    padding: 0.6rem 1rem 0.6rem 2.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    outline: none;
    font-size: 0.9rem;
    &:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
  }

  svg {
    position: absolute;
    left: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #1e293b; transform: translateY(-1px); }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-left: 4px solid ${props => props.color || '#3b82f6'};

  .label { font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase; }
  .value { font-size: 1.75rem; font-weight: 800; color: #0f172a; }
  .icon-box { 
    width: 40px; 
    height: 40px; 
    border-radius: 8px; 
    background: ${props => props.color + '15'}; 
    color: ${props => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
`;

const TestStatsWrapper = styled.div`
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const TestStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const TestStatItem = styled.div`
  padding: 1rem;
  background: ${props => props.isActive ? '#eff6ff' : '#f8fafc'};
  border: 2px solid ${props => props.isActive ? '#3b82f6' : '#e2e8f0'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &:hover { 
    transform: translateY(-2px); 
    border-color: #3b82f6;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  &:active { transform: translateY(0); }

  .name { font-size: 0.8rem; font-weight: 700; color: ${props => props.isActive ? '#1d4ed8' : '#475569'}; margin-bottom: 0.5rem; }
  .count { font-size: 1.25rem; font-weight: 800; color: #1e40af; }
  .total { font-size: 0.75rem; color: #94a3b8; font-weight: 500; }
  
  ${props => props.isActive && `
    &::after {
      content: 'FILTER ACTIVE';
      position: absolute;
      top: -10px;
      right: 10px;
      background: #3b82f6;
      color: white;
      font-size: 0.6rem;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
    }
  `}
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow-x: auto;
`;

const FilterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.75rem;
  background: #fee2e2;
  color: #ef4444;
  border: 1px solid #fecaca;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #fecaca; }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  min-width: 1000px;

  thead {
    background: #f8fafc;
    th {
      padding: 1rem 0.75rem;
      text-align: center;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      font-size: 0.7rem;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #e2e8f0;
      white-space: nowrap;

      &:nth-child(2), &:nth-child(3) { text-align: left; }
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background 0.1s;
      &:hover { background: #f8fafc; }
    }
    td {
      padding: 0.75rem;
      color: #334155;
      vertical-align: middle;
      text-align: center;

      &:nth-child(2), &:nth-child(3) { text-align: left; }
    }
  }
`;

const StatusBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  
  .status-text { font-size: 0.75rem; font-weight: 700; }
  .date-text { font-size: 0.6rem; color: #94a3b8; font-weight: 500; }
`;

const Checkbox = styled.input`
  width: 1.3rem;
  height: 1.3rem;
  cursor: pointer;
  accent-color: #3b82f6;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 0.8rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;

  &:hover { background: #059669; }
  &:disabled { background: #cbd5e1; cursor: not-allowed; }
`;

const InvestigationChecklist = () => {
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  
  const [checklists, setChecklists] = useState([]);
  const [stats, setStats] = useState({ total_patients: 0, fully_completed_patients: 0, test_stats: {} });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [allTests, setAllTests] = useState([]);
  const [fromDate, setFromDate] = useState(getTodayStr());
  const [toDate, setToDate] = useState(getTodayStr());
  const [selectedTestFilter, setSelectedTestFilter] = useState(null);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  useEffect(() => {
    fetchChecklists();
  }, [fromDate, toDate]);

  const fetchChecklists = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${Labbaseurl}get_investigation_checklists/?from_date=${fromDate}&to_date=${toDate}`);
      const data = await res.json();
      if (data.status === "success") {
        setChecklists(data.data);
        setStats(data.stats || { total_patients: 0, fully_completed_patients: 0, test_stats: {} });
        
        if (data.stats && data.stats.test_stats) {
            const testList = Object.keys(data.stats.test_stats).sort((a, b) => {
                if (a === "vitals") return 1;
                if (b === "vitals") return -1;
                return a.localeCompare(b);
            });
            setAllTests(testList);
        }
      }
    } catch (err) {
      toast.error("Failed to fetch checklists");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (empId, testName) => {
    setChecklists(prev => prev.map(cl => {
      if (cl.employee_id === empId) {
        const updatedChecklist = cl.checklist.map(item => {
          if (item.test_name === testName) {
            const isCompleted = !item.is_completed;
            return {
              ...item,
              is_completed: isCompleted,
              approved_at: isCompleted ? new Date().toISOString() : null
            };
          }
          return item;
        });
        return { ...cl, checklist: updatedChecklist };
      }
      return cl;
    }));
  };

  const savePatientChecklist = async (empId) => {
    const patientData = checklists.find(cl => cl.employee_id === empId);
    if (!patientData) return;

    try {
      const res = await fetch(`${Labbaseurl}update_investigation_checklist/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: patientData.employee_id,
          checklist: patientData.checklist
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success(`Progress saved for ${patientData.employee_name}`);
        fetchChecklists();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error saving progress");
    }
  };

  const exportToExcel = () => {
    if (checklists.length === 0) {
      toast.warn("No data to export");
      return;
    }

    const exportData = checklists.map((patient, index) => {
      const row = {
        "S.No": index + 1,
        "Employee ID": patient.employee_id,
        "Name": patient.employee_name,
      };
      
      allTests.forEach(testName => {
        const testItem = patient.checklist.find(item => item.test_name === testName);
        if (testItem) {
          row[testName] = testItem.is_completed 
            ? `Completed (${new Date(testItem.approved_at).toLocaleDateString()})` 
            : "Pending";
        } else {
          row[testName] = "-";
        }
      });
      
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Checklist Report");
    XLSX.writeFile(workbook, `Investigation_Checklist_${fromDate}_to_${toDate}.xlsx`);
  };

  const handleTestFilterClick = (testName) => {
    if (selectedTestFilter === testName) {
      setSelectedTestFilter(null);
    } else {
      setSelectedTestFilter(testName);
    }
  };

  const filteredPatients = checklists.filter(cl => {
    const matchesSearch = cl.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cl.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!selectedTestFilter) return matchesSearch;

    // Filter for pending status in the selected test
    const testItem = cl.checklist.find(item => item.test_name === selectedTestFilter);
    return matchesSearch && testItem && !testItem.is_completed;
  });

  return (
    <PageContainer>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <Header>
        <HeaderTop>
          <Title><FaVial /> Investigation Dashboard</Title>
          <Controls>
            <DateGroup>
              <label>From</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </DateGroup>
            <DateGroup>
              <label>To</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </DateGroup>
            <ExportButton onClick={exportToExcel}>
              <FaFileDownload /> Export Report
            </ExportButton>
          </Controls>
        </HeaderTop>
        
        <SearchBox>
          <FaSearch />
          <input 
            placeholder="Search by ID or Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
      </Header>

      <StatsGrid>
        <StatCard color="#3b82f6">
          <div className="icon-box"><FaUsers size={20} /></div>
          <div className="label">Total Registered</div>
          <div className="value">{stats.total_patients}</div>
        </StatCard>
        <StatCard color="#10b981">
          <div className="icon-box"><FaCheckDouble size={20} /></div>
          <div className="label">Fully Completed</div>
          <div className="value">{stats.fully_completed_patients}</div>
        </StatCard>
        <StatCard color="#f59e0b">
          <div className="icon-box"><FaVial size={20} /></div>
          <div className="label">Total Tests Tracked</div>
          <div className="value">{Object.keys(stats.test_stats).length}</div>
        </StatCard>
      </StatsGrid>

      <TestStatsWrapper>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
            COMPLETION PER TEST
            <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginTop: '4px' }}>Click a test card to filter patients with <strong>PENDING</strong> status</div>
          </div>
          {selectedTestFilter && (
            <ClearButton onClick={() => setSelectedTestFilter(null)}>
              <FaTimes /> Clear Filter
            </ClearButton>
          )}
        </div>
        <TestStatsGrid>
          {Object.entries(stats.test_stats).map(([name, data]) => (
            <TestStatItem 
              key={name} 
              onClick={() => handleTestFilterClick(name)}
              isActive={selectedTestFilter === name}
            >
              <div className="name" style={{ textTransform: name === 'vitals' ? 'uppercase' : 'none' }}>{name}</div>
              <div className="count">{data.completed} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>done</span></div>
              <div className="total">of {data.total} patients</div>
            </TestStatItem>
          ))}
          {Object.keys(stats.test_stats).length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
              No test data available for the selected period.
            </div>
          )}
        </TestStatsGrid>
      </TestStatsWrapper>

      <TableWrapper>
        {selectedTestFilter && (
          <FilterInfo>
            <FaVial color="#3b82f6" />
            Showing patients with <strong>PENDING {selectedTestFilter.toUpperCase()}</strong>
          </FilterInfo>
        )}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading Patient Records...</div>
        ) : (
          <StyledTable>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>S.No</th>
                <th style={{ width: '120px' }}>Employee ID</th>
                <th style={{ width: '220px' }}>Name</th>
                {allTests.map(testName => (
                  <th key={testName} style={{ 
                    color: testName === 'vitals' ? '#1e40af' : (selectedTestFilter === testName ? '#3b82f6' : 'inherit'),
                    backgroundColor: selectedTestFilter === testName ? '#eff6ff' : 'transparent'
                  }}>
                    {testName}
                  </th>
                ))}
                <th style={{ width: '100px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={allTests.length + 4} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    {selectedTestFilter ? `No patients found with pending ${selectedTestFilter}` : 'No patient records found'}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient, index) => (
                  <tr key={patient.employee_id}>
                    <td>{index + 1}</td>
                    <td style={{ fontWeight: 700, color: '#1e293b' }}>{patient.employee_id}</td>
                    <td style={{ fontWeight: 600 }}>{patient.employee_name}</td>
                    {allTests.map(testName => {
                      const testItem = patient.checklist.find(item => item.test_name === testName);
                      const isFiltered = selectedTestFilter === testName;
                      return (
                        <td key={testName} style={{ backgroundColor: isFiltered ? '#eff6ff' : 'transparent' }}>
                          {testItem ? (
                            <StatusBadge>
                              <Checkbox 
                                type="checkbox" 
                                checked={testItem.is_completed} 
                                onChange={() => handleStatusChange(patient.employee_id, testName)}
                              />
                              {testItem.is_completed ? (
                                <>
                                  <span className="status-text" style={{ color: '#10b981' }}>Completed</span>
                                  <span className="date-text">({new Date(testItem.approved_at).toLocaleDateString()})</span>
                                </>
                              ) : (
                                <span className="status-text" style={{ color: '#f59e0b' }}>Pending</span>
                              )}
                            </StatusBadge>
                          ) : (
                            <span style={{ color: '#e2e8f0' }}>-</span>
                          )}
                        </td>
                      );
                    })}
                    <td>
                      <SaveButton onClick={() => savePatientChecklist(patient.employee_id)}>
                        <FaSave /> Save
                      </SaveButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </StyledTable>
        )}
      </TableWrapper>
    </PageContainer>
  );
};

export default InvestigationChecklist;
