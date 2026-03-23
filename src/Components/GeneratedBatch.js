"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"

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
const Title    = styled.h1`font-size:2rem;font-weight:bold;margin-bottom:0.5rem;color:white;`
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
const FilterGroup   = styled.div`display:flex;flex-direction:column;gap:0.5rem;min-width:180px;`
const Label         = styled.label`font-weight:500;color:#4a5568;font-size:0.875rem;text-transform:uppercase;letter-spacing:0.5px;`
const Input         = styled.input`
  padding:0.75rem; border:2px solid #e2e8f0; border-radius:0.5rem; font-size:1rem; background:white;
  &:focus{border-color:#667eea;box-shadow:0 0 0 3px rgba(102,126,234,0.1);outline:none;}
`
const Select = styled.select`
  padding:0.75rem; border:2px solid #e2e8f0; border-radius:0.5rem; font-size:1rem; background:white;
  &:focus{border-color:#667eea;box-shadow:0 0 0 3px rgba(102,126,234,0.1);outline:none;}
`
const Button = styled.button`
  padding:0.75rem 1.5rem;
  background:${p=>p.disabled?"#cbd5e0":"linear-gradient(135deg,#3F72AF 0%,#112D4E 100%)"};
  color:white; border:none; border-radius:0.5rem; font-size:1rem; font-weight:600;
  text-transform:uppercase; letter-spacing:0.5px;
  cursor:${p=>p.disabled?"not-allowed":"pointer"}; transition:all 0.3s ease;
  &:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 25px rgba(0,0,0,0.15);}
`
const PrintButton = styled.button`
  padding:0.4rem 0.9rem; border:none; border-radius:0.375rem; font-size:0.8rem;
  font-weight:600; cursor:pointer; transition:all 0.2s ease;
  display:inline-flex; align-items:center; gap:0.35rem;
  background:linear-gradient(135deg,#38a169 0%,#2f855a 100%); color:white;
  &:hover{opacity:0.88;transform:translateY(-1px);}
`
const Table       = styled.table`width:100%;border-collapse:collapse;background:white;border-radius:0.5rem;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);`
const TableHeader = styled.thead`background:linear-gradient(135deg,#3F72AF 0%,#112D4E 100%);color:white;`
const TableRow    = styled.tr`
  &:nth-child(even){background-color:#f7fafc;}
  &:hover{background-color:rgba(102,126,234,0.05);transition:background-color 0.3s ease;}
`
const TableHead = styled.th`padding:1rem;text-align:left;font-weight:600;font-size:0.875rem;text-transform:uppercase;letter-spacing:0.5px;`
const TableCell = styled.td`padding:1rem;border-bottom:1px solid #e2e8f0;font-size:0.875rem;color:#4a5568;vertical-align:middle;`
const BatchBadge = styled.span`
  font-family:'Courier New',monospace; font-size:0.85rem; font-weight:700;
  background:linear-gradient(135deg,rgba(63,114,175,0.1) 0%,rgba(17,45,78,0.1) 100%);
  border:1px solid #3F72AF; color:#112D4E; padding:3px 10px; border-radius:4px;
`
const CompanyTag = styled.span`
  background:#e8f0fe; border:1px solid #3F72AF; border-radius:4px;
  padding:2px 8px; font-size:0.78rem; font-weight:600; color:#112D4E;
`
const ReceivedBadge = styled.span`
  padding:0.25rem 0.6rem; border-radius:9999px; font-size:0.75rem; font-weight:600;
  text-transform:uppercase; letter-spacing:0.5px; color:white;
  background:${p=>p.received
    ?"linear-gradient(135deg,#38a169 0%,#2f855a 100%)"
    :"linear-gradient(135deg,#ed8936 0%,#dd6b20 100%)"};
`
const Message = styled.div`
  padding:1rem; border-radius:0.5rem; margin:1rem 0; font-weight:500;
  display:flex; align-items:center; gap:0.5rem;
  &.error  {background:linear-gradient(135deg,#e53e3e 0%,#c53030 100%);color:white;}
  &.loading{background:linear-gradient(135deg,#3182ce 0%,#2c5282 100%);color:white;}
`
const EmptyState = styled.div`
  text-align:center; padding:4rem; color:#718096;
  &::before{content:'📦';font-size:4rem;display:block;margin-bottom:1.5rem;}
`
const Pagination  = styled.div`display:flex;align-items:center;justify-content:space-between;margin-top:1.5rem;flex-wrap:wrap;gap:1rem;`
const PageInfo    = styled.span`font-size:0.875rem;color:#718096;`
const PageButtons = styled.div`display:flex;gap:0.5rem;`
const PageBtn     = styled.button`
  padding:0.4rem 0.75rem; border:2px solid ${p=>p.active?"#3F72AF":"#e2e8f0"};
  background:${p=>p.active?"linear-gradient(135deg,#3F72AF 0%,#112D4E 100%)":"white"};
  color:${p=>p.active?"white":"#4a5568"}; border-radius:0.375rem; font-size:0.875rem;
  font-weight:${p=>p.active?"600":"400"}; cursor:${p=>p.disabled?"not-allowed":"pointer"};
  opacity:${p=>p.disabled?0.5:1}; transition:all 0.2s;
  &:hover:not(:disabled){border-color:#3F72AF;}
`

