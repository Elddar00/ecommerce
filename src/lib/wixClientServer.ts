import { OAuthStrategy, createClient } from "@wix/sdk";
import { collections, products } from "@wix/stores";
import { orders } from "@wix/ecom";
import { members } from "@wix/members";

export const wixClientServer = async () => {
  let refreshToken: string | null = null;

  try {
    if (typeof window !== "undefined") {
      refreshToken = localStorage.getItem("refreshToken");
    }
  } catch (e) {
    console.error("Greška pri preuzimanju refreshToken-a:", e);
  }

  const wixClient = createClient({
    modules: {
      products,
      collections,
      orders,
      members,
    },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokens: {
        refreshToken: refreshToken ? JSON.parse(refreshToken) : {},
        accessToken: { value: "", expiresAt: 0 },
      },
    }),
  });

  return wixClient;
};
