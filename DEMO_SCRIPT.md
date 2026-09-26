# 🎙️ Sustain-a-thon 2026: 3-Minute Live Demo Pitch Script
**Project:** OPTIVUS Predict — AI-Powered Medicine Stockout Prediction & Smart Redistribution  
**Problem Statement:** PS-03-S2 | **SDG:** 3 (Good Health and Well-being)

---

## ⏱️ Minute 0:00 - 0:45 | The Problem & The Solution
> *"Good morning judges. In developing healthcare networks, stockouts of critical medicines like Insulin and Antibiotics don't happen because medicines don't exist in the region—they happen because supply visibility is fragmented. One hospital runs out, while another hospital 15 kilometers away holds surplus stock that will expire on the shelf.*
>
> *Traditional systems only report when stock is already zero. Today, we present **OPTIVUS Predict**: an AI-driven decision intelligence system that predicts stockouts before they occur, detects reporting anomalies, and coordinates smart inter-facility redistribution."*

---

## ⏱️ Minute 0:45 - 1:30 | Predictive Intelligence (Screen 1 & 2)
1. **Show Dashboard (`/dashboard`):**
   > *"On our executive supply dashboard, administrators instantly see our 4 key metrics: 128 total tracked medicines, 7 at high risk, 4 predicted stockouts in the next 10 days, and 3 active redistribution opportunities."*
2. **Click Stockout Prediction (`/admin/stockout-prediction`):**
   > *"Let's look at Insulin Human 100IU at our Chennai Central Hub. Currently, we have 420 units in stock. With our current daily consumption rate of 46 units/day and zero incoming shipments, our predictive model calculates stockout in exactly 9 days with 91% confidence.*
   >
   > *(Slide the consumption slider from 46 to 50 units/day)*
   >
   > *If patient footfall surges to 50 units/day, our system recalculates the runway in real time down to 8 days. Notice our 'Why is this at risk?' explainable AI section—we don't just give a number; we show administrators the exact drivers: elevated demand velocity, zero incoming purchase orders, and cold-chain sensitivity."*

---

## ⏱️ Minute 1:30 - 2:15 | Anomaly Detection & Smart Redistribution (Screen 3 & 4)
3. **Click Consumption Analytics (`/admin/analytics`):**
   > *"A critical flaw with automated systems is false alarms. If a pharmacist misses logging ORS consumption on Thursday and Friday, a naive system alerts that stockout risk is zero or triggers panicked re-orders. OPTIVUS Predict detects the sudden drop from 45 units to 0 units and flags it as 'Requires verification' rather than a genuine anomaly."*
4. **Click Smart Redistribution (`/admin/redistribution`):**
   > *"Now, here is where we deliver true sustainability. Instead of an expensive emergency re-order, our optimization engine identified that **Hospital B (Donor Hub)** has 500 units in stock, projected requirements of only 300 units, and a 200-unit surplus.*
   >
   > *The system recommends a transfer of 100 units from Hospital B to Hospital A. This is a 4.5-hour cold-chain transit that extends Hospital A's runway to 11 days.*
   >
   > *(Click 'Review & Approve Recommendation')*
   >
   > *We adhere strictly to a **Human-in-the-Loop** model. No medicine moves without an administrator's verified digital sign-off and audit trail."*

---

## ⏱️ Minute 2:15 - 3:00 | SDG Impact & Conclusion
5. **Show Reports (`/admin/reports`):**
   > *"With one click, administrators can export WHO Essential Medicines compliance and audit reports for health ministries in PDF and Excel format.*
   >
   > *In conclusion: OPTIVUS Predict directly advances **UN Sustainable Development Goal 3.8** by preventing stockouts, eliminating pharmaceutical waste, and ensuring life-saving medicines are available to every patient when they need them most.*
   >
   > *Thank you, and we'd love to take your questions."*

---

## 💡 Quick Answers to Anticipated Judge Questions

1. **How is the prediction calculated?**
   - We utilize a depletion trajectory model that blends exponential moving average consumption velocity, day-of-week seasonality, and verified purchase order lead times.
2. **What if network connectivity fails?**
   - The system is built with local caching and offline-first capabilities so hospital dispensaries can continue dispensing and queue syncs.
3. **Who bears liability for transfers?**
   - The Human-in-the-Loop design ensures all transfers are authorized by credentialed pharmacy supervisors and tracked via QR-code dispatch logs.
