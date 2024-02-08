import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const timeFilter = body.timeFilter;
  const asset = body.asset;

  try {
    const data = "test";
    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new NextResponse(`Graph Error ${error}`, { status: 500 });
  }
};
