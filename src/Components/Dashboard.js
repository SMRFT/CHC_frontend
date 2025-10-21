import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

/* ============ Theme & Global Styles ============ */
const lightTheme = {
  mode: "light",
  colors: {
    bg: "#f7f7fb",
    gradientFrom: "#e9ecff",
    gradientTo: "#f7e9ff",
    card: "rgba(255,255,255,0.7)",
    cardBorder: "rgba(140, 140, 155, 0.25)",
    text: "#0f172a",
    subtext: "#475569",
    primary: "#7c5cff",
    secondary: "#22d3ee",
    accent: "#f472b6",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
    grid: "#e5e7eb",
  },
  blur: "14px",
  shadow: "0 8px 30px rgba(31, 38, 135, 0.15)"
};

const darkTheme = {
  mode: "dark",
  colors: {
    bg: "#0b1220",
    gradientFrom: "#0b1220",
    gradientTo: "#151b2f",
    card: "rgba(255,255,255,0.06)",
    cardBorder: "rgba(255,255,255,0.12)",
    text: "#e6e6e6",
    subtext: "#a3b1c6",
    primary: "#7c5cff",
    secondary: "#22d3ee",
    accent: "#f472b6",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
    grid: "rgba(255,255,255,0.08)",
  },
  blur: "16px",
  shadow: "0 10px 40px rgba(0, 0, 0, 0.35)"
};

const Global = createGlobalStyle`
  :root { color-scheme: ${({ theme }) => theme.mode}; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.gradientFrom} 0%, ${({ theme }) => theme.colors.gradientTo} 100%);
    color: ${({ theme }) => theme.colors.text};
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji";
  }
`;

/* ============ Styled Components ============ */
const DashboardContainer = styled.div`
  padding: 28px;
  margin-left: 60px;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: ${({ theme }) => theme.colors.card};
  backdrop-filter: blur(${({ theme }) => theme.blur});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.blur});
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 20px 24px;
  border-radius: 18px;
  margin-bottom: 26px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  letter-spacing: 0.2px;
`;

const Subtitle = styled.p`
  margin: 6px 0 0 0;
  color: ${({ theme }) => theme.colors.subtext};
`;

const RightHeader = styled.div`
  display: flex;
  gap: 12px;
`;

const Toggle = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  backdrop-filter: blur(${({ theme }) => theme.blur});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.blur});
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.25);
  }
`;

const ExportButton = styled(Toggle)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  border: none;
  font-weight: 600;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 18px;
  margin-bottom: 22px;
`;

const MetricCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  backdrop-filter: blur(${({ theme }) => theme.blur}) saturate(140%);
  -webkit-backdrop-filter: blur(${({ theme }) => theme.blur}) saturate(140%);
  padding: 18px;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: transform .25s ease;
  &:hover { transform: translateY(-4px); }
`;

const MetricTitle = styled.div`
  color: ${({ theme }) => theme.colors.subtext};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.1px;
  margin-bottom: 10px;
`;

const MetricValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: ${({ color, theme }) => color || theme.colors.primary};
  line-height: 1;
  margin-bottom: 6px;
`;

const MetricSubtext = styled.div`
  color: ${({ theme }) => theme.colors.subtext};
  font-size: 13px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 22px;
`;

const FilterSelect = styled.select`
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 12px;
  padding: 10px 12px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(460px, 1fr));
  gap: 18px;
  margin-bottom: 22px;
`;

const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  backdrop-filter: blur(${({ theme }) => theme.blur});
  -webkit-backdrop-filter: blur(${({ theme }) => theme.blur});
  border-radius: 18px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const ChartTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.subtext};
  letter-spacing: 0.3px;
`;

const TableContainer = styled(ChartCard)`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td { padding: 12px; }
  thead th {
    background: linear-gradient(135deg, rgba(124,92,255,0.25), rgba(34,211,238,0.25));
    color: ${({ theme }) => theme.colors.text};
    text-align: left;
    font-weight: 700;
    border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  }
  tbody td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  color: #fff;
  background: ${({ status, theme }) =>
    status === "Normal" ? theme.colors.success :
    status === "Risk" ? theme.colors.warning :
    theme.colors.danger };
