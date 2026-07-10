import React, { useEffect } from 'react'
import { X, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'
import { CartItem } from './CartItem'

const FREE_SHIPPING_THRESHOLD = 999

export function CartDrawer() {
  const { isCartOpen, closeCart, cart, updateCartQty, removeFromCart } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [closeCart])

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  const handleCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-[200ms] linear"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-base z-50 flex flex-col cart-drawer ${isCartOpen ? 'open' : ''}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-heading font-black text-xl uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> CART
          </h2>
          <button onClick={closeCart} className="text-muted hover:text-text transition-colors duration-[150ms] linear">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Indicator (Revision 2: monochrome typographic) */}
        {cart.length > 0 && (
          <div className="bg-surface p-4 border-b border-border text-center">
            {remainingForFreeShipping > 0 ? (
              <div className="font-heading font-bold text-xs uppercase tracking-wider text-text">
                ₹{remainingForFreeShipping.toFixed(2)} AWAY FROM FREE SHIPPING
              </div>
            ) : (
              <div className="font-heading font-bold text-xs uppercase tracking-wider text-text">
                FREE SHIPPING UNLOCKED
              </div>
            )}
            {/* Very thin monochrome bar as requested */}
            <div className="h-0.5 w-full bg-border mt-2">
              <div 
                className="h-full bg-accent transition-all duration-[300ms] ease-linear" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted">
              <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-heading font-bold uppercase tracking-wider mb-6">Your cart is empty.</p>
              <button 
                onClick={() => { closeCart(); navigate('/shop?gender=MENS') }} 
                className="btn-primary w-full max-w-[200px] h-12"
              >
                SHOP NOW
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              {cart.map((item) => (
                <CartItem 
                  key={`${item.product.id}-${item.variant.id}`} 
                  item={item} 
                  updateQty={updateCartQty} 
                  remove={removeFromCart} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-border bg-base">
            <div className="flex justify-between items-center mb-4 font-heading font-bold uppercase tracking-wider">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs font-body text-muted mb-6 text-center">
              Shipping & taxes calculated at checkout.
            </p>
            <button onClick={handleCheckout} className="btn-primary w-full h-12 text-sm">
              CHECKOUT
            </button>
          </div>
        )}
      </div>
    </>
  )
}
