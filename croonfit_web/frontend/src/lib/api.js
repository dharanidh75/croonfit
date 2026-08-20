import { MOCK_PRODUCTS } from './mockData';

// Simulated delay function
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const createMockResponse = (data, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {},
});

class MockApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.interceptors = {
      request: { use: () => {} },
      response: { use: () => {} }
    };
  }

  async get(url, config) {
    await delay();
    if (url.includes('/products/')) {
      const id = url.split('/').pop();
      const product = MOCK_PRODUCTS.find(p => p.id === id || p.slug === id) || MOCK_PRODUCTS[0];
      
      // Augment product with an images array for ProductGallery
      const fullProduct = {
        ...product,
        images: [
          { id: 'img-1', url: product.primary_image, is_primary: true },
          { id: 'img-2', url: product.secondary_image, is_primary: false },
        ].filter(img => img.url)
      };
      
      return createMockResponse(fullProduct);
    }
    if (url.includes('/products')) {
      const urlParams = new URLSearchParams(url.split('?')[1] || '');
      const search = urlParams.get('search')?.toLowerCase() || '';
      
      let filtered = MOCK_PRODUCTS;
      
      if (search) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(search) || 
          p.description?.toLowerCase().includes(search)
        );
      }

      return createMockResponse({
        items: filtered,
        has_more: false,
        total: filtered.length,
        page: 1
      });
    }
    if (url.includes('/orders')) {
      return createMockResponse([
        {
          id: 'mock-order-1',
          created_at: new Date().toISOString(),
          total_amount: 3398,
          status: 'DELIVERED',
          items: [{ product_name: 'Oversized Vintage Tee', quantity: 1 }]
        }
      ]);
    }
    if (url.includes('/admin/stats')) {
      return createMockResponse({
        revenue: 145000,
        orders: 124,
        customers: 89,
        products: 45,
        recent_sales: []
      });
    }
    return createMockResponse({});
  }

  async post(url, data, config) {
    await delay();
    if (url.includes('/auth/login') || url.includes('/admin/login')) {
      return createMockResponse({
        access_token: 'mock-token-123',
        token_type: 'bearer'
      });
    }
    if (url.includes('/auth/me')) {
      return createMockResponse({
        id: 'user-1',
        email: 'mock@example.com',
        full_name: 'Mock User'
      });
    }
    if (url.includes('/orders')) {
      return createMockResponse({
        id: 'mock-order-' + Math.floor(Math.random() * 1000),
        status: 'PENDING',
        total_amount: data?.total_amount || 0
      });
    }
    return createMockResponse({ success: true });
  }

  async put(url, data, config) {
    await delay();
    return createMockResponse({ success: true, ...data });
  }

  async delete(url, config) {
    await delay();
    return createMockResponse({ success: true });
  }
}

const api = new MockApi('/api');
export const adminApi = new MockApi('/api');
export default api;
