import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

async function run() {
  const baseURL = 'http://localhost:8000/api'

  // 1. Login
  const loginRes = await axios.post(`${baseURL}/auth/login`, { username: 'admin@example.com', password: 'password' }, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).catch(e => e.response)

  if (!loginRes || loginRes.status !== 200) {
    console.log("Login failed", loginRes?.status)
    return
  }
  const token = loginRes.data.access_token

  // 2. Upload dummy image
  fs.writeFileSync('dummy.jpg', 'fake image data')
  const formData = new FormData()
  formData.append('file', fs.createReadStream('dummy.jpg'))

  const uploadRes = await axios.post(`${baseURL}/admin/upload`, formData, {
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${token}`
    }
  }).catch(e => e.response)
  
  if (uploadRes.status !== 200) {
    console.log("Upload failed", uploadRes.status, uploadRes.data)
    return
  }
  
  const imgUrl = uploadRes.data.url
  console.log("Uploaded URL:", imgUrl)

  // 3. Update product with this variant image
  const pRes = await axios.get(`${baseURL}/products/test-api-2`)
  const product = pRes.data
  
  const v = product.variants[0]
  v.image_url = imgUrl
  
  const payload = {
    name: product.name,
    slug: product.slug,
    price: product.price,
    category_id: product.category_id,
    is_active: product.is_active,
    variants: [v]
  }

  const updateRes = await axios.put(`${baseURL}/admin/products/${product.id}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  }).catch(e => e.response)

  console.log("Update status:", updateRes.status)
  
  const verifyRes = await axios.get(`${baseURL}/products/test-api-2`)
  console.log("Verified variant image_url:", verifyRes.data.variants[0].image_url)
}
run()
