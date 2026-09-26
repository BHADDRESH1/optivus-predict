# 🏥 OPTIVUS Predict
### AI-Powered Medicine Stockout Prediction & Smart Redistribution
**Sustain-a-thon 2026 Hackathon Project**  
*Problem Statement:* **PS-03-S2 — Predicting Medicine Stockouts Before They Happen**  
*SDG Goal:* **SDG 3 — Good Health and Well-being**  
*Target Sub-Goal:* **SDG 3.8 — Access to safe, effective, quality and affordable essential medicines and vaccines for all**

---

## 📌 1. Overview & Problem Context

In public healthcare systems and multi-hospital networks across developing regions, **medicine stockouts cost lives**. 
- Critical medicines (e.g., Insulin, Antibiotics, IV fluids, Anti-hypertensives) frequently run out at primary health centers and urban hospitals due to **delayed replenishment cycles, unexpected surges in demand, and fragmented inventory visibility**.
- Simultaneously, **neighboring facilities often hold surplus stocks** that expire on warehouse shelves without being utilized.
- Traditional inventory software reports what is *already gone* rather than predicting what *will run out*.
- False stockout alerts caused by **data reporting gaps or weekend recording anomalies** waste emergency procurement budgets.

**OPTIVUS Predict** solves this with an end-to-end **Decision Intelligence Loop**:
$$\mathbf{PREDICT} \longrightarrow \mathbf{DETECT} \longrightarrow \mathbf{RECOMMEND} \longrightarrow \mathbf{ACT}$$

1. **PREDICT:** Forecasts stockout dates 7–14 days in advance using consumption velocity and depletion modeling.
2. **DETECT:** Employs anomaly detection to differentiate genuine stockouts from recording/documentation lags.
3. **RECOMMEND:** Computes intelligent inter-facility inventory redistribution from surplus hubs to deficit hubs.
4. **ACT:** Implements Human-in-the-Loop administrative review and cold-chain dispatch workflows.

---

## 🎯 2. Consistent Hackathon Demo Storyline

The system comes pre-configured with a synchronized, end-to-end demo dataset:

| Attribute | Facility A (Deficit Hub) | Facility B (Surplus Hub) |
|---|---|---|
| **Facility Name** | **Hospital A (Chennai Central Hub)** | **Hospital B (Donor Hub)** |
| **Monitored Medicine** | **Insulin (Human 100IU/ml)** | **Insulin (Human 100IU/ml)** |
| **Opening Stock** | 500 units | 600 units |
| **Received** | 100 units | 0 units |
| **Issued / Consumed** | 180 units | 100 units |
| **Current Stock** | **420 units** | **500 units** |
| **Avg. Daily Usage** | **46 units/day** | 20 units/day |
| **Projected Need** | High demand surge | 300 units |
| **Incoming Shipments** | **0 units** (Delayed from central depot) | Regular supply intact |
| **Days to Stockout** | **9 days** (at 46/day) / **8 days** (at 50/day) | 25+ days |
| **Risk Level** | 🔴 **HIGH RISK** | 🟢 **LOW RISK (Surplus: 200 units)** |
| **AI Confidence** | **91%** | 94% |

### 🔄 The Smart Redistribution Recommendation
- **Action:** Rebalance inventory by transferring **100 units** of Insulin from **Hospital B** to **Hospital A**.
- **Cold-Chain Transit Time:** 4.5 hours across the Chennai Metropolitan Healthcare Corridor.
- **Outcome:** Extends Hospital A's operational runway from **8–9 days to 11+ days**, preventing a critical stockout until the next state-level procurement batch arrives.
- **Governance:** Human-in-the-Loop administrative approval modal requires digital authorization and generates an audit log.

### 🔍 Data Quality & Anomaly Detection
- Under **Consumption Analytics**, Oral Rehydration Salts (ORS) exhibits consumption: Mon (`45`), Tue (`48`), Wed (`42`), Thu (`0`), Fri (`0`).
- Rather than triggering false emergency re-orders, OPTIVUS Predict flags this pattern as **"Unusual consumption pattern detected — Requires verification"** to alert staff to investigate possible data recording delays.

---

## 🛠️ 3. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, jsPDF, XLSX.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose) with an integrated **zero-configuration in-memory demo fallback**.
- **Security & Architecture:** JWT Authentication, Role-Based Access Control (`SYSTEM_ADMIN`, `HOSPITAL_HEAD`, `PHARMACY_SUPERVISOR`, `PHARMACIST`), Cold-chain QR generation, and PDF/Excel export.

---

## 🚀 4. Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/optivus-predict.git
cd optivus-predict

# Install dependencies
npm install
```

### Running the Application

```bash
# Start the Frontend Development Server (Port 3000)
npm run dev
```

*The application will open automatically at [http://localhost:3000](http://localhost:3000).*

### Demo Mode (Offline-Ready)
- The application includes an **Offline Demo Mode** enabled by default on the login screen.
- You do **not** need a local MongoDB database running to test all features, interactive sliders, and approval modals.

**Default Demo Credentials:**
- **Email:** `admin@hospital.com`
- **Password:** `password123` (or any string in Demo Mode)
- **Role:** System Admin

---

## 🧭 5. Navigation & Key Pages

1. **Dashboard (`/dashboard`):** Real-time KPI summary (128 Total, 7 High Risk, 4 Predicted Stockouts, 3 Transfers), Depletion Trajectory, and High-Risk list.
2. **Medicine Inventory (`/admin/medicine-inventory`):** Comprehensive stock ledger with live formula calculation (`Current = Opening + Received - Issued`), expiry alerts, batch tracking, and barcode scanner.
3. **Stockout Prediction (`/admin/stockout-prediction`):** AI prediction cards with interactive consumption rate slider (test 46 vs 50 units/day) and explainable AI risk factor breakdowns.
4. **Consumption Analytics (`/admin/analytics`):** Dynamic demand graphs and automated data anomaly detection distinguishing real stockouts from reporting lag.
5. **Smart Redistribution (`/admin/redistribution`):** Inter-facility rebalancing dashboard, facility comparisons, and approval workflow.
6. **Stock Alerts (`/admin/alerts`):** Centralized alert dispatch with acknowledgment and resolution workflows.
7. **Facility Network (`/admin/facilities`):** Hub-and-spoke multi-facility health network visualization.
8. **Reports (`/admin/reports`):** Exportable stockout risk, valuation, and WHO Essential Medicines compliance reports in PDF and Excel formats.
9. **Settings & Users (`/admin/users`, `/settings`):** Staff access permissions and ML model sensitivity threshold tuning.

---

## 🏆 6. Hackathon Presentation Tips (Judges Q&A)

- **Q: How does this align with SDG 3?**  
  *A:* By eliminating avoidable medicine stockouts in public hospitals and preventing expiry waste in surplus centers, it directly supports **SDG Target 3.8** (access to essential medicines for all).
- **Q: Why not just automate transfers automatically?**  
  *A:* Public health and cold-chain compliance demand accountability. We employ a **Human-in-the-Loop** model where AI generates actionable proposals, but hospital administrators retain the final approval.
- **Q: How does it handle bad or delayed data?**  
  *A:* Our Anomaly Detection engine identifies sudden drops to zero consumption, preventing expensive false-positive emergency orders when staff simply missed data entry on holidays or shift changes.

---

## 📄 License
MIT License. Built for Sustain-a-thon 2026.
