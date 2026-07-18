import React, { useState, useEffect } from 'react'
import { ArrowLeft, CreditCard, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

export function PaymentSection({ onBack }) {
  const [isAdding, setIsAdding] = useState(false)
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCards = () => {
    setLoading(true)
    api.get('/auth/me/payments')
      .then(res => setCards(res.data))
      .catch(err => toast.error("Failed to load payment methods"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCards()
  }, [])

  const [formData, setFormData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const payload = {
      card_type: formData.number.startsWith('4') ? 'Visa' : 'Mastercard',
      last4: formData.number.slice(-4) || '1234',
      expiry: formData.expiry,
      name_on_card: formData.name
    }
    
    api.post('/auth/me/payments', payload)
      .then(res => {
        toast.success("Card saved securely!")
        fetchCards()
        setIsAdding(false)
        setFormData({ number: '', name: '', expiry: '', cvv: '' })
      })
      .catch(err => toast.error("Failed to save card"))
  }

  const deleteCard = (id) => {
    api.delete(`/auth/me/payments/${id}`)
      .then(() => {
        setCards(cards.filter(c => c.id !== id))
        toast.success("Payment method removed")
      })
      .catch(err => toast.error("Failed to remove payment method"))
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
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl uppercase tracking-wide">Payment Options</h2>
              <p className="text-sm text-[#888888]">Manage your saved payment methods</p>
            </div>
          </div>
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-white border border-[#E5E5E5] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:border-black transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Card
            </button>
          )}
        </div>

        {isAdding ? (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md bg-white p-6 border border-[#E5E5E5] rounded-xl shadow-sm">
            <h3 className="font-heading font-bold uppercase tracking-wider text-[#0A0A0A] mb-4 border-b border-[#F5F5F5] pb-2">Add New Card</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">Name on Card</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">Card Number</label>
                <input required type="text" name="number" maxLength="16" placeholder="0000 0000 0000 0000" value={formData.number} onChange={handleChange} className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">Expiry (MM/YY)</label>
                  <input required type="text" name="expiry" placeholder="MM/YY" maxLength="5" value={formData.expiry} onChange={handleChange} className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">CVV</label>
                  <input required type="password" name="cvv" maxLength="3" value={formData.cvv} onChange={handleChange} className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black transition-all" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#F5F5F5]">
              <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#111111] transition-all">Save Card</button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#888888] hover:text-black transition-all">Cancel</button>
            </div>
          </form>
        ) : loading ? (
          <div className="py-12 text-center text-[#888888] text-sm">Loading payment methods...</div>
        ) : cards.length === 0 ? (
          <div className="bg-white border border-[#E5E5E5] p-12 text-center rounded-2xl">
            <CreditCard className="w-12 h-12 text-[#888888] mx-auto mb-4 opacity-50" />
            <p className="font-body text-[#555555]">You haven't saved any payment methods yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map(card => (
              <div key={card.id} className="bg-white border border-[#E5E5E5] p-6 rounded-xl shadow-sm flex flex-col justify-between h-40">
                <div className="flex justify-between items-start">
                  <div className="font-bold text-[#0A0A0A] tracking-wider">{card.card_type}</div>
                  <button onClick={() => deleteCard(card.id)} className="text-[#888888] hover:text-[#E53E3E] transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div>
                  <p className="text-lg font-mono text-[#555555] tracking-widest mb-1">•••• •••• •••• {card.last4}</p>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#888888]">
                    <span>{card.name_on_card}</span>
                    <span>{card.expiry}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
