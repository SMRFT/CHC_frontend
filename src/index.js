import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { validate } from "jsauth";

// Access the redirect URL from environment variables
const REDIRECT_URL = process.env.REACT_APP_LOGIN_REDIRECT_URL;

// console.log("=== HMS INDEX.JS DEBUG ===");
// console.log("REDIRECT_URL:", REDIRECT_URL);

// --- Function to set token for local development ---
function setforlocaldev() {
  const dev_token = "";
  console.log("🔧 Development token is empty - will redirect to login");
  const selectedBranch = "SHB001";
  localStorage.setItem("selected_branch", selectedBranch);
  const selectedOutlet = "OLET002";
  localStorage.setItem("selected_outlet", selectedOutlet);
  return dev_token;




}

// --- Function to redirect to login ---
function redirectToLogin() {
  if (REDIRECT_URL) {
    console.log("🔄 Redirecting to login URL:", REDIRECT_URL);
    window.location.href = REDIRECT_URL;
  } else {
    console.log("🔄 Redirecting to local login");
    window.location.href = "/";
  }
}

// --- Function to determine user role based on allowed-actions ---
function getUserRole(allowedActions) {
  if (!allowedActions || !Array.isArray(allowedActions)) {
    return ""; // Default role
  }
  if (allowedActions.includes("CHC-R-ADM") || allowedActions.includes("CHC-API-ADM")) {
    return "Admin";
  }
  if (allowedActions.includes("CHC-R-CMP") || allowedActions.includes("CHC-API-CMP")) {
    return "Company";
  }
  return "Admin"; // Default role if none of the specific roles are found
}

// --- Main execution ---
(function main() {
  try {
    const isLoginPage = window.location.pathname === "/" || window.location.pathname === "/Register";

    if (isLoginPage) {
      // Don't validate token on login or register pages, just render the app
      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      );
      reportWebVitals();
      return;
    }

    // Retrieve token from localStorage
    let accessToken = localStorage.getItem("access_token");
    // console.log("Access token from localStorage exists:", !!accessToken);

    // If no token found, try development token
    if (!accessToken) {
      console.log(
        "❌ No token found in localStorage, trying development token",
      );
      accessToken = setforlocaldev();
    }

    // If still no token (development token is empty), redirect to login
    if (!accessToken || accessToken.trim() === "") {
      // console.log("❌ No valid token available, redirecting to login");
      localStorage.removeItem("access_token"); // Clean up
      redirectToLogin();
      return; // Stop execution here
    }

    // Validate the token
    const userPayload = validate(accessToken);
    // console.log("✅ Token validated successfully");
    // console.log("Decoded token payload:", userPayload);

    // Store the valid token and user information
    localStorage.setItem("access_token", accessToken);

    // Parse raw payload for custom claims like company_id
    const rawPayload = JSON.parse(atob(accessToken.split(".")[1]));

    // Extract user information from token payload via jsauth user object methods
    const employeeId = userPayload.id();
    const name = userPayload.name();
    const userEmail = userPayload.email();
    const allowedActions = userPayload.allowedActions() || [];
    const allowedData = userPayload.allowedData() || [];

    const userRole = getUserRole(allowedActions);

    // Check if we have required data
    const isLoggedIn = !!(employeeId && name);

    if (!isLoggedIn) {
      throw new Error(
        "Missing required user data (employeeId or employeeName)",
      );
    }

    // Store user payload and extracted information for app usage
    localStorage.setItem("user_payload", JSON.stringify(rawPayload));
    localStorage.setItem("employeeId", employeeId);
    localStorage.setItem("user_id", employeeId);
    localStorage.setItem("name", name);
    localStorage.setItem("userEmail", userEmail || "");
    localStorage.setItem("allowed-outlets", JSON.stringify(allowedData));
    localStorage.setItem(
      "hms_pages",
      JSON.stringify(userPayload.allowedPages() || []),
    );
    localStorage.setItem("role", userRole);
    localStorage.setItem("company_id", rawPayload.company_id || "");

    localStorage.setItem(
      "allowedActions",
      JSON.stringify(allowedActions),
    );

    // console.log("✅ User payload and extracted data stored in localStorage");
    // console.log("Stored data:", {
    //   employeeId,
    //   name,
    //   userEmail,
    //   role: userRole,
    // });

    // Token is valid, render app
    // console.log("✅ Rendering lab app...");
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );

    reportWebVitals();
  } catch (error) {
    console.error("❌ Token validation failed:", error.message);

    // Clean up invalid token
    localStorage.removeItem("access_token");

    // If validation fails, redirect to login instead of showing debug page
    console.log("❌ Redirecting to login due to validation failure");
    redirectToLogin();
  }
})();