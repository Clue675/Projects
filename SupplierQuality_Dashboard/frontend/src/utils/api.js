export const fetchSupplierQualityData = async (vendorId) => {
    try {
      const response = await fetch(`http://localhost:5000/records/${vendorId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };
  
  export const createSupplierQualityRecord = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating record:', error);
      throw error;
    }
  };
  