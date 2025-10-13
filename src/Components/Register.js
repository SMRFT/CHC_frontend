import React, { useState } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';

/* ===== Background visuals ===== */
const float = keyframes`
  0% { transform: translateY(0px) }
  50% { transform: translateY(-12px) }
  100% { transform: translateY(0px) }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  background: radial-gradient(1200px 800px at 10% 0%, #e8ecff 0%, #f7f9fc 30%, #f7f9fc 100%),
              conic-gradient(from 180deg at 70% 20%, #fde1ff, #e6f7ff, #eef2ff, #fde1ff);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

/* Decorative blobs for depth */
const Blob = styled.div`
  position: absolute;
  width: ${p => p.size || 300}px;
  height: ${p => p.size || 300}px;
  border-radius: 50%;
  filter: blur(${p => p.blur || 60}px);
  opacity: ${p => p.opacity || 0.5};
  background: ${p => p.bg || 'linear-gradient(135deg,#7c5cff,#22d3ee)'};
  top: ${p => p.top || '10%'};
  left: ${p => p.left || '60%'};
  animation: ${float} ${p => p.speed || 12}s ease-in-out infinite;
  pointer-events: none;
`;

/* ===== Glass card ===== */
const Card = styled.div`
  display: flex;
  width: 100%;
  max-width: 1100px;
  min-height: 620px;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  border: 1px solid rgba(140, 140, 155, 0.25);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 18px 50px rgba(31, 38, 135, 0.15);

  @media (max-width: 900px) {
    flex-direction: column;
    min-height: auto;
  }
`;

const ImageSection = styled.div`
  flex: 1;
  position: relative;
  background:
    radial-gradient(1200px 600px at 0% 0%, rgba(124,92,255,0.25), transparent 60%),
    radial-gradient(800px 500px at 80% 20%, rgba(34,211,238,0.25), transparent 60%),
    linear-gradient(135deg, #101828, #1f2937);
  background-size: cover;
  background-position: center;

  &::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(16,24,40,0.2) 0%, rgba(16,24,40,0.6) 100%);
  }

  @media (max-width: 900px) { height: 240px; }
`;

const ContentOverlay = styled.div`
  position: absolute; inset: 0;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 3rem; z-index: 2; color: white;

  @media (max-width: 900px) { padding: 1.5rem; }
`;

const ImageTitle = styled.h2`
  font-size: 2.1rem; font-weight: 800; margin: 0;
  letter-spacing: 0.3px;
  text-shadow: 0 2px 6px rgba(0,0,0,0.35);
`;

const ImageSubtitle = styled.p`
  font-size: 1.05rem; margin-top: 0.55rem; opacity: 0.92; max-width: 420px;
  text-shadow: 0 2px 6px rgba(0,0,0,0.35);
`;

/* ===== Form side ===== */
const FormSection = styled.div`
  flex: 1.1;
  padding: 3rem;
  display: flex; flex-direction: column; justify-content: center;

  @media (max-width: 900px) { padding: 2rem 1.5rem; }
`;

const FormHeader = styled.div`
  margin-bottom: 1.6rem; text-align: center;
`;

const Title = styled.h1`
  font-size: 1.85rem; font-weight: 700; color: #0f172a; margin: 0 0 .4rem 0;
`;

const Subtitle = styled.p`
  font-size: .98rem; color: #475569; margin: 0;
`;

const Form = styled.form` width: 100%; `;

const FormGrid = styled.div`
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; margin-bottom: 1.2rem;
  @media (max-width: 600px) { grid-template-columns: 1fr; gap: 1rem; }
`;

const FormGroup = styled.div` display: flex; flex-direction: column; `;

const Label = styled.label`
  font-size: .86rem; font-weight: 600; color: #334155; margin-bottom: .45rem;
`;

const InputWrap = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  height: 50px;
  background-color: rgba(248,249,250,0.9);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 1rem;
  font-size: 0.95rem;
  color: #0f172a;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #7c5cff;
    box-shadow: 0 0 0 4px rgba(124, 92, 255, 0.15);
    background-color: #fff;
  }

  &::placeholder { color: #9aa4b2; }
`;

const Select = styled.select`
  width: 100%;
  height: 50px;
  background-color: rgba(248,249,250,0.9);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 1rem;
  font-size: 0.95rem;
  color: #0f172a;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%238893a3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat; background-position: right 1rem center; background-size: 1em;

  &:focus {
    outline: none;
    border-color: #22d3ee;
    box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.15);
    background-color: #fff;
  }
`;

