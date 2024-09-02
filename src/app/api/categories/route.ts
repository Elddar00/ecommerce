import { NextResponse } from "next/server";
import { wixClientServer } from "@/lib/wixClientServer";

export async function GET() {
  try {
    const wixClient = await wixClientServer();
    const result = await wixClient.collections.queryCollections().find();
    // console.log("Fetched categories:", result.items);
    return NextResponse.json(result.items);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}
