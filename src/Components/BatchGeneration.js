"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import apiRequest from "./apiRequest"

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh; background: #F9F7F7; margin-left: 260px; padding: 2rem;
  font-family: 'Inter', sans-serif;
  @media (max-width: 1024px) { margin-left: 240px; }
  @media (max-width: 768px)  { margin-left: 0; padding: 1rem; }
`
const Header = styled.header`
  background: linear-gradient(135deg, #3F72AF 0%, #112D4E 100%);
  color: white; padding: 2rem; border-radius: 1rem;
  margin-bottom: 2rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center;
`
const Title = styled.h1`font-size:2rem;font-weight:bold;margin-bottom:0.5rem;color:white;`
const Subtitle = styled.p`font-size:1.125rem;opacity:0.9;font-weight:normal;color:white;`
const Card = styled.div`
  background:white; border-radius:1rem; padding:2rem; margin-bottom:2rem;
  box-shadow:0 4px 6px rgba(0,0,0,0.07); border:1px solid #e2e8f0;
`
const SectionTitle = styled.h2`
  color:#1a202c; font-size:1.25rem; font-weight:600; margin-bottom:1.5rem;
  display:flex; align-items:center; gap:0.75rem;
  &::before { content:''; width:4px; height:24px;
    background:linear-gradient(135deg,#3F72AF 0%,#112D4E 100%); border-radius:2px; }
`
const FilterSection = styled.div`display:flex;gap:1.5rem;align-items:end;flex-wrap:wrap;margin-bottom:1.5rem;`
const FilterGroup = styled.div`display:flex;flex-direction:column;gap:0.5rem;min-width:200px;`
const Label = styled.label`font-weight:500;color:#4a5568;font-size:0.875rem;text-transform:uppercase;letter-spacing:0.5px;`
const Input = styled.input`
  padding:0.75rem; border:2px solid #e2e8f0; border-radius:0.5rem; font-size:1rem;
  background:${p => p.readOnly ? "#f7fafc" : "white"}; transition:all 0.3s ease;
  &:focus{border-color:#667eea;box-shadow:0 0 0 3px rgba(102,126,234,0.1);outline:none;}
  &:disabled{background-color:#f7fafc;cursor:not-allowed;}
`
const Select = styled.select`
  padding:0.75rem; border:2px solid #e2e8f0; border-radius:0.5rem;
  font-size:1rem; background:white; transition:all 0.3s ease;
  &:focus{border-color:#667eea;box-shadow:0 0 0 3px rgba(102,126,234,0.1);outline:none;}
`
const Button = styled.button`
  padding:0.75rem 1.5rem;
  background:${p => p.disabled ? "#cbd5e0" : "linear-gradient(135deg,#3F72AF 0%,#112D4E 100%)"};
  color:white; border:none; border-radius:0.5rem; font-size:1rem; font-weight:600;
  text-transform:uppercase; letter-spacing:0.5px;
  cursor:${p => p.disabled ? "not-allowed" : "pointer"}; transition:all 0.3s ease;
  &:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 25px rgba(0,0,0,0.15);}
`
const CreateBatchButton = styled(Button)`
  background:${p => p.disabled ? "#cbd5e0" : "linear-gradient(135deg,#38a169 0%,#2f855a 100%)"};
  font-size:1.125rem; padding:1rem 2rem;
`
const DownloadButton = styled(Button)`
  background:linear-gradient(135deg,#3182ce 0%,#2c5282 100%);
  display:flex; align-items:center; gap:0.5rem;
`
const ViewTestsButton = styled.button`
  padding:0.35rem 0.85rem;
  background:linear-gradient(135deg,#3F72AF 0%,#112D4E 100%);
  color:white; border:none; border-radius:0.375rem; font-size:0.8rem; font-weight:600;
  cursor:pointer; transition:all 0.2s ease;
  &:hover{opacity:0.88;transform:translateY(-1px);}
`
const Table = styled.table`width:100%;border-collapse:collapse;background:white;border-radius:0.5rem;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);`
const TableHeader = styled.thead`background:linear-gradient(135deg,#3F72AF 0%,#112D4E 100%);color:white;`
const TableRow = styled.tr`
  &:nth-child(even){background-color:#f7fafc;}
  &:hover{background-color:rgba(102,126,234,0.05);transition:background-color 0.3s ease;}
`
const TableHead = styled.th`padding:1rem;text-align:left;font-weight:600;font-size:0.875rem;text-transform:uppercase;letter-spacing:0.5px;`
const TableCell = styled.td`padding:1rem;border-bottom:1px solid #e2e8f0;font-size:0.875rem;color:#4a5568;`
const StatusBadge = styled.span`
  padding:0.25rem 0.5rem;border-radius:9999px;font-size:0.75rem;font-weight:600;
  text-transform:uppercase;letter-spacing:0.5px;color:white;
  background:${p => p.status === "transferred"
    ? "linear-gradient(135deg,#38a169 0%,#2f855a 100%)"
    : p.status === "pending"
      ? "linear-gradient(135deg,#ed8936 0%,#dd6b20 100%)"
      : "#cbd5e0"};
`
const ContainerTag = styled.span`
  display:inline-block; background:#ebf8ff; border:1px solid #90cdf4;
  color:#2b6cb0; border-radius:4px; padding:2px 7px;
  font-size:0.75rem; font-weight:600; margin:2px 2px 0 0;
`
const BatchSummary = styled.div`background:linear-gradient(135deg,rgba(102,126,234,0.1) 0%,rgba(118,75,162,0.1) 100%);border:2px solid #667eea;border-radius:1rem;padding:2rem;margin:2rem 0;`
const SummaryGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1.5rem;margin:1.5rem 0;`
const SummaryItem = styled.div`text-align:center;padding:1.5rem;background:white;border-radius:0.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.1);`
const SummaryValue = styled.div`font-size:1.5rem;font-weight:bold;color:#667eea;margin-bottom:0.5rem;word-break:break-word;`
const SummaryLabel = styled.div`font-size:0.875rem;color:#4a5568;text-transform:uppercase;letter-spacing:0.5px;font-weight:500;`
const ContainerSummary = styled.div`background:#f7fafc;border-radius:0.5rem;padding:1.5rem;margin:1.5rem 0;`
const ContainerGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;margin-top:1rem;`
const ContainerItem = styled.div`background:white;padding:1rem;border-radius:0.5rem;text-align:center;border:1px solid #bee3f8;box-shadow:0 1px 3px rgba(0,0,0,0.08);`
const ContainerName = styled.div`font-weight:600;color:#2b6cb0;margin-bottom:0.25rem;font-size:0.875rem;`
const ContainerCount = styled.div`font-size:1.25rem;font-weight:bold;color:#3182ce;`
const Modal = styled.div`position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px);`
const ModalContent = styled.div`background:white;padding:2rem;border-radius:1rem;max-width:500px;width:90%;text-align:center;box-shadow:0 25px 50px rgba(0,0,0,0.25);`
const ModalTitle = styled.h3`margin:0 0 1.5rem 0;color:#1a202c;font-size:1.25rem;`
const ModalText = styled.p`margin:1rem 0;color:#4a5568;line-height:1.6;`
const ButtonGroup = styled.div`display:flex;gap:1rem;justify-content:center;margin-top:2rem;`
const SecondaryButton = styled(Button)`background:#cbd5e0;color:#4a5568;&:hover:not(:disabled){background:#a0aec0;}`
const Message = styled.div`
  padding:1rem;border-radius:0.5rem;margin:1rem 0;font-weight:500;
  display:flex;align-items:center;gap:0.5rem;
  &.error  {background:linear-gradient(135deg,#e53e3e 0%,#c53030 100%);color:white;}
  &.success{background:linear-gradient(135deg,#38a169 0%,#2f855a 100%);color:white;}
  &.loading{background:linear-gradient(135deg,#3182ce 0%,#2c5282 100%);color:white;}
`
const EmptyState = styled.div`
  text-align:center;padding:4rem;color:#718096;
  &::before{content:'📦';font-size:4rem;display:block;margin-bottom:1.5rem;}
`
const TestsModalOverlay = styled(Modal)``
const TestsModalContent = styled(ModalContent)`max-width:640px;text-align:left;`
const TestsTable = styled.table`width:100%;border-collapse:collapse;margin-top:1rem;font-size:0.875rem;`
const TestsTableHead = styled.thead`background:linear-gradient(135deg,#3F72AF 0%,#112D4E 100%);color:white;`
const TestsTableRow = styled.tr`&:nth-child(even){background:#f7fafc;}`
const TestsTableTh = styled.th`padding:0.6rem 0.9rem;text-align:left;font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;`
const TestsTableTd = styled.td`padding:0.6rem 0.9rem;border-bottom:1px solid #e2e8f0;color:#4a5568;`
const CompanyBadge = styled.div`
  display:inline-flex;align-items:center;gap:0.5rem;
  background:linear-gradient(135deg,rgba(63,114,175,0.1) 0%,rgba(17,45,78,0.1) 100%);
  border:1px solid #3F72AF;border-radius:0.5rem;padding:0.5rem 1rem;
  font-size:0.875rem;font-weight:600;color:#112D4E;margin-bottom:1rem;
`

// ─── Barcode SVG Generator ───────────────────────────────────────────────────
const generateBarcodeSVG = (text) => {
  const bars = []
  let x = 10
  const charWidths = [3, 2, 3, 2, 3, 2, 4, 1, 3, 2]
  for (let i = 0; i < (text || "").length * 6; i++) {
    const w = charWidths[i % 10]
    bars.push(`<rect x="${x}" y="0" width="${w}" height="48" fill="${i % 2 === 0 ? "#000" : "#fff"}"/>`)
    x += w + 1
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="48" viewBox="0 0 220 48">${bars.join("")}</svg>`
}

// ─── Helper: unique containers for a sample ──────────────────────────────────
// Returns deduplicated, non-empty collection_container values
const getUniqueContainers = (testdetails) => {
  if (!Array.isArray(testdetails)) return []
  const seen = new Set()
  testdetails.forEach(t => {
    const c = t?.collection_container
    if (c && c !== "N/A" && c !== "—") seen.add(c)
  })
  return [...seen]
}

// ─── Component ───────────────────────────────────────────────────────────────
const BatchGeneration = () => {
  const [filters, setFilters] = useState({
    from_date: new Date().toISOString().split("T")[0],
    to_date: new Date().toISOString().split("T")[0],
    company_id: "",
  })
  const [companies, setCompanies] = useState([])
  const [transferredSamples, setTransferredSamples] = useState([])
  const [loadingSamples, setLoadingSamples] = useState(false)
  const [sampleError, setSampleError] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [loadingBatch, setLoadingBatch] = useState(false)
  const [batchError, setBatchError] = useState(null)
  const [batchSuccess, setBatchSuccess] = useState(null)
  const [createdBatchData, setCreatedBatchData] = useState(null)
  const [viewPatient, setViewPatient] = useState(null)
  const [packages, setPackages] = useState([])

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  // ── Load packages for resolution ──────────────────────────────────────────
  useEffect(() => {
    const loadPackages = async () => {
      if (filters.company_id) {
        try {
          const res = await apiRequest(`${Labbaseurl}create_package/?company_id=${filters.company_id}`, "GET");
          if (res.success) {
            setPackages(Array.isArray(res.data) ? res.data : (res.data.data || []));
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setPackages([]);
      }
    };
    loadPackages();
  }, [filters.company_id, Labbaseurl]);

  // ── Load companies ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await apiRequest(`${Labbaseurl}companies/`, "GET");
        if (res.success) {
          setCompanies(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompanies();

    // Initial fetch
    fetchTransferredSamples();
  }, [Labbaseurl])

  const selectedCompany = companies.find(c => c.company_id === filters.company_id) || null

  // ── Fetch transferred samples ──────────────────────────────────────────────
  const fetchTransferredSamples = async () => {
    setLoadingSamples(true)
    setSampleError(null)
    setTransferredSamples([])
    try {
      const queryParams = new URLSearchParams({
        samplestatus: "Transferred",
        from_date: filters.from_date,
        to_date: filters.to_date,
      })
      if (filters.company_id) queryParams.append("company_id", filters.company_id)

      const response = await apiRequest(`${Labbaseurl}samples/transferred/?${queryParams.toString()}`, "GET")
      if (response.success) {
        const data = response.data
        if (data.transferred_samples && Array.isArray(data.transferred_samples)) {
          setTransferredSamples(data.transferred_samples)
        }
      } else {
        throw new Error(response.error || "Failed to fetch transferred samples.")
      }
    } catch (error) {
      setSampleError(error.message)
    } finally {
      setLoadingSamples(false)
    }
  }

  // ── Batch creation ─────────────────────────────────────────────────────────
  const handleBatchCreation = () => {
    if (transferredSamples.length === 0) {
      setBatchError("No samples to batch.")
      return
    }
    setShowConfirmModal(true)
  }

  const confirmBatchCreation = async () => {
    setShowConfirmModal(false)
    setLoadingBatch(true)
    setBatchError(null)
    setBatchSuccess(null)
    try {
      const seen = new Set()
      const batchDetails = []
      for (const s of transferredSamples) {
        if (!seen.has(s.barcode)) {
          seen.add(s.barcode)
          batchDetails.push({
            barcode: s.barcode,
            company_id: s.company_id,
            package_id: s.package_id
          })
        }
      }
      const payload = {
        batch_details: batchDetails,
        received: false,
        remarks: null,
        company_id: filters.company_id || (transferredSamples.length > 0 ? transferredSamples[0].company_id : ""),
        company_name: selectedCompany?.company_name || (transferredSamples.length > 0 ? transferredSamples[0].company_name : ""),
      }

      const response = await apiRequest(`${Labbaseurl}batch/`, "POST", payload)
      if (response.success) {
        const data = response.data
        setBatchSuccess("Batch created successfully!")
        setCreatedBatchData({
          ...data,
          samples: transferredSamples,
          company_name: selectedCompany?.company_name || data.company_name || "CHC",
        })
        setTransferredSamples([])
      } else {
        throw new Error(response.error || "Failed to create batch.")
      }
    } catch (error) {
      setBatchError(error.message)
    } finally {
      setLoadingBatch(false)
    }
  }

  // ── PDF — HTML print ───────────────────────────────────────────────────────
  const downloadPDF = () => {
    if (!createdBatchData) return

    const {
      batch_number = "N/A",
      company_name = "CHC",
      shipment_to = "Shanmuga Reference Lab",
      // specimen_count here stores container counts from backend
      specimen_count: containerCounts = [],
      samples: batchSamples = [],
    } = createdBatchData

    const now = new Date()
    const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

    const barcodeSvg = generateBarcodeSVG(batch_number)
    const barcodeDataUrl = `data:image/svg+xml;base64,${btoa(barcodeSvg)}`

    // Container summary rows
    const containerRows = containerCounts.map(c =>
      `<tr><td>${c.specimen_type}</td><td class="center">${c.count}</td></tr>`
    ).join("")
    const totalContainers = containerCounts.reduce((a, b) => a + b.count, 0)

    // Resolve package names from IDs
    const uniquePackageIDs = [...new Set(batchSamples.map(s => s.package_id).filter(Boolean))];
    const packageInfoNames = uniquePackageIDs.map(id => {
      // 1. Try to find it in batchSamples first
      const sample = batchSamples.find(s => s.package_id === id);
      if (sample && sample.package_name) return sample.package_name;

      // 2. Fallback to common packages master list
      const pkg = packages.find(p => p.package_id === id || p._id === id);
      return pkg ? pkg.package_name : id;
    });
    const packageSummaryStr = packageInfoNames.length > 0 ? packageInfoNames.join(", ") : "Standard / Mixed";

    // Patient rows — joined unique container names
    let patientRows = ""
    let serialNo = 1

    batchSamples.forEach((s) => {
      const patientId = s.patient_details?.patient_id || s.patient_id || "N/A"
      const patientName = s.patient_details?.patient_name || s.patientname || s.patient_name || "N/A"
      const tests = Array.isArray(s.testdetails) ? s.testdetails : []

      const containers = tests
        .map(t => t.collection_container)
        .filter(c => c && c !== "N/A" && c !== "—" && c.trim() !== "");

      const uniqueContainers = [...new Set(containers)];
      const containerStr = uniqueContainers.length > 0 ? uniqueContainers.join(", ") : "—"

      patientRows += `<tr class="patient-first">
        <td class="center">${serialNo++}</td>
        <td>${patientId}</td>
        <td>${patientName}</td>
        <td class="mono">${s.barcode || "N/A"}</td>
        <td style="line-height:1.4; font-weight: 500;">${containerStr}</td>
      </tr>`
    })

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<title>Shipment Report - ${batch_number}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:Arial,sans-serif;font-size:11px;color:#000;padding:28px 30px;}
  .doc-header{text-align:center;padding-bottom:12px;border-bottom:2.5px solid #4B9EB0;margin-bottom:16px;}
  .doc-header h1{font-size:22px;color:#1e293b;font-weight:800;letter-spacing:0.5px;}
  .doc-header h2{font-size:13px;color:#4B9EB0;font-weight:500;margin-top:4px;text-decoration:underline;letter-spacing:1px;}
  .meta{display:flex;justify-content:space-between;align-items:flex-start;
        margin-bottom:20px;padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;}
  .meta-left{flex:1;}.meta-row{margin-bottom:7px;font-size:11.5px;line-height:1.4;}
  .meta-row .lbl{font-weight:bold;color:#4a5568;display:inline-block;width:140px;}
  .meta-right{text-align:center;}
  .batch-num{font-size:13px;font-weight:bold;letter-spacing:3px;color:#1e293b;margin-top:4px;}
  .company-tag{display:inline-block;background:#e8f0fe;border:1px solid #3F72AF;
               border-radius:4px;padding:3px 10px;font-weight:bold;color:#112D4E;font-size:11px;margin-top:6px;}
  .sec-title{font-size:11px;font-weight:bold;color:#4B9EB0;text-transform:uppercase;
             letter-spacing:0.8px;margin:18px 0 7px;padding-bottom:3px;border-bottom:1px solid #bae6fd;}
  table{width:100%;border-collapse:collapse;margin-bottom:4px;}
  th{padding:9px 10px;font-size:10px;font-weight:bold;text-align:left;background:#d1eaf0;
     color:#1e293b;border:1px solid #b8d9e8;text-transform:uppercase;letter-spacing:0.4px;}
  td{padding:7px 10px;border:1px solid #dde8ee;font-size:10.5px;color:#1e293b;vertical-align:middle;}
  tr.patient-first td{background:#f5fbfd;}tr.patient-next td{background:#ffffff;}
  .center{text-align:center;}.mono{font-family:'Courier New',monospace;font-size:10px;}
  .total-row td{background:#d1eaf0!important;font-weight:bold;}.container-wrap{width:55%;}
  .sig-section{display:flex;justify-content:flex-end;margin-top:40px;}
  .sig-box{width:200px;text-align:center;}
  .sig-line{border-top:1.5px solid #333;padding-top:6px;font-size:11px;
            font-weight:bold;color:#4a5568;letter-spacing:0.5px;}
  @media print{body{padding:15px 20px;}@page{margin:10mm;}}
</style>
</head><body>

<div class="doc-header">
  <h1>Shanmuga Diagnostics</h1>
  <h2>Shipment Report</h2>
</div>

<div class="meta">
  <div class="meta-left">
    <div class="meta-row"><span class="lbl">Shipment Date</span>: ${dateStr} &nbsp;${timeStr}</div>
    <div class="meta-row"><span class="lbl">Shipment From</span>: ${company_name}</div>
    <div class="meta-row"><span class="lbl">Shipment To</span>: ${shipment_to}</div>
    <div class="meta-row"><span class="lbl">Total Patients</span>: ${batchSamples.length}</div>
    <div class="meta-row"><span class="lbl" style="white-space: nowrap;">Packages Info</span>: ${packageSummaryStr}</div>
  </div>
  <div class="meta-right">
    <img src="${barcodeDataUrl}" width="200" height="48" alt="barcode" style="display:block;margin-bottom:4px"/>
    <div class="batch-num">${batch_number}</div>
  </div>
</div>

<div class="sec-title">Patient &amp; Sample Details</div>
<table>
  <thead><tr>
    <th class="center" style="width:32px">#</th>
    <th style="width:90px">Patient ID</th>
    <th style="width:130px , white-space: nowrap;">Patient Name</th>
    <th style="width:100px">Barcode</th>
    <th>Collection Containers</th>
  </tr></thead>
  <tbody>${patientRows || '<tr><td colspan="5" class="center" style="color:#888;padding:16px">No patient data</td></tr>'}</tbody>
</table>

<div class="sec-title">Container Summary</div>
<div class="container-wrap">
  <table>
    <thead><tr><th>Collection Container</th><th class="center" style="width:80px">Count</th></tr></thead>
    <tbody>
      ${containerRows || '<tr><td colspan="2" class="center" style="color:#888">No container data</td></tr>'}
      <tr class="total-row"><td>Total</td><td class="center">${totalContainers}</td></tr>
    </tbody>
  </table>
</div>

<div class="sig-section"><div class="sig-box"><div class="sig-line">Signature</div></div></div>
</body></html>`

    const win = window.open("", "_blank", "width=900,height=700")
    if (!win) { alert("Please allow popups to print the report."); return }
    win.document.write(html)
    win.document.close()
    win.onload = () => setTimeout(() => { win.print(); win.close() }, 600)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Container>
        <Header>
          <Title>Batch Generation</Title>
          <Subtitle>Create and manage sample batches for laboratory processing</Subtitle>
        </Header>

        {/* Filters */}
        <Card>
          <SectionTitle>Search Parameters</SectionTitle>
          <FilterSection>
            <FilterGroup>
              <Label htmlFor="from_date">From Date</Label>
              <Input id="from_date" type="date" value={filters.from_date}
                onChange={e => setFilters(p => ({ ...p, from_date: e.target.value }))} />
            </FilterGroup>
            <FilterGroup>
              <Label htmlFor="to_date">To Date</Label>
              <Input id="to_date" type="date" value={filters.to_date}
                onChange={e => setFilters(p => ({ ...p, to_date: e.target.value }))} />
            </FilterGroup>
            <FilterGroup>
              <Label htmlFor="company_id">Company</Label>
              <Select id="company_id" value={filters.company_id}
                onChange={e => setFilters(p => ({ ...p, company_id: e.target.value }))} required>
                <option value="">All Companies</option>
                {companies.map(c => (
                  <option key={c.company_id} value={c.company_id}>
                    {c.company_name} ({c.company_id})
                  </option>
                ))}
              </Select>
            </FilterGroup>
            <Button onClick={fetchTransferredSamples} disabled={loadingSamples}>
              {loadingSamples ? "Loading..." : "Search Samples"}
            </Button>
          </FilterSection>

          {selectedCompany && (
            <CompanyBadge>
              🏢 {selectedCompany.company_name}
              <span style={{ fontWeight: 400, color: "#718096", marginLeft: 4 }}>
                ({selectedCompany.company_id})
              </span>
            </CompanyBadge>
          )}
          {sampleError && <Message className="error">{sampleError}</Message>}
          {loadingSamples && <Message className="loading">Loading samples...</Message>}
        </Card>

        {/* Samples table */}
        {transferredSamples.length > 0 && (
          <Card>
            <SectionTitle>Transferred Samples ({transferredSamples.length} samples)</SectionTitle>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Package Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Containers</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {transferredSamples.map((sample, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {sample.registrationDate
                          ? new Date(sample.registrationDate).toLocaleDateString("en-GB")
                          : sample.transferred_date
                            ? new Date(sample.transferred_date).toLocaleDateString("en-GB")
                            : "—"}
                      </TableCell>
                      <TableCell style={{ fontWeight: 700, color: "#1e293b" }}>
                        {sample.patient_details?.patient_id || sample.patient_id || "—"}
                      </TableCell>
                      <TableCell style={{ fontWeight: 600 }}>
                        {sample.patient_details?.patient_name || sample.patientname || sample.patient_name || "—"}
                      </TableCell>
                      <TableCell style={{ fontWeight: 500, color: "#4a5568" }}>
                        {sample.package_name || packages.find(p => p.package_id === sample.package_id || p._id === sample.package_id)?.package_name || sample.package_id || "—"}
                      </TableCell>
                      <TableCell>{sample.company_name || sample.company_id || "—"}</TableCell>
                      <TableCell>
                        <span style={{
                          fontFamily: "Courier New,monospace", fontSize: "0.82rem",
                          background: "#f1f5f9", padding: "3px 8px", borderRadius: 4
                        }}>
                          {sample.barcode}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status="transferred">Transferred</StatusBadge>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const tests = Array.isArray(sample.testdetails) ? sample.testdetails : [];
                          const uniqueC = [...new Set(tests
                            .map(t => t.collection_container)
                            .filter(c => c && c !== "N/A" && c !== "—" && c.trim() !== "")
                          )];
                          return uniqueC.length > 0
                            ? uniqueC.map((c, i) => <ContainerTag key={i}>{c}</ContainerTag>)
                            : "—";
                        })()}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </tbody>
            </Table>
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <CreateBatchButton onClick={handleBatchCreation}>Create Batch</CreateBatchButton>
            </div>
          </Card>
        )}

        {transferredSamples.length === 0 && !loadingSamples && !sampleError && (
          <Card>
            <EmptyState>
              <h3>No Transferred Samples Found</h3>
              <p>Select a company and date range, then click Search</p>
            </EmptyState>
          </Card>
        )}

        {/* Confirm modal */}
        {showConfirmModal && (
          <Modal>
            <ModalContent>
              <ModalTitle>Confirm Batch Creation</ModalTitle>
              <ModalText>
                Create a batch with <strong>{transferredSamples.length}</strong> samples
                for <strong>{selectedCompany?.company_name}</strong>?
              </ModalText>
              <ModalText><strong>Note:</strong> Shipment details will be auto-populated.</ModalText>
              <ButtonGroup>
                <Button onClick={confirmBatchCreation} disabled={loadingBatch}>
                  {loadingBatch ? "Creating..." : "Confirm"}
                </Button>
                <SecondaryButton onClick={() => setShowConfirmModal(false)} disabled={loadingBatch}>
                  Cancel
                </SecondaryButton>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}

        {/* View Tests modal — shows each test + its own container */}
        {viewPatient && (
          <TestsModalOverlay onClick={() => setViewPatient(null)}>
            <TestsModalContent onClick={e => e.stopPropagation()}>
              <ModalTitle>
                Tests for{" "}
                {viewPatient.patient_details?.patient_name ||
                  viewPatient.patientname || viewPatient.patient_name || "Patient"}
                <span style={{ fontSize: "0.85rem", color: "#718096", fontWeight: 400, marginLeft: 8 }}>
                  ({viewPatient.barcode})
                </span>
              </ModalTitle>

              <div style={{ marginBottom: "16px", background: "#f1f5f9", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Health Package</div>
                <div style={{ fontSize: "1rem", color: "#1e293b", fontWeight: 600, marginTop: "4px" }}>
                  {viewPatient.package_name || packages.find(p => p.package_id === viewPatient.package_id || p._id === viewPatient.package_id)?.package_name || viewPatient.package_id || "Standard / Mixed"}
                </div>
              </div>

              {/* Unique containers summary at the top of modal */}

              {Array.isArray(viewPatient.testdetails) && viewPatient.testdetails.length > 0 ? (
                <TestsTable>
                  <TestsTableHead>
                    <tr>
                      <TestsTableTh style={{ width: "50px" }}>#</TestsTableTh>
                      <TestsTableTh>Collection Containers</TestsTableTh>
                    </tr>
                  </TestsTableHead>
                  <tbody>
                    {(() => {
                      const uniqueC = [...new Set(viewPatient.testdetails
                        .map(t => t.collection_container)
                        .filter(c => c && c !== "N/A" && c !== "—" && c.trim() !== "")
                      )];
                      return uniqueC.length > 0 ? (
                        uniqueC.map((c, i) => (
                          <TestsTableRow key={i}>
                            <TestsTableTd>{i + 1}</TestsTableTd>
                            <TestsTableTd>
                              <ContainerTag style={{ fontSize: "0.85rem", padding: "4px 10px" }}>
                                {c}
                              </ContainerTag>
                            </TestsTableTd>
                          </TestsTableRow>
                        ))
                      ) : (
                        <TestsTableRow>
                          <TestsTableTd colSpan="2" style={{ textAlign: "center" }}>—</TestsTableTd>
                        </TestsTableRow>
                      );
                    })()}
                  </tbody>
                </TestsTable>
              ) : (
                <ModalText style={{ textAlign: "center", color: "#718096" }}>
                  No test details available.
                </ModalText>
              )}
              <ButtonGroup>
                <SecondaryButton onClick={() => setViewPatient(null)}>Close</SecondaryButton>
              </ButtonGroup>
            </TestsModalContent>
          </TestsModalOverlay>
        )}

        {batchError && <Message className="error">{batchError}</Message>}
        {batchSuccess && <Message className="success">{batchSuccess}</Message>}

        {/* Batch summary after creation */}
        {createdBatchData && (
          <Card>
            <SectionTitle>Batch Created Successfully</SectionTitle>
            <BatchSummary>
              <h3>Batch Details</h3>
              <SummaryGrid>
                <SummaryItem>
                  <SummaryValue>{createdBatchData.batch_number}</SummaryValue>
                  <SummaryLabel>Batch Number</SummaryLabel>
                </SummaryItem>
                <SummaryItem>
                  <SummaryValue>{createdBatchData.samples?.length || 0}</SummaryValue>
                  <SummaryLabel>Total Samples</SummaryLabel>
                </SummaryItem>
                <SummaryItem>
                  <SummaryValue>{new Date().toLocaleDateString("en-GB")}</SummaryValue>
                  <SummaryLabel>Created Date</SummaryLabel>
                </SummaryItem>
                <SummaryItem>
                  <SummaryValue style={{ fontSize: "1rem" }}>
                    {createdBatchData.company_name || "CHC"}
                  </SummaryValue>
                  <SummaryLabel>Company</SummaryLabel>
                </SummaryItem>
                <SummaryItem>
                  <SummaryValue style={{ fontSize: "1rem" }}>Shanmuga Reference Lab</SummaryValue>
                  <SummaryLabel>Shipment To</SummaryLabel>
                </SummaryItem>
              </SummaryGrid>

              {/* Container summary — replaces specimen summary */}
              {createdBatchData.specimen_count?.length > 0 && (
                <ContainerSummary>
                  <h4 style={{ marginBottom: "0.5rem", color: "#2b6cb0" }}>
                    Container Summary
                  </h4>
                  <ContainerGrid>
                    {createdBatchData.specimen_count.map((c, i) => (
                      <ContainerItem key={i}>
                        <ContainerName>{c.specimen_type}</ContainerName>
                        <ContainerCount>{c.count}</ContainerCount>
                      </ContainerItem>
                    ))}
                    <ContainerItem>
                      <ContainerName>Total</ContainerName>
                      <ContainerCount>
                        {createdBatchData.specimen_count.reduce((s, x) => s + x.count, 0)}
                      </ContainerCount>
                    </ContainerItem>
                  </ContainerGrid>
                </ContainerSummary>
              )}

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <DownloadButton onClick={downloadPDF}>📄 Download / Print PDF Report</DownloadButton>
              </div>
            </BatchSummary>
          </Card>
        )}
      </Container>
    </>
  )
}

export default BatchGeneration