// App.js
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import SampleCollection from "./Components/SampleCollection";
import SampleTransfer from "./Components/SampleTransfer";
import BatchGeneration from "./Components/BatchGeneration";
import GeneratedBatch from "./Components/GeneratedBatch";
import EmployeeRegistration from "./Components/EmployeeRegistration";
import RegistrationEdition from "./Components/RegistrationEdition";
import PackageCreation from "./Components/PackageCreation";
import Sidebar from "./Components/Sidebar";
import styled from "styled-components";
import Investigation from "./Components/Investigation";
import RegisteredEmployees from "./Components/RegisteredEmployees";
import DoctorApprovalInvestigations from "./Components/DoctorApprovalInvestigations";
import DoctorApprovalOphthalmology from "./Components/DoctorApprovalOphthalmology";
import Dashboard from "./Components/Dashboard";
import Register from "./Components/Register";
import Login from "./Components/Login";
import CHCReport from "./Components/CHCReport";
import OffsitePatients from "./Components/OffsitePatients";
import CreditToPaid from "./Components/CreditToPaid";
import PaymentReport from "./Components/PaymentReport";
import InvestigationChecklist from "./Components/InvestigationChecklist";


// Content now accepts a flag to control the left margin
const Content = styled.div`
  // margin-left: ${({ hasSidebar }) => (hasSidebar ? "240px" : "0")};
  padding: 20px;
  transition: margin-left 0.25s ease;
`;

// Inner app that can use useLocation (inside Router)
function AppInner() {
  const location = useLocation();
  // Hide sidebar on these paths
  const HIDDEN_SIDEBAR_ROUTES = ["/"];
  const showSidebar = !HIDDEN_SIDEBAR_ROUTES.includes(location.pathname);

  return (
    <>
      {showSidebar && <Sidebar />}
      <Content hasSidebar={showSidebar}>
        <Routes>
          <Route path="/EmployeeRegistration" element={<EmployeeRegistration />} />
          <Route path="/RegistrationEdition" element={<RegistrationEdition />} />
          <Route path="/PackageCreation" element={<PackageCreation />} />
          <Route path="/SampleCollection" element={<SampleCollection />} />
          <Route path="/SampleTransfer" element={<SampleTransfer />} />
          <Route path="/BatchGeneration" element={<BatchGeneration />} />
          <Route path="/GeneratedBatch" element={<GeneratedBatch />} />
          <Route path="/Investigation" element={<Investigation />} />
          <Route path="/RegisteredEmployees" element={<RegisteredEmployees />} />
          <Route path="/DoctorApprovalInvestigations" element={<DoctorApprovalInvestigations />} />
          <Route path="/DoctorApprovalOphthalmology" element={<DoctorApprovalOphthalmology />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/CHCReport" element={<CHCReport />} />
          <Route path="/OffsitePatients" element={<OffsitePatients />} />
          <Route path="/CreditToPaid" element={<CreditToPaid />} />
          <Route path="/PaymentReport" element={<PaymentReport />} />
          <Route path="/InvestigationChecklist" element={<InvestigationChecklist />} />

          <Route path="/" element={<Login />} />


        </Routes>
      </Content>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}
