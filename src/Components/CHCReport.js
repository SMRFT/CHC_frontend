import React, { useEffect, useState, useCallback } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { format } from "date-fns";
import Modal from "react-modal";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "react-datepicker/dist/react-datepicker.css";
import * as pdfjsLib from 'pdfjs-dist';
import axios from "axios";
import {
  Calendar,
  Search,
  Printer,
  Mail,
  Flag,
  X,
  List,
  user,
  ChevronDown,
  Filter,
  RefreshCw,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import { IoIosFemale, IoIosMale, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import headerImage from "./Images/Header.png";
import FooterImage from "./Images/Footer.png";
import Vijayan from "./Images/Vijayan.png";
import Muhsina from "./Images/Muhsina.png";
import DRPS from "./Images/DRPS.png";
import { useNavigate, useLocation } from "react-router-dom";
import apiRequest from "./apiRequest";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs";
// Global styles
const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #4361ee;
    --primary-light: #4895ef;
    --primary-dark: #3a0ca3;
    --secondary: #3f37c9;
    --success: #4cc9f0;
    --danger: #f72585;
    --warning: #f8961e;
    --info: #90e0ef;
    --light: #f8f9fa;
    --dark: #212529;
    --gray: #6c757d;
    --gray-light: #e9ecef;
    --border-radius: 8px;
    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f7fb;
    color: var(--dark);
    line-height: 1.5;
  }
`;

// Container for the main content
const Container = styled.div`
  max-width: 1400px;
  margin-left: 260px; /* Match sidebar desktop width */
  padding: 2rem;

  @media (max-width: 1024px) {
    margin-left: 240px; /* Match sidebar tablet width */
  }

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: var(--primary-dark);
  font-weight: 600;
  margin: 0;
`;

const FiltersContainer = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.8rem;
  color: var(--gray);
  font-weight: 500;
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: var(--transition);
  background-color: white;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-dark);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.3);
  }
`;

const ClearButton = styled(Button)`
  background-color: var(--light);
  color: var(--dark);

  &:hover {
    background-color: var(--gray-light);
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--gray-light);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--gray);
    border-radius: 20px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const TableHead = styled.thead`
  background-color: var(--gray-light);

  th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--gray);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid var(--gray-light);

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: rgba(67, 97, 238, 0.05);
    }
  }

  td {
    padding: 1rem;
    vertical-align: middle;
    font-size: 0.875rem;
  }
`;

const NoData = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray);
  font-style: italic;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${(props) => props.color || "var(--gray)"};
  color: white;
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  background-color: ${(props) =>
    props.disabled ? "var(--gray-light)" : "white"};
  color: ${(props) => (props.disabled ? "var(--gray)" : "var(--dark)")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: var(--transition);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
    props.disabled
      ? "0 2px 4px rgba(0, 0, 0, 0.1)"
      : "0 4px 8px rgba(0, 0, 0, 0.1)"};
  }
`;

const GenderIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  margin-right: 0.5rem;
  background-color: ${(props) =>
    props.gender === "Female"
      ? "rgba(232, 62, 140, 0.1)"
      : "rgba(0, 123, 255, 0.1)"};
  color: ${(props) => (props.gender === "Female" ? "#E83E8C" : "#007BFF")};
`;

const PrintDropdown = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: green;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  min-width: 180px;
  z-index: 100;
  overflow: hidden;
  display: ${(props) => (props.isVisible ? "block" : "none")};
`;

const DropdownItem = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  border: none;
  background-color: white;
  color: black;
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--gray-light);
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
`;

const NavigationTab = styled.button`
  padding: 12px 24px;
  border: none;
  background: ${(props) =>
    props.active ? "var(--primary-dark)" : "transparent"};
  color: ${(props) => (props.active ? "white" : "#666")};
  font-weight: ${(props) => (props.active ? "600" : "400")};
  font-size: 14px;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  margin-right: 4px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: ${(props) => (props.active ? "#0056b3" : "#f8f9fa")};
    color: ${(props) => (props.active ? "white" : "#333")};
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${(props) => (props.active ? "#ccc" : "transparent")};
  }
