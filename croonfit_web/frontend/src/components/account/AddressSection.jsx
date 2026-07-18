import React, { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, Plus, Trash2, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

export function AddressSection({ onBack }) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAddresses = () => {
    setLoading(true)
    api.get('/auth/me/addresses')
      .then(res => setAddresses(res.data))
      .catch(err => toast.error("Failed to load addresses"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    full_name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    is_default: false
  })

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingId) {
      api.put(`/auth/me/addresses/${editingId}`, formData)
        .then(res => {
          toast.success("Address updated successfully!")
          fetchAddresses()
          setIsAdding(false)
          setEditingId(null)
          setFormData({ name: '', full_name: '', street: '', city: '', state: '', zip: '', is_default: false })
        })
        .catch(err => toast.error("Failed to update address"))
    } else {
      api.post('/auth/me/addresses', formData)
        .then(res => {
          toast.success("Address saved successfully!")
          fetchAddresses()
          setIsAdding(false)
          setEditingId(null)
          setFormData({ name: '', full_name: '', street: '', city: '', state: '', zip: '', is_default: false })
        })
        .catch(err => toast.error("Failed to save address"))
    }
  }

  const handleEdit = (addr) => {
    setFormData(addr)
    setEditingId(addr.id)
    setIsAdding(true)
  }

  const handleAddNew = () => {
    setFormData({ name: '', full_name: '', street: '', city: '', state: '', zip: '', is_default: false })
    setEditingId(null)
    setIsAdding(true)
  }

  const deleteAddress = (id) => {
    api.delete(`/auth/me/addresses/${id}`)
      .then(() => {
        setAddresses(addresses.filter(a => a.id !== id))
        toast.success("Address removed")
      })
      .catch(err => toast.error("Failed to remove address"))
  }

  return (
    <div className="animate-fade-in-up">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#888888] hover:text-black transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Account
      </button>

      <div className="bg-[#F9F9F9] border border-[#EBEBEB] rounded-2xl p-6 md:p-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#EBEBEB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl uppercase tracking-wide">Your Addresses</h2>
              <p className="text-sm text-[#888888]">Manage shipping addresses for orders</p>
            </div>
          </div>
          {!isAdding && (
            <button 
              onClick={handleAddNew}
              className="flex items-center gap-2 bg-white border border-[#E5E5E5] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:border-black transition-colors"
            >
              <Plus className="w-4 h-4" /> Add New
            </button>
          )}
        </div>

        {isAdding ? (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 border border-[#E5E5E5] rounded-xl">
            <h3 className="font-heading font-bold uppercase tracking-wider text-[#0A0A0A] mb-4 border-b border-[#F5F5F5] pb-2">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">Address Label (e.g. Home, Office)</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black transition-all" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">Full Name</label>
                <input required type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black transition-all" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">Street Address</label>
                <input required type="text" name="street" value={formData.street} onChange={handleChange} className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">City</label>
                <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">State</label>
                <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">ZIP Code</label>
                <input required type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black transition-all" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" name="is_default" id="is_default" checked={formData.is_default} onChange={handleChange} className="w-4 h-4 accent-black" />
              <label htmlFor="is_default" className="text-sm font-medium text-[#0A0A0A]">Set as default shipping address</label>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#F5F5F5]">
              <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#111111] transition-all">
                {editingId ? 'Update Address' : 'Save Address'}
              </button>
              <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#888888] hover:text-black transition-all">Cancel</button>
            </div>
          </form>
        ) : loading ? (
          <div className="py-12 text-center text-[#888888] text-sm">Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className="bg-white border border-[#E5E5E5] p-12 text-center rounded-2xl">
            <MapPin className="w-12 h-12 text-[#888888] mx-auto mb-4 opacity-50" />
            <p className="font-body text-[#555555]">You haven't saved any addresses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map(addr => (
              <div key={addr.id} className="relative bg-white border border-[#E5E5E5] p-5 rounded-xl shadow-sm">
                {addr.is_default && (
                  <span className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded">Default</span>
                )}
                <h3 className="font-bold text-[#0A0A0A] mb-1 flex items-center gap-2">{addr.name}</h3>
                <p className="text-sm font-semibold text-[#333333] mb-2">{addr.full_name}</p>
                <div className="text-sm text-[#555555] leading-relaxed mb-4">
                  <p>{addr.street}</p>
                  <p>{addr.city}, {addr.state} {addr.zip}</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                  <button onClick={() => handleEdit(addr)} className="text-[#888888] hover:text-black transition-colors flex items-center gap-1.5"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                  <button onClick={() => deleteAddress(addr.id)} className="text-[#888888] hover:text-[#E53E3E] transition-colors flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" /> Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
