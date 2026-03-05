import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import styled from "styled-components";
import {
    Download, Search, Calendar, FilterX, Eye, X,
    Printer, Barcode as BarcodeIcon
} from "lucide-react";
import * as XLSX from "xlsx";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JsBarcode from "jsbarcode";
import HeaderImg from "./Images/Header.png";
import FooterImg from "./Images/Footer.png";

// --- Styled Components ---

const Container = styled.div`
  min-height: 100vh;
  background: #F9F7F7;
  margin-left: 260px; 
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 20px;
  padding: clamp(16px, 3vw, 32px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }

  h2 {
    color: #112D4E;
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 700;
    margin: 0;
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #dbe2ef;
  border-radius: 10px;
  padding: 8px 12px;
  
  input {
    border: none;
    outline: none;
    width: 100%;
    margin-left: 8px;
    font-size: 14px;
    color: #3F72AF;
    &::placeholder { color: #999; }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  @media (max-width: 480px) { flex-direction: column; }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 14px;
  transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
`;

const TableContainer = styled.div`
  border: 1px solid #dbe2ef;
  border-radius: 12px;
  overflow-x: auto;
  background: white;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1100px;

  th {
    padding: 14px 12px;
    text-align: left;
    color: #112D4E;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    border-bottom: 2px solid #dbe2ef;
    background: #f8fafd;
    white-space: nowrap;
  }
`;

const Td = styled.td`
  padding: 12px;
  color: #444;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
`;

const ViewBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: #3F72AF;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  &:hover { background: #112D4E; }
`;

// --- Modal Styled Components ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  width: 90%;
  max-width: 700px;
  border-radius: 15px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
  h3 { margin: 0; color: #112D4E; }
`;

const CloseIcon = styled(X)`
  cursor: pointer;
  color: #666;
  &:hover { color: #f56565; }
`;

const ModalTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  
  th {
    text-align: left;
    padding: 10px;
    background: #f8f9ff;
    color: #112D4E;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    border-bottom: 2px solid #e2e8f0;
  }

  td {
    padding: 10px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 14px;
    color: #2d3748;
  }

  .test-id { color: #718096; font-weight: 600; font-size: 12px; }
  .test-name { font-weight: 600; }
  .test-container { color: #3182ce; font-weight: 500; }
`;

const BarcodeContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
  padding: 15px;
  background: #f8fafc;
  border: 1px dashed #cbd5e0;
  border-radius: 8px;
  max-height: 500px;
  overflow-y: auto;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    padding: 10px;
  }

  canvas, svg {
    max-width: 100%;
  }

  .barcode-item {
    background: white;
    padding: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .barcode-text {
    font-size: 12px;
    font-weight: bold;
    color: #1a202c;
  }

  .barcode-date {
    font-size: 10px;
    color: #718096;
    margin-bottom: 5px;
  }

  .barcode-container {
    width: 100%;
    margin: 5px 0;
  }

  .barcode-number {
    font-size: 11px;
    font-weight: 500;
  }

  .container-name {
    font-size: 11px;
    font-weight: bold;
    color: #2d3748;
    margin-top: 2px;
  }

  /* Print specific overrides */
  @media print {
    display: none;
  }
`;

const BarcodeDisplay = ({ value, label, patient }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (svgRef.current) {
            try {
                JsBarcode(svgRef.current, value, {
                    format: "CODE128",
                    width: 2,
                    height: 40,
                    displayValue: false, // We display it manually for mapping control
                    margin: 0,
                    background: "transparent"
                });
            } catch (err) {
                console.error("JsBarcode Error:", err);
            }
        }
    }, [value]);

    const genderChar = (patient?.gender || "").charAt(0).toUpperCase();

    return (
        <div className="barcode-item">
            <div className="barcode-text">
                {patient?.employee_name} {patient?.age}{"y"}/{genderChar}
            </div>
            <div className="barcode-date">{new Date().toLocaleString()}</div>
            <div className="barcode-container">
                <svg ref={svgRef}></svg>
            </div>
            <div className="barcode-number">{value}</div>
            <div className="container-name">{label || "Barcode"}</div>
        </div>
    );
};

