import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import apiRequest from './apiRequest';
import { Search, CreditCard, Calendar, User, Barcode, CheckCircle } from 'lucide-react';

const Container = styled.div`
  max-width: 1500px;
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

const SearchContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  align-items: end;
  gap: 1.25rem;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  margin-bottom: 2.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2.5fr 1fr 1fr auto;
  }
`;

const InputGroup = styled.div`
  position: relative;
  width: 90%;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    width: 18px;
    height: 18px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  font-size: 0.95rem;
  transition: all 0.2s;

  &:focus {
    border-color: #4361ee;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
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

const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.type === 'Credit' ? '#fef3c7' : '#dcfce7'};
  color: ${props => props.type === 'Credit' ? '#92400e' : '#166534'};
`;

const PayButton = styled.button`
  background: #4361ee;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #3a0ca3;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
`;

const ModalTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: #1e293b;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const ConfirmButton = styled.button`
  flex: 1;
  background: #22c55e;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #16a34a;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #e2e8f0;
  }
`;

const CreditToPaid = () => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  const base_url = process.env.REACT_APP_BACKEND_LAB_BASE_URL || 'http://localhost:8000';

  const fetchBillings = async () => {
    try {
      setLoading(true);
      const res = await apiRequest(`${base_url}get_credit_billings/?from_date=${fromDate}&to_date=${toDate}`);
      if (res.success && res.data.status === 'success') {
        setBillings(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to fetch credit billings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillings();
  }, []);

  const handlePayClick = (bill) => {
    setSelectedBill(bill);
    setTransactionId('');
    setShowModal(true);
  };

  const handleMarkAsPaid = async () => {
    try {
      const res = await apiRequest(`${base_url}mark_as_paid/`, 'POST', {
        id: selectedBill.id,
        barcode: selectedBill.barcode,
        transaction_id: transactionId,
        payment_method: paymentMethod
      });

      if (res.success && res.data.status === 'success') {
        toast.success('Payment updated successfully');
        setShowModal(false);
        fetchBillings();
      } else {
        toast.error(res.error || 'Failed to update payment');
      }
    } catch (err) {
      toast.error('Failed to update payment');
    }
  };

  const filteredBillings = billings.filter(bill => 
    bill.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.barcode.includes(searchTerm) ||
    bill.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <Title>
          <CreditCard size={32} />
          Convert Credit to Paid
        </Title>
      </Header>

      <SearchContainer>
        <InputGroup>
          <Search />
          <Input 
            placeholder="Search by name, barcode, or employee ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Label>From</Label>
          <Input 
            type="date"
            style={{ paddingLeft: '0.75rem' }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <Label>To</Label>
          <Input 
            type="date"
            style={{ paddingLeft: '0.75rem' }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </InputGroup>
        <PayButton style={{ height: '42px', padding: '0 2rem', whiteSpace: 'nowrap' }} onClick={fetchBillings}>
          <Calendar size={18} />
          Apply Filter
        </PayButton>
      </SearchContainer>

      <TableCard>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Barcode</Th>
                <Th>Patient Name</Th>
                <Th>Employee ID</Th>
                <Th>Amount</Th>
                <Th>Mode</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {filteredBillings.length > 0 ? filteredBillings.map(bill => (
                <tr key={bill.id}>
                  <Td>{new Date(bill.date).toLocaleDateString()}</Td>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Barcode size={14} color="#64748b" />
                      {bill.barcode}
                    </div>
                  </Td>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={14} color="#64748b" />
                      {bill.employee_name}
                    </div>
                  </Td>
                  <Td>{bill.employee_id}</Td>
                  <Td>₹{bill.netAmount}</Td>
                  <Td><Badge type="Credit">Credit</Badge></Td>
                  <Td>
                    <PayButton onClick={() => handlePayClick(bill)}>
                      <CheckCircle size={16} />
                      Collect Payment
                    </PayButton>
                  </Td>
                </tr>
              )) : (
                <tr>
                  <Td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No pending credit records found</Td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </TableCard>

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Collect Payment</ModalTitle>
            <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>Patient Name</div>
              <div style={{ fontWeight: '600', color: '#1e293b' }}>{selectedBill?.employee_name}</div>
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>Amount to Pay</div>
              <div style={{ fontWeight: '700', color: '#4361ee', fontSize: '1.25rem' }}>₹{selectedBill?.netAmount}</div>
            </div>

            <FormGroup>
              <Label>Payment Method</Label>
              <select 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>
            </FormGroup>

            <FormGroup>
              <Label>Transaction ID (Optional)</Label>
              <Input 
                style={{ paddingLeft: '0.75rem' }} 
                placeholder="Enter ref/transaction ID" 
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </FormGroup>

            <ActionButtons>
              <ConfirmButton onClick={handleMarkAsPaid}>Confirm Payment</ConfirmButton>
              <CancelButton onClick={() => setShowModal(false)}>Cancel</CancelButton>
            </ActionButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default CreditToPaid;
