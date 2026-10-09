# AI Agent Guidelines & Engineering Rules - CHC Frontend (`CHC_frontend`)

Welcome! This document outlines engineering guidelines, state management patterns, styling rules, and critical anti-patterns for AI agents developing in the **`CHC_frontend`** React application.

---

## 🏛 1. Core Architecture & Stack

- **Framework**: React 18 SPA (Functional components + Hooks)
- **Styling**: Styled Components (`styled-components`)
- **HTTP Client**: Axios wrapped in [`apiRequest.js`](file:///d:/SMRFT/Projects/CHC/CHC_frontend/src/Components/apiRequest.js)
- **Icons**: Lucide React (`lucide-react`)
- **Date Handlers**: `react-datepicker`

---

## 🚫 2. Critical Anti-Patterns & Rules

### Rule 2.1: NEVER Stringify `undefined` or `null` in `FormData`
In JavaScript, `formData.append("key", undefined)` results in the literal string `"undefined"` being sent over HTTP and stored in MongoDB documents.
- **BAD**:
  ```javascript
  fd.append("company_id", empData?.company_id); // If undefined, sends "undefined"
  ```
- **GOOD**:
  ```javascript
  const companyId = form.company_id || empData?.company_id;
  if (companyId && companyId !== "undefined" && companyId !== "null") {
    fd.append("company_id", companyId);
  }
  ```

### Rule 2.2: NEVER Hardcode Identifiers or Manual Fallbacks
- **DO NOT** use hardcoded tenant fallbacks (e.g., `"CHC002"`).
- All IDs (such as `company_id`, `package_id`, `employee_id`, `test_id`) must come from active state, selection context, or server responses.
- If not found, use an empty string `""` or `null`.

### Rule 2.3: Centralized API Communications
- All HTTP requests must use [`apiRequest.js`](file:///d:/SMRFT/Projects/CHC/CHC_frontend/src/Components/apiRequest.js):
  ```javascript
  import apiRequest from "./apiRequest";
  const res = await apiRequest(`${Labbaseurl}get_investigations/`, "GET");
  if (res.success) {
    // Process res.data
  } else {
    showToast(res.error || "Failed to fetch investigations", "error");
  }
  ```
- Never hardcode backend base URLs in components; always read `process.env.REACT_APP_BACKEND_LAB_BASE_URL`.

---

## 🎨 3. Design & Styling Standards

1. **Color Palette & Theme**:
   - Primary: `#3F72AF` (Soft Blue)
   - Secondary / Dark: `#112D4E` (Navy)
   - Accent / Light: `#DBE2EF` (Ice Blue)
   - Background / Surfaces: `#F9F7F7` (Off-white / Slate 50)
   - Success / Warning / Danger: `#10B981` / `#F59E0B` / `#EF4444`

2. **Component Structure**:
   - Styled components should be defined at the top of the file or in [`GlobalStyles.js`](file:///d:/SMRFT/Projects/CHC/CHC_frontend/src/Components/GlobalStyles.js).
   - Ensure responsive layouts with media query breakpoints (`@media (max-width: 1024px)`, `@media (max-width: 768px)`).
   - Maintain sidebar margin offsets (`margin-left: 260px` desktop, `margin-left: 0` mobile).

---

## 📑 4. Dynamic Fields & Data Handling

1. **Dynamic Investigation Fields**:
   - Dynamic parameter groups (e.g., Body Composition, Doctor Comments) use `{ field_id, field_name, field_values: [{ key, value }] }`.
   - Update dynamic fields immutably:
     ```javascript
     setForm(prev => ({
       ...prev,
       dynamic_fields: prev.dynamic_fields.map((f, fIdx) => 
         fIdx === targetIdx ? { ...f, field_values: updatedValues } : f
       )
     }));
     ```

2. **JSON Resilience**:
   - Always safely parse JSON strings or nested structures returned by the backend before accessing properties:
     ```javascript
     const parseJson = (val, defaultVal = {}) => {
       if (typeof val === "string") {
         try { return JSON.parse(val); } catch (e) { return defaultVal; }
       }
       return val || defaultVal;
     };
     ```

---

## 🖨️ 5. Printing & Report Generation

- Reports use isolated `<iframe>` DOM injection to avoid styling conflicts with the main dashboard.
- Print layouts must retain exact `@page` rules:
  ```css
  @page {
    size: portrait;
    margin: 10mm;
  }
  ```
- Ensure image assets ([`Header.png`](file:///d:/SMRFT/Projects/CHC/CHC_frontend/src/Components/Images/Header.png) and [`Footer.png`](file:///d:/SMRFT/Projects/CHC/CHC_frontend/src/Components/Images/Footer.png)) load cleanly before triggering `iframe.contentWindow.print()`.

---

## 🔄 6. Verification Checklist Before Committing

1. [ ] Check that `npm run build` or `npm start` compiles without syntax errors or unhandled warnings.
2. [ ] Verify that no hardcoded IDs or `"undefined"` strings are appended to `FormData`.
3. [ ] Verify that table filters, search debouncing, and pagination work smoothly.
4. [ ] Ensure toasts give clear feedback on both success and error states.
