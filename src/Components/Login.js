import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import "@fontsource/poppins";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";


/* ========== Animations ========== */
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ========== Responsive Shell ========== */
const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(16px, 3vw, 32px);
  width: 100%;
  min-height: 90vh;
  background: linear-gradient(-45deg, #06b6d4, #8b5cf6, #ec4899);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  font-family: Poppins, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;

  /* Optional: prevent scroll on small devices */
  box-sizing: border-box;
`;


/* The container is fluid but capped for readability */
const Card = styled.div`
  width: min(92vw, 440px);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  border: 1px solid rgba(140, 140, 155, 0.22);
  border-radius: clamp(14px, 2vw, 20px);
  box-shadow: 0 18px 50px rgba(31, 38, 135, 0.18);
  padding: clamp(18px, 3.5vw, 28px);
  animation: ${fadeIn} 0.35s ease both;
  @media (min-width: 480px) {
    width: min(90vw, 460px);
  }

  @media (min-width: 768px) {
    width: min(70vw, 520px);
  }
`;

const Title = styled.h1`
  margin: 0 0 6px 0;
  font-size: clamp(20px, 2.4vw, 26px);
  font-weight: 700;
  color: #0f172a;
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 0 0 18px 0;
  text-align: center;
  color: #6b7280;
  font-size: clamp(13px, 1.8vw, 14px);
`;

/* ========== Form ========== */
const Form = styled.form`
  display: grid;
  gap: clamp(12px, 2vw, 16px);
`;

const Field = styled.div`
  position: relative;
  display: grid;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #334155;
`;

const Input = styled.input`
  width: 90%;
  height: clamp(48px, 6.5vh, 52px);
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 0 44px 0 14px;
  background: rgba(255, 255, 255, 0.96);
  font-size: 15px;
  color: #0f172a;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.12);
    background: #fff;
  }

  &::placeholder { color: #9ca3af; }
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 10px;
  top: 34px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  background: transparent;
  color: #6b7280;
  cursor: pointer;

  &:hover { color: #4b5563; }
`;

const Submit = styled.button`
  height: clamp(48px, 6.5vh, 52px);
  border: 0;
  border-radius: 12px;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  background-image: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  box-shadow: 0 10px 24px rgba(139, 92, 246, 0.22);
  transition: transform 0.15s ease, filter 0.2s ease, box-shadow 0.2s ease;

  &:hover { transform: translateY(-1px); filter: brightness(1.02); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

/* ========== Component ========== */
const Login = () => {
  const [form, setForm] = useState({ name: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

const navigateRole = (role) => {
  switch (role) {
    case "Admin":
      navigate("/EmployeeRegistration");
      break;
    case "General Manager":
    case "Company":
      navigate("/Dashboard");
      break;
    case "HR":
      navigate("/LogisticsMap");
      break;
    case "Receptionist":
      navigate("/PatientForm");
      break;
    default:
      navigate("/");
  }
};


  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${Labbaseurl}login/`, {
        name: form.name,
        password: form.password,
      });
      toast.success("Login Successfully!", { autoClose: 2000 });
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      setTimeout(() => navigateRole(data.role), 2000);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      toast.error(msg, { autoClose: 2500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <ToastContainer position="top-right" autoClose={2500} />
      <Card>
        <Title>Welcome back</Title>
        <Subtitle>Please sign in to continue</Subtitle>

        <Form onSubmit={onSubmit}>
          <Field>
            <Label htmlFor="name">User Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your user name"
              value={form.name}
              onChange={onChange}
              autoComplete="username"
              required
            />
          </Field>

          <Field>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
              required
            />
            <TogglePassword
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </TogglePassword>
          </Field>

          <Submit type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Log In"}
          </Submit>
        </Form>
      </Card>
    </Page>
  );
};

export default Login;