`;

const CHCReport = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activeDropdownPatientId, setActiveDropdownPatientId] = useState(null);
  const [refByOptions, setRefByOptions] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [refBy, setRefBy] = useState("");
  const [patientId, setPatientId] = useState("");
  const [IPNumber, setIPNumber] = useState("");
  const [patientName, setPatientName] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Approved");
  const navigate = useNavigate();
  const location = useLocation();
  const Labbaseurl = "https://shinova.in/_b_a_c_k_e_n_d/LIS/";

  // MOVE THIS OUTSIDE of useEffect - use useCallback to memoize it
  const fetchCombinedPatientData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];
      const url = `${Labbaseurl}corporate_approval_report/?from_date=${formattedStartDate}&to_date=${formattedEndDate}`;

      const response = await axios.get(url);

      if (response.status === 200) {
        const patientData = response.data;
        setPatients(patientData);
        setFilteredPatients(patientData);

        const statusMap = {};
        patientData.forEach((patient) => {
          statusMap[patient.patient_id] = {
            status: patient.status,
            barcode: patient.barcode,
          };
        });

        setStatuses(statusMap);
      } else {
        console.error("Error fetching data:", response);
        setError("Failed to load patient data");
      }
    } catch (error) {
      console.error("Error fetching combined patient data:", error);
      setError("Failed to load patient data");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, Labbaseurl]);

  // Create the callback handler
  const handleApprovalSaved = useCallback(async () => {
    console.log("Approval saved, refreshing data...");
    await fetchCombinedPatientData();
    toast.success("Status updated successfully!");
  }, [fetchCombinedPatientData]);

  // Call it in useEffect
  useEffect(() => {
    if (startDate && endDate) {
      fetchCombinedPatientData();
    }
  }, [fetchCombinedPatientData, startDate, endDate]);

  // Determine icon state based on patient status
  const isPrintAndMailEnabled = (status) =>
    status === "Approved" ||
    status === "Partially Approved" ||
    status === "Dispatched";

  useEffect(() => {
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    const filtered = patients.filter((patient) => {
      const patientDate = new Date(patient.date);
      const patientStatus = statuses[patient.patient_id]?.status || '';
      return (
        patientDate >= startOfDay &&
        patientDate <= endOfDay &&
        (!refBy || patient.refby === refBy) &&
        (!patientId || patient.patient_id.includes(patientId)) &&
        (!IPNumber || patient.ipnumber?.includes(IPNumber)) &&
        (!barcode || patient.barcode?.toLowerCase().includes(barcode.toLowerCase())) &&
        (!patientName || patient.patient_name?.toLowerCase().includes(patientName.toLowerCase())) &&
        (!statusFilter || patientStatus === statusFilter)
      );
    });
    setFilteredPatients(filtered);
  }, [startDate,
    endDate,
    patients,
    refBy,
    patientId,
    barcode,
    IPNumber,
    patientName,
    statusFilter,
    statuses,]);
  // Update the clearFilters function to reset the status filter
  const clearFilters = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setBarcode("");
    setRefBy("");
    setPatientId("");
    setIPNumber("");
    setPatientName("");
    setStatusFilter("");
    setFilteredPatients(patients);
  };


  // Set PDF.js worker
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  // Helper function to convert PDF to images
  const convertPdfToImages = async (base64Data) => {
    try {
      console.log("Converting PDF to images, data length:", base64Data?.length);

      // Remove any data URL prefix if present
      const cleanBase64 = base64Data.replace(/^data:.*?;base64,/, '');

      // Decode base64 to binary
      const binaryString = atob(cleanBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      console.log("PDF decoded, byte length:", bytes.length);

      // Load PDF document with error handling
      const loadingTask = pdfjsLib.getDocument({
        data: bytes,
        // Add these options for better error handling:
        verbosity: pdfjsLib.VerbosityLevel.ERRORS,
        cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
      });

      const pdf = await loadingTask.promise;
      console.log("PDF loaded, number of pages:", pdf.numPages);

      const images = [];

      // Convert each page to image
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        images.push(canvas.toDataURL('image/png'));
        console.log(`Converted page ${pageNum} to image`);
      }

      return images;
    } catch (error) {
      console.error('Error converting PDF to images:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      return [];
    }
  };

  const fetchInvestigationFile = async (fileId) => {
    if (!fileId) return null;

    try {
      console.log(`Fetching file with ID: ${fileId}`);

      const result = await apiRequest(
        `${Labbaseurl}get_investigation_file/?file_id=${fileId}`,
        'GET'
      );

      if (!result.success) {
        console.error(`Failed to fetch file ${fileId}:`, result.error);
        return null;
      }

      // Assuming the backend now returns JSON with base64 data
      return {
        data: result.data.data, // base64 string
        contentType: result.data.contentType,
        filename: result.data.filename
      };

    } catch (error) {
      console.error(`Error fetching file ${fileId}:`, error);
      return null;
    }
  };

  const handlePrint = async (patient, withLetterpad = true) => {
    try {
      setLoading(true);
      console.log("Fetching patient details for barcode:", patient.barcode);

      const response = await apiRequest(
        `${Labbaseurl}corporate_health_report/?barcode=${patient.barcode}`,
        "GET"
      );

      if (!response.success) {
        console.error("Failed to fetch patient details:", response.error);
        toast.error(response.error || "Failed to fetch patient details");
        setLoading(false);
        return null;
      }

      console.log("API Response:", response.data);
      let patientDetails = response.data;
      if (Array.isArray(response.data)) {
        patientDetails = {
          ...response.data[0],
          testdetails: response.data.flatMap(
            (record) => record.testdetails || []
          ),
        };
      }

      // Flatten patient_data if it exists
      if (patientDetails.patient_data) {
        patientDetails = { ...patientDetails, ...patientDetails.patient_data };
      }

      console.log("Processed Patient Details:", patientDetails);

      // Fetch investigation files using file IDs
      const fileIds = patientDetails.investigation_file_ids || {};
      const investigationFiles = {};

      console.log("Fetching investigation files...");
      const filePromises = Object.entries(fileIds).map(async ([key, fileId]) => {
        if (fileId) {
          console.log(`Fetching ${key}: ${fileId}`);
          const fileData = await fetchInvestigationFile(fileId);
          if (fileData) {
            investigationFiles[key] = fileData;
            console.log(`Successfully fetched ${key}`);
          }
        }
      });

      await Promise.all(filePromises);
      patientDetails.investigation_files = investigationFiles;
      console.log("All files fetched:", Object.keys(investigationFiles));

      // Create PDF
      const doc = new jsPDF();
      let pageCount = 1;

      const leftMargin = 15;
      const rightMargin = leftMargin + 180;
      const contentWidth = rightMargin - leftMargin;
      const headerHeight = 25;
      const footerHeight = 15;
      let currentYPosition = headerHeight + 10;

      const addHeaderFooter = () => {
        if (withLetterpad) {
          doc.addImage(headerImage, "PNG", 0, 5, doc.internal.pageSize.width, headerHeight);
          const footerY = doc.internal.pageSize.height - footerHeight;
          doc.addImage(FooterImage, "PNG", 0, footerY, doc.internal.pageSize.width, footerHeight);
        }
      };

      const checkForNewPage = (yPos, estimatedHeight) => {
        const pageHeight = doc.internal.pageSize.height;
        const footerStart = pageHeight - footerHeight - 30;

        if (yPos + estimatedHeight >= footerStart) {
          doc.addPage();
          pageCount++;
          addHeaderFooter();
          return headerHeight + 10;
        }
        return yPos;
      };

      const addMedicalExaminationHeader = (yPos) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        yPos += 15;

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");

        const leftCol = [
          { label: "Name", value: patientDetails.patientname || "N/A" },
          { label: "Age / Sex", value: `${patientDetails.age} / ${patientDetails.gender}` }
        ];

        const rightCol = [
          { label: "Date", value: format(new Date(), "dd/MM/yyyy") },
          { label: "Ref. By", value: patientDetails.company_name || "N/A" },
          { label: "Barcode", value: patientDetails.barcode || "N/A" },
        ];

        for (let i = 0; i < Math.max(leftCol.length, rightCol.length); i++) {
          if (leftCol[i]) {
            doc.text(leftCol[i].label, leftMargin, yPos);
            doc.text(":", leftMargin + 40, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(leftCol[i].value, leftMargin + 45, yPos);
            doc.setFont("helvetica", "bold");
          }

          if (rightCol[i]) {
            doc.text(rightCol[i].label, leftMargin + 100, yPos);
            doc.text(":", leftMargin + 125, yPos);
            doc.setFont("helvetica", "normal");
            if (rightCol[i].label === "Ref. By") {
              const wrappedText = doc.splitTextToSize(rightCol[i].value, 65);
              doc.text(wrappedText, leftMargin + 130, yPos);
              if (wrappedText.length > 1) {
                yPos += (wrappedText.length - 1) * 5;
              }
            } else {
              doc.text(rightCol[i].value, leftMargin + 130, yPos);
            }
            doc.setFont("helvetica", "bold");
          }
          yPos += 6;
        }

        return yPos + 10;
      };

      const addMedicalHistory = (yPos) => {
        yPos = checkForNewPage(yPos, 15);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("MEDICAL EXAMINATION REPORT", leftMargin + contentWidth / 2, yPos, { align: 'center' });
        yPos += 10;

        doc.setFontSize(10);
        const historyItems = [
          { label: "Employee ID", value: patientDetails.patient_id || "N/A" },
          { label: "Department", value: patientDetails.department || "N/A" },
          { label: "Medical History", value: patientDetails.medical_history?.patient_history || "No Clinical History" }
        ];

        historyItems.forEach(item => {
          doc.setFont("helvetica", "bold");
          doc.text(item.label, leftMargin, yPos);
          doc.text(":", leftMargin + 50, yPos);
          doc.setFont("helvetica", "normal");

          // Check if this is the medical history field that needs wrapping
          if (item.label === "Medical History") {
            const maxWidth = contentWidth - 55; // Available width after label and colon
            const lines = doc.splitTextToSize(item.value, maxWidth);
            doc.text(lines, leftMargin + 55, yPos);
            yPos += (lines.length * 6); // Adjust yPos based on number of lines
          } else {
            doc.text(item.value, leftMargin + 55, yPos);
            yPos += 6;
          }
        });

        return yPos + 5;
      };

      const addGeneralExamination = (yPos) => {
        yPos = checkForNewPage(yPos, 15);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("VITALS", leftMargin, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");

        const colWidths = [60, 40, 50];
        const tableStartX = leftMargin;
        const rowHeight = 8;

        let currentX = tableStartX;
        doc.rect(tableStartX, yPos, colWidths[0] + colWidths[1] + colWidths[2], rowHeight);
        doc.line(tableStartX + colWidths[0], yPos, tableStartX + colWidths[0], yPos + rowHeight);
        doc.line(tableStartX + colWidths[0] + colWidths[1], yPos, tableStartX + colWidths[0] + colWidths[1], yPos + rowHeight);

        doc.text("Parameter", tableStartX + 2, yPos + 5);
        doc.text("Reading", tableStartX + colWidths[0] + 2, yPos + 5);
        doc.text("Normal Range", tableStartX + colWidths[0] + colWidths[1] + 2, yPos + 5);
        yPos += rowHeight;

        const vitalSigns = [
          {
            param: "Height",
            value: (patientDetails.vitals?.height || "N/A") + " cms",
            range: ""
          },
          {
            param: "Weight",
            value: (patientDetails.vitals?.weight || "N/A") + " kgs",
            range: ""
          },
          {
            param: "BMI",
            value: (patientDetails.vitals?.bmi || "N/A") + " kg/m²",
            range: "18.5 - 24.9"
          },
          {
            param: "Blood Pressure",
            value: (patientDetails.vitals?.blood_pressure || "N/A") + " mmHg",
            range: "120/80"
          },
          {
            param: "Pulse Rate",
            value: (patientDetails.vitals?.spo2 || "N/A") + " bpm",
            range: "60 - 100"
          }
        ];

        doc.setFont("helvetica", "normal");
        vitalSigns.forEach((item, index) => {
          const rowY = yPos;

          doc.rect(tableStartX, rowY, colWidths[0] + colWidths[1] + colWidths[2], rowHeight);
          doc.line(tableStartX + colWidths[0], rowY, tableStartX + colWidths[0], rowY + rowHeight);
          doc.line(tableStartX + colWidths[0] + colWidths[1], rowY, tableStartX + colWidths[0] + colWidths[1], rowY + rowHeight);

          doc.text(item.param, tableStartX + 2, rowY + 5);
          doc.text(item.value, tableStartX + colWidths[0] + 2, rowY + 5);
          doc.text(item.range, tableStartX + colWidths[0] + colWidths[1] + 2, rowY + 5);

          yPos += rowHeight;
        });

        return yPos + 10;
      };

      // UPDATED: Modified ophthalmology report to include ocular movement
      const addOphthalmologyReport = (yPos) => {
        if (!patientDetails.ophthalmology) return yPos;

        yPos = checkForNewPage(yPos, 15);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("OPHTHALMOLOGY REPORT", leftMargin, yPos);
        yPos += 10;

        const ophthal = patientDetails.ophthalmology;

        const tableX = leftMargin;
        const tableY = yPos;
        const tableWidth = 155;
        const col1Width = 52;
        const col2Width = 51.5;
        const col3Width = 51.5;
        const rowHeight = 10;

        // Now we have 4 rows: Distant Vision, Near Vision, Colour Vision, Ocular Movement
        const totalRows = 4;

        doc.setLineWidth(0.3);
        doc.setFontSize(10);

        doc.rect(tableX, tableY, tableWidth, rowHeight * (totalRows + 1));

        doc.line(tableX + col1Width, tableY, tableX + col1Width, tableY + (rowHeight * (totalRows + 1)));
        doc.line(tableX + col1Width + col2Width, tableY, tableX + col1Width + col2Width, tableY + (rowHeight * (totalRows + 1)));

        for (let i = 1; i <= totalRows; i++) {
          doc.line(tableX, tableY + (rowHeight * i), tableX + tableWidth, tableY + (rowHeight * i));
        }

        // Header row
        doc.setFont("helvetica", "bold");
        doc.text("Test", tableX + (col1Width / 2) - 5, tableY + 6);
        doc.text("Left Eye", tableX + col1Width + (col2Width / 2) - 8, tableY + 6);
        doc.text("Right Eye", tableX + col1Width + col2Width + (col3Width / 2) - 10, tableY + 6);

        doc.setFont("helvetica", "normal");

        // Distant Vision row
        doc.setFont("helvetica", "bold");
        doc.text("Distant Vision", tableX + 5, tableY + rowHeight + 6);
        doc.setFont("helvetica", "normal");

        const distantLeft = ophthal.visual_acuity?.distance?.left || "N/A";
        const distantRight = ophthal.visual_acuity?.distance?.right || "N/A";

        doc.text(distantLeft, tableX + col1Width + (col2Width / 2) - (doc.getTextWidth(distantLeft) / 2), tableY + rowHeight + 6);
        doc.text(distantRight, tableX + col1Width + col2Width + (col3Width / 2) - (doc.getTextWidth(distantRight) / 2), tableY + rowHeight + 6);

        // Near Vision row
        doc.setFont("helvetica", "bold");
        doc.text("Near Vision", tableX + 5, tableY + (rowHeight * 2) + 6);
        doc.setFont("helvetica", "normal");

        const nearLeft = ophthal.visual_acuity?.near_vision?.left || "N/A";
        const nearRight = ophthal.visual_acuity?.near_vision?.right || "N/A";

        doc.text(nearLeft, tableX + col1Width + (col2Width / 2) - (doc.getTextWidth(nearLeft) / 2), tableY + (rowHeight * 2) + 6);
        doc.text(nearRight, tableX + col1Width + col2Width + (col3Width / 2) - (doc.getTextWidth(nearRight) / 2), tableY + (rowHeight * 2) + 6);

        // Colour Vision row
        doc.setFont("helvetica", "bold");
        doc.text("Colour Vision", tableX + 5, tableY + (rowHeight * 3) + 6);
        doc.setFont("helvetica", "normal");

        const colorLeft = ophthal.visual_acuity?.color_vision?.left || "N/A";
        const colorRight = ophthal.visual_acuity?.color_vision?.right || "N/A";

        doc.text(colorLeft, tableX + col1Width + (col2Width / 2) - (doc.getTextWidth(colorLeft) / 2), tableY + (rowHeight * 3) + 6);
        doc.text(colorRight, tableX + col1Width + col2Width + (col3Width / 2) - (doc.getTextWidth(colorRight) / 2), tableY + (rowHeight * 3) + 6);

        // NEW: Ocular Movement row
        doc.setFont("helvetica", "bold");
        doc.text("Ocular Movement", tableX + 5, tableY + (rowHeight * 4) + 6);
        doc.setFont("helvetica", "normal");

        const ocularLeft = ophthal.visual_acuity?.ocularmovement?.left || "N/A";
        const ocularRight = ophthal.visual_acuity?.ocularmovement?.right || "N/A";

        doc.text(ocularLeft, tableX + col1Width + (col2Width / 2) - (doc.getTextWidth(ocularLeft) / 2), tableY + (rowHeight * 4) + 6);
        doc.text(ocularRight, tableX + col1Width + col2Width + (col3Width / 2) - (doc.getTextWidth(ocularRight) / 2), tableY + (rowHeight * 4) + 6);

        yPos = tableY + (rowHeight * (totalRows + 1)) + 10;

        // Patient Complaints Section
        if (ophthal.patient_complaints && ophthal.patient_complaints.trim()) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Patient Complaints:", leftMargin, yPos);
          yPos += 5;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          const complaintsLines = doc.splitTextToSize(ophthal.patient_complaints, contentWidth - 10);
          doc.text(complaintsLines, leftMargin, yPos);
          yPos += (complaintsLines.length * 5) + 5;
        }

        // Remarks Section
        if (ophthal.remarks && ophthal.remarks.trim()) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Remarks:", leftMargin, yPos);
          yPos += 5;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          const remarksLines = doc.splitTextToSize(ophthal.remarks, contentWidth - 10);
          doc.text(remarksLines, leftMargin, yPos);
          yPos += (remarksLines.length * 5) + 10;
        } else {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Remarks:", leftMargin, yPos);
          yPos += 5;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          const defaultRemarks = "Both Eyes: Normal Vision. Review after 6 months or 1 year.";
          const remarksLines = doc.splitTextToSize(defaultRemarks, contentWidth - 10);
          doc.text(remarksLines, leftMargin, yPos);
          yPos += (remarksLines.length * 5) + 10;
        }


        // Validity note
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        const validityNote = "This spectacle prescription is valid for correction, only for three months from the date of consultation.";
        const validityLines = doc.splitTextToSize(validityNote, contentWidth);
        doc.text(validityLines, leftMargin, yPos);

        return yPos + 15;
      };

      // UPDATED: Modified to include X-ray notes under PFT notes
      const addMiscellaneousInvestigations = (yPos) => {
        yPos = checkForNewPage(yPos, 15);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("MISCELLANEOUS", leftMargin, yPos);
        yPos += 10;

        doc.setFontSize(10);
        const investigations = [
          { label: "E.C.G", value: patientDetails.investigation_notes?.ecg_notes || "Normal" },
          { label: "Spirometry", value: patientDetails.investigation_notes?.pft_notes || "Normal" },
          { label: "X-Ray", value: patientDetails.investigation_notes?.xray_notes || "Normal" },
          { label: "Audiometry", value: patientDetails.investigation_notes?.audiometry_notes || "Normal" }
        ];

        // Calculate max width - adjust these values based on your page setup
        const rightMargin = 20; // Add this if not defined elsewhere
        const maxWidth = 210 - leftMargin - rightMargin - 45; // 210 is A4 width in mm

        investigations.forEach(item => {
          // Check if we need a new page before adding this item
          yPos = checkForNewPage(yPos, 15);

          doc.setFont("helvetica", "bold");
          doc.text(item.label, leftMargin, yPos);
          doc.text(":", leftMargin + 40, yPos);

          doc.setFont("helvetica", "normal");

          // Split text into lines that fit within maxWidth
          const lines = doc.splitTextToSize(item.value || "Normal", maxWidth);

          // Add each line
          for (let i = 0; i < lines.length; i++) {
            if (i > 0) {
              yPos += 6;
              yPos = checkForNewPage(yPos, 6);
            }
            doc.text(lines[i], leftMargin + 45, yPos);
          }

          yPos += 6; // Space before next item
        });

        return yPos + 5;
      };

      const addLabInvestigations = (yPos) => {
        if (!patientDetails.testdetails || patientDetails.testdetails.length === 0) {
          return yPos;
        }

        yPos = checkForNewPage(yPos, 15);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Lab Investigations", leftMargin, yPos);
        doc.text(":", leftMargin + 50, yPos);
        doc.setFont("helvetica", "normal");
        doc.text("Enclosed", leftMargin + 55, yPos);

        return yPos + 10;
      };

      // UPDATED: Get impression and remarks from overallApproval, remove default strings and Advice
      const addFinalAssessment = (yPos) => {
        yPos = checkForNewPage(yPos, 30);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);

        // Only display if impression and remarks exist in final_assessment
        const impression = patientDetails.final_assessment?.impression;
        const remarks = patientDetails.final_assessment?.remarks;

        // Only show impression if it exists
        if (impression && impression.trim()) {
          doc.text("Impression", leftMargin, yPos);
          doc.text(":", leftMargin + 30, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(impression, leftMargin + 35, yPos);
          doc.setFont("helvetica", "bold");
          yPos += 6;
        }

        // Only show remarks if it exists
        if (remarks && remarks.trim()) {
          yPos += 10;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.text(remarks, leftMargin, yPos);
        }

        yPos += 15;

        // Dr. Muhsina signature on right side
        const signatureX = leftMargin + 120;

        if (DRPS) {
          doc.addImage(DRPS, "PNG", signatureX, yPos, 35, 25);
        }
        yPos += 25;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Dr. P. PRABU SANKAR, MS, MRCS.,", leftMargin + 120, yPos);
        yPos += 5;
        doc.text("GENERAL SURGEON", leftMargin + 120, yPos);
        yPos += 5;
        doc.text("Reg No. 80709", leftMargin + 120, yPos);
        yPos += 5;
        doc.text("Shanmuga Hospital Ltd, Salem-7.", leftMargin + 120, yPos);

        return yPos + 10;
      };

      // NEW: Add X-ray report content display function
      const addXrayReportContent = () => {
        const xrayReport = patientDetails.investigation_notes?.xray_report;

        if (!xrayReport || !xrayReport.trim()) {
          console.log("No X-ray report content found");
          return;
        }

        console.log("Adding X-ray report content page");

        doc.addPage();
        pageCount++;
        addHeaderFooter();
        let yPos = headerHeight + 10;

        // Add employee header
        yPos = addMedicalExaminationHeader(yPos);
        yPos += 5;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("X-RAY CHEST PA VIEW", leftMargin + contentWidth / 2, yPos, { align: 'center' });
        yPos += 15;

        // Display X-ray report content
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        const reportLines = xrayReport.split('\n');
        reportLines.forEach(line => {
          if (line.trim()) {
            const wrappedLines = doc.splitTextToSize(line.trim(), contentWidth - 10);
            doc.text(wrappedLines, leftMargin, yPos);
            yPos += wrappedLines.length * 6;
          }
        });

        yPos += 10;

        // Add impression section
        doc.setFont("helvetica", "bold");
        doc.text("IMPRESSION:", leftMargin, yPos);
        yPos += 6;

        doc.setFont("helvetica", "normal");
        const impressionText = patientDetails.investigation_notes?.xray_notes || "No significant finding in the lungs or mediastinum.";
        const impressionLines = doc.splitTextToSize(impressionText, contentWidth - 10);
        doc.text(impressionLines, leftMargin, yPos);
        yPos += impressionLines.length * 6 + 20;

        // Add signature section
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        // Signature image and details on right side
        const signatureX = leftMargin + 120;

        if (Muhsina) {
          doc.addImage(Muhsina, "PNG", signatureX, yPos, 35, 15);
        }

        yPos += 20;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("DR_MUHSINA ABOOBAKER_MBBS.MDRD", signatureX, yPos);
        yPos += 5;
        doc.setFont("helvetica", "normal");
        doc.text("CONSULTANT RADIOLOGIST", signatureX, yPos);
        yPos += 5;
        doc.text("REG NO: 143512 (TNMC)", signatureX, yPos);
      };

      const addInvestigationFiles = async () => {
        const files = patientDetails.investigation_files;
        const hasFiles = files && Object.values(files).some(file => file !== null);

        if (!hasFiles) {
          console.log("No investigation files found");
          return;
        }

        console.log("Investigation files available:", Object.keys(files).filter(key => files[key] !== null));

        const fileMapping = [
          { key: "ecg_file", label: "ECG Report" },
          { key: "pft_file", label: "Pulmonary Function Test (PFT)" },
          { key: "audiometric_file", label: "Audiometry Report" },
          { key: "xray_file", label: "X-Ray Report" },
          { key: "xrayfilm_file", label: "X-Ray Film" }
        ];

        for (const { key, label } of fileMapping) {
          // NEW: Add X-ray report content before X-ray file
          if (key === "xray_file") {
            addXrayReportContent();
          }

          const file = files[key];

          if (file && file.data) {
            try {
              console.log(`Processing ${label}:`, {
                hasData: !!file.data,
                dataLength: file.data?.length,
                contentType: file.contentType,
                filename: file.filename
              });

              const contentType = file.contentType || "";
              const filename = (file.filename || "").toLowerCase();
              const isPDF = contentType.includes("pdf") || filename.endsWith(".pdf");

              console.log(`${label} is PDF:`, isPDF);

              if (isPDF) {
                console.log(`Converting PDF ${label} to images...`);
                const pdfImages = await convertPdfToImages(file.data);

                if (pdfImages.length > 0) {
                  for (let pageIndex = 0; pageIndex < pdfImages.length; pageIndex++) {
                    doc.addPage();
                    pageCount++;
                    addHeaderFooter();
                    let yPos = headerHeight + 10;

                    yPos = addMedicalExaminationHeader(yPos);
                    yPos += 5;

                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(12);
                    const pageTitle = pdfImages.length > 1 ? `${label} (Page ${pageIndex + 1}/${pdfImages.length})` : label;
                    doc.text(pageTitle, leftMargin + contentWidth / 2, yPos, { align: 'center' });
                    yPos += 12;

                    const maxWidth = contentWidth;
                    const maxHeight = 160;
                    doc.addImage(pdfImages[pageIndex], 'PNG', leftMargin, yPos, maxWidth, maxHeight);
                  }
                  console.log(`Successfully added ${pdfImages.length} page(s) from ${label}`);
                } else {
                  console.error(`Failed to convert ${label} PDF to images`);
                  doc.addPage();
                  pageCount++;
                  addHeaderFooter();
                  let yPos = headerHeight + 10;

                  yPos = addMedicalExaminationHeader(yPos);
                  yPos += 5;

                  doc.setFont("helvetica", "bold");
                  doc.setFontSize(12);
                  doc.text(label, leftMargin + contentWidth / 2, yPos, { align: 'center' });
                  yPos += 15;

                  doc.setFont("helvetica", "normal");
                  doc.setFontSize(10);
                  doc.text("Failed to load PDF content", leftMargin, yPos);
                  doc.text(`Filename: ${file.filename || 'N/A'}`, leftMargin, yPos + 10);
                }
              } else {
                console.log(`Adding image ${label}`);
                doc.addPage();
                pageCount++;
                addHeaderFooter();
                let yPos = headerHeight + 10;

                yPos = addMedicalExaminationHeader(yPos);
                yPos += 5;

                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                doc.text(label, leftMargin + contentWidth / 2, yPos, { align: 'center' });
                yPos += 12;

                let imageFormat = "PNG";
                if (contentType.includes("jpeg") || contentType.includes("jpg") ||
                  filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
                  imageFormat = "JPEG";
                } else if (contentType.includes("png") || filename.endsWith(".png")) {
                  imageFormat = "PNG";
                }

                console.log(`Using image format: ${imageFormat} for ${label}`);

                const imgData = `data:${contentType || 'image/png'};base64,${file.data}`;
                const maxWidth = contentWidth;
                const maxHeight = 160;

                try {
                  doc.addImage(imgData, imageFormat, leftMargin, yPos, maxWidth, maxHeight);
                  console.log(`Successfully added image ${label}`);
                } catch (imgError) {
                  console.error(`Error adding image ${label}:`, imgError);
                  doc.setFont("helvetica", "normal");
                  doc.setFontSize(10);
                  doc.text(`[Failed to load image: ${imgError.message}]`, leftMargin, yPos);
                }
              }
            } catch (error) {
              console.error(`Error processing ${label}:`, error);
              console.error('Error details:', error.message, error.stack);

              doc.addPage();
              pageCount++;
              addHeaderFooter();
              let yPos = headerHeight + 10;

              yPos = addMedicalExaminationHeader(yPos);
              yPos += 5;

              doc.setFont("helvetica", "bold");
              doc.setFontSize(12);
              doc.text(label, leftMargin + contentWidth / 2, yPos, { align: 'center' });
              yPos += 15;

              doc.setFont("helvetica", "normal");
              doc.setFontSize(10);
              doc.text(`[Error loading ${label}]`, leftMargin, yPos);
              doc.text(`Error: ${error.message}`, leftMargin, yPos + 10);
            }
          }
        }
      };

      const renderUnicodeText = (text, x, y) => {
        if (!text) return;
        const processedText = text.replace(/\\u00b5/g, 'µ').replace(/μ/g, 'µ');
        doc.text(processedText, x, y);
      };

      const addLaboratoryReports = () => {
        if (!patientDetails.testdetails || patientDetails.testdetails.length === 0) {
          return;
        }

        const labTests = patientDetails.testdetails.filter(test =>
          !["Audiometry", "Pulmonary Function Test", "Chest - XRay", "ECG", "Eye examination"].includes(test.testname)
        );

        if (labTests.length === 0) return;

        const unicodeMap = {
          μ: "µ", α: "α", β: "β", γ: "γ", δ: "δ", Ω: "Ω",
          "²": "²", "³": "³", "⁴": "⁴", "°": "°", "±": "±",
          "×": "x", "÷": "/", "\\u03bc": "µ", "\\u00b5": "µ",
          "\\u00b0": "°", "\\u00b1": "±", "\\u00b2": "²", "\\u00b3": "³",
        };

        const processUnicodeText = (text) => {
          if (!text) return "";
          let processedText = text;
          processedText = processedText.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
            const char = String.fromCharCode(parseInt(hex, 16));
            return unicodeMap[char] || char;
          });
          Object.keys(unicodeMap).forEach((unicode) => {
            const regex = new RegExp(unicode, "g");
            processedText = processedText.replace(regex, unicodeMap[unicode]);
          });
          return processedText;
        };

        const wrapText = (doc, text, maxWidth, startX, yPos, lineHeight = 4) => {
          if (!text) return 0;
          const splitText = doc.splitTextToSize(text, maxWidth);
          splitText.forEach((line, index) => {
            doc.text(line, startX, yPos + index * lineHeight);
          });
          return splitText.length * lineHeight;
        };

        const getHighLowStatus = (value, reference) => {
          if (!value || !reference) return null;
          const numValue = Number.parseFloat(value);
          if (isNaN(numValue)) return null;

          if (reference.includes("-")) {
            const [min, max] = reference.split("-").map((v) => Number.parseFloat(v));
            if (!isNaN(min) && !isNaN(max)) {
              if (numValue < min) return "L";
              if (numValue > max) return "H";
            }
          } else if (reference.includes("<")) {
            const max = Number.parseFloat(reference.replace("<", ""));
            if (!isNaN(max) && numValue > max) return "H";
          } else if (reference.includes(">")) {
            const min = Number.parseFloat(reference.replace(">", ""));
            if (!isNaN(min) && numValue < min) return "L";
          }
          return null;
        };

        const drawArrowSymbol = (doc, x, y, direction) => {
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.5);
          if (direction === "up") {
            doc.line(x, y, x + 1, y - 1);
            doc.line(x + 1, y - 1, x + 2, y);
            doc.line(x + 1, y - 1, x + 1, y + 2);
          } else if (direction === "down") {
            doc.line(x, y, x + 1, y + 1);
            doc.line(x + 1, y + 1, x + 2, y);
            doc.line(x + 1, y + 1, x + 1, y - 2);
          }
        };

        const colWidths = [
          contentWidth * 0.28, contentWidth * 0.12, contentWidth * 0.05,
          contentWidth * 0.13, contentWidth * 0.1, contentWidth * 0.17, contentWidth * 0.15,
        ];

        const drawTableHeader = (yPos) => {
          doc.line(leftMargin, yPos, rightMargin, yPos);
          yPos += 5;
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          const headers = ["Test", "Specimen", "", "Result", "Units", "Reference Value", "Method"];
          let xPos = leftMargin;
          headers.forEach((header, index) => {
            if (header) doc.text(header, xPos, yPos);
            xPos += colWidths[index];
          });
          yPos += 3;
          doc.line(leftMargin, yPos, rightMargin, yPos);
          yPos += 5;
          return yPos;
        };

        const addLabReportHeader = (yPos) => {
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text("Reg.ID", leftMargin, yPos);
          doc.text(":", leftMargin + 30, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(patientDetails.patient_id || "N/A", leftMargin + 35, yPos);

          doc.setFont("helvetica", "bold");
          doc.text("Collected On", leftMargin + 100, yPos);
          doc.text(":", leftMargin + 140, yPos);
          doc.setFont("helvetica", "normal");
          const firstTest = labTests[0];
          if (firstTest && firstTest.samplecollected_time) {
            doc.text(format(new Date(firstTest.samplecollected_time), "dd MMM yy / HH:mm"), leftMargin + 145, yPos);
          }
          yPos += 5;

          doc.setFont("helvetica", "bold");
          doc.text("Name", leftMargin, yPos);
          doc.text(":", leftMargin + 30, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(patientDetails.patientname || "N/A", leftMargin + 35, yPos);

          doc.setFont("helvetica", "bold");
          doc.text("Received On", leftMargin + 100, yPos);
          doc.text(":", leftMargin + 140, yPos);
          doc.setFont("helvetica", "normal");
          if (firstTest && firstTest.received_time) {
            doc.text(format(new Date(firstTest.received_time), "dd MMM yy / HH:mm"), leftMargin + 145, yPos);
          }
          yPos += 5;

          doc.setFont("helvetica", "bold");
          doc.text("Age/Gender", leftMargin, yPos);
          doc.text(":", leftMargin + 30, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(`${patientDetails.age || "N/A"} ${patientDetails.age_type || ""}/ ${patientDetails.gender || "N/A"}`, leftMargin + 35, yPos);

          doc.setFont("helvetica", "bold");
          doc.text("Reported Date", leftMargin + 100, yPos);
          doc.text(":", leftMargin + 140, yPos);
          doc.setFont("helvetica", "normal");
          doc.text(format(new Date(), "dd MMM yy / hh:mm"), leftMargin + 145, yPos);
          yPos += 5;

          doc.setFont("helvetica", "bold");
          doc.text("Referral", leftMargin, yPos);
          doc.text(":", leftMargin + 30, yPos);
          doc.setFont("helvetica", "normal");
          const refByText = patientDetails.company_name || patientDetails.refby || "SELF";
          const wrappedRefBy = doc.splitTextToSize(refByText, 60);
          doc.text(wrappedRefBy, leftMargin + 35, yPos);
          yPos += (wrappedRefBy.length * 5);

          return yPos + 5;
        };

        const addSignatures = () => {
          const pageHeight = doc.internal.pageSize.height;
          const signatureHeight = 25;
          const signaturesY = pageHeight - footerHeight - signatureHeight - 10;

          const consultants = [
            ["Dr. S. Brindha M.D.", "Consultant Pathologist", null],
            ["Dr. Rajesh Sengodan M.D.", "Consultant Microbiologist", null],
            ["Dr. R. Vijayan Ph.D.", "Consultant Biochemist", Vijayan],
          ];

          const signatureWidth = 35;
          const availableWidth = contentWidth - (signatureWidth / 2) * 2;
          const signatureSpacing = availableWidth / (consultants.length - 1);

          consultants.forEach((consultant, index) => {
            const xPosition = leftMargin + index * signatureSpacing;
            if (consultant[2]) {
              doc.addImage(consultant[2], "PNG", xPosition, signaturesY, signatureWidth, 15);
            }
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text(consultant[0], xPosition, signaturesY + 15);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(consultant[1], xPosition, signaturesY + 20);
          });
        };

        const checkForNewPageLab = (yPos, estimatedHeight) => {
          const pageHeight = doc.internal.pageSize.height;
          const footerStart = pageHeight - footerHeight - 35;

          if (yPos + estimatedHeight >= footerStart) {
            addSignatures();

            doc.addPage();
            pageCount++;
            addHeaderFooter();
            let newYPos = headerHeight + 10;
            newYPos = addLabReportHeader(newYPos);
            newYPos = drawTableHeader(newYPos);
            return newYPos;
          }
          return yPos;
        };

        const testsByDepartment = labTests.reduce((acc, test) => {
          const dept = test.department || "LABORATORY";
          (acc[dept] = acc[dept] || []).push(test);
          return acc;
        }, {});

        doc.addPage();
        pageCount++;
        addHeaderFooter();
        let yPos = headerHeight + 10;

        yPos = addLabReportHeader(yPos);
        yPos = drawTableHeader(yPos);

        Object.keys(testsByDepartment).forEach((department) => {
          const departmentHeight = 25;
          yPos = checkForNewPageLab(yPos, departmentHeight);

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          const textWidth = doc.getTextWidth(department.toUpperCase());
          const centerX = leftMargin + contentWidth / 2;
          doc.text(department.toUpperCase(), centerX, yPos, { align: "center" });
          doc.line(centerX - textWidth / 2, yPos + 2, centerX + textWidth / 2, yPos + 2);
          yPos += 10;

          testsByDepartment[department].forEach((test) => {
            const parametersBySubtitle = {};

            if (test.parameters && test.parameters.length > 0) {
              test.parameters.forEach((param) => {
                const subtitle = param.sub_title || "";
                if (!parametersBySubtitle[subtitle]) {
                  parametersBySubtitle[subtitle] = [];
                }
                parametersBySubtitle[subtitle].push(param);
              });
            }

            const testHeaderHeight = 20;
            yPos = checkForNewPageLab(yPos, testHeaderHeight);

            const testNameText = test.testname;
            const testNameLines = doc.splitTextToSize(testNameText, colWidths[0] - 2);
            const specimenLines = doc.splitTextToSize(test.specimen_type || "", colWidths[1] - 2);
            const valueText = test.value || "";
            const valueLines = doc.splitTextToSize(valueText, colWidths[3] - 2);
            const unitText = processUnicodeText(test.unit || "");
            const unitLines = doc.splitTextToSize(unitText, colWidths[4] - 2);
            const refLines = doc.splitTextToSize(test.reference_range || "", colWidths[5] - 2);
            const methodText = (test.method || "").replace(/\bMethod\b/i, "").trim();
            const methodLines = doc.splitTextToSize(methodText, colWidths[6] - 2);

            const tempHeights = [
              testNameLines.length * 4,
              specimenLines.length * 4,
              valueLines.length * 4,
              unitLines.length * 4,
              refLines.length * 4,
              methodLines.length * 4
            ];

            const maxContentHeight = Math.max(...tempHeights, 6);

            doc.setFontSize(10);
            let xPos = leftMargin;

            doc.setFont("helvetica", "bold");
            wrapText(doc, testNameText, colWidths[0] - 2, xPos, yPos, 4);
            xPos += colWidths[0];

            doc.setFont("helvetica", "normal");

            wrapText(doc, test.specimen_type || "", colWidths[1] - 2, xPos, yPos, 4);
            xPos += colWidths[1];
            xPos += colWidths[2];

            const statusIndicator = test.isHigh ? "H" : test.isLow ? "L" :
              getHighLowStatus(test.value, test.reference_range);

            if (statusIndicator) {
              doc.setFont("helvetica", "bold");
              doc.setTextColor(statusIndicator === "H" ? 255 : 0, 0, statusIndicator === "L" ? 255 : 0);
            }

            wrapText(doc, valueText, colWidths[3] - 5, xPos, yPos, 4);

            if (statusIndicator && valueText) {
              const lastLineY = yPos + ((valueLines.length - 1) * 4);
              const lastLine = valueLines[valueLines.length - 1];
              const valueWidth = doc.getTextWidth(lastLine);
              drawArrowSymbol(doc, xPos + valueWidth + 2, lastLineY - 1, statusIndicator === "H" ? "up" : "down");
            }

            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            xPos += colWidths[3];

            const processedUnit = processUnicodeText(test.unit || "");
            const unitSplitText = doc.splitTextToSize(processedUnit, colWidths[4] - 2);
            unitSplitText.forEach((line, idx) => {
              if (line.includes("µ")) {
                const parts = line.split("µ");
                let currentX = xPos;
                parts.forEach((part, partIdx) => {
                  if (partIdx > 0) {
                    doc.text("µ", currentX, yPos + idx * 4);
                    currentX += doc.getTextWidth("µ");
                  }
                  if (part) {
                    doc.text(part, currentX, yPos + idx * 4);
                    currentX += doc.getTextWidth(part);
                  }
                });
              } else {
                doc.text(line, xPos, yPos + idx * 4);
              }
            });
            xPos += colWidths[4];

            wrapText(doc, test.reference_range || "", colWidths[5] - 2, xPos, yPos, 4);
            xPos += colWidths[5];

            wrapText(doc, methodText, colWidths[6] - 2, xPos, yPos, 4);

            yPos += maxContentHeight + 2;
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);

            Object.keys(parametersBySubtitle).forEach((subtitle) => {
              if (subtitle && subtitle.trim() !== "") {
                const subtitleWithParamHeight = 25;
                yPos = checkForNewPageLab(yPos, subtitleWithParamHeight);

                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                doc.text(subtitle, leftMargin, yPos);
                yPos += 6;
              }

              parametersBySubtitle[subtitle].forEach((currentTest) => {
                const paramNameText = currentTest.name;
                const paramNameLines = doc.splitTextToSize(paramNameText, colWidths[0] - 2);
                const specimenLines = doc.splitTextToSize(currentTest.specimen_type || "", colWidths[1] - 2);
                const valueText = currentTest.value || "";
                const valueLines = doc.splitTextToSize(valueText, colWidths[3] - 2);
                const unitText = processUnicodeText(currentTest.unit || "");
                const unitLines = doc.splitTextToSize(unitText, colWidths[4] - 2);
                const refLines = doc.splitTextToSize(currentTest.reference_range || "", colWidths[5] - 2);
                const methodText = (currentTest.method || "").replace(/\bMethod\b/i, "").trim();
                const methodLines = doc.splitTextToSize(methodText, colWidths[6] - 2);

                const tempHeights = [
                  paramNameLines.length * 4,
                  specimenLines.length * 4,
                  valueLines.length * 4,
                  unitLines.length * 4,
                  refLines.length * 4,
                  methodLines.length * 4
                ];

                const maxContentHeight = Math.max(...tempHeights, 6);
                const estimatedHeight = maxContentHeight + 2;

                yPos = checkForNewPageLab(yPos, estimatedHeight);

                doc.setFontSize(10);
                let xPos = leftMargin;

                doc.setFont("helvetica", "normal");
                wrapText(doc, paramNameText, colWidths[0] - 2, xPos, yPos, 4);
                xPos += colWidths[0];

                wrapText(doc, currentTest.specimen_type || "", colWidths[1] - 2, xPos, yPos, 4);
                xPos += colWidths[1];
                xPos += colWidths[2];

                const statusIndicator = currentTest.isHigh ? "H" : currentTest.isLow ? "L" :
                  getHighLowStatus(currentTest.value, currentTest.reference_range);

                if (statusIndicator) {
                  doc.setFont("helvetica", "bold");
                  doc.setTextColor(statusIndicator === "H" ? 255 : 0, 0, statusIndicator === "L" ? 255 : 0);
                }

                wrapText(doc, valueText, colWidths[3] - 5, xPos, yPos, 4);

                if (statusIndicator && valueText) {
                  const lastLineY = yPos + ((valueLines.length - 1) * 4);
                  const lastLine = valueLines[valueLines.length - 1];
                  const valueWidth = doc.getTextWidth(lastLine);
                  drawArrowSymbol(doc, xPos + valueWidth + 2, lastLineY - 1, statusIndicator === "H" ? "up" : "down");
                }

                doc.setTextColor(0, 0, 0);
                doc.setFont("helvetica", "normal");
                xPos += colWidths[3];

                const processedUnit = processUnicodeText(currentTest.unit || "");
                const unitSplitText = doc.splitTextToSize(processedUnit, colWidths[4] - 2);
                unitSplitText.forEach((line, idx) => {
                  if (line.includes("µ")) {
                    const parts = line.split("µ");
                    let currentX = xPos;
                    parts.forEach((part, partIdx) => {
                      if (partIdx > 0) {
                        doc.text("µ", currentX, yPos + idx * 4);
                        currentX += doc.getTextWidth("µ");
                      }
                      if (part) {
                        doc.text(part, currentX, yPos + idx * 4);
                        currentX += doc.getTextWidth(part);
                      }
                    });
                  } else {
                    doc.text(line, xPos, yPos + idx * 4);
                  }
                });
                xPos += colWidths[4];

                wrapText(doc, currentTest.reference_range || "", colWidths[5] - 2, xPos, yPos, 4);
                xPos += colWidths[5];

                wrapText(doc, methodText, colWidths[6] - 2, xPos, yPos, 4);

                yPos += maxContentHeight + 2;
                doc.setFont("helvetica", "normal");
                doc.setTextColor(0, 0, 0);
              });
            });

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`Verified by: ${test.verified_by || "N/A"}`, leftMargin, yPos);
            yPos += 8;
          });

          yPos += 4;
        });

        yPos = checkForNewPageLab(yPos, 10);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const centerX = leftMargin + contentWidth / 2;
        doc.text("**End of the Report**", centerX, yPos, { align: "center" });

        addSignatures();
      };

      // Generate PDF with correct order
      addHeaderFooter();

      currentYPosition = addMedicalExaminationHeader(currentYPosition);
      currentYPosition = addMedicalHistory(currentYPosition);
      currentYPosition = addGeneralExamination(currentYPosition);
      currentYPosition = addMiscellaneousInvestigations(currentYPosition);
      currentYPosition = addOphthalmologyReport(currentYPosition);
      currentYPosition = addLabInvestigations(currentYPosition);
      currentYPosition = addFinalAssessment(currentYPosition);

      await addInvestigationFiles();
      addLaboratoryReports();

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.height;
        const pageNumberY = pageHeight - footerHeight - 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, leftMargin + contentWidth / 2, pageNumberY, { align: 'center' });
      }

      const patientID = patientDetails.patient_id || "Unknown";
      const pdfFileName = `MedicalReport_${patientID}_${(patientDetails.patientname || patient.patient_name || "Unknown").replace(/\s+/g, '_')}.pdf`;
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = pdfFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);

      setLoading(false);
      toast.success("Medical report generated successfully!");
      return pdfBlob;

    } catch (error) {
      console.error("Error while generating the PDF:", error);
      toast.error("An unexpected error occurred while generating the PDF");
      setLoading(false);
      return null;
    }
  };

  // Open modal for editing credit amount
  const openModal = (patient) => {
    setSelectedPatient(patient);
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPatient(null);
  };

  const openTestModal = (patient) => {
    setSelectedPatient(patient);
    setIsTestModalOpen(true);
  };

  const showDropdown = (patientId) => {
    setActiveDropdownPatientId(patientId);
  };

  const hideDropdown = () => {
    setActiveDropdownPatientId(null);
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case "Approved":
        return "#69b444ff"; // Bright Green for Approved
      case "Pending":
        return "#FFBB33"; // Light Orange for Partially Approved
      default:
        return "#0f999eff"; // Default Gray
    }
  };

  return (
    <Container>
      <GlobalStyle />
      <Card>
        <FiltersContainer>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>Start Date</FilterLabel>
              <FilterInput
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>End Date</FilterLabel>
              <FilterInput
                type="date"
                value={endDate.toISOString().split("T")[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Employee ID</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter Employee ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />

            </FilterGroup>
            <FilterGroup>
              <FilterLabel>Barcode</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter Barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Employee Name</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Enter employee name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </FilterGroup>
            <FilterGroup>
              <FilterLabel> Status ({filteredPatients.length})</FilterLabel>
              <FilterSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {/* <option value="">All Statuses</option>                 */}
                <option value="Approved">Approved</option>
                {/* <option value="Pending">Pending</option> */}
              </FilterSelect>
            </FilterGroup>
          </FilterRow>

          <ButtonContainer>
            <ClearButton onClick={clearFilters}>
              <X size={16} />
              Clear Filters
            </ClearButton>
          </ButtonContainer>
        </FiltersContainer>

        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <th>Date</th>
                <th>Employee ID</th>
                <th>Barcode</th>
                <th>Employee Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    Loading patient data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--danger)",
                    }}
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  const patientStatus = statuses[patient.patient_id] || {};
                  const status = patientStatus.status || "Loading...";
                  const barcode = patientStatus.barcode || "N/A";
                  const isPrintMailEnabled = isPrintAndMailEnabled(status);
                  const badgeColor = getBadgeColor(status);

                  return (
                    <tr key={patient.patient_id}>
                      <td>
                        {patient.date
                          ? format(new Date(patient.date), "yyyy-MM-dd")
                          : "N/A"}
                      </td>
                      <td>{patient.patient_id}</td>
                      <td>{barcode}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <GenderIcon gender={patient.gender}>
                            {patient.gender === "Female" ? (
                              <IoIosFemale size={14} />
                            ) : (
                              <IoIosMale size={14} />
                            )}
                          </GenderIcon>
                          {patient.patient_name}
                        </div>
                      </td>
                      <td>
                        <Badge color={badgeColor}>{status}</Badge>
                      </td>
                      <td>
                        <ActionContainer>

                          <PrintDropdown
                            onMouseEnter={() =>
                              isPrintMailEnabled &&
                              showDropdown(patient.patient_id)
                            }
                            onMouseLeave={hideDropdown}
                          >
                            <ActionButton
                              disabled={!isPrintMailEnabled}
                              title="Print Options"
                            >
                              <Printer size={16} />
                            </ActionButton>

                            {isPrintMailEnabled && (
                              <DropdownMenu
                                isVisible={
                                  activeDropdownPatientId === patient.patient_id
                                }
                              >
                                <DropdownItem
                                  onClick={() => handlePrint(patient, true)}
                                >
                                  Print with Letterpad
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => handlePrint(patient, false)}
                                >
                                  Print without Letterpad
                                </DropdownItem>
                              </DropdownMenu>
                            )}
                          </PrintDropdown>
                        </ActionContainer>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9}>
                    <NoData>No patients found</NoData>
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Test Sorting Modal */}


      {/* Credit Amount Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "800px",
            height: "fit-content",
            position: "absolute",
            left: "400px", // Adjusted for sidebar width
            right: "auto",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adding shadow
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            overflowY: "auto",
          },
        }}
      >
        {/* Close Icon at Top-Right */}
        <div
          style={{
            position: "absolute",
            top: "15px",
            right: "20px",
            cursor: "pointer",
            fontSize: "20px",
            color: "#333",
          }}
          onClick={closeModal}
        >
          <IoMdClose />
        </div>
        {/* Pass patient_id and date as props */}
        {selectedPatient && (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
          </div>
        )}
      </Modal>
    </Container>
  );
};

export default CHCReport;