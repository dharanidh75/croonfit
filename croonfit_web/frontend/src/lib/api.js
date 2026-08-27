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
    if (url.includes('/categories')) {
      return createMockResponse([
        { id: 1, name: 'T-Shirts', slug: 't-shirts', gender: 'MENS', products: [1,2,3] },
        { id: 2, name: 'Polos', slug: 'polos', gender: 'MENS', products: [4] },
        { id: 3, name: 'Pants', slug: 'pants', gender: 'MENS', products: [5] },
        { id: 4, name: 'Hoodies', slug: 'hoodies', gender: 'MENS', products: [] }
      ]);
    }
    if (url.includes('/products/') && !url.includes('/categories')) {
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
          id: '1042',
          created_at: new Date(Date.now() - 10 * 60000).toISOString(),
          total_amount: 3398.00,
          status: 'PENDING',
          payment_status: 'PAID',
          customer: { name: 'Arjun M.', email: 'arjun.m@example.com', phone: '+91 9876543210' },
          shipping_address: '123 Main St, Apartment 4B, Mumbai, Maharashtra, 400001',
          items: [
            { product_name: 'Oversized Vintage Tee', quantity: 2, price: 1499, color: 'White', size: 'M' }
          ]
        },
        {
          id: '1041',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          total_amount: 1899.00,
          status: 'SHIPPED',
          payment_status: 'PAID',
          customer: { name: 'Priya S.', email: 'priya.s@example.com', phone: '+91 9123456789' },
          shipping_address: '45 Park Avenue, Bangalore, Karnataka, 560001',
          items: [
            { product_name: 'Premium Cotton Polo', quantity: 1, price: 1899, color: 'Navy', size: 'L' }
          ]
        },
        {
          id: '1040',
          created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
          total_amount: 2499.00,
          status: 'DELIVERED',
          payment_status: 'PAID',
          customer: { name: 'Rahul T.', email: 'rahul.t@example.com', phone: '+91 9988776655' },
          shipping_address: '88 Tech Park Road, Hyderabad, Telangana, 500081',
          items: [
            { product_name: 'Heavyweight Cargo Pant', quantity: 1, price: 2499, color: 'Olive', size: '32' }
          ]
        },
        {
          id: '1039',
          created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
          total_amount: 999.00,
          status: 'CANCELLED',
          payment_status: 'UNPAID',
          customer: { name: 'Sneha K.', email: 'sneha.k@example.com', phone: '+91 9876512345' },
          shipping_address: '12 Sunset Blvd, Pune, Maharashtra, 411001',
          items: [
            { product_name: 'Essential Round Neck', quantity: 1, price: 999, color: 'Black', size: 'S' }
          ]
        }
      ]);
    }
    if (url.includes('/admin/stats')) {
      return createMockResponse({
        revenue: 145000.00,
        orders: { total: 124, pending: 12 },
        customers: 89,
        products: 45,
        recent_sales: [
          { id: '1042', customer: 'Arjun M.', status: 'PENDING', total: 3398.00 },
          { id: '1041', customer: 'Priya S.', status: 'SHIPPED', total: 1899.00 },
          { id: '1040', customer: 'Rahul T.', status: 'DELIVERED', total: 2499.00 },
          { id: '1039', customer: 'Sneha K.', status: 'CANCELLED', total: 999.00 }
        ],
        low_stock_variants: [
          { product: 'Oversized Vintage Tee', sku: 'MOCK-1-S-BLK', size: 'S', color: 'Black', qty: 2 },
          { product: 'Premium Cotton Polo', sku: 'MOCK-2-L-NAV', size: 'L', color: 'Navy', qty: 0 }
        ]
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
