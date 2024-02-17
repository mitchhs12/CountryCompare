import { NextResponse } from "next/server";

type TaxpayerStatus = "resident" | "nonResident";

function calculateTax(status: TaxpayerStatus, income: number): number {
  // Assuming the same tax rates apply to residents and non-residents, with the difference
  // being whether they're taxed on worldwide income (residents) or Algerian-sourced income (non-residents).
  return calculateIncomeTax(income);
}

function calculateIncomeTax(income: number): number {
  let tax = 0;

  if (income <= 240000) {
    tax = 0;
  } else if (income <= 480000) {
    tax = (income - 240000) * 0.23;
  } else if (income <= 960000) {
    tax = 55200 + (income - 480000) * 0.27; // 24,000 * 23% = 55,200
  } else if (income <= 1920000) {
    tax = 183600 + (income - 960000) * 0.3; // (480,000 - 240,000) * 27% + 55,200 = 183,600
  } else if (income <= 3840000) {
    tax = 468600 + (income - 1920000) * 0.33; // (960,000 - 480,000) * 30% + 183,600 = 468,600
  } else {
    tax = 1104600 + (income - 3840000) * 0.35; // (1,920,000 - 960,000) * 33% + 468,600 = 1,104,600
  }
  return tax;
}

export const POST = async (req: Request) => {
  const { status, income } = await req.json();
  try {
    const taxPayable = calculateTax(status, income);
    return NextResponse.json({ taxPayable });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ "Server Error": error.message }, { status: 500 });
    }
    return NextResponse.json({ "Server Error": "An unknown error occurred" }, { status: 500 });
  }
};
