import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import "bootstrap-icons/font/bootstrap-icons.css";

// ===== Enhanced Styled Components =====
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
  padding: 2rem 0;
  margin-left: 260px; /* Match sidebar desktop width */

  @media (max-width: 1024px) {
    margin-left: 240px; /* Match sidebar tablet width */
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
`;

const FormLabel = styled.label`
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: block;
  color: #374151;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 
      0 0 0 3px rgba(16, 185, 129, 0.1),
      inset 0 1px 3px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }

  option {
    padding: 0.5rem;
  }
`;

const TableContainer = styled.div`
  margin: 2rem 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  animation: slideInTable 0.5s ease-out;

  @keyframes slideInTable {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
`;

const Th = styled.th`
  background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e5e7eb;

  &:first-child {
    text-align: center;
  }

  &:last-child {
    text-align: center;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #374151;
  transition: all 0.2s ease;
  text-align: ${props => props.center ? 'center' : 'left'};
  font-weight: ${props => props.bold ? '600' : 'normal'};

  tr:hover & {
    background-color: #f8fafc;
  }

  &:first-child {
    text-align: center;
    font-weight: 600;
    color: #6b7280;
  }

  &:last-child {
    text-align: center;
  }
`;

const TotalRow = styled.tr`
  background: linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%);
  font-weight: 700;
  
  td {
    border-top: 2px solid #10b981;
    color: #065f46;
    
    &:first-child {
      color: #065f46;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 
      0 0 0 3px rgba(16, 185, 129, 0.1),
      inset 0 1px 3px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(145deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 15px rgba(16, 185, 129, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 8px 25px rgba(16, 185, 129, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const DeleteIcon = styled.i`
  color: #ef4444;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  padding: 0.25rem;
  border-radius: 6px;

  &:hover {
    background-color: #fef2f2;
    color: #dc2626;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f1f5f9;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  font-style: italic;
  
  i {
    font-size: 3rem;
    color: #d1d5db;
    margin-bottom: 1rem;
    display: block;
  }
`;

const AmountSection = styled.div`
  background: linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #10b981;
  margin-top: 1rem;
  animation: slideInAmount 0.4s ease-out;

  @keyframes slideInAmount {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// === Modal Styles ===
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
`;

const ModalTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: #112D4E;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #3F72AF;
  }
  &:read-only {
    background: #f3f4f6;
    color: #6b7280;
    font-weight: 600;
  }
`;

const ModalLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 0.3rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const PlusButton = styled.button`
  background: #3F72AF;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0 1rem;
  font-size: 1.4rem;
  cursor: pointer;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
  &:hover { background: #112D4E; }
`;

const CompanyRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
`;

const CancelButton = styled.button`
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #d1d5db; }
`;

const Packagecreation = () => {
  const [tests, setTests] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [packageName, setPackageName] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [testSearch, setTestSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");

  // Modal state
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    company_id: "",
    company_name: "",
    address: "",
    contact_number: "",
    contact_email: "",
    industry: "",
    website: "",
    established_year: "",
  });
  const [savingCompany, setSavingCompany] = useState(false);

  // CHC Test Modal state
  const [showTestModal, setShowTestModal] = useState(false);
  const [newTest, setNewTest] = useState({
    test_name: "",
    test_price: "",
    test_id: "",
    is_active: true,
    is_fileuploaded: false,
    is_notes: false,
    is_report: false,
    notes: "",
    report: "",
  });
  const [savingTest, setSavingTest] = useState(false);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Fetch tests
  const fetchTests = async () => {
    try {
      const res = await axios.get(`${Labbaseurl}get_core_test/`);
      if (res.data.status === "success") {
        setTests(res.data.tests);
      }
    } catch (err) {
      console.error("Error fetching tests:", err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [Labbaseurl]);

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${Labbaseurl}companies/`);
      setCompanies(res.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [Labbaseurl]);

  // Open create company modal and fetch next ID
  const openCompanyModal = async () => {
    try {
      const res = await axios.get(`${Labbaseurl}companies/next-id/`);
      setNewCompany(prev => ({ ...prev, company_id: res.data.company_id }));
    } catch (err) {
      setNewCompany(prev => ({ ...prev, company_id: "CHC001" }));
    }
    setShowCompanyModal(true);
  };

  const handleNewCompanyChange = (e) => {
    const { name, value } = e.target;
    setNewCompany(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCompany = async () => {
    if (!newCompany.company_name.trim()) {
      alert("Company name is required");
      return;
    }
    setSavingCompany(true);
    try {
      const res = await axios.post(`${Labbaseurl}companies/`, newCompany);
      if (res.status === 201) {
        fetchCompanies();
        setSelectedCompanyId(res.data.company_id);
        setShowCompanyModal(false);
        setNewCompany({ company_id: "", company_name: "", address: "", contact_number: "", contact_email: "", industry: "", website: "", established_year: "" });
        alert(`Company created! ID: ${res.data.company_id}`);
      }
    } catch (err) {
      alert("Failed to create company: " + (err.response?.data ? JSON.stringify(err.response.data) : err.message));
    } finally {
      setSavingCompany(false);
    }
  };

  // CHC Test Modal Logic
  const openTestModal = async () => {
    try {
      const res = await axios.get(`${Labbaseurl}get_next_chc_test_id/`);
      setNewTest(prev => ({
        ...prev,
        test_id: res.data.test_id,
        test_name: "",
        test_price: "",
        is_fileuploaded: false,
        is_notes: false,
        is_report: false,
        notes: "",
        report: "",
      }));
    } catch (err) {
      setNewTest(prev => ({ ...prev, test_id: "CHC001" }));
    }
    setShowTestModal(true);
  };

  const handleNewTestChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTest(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateTest = async () => {
    if (!newTest.test_name.trim() || !newTest.test_price) {
      alert("Test name and price are required");
      return;
    }
    setSavingTest(true);
    try {
      const res = await axios.post(`${Labbaseurl}create_chc_test/`, newTest);
      if (res.status === 201) {
        fetchTests();
        setShowTestModal(false);
        alert(`Test created! ID: ${res.data.test_id}`);
      }
    } catch (err) {
      alert("Failed to create test: " + (err.response?.data ? JSON.stringify(err.response.data) : err.message));
    } finally {
      setSavingTest(false);
    }
  };

  const handleTestSelect = (e) => {
    const selectedName = e.target.value;
    setSelectedTest(selectedName);
    if (!selectedName) return;
    const testObj = tests.find((t) => t.name === selectedName);
    if (!testObj) return;

    // Check if test already exists
    if (tableData.some(item => item.name === selectedName)) {
      alert("This test is already added to the package");
      setSelectedTest("");
      return;
    }

    setTableData((prev) => [
      ...prev,
      {
        sNo: prev.length + 1,
        name: testObj.name,
        test_id: testObj.test_id || null,
        MRP: testObj.MRP,
        L2L_Rate_Card: testObj.L2L_Rate_Card,
      },
    ]);

    setSelectedTest("");
  };

  const handleRemove = (index) => {
    setTableData((prev) =>
      prev.filter((_, i) => i !== index).map((row, idx) => ({ ...row, sNo: idx + 1 }))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCompanyId) {
      alert("Please select a company");
      return;
    }
    if (!packageName.trim()) {
      alert("Please enter a package name");
      return;
    }
    if (tableData.length === 0) {
      alert("Add at least one test to create a package");
      return;
    }
    if (!totalAmount || Number(totalAmount) <= 0) {
      alert("Please enter a valid total amount");
      return;
    }

    const payload = {
      package_name: packageName.trim(),
      company_id: selectedCompanyId,
      totalAmount: Number(totalAmount),
      investigations: tableData.map((row) => ({
        testname: row.name,
        test_id: row.test_id,
      })),
    };

    try {
      const response = await fetch(`${Labbaseurl}create_package/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok && data.status === "success") {
        alert(`Package created! ID: ${data.data.package_id}`);
        setTableData([]);
        setTotalAmount("");
        setSelectedTest("");
        setPackageName("");
        setSelectedCompanyId("");
      } else {
        alert("Error: " + (data.message || "Failed to create package"));
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Server error while creating package");
    }
  };

  const totalMRP = tableData.reduce((sum, row) => sum + (Number(row.MRP) || 0), 0);
  const totalL2L = tableData.reduce((sum, row) => sum + (Number(row.L2L_Rate_Card) || 0), 0);

  return (
    <PageContainer>
      <Container>
        <Header>
          <Title>Create Company & Package</Title>
        </Header>

        <Card>
          <form onSubmit={handleSubmit}>

            {/* Company Dropdown */}
            <FormGroup>
              <FormLabel>Company</FormLabel>
              <Input
                type="text"
                placeholder="🔍 Search company..."
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <CompanyRow>
                <FormSelect
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  required
                  style={{ flex: 1 }}
                >
                  <option value="">-- Select Company --</option>
                  {companies
                    .filter(c => c.company_name.toLowerCase().includes(companySearch.toLowerCase()) || c.company_id.toLowerCase().includes(companySearch.toLowerCase()))
                    .map((c) => (
                      <option key={c.company_id} value={c.company_id}>
                        {c.company_name} ({c.company_id})
                      </option>
                    ))}
                </FormSelect>
                <PlusButton type="button" onClick={openCompanyModal} title="Create new company">
                  +
                </PlusButton>
              </CompanyRow>
            </FormGroup>

            {/* Package Name */}
            <FormGroup>
              <FormLabel>Package Name</FormLabel>
              <Input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="Enter package name"
                required
              />
            </FormGroup>

            {/* Test Selection */}
            <FormGroup>
              <FormLabel>Select Test</FormLabel>
              <Input
                type="text"
                placeholder="🔍 Search test..."
                value={testSearch}
                onChange={(e) => setTestSearch(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <CompanyRow>
                <FormSelect value={selectedTest} onChange={handleTestSelect} style={{ flex: 1 }}>
                  <option value="">-- Select Test --</option>
                  {tests
                    .filter(t => t.name.toLowerCase().includes(testSearch.toLowerCase()))
                    .map((test, idx) => (
                      <option key={idx} value={test.name}>
                        {test.name}
                      </option>
                    ))}
                </FormSelect>
                <PlusButton type="button" onClick={openTestModal} title="Create new test">
                  +
                </PlusButton>
              </CompanyRow>
            </FormGroup>

            {tableData.length > 0 ? (
              <>
                <TableContainer>
                  <Table>
                    <thead>
                      <tr>
                        <Th>S.No</Th>
                        <Th>Test Name</Th>
                        <Th>MRP</Th>
                        <Th>L2L Rate Card</Th>
                        <Th>Action</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, index) => (
                        <tr key={index}>
                          <Td center>{row.sNo}</Td>
                          <Td>{row.name}</Td>
                          <Td center>₹{row.MRP}</Td>
                          <Td center>₹{row.L2L_Rate_Card}</Td>
                          <Td center>
                            <DeleteIcon
                              className="bi bi-trash"
                              onClick={() => handleRemove(index)}
                              title="Remove test"
                            />
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <TotalRow>
                        <Td bold colSpan="2">Total:</Td>
                        <Td bold center>₹{totalMRP}</Td>
                        <Td bold center>₹{totalL2L}</Td>
                        <Td></Td>
                      </TotalRow>
                    </tfoot>
                  </Table>
                </TableContainer>

                <AmountSection>
                  <FormGroup>
                    <FormLabel>Total Package Amount (₹)</FormLabel>
                    <Input
                      type="number"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      placeholder="Enter total package amount"
                      required
                      min="1"
                    />
                  </FormGroup>
                </AmountSection>
              </>
            ) : (
              <EmptyState>
                <i className="bi bi-clipboard-plus"></i>
                <p>No tests selected yet. Please select tests to create a package.</p>
              </EmptyState>
            )}

            <ButtonContainer>
              <SubmitButton type="submit" disabled={tableData.length === 0}>
                Create Package
              </SubmitButton>
            </ButtonContainer>
          </form>
        </Card>
      </Container>

      {/* Create Company Modal */}
      {showCompanyModal && (
        <ModalOverlay onClick={() => setShowCompanyModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Create New Company</ModalTitle>

            {/* <ModalLabel>Company ID (Auto-generated)</ModalLabel>
            <ModalInput value={newCompany.company_id} readOnly /> */}

            <ModalLabel>Company Name *</ModalLabel>
            <ModalInput
              name="company_name"
              value={newCompany.company_name}
              onChange={handleNewCompanyChange}
              placeholder="e.g. Acme Corp"
            />

            <ModalLabel>Address</ModalLabel>
            <ModalInput
              name="address"
              value={newCompany.address}
              onChange={handleNewCompanyChange}
              placeholder="Company address"
            />

            <ModalLabel>Contact Number</ModalLabel>
            <ModalInput
              name="contact_number"
              value={newCompany.contact_number}
              onChange={handleNewCompanyChange}
              placeholder="+91 XXXXXXXXXX"
            />

            <ModalLabel>Contact Email</ModalLabel>
            <ModalInput
              name="contact_email"
              type="email"
              value={newCompany.contact_email}
              onChange={handleNewCompanyChange}
              placeholder="email@company.com"
            />

            <ModalLabel>Industry</ModalLabel>
            <ModalInput
              name="industry"
              value={newCompany.industry}
              onChange={handleNewCompanyChange}
              placeholder="e.g. Manufacturing"
            />

            <ModalLabel>Website</ModalLabel>
            <ModalInput
              name="website"
              value={newCompany.website}
              onChange={handleNewCompanyChange}
              placeholder="https://..."
            />

            <ModalLabel>Established Year</ModalLabel>
            <ModalInput
              name="established_year"
              type="number"
              value={newCompany.established_year}
              onChange={handleNewCompanyChange}
              placeholder="e.g. 2000"
            />

            <ModalActions>
              <CancelButton type="button" onClick={() => setShowCompanyModal(false)}>
                Cancel
              </CancelButton>
              <SubmitButton type="button" onClick={handleCreateCompany} disabled={savingCompany}>
                {savingCompany ? "Saving..." : "Create Company"}
              </SubmitButton>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* Create CHC Test Modal */}
      {showTestModal && (
        <ModalOverlay onClick={() => setShowTestModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Create New CHC Test</ModalTitle>

            <ModalLabel>Test ID (Auto-generated)</ModalLabel>
            <ModalInput value={newTest.test_id} readOnly />

            <ModalLabel>Test Name *</ModalLabel>
            <ModalInput
              name="test_name"
              value={newTest.test_name}
              onChange={handleNewTestChange}
              placeholder="e.g. Blood Test"
            />

            <ModalLabel>Test Price *</ModalLabel>
            <ModalInput
              name="test_price"
              type="number"
              value={newTest.test_price}
              onChange={handleNewTestChange}
              placeholder="0.00"
            />

            <ModalLabel>Default Notes</ModalLabel>
            <ModalInput
              name="notes"
              value={newTest.notes}
              onChange={handleNewTestChange}
              placeholder="e.g. Standard observation notes"
            />

            <ModalLabel>Default Report</ModalLabel>
            <ModalInput
              name="report"
              value={newTest.report}
              onChange={handleNewTestChange}
              placeholder="e.g. Normal Study"
            />

            <div style={{ marginTop: '1rem' }}>
              <ModalLabel>Permissions</ModalLabel>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', background: '#f9fafb', padding: '0.75rem', borderRadius: '8px' }}>
                <span>File Upload Required?</span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <input type="radio" name="is_fileuploaded" checked={newTest.is_fileuploaded === true} onChange={() => setNewTest(p => ({ ...p, is_fileuploaded: true }))} /> Yes
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <input type="radio" name="is_fileuploaded" checked={newTest.is_fileuploaded === false} onChange={() => setNewTest(p => ({ ...p, is_fileuploaded: false }))} /> No
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', background: '#f9fafb', padding: '0.75rem', borderRadius: '8px' }}>
                <span>Notes Required?</span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <input type="radio" name="is_notes" checked={newTest.is_notes === true} onChange={() => setNewTest(p => ({ ...p, is_notes: true }))} /> Yes
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <input type="radio" name="is_notes" checked={newTest.is_notes === false} onChange={() => setNewTest(p => ({ ...p, is_notes: false }))} /> No
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f9fafb', padding: '0.75rem', borderRadius: '8px' }}>
                <span>Report Required?</span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <input type="radio" name="is_report" checked={newTest.is_report === true} onChange={() => setNewTest(p => ({ ...p, is_report: true }))} /> Yes
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <input type="radio" name="is_report" checked={newTest.is_report === false} onChange={() => setNewTest(p => ({ ...p, is_report: false }))} /> No
                  </label>
                </div>
              </div>
            </div>

            <ModalActions>
              <CancelButton type="button" onClick={() => setShowTestModal(false)}>
                Cancel
              </CancelButton>
              <SubmitButton type="button" onClick={handleCreateTest} disabled={savingTest}>
                {savingTest ? "Saving..." : "Create Test"}
              </SubmitButton>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default Packagecreation;