import { 
  Role, 
  RiskLevel, 
  Medicine, 
  Facility, 
  InventoryItem, 
  StockoutPrediction, 
  RedistributionRecommendation, 
  MedicineAlert 
} from "./types";
import { 
  LayoutDashboard, 
  Pill, 
  TrendingDown, 
  BarChart3, 
  ArrowLeftRight, 
  AlertTriangle, 
  FileText, 
  Building2, 
  Users
} from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: Role[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: [Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR, Role.TECHNICIAN] },
  { label: 'Medicine Inventory', path: '/admin/medicine-inventory', icon: Pill, roles: [Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR, Role.TECHNICIAN] },
  { label: 'Stockout Prediction', path: '/admin/stockout-prediction', icon: TrendingDown, roles: [Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR, Role.TECHNICIAN] },
  { label: 'Consumption Analytics', path: '/admin/analytics', icon: BarChart3, roles: [Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR, Role.TECHNICIAN] },
  { label: 'Redistribution', path: '/admin/redistribution', icon: ArrowLeftRight, roles: [Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR] },
  { label: 'Alerts', path: '/admin/alerts', icon: AlertTriangle, roles: [Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR] },
  { label: 'Reports', path: '/admin/reports', icon: FileText, roles: [Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR] },
  { label: 'Facilities', path: '/admin/facilities', icon: Building2, roles: [Role.ADMIN, Role.HOSPITAL_HEAD, Role.SUPERVISOR] },
  { label: 'Users / Admin', path: '/admin/users', icon: Users, roles: [Role.ADMIN, Role.HOSPITAL_HEAD] },
];

export const MOCK_FACILITIES: Facility[] = [
  {
    id: 'FAC-01',
    name: 'Hospital A',
    type: 'Tertiary Hospital',
    location: 'Chennai Central',
    medicinesCount: 128,
    highRiskCount: 7,
    alertsCount: 4,
    status: 'Active'
  },
  {
    id: 'FAC-02',
    name: 'Hospital B',
    type: 'General Hospital',
    location: 'Chennai South',
    medicinesCount: 135,
    highRiskCount: 2,
    alertsCount: 1,
    status: 'Active'
  },
  {
    id: 'FAC-03',
    name: 'Metro Health Center',
    type: 'Community Health Clinic',
    location: 'Chennai North',
    medicinesCount: 64,
    highRiskCount: 1,
    alertsCount: 0,
    status: 'Active'
  },
  {
    id: 'FAC-04',
    name: 'Tambaram Sub-Center',
    type: 'Primary Health Center',
    location: 'Tambaram, Chennai',
    medicinesCount: 48,
    highRiskCount: 0,
    alertsCount: 0,
    status: 'Active'
  }
];

