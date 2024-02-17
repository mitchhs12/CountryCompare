import { NextResponse } from "next/server";

type TaxpayerStatus = "resident" | "nonResident" | "workingHolidayMaker";

function calculateTax(status: TaxpayerStatus, income: number): number {
  switch (status) {
    case "resident":
      return calculateResidentTax(income);
    case "nonResident":
      return calculateNonResidentTax(income);
    case "workingHolidayMaker":
      return calculateWorkingHolidayMakerTax(income);
    default:
      return 0;
  }
}

function calculateResidentTax(income: number): number {
  const medicareLevy = income * 0.02;
  let tax = 0;

  if (income <= 18200) {
    tax = 0;
  } else if (income <= 45000) {
    tax = (income - 18200) * 0.19;
  } else if (income <= 120000) {
    tax = 5092 + (income - 45000) * 0.325;
  } else if (income <= 180000) {
    tax = 29467 + (income - 120000) * 0.37;
  } else {
    tax = 51667 + (income - 180000) * 0.45;
  }

  // Apply Medicare levy and calculate LITO if applicable
  tax += medicareLevy; // Add Medicare levy for residents
  // Note: This does not consider the Low Income Tax Offset (LITO) or Medicare Levy Surcharge for simplicity
  return tax;
}

function calculateNonResidentTax(income: number): number {
  if (income <= 120000) {
    return income * 0.325;
  } else if (income <= 180000) {
    return 39000 + (income - 120000) * 0.37;
  } else {
    return 61200 + (income - 180000) * 0.45;
  }
}

function calculateWorkingHolidayMakerTax(income: number): number {
  if (income <= 45000) {
    return income * 0.15;
  } else {
    return 6750 + calculateResidentTax(income - 45000);
  }
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
