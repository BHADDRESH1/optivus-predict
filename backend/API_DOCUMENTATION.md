# OPTIVUS Predict Backend API Documentation
**Sustain-a-thon 2026 • PS-03-S2 • SDG 3: Good Health and Well-being**

## Base URL
```
http://localhost:4000/api
```

## Authentication
Authentication via JWT Bearer token in the `Authorization` header:
```
Authorization: Bearer <access_token>
```

---

## 1. Authentication Endpoints

### Login
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "admin@optivus.com",
    "password": "password123"
  }
  ```
- **Response:** `200 OK`

---

## 2. Medicine Inventory Endpoints

### Get All Medicines
- **GET** `/medicines`
- **Response:** `200 OK` (Array of medicine specifications)

### Get Medicine By ID
- **GET** `/medicines/:id`

### Create Medicine
- **POST** `/medicines` *(Protected)*
- **Body:**
  ```json
  {
    "name": "Insulin (Human 100IU/ml)",
    "category": "Endocrine / Diabetes",
    "unit": "vials",
    "reorderLevel": 300
  }
  ```

---

## 3. Inventory Stock Endpoints

### Get All Stock Items
- **GET** `/inventory`
- **Response:** `200 OK`
  ```json
  [
    {
      "medicineId": "MED-101",
      "medicineName": "Insulin",
      "facilityName": "Hospital A",
      "openingStock": 500,
      "receivedStock": 100,
      "issuedStock": 180,
      "currentStock": 420,
      "dailyUsage": 46,
      "daysRemaining": 9,
      "risk": "HIGH"
    }
  ]
  ```

### Get Stock By Facility
- **GET** `/inventory/:facilityId`

---

## 4. AI Stockout Prediction Endpoints

### Get All Predictions
- **GET** `/predictions`

### Get Prediction For Medicine
- **GET** `/predictions/:medicineId`
- **Response:** `200 OK`
  ```json
  {
    "medicineName": "Insulin",
    "facilityName": "Hospital A",
    "currentStock": 420,
    "dailyUsage": 46,
    "predictedStockoutDate": "In 9 days",
    "daysRemaining": 9,
    "riskLevel": "HIGH",
    "confidence": 91
  }
  ```

---

## 5. Consumption Analytics Endpoints

### Get Time Series Consumption Telemetry
- **GET** `/analytics/consumption`
- **Response:** `200 OK` (Daily usage curves and flagged anomalies)

---

## 6. Smart Redistribution Endpoints

### Get Recommendations
- **GET** `/redistribution/recommendations`
- **Response:** `200 OK`
  ```json
  [
    {
      "recommendationId": "REDIST-001",
      "medicineName": "Insulin",
      "sourceFacility": "Hospital B",
      "destinationFacility": "Hospital A",
      "recommendedQuantity": 100,
      "reason": "Hospital A predicted to run out in 9 days. Hospital B holds 200 units surplus.",
      "status": "Pending Approval"
    }
  ]
  ```

### Approve Redistribution Transfer
- **POST** `/redistribution/recommendations/:id/approve` *(Admin only)*

### Reject Redistribution Transfer
- **POST** `/redistribution/recommendations/:id/reject` *(Admin only)*

---

## 7. Healthcare Facilities Endpoints

### Get All Regional Facilities
- **GET** `/facilities`

---

## 8. Alerts Endpoints

### Get Medicine Alerts
- **GET** `/alerts`
- Returns `HIGH STOCKOUT RISK`, `ANOMALY DETECTED`, and `REDISTRIBUTION OPPORTUNITY` events.
