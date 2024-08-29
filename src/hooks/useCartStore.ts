import { create } from "zustand";
import { currentCart } from "@wix/ecom";
import { WixClient } from "@/context/wixContext";

type CartState = {
  cart: currentCart.Cart | null; // Ako je cart može biti null
  isLoading: boolean;
  counter: number;
  getCart: (wixClient: WixClient) => Promise<void>; // Promenjen tip na Promise<void>
  addItem: (
    wixClient: WixClient,
    productId: string,
    variantId: string,
    quantity: number
  ) => Promise<void>; // Dodan Promise<void> za asinkroni rad
  removeItem: (wixClient: WixClient, itemId: string) => Promise<void>; // Dodan Promise<void>
};

export const useCartStore = create<CartState>((set) => ({
  cart: { lineItems: [] }, // Inicijalizacija sa praznom korpom
  isLoading: true,
  counter: 0,
  getCart: async (wixClient) => {
    try {
      const isAuthenticated = await wixClient.auth.loggedIn();
      console.log("Is user authenticated:", isAuthenticated);

      if (!isAuthenticated) {
        set({ cart: { lineItems: [] }, isLoading: false, counter: 0 });
        return;
      }

      const cart = await wixClient.currentCart.getCurrentCart();
      console.log("Cart data:", cart);

      set({
        cart: cart || { lineItems: [] }, // Osiguranje da cart ima lineItems
        isLoading: false,
        counter: cart && cart.lineItems ? cart.lineItems.length : 0,
      });
    } catch (err) {
      console.error("Error fetching cart data:", err);
      set({ cart: { lineItems: [] }, isLoading: false, counter: 0 });
    }
  },
  addItem: async (wixClient, productId, variantId, quantity) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const response = await wixClient.currentCart.addToCurrentCart({
        lineItems: [
          {
            catalogReference: {
              appId: process.env.NEXT_PUBLIC_WIX_APP_ID!,
              catalogItemId: productId,
              ...(variantId && { options: { variantId } }),
            },
            quantity: quantity,
          },
        ],
      });

      set({
        cart: response.cart,
        counter: response.cart?.lineItems.length || 0,
        isLoading: false,
      });
    } catch (err) {
      console.error("Error adding item to cart:", err);
      set((state) => ({ ...state, isLoading: false }));
    }
  },
  removeItem: async (wixClient, itemId) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const response =
        await wixClient.currentCart.removeLineItemsFromCurrentCart([itemId]);

      set({
        cart: response.cart,
        counter: response.cart?.lineItems.length || 0,
        isLoading: false,
      });
    } catch (err) {
      console.error("Error removing item from cart:", err);
      set((state) => ({ ...state, isLoading: false }));
    }
  },
}));
