import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import styled, { ThemeProvider, createGlobalStyle, keyframes } from "styled-components";
import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import {
  FileSpreadsheet,
  Search,
  Calendar,
  User,
  Barcode,
  CheckCircle2,
  Users,
  Briefcase,
  TrendingUp,
  RefreshCw,
  LayoutDashboard,
  FileText,
  DollarSign,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Printer,
  Moon,
  Sun
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

/* ============ Animations ============ */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

/* ============ Theme Setup ============ */
const lightTheme = {
  mode: "light",
  colors: {
    bg: "#f3f4f6",
    gradientFrom: "#ebf4ff",
    gradientTo: "#fbf2ff",
    card: "rgba(255, 255, 255, 0.85)",
    cardBorder: "rgba(226, 232, 240, 0.8)",
    text: "#1f2937",
    subtext: "#6b7280",
    primary: "#3F72AF",
    secondary: "#06b6d4",
    accent: "#ec4899",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    grid: "#e5e7eb",
    shadow: "rgba(63, 114, 175, 0.05)"
  },
  blur: "16px",
  boxShadow: "0 10px 30px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)"
};

const darkTheme = {
  mode: "dark",
  colors: {
    bg: "#0b0f19",
    gradientFrom: "#0f172a",
    gradientTo: "#020617",
    card: "rgba(30, 41, 59, 0.7)",
    cardBorder: "rgba(255, 255, 255, 0.08)",
    text: "#f3f4f6",
    subtext: "#9ca3af",
    primary: "#3F72AF",
    secondary: "#22d3ee",
    accent: "#f472b6",
    success: "#34d399",
    warning: "#fbbf24",
    danger: "#f87171",
    grid: "rgba(255, 255, 255, 0.06)",
    shadow: "rgba(0, 0, 0, 0.3)"
  },
  blur: "20px",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)"
};

const GlobalStyles = createGlobalStyle`
  :root { color-scheme: ${({ theme }) => theme.mode}; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.gradientFrom} 0%, ${({ theme }) => theme.colors.gradientTo} 100%);
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Poppins', 'Inter', system-ui, -apple-system, sans-serif;
    transition: background 0.3s ease, color 0.3s ease;
  }
`;

/* ============ Styled Components ============ */
const PageContainer = styled.div`
  padding: 24px;
  margin-left: 260px;
  min-height: 100vh;
  animation: ${fadeIn} 0.4s ease-out;

  @media (max-width: 1024px) {
    margin-left: 240px;
    padding: 20px;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 16px;
    margin-top: 50px;
  }
`;

const HeaderCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  backdrop-filter: blur(${({ theme }) => theme.blur});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.blur});
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 20px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
`;

const HeaderTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderIcon = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 14px;
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 16px rgba(17, 45, 78, 0.2);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.subtext};
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ThemeToggleBtn = styled.button`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  color: ${({ theme }) => theme.colors.text};
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.boxShadow};
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TabButtonGroup = styled.div`
  background: rgba(0, 0, 0, 0.05);
  padding: 4px;
  border-radius: 12px;
  display: flex;
  gap: 4px;
`;

const TabButton = styled.button`
  background: ${({ active, theme }) => active ? theme.colors.card : "transparent"};
  border: none;
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.subtext};
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: ${({ active, theme }) => active ? theme.boxShadow : "none"};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

/* ============ Metrics ============ */
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const MetricCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  backdrop-filter: blur(${({ theme }) => theme.blur});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.blur});
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 18px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${({ accent, theme }) => accent || theme.colors.primary};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const MetricIconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ bg }) => bg || "rgba(99, 102, 241, 0.1)"};
  color: ${({ color }) => color || "#6366f1"};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MetricContent = styled.div`
  flex: 1;
`;

const MetricLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.subtext};
`;

const MetricValue = styled.div`
  font-size: 26px;
  font-weight: 700;
  margin-top: 2px;
`;

