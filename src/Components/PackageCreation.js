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

const Packagecreation = () => {
  const [tests, setTests] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState("");
  const [selectedTest, setSelectedTest] = useState("");

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  // Fetch tests
  useEffect(() => {
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
    fetchTests();
  }, []);

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
        MRP: testObj.MRP,
        L2L_Rate_Card: testObj.L2L_Rate_Card,
        total: (Number(selectedAmount) || 0) * (testObj.L2L_Rate_Card || 0),
      },
    ]);

    // Reset selection
    setSelectedTest("");
  };

  const handleAmountChange = (value) => {
    setSelectedAmount(value);
    const numericValue = Number(value) || 0;
    setTableData((prev) =>
      prev.map((row) => ({ ...row, total: numericValue * (row.L2L_Rate_Card || 0) }))
    );
  };

  const handleRemove = (index) => {
    setTableData((prev) =>
      prev.filter((_, i) => i !== index).map((row, idx) => ({ ...row, sNo: idx + 1 }))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tableData.length === 0) {
      alert("Add at least one test to create a package");
      return;
    }

    if (!selectedAmount || Number(selectedAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const payload = {
      amount: selectedAmount,
      tests: tableData,
    };

    try {
      const response = await fetch(`${Labbaseurl}create_package/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Package created successfully!");
        setTableData([]);
        setSelectedAmount("");
        setSelectedTest("");
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
          <Title>Create Package</Title>
        </Header>

        <Card>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>Select Test</FormLabel>
              <FormSelect value={selectedTest} onChange={handleTestSelect}>
                <option value="">-- Select Test --</option>
                {tests.map((test, idx) => (
                  <option key={idx} value={test.name}>
                    {test.name}
                  </option>
                ))}
              </FormSelect>
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
                    <FormLabel>Package Amount</FormLabel>
                    <Input
                      type="number"
                      value={selectedAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="Enter package amount"
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
    </PageContainer>
  );
};

export default Packagecreation;