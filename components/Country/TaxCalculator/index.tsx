"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

export default function Calculator() {
  const [status, setStatus] = useState("resident");
  const [displayIncome, setDisplayIncome] = useState("");
  const [income, setIncome] = useState("");
  const [taxPayable, setTaxPayable] = useState(0);
  const [incomeLeftover, setIncomeLeftover] = useState(0);
  const country = usePathname().split("/")[1];

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    setDisplayIncome(value);
    setIncome(value);
  };

  const formatNumberToLocale = (value: string): string => {
    // Attempt to convert to number and format, handling decimals carefully
    const number = parseFloat(value);
    if (!isNaN(number)) {
      return number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return "";
  };

  const handleIncomeBlur = () => {
    setDisplayIncome(formatNumberToLocale(income));
  };

  async function calculateTax() {
    if (!income) {
      console.error("Income is required");
      return;
    }

    const numericIncome = parseFloat(income.replace(/,/g, ""));
    if (isNaN(numericIncome)) {
      console.error("Invalid income");
      return;
    }

    const response = await fetch(`/api/pit/${country}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        income: numericIncome,
      }),
    });

    if (!response.ok) {
      console.error("Failed to calculate tax");
      console.log(await response.json());
      return;
    }

    const data = await response.json();
    setTaxPayable(data.taxPayable);
    setIncomeLeftover(numericIncome - data.taxPayable);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission
    calculateTax();
  };

  return (
    <div className="flex flex-col justify-start items-center">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <div>
          <label htmlFor="status" className="block text-sm font-medium">
            Taxpayer Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:border-indigo-500 rounded-md"
          >
            <option value="resident">Resident</option>
            <option value="nonResident">Non-Resident</option>
            <option value="workingHolidayMaker">Working Holiday Maker</option>
          </select>
        </div>

        <div>
          <label htmlFor="income" className="block text-sm font-medium">
            Income (AUD)
          </label>
          <input
            type="text"
            id="income"
            value={displayIncome}
            onChange={handleIncomeChange}
            onBlur={handleIncomeBlur}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:border-indigo-500 rounded-md"
            placeholder="Enter your income"
          />
        </div>

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Calculate Tax
        </button>

        {/* Display the results */}
        <div className="mt-4 space-y-2">
          <div>
            <p className="text-sm font-medium">Tax Payable (AUD):</p>
            <p className="text-lg">{taxPayable.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Income After Tax (AUD):</p>
            <p className="text-lg">{incomeLeftover.toFixed(2)}</p>
          </div>
        </div>
      </form>
    </div>
  );
}
