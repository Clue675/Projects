const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchPurchaseOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/purchasing/orders`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem fetching purchase orders:', error);
  }
};

export const createPurchaseOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/purchasing/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem creating a purchase order:', error);
  }
};

export const updatePurchaseOrder = async (orderId, orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/purchasing/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem updating the purchase order:', error);
  }
};

export const deletePurchaseOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/purchasing/orders/${orderId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem deleting the purchase order:', error);
  }
};

export const fetchPurchaseOrderById = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/purchasing/orders/${orderId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`There was a problem fetching data for purchase order ID ${orderId}:`, error);
  }
};

export const searchPurchaseOrders = async (searchCriteria) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/purchasing/orders/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchCriteria),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem searching purchase orders:', error);
  }
};

export const fetchOrdersByVendor = async (vendorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/purchasing/orders/vendor/${vendorId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`There was a problem fetching orders for vendor ID ${vendorId}:`, error);
  }
};

export const changeOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/purchasing/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`There was a problem changing the status of order ID ${orderId}:`, error);
  }
};

export const fetchPurchaseOrderAnalysis = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/purchasing/analysis`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem fetching purchase order analysis:', error);
  }
};

export const bulkUpdateOrders = async (ordersData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/purchasing/orders/bulk-update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ordersData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem with bulk updating orders:', error);
  }
};


