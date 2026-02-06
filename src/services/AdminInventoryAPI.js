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
      
      const priceValue = parseFloat(productData.price);
      console.log('Price value:', priceValue, 'Type:', typeof priceValue);
      formData.append('price', priceValue);
      
      console.log('Technologies:', productData.technologies);
      if (productData.technologies && Array.isArray(productData.technologies)) {
        const techString = JSON.stringify(productData.technologies);
        console.log('Stringified technologies:', techString);
        formData.append('technologies', techString);
      } else {
        console.log('No technologies, sending empty array');
        formData.append('technologies', JSON.stringify([]));
      }
      
      if (productData.featured_image) {
        console.log('Featured image exists:', productData.featured_image.name);
        console.log('File type:', productData.featured_image.type);
        console.log('File size:', productData.featured_image.size);
        formData.append('featured_image', productData.featured_image);
      } else {
        console.error('NO FEATURED IMAGE - This will cause validation error!');
        throw new Error('Featured image is required');
      }
      
      if (productData.images && Array.isArray(productData.images) && productData.images.length > 0) {
        console.log('Gallery images count:', productData.images.length);
        productData.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      } else {
        console.log('No gallery images');
      }
      
      if (productData.project_files && Array.isArray(productData.project_files) && productData.project_files.length > 0) {
        console.log('Project files count:', productData.project_files.length);
        productData.project_files.forEach((file, index) => {
          formData.append(`project_files[${index}]`, file);
        });
      } else {
        console.log('No project files');
      }
      
      console.log('=== FORM DATA BEING SENT ===');
      for (let pair of formData.entries()) {
        if (pair[0] !== 'featured_image' && 
            !pair[0].startsWith('images[') && 
            !pair[0].startsWith('project_files[')) {
          console.log(pair[0] + ':', pair[1]);
        } else {
          console.log(pair[0] + ':', '[FILE - ' + (pair[1].name || 'file') + ']');
        }
      }
      
      console.log('Sending request to:', `${API_URL}/products`);
      
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const responseText = await response.text();
      console.log('=== RAW SERVER RESPONSE ===');
      console.log('Status:', response.status, response.statusText);
      console.log('Response text:', responseText);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          console.error('=== FULL ERROR RESPONSE ===');
          console.error('Error data:', errorData);
          
          if (errorData.errors) {
            console.error('VALIDATION ERRORS:');
            Object.keys(errorData.errors).forEach(key => {
              console.error(`  ${key}:`, errorData.errors[key]);
            });
            
            let errorMessages = [];
            Object.keys(errorData.errors).forEach(key => {
              errorMessages.push(`${key}: ${errorData.errors[key].join(', ')}`);
            });
            throw new Error(`Validation failed: ${errorMessages.join('; ')}`);
          } else if (errorData.message) {
            throw new Error(errorData.message);
          } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          console.error('Raw response was:', responseText);
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      const data = JSON.parse(responseText);
      console.log('Success! Response:', data);
      return data;
      
    } catch (error) {
      console.error('AdminInventoryAPI - Error creating product:', error);
      throw error;
    }
  },
};