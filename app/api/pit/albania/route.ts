import { NextResponse } from "next/server";

type TaxpayerStatus = "resident" | "nonResident";

function calculateTax(status: TaxpayerStatus, income: number): number {
  switch (status) {
    case "resident":
      return calculateResidentTax(income);
    case "nonResident":
      return calculateNonResidentTax(income);
    default:
      return 0;
  }
}

function calculateResidentTax(income: number): number {
  let tax = 0;

  if (income <= 50000) {
    tax = 0;
  } else if (income <= 60000) {
    tax = (income - 35000) * 0.13; // 13% of the amount exceeding 35,000 ALL, if any
  } else if (income <= 200000) {
    tax = (income - 30000) * 0.13; // 13% of the amount exceeding 30,000 ALL
  } else {
    tax = 22100 + (income - 200000) * 0.23; // 22,100 ALL + 23% of the amount exceeding 200,000 ALL
  }
  return tax;
}

function calculateNonResidentTax(income: number): number {
  // Assuming non-residents are taxed only on income generated within Albania,
  // with the same tax rates as residents for simplicity.
  return calculateResidentTax(income);
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
