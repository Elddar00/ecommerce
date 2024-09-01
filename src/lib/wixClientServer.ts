import { createClient, OAuthStrategy } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { orders } from "@wix/ecom";
import { members } from "@wix/members";
import { cookies } from "next/headers";

export const wixClientServer = async () => {
  let refreshToken;

  try {
    const cookieStore = cookies();
    const cookieValue = cookieStore.get("refreshToken")?.value;
    console.log("Cookie value:", cookieValue);
    refreshToken = cookieValue ? JSON.parse(cookieValue) : null;

    if (!refreshToken) {
      console.warn("No refresh token found, using default.");
      refreshToken = "default-refresh-token";
    }
  } catch (e) {
    console.error("Error parsing cookies:", e);
  }

  try {
    console.log(
      "Creating Wix client with clientId:",
      process.env.NEXT_PUBLIC_WIX_CLIENT_ID
    );
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
          refreshToken,
          accessToken: { value: "", expiresAt: 0 },
        },
      }),
    });

    return wixClient;
  } catch (error) {
    console.error("Error creating Wix client:", error);
    throw error;
  }
};
