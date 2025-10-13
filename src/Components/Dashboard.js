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
  margin-left: 60px; /* same as sidebar width */
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

/* ============ Main Component ============ */
const HealthDashboard = () => {
  const [themeName, setThemeName] = useState("dark");
  const theme = themeName === "dark" ? darkTheme : lightTheme;
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
  }, []);

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
    };
  }), [investigations, employees]);

  const filteredData = processedData.filter((d) => {
    if (selectedDepartment !== "All" && d.department !== selectedDepartment) return false;
    if (selectedGender !== "All" && d.gender !== selectedGender) return false;
    if (selectedAgeGroup !== "All" && d.ageGroup !== selectedAgeGroup) return false;
    return true;
  });

  const total = filteredData.length || 1;
  const normalCount = filteredData.filter(d => d.bmiStatus === "Normal" && d.bpStatus === "Normal").length;
  const riskCount = filteredData.filter(d => d.bpStatus === "Risk" || d.bmiStatus === "Overweight").length;
  const highRiskCount = filteredData.filter(d => d.bpStatus === "High Risk" || d.bmiStatus === "Obese").length;

  const normalPct = ((normalCount / total) * 100).toFixed(1);
  const riskPct = ((riskCount / total) * 100).toFixed(1);
  const highRiskPct = ((highRiskCount / total) * 100).toFixed(1);
  const avgBMI = (filteredData.reduce((s, d) => s + (d.bmi || 0), 0) / total).toFixed(2);

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

  const healthIndicators = [
    { indicator: "BMI Normal", value: (filteredData.filter(d => d.bmiStatus === "Normal").length / total) * 100 },
    { indicator: "BP Normal", value: (filteredData.filter(d => d.bpStatus === "Normal").length / total) * 100 },
    { indicator: "Completed", value: (filteredData.filter(d => d.status === "approved").length / total) * 100 },
  ];

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
            <Toggle onClick={() => setThemeName(t => t === "dark" ? "light" : "dark")}>
              Toggle {themeName === "dark" ? "Light" : "Dark"}
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
          <ChartTitle>Employee Health Details</ChartTitle>
          <Table>
            <thead>
              <tr>
                <th>Employee ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Department</th>
                <th>BMI</th><th>BMI Status</th><th>BP</th><th>BP Status</th><th>Overall Status</th>
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
                    <td>{emp.department?.substring(0, 30) || "N/A"}</td>
                    <td>{emp.bmi}</td>
                    <td><StatusBadge status={emp.bmiStatus}>{emp.bmiStatus}</StatusBadge></td>
                    <td>{emp.vitals?.blood_pressure || "N/A"}</td>
                    <td><StatusBadge status={emp.bpStatus}>{emp.bpStatus}</StatusBadge></td>
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
