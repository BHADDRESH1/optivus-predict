import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { InventoryItem, StockoutPrediction, RedistributionRecommendation } from '../types';

export interface ReportExportOptions {
  reportType: 'inventory' | 'stockout' | 'consumption' | 'redistribution' | 'anomaly';
  hospitalId?: string;
  generatedDate?: string;
  inventory?: InventoryItem[];
  predictions?: StockoutPrediction[];
  recommendations?: RedistributionRecommendation[];
  consumptionData?: Array<{ medicine: string; facility: string; usage: number; trend: string; weeklyTotal: number }>;
  anomalies?: Array<{ facility: string; medicine: string; issue: string; type: string; severity: string; status: string; explanation: string }>;
}

/**
 * Clean text to ensure 100% standard ASCII characters for core PDF fonts (Helvetica)
 * Replaces em-dashes, arrows, bullets, and smart quotes to prevent font stream corruption
 */
const sanitizeText = (text: any): string => {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/[—–]/g, ' - ')
    .replace(/[→]/g, ' -> ')
    .replace(/[←]/g, ' <- ')
    .replace(/[•]/g, '* ')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x20-\x7E\r\n\t]/g, ' ')
    .trim();
};

/**
 * Generate a 100% valid, uncorrupted PDF document and trigger browser download via jsPDF save()
 */
