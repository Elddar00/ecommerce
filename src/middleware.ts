import { createClient, OAuthStrategy } from "@wix/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const cookies = request.cookies;
  const res = NextResponse.next();

  // Proveri da li već postoji "refreshToken" kolačić
  if (cookies.get("refreshToken")) {
    return res;
  }

  // Kreiraj Wix klijent
  const wixClient = createClient({
    auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID! }),
  });

  try {
    // Generiši tokene
    const tokens = await wixClient.auth.generateVisitorTokens();
    // Postavi "refreshToken" kolačić
    // res.cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
    //   maxAge: 60 * 60 * 24 * 30, // 30 dana
    //   path: "/", // Dostupno za sve rute
    //   httpOnly: true, // Ne može se pristupiti putem JavaScript-a
    //   secure: process.env.NODE_ENV === "production", // Samo za HTTPS u produkciji
    // });
  } catch (error) {
    console.error("Error generating visitor tokens:", error);
  }

  return res;
}