export const MOCK_MEDICINES: Medicine[] = [
  { id: 'MED-101', name: 'Insulin (Human 100IU/ml)', category: 'Endocrine / Diabetes', unit: 'Vials', reorderLevel: 300, description: 'Essential hormone for diabetic patient glycemic control' },
  { id: 'MED-102', name: 'ORS (Oral Rehydration Salts)', category: 'Fluid & Electrolytes', unit: 'Sachets', reorderLevel: 800, description: 'WHO formulation for dehydration management' },
  { id: 'MED-103', name: 'Antivenom (Polyvalent)', category: 'Emergency / Antidote', unit: 'Vials', reorderLevel: 50, description: 'Life-saving polyvalent snake antivenom serum' },
  { id: 'MED-104', name: 'Anti-TB Medicine (Fixed Dose)', category: 'Infectious / Antibacterial', unit: 'Blister Packs', reorderLevel: 100, description: 'Rifampicin + Isoniazid combination therapy' },
  { id: 'MED-105', name: 'Paracetamol 500mg', category: 'Analgesics / Antipyretics', unit: 'Tablets', reorderLevel: 1000, description: 'First-line fever and mild pain management' },
  { id: 'MED-106', name: 'Amoxicillin 500mg', category: 'Broad Spectrum Antibiotic', unit: 'Capsules', reorderLevel: 300, description: 'Beta-lactam antibiotic for bacterial infections' },
  { id: 'MED-107', name: 'Artemether-Lumefantrine', category: 'Antimalarial', unit: 'Strips', reorderLevel: 150, description: 'First-line ACT antimalarial therapeutic' }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'INV-001',
    medicineId: 'MED-101',
    medicineName: 'Insulin',
    category: 'Endocrine / Diabetes',
    facilityId: 'FAC-01',
    facilityName: 'Hospital A',
    openingStock: 500,
    receivedStock: 100,
    issuedStock: 180,
    currentStock: 420,
    dailyUsage: 46,
    incomingStock: 0,
    reorderLevel: 300,
    daysRemaining: 9,
    risk: 'HIGH',
    unit: 'vials',
    lastUpdated: 'Today at 08:30 AM'
  },
  {
    id: 'INV-002',
    medicineId: 'MED-102',
    medicineName: 'ORS',
    category: 'Electrolytes',
    facilityId: 'FAC-01',
    facilityName: 'Hospital A',
    openingStock: 1500,
    receivedStock: 200,
    issuedStock: 500,
    currentStock: 1200,
    dailyUsage: 100,
    incomingStock: 0,
    reorderLevel: 800,
    daysRemaining: 12,
    risk: 'MEDIUM',
    unit: 'sachets',
    lastUpdated: 'Today at 09:15 AM'
  },
  {
    id: 'INV-003',
    medicineId: 'MED-103',
    medicineName: 'Antivenom',
    category: 'Emergency / Antidote',
    facilityId: 'FAC-01',
    facilityName: 'Hospital A',
    openingStock: 100,
    receivedStock: 0,
    issuedStock: 20,
    currentStock: 80,
    dailyUsage: 4,
    incomingStock: 20,
    reorderLevel: 50,
    daysRemaining: 20,
    risk: 'LOW',
    unit: 'vials',
    lastUpdated: 'Yesterday at 04:45 PM'
  },
  {
    id: 'INV-004',
    medicineId: 'MED-104',
    medicineName: 'Anti-TB Medicine',
    category: 'Infectious Disease',
    facilityId: 'FAC-01',
    facilityName: 'Hospital A',
    openingStock: 200,
    receivedStock: 50,
    issuedStock: 100,
    currentStock: 150,
    dailyUsage: 12,
    incomingStock: 0,
    reorderLevel: 100,
    daysRemaining: 12,
    risk: 'MEDIUM',
    unit: 'packs',
    lastUpdated: 'Today at 07:10 AM'
  },
  {
    id: 'INV-005',
    medicineId: 'MED-105',
    medicineName: 'Paracetamol',
    category: 'Analgesics',
    facilityId: 'FAC-01',
    facilityName: 'Hospital A',
    openingStock: 3000,
    receivedStock: 1000,
    issuedStock: 1500,
    currentStock: 2500,
    dailyUsage: 120,
    incomingStock: 500,
    reorderLevel: 1000,
    daysRemaining: 21,
    risk: 'LOW',
    unit: 'tablets',
    lastUpdated: 'Today at 10:00 AM'
  },
  {
    id: 'INV-006',
    medicineId: 'MED-101',
    medicineName: 'Insulin',
    category: 'Endocrine / Diabetes',
    facilityId: 'FAC-02',
    facilityName: 'Hospital B',
    openingStock: 600,
    receivedStock: 100,
    issuedStock: 200,
    currentStock: 500,
    dailyUsage: 20,
    incomingStock: 100,
    reorderLevel: 250,
    daysRemaining: 25,
    risk: 'LOW',
    unit: 'vials',
    lastUpdated: 'Today at 08:00 AM'
  },
  {
    id: 'INV-007',
    medicineId: 'MED-106',
    medicineName: 'Amoxicillin',
    category: 'Antibiotics',
    facilityId: 'FAC-02',
    facilityName: 'Hospital B',
    openingStock: 800,
    receivedStock: 200,
    issuedStock: 400,
    currentStock: 600,
    dailyUsage: 35,
    incomingStock: 100,
    reorderLevel: 300,
    daysRemaining: 17,
    risk: 'LOW',
    unit: 'capsules',
    lastUpdated: 'Yesterday at 05:20 PM'
  },
  {
    id: 'INV-008',
    medicineId: 'MED-107',
    medicineName: 'Artemether-Lumefantrine',
    category: 'Antimalarial',
    facilityId: 'FAC-03',
    facilityName: 'Metro Health Center',
    openingStock: 350,
    receivedStock: 50,
    issuedStock: 180,
    currentStock: 220,
    dailyUsage: 18,
    incomingStock: 0,
    reorderLevel: 150,
    daysRemaining: 12,
    risk: 'MEDIUM',
    unit: 'strips',
    lastUpdated: 'Today at 06:40 AM'
  }
];