/* ============ Filters ============ */
const FilterCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  backdrop-filter: blur(${({ theme }) => theme.blur});
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 20px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  margin-bottom: 24px;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: flex-end;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FilterLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.subtext};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.subtext};
    pointer-events: none;
  }
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 36px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background: rgba(0, 0, 0, 0.02);
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  font-size: 13.5px;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background: rgba(0, 0, 0, 0.02);
  color: ${({ theme }) => theme.colors.text};
  outline: none;
  font-size: 13.5px;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s ease;
  border: none;
`;

const PrimaryBtn = styled(Button)`
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(17, 45, 78, 0.2);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(17, 45, 78, 0.3);
  }
`;

const SecondaryBtn = styled(Button)`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.boxShadow};

  &:hover {
    border-color: ${({ theme }) => theme.colors.text};
  }
`;

/* ============ Dashboard Grid ============ */
const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  backdrop-filter: blur(${({ theme }) => theme.blur});
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 20px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px;
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.subtext};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13.5px;
`;

const Th = styled.th`
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
  padding: 14px 16px;
  font-weight: 600;
  color: #ffffff;
  border-bottom: 2px solid rgba(255, 255, 255, 0.12);
  font-size: 13px;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  
  &:first-child {
    border-top-left-radius: 8px;
  }
  &:last-child {
    border-top-right-radius: 8px;
  }
`;

const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  white-space: nowrap;
  font-size: 13.5px;
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  background: ${({ bg }) => bg};
  color: ${({ color }) => color};
`;

/* ============ Report View ============ */
const MainCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  backdrop-filter: blur(${({ theme }) => theme.blur});
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 20px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  margin-bottom: 24px;
`;

const TableActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
`;

const TableSummaryText = styled.div`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.subtext};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ReportTableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.cardBorder};
    border-radius: 10px;
  }
`;

const ClickableRow = styled.tr`
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(37, 99, 235, 0.05);
  }
`;

/* ============ Pagination ============ */
const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 10px;
`;

const PageInfo = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.subtext};
`;

const PageControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PageBtn = styled.button`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  color: ${({ theme }) => theme.colors.text};
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(99, 102, 241, 0.05);
  }
`;

/* ============ Detail Modal ============ */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.card};
  backdrop-filter: blur(25px);
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 24px;
  width: min(92vw, 700px);
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.boxShadow};
  animation: ${fadeIn} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 24px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding-bottom: 16px;
`;

const CloseBtn = styled.button`
  background: rgba(0, 0, 0, 0.04);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const GridDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const DetailField = styled.div`
  background: rgba(0, 0, 0, 0.01);
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 12px 14px;
  border-radius: 12px;
`;

const DetailLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.subtext};
  margin-bottom: 4px;
`;

const DetailValue = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const SectionHeader = styled.h4`
  margin: 0 0 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  padding-left: 8px;
`;

const GlassBox = styled.div`
  background: rgba(99, 102, 241, 0.03);
  border: 1px dashed rgba(99, 102, 241, 0.2);
  padding: 16px;
  border-radius: 14px;
  margin-bottom: 24px;
  font-size: 13.5px;
  line-height: 1.5;
`;

/* ============ Glass Loader ============ */
const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 16px;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(99, 102, 241, 0.1);
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

