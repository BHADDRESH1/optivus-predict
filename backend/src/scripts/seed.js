import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Medicine from '../models/Medicine.js';
import Facility from '../models/Facility.js';
import Inventory from '../models/Inventory.js';
import Prediction from '../models/Prediction.js';
import RedistributionRecommendation from '../models/RedistributionRecommendation.js';
import Alert from '../models/Alert.js';

dotenv.config();

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing collections
    console.log('Clearing old collections...');
    await User.deleteMany({});
    await Medicine.deleteMany({});
    await Facility.deleteMany({});
    await Inventory.deleteMany({});
    await Prediction.deleteMany({});
    await RedistributionRecommendation.deleteMany({});
    await Alert.deleteMany({});

    // 1. Seed Users (Preserving authentication credentials)
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = [
      {
        name: 'Dr. Suresh Kumar',
        email: 'admin@optivus.com',
        password: hashedPassword,
        role: 'Admin',
        department: 'Pharmacy & Medical Supplies',
        whatsapp: '+91 98401 23456',
        status: 'Active'
      },
      {
        name: 'Dr. Meenakshi Sundaram',
        email: 'head@optivus.com',
        password: hashedPassword,
        role: 'Hospital Head',
        department: 'Clinical Governance',
        whatsapp: '+91 98402 34567',
        status: 'Active'
      },
      {
        name: 'Priya Rajendran',
        email: 'supervisor@optivus.com',
        password: hashedPassword,
        role: 'Supervisor',
        department: 'Central Medicine Store',
        whatsapp: '+91 98403 45678',
        status: 'Active'
      },
      {
        name: 'Karthik Natarajan',
        email: 'pharmacist@optivus.com',
        password: hashedPassword,
        role: 'Pharmacist',
        department: 'Dispensary',
        whatsapp: '+91 98404 56789',
        status: 'Active'
      }
    ];
    await User.insertMany(users);
    console.log('✅ Seeded users');

    // 2. Seed Facilities
    const facilities = [
      { facilityId: 'FAC-01', name: 'Hospital A', type: 'Tertiary Hospital', location: 'Chennai Central', medicinesCount: 128, highRiskCount: 7, alertsCount: 4, status: 'Active' },
      { facilityId: 'FAC-02', name: 'Hospital B', type: 'General Hospital', location: 'Chennai South', medicinesCount: 135, highRiskCount: 2, alertsCount: 1, status: 'Active' },
      { facilityId: 'FAC-03', name: 'Metro Health Center', type: 'Community Health Clinic', location: 'Chennai North', medicinesCount: 64, highRiskCount: 1, alertsCount: 0, status: 'Active' },
      { facilityId: 'FAC-04', name: 'Tambaram Sub-Center', type: 'Primary Health Center', location: 'Tambaram, Chennai', medicinesCount: 48, highRiskCount: 0, alertsCount: 0, status: 'Active' }
    ];
    await Facility.insertMany(facilities);
    console.log('✅ Seeded facilities');

    // 3. Seed Medicines
    const medicines = [
      { medicineId: 'MED-101', name: 'Insulin (Human 100IU/ml)', category: 'Endocrine / Diabetes', unit: 'vials', reorderLevel: 300, description: 'Essential hormone for diabetic patient glycemic control' },
      { medicineId: 'MED-102', name: 'ORS (Oral Rehydration Salts)', category: 'Electrolytes', unit: 'sachets', reorderLevel: 800, description: 'WHO formulation for dehydration management' },
      { medicineId: 'MED-103', name: 'Antivenom (Polyvalent)', category: 'Emergency / Antidote', unit: 'vials', reorderLevel: 50, description: 'Life-saving polyvalent snake antivenom serum' },
      { medicineId: 'MED-104', name: 'Anti-TB Medicine', category: 'Infectious Disease', unit: 'packs', reorderLevel: 100, description: 'Rifampicin + Isoniazid combination therapy' },
      { medicineId: 'MED-105', name: 'Paracetamol 500mg', category: 'Analgesics', unit: 'tablets', reorderLevel: 1000, description: 'First-line fever and mild pain management' },
      { medicineId: 'MED-106', name: 'Amoxicillin 500mg', category: 'Antibiotics', unit: 'capsules', reorderLevel: 300, description: 'Broad spectrum penicillin antibiotic' },
      { medicineId: 'MED-107', name: 'Artemether-Lumefantrine', category: 'Antimalarial', unit: 'strips', reorderLevel: 150, description: 'First-line ACT antimalarial therapeutic' }
    ];
    await Medicine.insertMany(medicines);
    console.log('✅ Seeded medicines');

    // 4. Seed Inventory (Consistent with Section 6 & 21)
    const inventory = [
      {
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
      }
    ];
    await Inventory.insertMany(inventory);
    console.log('✅ Seeded inventory');

    // 5. Seed Predictions
    const predictions = [
      {
        predictionId: 'PRED-001',
        medicineId: 'MED-101',
        medicineName: 'Insulin',
        facilityId: 'FAC-01',
        facilityName: 'Hospital A',
        currentStock: 420,
        dailyUsage: 46,
        incomingStock: 0,
        predictedStockoutDate: 'In 9 days',
        daysRemaining: 9,
        riskLevel: 'HIGH',
        confidence: 91,
        explanation: [
          'Current stock is 420 units.',
          'Average daily usage is 46 units.',
          'No incoming stock is currently recorded.',
          'Based on recent consumption patterns, the system estimates approximately 9 days of remaining stock.',
          'Risk level: HIGH.'
        ],
        recommendation: 'Redistribute 100 units from Hospital B (surplus facility) or expedite supplier emergency batch.'
      }
    ];
    await Prediction.insertMany(predictions);
    console.log('✅ Seeded predictions');

    // 6. Seed Redistribution
    const redistributions = [
      {
        recommendationId: 'REDIST-001',
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
        reason: 'Hospital A predicted to run out in 9 days. Hospital B holds 200 units surplus above safety reserve.',
        status: 'Pending Approval'
      }
    ];
    await RedistributionRecommendation.insertMany(redistributions);
    console.log('✅ Seeded redistribution recommendations');

    // 7. Seed Alerts
    const alerts = [
      {
        alertId: 'ALT-101',
        type: 'HIGH STOCKOUT RISK',
        severity: 'critical',
        title: 'High Stockout Risk: Insulin',
        message: 'Insulin at Hospital A may run out in 9 days (420 units remaining at 46 units/day).',
        facility: 'Hospital A',
        medicine: 'Insulin',
        status: 'Active'
      },
      {
        alertId: 'ALT-102',
        type: 'ANOMALY DETECTED',
        severity: 'warning',
        title: 'Zero-Consumption Anomaly: ORS',
        message: 'Unusual zero-consumption pattern detected for ORS at Hospital A for 2 consecutive days. Requires verification.',
        facility: 'Hospital A',
        medicine: 'ORS',
        status: 'Active'
      },
      {
        alertId: 'ALT-103',
        type: 'REDISTRIBUTION OPPORTUNITY',
        severity: 'info',
        title: 'Redistribution Opportunity Found',
        message: 'Redistribution opportunity found: Hospital B → Hospital A (Transfer 100 units Insulin).',
        facility: 'Hospital B → Hospital A',
        medicine: 'Insulin',
        status: 'Active'
      }
    ];
    await Alert.insertMany(alerts);
    console.log('✅ Seeded alerts');

    console.log('\n🎉 Seed completed successfully for OPTIVUS Predict!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedData();
