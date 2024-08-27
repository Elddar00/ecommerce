import { create } from "zustand";
import { currentCart } from "@wix/ecom";
import { WixClient } from "@/context/wixContext";

type CartState = {
  cart: currentCart.Cart;
  isLoading: boolean;
  counter: number;
  getCart: (wixClient: WixClient) => void;
  addItem: (
    wixClient: WixClient,
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  removeItem: (wixClient: WixClient, itemId: string) => void;
};

// const useStore = create<CartState>((set) => ({
//   cart: [],
//   isLoading: true,
//   counter: 0,
//   getCart: async (wixClient) => {
//     const cart = await wixClient.currentCart.getCurrentCart();
//   },
//   addItem: async (wixClient) => {},
//   removeItem: async (wixClient) => {},
// }));

export const useCartStore = create<CartState>((set) => ({
  cart: currentCart,
  isLoading: true,
  counter: 0,
  getCart: async (wixClient) => {
    try {
      // Proveri da li je korisnik prijavljen
      const isAuthenticated = await wixClient.auth.loggedIn(); // Prilagodi proveru autentifikacije

      if (!isAuthenticated) {
        {
          //@ts-ignore
          set({ cart: [], isLoading: false, counter: 0 });
        }
        return;
      }

      // Preuzmi korpu
      const cart = await wixClient.currentCart.getCurrentCart();
      set({
        cart: cart || [],
        isLoading: false,
        counter: cart?.lineItems.length || 0,
      });
    } catch (err) {
      console.error("Greška prilikom preuzimanja korpe:", err);
      {
        //@ts-ignore
        set({ cart: [], isLoading: false, counter: 0 });
      }
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
      console.error("Greška prilikom dodavanja stavke u korpu:", err);
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
      console.error("Greška prilikom uklanjanja stavke iz korpe:", err);
      set((state) => ({ ...state, isLoading: false }));
    }
  },
}));