/* ============ Export Helper ============ */
const exportToCSV = (data, filename = "overall-approvals.csv") => {
  if (!data || data.length === 0) return;
  const headers = [
    "Approved Date",
    "Barcode",
    "Employee ID",
    "Employee Name",
    "Gender",
    "Age",
    "Department",
    "Company Name",
    "Approved By",
    // "Designation",
    "Impression",
    "Remarks",
    "Amount (INR)"
  ];

  const csvRows = [
    headers.join(","),
    ...data.map(item => [
      `"${item.approved_date || ""}"`,
      `"${item.barcode || ""}"`,
      `"${item.employee_id || ""}"`,
      `"${(item.employee_name || "").replace(/"/g, '""')}"`,
      `"${item.gender || ""}"`,
      `"${item.age || ""}"`,
      `"${(item.department || "").replace(/"/g, '""')}"`,
      `"${(item.company_name || "").replace(/"/g, '""')}"`,
      `"${(item.approved_by_name || "").replace(/"/g, '""')}"`,
    //   `"${(item.approved_by_designation || "").replace(/"/g, '""')}"`,
      `"${(item.impression || "").replace(/"/g, '""')}"`,
      `"${(item.remarks || "").replace(/"/g, '""')}"`,
      item.net_amount || 0
    ].join(","))
  ];

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

/* ============ Component Main ============ */
export default function OverAllApproveReport() {
  const [themeName, setThemeName] = useState("light");
  const [activeTab, setActiveTab] = useState("report");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    total_approved: 0,
    by_doctor: [],
    by_company: [],
    trend: []
  });
  const [reportData, setReportData] = useState([]);
  const [companies, setCompanies] = useState([]);
  
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Filters
  const [fromDate, setFromDate] = useState(getTodayString());
  const [toDate, setToDate] = useState(getTodayString());
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Detail Modal
  const [selectedItem, setSelectedItem] = useState(null);

  const theme = themeName === "light" ? lightTheme : darkTheme;
  const base_url = process.env.REACT_APP_BACKEND_LAB_BASE_URL || "http://localhost:8000/";

  // Retrieve base API url
  const getBaseUrl = () => {
    let url = base_url;
    if (!url.endsWith("/")) {
      url += "/";
    }
    return url;
  };

  // Fetch Companies
  const fetchCompanies = async () => {
    try {
      const url = `${getBaseUrl()}companies/`;
      const res = await axios.get(url);
      setCompanies(res.data || []);
    } catch (e) {
      console.error("Failed to fetch companies:", e);
    }
  };

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const formattedFrom = fromDate || "";
      const formattedTo = toDate || "";

      // Build query string
      const params = {
        from_date: formattedFrom,
        to_date: formattedTo,
        company_id: selectedCompany,
        doctor_id: selectedDoctor,
        search: search
      };

      const [dashRes, repRes] = await Promise.all([
        axios.get(`${getBaseUrl()}get_approval_dashboard/`, { params }),
        axios.get(`${getBaseUrl()}get_approval_report/`, { params })
      ]);

      setDashboardData(dashRes.data || { total_approved: 0, by_doctor: [], by_company: [], trend: [] });
      if (repRes.data && repRes.data.status === "success") {
        setReportData(repRes.data.data || []);
      }
    } catch (e) {
      console.error("Error loading approvals:", e);
      toast.error("Failed to load approval reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchData();
    setCurrentPage(1);
  }, [fromDate, toDate, selectedCompany, selectedDoctor]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    const today = getTodayString();
    setFromDate(today);
    setToDate(today);
    setSelectedCompany("");
    setSelectedDoctor("");
    setSearch("");
  };

  // Unique Doctors extracted from dashboard list to populate dropdown
  const uniqueDoctors = useMemo(() => {
    return dashboardData.by_doctor || [];
  }, [dashboardData.by_doctor]);

  // Pagination processing
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return reportData.slice(start, start + itemsPerPage);
  }, [reportData, currentPage]);

  const totalPages = Math.ceil(reportData.length / itemsPerPage);

  const handleExport = () => {
    exportToCSV(reportData, `overall-approvals-${new Date().toISOString().split("T")[0]}.csv`);
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ToastContainer position="top-right" autoClose={2500} theme={themeName} />
      <PageContainer>
        {/* ============ Header ============ */}
        <HeaderCard>
          <HeaderTitleSection>
            <HeaderIcon>
              <UserCheck size={28} />
            </HeaderIcon>
            <div>
              <Title>OverAll Approval Analytics</Title>
              <Subtitle>Track candidates medically approved & doctors approval trends</Subtitle>
            </div>
          </HeaderTitleSection>

          <ActionGroup>
            <ThemeToggleBtn onClick={() => setThemeName(t => t === "light" ? "dark" : "light")} title="Toggle Theme">
              {themeName === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </ThemeToggleBtn>
          </ActionGroup>
        </HeaderCard>

        {/* ============ Filters ============ */}
        <FilterCard>
          <FilterGrid>
            <FilterGroup>
              <FilterLabel>
                <Calendar size={13} />
                From Date
              </FilterLabel>
              <FilterInput type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                <Calendar size={13} />
                To Date
              </FilterLabel>
              <FilterInput type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                <Briefcase size={13} />
                Company
              </FilterLabel>
              <FilterSelect value={selectedCompany} onChange={e => setSelectedCompany(e.target.value)}>
                <option value="">All Companies</option>
                {companies.map(c => (
                  <option key={c.company_id} value={c.company_id}>{c.company_name}</option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                <User size={13} />
                Approved By (Doctor)
              </FilterLabel>
              <FilterSelect value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)}>
                <option value="">All Doctors</option>
                {uniqueDoctors.map(d => (
                  <option key={d.doctor_id} value={d.doctor_id}>{d.doctor_name}</option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
              <PrimaryBtn onClick={fetchData} style={{ flex: 1, height: '40px' }}>
                <RefreshCw size={14} />
                Load Data
              </PrimaryBtn>
              <SecondaryBtn onClick={handleResetFilters} style={{ height: '40px' }} title="Reset Filters">
                <X size={15} />
              </SecondaryBtn>
            </FilterGroup>
          </FilterGrid>
        </FilterCard>

        {/* ============ Loading / Content ============ */}
        {loading ? (
          <LoaderContainer>
            <Spinner />
            <Subtitle>Fetching health approval statistics...</Subtitle>
          </LoaderContainer>
        ) : (
          <>
            {/* Display Standings Grid (Medical Officers Standings and Company Contribution) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <ChartCard>
                <ChartTitle>
                  <Users size={16} />
                  Medical Officers Approval Standings
                </ChartTitle>
                <TableContainer>
                  <StyledTable>
                    <thead>
                      <tr>
                        <Th style={{ fontSize: "12px", padding: "10px 12px" }}>Employee ID</Th>
                        <Th style={{ fontSize: "12px", padding: "10px 12px" }}>Doctor Name</Th>
                        <Th style={{ fontSize: "12px", padding: "10px 12px" }}>Department</Th>
                        <Th style={{ fontSize: "12px", padding: "10px 12px", textAlign: "right" }}>Approved</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.by_doctor.length > 0 ? (
                        dashboardData.by_doctor.map(doc => (
                          <tr key={doc.doctor_id}>
                            <Td style={{ fontSize: "13px", padding: "10px 12px", fontWeight: 600 }}>{doc.doctor_id}</Td>
                            <Td style={{ fontSize: "13px", padding: "10px 12px" }}>{doc.doctor_name}</Td>
                            <Td style={{ fontSize: "13px", padding: "10px 12px" }}>{doc.department || "-"}</Td>
                            <Td style={{ fontSize: "13px", padding: "10px 12px", textAlign: "right", fontWeight: 700, color: theme.colors.primary }}>{doc.count}</Td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <Td colSpan="4" style={{ textAlign: "center", color: theme.colors.subtext }}>No doctor statistics available</Td>
                        </tr>
                      )}
                    </tbody>
                  </StyledTable>
                </TableContainer>
              </ChartCard>
              
              <ChartCard>
                <ChartTitle>
                  <Briefcase size={16} />
                  Company Approval Contribution
                </ChartTitle>
                <TableContainer>
                  <StyledTable>
                    <thead>
                      <tr>
                        <Th style={{ fontSize: "12px", padding: "10px 12px" }}>Company Name</Th>
                        <Th style={{ fontSize: "12px", padding: "10px 12px" }}>Company ID</Th>
                        <Th style={{ fontSize: "12px", padding: "10px 12px", textAlign: "right" }}>Approved</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.by_company.length > 0 ? (
                        dashboardData.by_company.map(comp => (
                          <tr key={comp.company_id}>
                            <Td style={{ fontSize: "13px", padding: "10px 12px", fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{comp.company_name}</Td>
                            <Td style={{ fontSize: "13px", padding: "10px 12px" }}>{comp.company_id}</Td>
                            <Td style={{ fontSize: "13px", padding: "10px 12px", textAlign: "right", fontWeight: 700, color: theme.colors.secondary }}>{comp.count}</Td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <Td colSpan="3" style={{ textAlign: "center", color: theme.colors.subtext }}>No company statistics available</Td>
                        </tr>
                      )}
                    </tbody>
                  </StyledTable>
                </TableContainer>
              </ChartCard>
            </div>

            {/* ============ Report Grid View ============ */}
            <MainCard>
              <TableActionRow>
                <TableSummaryText>
                  Found <strong>{reportData.length}</strong> medical approvals matching your criteria.
                </TableSummaryText>

                <ActionButtons>
                  <SecondaryBtn onClick={handleExport} disabled={reportData.length === 0}>
                    <FileSpreadsheet size={15} />
                    Export Excel
                  </SecondaryBtn>
                </ActionButtons>
              </TableActionRow>

              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <InputWrapper style={{ flex: 1 }}>
                  <Search size={16} />
                  <FilterInput 
                    placeholder="Quick search by candidate name, employee ID, or barcode..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </InputWrapper>
                <PrimaryBtn type="submit">
                  Search
                </PrimaryBtn>
              </form>

              <ReportTableWrapper>
                <StyledTable>
                  <thead>
                    <tr>
                      <Th>Approved Date</Th>
                      <Th>Barcode</Th>
                      <Th>Candidate ID</Th>
                      <Th>Candidate Name</Th>
                      <Th>Company Name</Th>
                      <Th>Medical Officer</Th>
                      <Th>Remarks</Th>
                      <Th>Medical Decision</Th>
                      <Th style={{ textAlign: 'right' }}>Billing Amount</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map(item => (
                        <ClickableRow key={item.id} onClick={() => handleRowClick(item)}>
                          <Td>{item.approved_date}</Td>
                          <Td style={{ fontWeight: 600 }}>{item.barcode}</Td>
                          <Td>{item.employee_id}</Td>
                          <Td style={{ fontWeight: 600 }}>{item.employee_name}</Td>
                          <Td>{item.company_name || "-"}</Td>
                          <Td>{item.approved_by_name}</Td>
                          <Td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.remarks || "-"}</Td>
                          <Td>
                            <Badge bg="rgba(16, 185, 129, 0.12)" color="#10b981">
                              {item.status || "approved"}
                            </Badge>
                          </Td>
                          <Td style={{ textAlign: 'right', fontWeight: 600 }}>
                            ₹{item.net_amount || 0}
                          </Td>
                        </ClickableRow>
                      ))
                    ) : (
                      <tr>
                        <Td colSpan="9" style={{ textAlign: "center", padding: "40px", color: theme.colors.subtext }}>
                          No candidate approvals found
                        </Td>
                      </tr>
                    )}
                  </tbody>
                </StyledTable>
              </ReportTableWrapper>

              {/* Pagination */}
              {totalPages > 1 && (
                <PaginationRow>
                  <PageInfo>
                    Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> (Total {reportData.length} items)
                  </PageInfo>
                  <PageControls>
                    <PageBtn onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                      <ChevronLeft size={16} />
                    </PageBtn>
                    <PageBtn onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                      <ChevronRight size={16} />
                    </PageBtn>
                  </PageControls>
                </PaginationRow>
              )}
            </MainCard>
          </>
        )}

        {/* ============ Details Modal ============ */}
        {selectedItem && (
          <ModalOverlay onClick={() => setSelectedItem(null)}>
            <ModalContainer onClick={e => e.stopPropagation()}>
              <ModalHeader>
                <div>
                  <Title style={{ fontSize: "20px" }}>Medical Approval Details</Title>
                  <Subtitle>Barcode: {selectedItem.barcode}</Subtitle>
                </div>
                <CloseBtn onClick={() => setSelectedItem(null)}>
                  <X size={18} />
                </CloseBtn>
              </ModalHeader>

              <SectionHeader>Candidate Demographics</SectionHeader>
              <GridDetails>
                <DetailField>
                  <DetailLabel>Candidate Name</DetailLabel>
                  <DetailValue>{selectedItem.employee_name}</DetailValue>
                </DetailField>
                <DetailField>
                  <DetailLabel>Employee ID</DetailLabel>
                  <DetailValue>{selectedItem.employee_id}</DetailValue>
                </DetailField>
                <DetailField>
                  <DetailLabel>Gender / Age</DetailLabel>
                  <DetailValue>{selectedItem.gender} / {selectedItem.age}</DetailValue>
                </DetailField>
                <DetailField>
                  <DetailLabel>Department</DetailLabel>
                  <DetailValue>{selectedItem.department || "-"}</DetailValue>
                </DetailField>
              </GridDetails>

              <SectionHeader>Company & Billing Details</SectionHeader>
              <GridDetails>
                <DetailField>
                  <DetailLabel>Company Name</DetailLabel>
                  <DetailValue>{selectedItem.company_name || "-"}</DetailValue>
                </DetailField>
                <DetailField>
                  <DetailLabel>Company ID</DetailLabel>
                  <DetailValue>{selectedItem.company_id || "-"}</DetailValue>
                </DetailField>
                <DetailField>
                  <DetailLabel>Barcode Reference</DetailLabel>
                  <DetailValue>{selectedItem.barcode}</DetailValue>
                </DetailField>
                <DetailField>
                  <DetailLabel>Amount Charged</DetailLabel>
                  <DetailValue>₹{selectedItem.net_amount || 0}</DetailValue>
                </DetailField>
              </GridDetails>

              <SectionHeader>Medical Officer's Assessment</SectionHeader>
              <GridDetails>
                <DetailField>
                  <DetailLabel>Approved By</DetailLabel>
                  <DetailValue>{selectedItem.approved_by_name}</DetailValue>
                </DetailField>
                <DetailField>
                  <DetailLabel>Department / Role</DetailLabel>
                  <DetailValue>{selectedItem.approved_by_department || "-"}</DetailValue>
                </DetailField>
                <DetailField>
                  <DetailLabel>Approved Date</DetailLabel>
                  <DetailValue>{selectedItem.approved_date}</DetailValue>
                </DetailField>
                <DetailField>
                  <DetailLabel>Overall Medical Status</DetailLabel>
                  <DetailValue style={{ color: theme.colors.success }}>
                    {selectedItem.status ? selectedItem.status.toUpperCase() : "APPROVED"}
                  </DetailValue>
                </DetailField>
              </GridDetails>

              <SectionHeader>Impression & Remarks</SectionHeader>
              <GlassBox style={{ color: theme.colors.text }}>
                <strong>Impression:</strong> {selectedItem.impression || "No findings recorded"}
                <br />
                <br />
                <strong>Remarks:</strong> {selectedItem.remarks || "No comments recorded"}
              </GlassBox>

              {/* <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <SecondaryBtn onClick={() => window.print()} style={{ gap: "8px" }}>
                  <Printer size={16} />
                  Print Details
                </SecondaryBtn> 
              </div> */}
            </ModalContainer>
          </ModalOverlay>
        )}
      </PageContainer>
    </ThemeProvider>
  );
}
