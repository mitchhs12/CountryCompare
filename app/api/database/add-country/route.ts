import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryName = searchParams.get("countryName");
  const isoCode = searchParams.get("isoCode");

  try {
    if (!countryName || !isoCode) throw new Error("Country and IsoCode required");
    await sql`INSERT INTO Countries (Name, IsoCode) VALUES (${countryName}, ${isoCode});`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const countries = await sql`SELECT * FROM Countries;`;
  return NextResponse.json({ countries }, { status: 200 });
}