export const MOCK_PREDICTIONS: StockoutPrediction[] = [
  {
    id: 'PRED-001',
    medicineId: 'MED-101',
    medicineName: 'Insulin',
    category: 'Endocrine / Diabetes',
    facilityId: 'FAC-01',
    facilityName: 'Hospital A',
    currentStock: 420,
    dailyUsage: 46,
    incomingStock: 0,
    predictedDays: 9,
    predictedStockoutDate: 'In 9 days',
    riskLevel: 'HIGH',
    confidence: 91,
    status: 'Critical Alert',
    historicalConsumption: [
      { day: 'Mon', quantity: 40 },
      { day: 'Tue', quantity: 42 },
      { day: 'Wed', quantity: 45 },
      { day: 'Thu', quantity: 48 },
      { day: 'Fri', quantity: 50 }
    ],
    explanation: [
      'Current stock is 420 units.',
      'Average daily usage is 46 units.',
      'No incoming stock is currently recorded.',
      'Based on recent consumption patterns, the system estimates approximately 9 days of remaining stock.',
      'Risk level: HIGH.'
    ],
    recommendation: 'Redistribute 100 units from Hospital B (surplus facility) or expedite supplier emergency batch.'
  },
  {
    id: 'PRED-002',
    medicineId: 'MED-102',
    medicineName: 'ORS',
    category: 'Electrolytes',
    facilityId: 'FAC-01',
    facilityName: 'Hospital A',
    currentStock: 1200,
    dailyUsage: 100,
    incomingStock: 0,
    predictedDays: 12,
    predictedStockoutDate: 'In 12 days',
    riskLevel: 'MEDIUM',
    confidence: 84,
    status: 'Anomaly Detected',
    historicalConsumption: [
      { day: 'Mon', quantity: 45 },
      { day: 'Tue', quantity: 48 },
      { day: 'Wed', quantity: 42 },
      { day: 'Thu', quantity: 0 },
      { day: 'Fri', quantity: 0 }
    ],
    explanation: [
      'Current stock is 1,200 units.',
      'Historical daily usage averaged 100 units/day during active clinics.',
      'Unusual zero-consumption pattern recorded on Thursday and Friday.',
      'Possible reasons: 1. Genuine stockout, 2. Reporting stopped, 3. Data entry problem.',
      'Classification: Requires verification before dispatching stock.'
    ],
    recommendation: 'Initiate telemetry audit and verify dispensary reporting logs with clinical staff.'
  },
  {
    id: 'PRED-003',
    medicineId: 'MED-103',
    medicineName: 'Antivenom',
    category: 'Emergency / Antidote',
    facilityId: 'FAC-01',
    facilityName: 'Hospital A',
    currentStock: 80,
    dailyUsage: 4,
    incomingStock: 20,
    predictedDays: 20,
    predictedStockoutDate: 'In 20 days',
    riskLevel: 'LOW',
    confidence: 88,
    status: 'Stable Buffer',
    historicalConsumption: [
      { day: 'Mon', quantity: 3 },
      { day: 'Tue', quantity: 5 },
      { day: 'Wed', quantity: 4 },
      { day: 'Thu', quantity: 4 },
      { day: 'Fri', quantity: 4 }
    ],
    explanation: [
      'Current stock is 80 units with 20 incoming units due in 5 days.',
      'Average daily usage is 4 units.',
      'Total buffer exceeds 20 days under normal venomous bite incidence curves.',
      'Risk level: LOW.'
    ],
    recommendation: 'Maintain standard regional emergency reserve.'
  },
  {
    id: 'PRED-004',
    medicineId: 'MED-104',
    medicineName: 'Anti-TB Medicine',
    category: 'Infectious Disease',
    facilityId: 'FAC-01',
    facilityName: 'Hospital A',
    currentStock: 150,
    dailyUsage: 12,
    incomingStock: 0,
    predictedDays: 12,
    predictedStockoutDate: 'In 12 days',
    riskLevel: 'MEDIUM',
    confidence: 89,
    status: 'Reorder Window',
    historicalConsumption: [
      { day: 'Mon', quantity: 12 },
      { day: 'Tue', quantity: 11 },
      { day: 'Wed', quantity: 13 },
      { day: 'Thu', quantity: 12 },
      { day: 'Fri', quantity: 14 }
    ],
    explanation: [
      'Current stock is 150 units.',
      'Consistent daily usage is 12 units/day across active cohort patients.',
      'Reorder threshold of 100 units will be crossed in 4 days.',
      'Risk level: MEDIUM.'
    ],
    recommendation: 'Issue routine central procurement indent before reaching critical buffer.'
  }
];

