import React, { useState } from "react";
import styled from "styled-components";
// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;
  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
const ModalHeader = styled.div`
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ModalTitle = styled.h5`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;
const ModalBody = styled.div`
  padding: 1.5rem;
`;
const InputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;
const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #E1E5E9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: #667EEA;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  &:read-only {
    background-color: #F8F9FA;
    color: #6C757D;
  }
  &::placeholder {
    color: #9CA3AF;
  }
`;
const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #E1E5E9;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: #667EEA;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;
const FormGroup = styled.div`
  margin-bottom: 1rem;
`;
const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;
const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;
const SecondaryButton = styled.button`
  background: transparent;
  color: #6B7280;
  border: 2px solid #D1D5DB;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  &:hover {
    background-color: #F9FAFB;
    border-color: #9CA3AF;
    color: #374151;
  }
  &:active {
    background-color: #F3F4F6;
  }
`;
const FetchButton = styled(PrimaryButton)`
  flex-shrink: 0;
  padding: 0.75rem 1.25rem;
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #E5E7EB;
`;
const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
const Form = styled.form`
  margin-top: 1.5rem;
`;
const RegistrationEdition = ({ onClose, onUpdated }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  
 const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const handleFetch = async () => {
    if (!employeeId) return alert("Enter Employee ID");
    setLoading(true);
    try {
      const res = await fetch(`${Labbaseurl}chc_emp_get/${employeeId}/`);
      const data = await res.json();
      if (res.ok) {
        setFormData(data.data);
        onUpdated(data.data);
      } else {
        alert(data.message || "Employee not found");
      }
    } catch (err) {
      console.error(err);
      alert("fetching employee");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return alert("Fetch employee first");
    setLoading(true);
    const payload = {
      ...formData,
      dob: formData.dob?.split("T")[0],
    };
    delete payload.employee_name;
    try {
      const res = await fetch(
        `${Labbaseurl}chc_emp_update/${formData.employee_id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Employee updated successfully");
        onUpdated(data.data);
        onClose();
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("update");
    } finally {
      setLoading(false);
    }
  };
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Edit Employee</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalBody>
          <InputGroup>
            <Input
              type="text"
              placeholder="Enter Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            <FetchButton
              type="button"
              onClick={handleFetch}
              disabled={loading}
            >
              {loading && <LoadingSpinner />}
              {loading ? "Fetching..." : "Fetch"}
            </FetchButton>
          </InputGroup>
          {formData && (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Employee Name</Label>
                <Input
                  type="text"
                  name="employee_name"
                  value={formData.employee_name || ""}
                  readOnly
                />
              </FormGroup>
              <FormGroup>
                <Label>Title</Label>
                <Select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                >
                  <option value="Ms">Ms</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>First Name</Label>
                <Input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Last Name</Label>
                <Input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Gender</Label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Others">Others</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Mobile</Label>
                <Input
                  type="tel"
                  name="mobile"
                  value={formData.mobile || ""}
                  onChange={handleChange}
                />
              </FormGroup>
              <ButtonGroup>
                <SecondaryButton type="button" onClick={onClose}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={loading}>
                  {loading && <LoadingSpinner />}
                  {loading ? "Updating..." : "Update"}
                </PrimaryButton>
              </ButtonGroup>
            </Form>
          )}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};
export default RegistrationEdition;