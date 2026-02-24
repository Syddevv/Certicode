const API_URL = 'http://127.0.0.1:8000/api';

export const AdminInventoryAPI = {
  getProducts: async (page = 1, filters = {}) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found.');
      }
      
      let url = `${API_URL}/inventory/products?page=${page}&per_page=5`;
      
      if (filters.category && filters.category !== 'all') {
        url += `&category=${encodeURIComponent(filters.category)}`;
      }
      if (filters.status && filters.status !== 'all') {
        url += `&status=${encodeURIComponent(filters.status)}`;
      }
      if (filters.search) {
        url += `&search=${encodeURIComponent(filters.search)}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: 'Server error' };
        }
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = JSON.parse(responseText);
      return data;
      
    } catch (error) {
      console.error('AdminInventoryAPI - Error fetching products:', error);
      throw error;
    }
  },

  getInventoryStats: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found.');
      }
      
      const response = await fetch(`${API_URL}/inventory/stats`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: 'Server error' };
        }
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = JSON.parse(responseText);
      return data;
      
    } catch (error) {
      console.error('AdminInventoryAPI - Error fetching inventory stats:', error);
      throw error;
    }
  },

  getProductById: async (productId) => {
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: 'Server error' };
        }
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = JSON.parse(responseText);
      return data?.data || data?.product || data;
    } catch (error) {
      console.error('AdminInventoryAPI - Error fetching product by ID:', error);
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found.');
      }
      
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: 'Server error' };
        }
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = JSON.parse(responseText);
      return data;
      
    } catch (error) {
      console.error('AdminInventoryAPI - Error deleting product:', error);
      throw error;
    }
  },

  updateProductStatus: async (productId, status) => {
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch(`${API_URL}/products/${productId}/status`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: 'Server error' };
        }
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error('AdminInventoryAPI - Error updating product status:', error);
      throw error;
    }
  },

  updateProduct: async (productId, productData) => {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found.');
    }
    
    const formData = new FormData();
    
    formData.append('name', productData.name || '');
    formData.append('asset_type', productData.asset_type || '');
    formData.append('description', productData.description || '');
    formData.append('version', productData.version || '1.0');
    formData.append('price', productData.price || 0);
    if (productData.status) {
      formData.append('status', productData.status);
    }
    
    if (productData.technologies && Array.isArray(productData.technologies)) {
      formData.append('technologies', JSON.stringify(productData.technologies));
    }
    
    if (productData.existing_images && Array.isArray(productData.existing_images)) {
      formData.append('existing_images', JSON.stringify(productData.existing_images));
    }
    
    if (productData.existing_project_files && Array.isArray(productData.existing_project_files)) {
      formData.append('existing_project_files', JSON.stringify(productData.existing_project_files));
    }
    
    if (productData.featured_image && productData.featured_image instanceof File) {
      formData.append('featured_image', productData.featured_image);
    } else if (productData.existing_featured_image) {
      formData.append('existing_featured_image', productData.existing_featured_image);
    }
    
    if (productData.images && Array.isArray(productData.images)) {
      productData.images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append(`images[${index}]`, image);
        }
      });
    }
    
    if (productData.project_files && Array.isArray(productData.project_files)) {
      productData.project_files.forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`project_files[${index}]`, file);
        }
      });
    }
    
    formData.append('_method', 'PUT');
    
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: 'Server error' };
      }
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return JSON.parse(responseText);
    
  } catch (error) {
    console.error('AdminInventoryAPI - Error updating product:', error);
    throw error;
  }
},

createProduct: async (productData) => {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No authentication token found.');
    }
    
    const formData = new FormData();
    
    formData.append('name', productData.name || '');
    formData.append('asset_type', productData.asset_type || '');
    formData.append('description', productData.description || '');
    formData.append('version', productData.version || '1.0');
    formData.append('price', productData.price || 0);
    
    if (productData.technologies && Array.isArray(productData.technologies)) {
      formData.append('technologies', JSON.stringify(productData.technologies));
    }
    
    if (productData.featured_image) {
      formData.append('featured_image', productData.featured_image);
    }
    
    if (productData.images && Array.isArray(productData.images)) {
      productData.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }
    
    if (productData.project_files && Array.isArray(productData.project_files)) {
      productData.project_files.forEach((file, index) => {
        formData.append(`project_files[${index}]`, file);
      });
    }
    
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: 'Server error' };
      }
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = JSON.parse(responseText);
    return data;
    
  } catch (error) {
    console.error('AdminInventoryAPI - Error creating product:', error);
    throw error;
  }
},

   createProduct: async (productData) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found.');
      }
      
      const formData = new FormData();
      
      Object.keys(productData).forEach(key => {
        if (key !== 'featured_image' && key !== 'images' && key !== 'project_files') {
          formData.append(key, productData[key]);
        }
      });
      
      if (productData.featured_image) {
        formData.append('featured_image', productData.featured_image);
      }
      
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }
      
      if (productData.project_files && productData.project_files.length > 0) {
        productData.project_files.forEach((file, index) => {
          formData.append(`project_files[${index}]`, file);
        });
      }
      
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: 'Server error' };
        }
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = JSON.parse(responseText);
      return data;
      
    } catch (error) {
      console.error('AdminInventoryAPI - Error creating product:', error);
      throw error;
    }
  },
};
