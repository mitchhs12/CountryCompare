"use client";

import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { usePathname } from "next/navigation";
import { formatCountryName } from "@/utils/helpers";
import IconButton from "@mui/material/IconButton"; // For wrapping the icon and making it easily clickable
import LocationGlobe from "@/components/Globe/LocationGlobe";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export default function Calculator() {
  const metricsInfo = [
    {
      name: "Internet:",
      description: "Reflects average internet speeds and reliability across the country.",
    },
    { name: "Cost of Living:", description: "Compares the overall cost of living to a global baseline." },
    {
      name: "Travel Requirements:",
      description: "Reflects the ease of obtaining long-term visas for digital nomads.",
    },
    { name: "Safety:", description: "Based on crime rates, safety concerns, and overall security." },
    {
      name: "Healthcare:",
      description: "Combines accessibility, quality of care, and infrastructure into a single metric.",
    },
    { name: "Public Transport:", description: "Rates the country's transportation infrastructure quality." },
    { name: "Climate Comfort:", description: "Based on average temperatures, humidity, and rainfall." },

    {
      name: "Average Income:",
      description: "Reflects average income levels for occupations common among digital nomads.",
    },
    { name: "English Profeciency:", description: "Reflects the level of English proficiency in the country." },
    {
      name: "Tax Friendliness:",
      description: "Assesses the tax situation for digital nomads, including rates and regulations.",
    },
    {
      name: "Political and Economic Stability:",
      description: "Considers political stability, economic freedom, and the ease of doing business.",
    },
  ];
  const pathname = formatCountryName(usePathname().split("/")[1]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col gap-y-6 md:mx-12 lg:mx-6 xl:mx-0">
        <div>
          <h1 className="flex justify-center md:justify-start md:pl-2 text-4xl">{pathname}</h1>
        </div>
        <div className="md:hidden flex justify-center pb-3 items-center">
          <LocationGlobe />
        </div>
        <div className="flex flex-col md:text-sm lg:text-lg">
          {metricsInfo.map((metric, index) => (
            <div key={index} className="flex items-center gap-2">
              <Tooltip title={metric.description} enterTouchDelay={0} arrow>
                <IconButton className="dark:text-stone-100 text-stone-950">
                  <HelpOutlineIcon fontSize="small" style={{ cursor: "pointer" }} />
                </IconButton>
              </Tooltip>
              <p>{metric.name} 10</p>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden md:flex justify-center items-center">
        <LocationGlobe />
      </div>
    </div>
  );
}
