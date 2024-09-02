import { NextResponse } from "next/server";
import { wixClientServer } from "@/lib/wixClientServer";

export async function GET() {
  try {
    console.log("Fetching categories from Wix...");
    const wixClient = await wixClientServer();
    console.log("Wix client initialized.");
    const categories = await wixClient.collections.queryCollections().find();
    console.log("Categories fetched:", categories.items);
    return NextResponse.json(categories.items);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}
