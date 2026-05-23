import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import "@fontsource/poppins";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

// Global palette + responsive background (one-time injection)
const GlobalStyle = createGlobalStyle`
  :root {
    --bg1: #0f172a;
    --bg2: #1e293b;
    --primary: #6366f1;
    --primary-2: #8b5cf6;
    --accent: #22d3ee;
    --success: #10b981;
    --danger: #ef4444;
    --text: #0f172a;
    --muted: #6b7280;
    --card-glass: rgba(255,255,255,0.90);
    --card-border: rgba(140,140,155,0.22);
    --shadow: 0 18px 50px rgba(31,38,135,0.18);
    --radius: 16px;
    --ring: 0 0 0 4px rgba(139,92,246,0.12);
  }
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: Poppins, Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
    background:
      radial-gradient(1200px 800px at -10% -10%, #0ea5e9 0%, transparent 60%),
      radial-gradient(1400px 900px at 110% 10%, #8b5cf6 0%, transparent 55%),
      linear-gradient(180deg, var(--bg1), var(--bg2));
    color: var(--text);
  }
`;

// Subtle entrance
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// Page shell centers the card, relies on GlobalStyle for background
const Page = styled.div`
  min-height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
  padding: clamp(16px, 3vw, 32px);
`;

// Glass card using your palette
const Card = styled.div`
  width: min(92vw, 460px);
  background: var(--card-glass);
  margin-top: 260px;
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  border: 1px solid var(--card-border);
  border-radius: clamp(14px, 2vw, 20px);
  box-shadow: var(--shadow);
  padding: clamp(18px, 3.5vw, 28px);
  animation: ${fadeIn} 0.35s ease both;
`;

// Typography
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

// Form layout
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

// Inputs with full width, accessible focus, mobile height
const Input = styled.input`
  width: 100%;
  height: clamp(48px, 6.5vh, 52px);
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 0 44px 0 14px;
  background: #fff;
  font-size: 15px;
  color: #0f172a;
  transition: 0.2s ease;
  &::placeholder { color: #9ca3af; }
  &:focus {
    outline: none;
    border-color: var(--primary-2);
    box-shadow: var(--ring);
  }
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

// Primary submit with gradient in your brand hues
const Submit = styled.button`
  height: clamp(48px, 6.5vh, 52px);
  border: 0;
  border-radius: 12px;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  background-image: linear-gradient(135deg, var(--primary-2) 0%, #ec4899 100%);
  box-shadow: 0 10px 24px rgba(139, 92, 246, 0.22);
  transition: transform 0.15s ease, filter 0.2s ease, box-shadow 0.2s ease;
  &:hover { transform: translateY(-1px); filter: brightness(1.02); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

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
      if (data.company_id) {
        localStorage.setItem("company_id", data.company_id);
      }
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
    <>
      <GlobalStyle />
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
    </>
  );
};

export default Login;