export const exportReportToPDF = async (options: ReportExportOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = 20;

      const dateStr = options.generatedDate || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const hospitalName = sanitizeText(options.hospitalId || 'Hospital A (Chennai Central Hub)');

      const reportTitles: Record<string, string> = {
        inventory: 'Medicine Inventory Report',
        stockout: 'Stockout Risk Report',
        consumption: 'Consumption Report',
        redistribution: 'Redistribution Report',
        anomaly: 'Anomaly & Data Quality'
      };

      const currentReportName = reportTitles[options.reportType] || 'Medicine Intelligence Report';

      // 1. HEADER
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(30, 58, 138); // Dark Navy Blue
      doc.text('OPTIVUS Predict', 20, y);
      y += 8;

      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text('Medicine Intelligence Report', 20, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text('AI Medicine Stockout Prediction & Redistribution', 20, y);
      y += 6;

      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Report Date: ${dateStr}`, 20, y);
      y += 5;
      doc.text(`Selected Report: ${currentReportName}`, 20, y);
      y += 5;
      doc.text(`Regional Hub: ${hospitalName}`, 20, y);
      y += 6;

      // Divider line
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.4);
      doc.line(20, y, pageWidth - 20, y);
      y += 10;

      // Helper function for page overflow
      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - 25) {
          doc.addPage();
          y = 20;
        }
      };

      // 2. REPORT SPECIFIC CONTENT
      if (options.reportType === 'redistribution') {
        // --- REDISTRIBUTION AUDIT REPORT ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42);
        doc.text('INTER-FACILITY REDISTRIBUTION AUDIT LEDGER', 20, y);
        y += 8;

        const recs = (options.recommendations && options.recommendations.length > 0)
          ? options.recommendations
          : [
              {
                id: 'REDIST-001',
                medicineId: 'MED-101',
                medicineName: 'Insulin (Human 100IU/ml)',
                sourceFacility: 'Hospital B (Donor Hub)',
                destinationFacility: 'Hospital A (Chennai Central)',
                sourceStock: 500,
                sourceProjectedExcess: 200,
                destinationStock: 420,
                destinationDailyUsage: 46,
                destinationDaysRemaining: 9,
                recommendedQuantity: 100,
                reason: 'Hospital A is predicted to reach critical stockout in 9 days. Hospital B has sufficient surplus stock.',
                status: 'Pending Approval',
                createdAt: '2026-09-26 09:30'
              }
            ];

        recs.forEach((rec, idx) => {
          checkPageBreak(50);

          // Card Background
          doc.setFillColor(248, 250, 252);
          doc.setDrawColor(226, 232, 240);
          doc.rect(20, y, pageWidth - 40, 46, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(15, 23, 42);
          doc.text(`Medicine: ${sanitizeText(rec.medicineName)}`, 24, y + 7);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(51, 65, 85);
          doc.text(`Transfer Quantity: ${rec.recommendedQuantity} units`, 24, y + 14);
          doc.text(`Source Facility: ${sanitizeText(rec.sourceFacility)}`, 24, y + 20);
          doc.text(`Destination Facility: ${sanitizeText(rec.destinationFacility)}`, 24, y + 26);

          // Status with highlight
          doc.setFont('helvetica', 'bold');
          const isApp = rec.status.toLowerCase().includes('approved');
          const isRej = rec.status.toLowerCase().includes('rejected');
          if (isApp) doc.setTextColor(22, 101, 52);
          else if (isRej) doc.setTextColor(185, 28, 28);
          else doc.setTextColor(180, 83, 9);
          doc.text(`Status: ${sanitizeText(rec.status)}`, 130, y + 14);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 116, 139);
          doc.setFontSize(9);
          doc.text(`Date: ${sanitizeText(rec.createdAt)}`, 130, y + 20);

          // Reason (multiline)
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(30, 41, 59);
          doc.text('Reason:', 24, y + 33);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          const reasonText = sanitizeText(rec.reason);
          const reasonLines = doc.splitTextToSize(reasonText, pageWidth - 65);
          doc.text(reasonLines, 40, y + 33);

          y += 52;
        });

      } else if (options.reportType === 'stockout') {
        // --- STOCKOUT RISK REPORT ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42);
        doc.text('STOCKOUT RISK REPORT', 20, y);
        y += 8;

        const preds = options.predictions && options.predictions.length > 0 ? options.predictions : [];
        preds.forEach((p) => {
          checkPageBreak(40);

          doc.setFillColor(248, 250, 252);
          doc.setDrawColor(226, 232, 240);
          doc.rect(20, y, pageWidth - 40, 36, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(15, 23, 42);
          doc.text(`Medicine: ${sanitizeText(p.medicineName)}`, 24, y + 7);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(51, 65, 85);
          doc.text(`Facility: ${sanitizeText(p.facilityName)}`, 24, y + 14);
          doc.text(`Current Stock: ${p.currentStock} units`, 24, y + 20);
          doc.text(`Average Daily Usage: ${p.dailyUsage} units/day`, 24, y + 26);

          doc.setFont('helvetica', 'bold');
          if (p.predictedDays <= 10) doc.setTextColor(225, 29, 72);
          else doc.setTextColor(217, 119, 6);
          doc.text(`Predicted Stockout: ${p.predictedDays} days`, 125, y + 14);
          doc.text(`Risk Level: ${sanitizeText(p.riskLevel)}`, 125, y + 20);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(37, 99, 235);
          doc.text(`Confidence: ${p.confidence}% (Sample AI Prototype)`, 125, y + 26);

          // Reason / Mitigation
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          doc.setFontSize(9);
          const mitText = sanitizeText(`Mitigation / Reason: ${p.recommendation || 'Initiate inter-facility redistribution transfer'}`);
          const mitLines = doc.splitTextToSize(mitText, pageWidth - 48);
          doc.text(mitLines, 24, y + 32);

          y += 42;
        });

      } else if (options.reportType === 'inventory') {
        // --- MEDICINE INVENTORY REPORT ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42);
        doc.text('MEDICINE INVENTORY REPORT', 20, y);
        y += 8;

        // Table Header
        doc.setFillColor(30, 41, 59);
        doc.rect(20, y, pageWidth - 40, 7, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('Medicine', 22, y + 5);
        doc.text('Facility', 68, y + 5);
        doc.text('Current', 105, y + 5);
        doc.text('Daily Burn', 125, y + 5);
        doc.text('Runway', 150, y + 5);
        doc.text('Risk', 170, y + 5);
        y += 7;

        const items = options.inventory && options.inventory.length > 0 ? options.inventory : [];
        items.forEach((item, idx) => {
          checkPageBreak(8);

          if (idx % 2 === 1) {
            doc.setFillColor(248, 250, 252);
            doc.rect(20, y, pageWidth - 40, 6.5, 'F');
          }

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(15, 23, 42);
          doc.text(sanitizeText(item.medicineName).substring(0, 24), 22, y + 4.5);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          doc.text(sanitizeText(item.facilityName).substring(0, 20), 68, y + 4.5);
          doc.text(`${item.currentStock} ${item.unit}`, 105, y + 4.5);
          doc.text(`${item.dailyUsage}/day`, 125, y + 4.5);

          doc.setFont('helvetica', 'bold');
          if (item.daysRemaining <= 10) doc.setTextColor(225, 29, 72);
          else doc.setTextColor(15, 23, 42);
          doc.text(`${item.daysRemaining} days`, 150, y + 4.5);
          doc.text(sanitizeText(item.risk), 170, y + 4.5);

          y += 6.5;
        });

      } else if (options.reportType === 'consumption') {
        // --- CONSUMPTION REPORT ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42);
        doc.text('CONSUMPTION REPORT & TELEMETRY SURGE ANALYSIS', 20, y);
        y += 8;

        const trends = options.consumptionData || [
          { medicine: 'Insulin (Human 100IU/ml)', facility: 'Hospital A', usage: 46, trend: '+15% Demand Surge', weeklyTotal: 322 },
          { medicine: 'ORS (Oral Rehydration Salts)', facility: 'Hospital A', usage: 100, trend: 'Abnormal Drop (Zero Burn on Thu/Fri)', weeklyTotal: 450 },
          { medicine: 'Amoxicillin 500mg', facility: 'Hospital B', usage: 35, trend: 'Stable (+2%)', weeklyTotal: 245 },
          { medicine: 'Anti-TB Medicine', facility: 'Hospital A', usage: 12, trend: 'Cohort Maintenance (0%)', weeklyTotal: 84 },
          { medicine: 'Antivenom Polyvalent', facility: 'Hospital A', usage: 4, trend: 'Baseline Buffer', weeklyTotal: 28 }
        ];

        trends.forEach((t) => {
          checkPageBreak(22);

          doc.setFillColor(248, 250, 252);
          doc.setDrawColor(226, 232, 240);
          doc.rect(20, y, pageWidth - 40, 18, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          doc.text(`${sanitizeText(t.medicine)} (${sanitizeText(t.facility)})`, 24, y + 6);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105);
          doc.text(`Daily Velocity: ${t.usage} units/day | Weekly Total: ${t.weeklyTotal} units | Trend: ${sanitizeText(t.trend)}`, 24, y + 12);

          y += 22;
        });

      } else if (options.reportType === 'anomaly') {
        // --- ANOMALY & DATA QUALITY REPORT ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42);
        doc.text('ANOMALY & DATA QUALITY REPORT', 20, y);
        y += 8;

        const anomList = options.anomalies || [
          {
            facility: 'Hospital A (Chennai Central)',
            medicine: 'ORS (Oral Rehydration Salts)',
            issue: 'Abrupt 2-Day Zero Consumption Drop',
            type: 'Telemetry Reporting Anomaly',
            severity: 'Requires verification',
            status: 'Pending Clinical Log Audit',
            explanation: 'Mon (45), Tue (48), Wed (42), Thu (0), Fri (0). Distinguishing genuine stockouts from transmission outages pre-empts false emergency re-orders.'
          }
        ];

        anomList.forEach((anom) => {
          checkPageBreak(36);

          doc.setFillColor(254, 252, 232);
          doc.setDrawColor(254, 240, 138);
          doc.rect(20, y, pageWidth - 40, 32, 'FD');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(133, 77, 14);
          doc.text(`[ ${sanitizeText(anom.severity)} ] ${sanitizeText(anom.medicine)} @ ${sanitizeText(anom.facility)}`, 24, y + 6);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(15, 23, 42);
          doc.text(`Issue: ${sanitizeText(anom.issue)} (${sanitizeText(anom.type)})`, 24, y + 13);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105);
          const explText = sanitizeText(`Details: ${anom.explanation}`);
          const explLines = doc.splitTextToSize(explText, pageWidth - 48);
          doc.text(explLines, 24, y + 19);

          y += 38;
        });
      }

      // 3. FOOTER (Every Page)
      const pageCount = doc.getNumberOfPages();
      for (let p = 1; p <= pageCount; p++) {
        doc.setPage(p);
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.4);
        doc.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text('Prototype / Demo Data', 20, pageHeight - 10);
        doc.text(`Page ${p} of ${pageCount}`, (pageWidth / 2) - 8, pageHeight - 10);
        doc.text('OPTIVUS Predict - Sustain-a-thon 2026', pageWidth - 78, pageHeight - 10);
      }

      // 4. BROWSER DOWNLOAD VIA REPORT-SPECIFIC FILENAME AND VALIDATED BLOB
      const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local browser time
      const reportFileMap: Record<string, string> = {
        inventory: `OPTIVUS_Medicine_Inventory_Report_${today}.pdf`,
        stockout: `OPTIVUS_Stockout_Risk_Report_${today}.pdf`,
        consumption: `OPTIVUS_Consumption_Report_${today}.pdf`,
        redistribution: `OPTIVUS_Redistribution_Report_${today}.pdf`,
        anomaly: `OPTIVUS_Anomaly_Data_Quality_Report_${today}.pdf`
      };
      const filename = reportFileMap[options.reportType] || `OPTIVUS_Medicine_Intelligence_Report_${today}.pdf`;

      const pdfBlob = doc.output('blob');

      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error('Generated PDF is empty');
      }

      if (pdfBlob.type !== 'application/pdf') {
        throw new Error('Generated file is not a PDF');
      }

      // Create a named File from the Blob so browser associates the human-readable filename directly with the resource
      const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfFile);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.setAttribute('download', filename);
      link.style.display = 'none';

      document.body.appendChild(link);

      console.log('PDF download filename:', link.download);
      console.log('PDF href:', link.href);
      console.log('PDF type:', pdfBlob.type);
      console.log('PDF size:', pdfBlob.size);

      link.click();

      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);

      resolve(filename);
    } catch (err: any) {
      console.error('jsPDF generation failed:', err);
      reject(err);
    }
  });
};

/**
 * Generate and download an Excel Spreadsheet (.xlsx) using existing xlsx library
 */
export const exportReportToExcel = async (options: ReportExportOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const workbook = XLSX.utils.book_new();
      const today = new Date().toISOString().split('T')[0];
      const dateStr = options.generatedDate || new Date().toLocaleString();
      const hospitalName = options.hospitalId || 'Hospital A (Chennai Central Hub)';

      // 1. SHEET: Executive Summary
      const summaryData = [
        ['OPTIVUS Predict - Medicine Intelligence Report'],
        ['AI-Powered Medicine Stockout Prediction & Smart Redistribution'],
        ['Sustain-a-thon 2026 | PS-03-S2 | SDG 3: Good Health and Well-being'],
        [''],
        ['Report Generated Date', dateStr],
        ['Regional Facility / Hub', hospitalName],
        ['Active Report Focus', options.reportType.toUpperCase()],
        ['Data Classification', 'Prototype / Demo Data (Sample AI Prototype)'],
        [''],
        ['Key Regional Supply Metrics', 'Value'],
        ['Total Medicines Monitored', '128'],
        ['High-Risk Items (<10 Days)', '7'],
        ['Predicted Stockouts in Next 14 Days', '4'],
        ['Active Redistribution Matches', '3'],
        [''],
        ['Stockout Forecast Formula', 'Days Remaining = Current Stock / Average Daily Usage'],
        ['Redistribution Trigger', 'Target < 10 days deficit matched with regional donor holding > 30 days reserve.']
      ];
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      summarySheet['!cols'] = [{ wch: 32 }, { wch: 45 }];
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive Summary');

      // 2. SHEET: Medicine Inventory
      const invRows = (options.inventory || []).map(item => [
        item.medicineName,
        item.facilityName,
        item.currentStock,
        item.dailyUsage,
        item.incomingStock,
        `${item.daysRemaining} days`,
        item.risk,
        '91%',
        item.lastUpdated || 'Today at 08:30 AM'
      ]);
      const invHeaders = [
        ['Medicine', 'Facility', 'Current Stock', 'Average Daily Usage', 'Incoming Stock', 'Predicted Stockout', 'Risk Level', 'Confidence', 'Last Updated']
      ];
      const invSheet = XLSX.utils.aoa_to_sheet([...invHeaders, ...invRows]);
      invSheet['!cols'] = [{ wch: 28 }, { wch: 20 }, { wch: 14 }, { wch: 18 }, { wch: 14 }, { wch: 18 }, { wch: 12 }, { wch: 12 }, { wch: 22 }];
      XLSX.utils.book_append_sheet(workbook, invSheet, 'Medicine Inventory');

      // 3. SHEET: Stockout Risk
      const predRows = (options.predictions || []).map(p => [
        p.medicineName,
        p.facilityName,
        `${p.predictedDays} days`,
        p.riskLevel,
        `${p.confidence}% (Sample AI)`,
        p.recommendation || 'Initiate inter-facility redistribution transfer'
      ]);
      const predHeaders = [
        ['Medicine', 'Facility', 'Predicted Stockout', 'Risk', 'Confidence', 'Reason']
      ];
      const predSheet = XLSX.utils.aoa_to_sheet([...predHeaders, ...predRows]);
      predSheet['!cols'] = [{ wch: 28 }, { wch: 20 }, { wch: 18 }, { wch: 12 }, { wch: 22 }, { wch: 65 }];
      XLSX.utils.book_append_sheet(workbook, predSheet, 'Stockout Risk');

      // 4. SHEET: Redistribution
      const redistRows = (options.recommendations || []).map(r => [
        r.medicineName,
        r.sourceFacility,
        r.destinationFacility,
        r.recommendedQuantity,
        r.status,
        r.reason,
        r.createdAt
      ]);
      const redistHeaders = [
        ['Medicine', 'Source Facility', 'Destination Facility', 'Quantity', 'Status', 'Reason', 'Date']
      ];
      const redistSheet = XLSX.utils.aoa_to_sheet([...redistHeaders, ...redistRows]);
      redistSheet['!cols'] = [{ wch: 28 }, { wch: 22 }, { wch: 22 }, { wch: 12 }, { wch: 18 }, { wch: 65 }, { wch: 18 }];
      XLSX.utils.book_append_sheet(workbook, redistSheet, 'Redistribution');

      // 5. SHEET: Anomaly & Data Quality
      const anomRows = (options.anomalies || [
        {
          facility: 'Hospital A',
          medicine: 'ORS',
          issue: 'Abrupt 2-Day Zero Consumption Drop',
          type: 'Reporting Anomaly',
          severity: 'Warning',
          status: 'Requires verification',
          explanation: 'Dispensary logging gap on Thu/Fri. Telemetry verification pre-empts false emergency re-orders.'
        }
      ]).map(a => [
        a.medicine,
        a.facility,
        a.issue,
        a.severity,
        a.status,
        a.explanation
      ]);
      const anomHeaders = [
        ['Medicine', 'Facility', 'Detected Issue', 'Severity', 'Status', 'Explanation']
      ];
      const anomSheet = XLSX.utils.aoa_to_sheet([...anomHeaders, ...anomRows]);
      anomSheet['!cols'] = [{ wch: 25 }, { wch: 18 }, { wch: 30 }, { wch: 14 }, { wch: 22 }, { wch: 65 }];
      XLSX.utils.book_append_sheet(workbook, anomSheet, 'Anomaly & Data Quality');

      // 6. Native XLSX Write and Download with report-specific filename
      const excelFileMap: Record<string, string> = {
        inventory: `OPTIVUS_Medicine_Inventory_Report_${today}.xlsx`,
        stockout: `OPTIVUS_Stockout_Risk_Report_${today}.xlsx`,
        consumption: `OPTIVUS_Consumption_Report_${today}.xlsx`,
        redistribution: `OPTIVUS_Redistribution_Report_${today}.xlsx`,
        anomaly: `OPTIVUS_Anomaly_Data_Quality_Report_${today}.xlsx`
      };
      const filename = excelFileMap[options.reportType] || `OPTIVUS_Medicine_Intelligence_Report_${today}.xlsx`;
      XLSX.writeFile(workbook, filename);

      resolve(filename);
    } catch (err: any) {
      reject(err);
    }
  });
};

/**
 * CSV Fallback export with RFC 4180 escaping
 */
export const exportReportToCSV = async (options: ReportExportOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const escapeCSV = (val: any): string => {
        if (val === null || val === undefined) return '""';
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return `"${str}"`;
      };

      const rows: string[][] = [];

      if (options.reportType === 'redistribution') {
        rows.push(['Medicine', 'Source Facility', 'Destination Facility', 'Quantity', 'Status', 'Reason', 'Date']);
        (options.recommendations || []).forEach(r => {
          rows.push([r.medicineName, r.sourceFacility, r.destinationFacility, String(r.recommendedQuantity), r.status, r.reason, r.createdAt]);
        });
      } else if (options.reportType === 'stockout') {
        rows.push(['Medicine', 'Facility', 'Current Stock', 'Daily Usage', 'Predicted Stockout', 'Risk', 'Confidence', 'Reason']);
        (options.predictions || []).forEach(p => {
          rows.push([p.medicineName, p.facilityName, String(p.currentStock), String(p.dailyUsage), `${p.predictedDays} days`, p.riskLevel, `${p.confidence}%`, p.recommendation || '']);
        });
      } else {
        rows.push(['Medicine', 'Facility', 'Current Stock', 'Daily Usage', 'Incoming Stock', 'Days Remaining', 'Risk Level', 'Last Updated']);
        (options.inventory || []).forEach(i => {
          rows.push([i.medicineName, i.facilityName, String(i.currentStock), String(i.dailyUsage), String(i.incomingStock), `${i.daysRemaining} days`, i.risk, i.lastUpdated || '']);
        });
      }

      const csvContent = rows.map(r => r.map(escapeCSV).join(',')).join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const today = new Date().toISOString().split('T')[0];
      const filename = `OPTIVUS_Medicine_Intelligence_Report_${today}.csv`;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 1000);

      resolve(filename);
    } catch (err: any) {
      reject(err);
    }
  });
};

// Backward compatibility alias for any existing code
export const exportToPDF = (data: any) => {
  return exportReportToPDF({
    reportType: 'inventory',
    hospitalId: data?.hospitalId,
    totalMedicines: data?.totalMedicines,
    highRiskCount: data?.highRiskCount
  });
};

export const exportToExcel = (data: any) => {
  return exportReportToExcel({
    reportType: 'inventory',
    hospitalId: data?.hospitalId,
    inventory: data?.items
  });
};
