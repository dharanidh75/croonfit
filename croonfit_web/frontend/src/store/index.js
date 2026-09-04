import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      // ─── Auth ────────────────────────────────────────────────────────────
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false, wishlist: [] }),
      updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),

      // ─── Cart ─────────────────────────────────────────────────────────────
      cart: [],
      addToCart: (product, variant, quantity = 1) => set((state) => {
        const existing = state.cart.find(
          (item) => item.product.id === product.id && item.variant.id === variant.id
        )
        if (existing) {
          return {
            cart: state.cart.map((item) =>
              item === existing
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }
        }
        return { cart: [...state.cart, { product, variant, quantity }] }
      }),
      removeFromCart: (productId, variantId) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => !(item.product.id === productId && item.variant.id === variantId)
          ),
        })),
      updateCartQty: (productId, variantId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId && item.variant.id === variantId
              ? { ...item, quantity }
              : item
          ),
        })),
      clearCart: () => set({ cart: [] }),

      // ─── Wishlist (local, synced to DB on login) ─────────────────────────
      wishlist: [],
      toggleWishlist: (product) =>
        set((state) => {
          const exists = state.wishlist.find((item) => item.id === product.id)
          return {
            wishlist: exists
              ? state.wishlist.filter((item) => item.id !== product.id)
              : [...state.wishlist, product],
          }
        }),
      isWishlisted: (productId) => get().wishlist.some((item) => item.id === productId),

      // ─── UI State ────────────────────────────────────────────────────────
      isCartOpen: false,
      isSearchOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),

      // ─── Last Order (post-checkout) ───────────────────────────────────────
      lastOrder: null,
      setLastOrder: (order) => set({ lastOrder: order }),

      // ─── Buy Now ──────────────────────────────────────────────────────────
      buyNowItem: null,
      setBuyNowItem: (item) => set({ buyNowItem: item }),
      clearBuyNowItem: () => set({ buyNowItem: null }),
    }),
    {
      name: 'croonfit-storage',
      partialize: (state) => ({
        // Only persist cart, wishlist, and auth — not UI flags
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        wishlist: state.wishlist,
        lastOrder: state.lastOrder,
        buyNowItem: state.buyNowItem,
      }),
      version: 1, // Add version to invalidate old caches with broken image structures
    }
  )
)
