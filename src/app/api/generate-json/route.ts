import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const jsonData = await req.json();

    // Path to the data folder
    const dataDir = path.join(process.cwd(), "data");

    // Create folder if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, "listing.json");

    // Overwrite file (no need to delete first)
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

    return NextResponse.json({ success: true, message: "JSON file updated!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error creating JSON" });
  }
}
