const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch all vendors from the API.
export const fetchVendors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vendors`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem fetching vendors:', error);
  }
};

// Create a new vendor entry in the database.
export const createVendor = async (vendorData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vendors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendorData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem creating a vendor:', error);
  }
};

// Update an existing vendor's information.
export const updateVendor = async (vendorId, vendorData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vendors/${vendorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendorData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem updating the vendor:', error);
  }
};

// Delete a vendor from the database.
export const deleteVendor = async (vendorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vendors/${vendorId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem deleting the vendor:', error);
  }
};

// Fetch specific vendor details by their ID.
export const fetchVendorById = async (vendorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vendors/${vendorId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`There was a problem fetching data for vendor ID ${vendorId}:`, error);
  }
};

// Search for vendors based on a name query.
export const searchVendorsByName = async (searchTerm) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vendors/search?name=${searchTerm}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`There was a problem searching for vendors with name ${searchTerm}:`, error);
  }
};

// Fetch performance reports for a specific vendor.
export const fetchVendorPerformance = async (vendorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vendors/${vendorId}/performance`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`There was a problem fetching performance data for vendor ID ${vendorId}:`, error);
  }
};

// Fetch certification details for a specific vendor.
export const fetchVendorCertifications = async (vendorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vendors/${vendorId}/certifications`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`There was a problem fetching certifications for vendor ID ${vendorId}:`, error);
  }
};

// Additional functionalities can be added here as per your application's needs.
