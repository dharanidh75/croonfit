import axios from 'axios'

async function run() {
  const baseURL = 'http://localhost:8000/api'
  
  // 1. Get product test-api-2
  const res = await axios.get(`${baseURL}/products/test-api-2`)
  const product = res.data
  console.log("Initial variants:", product.variants.map(v => v.image_url))
  
  // 2. Update via admin route
  // We need to bypass auth or assume it works. 
  // Let's just print the payload that frontend WOULD send.
}
run()
