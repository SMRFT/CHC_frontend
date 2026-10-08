import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import apiRequest from './apiRequest';
import { Search, Calendar, User, Barcode, Download, Filter, TrendingUp, IndianRupee } from 'lucide-react';

const Container = styled.div`
  max-width:1500px;
  margin-left: 260px;
  padding: 2rem;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: #4361ee;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const IconWrapper = styled.div`
  background: ${props => props.bgColor || '#f1f5f9'};
  color: ${props => props.color || '#475569'};
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
`;

const FilterCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  margin-bottom: 2rem;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
`;

const InputGroup = styled.div`
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
`;

const Input = styled.input`
  width: 90%;
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;

  &:focus {
    border-color: #4361ee;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? '#4361ee' : 'white'};
  color: ${props => props.primary ? 'white' : '#475569'};
  border: ${props => props.primary ? 'none' : '1px solid #e2e8f0'};
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.primary ? '#3a0ca3' : '#f8fafc'};
  }
`;

const TableCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  overflow-x: auto;

  /* Custom scrollbar for better styling */
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 900px;
`;

const Th = styled.th`
  background: #f8fafc;
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 1rem;
  font-size: 0.95rem;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
`;

const PaymentReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const base_url = process.env.REACT_APP_BACKEND_LAB_BASE_URL || 'http://localhost:8000';

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await apiRequest(`${base_url}payment_report/`, 'POST', {
        from_date: fromDate,
        to_date: toDate
      });
      if (res.success && res.data.status === 'success') {
        setData(res.data.data);
      } else {
        toast.error(res.error || 'Failed to fetch payment report');
      }
    } catch (err) {
      toast.error('Failed to fetch payment report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const totalCollected = data.reduce((sum, item) => sum + item.netAmount, 0);
  const totalTransactions = data.length;

  const filteredData = data.filter(item => 
    item.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.barcode.includes(searchTerm) ||
    item.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = () => {
    // Basic CSV implementation
    const headers = ['Date', 'Paid At', 'Barcode', 'Patient Name', 'Employee ID', 'Amount', 'Transaction ID'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        new Date(item.date).toLocaleDateString(),
        new Date(item.paid_at).toLocaleString(),
        item.barcode,
        item.employee_name,
        item.employee_id,
        item.netAmount,
        item.transaction_id || '-'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PaymentReport_${fromDate}_${toDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container>
      <Header>
        <Title>
          <TrendingUp size={32} />
          Payment Report
        </Title>
        <ActionButton onClick={handleDownload} primary={false}>
          <Download size={18} />
          Export CSV
        </ActionButton>
      </Header>

      <StatsContainer>
        <StatCard>
          <IconWrapper bgColor="rgba(34, 197, 94, 0.1)" color="#16a34a">
            <IndianRupee size={24} />
          </IconWrapper>
          <StatInfo>
            <StatLabel>Total Collected</StatLabel>
            <StatValue>₹{totalCollected.toFixed(2)}</StatValue>
          </StatInfo>
        </StatCard>
        <StatCard>
          <IconWrapper bgColor="rgba(67, 97, 238, 0.1)" color="#4361ee">
            <Filter size={24} />
          </IconWrapper>
          <StatInfo>
            <StatLabel>Total Transactions</StatLabel>
            <StatValue>{totalTransactions}</StatValue>
          </StatInfo>
        </StatCard>
      </StatsContainer>

      <FilterCard>
        <FilterRow>
          <InputGroup>
            <Label>From Date</Label>
            <Input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <Label>To Date</Label>
            <Input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </InputGroup>
          <InputGroup style={{ flex: 2 }}>
            <Label>Search</Label>
            <Input 
              placeholder="Search patient, barcode..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <ActionButton primary onClick={fetchReport}>
            <Calendar size={18} />
            Generate Report
          </ActionButton>
        </FilterRow>
      </FilterCard>

      <TableCard>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Generating report...</div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Reg. Date</Th>
                <Th>Paid At</Th>
                <Th>Barcode</Th>
                <Th>Patient Name</Th>
                <Th>Amount</Th>
                <Th>Payment Method</Th>
                <Th>Transaction ID</Th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? filteredData.map(item => (
                <tr key={item.id}>
                  <Td>{new Date(item.date).toLocaleDateString()}</Td>
                  <Td>{new Date(item.paid_at).toLocaleString() || "-"}</Td>
                  <Td>{item.barcode}</Td>
                  <Td>{item.employee_name}</Td>
                  <Td>₹{item.netAmount}</Td>
                  <Td>{item.payment_method}</Td>
                  <Td>{item.transaction_id || <span style={{ color: '#94a3b8' }}>N/A</span>}</Td>
                </tr>
              )) : (
                <tr>
                  <Td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No payment records found for this period</Td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </TableCard>
    </Container>
  );
};

export default PaymentReport;