const ToggleBtn = styled.button`
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  border: 0; background: transparent; color: #64748b; cursor: pointer; font-size: 0.9rem;
`;

const Meter = styled.div`
  height: 8px; border-radius: 999px; background: #e2e8f0; overflow: hidden; margin-top: .5rem;
  & > span {
    display: block; height: 100%; width: ${p => p.width || 0}%;
    background: ${p => p.bg || '#e2e8f0'}; transition: width .25s ease;
  }
`;

const SubmitButton = styled.button`
  width: 100%; height: 52px; margin-top: .4rem;
  border: none; border-radius: 12px; color: #fff; font-size: 1rem; font-weight: 600; cursor: pointer;
  background-image: linear-gradient(135deg, #7c5cff 0%, #22d3ee 100%);
  box-shadow: 0 10px 24px rgba(124,92,255,.22);
  transition: transform .15s ease, box-shadow .2s ease, filter .2s ease;

  &:hover { transform: translateY(-1px); filter: brightness(1.02); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: .7; cursor: not-allowed; filter: grayscale(12%); }
`;

const Message = styled.div`
  margin-top: 1rem; padding: 1rem; text-align: center; border-radius: 12px;
  color: ${p => p.success ? '#155724' : '#721c24'};
  background-color: ${p => p.success ? '#d4edda' : '#f8d7da'};
  border: 1px solid ${p => p.success ? '#c3e6cb' : '#f5c6cb'};
  display: ${p => p.visible ? 'block' : 'none'};
`;

/* ===== Component ===== */
const Register = () => {
  const [formData, setFormData] = useState({
    name: '', role: '', password: '', confirmPassword: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const strength = (() => {
    const p = formData.password || '';
    let score = 0;
    if (p.length >= 8) score += 25;
    if (/[A-Z]/.test(p)) score += 25;
    if (/[0-9]/.test(p)) score += 25;
    if (/[^A-Za-z0-9]/.test(p)) score += 25;
    const bg = score < 50 ? '#ef4444' : score < 75 ? '#f59e0b' : '#22c55e';
    return { score, bg };
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setSuccess(false);
      return;
    }
    setLoading(true);
    try {
      const requestData = {
        name: formData.name,
        role: formData.role,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };
      await axios.post(`${Labbaseurl}registration/`, requestData);
      setMessage('Registration successful!');
      setSuccess(true);
      setFormData({ name: '', role: '', password: '', confirmPassword: '' });
    } catch (error) {
      setMessage(error?.response?.data?.error || 'Registration failed. Please try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Blob size={420} blur={80} opacity={0.35} top="5%" left="65%" bg="linear-gradient(135deg,#7c5cff,#22d3ee)" speed={16} />
      <Blob size={360} blur={70} opacity={0.30} top="75%" left="5%" bg="linear-gradient(135deg,#f472b6,#7c5cff)" speed={18} />
      <Card>

        <FormSection>
          <FormHeader>
            <Title>Create an Account</Title>
            <Subtitle>Please fill in the form to register</Subtitle>
          </FormHeader>

          <Form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name" type="text" name="name" placeholder="Enter your full name"
                  value={formData.name} onChange={handleChange} required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="role">Select Role</Label>
                <Select id="role" name="role" value={formData.role} onChange={handleChange} required>
                  <option value="">Select a role</option>
                  <option value="Admin">Admin</option>
                  <option value="Company">Company</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <InputWrap>
                  <Input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <ToggleBtn type="button" onClick={() => setShowPass(s => !s)}>
                    {showPass ? 'Hide' : 'Show'}
                  </ToggleBtn>
                </InputWrap>
                <Meter width={strength.score} bg={strength.bg}><span /></Meter>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <InputWrap>
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <ToggleBtn type="button" onClick={() => setShowConfirm(s => !s)}>
                    {showConfirm ? 'Hide' : 'Show'}
                  </ToggleBtn>
                </InputWrap>
              </FormGroup>
            </FormGrid>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </SubmitButton>
          </Form>

          <Message visible={message !== ''} success={success}>
            {message}
          </Message>
        </FormSection>
      </Card>
    </PageContainer>
  );
};

export default Register;
