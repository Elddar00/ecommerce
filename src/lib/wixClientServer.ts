import { OAuthStrategy, createClient } from "@wix/sdk";
import { collections, products } from "@wix/stores";
import { orders } from "@wix/ecom";
import { cookies } from "next/headers";
import { members } from "@wix/members";

export const wixClientServer = async () => {
  let refreshToken;

  try {
    // Proveri i loguj vrednost `refreshToken` iz kolačića
    const cookieStore = cookies();
    const refreshTokenCookie = cookieStore.get("refreshToken");
    console.log("Refresh Token Cookie:", refreshTokenCookie);

    if (refreshTokenCookie) {
      refreshToken = JSON.parse(refreshTokenCookie.value || "{}");
      console.log("Parsed Refresh Token:", refreshToken);
    } else {
      console.log("No refresh token found in cookies.");
    }
  } catch (e) {
    console.error("Error parsing refresh token:", e);
  }

  try {
    // Proveri i loguj vrednost `NEXT_PUBLIC_WIX_CLIENT_ID`
    console.log("Client ID:", process.env.NEXT_PUBLIC_WIX_CLIENT_ID);

    // Kreiraj Wix klijent
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

    console.log("Wix Client created successfully");
    return wixClient;
  } catch (e) {
    console.error("Error creating Wix client:", e);
    throw e; // Ponovo baca grešku nakon logovanja
  }
};