export const MOCK_RECOMMENDATIONS: RedistributionRecommendation[] = [
  {
    id: 'REDIST-001',
    medicineId: 'MED-101',
    medicineName: 'Insulin',
    sourceFacility: 'Hospital B',
    destinationFacility: 'Hospital A',
    sourceStock: 500,
    sourceProjectedExcess: 200,
    destinationStock: 420,
    destinationDailyUsage: 46,
    destinationDaysRemaining: 9,
    recommendedQuantity: 100,
    reason: 'Hospital A is predicted to reach critical stockout in 9 days (or 4 days under surge). Hospital B holds 500 units with 200 units surplus above safety reserve.',
    status: 'Pending Approval',
    createdAt: '2026-09-26 09:30'
  },
  {
    id: 'REDIST-002',
    medicineId: 'MED-106',
    medicineName: 'Amoxicillin',
    sourceFacility: 'Hospital B',
    destinationFacility: 'Metro Health Center',
    sourceStock: 600,
    sourceProjectedExcess: 150,
    destinationStock: 120,
    destinationDailyUsage: 15,
    destinationDaysRemaining: 8,
    recommendedQuantity: 75,
    reason: 'Metro Health Center has 8 days of Amoxicillin remaining due to seasonal pediatric respiratory surge. Hospital B has surplus.',
    status: 'Pending Approval',
    createdAt: '2026-09-26 11:15'
  }
];

export const MOCK_ALERTS: MedicineAlert[] = [
  {
    id: 'ALT-101',
    type: 'HIGH STOCKOUT RISK',
    severity: 'critical',
    title: 'High Stockout Risk: Insulin',
    message: 'Insulin at Hospital A may run out in 9 days (420 units remaining at 46 units/day).',
    facility: 'Hospital A',
    medicine: 'Insulin',
    timestamp: '15 mins ago',
    status: 'Active'
  },
  {
    id: 'ALT-102',
    type: 'ANOMALY DETECTED',
    severity: 'warning',
    title: 'Zero-Consumption Anomaly: ORS',
    message: 'Unusual zero-consumption pattern detected for ORS at Hospital A for 2 consecutive days. Requires verification.',
    facility: 'Hospital A',
    medicine: 'ORS',
    timestamp: '1 hour ago',
    status: 'Active'
  },
  {
    id: 'ALT-103',
    type: 'REDISTRIBUTION OPPORTUNITY',
    severity: 'info',
    title: 'Redistribution Opportunity Found',
    message: 'Redistribution opportunity found: Hospital B → Hospital A (Transfer 100 units Insulin).',
    facility: 'Hospital B → Hospital A',
    medicine: 'Insulin',
    timestamp: '2 hours ago',
    status: 'Active'
  },
  {
    id: 'ALT-104',
    type: 'LOW STOCK',
    severity: 'warning',
    title: 'Reorder Buffer Alert: Anti-TB',
    message: 'Anti-TB Medicine at Hospital A approaching safety reorder threshold (12 days remaining).',
    facility: 'Hospital A',
    medicine: 'Anti-TB Medicine',
    timestamp: '4 hours ago',
    status: 'Active'
  },
  {
    id: 'ALT-105',
    type: 'REPORTING GAP',
    severity: 'warning',
    title: 'Dispensary Reporting Gap',
    message: 'Metro Health Center did not transmit evening dispensation tally for pediatric antibiotics.',
    facility: 'Metro Health Center',
    medicine: 'Amoxicillin',
    timestamp: 'Yesterday',
    status: 'Acknowledged'
  }
];