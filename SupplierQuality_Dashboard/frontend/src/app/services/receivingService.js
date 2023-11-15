const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch all receiving inspection records
export const fetchReceivingInspectionRecords = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/receiving_inspection/records`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem fetching receiving inspection records:', error);
  }
};

// Create a new receiving inspection record
export const createReceivingInspectionRecord = async (recordData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/receiving_inspection/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recordData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem creating a receiving inspection record:', error);
  }
};

// Create a new discrepancy report
export const createDiscrepancyReport = async (discrepancyReportData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/discrepancy/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discrepancyReportData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem creating a discrepancy report:', error);
  }
};

// Enhanced function to handle creating a receiving inspection record with the potential to create a discrepancy report
export const createReceivingInspectionRecordWithDR = async (recordData) => {
  try {
    const inspectionRecordResponse = await createReceivingInspectionRecord(recordData);
    const inspectionRecord = await inspectionRecordResponse.json();

    // Create a DR if there are any discrepancies
    if (recordData.total_parts_rejected > 0) {
      const discrepancyReportData = {
        order_id: recordData.order_id,
        issue_details: recordData.rejection_details,
        inspector_name: recordData.inspector_name,
        inspection_date: recordData.inspection_date,
        // Include additional data as required
      };
      await createDiscrepancyReport(discrepancyReportData);
    }

    return inspectionRecord;
  } catch (error) {
    console.error('There was a problem creating a receiving inspection record with a discrepancy report:', error);
  }
};

// Additional functions for specific operations related to receiving inspections can be added here
