export enum Role {
  ADMIN = 'Admin',
  HOSPITAL_HEAD = 'Hospital Head',
  SUPERVISOR = 'Supervisor',
  TECHNICIAN = 'Pharmacist',
  PHARMACIST = 'Pharmacist'
}

export enum Status {
  IN_STOCK = 'In Stock',
  LOW_STOCK = 'Low Stock',
  CRITICAL = 'Critical Shortage',
  SURPLUS = 'Surplus',
  REORDERED = 'Reordered',
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}

export enum AiStatus {
  VERIFIED = 'Verified',
  NEEDS_REVIEW = 'Needs Review',
  PROCESSING = 'Processing',
  ANOMALY = 'Anomaly Flagged',
  REJECTED = 'Rejected'
}

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Medicine {
  id: string;
  name: string;
  category: string;
  unit: string;
  reorderLevel: number;
  description?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: string; // 'Hospital' | 'Clinic' | 'Health Center'
  location: string;
  medicinesCount: number;
  highRiskCount: number;
  alertsCount: number;
  status: 'Active' | 'Inactive';
}

export interface InventoryItem {
  id: string;
  medicineId: string;
  medicineName: string;
  category: string;
  facilityId: string;
  facilityName: string;
  openingStock: number;
  receivedStock: number;
  issuedStock: number;
  currentStock: number;
  dailyUsage: number;
  incomingStock: number;
  reorderLevel: number;
  daysRemaining: number;
  risk: RiskLevel;
  unit: string;
  lastUpdated: string;
}

export interface StockoutPrediction {
  id: string;
  medicineId: string;
  medicineName: string;
  category: string;
  facilityId: string;
  facilityName: string;
  currentStock: number;
  dailyUsage: number;
  incomingStock: number;
  predictedDays: number;
  predictedStockoutDate: string;
  riskLevel: RiskLevel;
  confidence: number; // Percentage (e.g. 91)
  status: string;
  historicalConsumption: { day: string; quantity: number }[];
  explanation: string[];
  recommendation?: string;
}

export interface RedistributionRecommendation {
  id: string;
  medicineId: string;
  medicineName: string;
  sourceFacility: string;
  destinationFacility: string;
  sourceStock: number;
  sourceProjectedExcess: number;
  destinationStock: number;
  destinationDailyUsage: number;
  destinationDaysRemaining: number;
  recommendedQuantity: number;
  reason: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected' | 'In Transit';
  createdAt: string;
  approvedBy?: string;
}

export interface MedicineAlert {
  id: string;
  type: 'HIGH STOCKOUT RISK' | 'ANOMALY DETECTED' | 'LOW STOCK' | 'REDISTRIBUTION OPPORTUNITY' | 'REPORTING GAP' | 'INCOMING STOCK DELAY';
  severity: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  facility: string;
  medicine: string;
  timestamp: string;
  status: 'Active' | 'Resolved' | 'Acknowledged';
}

export interface ConsumptionRecord {
  date: string;
  quantityUsed: number;
  medicineName: string;
  facilityName: string;
  isAnomaly?: boolean;
}