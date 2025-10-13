// src/Components/Sidebar.js
import React, { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HouseDoor,
  People,
  Box,
  ClipboardData,
  Send,
  List,
  X,
  EyeFill,
  CheckCircle,
  FileEarmarkMedical,
  PersonLinesFill,
} from "react-bootstrap-icons";

/* ========== Styled Components ========== */

const SidebarContainer = styled.div`
  width: fit-content;
  min-width: 240px;
  max-width: 320px;
  min-height: 100vh;
  height: auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px 15px;
  padding-bottom: 30px;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  z-index: 1000;
  transition: transform 0.3s ease;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); }
  &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 4px; }
  &::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.5); }

  @media (max-width: 1024px) {
    min-width: 220px;
    max-width: 280px;
    padding: 20px 12px;
  }
  @media (max-width: 768px) {
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    min-width: 260px;
    max-width: 300px;
    padding: 20px 15px;
  }
  @media (max-width: 480px) {
    width: 85vw;
    min-width: unset;
    max-width: 320px;
    padding: 20px 15px;
    padding-bottom: 30px;
  }
  @media (max-width: 360px) {
    width: 90vw;
    max-width: 280px;
    padding: 20px 12px;
  }
`;

const Overlay = styled.div`
  display: none;
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  }
`;

const MobileToggle = styled.button`
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  transition: all 0.3s ease;

  &:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }

  @media (max-width: 768px) { display: block; }
  @media (max-width: 360px) { top: 15px; left: 15px; padding: 8px; }
`;

const CloseButton = styled.button`
  display: none;
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background 0.3s ease;

  &:hover { background: rgba(255, 255, 255, 0.2); }

  @media (max-width: 768px) { display: block; }
  @media (max-width: 360px) { top: 12px; right: 12px; font-size: 18px; }
`;

const Logo = styled.h2`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: white;
  white-space: nowrap;

  @media (max-width: 768px) { margin-top: 40px; }
  @media (max-width: 480px) { font-size: 18px; margin-bottom: 25px; margin-top: 35px; }
  @media (max-width: 360px) { font-size: 16px; margin-bottom: 20px; }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  width: 100%;
`;

const NavItem = styled.li`
  margin: 15px 0;
  width: 100%;

  @media (max-width: 768px) { margin: 12px 0; }
  @media (max-width: 360px) { margin: 10px 0; }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${({ active }) => (active ? "#ffffff" : "rgba(255, 255, 255, 0.8)")};
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: ${({ active }) => (active ? "rgba(255, 255, 255, 0.2)" : "transparent")};
  white-space: nowrap;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    transform: translateX(5px);
  }

  @media (max-width: 1024px) { font-size: 14px; padding: 10px 12px; gap: 10px; }
  @media (max-width: 768px) {
    padding: 12px 15px; font-size: 15px; gap: 12px;
    &:hover { transform: translateX(8px); }
  }
  @media (max-width: 480px) { padding: 12px; font-size: 14px; gap: 10px; }
  @media (max-width: 360px) { padding: 10px; font-size: 13px; gap: 8px; }
`;

const IconWrapper = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 1024px) { font-size: 17px; }
  @media (max-width: 480px) { font-size: 18px; }
  @media (max-width: 360px) { font-size: 16px; }
`;

const LabelText = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 360px) { max-width: 180px; }
`;

const Footer = styled.div`
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const LogoutButton = styled.button`
  width: 100%;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateX(5px);
  }
`;

/* ========== Component ========== */

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Compute hidden flag but do not return yet (keep hooks unconditionally called)
  const hiddenRoutes = ["/"];
  const isHidden = hiddenRoutes.includes(location.pathname);

  // Read role saved at login
  const role = (localStorage.getItem("role") || "").trim();

  // Define all links once
  const allLinks = useMemo(() => ([
    { path: "/Dashboard", label: "Dashboard", icon: <HouseDoor /> },
    { path: "/EmployeeRegistration", label: "Employee Registration", icon: <PersonLinesFill /> },
    { path: "/SampleCollection", label: "Sample Collection", icon: <ClipboardData /> },
    { path: "/SampleTransfer", label: "Sample Transfer", icon: <Send /> },
    { path: "/BatchGeneration", label: "Batch Generation", icon: <Box /> },
    { path: "/Investigation", label: "Investigation", icon: <FileEarmarkMedical /> },
    { path: "/DoctorApprovalInvestigations", label: "Doctor Approval Investigations", icon: <CheckCircle /> },
    { path: "/DoctorApprovalOphthalmology", label: "Doctor Approval Ophthalmology", icon: <CheckCircle /> },
    { path: "/OphthalmologyForm", label: "Ophthalmology", icon: <EyeFill /> },
    { path: "/RegisteredEmployees", label: "Employee List", icon: <People /> },
    { path: "/CHCReport", label: "CHC Report", icon: <People /> },
  ]), []);

  // Filter by role
const filteredLinks = useMemo(() => {
  if (role === "Company") {
    const allowed = new Set(["/Dashboard", "/CHCReport"]);
    return allLinks.filter(l => allowed.has(l.path));
  }
  if (role === "Admin") {
    const exclude = new Set(["/Dashboard", "/CHCReport"]);
    return allLinks.filter(l => !exclude.has(l.path));
  }
  return [];
}, [role, allLinks]);


  const toggleSidebar = () => setIsOpen(o => !o);
  const closeSidebar = () => setIsOpen(false);

  const handleLogout = () => {
    // Remove only what this app set; add keys as needed (e.g., tokens)
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    closeSidebar();
    navigate("/", { replace: true });
  };

  if (isHidden) {
    return null;
  }

  return (
    <>
      <MobileToggle onClick={toggleSidebar}>
        <List size={20} />
      </MobileToggle>

      <Overlay isOpen={isOpen} onClick={closeSidebar} />

      <SidebarContainer isOpen={isOpen}>
        <CloseButton onClick={closeSidebar}>
          <X size={20} />
        </CloseButton>

        <Logo>CHC Admin</Logo>

        <NavList>
          {filteredLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavItem key={link.path}>
                <StyledLink
                  to={link.path}
                  active={isActive ? 1 : 0}
                  onClick={closeSidebar}
                >
                  <IconWrapper>{link.icon}</IconWrapper>
                  <LabelText>{link.label}</LabelText>
                </StyledLink>
              </NavItem>
            );
          })}
        </NavList>

        <Footer>
          <LogoutButton type="button" onClick={handleLogout}>
            <IconWrapper><X size={18} /></IconWrapper>
            <LabelText>Logout</LabelText>
          </LogoutButton>
        </Footer>
      </SidebarContainer>
    </>
  );
}