export default function OffsitePatients() {
    const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
    const [billings, setBillings] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showBarcodes, setShowBarcodes] = useState(false);
    const [containerBarcodes, setContainerBarcodes] = useState([]);
    const [isPrinting, setIsPrinting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const printSectionRef = useRef(null);
    const itemsPerPage = 20;

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedTests, setSelectedTests] = useState([]);
    const [loadingTests, setLoadingTests] = useState(false);
    const [currentPatient, setCurrentPatient] = useState(null);

    const fetchBillings = useCallback(async () => {
        try {
            const payload = {
                from_date: startDate ? startDate.toISOString().split('T')[0] : null,
                to_date: endDate ? endDate.toISOString().split('T')[0] : null,
                search: searchTerm
            };
            const res = await axios.post(`${Labbaseurl}get_offsite_billings/`, payload);
            if (res.data.status === "success") {
                setBillings(res.data.data || []);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            // toast.error("Failed to load offsite patients"); // Optional: minimize noise if needed
        }
    }, [startDate, endDate, searchTerm, Labbaseurl]);

    useEffect(() => {
        fetchBillings();
    }, [fetchBillings]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setSearchTerm(searchInput);
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(delay);
    }, [searchInput]);

    const filteredBillings = useMemo(() => {
        return billings.filter((record) => {
            const s = searchTerm.toLowerCase();
            return (
                !searchTerm ||
                record.employee_name?.toLowerCase().includes(s) ||
                record.employee_id?.toString().includes(s) ||
                record.barcode?.toLowerCase().includes(s) ||
                record.department?.toLowerCase().includes(s)
            );
        });
    }, [billings, searchTerm]);

    const totalPages = Math.ceil(filteredBillings.length / itemsPerPage);
    const currentData = filteredBillings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleOpenModal = async (patient) => {
        setCurrentPatient(patient);
        setShowModal(true);
        setLoadingTests(true);
        setSelectedTests([]);

        try {
            const parseDetails = (data) => {
                if (typeof data === 'string') {
                    try { return JSON.parse(data); } catch (e) { return []; }
                }
                return data || [];
            };

            const testDetails = parseDetails(patient.testdetails);
            const chcDetails = parseDetails(patient.chctestdetails);

            // Collect all test_ids from both testdetails and chctestdetails
            const testIds = [
                ...testDetails,
                ...chcDetails
            ]
                .filter(t => t.test_id !== null && t.test_id !== undefined)
                .map(t => t.test_id);

            if (testIds.length > 0) {
                const res = await axios.post(`${Labbaseurl}get_test_details/`, { test_ids: testIds });
                if (res.data.status === "success") {
                    const filteredTests = (res.data.data || []).filter(test => {
                        const name = (test.test_name || "").toLowerCase();
                        const container = (test.collection_container || "").toLowerCase();
                        return name !== "unknown" && container !== "n/a";
                    });
                    setSelectedTests(filteredTests);
                }
            } else {
                setSelectedTests([]);
            }
        } catch (err) {
            console.error("Error fetching test details:", err);
            toast.error("Failed to fetch test details");
        } finally {
            setLoadingTests(false);
        }
    };

    const handlePrintBill = (patient) => {
        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        iframe.style.border = "none";
        document.body.appendChild(iframe);
        const doc = iframe.contentWindow.document;

        // Robust parsing helper
        const parseDetails = (data) => {
            if (typeof data === 'string') {
                try { return JSON.parse(data); } catch (e) { return []; }
            }
            return data || [];
        };

        const testDetails = parseDetails(patient.testdetails);
        const chcDetails = parseDetails(patient.chctestdetails);
        const combinedTests = [...testDetails, ...chcDetails];

        doc.open();
        doc.write(`
            <html>
                <head>
                    <title>Bill - ${patient.employee_name}</title>
                    <style>
                        @page { 
                            size: portrait; 
                            margin: 10mm; 
                        }
                        body { 
                            font-family: 'Segoe UI', Tahoma, Arial, sans-serif; 
                            margin: 0; 
                            padding: 0; 
                            color: #000; 
                            font-size: 13px; 
                        }
                        
                        /* Table layout trick for repeating header/footer with space */
                        .report-header-space { height: 28mm; }
                        .report-footer-space { height: 35mm; }
                        
                        .report-header {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 35mm;
                        }
                        .report-footer {
                            position: fixed;
                            bottom: 0;
                            left: 0;
                            width: 100%;
                            height: 35mm;
                        }
                        
                        .header-img { width: 100%; height: auto; }
                        .footer-img { width: 100%; height: auto; }

                        .content-table { width: 100%; border-collapse: collapse; }
                        
                        .main-content { padding: 5mm 5mm; }
                        
                        .info-table { width: 100%; margin-bottom: 10px; border-collapse: collapse; }
                        .info-table td { padding: 4px 0; vertical-align: top; }
                        .label { font-weight: bold; width: 100px; font-size: 12px; }
                        .value { font-size: 12px; }

                        .test-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        .test-table th { background: #f0f0f0; border: 1px solid #ccc; padding: 6px; font-size: 11px; text-align: left; }
                        .test-table td { border: 1px solid #ccc; padding: 6px; font-size: 12px; }

                        .financials { margin-top: 15px; border-top: 2px solid #000; padding-top: 5px; }
                        
                        .signature-section { margin-top: 25px; display: flex; justify-content: space-between; }
                        .sign-box { border-top: 1px solid #000; width: 150px; text-align: center; padding-top: 4px; font-weight: bold; font-size: 11px; }

                        @media print {
                            body { -webkit-print-color-adjust: exact; }
                        }
                    </style>
                </head>
                <body>
                    <!-- Fixed Header and Footer -->
                    <div class="report-header">
                        <img src="${HeaderImg}" class="header-img" />
                    </div>
                    <div class="report-footer">
                        <img src="${FooterImg}" class="footer-img" />
                    </div>

                    <!-- Main Structure -->
                    <table class="content-table">
                        <thead>
                            <tr><td><div class="report-header-space"></div></td></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div class="main-content">
                                        <table class="info-table">
                                            <tr>
                                                <td class="label">Name:</td>
                                                <td class="value">${patient.employee_name}</td>
                                                <td class="label">Age/Gender:</td>
                                                <td class="value">${patient.age} / ${patient.gender}</td>
                                                <td class="label">Department:</td>
                                                <td class="value">${patient.department}</td>
                                            </tr>
                                            <tr>
                                                <td class="label">Employee ID:</td>
                                                <td class="value">${patient.employee_id}</td>
                                                <td class="label">Date:</td>
                                                <td class="value" colspan="3">${patient.date ? new Date(patient.date).toLocaleDateString() : "-"}</td>
                                            </tr>
                                        </table>

                                        <div style="font-weight: bold; margin-top: 15px;">INVESTIGATION DETAILS :</div>
                                        <table class="test-table">
                                            <thead>
                                                <tr>
                                                    <th style="width: 40px;">S.No</th>
                                                    <th>Test Name</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${combinedTests.length > 0 ? combinedTests.map((t, idx) => `
                                                    <tr>
                                                        <td style="text-align: center;">${idx + 1}</td>
                                                        <td>${t.testname || t.test_name || "Unknown"}</td>
                                                    
                                                    </tr>
                                                `).join('') : '<tr><td colspan="3" style="text-align: center;">No tests added</td></tr>'}
                                            </tbody>
                                        </table>

                                        <div class="financials" style="font-size: 10px; border-top: 1px solid #000; margin-top: 10px; padding-top: 5px;">
                                            <table style="width: 100%;">
                                                <tr>
                                                    <td style=" width: 85px; white-space: nowrap;">Net Amount:</td>
                                                    <td style=" width: 100px;">₹${patient.netAmount}</td>
                                                    <td style=" width: 100px; padding-left: 20px; white-space: nowrap;">Payment Mode:</td>
                                                    <td style="white-space: nowrap;">${patient.paymentMode}</td>
                                                </tr>
                                            </table>
                                        </div>

                                        <div class="signature-section">
            
                                            <div class="sign-box">AUTHORISED SIGNATORY</div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr><td><div class="report-footer-space"></div></td></tr>
                        </tfoot>
                    </table>
                </body>
            </html>
        `);
        doc.close();
        doc.close();

        iframe.contentWindow.onload = () => {
            // Need to wait for images to load before printing
            setTimeout(() => {
                iframe.contentWindow.print();
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            }, 500);
        };
    };

    const handleDownload = () => {
        const exportData = filteredBillings.map(b => ({
            "Employee ID": b.employee_id,
            "Barcode": b.barcode,
            "Name": b.employee_name,
            "Gender": b.gender,
            "Age": b.age,
            "Department": b.department,
            "Registered Date": b.date ? new Date(b.date).toLocaleDateString() : "-",
            "Amount": b.netAmount,
            "Payment Mode": b.paymentMode
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Offsite Patients");
        XLSX.writeFile(wb, "Offsite_Patients.xlsx");
    };

    const handleGenerateBarcodes = () => {
        if (!currentPatient || !selectedTests.length) return;

        const uniqueContainers = [...new Set(selectedTests
            .map(t => t.collection_container)
            .filter(c => c && c.trim() !== "")
        )];

        // Generate barcodes for unique containers without sequential suffix as per request
        const generated = uniqueContainers.map((container) => ({
            label: container,
            barcodeValue: currentPatient.barcode
        }));

        // Add one extra general barcode label
        generated.push({
            label: "Barcode",
            barcodeValue: currentPatient.barcode
        });

        setContainerBarcodes(generated);
        setShowBarcodes(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setShowBarcodes(false);
        setContainerBarcodes([]);
        setIsPrinting(false);
    };

    const handlePrintBarcodes = () => {
        if (!printSectionRef.current) return;

        setIsPrinting(true);

        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        iframe.style.border = "none";

        document.body.appendChild(iframe);
        const doc = iframe.contentWindow.document;

        doc.open();
        doc.write(`
            <html>
                <head>
                    <style>
                        @page {
                            size: 50mm 25mm;
                            margin: 0;
                        }
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: flex-start;
                            align-items: flex-start;
                        }
                        .barcode-item {
                            width: 50mm;
                            height: 25mm;
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                            justify-content: flex-start;
                            text-align: left;
                            overflow: hidden;
                            page-break-before: always;
                            padding: 1mm;
                            box-sizing: border-box;
                        }
                        .barcode-text {
                            font-size: 10px;
                            margin: 0 0 1px 0;
                            white-space: nowrap;
                            text-align: left;
                            width: 100%;
                            font-weight: bold;
                        }
                        .barcode-date {
                            font-size: 7px;
                            margin: 0 0 1px 0;
                            text-align: left;
                            width: 100%;
                        }
                        .barcode-number {
                            font-size: 9px;
                            margin: 0;
                            text-align: left;
                            width: 100%;
                            font-weight: 500;
                        }
                        .container-name {
                            font-size: 8px;
                            font-weight: bold;
                            margin: 1px 0 0 0;
                            text-align: left;
                            width: 100%;
                            color: #333;
                        }
                        .barcode-container {
                            display: flex;
                            justify-content: flex-start;
                            align-items: left;
                            width: 100%;
                            margin: 1px 0;
                        }
                        svg {
                            width: 35mm !important;
                            height: 12mm !important;
                            align-self: flex-start;
                        }
                    </style>
                </head>
                <body>
                    ${printSectionRef.current.innerHTML}
                </body>
            </html >
    `);
        doc.close();

        iframe.contentWindow.onload = () => {
            iframe.contentWindow.print();
            setTimeout(() => {
                document.body.removeChild(iframe);
                setIsPrinting(false);
                handleCloseModal(); // Automatically close the modal after print/cancel
                toast.success("Barcodes sent to printer");
            }, 1000);
        };
    };

    const handleReGenerateAndPrint = () => {
        handleGenerateBarcodes();
        // The modal state update is async, wait for barcodes to be rendered in the DOM
        setTimeout(() => {
            handlePrintBarcodes();
        }, 1500);
    };

    return (
        <Container>
            <ToastContainer position="top-right" autoClose={3000} />
            <ContentWrapper>
                <HeaderContainer>
                    <h2>Offsite Patients</h2>
                    <ActionButtons>
                        <IconButton onClick={handleDownload} style={{ background: '#48BB78', color: '#fff' }}>
                            <Download size={18} /> Export Excel
                        </IconButton>
                        {(searchTerm || startDate || endDate) && (
                            <IconButton onClick={() => { setSearchInput(""); setStartDate(null); setEndDate(null); }} style={{ background: '#F56565', color: '#fff' }}>
                                <FilterX size={18} /> Clear Filters
                            </IconButton>
                        )}
                    </ActionButtons>
                </HeaderContainer>

                <FiltersGrid>
                    <InputGroup>
                        <Search size={18} color="#999" />
                        <input placeholder="Search ID, Barcode, Name..." value={searchInput} onChange={e => setSearchInput(e.target.value)} />
                    </InputGroup>
                    <InputGroup>
                        <Calendar size={18} color="#999" />
                        <DatePicker selected={startDate} onChange={d => { setStartDate(d); setCurrentPage(1); }} placeholderText="From Date" dateFormat="dd/MM/yyyy" isClearable />
                    </InputGroup>
                    <InputGroup>
                        <Calendar size={18} color="#999" />
                        <DatePicker selected={endDate} onChange={d => { setEndDate(d); setCurrentPage(1); }} placeholderText="To Date" dateFormat="dd/MM/yyyy" isClearable />
                    </InputGroup>
                    <IconButton onClick={fetchBillings} style={{ background: '#3F72AF', color: '#fff', height: '100%' }}>
                        <Search size={18} /> Fetch Patients
                    </IconButton>
                </FiltersGrid>

                <TableContainer>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th>Emp ID</th>
                                <th>Barcode</th>
                                <th>Name</th>
                                <th>Gen/Age</th>
                                <th>Dept</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length > 0 ? (
                                currentData.map((b, i) => (
                                    <tr key={b.billing_id || i}>
                                        <Td>{b.employee_id}</Td>
                                        <Td style={{ fontWeight: '700', color: '#112D4E' }}>{b.barcode}</Td>
                                        <Td style={{ fontWeight: '600' }}>{b.employee_name}</Td>
                                        <Td>{b.gender} / {b.age}</Td>
                                        <Td>{b.department}</Td>
                                        <Td>₹{b.netAmount}</Td>
                                        <Td>{b.paymentMode}</Td>
                                        <Td>{b.date ? new Date(b.date).toLocaleDateString() : "-"}</Td>
                                        <Td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <ViewBtn onClick={() => handleOpenModal(b)}>
                                                    <Eye size={14} /> View Tests
                                                </ViewBtn>
                                                <ViewBtn onClick={() => handlePrintBill(b)} style={{ background: '#2D3748' }}>
                                                    <Printer size={14} /> Print Bill
                                                </ViewBtn>
                                            </div>
                                        </Td>
                                    </tr>
                                ))
                            ) : (
                                <tr><Td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>No offsite patients found.</Td></tr>
                            )}
                        </tbody>
                    </StyledTable>
                </TableContainer>

                {/* Pagination Logic (Simplified for brevity) */}
                {totalPages > 1 && (
                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <IconButton disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</IconButton>
                        <span style={{ alignSelf: 'center' }}>Page {currentPage} of {totalPages}</span>
                        <IconButton disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</IconButton>
                    </div>
                )}
            </ContentWrapper>

            {/* View Tests Modal */}
            {showModal && (
                <ModalOverlay onClick={handleCloseModal}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <ModalHeader>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <div>
                                    <h3>Test Details</h3>
                                    {currentPatient && <div style={{ fontSize: '13px', color: '#666' }}>{currentPatient.employee_name} ({currentPatient.barcode})</div>}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    {!showBarcodes && selectedTests.length > 0 && (
                                        <>
                                            <IconButton
                                                onClick={handleGenerateBarcodes}
                                                style={{ background: '#3F72AF', color: '#fff', fontSize: '12px', padding: '6px 10px' }}
                                            >
                                                <BarcodeIcon size={14} /> View Barcodes
                                            </IconButton>
                                            <IconButton
                                                onClick={handleReGenerateAndPrint}
                                                disabled={isPrinting}
                                                style={{ background: '#38a169', color: '#fff', fontSize: '12px', padding: '6px 10px' }}
                                            >
                                                <Printer size={14} /> {isPrinting ? "Printing..." : "Generate & Print"}
                                            </IconButton>
                                        </>
                                    )}
                                    <CloseIcon onClick={handleCloseModal} />
                                </div>
                            </div>
                        </ModalHeader>

                        {loadingTests ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>Loading test container details...</div>
                        ) : showBarcodes ? (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <h4 style={{ margin: 0 }}>Generated Container Barcodes</h4>
                                    <IconButton onClick={() => setShowBarcodes(false)} style={{ fontSize: '13px', background: '#edf2f7', color: '#4a5568' }}>
                                        Back to Tests
                                    </IconButton>
                                </div>
                                <BarcodeContainer id="printable-barcodes" ref={printSectionRef}>
                                    {containerBarcodes.map((bc, idx) => (
                                        <BarcodeDisplay
                                            key={idx}
                                            value={bc.barcodeValue}
                                            label={bc.label}
                                            patient={currentPatient}
                                        />
                                    ))}
                                </BarcodeContainer>
                                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                    <IconButton
                                        onClick={handlePrintBarcodes}
                                        disabled={isPrinting}
                                        style={{ background: '#38a169', color: '#fff' }}
                                    >
                                        <Printer size={18} style={{ marginRight: '8px' }} />
                                        {isPrinting ? "Preparing..." : "Print All Barcodes"}
                                    </IconButton>
                                </div>
                            </div>
                        ) : (
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {selectedTests.length > 0 ? (
                                    <ModalTable>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Test Name</th>
                                                <th>Container</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedTests.map((t, idx) => (
                                                <tr key={idx}>
                                                    <td className="test-id">{t.test_id}</td>
                                                    <td className="test-name">{t.test_name}</td>
                                                    <td className="test-container">{t.collection_container}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </ModalTable>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '20px', color: '#991b1b', background: '#fef2f2', borderRadius: '8px' }}>
                                        No tests with valid IDs found for this patient.
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton onClick={handleCloseModal} style={{ background: '#3F72AF', color: 'white' }}>Close</IconButton>
                        </div>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
}
