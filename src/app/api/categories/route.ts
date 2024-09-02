import { NextResponse } from "next/server";
import { wixClientServer } from "@/lib/wixClientServer";

export async function GET() {
  try {
    const wixClient = await wixClientServer();
    const categories = await wixClient.collections.queryCollections().find();
    return NextResponse.json(categories.items);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}