// ─── Barcode SVG Generator ────────────────────────────────────────────────────
const generateBarcodeSVG = (text) => {
  const bars = []
  let x = 10
  const charWidths = [3, 2, 3, 2, 3, 2, 4, 1, 3, 2]
  for (let i = 0; i < (text || "").length * 6; i++) {
    const w = charWidths[i % 10]
    bars.push(`<rect x="${x}" y="0" width="${w}" height="48" fill="${i%2===0?"#000":"#fff"}"/>`)
    x += w + 1
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="48" viewBox="0 0 220 48">${bars.join("")}</svg>`
}

const PAGE_SIZE = 10

// ─── Print PDF ────────────────────────────────────────────────────────────────
// batch_details now has enriched: patient_id, patient_name, testdetails[]
const printBatchPDF = (batch, companies) => {
  const {
    batch_number    = "N/A",
    company_id      = "",
    shipment_to     = "Shanmuga Reference Lab",
    specimen_count: containerCounts = [],
    batch_details   = [],
    created_date,
  } = batch

  // Resolve company_name — prefer stored value, fall back to companies list lookup
  const company_name =
    batch.company_name ||
    (companies || []).find(c => c.company_id === company_id)?.company_name ||
    company_id ||
    "CHC"

  const dt      = created_date ? new Date(created_date) : new Date()
  const dateStr = dt.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })
  const timeStr = dt.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" })

  const barcodeSvg     = generateBarcodeSVG(batch_number)
  const barcodeDataUrl = `data:image/svg+xml;base64,${btoa(barcodeSvg)}`

  // Container summary rows
  const containerRows   = (containerCounts || []).map(c =>
    `<tr><td>${c.specimen_type}</td><td class="center">${c.count}</td></tr>`
  ).join("")
  const totalContainers = (containerCounts || []).reduce((a, b) => a + b.count, 0)

  // Patient rows — one row per test, patient info spans rowspan
  let patientRows = ""
  let serialNo    = 1

  ;(batch_details || []).forEach((s) => {
    // Patient info is now directly on the item (enriched by backend)
    const patientId   = s.patient_id   || s.patient_details?.patient_id   || "N/A"
    const patientName = s.patient_name || s.patient_details?.patient_name || "N/A"
    const tests       = Array.isArray(s.testdetails) ? s.testdetails : []
    const rowspan     = tests.length || 1

    if (tests.length === 0) {
      patientRows += `<tr class="patient-first">
        <td class="center">${serialNo++}</td>
        <td>${patientId}</td>
        <td>${patientName}</td>
        <td class="mono">${s.barcode || "N/A"}</td>
        <td>—</td><td>—</td>
      </tr>`
    } else {
      tests.forEach((t, ti) => {
        const container = t.collection_container || "—"
        const testName  = t.testname || t.test_name || "N/A"
        if (ti === 0) {
          patientRows += `<tr class="patient-first">
            <td class="center" rowspan="${rowspan}">${serialNo++}</td>
            <td rowspan="${rowspan}">${patientId}</td>
            <td rowspan="${rowspan}">${patientName}</td>
            <td class="mono" rowspan="${rowspan}">${s.barcode || "N/A"}</td>
            <td>${testName}</td>
            <td>${container}</td>
          </tr>`
        } else {
          patientRows += `<tr class="patient-next">
            <td>${testName}</td>
            <td>${container}</td>
          </tr>`
        }
      })
    }
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
  tr.patient-first td{background:#f5fbfd;}
  tr.patient-next  td{background:#ffffff;}
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
    <div class="meta-row"><span class="lbl">Total Patients</span>: ${batch_details.length}</div>
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
    <th style="width:130px">Patient Name</th>
    <th style="width:100px">Barcode</th>
    <th>Test Name</th>
    <th style="width:160px">Collection Container</th>
  </tr></thead>
  <tbody>${patientRows || '<tr><td colspan="6" class="center" style="color:#888;padding:16px">No patient data</td></tr>'}</tbody>
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
  if (!win) { alert("Please allow popups to print."); return }
  win.document.write(html)
  win.document.close()
  win.onload = () => setTimeout(() => { win.print(); win.close() }, 600)
}

// ─── Component ────────────────────────────────────────────────────────────────
const BatchList = () => {
  const today = new Date().toISOString().split("T")[0]

  const [batches,   setBatches]   = useState([])
  const [filtered,  setFiltered]  = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)
  const [companies, setCompanies] = useState([])
  const [page,      setPage]      = useState(1)
  const [filters,   setFilters]   = useState({
    search:     "",
    company_id: "",
    from_date:  today,
    to_date:    today,
    received:   "",
  })

  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL

  // ── Load companies ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${Labbaseurl}companies/`)
      .then(r => r.json())
      .then(data => setCompanies(Array.isArray(data) ? data : []))
      .catch(console.error)
  }, [Labbaseurl])

  // ── Fetch batches whenever server-side filters change ─────────────────────
  useEffect(() => {
    fetchBatches()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.company_id, filters.from_date, filters.to_date])

  const fetchBatches = async () => {
    setLoading(true)
    setError(null)
    try {
      let url = `${Labbaseurl}batch/?`
      if (filters.company_id) url += `company_id=${filters.company_id}&`
      if (filters.from_date)  url += `from_date=${filters.from_date}&`
      if (filters.to_date)    url += `to_date=${filters.to_date}&`

      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      const list = Array.isArray(data) ? data : data.results || []

      // Resolve company_name from companies list if backend didn't provide it
      const enriched = list.map(b => ({
        ...b,
        company_name:
          b.company_name ||
          companies.find(c => c.company_id === b.company_id)?.company_name ||
          b.company_id ||
          "",
      }))

      setBatches(enriched)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Client-side filtering (search + received) ─────────────────────────────
  useEffect(() => {
    let result = [...batches]
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(b =>
        b.batch_number?.toLowerCase().includes(q) ||
        b.company_name?.toLowerCase().includes(q)
      )
    }
    if (filters.received !== "") {
      const r = filters.received === "true"
      result = result.filter(b => !!b.received === r)
    }
    setFiltered(result)
    setPage(1)
  }, [filters.search, filters.received, batches])

  // Re-enrich company names whenever companies list loads after batches
  useEffect(() => {
    if (companies.length === 0 || batches.length === 0) return
    setBatches(prev => prev.map(b => ({
      ...b,
      company_name:
        b.company_name ||
        companies.find(c => c.company_id === b.company_id)?.company_name ||
        b.company_id ||
        "",
    })))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies])

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const clearFilters = () =>
    setFilters({ search:"", company_id:"", from_date:today, to_date:today, received:"" })

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Container>
      <Header>
        <Title>Batch History</Title>
        <Subtitle>View and reprint all generated sample batches</Subtitle>
      </Header>

      {/* Filters */}
      <Card>
        <SectionTitle>Filter Batches</SectionTitle>
        <FilterSection>
          <FilterGroup>
            <Label>Search</Label>
            <Input
              placeholder="Batch No / Company..."
              value={filters.search}
              onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
            />
          </FilterGroup>
          <FilterGroup>
            <Label>Company</Label>
            <Select
              value={filters.company_id}
              onChange={e => setFilters(p => ({ ...p, company_id: e.target.value }))}
            >
              <option value="">All Companies</option>
              {companies.map(c => (
                <option key={c.company_id} value={c.company_id}>
                  {c.company_name}
                </option>
              ))}
            </Select>
          </FilterGroup>
          <FilterGroup>
            <Label>From Date</Label>
            <Input
              type="date"
              value={filters.from_date}
              onChange={e => setFilters(p => ({ ...p, from_date: e.target.value }))}
            />
          </FilterGroup>
          <FilterGroup>
            <Label>To Date</Label>
            <Input
              type="date"
              value={filters.to_date}
              onChange={e => setFilters(p => ({ ...p, to_date: e.target.value }))}
            />
          </FilterGroup>
          <FilterGroup>
            <Label>Status</Label>
            <Select
              value={filters.received}
              onChange={e => setFilters(p => ({ ...p, received: e.target.value }))}
            >
              <option value="">All</option>
              <option value="true">Received</option>
              <option value="false">Pending</option>
            </Select>
          </FilterGroup>
          <Button
            onClick={clearFilters}
            style={{ background:"#e2e8f0", color:"#4a5568" }}
          >
            Clear
          </Button>
          <Button onClick={fetchBatches} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </FilterSection>
        {error   && <Message className="error">⚠️ {error}</Message>}
        {loading && <Message className="loading">⏳ Loading batches...</Message>}
      </Card>

      {/* Table */}
      {!loading && (
        <Card>
          <SectionTitle>
            Batches
            <span style={{ fontSize:"0.9rem", fontWeight:400, color:"#718096", marginLeft:8 }}>
              ({filtered.length} results)
            </span>
          </SectionTitle>

          {filtered.length === 0 ? (
            <EmptyState>
              <h3>No Batches Found</h3>
              <p>Try adjusting your filters or generate a new batch.</p>
            </EmptyState>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Batch No</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Samples</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Print</TableHead>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {paginated.map((batch, i) => {
                    // Resolve company_name: stored value → companies lookup → company_id → "—"
                    const resolvedCompany =
                      batch.company_name ||
                      companies.find(c => c.company_id === batch.company_id)?.company_name ||
                      batch.company_id ||
                      null

                    return (
                      <TableRow key={batch.id || batch.batch_number}>
                        <TableCell>{(page - 1) * PAGE_SIZE + i + 1}</TableCell>
                        <TableCell>
                          <BatchBadge>{batch.batch_number}</BatchBadge>
                        </TableCell>
                        <TableCell>
                          {resolvedCompany
                            ? <CompanyTag>🏢 {resolvedCompany}</CompanyTag>
                            : <span style={{ color:"#a0aec0" }}>—</span>}
                        </TableCell>
                        <TableCell>
                          {batch.created_date
                            ? new Date(batch.created_date).toLocaleDateString("en-GB")
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <strong>{batch.batch_details?.length || 0}</strong>
                          <span style={{ color:"#a0aec0", fontSize:"0.78rem", marginLeft:4 }}>
                            samples
                          </span>
                        </TableCell>
                        <TableCell>
                          <ReceivedBadge received={batch.received}>
                            {batch.received ? "Received" : "Pending"}
                          </ReceivedBadge>
                        </TableCell>
                        <TableCell>
                          {/* Pass companies so PDF can resolve company_name too */}
                          <PrintButton onClick={() => printBatchPDF(batch, companies)}>
                            🖨 Print
                          </PrintButton>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination>
                  <PageInfo>
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                  </PageInfo>
                  <PageButtons>
                    <PageBtn disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                      ‹ Prev
                    </PageBtn>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .reduce((acc, p, i, arr) => {
                        if (i > 0 && arr[i - 1] !== p - 1) acc.push("…")
                        acc.push(p)
                        return acc
                      }, [])
                      .map((p, i) =>
                        p === "…"
                          ? <PageBtn key={`e${i}`} disabled>…</PageBtn>
                          : <PageBtn key={p} active={p === page} onClick={() => setPage(p)}>{p}</PageBtn>
                      )}
                    <PageBtn disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                      Next ›
                    </PageBtn>
                  </PageButtons>
                </Pagination>
              )}
            </>
          )}
        </Card>
      )}
    </Container>
  )
}

export default BatchList