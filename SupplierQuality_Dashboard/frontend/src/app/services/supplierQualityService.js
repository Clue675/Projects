const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch all supplier quality records
export const fetchSupplierQualityRecords = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/supplier_quality/records`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem fetching supplier quality records:', error);
  }
};

// Create a new supplier quality record
export const createSupplierQualityRecord = async (qualityData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/supplier_quality/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(qualityData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem creating a supplier quality record:', error);
  }
};

// Update an existing supplier quality record
export const updateSupplierQualityRecord = async (recordId, qualityData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/supplier_quality/records/${recordId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(qualityData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem updating the supplier quality record:', error);
  }
};

// Delete a supplier quality record
export const deleteSupplierQualityRecord = async (recordId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/supplier_quality/records/${recordId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem deleting the supplier quality record:', error);
  }
};

// Fetch a specific supplier quality record by ID
export const fetchSupplierQualityRecordById = async (recordId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/supplier_quality/records/${recordId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`There was a problem fetching the supplier quality record with ID ${recordId}:`, error);
  }
};

// Additional functions for other specific supplier quality-related operations can be added here.