`;

/* ============ Utilities ============ */
const calculateBMI = (weight, height) => {
  if (!weight || !height) return 0;
  const h = Number(height) / 100;
  return Number((Number(weight) / (h*h)).toFixed(2));
};

const getBMIStatus = (bmi) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

const getBloodPressureStatus = (bp) => {
  if (!bp) return "Unknown";
  const [s,d] = String(bp).split("/").map(v => parseInt(v,10));
  if (s < 120 && d < 80) return "Normal";
  if (s < 140 && d < 90) return "Risk";
  return "High Risk";
};

const getAgeGroup = (age) => {
  if (age < 25) return "18-24";
  if (age < 35) return "25-34";
  if (age < 45) return "35-44";
  if (age < 55) return "45-54";
  return "55+";
};

// Categorize audiometry notes
const categorizeAudiometry = (notes) => {
  if (!notes) return "Unknown";
  const lowerNotes = notes.toLowerCase();
  if (lowerNotes.includes("normal study") || (lowerNotes.includes("normal") && !lowerNotes.includes("abnormal"))) {
    return "Normal Study";
  }
  return "Abnormal";
};

// Categorize PFT notes
const categorizePFT = (notes) => {
  if (!notes) return "Unknown";
  const lowerNotes = notes.toLowerCase();
  
  if (lowerNotes.includes("normal study") || lowerNotes.includes("normal")) return "Normal Study";
  if (lowerNotes.includes("severe obstructive") || lowerNotes.includes("very severe")) return "Severe Obstructive";
  if (lowerNotes.includes("moderate obstructive")) return "Moderate Obstructive";
  if (lowerNotes.includes("mild obstructive")) return "Mild Obstructive";
  if (lowerNotes.includes("obstructive")) return "Obstructive";
  if (lowerNotes.includes("restrictive")) return "Restrictive";
  if (lowerNotes.includes("mixed")) return "Mixed";
  
  return "Other";
};

// Categorize ECG notes
const categorizeECG = (notes) => {
  if (!notes) return "Unknown";
  const lowerNotes = notes.toLowerCase();
  
  if (lowerNotes.includes("normal study") || 
      lowerNotes.includes("normal ecg") || 
      (lowerNotes.includes("normal") && !lowerNotes.includes("abnormal"))) {
    return "Normal Study";
  }
  return "Abnormal";
};

// Categorize X-ray notes
const categorizeXray = (notes) => {
  if (!notes) return "Unknown";
  const lowerNotes = notes.toLowerCase();
  
  if (lowerNotes.includes("no significant finding") || 
      lowerNotes.includes("normal study") ||
      lowerNotes.includes("normal")) {
    return "Normal Study";
  }
  return "Findings Noted";
};

/* ============ Custom Tooltip (Glass) ============ */
const GlassTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      padding: 10,
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.18)",
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      color: "white",
      boxShadow: "0 8px 30px rgba(0,0,0,.25)"
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: p.color }} />
          <span>{p.name}: <strong>{p.value}</strong></span>
        </div>
      ))}
    </div>
  );
};

/* ============ CSV Export Function ============ */
const exportToCSV = (data, filename = "health-dashboard-export.csv") => {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }

  // Define headers
  const headers = [
    "Employee ID",
    "Name",
    "Age",
    "Gender",
    "Department",
    "BMI",
    "BMI Status",
    "Blood Pressure",
    "BP Status",
    "Height (cm)",
    "Weight (kg)",
    "SpO2",
    "Audiometry Status",
    "Audiometry Notes",
    "PFT Status",
    "PFT Notes",
    "ECG Status",
    "ECG Notes",
    "X-Ray Status",
    "X-Ray Notes",
    "Patient History",
    "Overall Status",
    "Date"
  ];

  // Convert data to CSV rows
  const csvRows = [
    headers.join(","), // Header row
    ...data.map(emp => {
      const overall =
        emp.bpStatus === "Normal" && emp.bmiStatus === "Normal" ? "Normal" :
        (emp.bpStatus === "High Risk" || emp.bmiStatus === "Obese") ? "High Risk" : "Risk";
      
      // Escape quotes in text fields
      const escapeCSV = (text) => {
        if (!text) return "";
        return String(text).replace(/"/g, '""');
      };
      
      return [
        emp.employee_id || "",
        `"${escapeCSV(emp.employee_name || "N/A")}"`,
        emp.age || "",
        emp.gender || "",
        `"${escapeCSV(emp.department || "N/A")}"`,
        emp.bmi || "",
        emp.bmiStatus || "",
        emp.vitals?.blood_pressure || "",
        emp.bpStatus || "",
        emp.vitals?.height_cm || "",
        emp.vitals?.weight_kg || "",
        emp.vitals?.spo2 || "",
        emp.audiometryStatus || "",
        `"${escapeCSV(emp.audiometry_notes || "")}"`,
        emp.pftStatus || "",
        `"${escapeCSV(emp.pft_notes || "")}"`,
        emp.ecgStatus || "",
        `"${escapeCSV(emp.ecg_notes || "")}"`,
        emp.xrayStatus || "",
        `"${escapeCSV(emp.xray_notes || "")}"`,
        `"${escapeCSV(emp.patient_history || "")}"`,
        overall,
        emp.date || ""
      ].join(",");
    })
  ];

  // Create CSV string
  const csvString = csvRows.join("\n");

  // Create blob and download
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/* ============ Main Component ============ */
const HealthDashboard = () => {
  const [themeName, setThemeName] = useState("light");
  const theme = themeName === "light" ? lightTheme : darkTheme;
  
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  
  const [employees, setEmployees] = useState([]);
  const [investigations, setInvestigations] = useState([]);
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, invRes, billRes] = await Promise.all([
          axios.get(`${Labbaseurl}employees/`),
          axios.get(`${Labbaseurl}investigations/`),
          axios.get(`${Labbaseurl}billings/`),
        ]);
        setEmployees(empRes.data || []);
        setInvestigations(invRes.data || []);
        setBillings(billRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [Labbaseurl]);

  const processedData = useMemo(() => investigations.map((inv) => {
    const emp = employees.find(e => e.employee_id === inv.employee_id);
    const vitals = typeof inv.vitals === "string" ? JSON.parse(inv.vitals) : inv.vitals;
    const bmi = calculateBMI(parseFloat(vitals?.weight_kg), parseFloat(vitals?.height_cm));
    
    return {
      ...emp,
      ...inv,
      vitals,
      bmi,
      bmiStatus: getBMIStatus(bmi),
      bpStatus: getBloodPressureStatus(vitals?.blood_pressure),
      ageGroup: getAgeGroup(inv.age || emp?.age),
      audiometryStatus: categorizeAudiometry(inv.audiometry_notes),
      pftStatus: categorizePFT(inv.pft_notes),
      ecgStatus: categorizeECG(inv.ecg_notes),
      xrayStatus: categorizeXray(inv.xray_notes),
    };
  }), [investigations, employees]);

  const filteredData = processedData.filter((d) => {
    if (selectedDepartment !== "All" && d.department !== selectedDepartment) return false;
    if (selectedGender !== "All" && d.gender !== selectedGender) return false;
    if (selectedAgeGroup !== "All" && d.ageGroup !== selectedAgeGroup) return false;
    return true;
  });

  const total = filteredData.length || 1;
  
  // Existing metrics
  const normalCount = filteredData.filter(d => d.bmiStatus === "Normal" && d.bpStatus === "Normal").length;
  const riskCount = filteredData.filter(d => d.bpStatus === "Risk" || d.bmiStatus === "Overweight").length;
  const highRiskCount = filteredData.filter(d => d.bpStatus === "High Risk" || d.bmiStatus === "Obese").length;
  const normalPct = ((normalCount / total) * 100).toFixed(1);
  const riskPct = ((riskCount / total) * 100).toFixed(1);
  const highRiskPct = ((highRiskCount / total) * 100).toFixed(1);
  const avgBMI = (filteredData.reduce((s, d) => s + (d.bmi || 0), 0) / total).toFixed(2);

  // Audiometry metrics
  const normalAudiometryCount = filteredData.filter(d => d.audiometryStatus === "Normal Study").length;
  const abnormalAudiometryCount = filteredData.filter(d => d.audiometryStatus === "Abnormal").length;

  // PFT metrics
  const normalPFTCount = filteredData.filter(d => d.pftStatus === "Normal Study").length;
  const obstructivePFTCount = filteredData.filter(d => 
    d.pftStatus.includes("Obstructive") && d.pftStatus !== "Normal Study"
  ).length;

  // ECG metrics
  const normalECGCount = filteredData.filter(d => d.ecgStatus === "Normal Study").length;
  const abnormalECGCount = filteredData.filter(d => d.ecgStatus === "Abnormal").length;

  // X-ray metrics
  const normalXrayCount = filteredData.filter(d => d.xrayStatus === "Normal Study").length;
  const findingsXrayCount = filteredData.filter(d => d.xrayStatus === "Findings Noted").length;

  const departments = ["All", ...new Set(employees.map(e => e.department).filter(Boolean))];
  const ageGroups = ["All", "18-24", "25-34", "35-44", "45-54", "55+"];

  const ageDistribution = ageGroups.slice(1).map(g => ({
    name: g, count: filteredData.filter(d => d.ageGroup === g).length
  }));

  const genderDistribution = [
    { name: "Male", value: filteredData.filter(d => d.gender === "Male").length },
    { name: "Female", value: filteredData.filter(d => d.gender === "Female").length },
  ];

  const departmentDistribution = departments.slice(1).map(dept => ({
    name: dept?.substring(0, 22) || "Unknown",
    count: filteredData.filter(d => d.department === dept).length
  })).filter(d => d.count > 0).slice(0, 8);

  const bmiDistribution = [
    { name: "Underweight", value: filteredData.filter(d => d.bmiStatus === "Underweight").length },
    { name: "Normal", value: filteredData.filter(d => d.bmiStatus === "Normal").length },
    { name: "Overweight", value: filteredData.filter(d => d.bmiStatus === "Overweight").length },
    { name: "Obese", value: filteredData.filter(d => d.bmiStatus === "Obese").length },
  ];

  const bpDistribution = [
    { name: "Normal", value: filteredData.filter(d => d.bpStatus === "Normal").length },
    { name: "Risk", value: filteredData.filter(d => d.bpStatus === "Risk").length },
    { name: "High Risk", value: filteredData.filter(d => d.bpStatus === "High Risk").length },
  ];

  // Audiometry distribution
  const audiometryDistribution = [
    { name: "Normal Study", value: normalAudiometryCount },
    { name: "Abnormal", value: abnormalAudiometryCount },
  ].filter(d => d.value > 0);

  // PFT distribution
  const pftDistribution = [
    { name: "Normal Study", value: normalPFTCount },
    { name: "Mild Obstructive", value: filteredData.filter(d => d.pftStatus === "Mild Obstructive").length },
    { name: "Moderate Obstructive", value: filteredData.filter(d => d.pftStatus === "Moderate Obstructive").length },
    { name: "Severe Obstructive", value: filteredData.filter(d => d.pftStatus === "Severe Obstructive").length },
    { name: "Restrictive", value: filteredData.filter(d => d.pftStatus === "Restrictive").length },
    { name: "Mixed", value: filteredData.filter(d => d.pftStatus === "Mixed").length },
    { name: "Other", value: filteredData.filter(d => d.pftStatus === "Other").length },
  ].filter(d => d.value > 0);

  // ECG distribution
  const ecgDistribution = [
    { name: "Normal Study", value: normalECGCount },
    { name: "Abnormal", value: abnormalECGCount },
  ].filter(d => d.value > 0);

  // X-ray distribution
  const xrayDistribution = [
    { name: "Normal Study", value: normalXrayCount },
    { name: "Findings Noted", value: findingsXrayCount },
  ].filter(d => d.value > 0);

  const healthIndicators = [
    { indicator: "BMI Normal", value: (filteredData.filter(d => d.bmiStatus === "Normal").length / total) * 100 },
    { indicator: "BP Normal", value: (filteredData.filter(d => d.bpStatus === "Normal").length / total) * 100 },
    { indicator: "Audiometry Normal", value: (normalAudiometryCount / total) * 100 },
    { indicator: "PFT Normal", value: (normalPFTCount / total) * 100 },
    { indicator: "ECG Normal", value: (normalECGCount / total) * 100 },
    { indicator: "X-ray Normal", value: (normalXrayCount / total) * 100 },
  ];

  const handleExportCSV = () => {
    exportToCSV(filteredData, `health-dashboard-${new Date().toISOString().split('T')[0]}.csv`);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Global />
        <DashboardContainer>
          <Header>
            <div>
              <Title>Health Analytics Dashboard</Title>
              <Subtitle>Loading data...</Subtitle>
            </div>
          </Header>
        </DashboardContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Global />
      <DashboardContainer>
        <Header>
          <div>
            <Title>Health Analytics Dashboard</Title>
            <Subtitle>Comprehensive monitoring & risk assessment</Subtitle>
          </div>
          <RightHeader>
            <ExportButton onClick={handleExportCSV}>
              📊 Export to CSV
            </ExportButton>
            <Toggle onClick={() => setThemeName(t => t === "dark" ? "light" : "dark")}>
              {themeName === "dark" ? "☀️" : "🌙"} Toggle {themeName === "dark" ? "Light" : "Dark"}
            </Toggle>
          </RightHeader>
        </Header>

        <FilterContainer>
          <FilterSelect value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </FilterSelect>
          <FilterSelect value={selectedGender} onChange={e => setSelectedGender(e.target.value)}>
            <option>All</option><option>Male</option><option>Female</option>
          </FilterSelect>
          <FilterSelect value={selectedAgeGroup} onChange={e => setSelectedAgeGroup(e.target.value)}>
            {ageGroups.map(g => <option key={g} value={g}>{g}</option>)}
          </FilterSelect>
        </FilterContainer>

        <MetricsGrid>
          <MetricCard>
            <MetricTitle>Total Employees</MetricTitle>
            <MetricValue color={theme.colors.primary}>{filteredData.length}</MetricValue>
            <MetricSubtext>Active health records</MetricSubtext>
          </MetricCard>
          <MetricCard>
            <MetricTitle>Normal Health</MetricTitle>
            <MetricValue color={theme.colors.success}>{normalPct}%</MetricValue>
            <MetricSubtext>{normalCount} employees</MetricSubtext>
          </MetricCard>
          <MetricCard>
            <MetricTitle>At Risk</MetricTitle>
            <MetricValue color={theme.colors.warning}>{riskPct}%</MetricValue>
            <MetricSubtext>{riskCount} employees</MetricSubtext>
          </MetricCard>
          <MetricCard>
            <MetricTitle>High Risk</MetricTitle>
            <MetricValue color={theme.colors.danger}>{highRiskPct}%</MetricValue>
            <MetricSubtext>{highRiskCount} employees</MetricSubtext>
          </MetricCard>
          <MetricCard>
            <MetricTitle>Average BMI</MetricTitle>
            <MetricValue color={theme.colors.accent}>{avgBMI}</MetricValue>
            <MetricSubtext>{avgBMI < 25 ? "Healthy" : "Needs attention"}</MetricSubtext>
          </MetricCard>
          <MetricCard>
            <MetricTitle>Audiometry - Normal</MetricTitle>
            <MetricValue color={theme.colors.success}>{normalAudiometryCount}</MetricValue>
            <MetricSubtext>{abnormalAudiometryCount} abnormal cases</MetricSubtext>
          </MetricCard>
          <MetricCard>
            <MetricTitle>PFT - Normal</MetricTitle>
            <MetricValue color={theme.colors.success}>{normalPFTCount}</MetricValue>
            <MetricSubtext>{obstructivePFTCount} obstructive cases</MetricSubtext>
          </MetricCard>
          <MetricCard>
            <MetricTitle>ECG - Normal</MetricTitle>
            <MetricValue color={theme.colors.success}>{normalECGCount}</MetricValue>
            <MetricSubtext>{abnormalECGCount} abnormal cases</MetricSubtext>
          </MetricCard>
          <MetricCard>
            <MetricTitle>X-Ray - Normal</MetricTitle>
            <MetricValue color={theme.colors.success}>{normalXrayCount}</MetricValue>
            <MetricSubtext>{findingsXrayCount} with findings</MetricSubtext>
          </MetricCard>
        </MetricsGrid>

        <ChartsGrid>
          <ChartCard>
            <ChartTitle>Age Distribution</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageDistribution}>
                <defs>
                  <linearGradient id="barAge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.colors.secondary} />
                    <stop offset="100%" stopColor={theme.colors.primary} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={theme.colors.grid} />
                <XAxis dataKey="name" stroke={theme.colors.subtext} />
                <YAxis stroke={theme.colors.subtext} />
                <Tooltip content={<GlassTooltip />} />
                <Bar dataKey="count" fill="url(#barAge)" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Gender Distribution</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={genderDistribution} dataKey="value" cx="50%" cy="50%" outerRadius={100}
                     labelLine={false}
                     label={({ name, percent }) => `${name}: ${(percent*100).toFixed(0)}%`}>
                  {genderDistribution.map((_, i) => (
                    <Cell key={i} fill={[theme.colors.primary, theme.colors.secondary][i % 2]} />
                  ))}
                </Pie>
                <Tooltip content={<GlassTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Top Departments</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentDistribution} layout="vertical">
                <defs>
                  <linearGradient id="barDept" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={theme.colors.accent} />
                    <stop offset="100%" stopColor={theme.colors.primary} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={theme.colors.grid} />
                <XAxis type="number" stroke={theme.colors.subtext} />
                <YAxis dataKey="name" type="category" width={160} stroke={theme.colors.subtext} />
                <Tooltip content={<GlassTooltip />} />
                <Bar dataKey="count" fill="url(#barDept)" radius={[8,8,8,8]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>BMI Category Distribution</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={bmiDistribution} dataKey="value" cx="50%" cy="50%" outerRadius={104} innerRadius={60}
                     labelLine={false}
                     label={({ name, percent }) => `${name}: ${(percent*100).toFixed(0)}%`}>
                  {bmiDistribution.map((_, i) => (
                    <Cell key={i} fill={[theme.colors.secondary, theme.colors.success, theme.colors.warning, theme.colors.danger][i % 4]} />
                  ))}
                </Pie>
                <Tooltip content={<GlassTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Blood Pressure Status</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bpDistribution}>
                <CartesianGrid stroke={theme.colors.grid} />
                <XAxis dataKey="name" stroke={theme.colors.subtext} />
                <YAxis stroke={theme.colors.subtext} />
                <Tooltip content={<GlassTooltip />} />
                <Bar dataKey="value" fill={theme.colors.accent} radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Audiometry Test Results</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={audiometryDistribution} dataKey="value" cx="50%" cy="50%" outerRadius={100}
                     labelLine={false}
                     label={({ name, value, percent }) => `${name}: ${value} (${(percent*100).toFixed(0)}%)`}>
                  {audiometryDistribution.map((entry, i) => (
                    <Cell key={i} fill={
                      entry.name === "Normal Study" ? theme.colors.success :
                      theme.colors.danger
                    } />
                  ))}
                </Pie>
                <Tooltip content={<GlassTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>PFT (Pulmonary Function Test) Results</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pftDistribution}>
                <defs>
                  <linearGradient id="barPFT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.colors.primary} />
                    <stop offset="100%" stopColor={theme.colors.accent} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={theme.colors.grid} />
                <XAxis dataKey="name" stroke={theme.colors.subtext} angle={-45} textAnchor="end" height={100} />
                <YAxis stroke={theme.colors.subtext} />
                <Tooltip content={<GlassTooltip />} />
                <Bar dataKey="value" fill="url(#barPFT)" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>ECG Test Results</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={ecgDistribution} dataKey="value" cx="50%" cy="50%" outerRadius={100}
                     labelLine={false}
                     label={({ name, value, percent }) => `${name}: ${value} (${(percent*100).toFixed(0)}%)`}>
                  {ecgDistribution.map((entry, i) => (
                    <Cell key={i} fill={
                      entry.name === "Normal Study" ? theme.colors.success :
                      theme.colors.danger
                    } />
                  ))}
                </Pie>
                <Tooltip content={<GlassTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Chest X-Ray Results</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={xrayDistribution} dataKey="value" cx="50%" cy="50%" outerRadius={100}
                     labelLine={false}
                     label={({ name, value, percent }) => `${name}: ${value} (${(percent*100).toFixed(0)}%)`}>
                  {xrayDistribution.map((entry, i) => (
                    <Cell key={i} fill={
                      entry.name === "Normal Study" ? theme.colors.success :
                      theme.colors.warning
                    } />
                  ))}
                </Pie>
                <Tooltip content={<GlassTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Health Indicators Overview</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={healthIndicators}>
                <PolarGrid stroke={theme.colors.grid} />
                <PolarAngleAxis dataKey="indicator" stroke={theme.colors.subtext} />
                <PolarRadiusAxis angle={90} domain={[0,100]} stroke={theme.colors.subtext} />
                <Radar name="Health %" dataKey="value" stroke={theme.colors.secondary} fill={theme.colors.secondary} fillOpacity={0.6} />
                <Tooltip content={<GlassTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </ChartsGrid>

        <TableContainer>
          <ChartTitle>Employee Health Details (Top 20)</ChartTitle>
          <Table>
            <thead>
              <tr>
                <th>Employee ID</th><th>Name</th><th>Age</th><th>Gender</th>
                <th>BMI</th><th>BP</th><th>Audiometry</th><th>PFT</th>
                <th>ECG</th><th>X-Ray</th><th>Overall</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 20).map((emp, idx) => {
                const overall =
                  emp.bpStatus === "Normal" && emp.bmiStatus === "Normal" ? "Normal" :
                  (emp.bpStatus === "High Risk" || emp.bmiStatus === "Obese") ? "High Risk" : "Risk";
                return (
                  <tr key={idx}>
                    <td>{emp.employee_id}</td>
                    <td>{emp.employee_name || "N/A"}</td>
                    <td>{emp.age}</td>
                    <td>{emp.gender}</td>
                    <td><StatusBadge status={emp.bmiStatus}>{emp.bmi}</StatusBadge></td>
                    <td><StatusBadge status={emp.bpStatus}>{emp.vitals?.blood_pressure || "N/A"}</StatusBadge></td>
                    <td><StatusBadge status={emp.audiometryStatus === "Normal Study" ? "Normal" : "Risk"}>
                      {emp.audiometryStatus}
                    </StatusBadge></td>
                    <td><StatusBadge status={emp.pftStatus === "Normal Study" ? "Normal" : "Risk"}>
                      {emp.pftStatus}
                    </StatusBadge></td>
                    <td><StatusBadge status={emp.ecgStatus === "Normal Study" ? "Normal" : "Risk"}>
                      {emp.ecgStatus}
                    </StatusBadge></td>
                    <td><StatusBadge status={emp.xrayStatus === "Normal Study" ? "Normal" : "Risk"}>
                      {emp.xrayStatus}
                    </StatusBadge></td>
                    <td><StatusBadge status={overall}>{overall}</StatusBadge></td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableContainer>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default HealthDashboard;
