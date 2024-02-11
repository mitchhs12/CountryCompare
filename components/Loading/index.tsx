import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingSpinner({ size = 40, color = "#FFFFFF" }: { size?: number; color?: string }) {
  return (
    <>
      <CircularProgress color="primary" size={size} sx={{ color: color }} />
    </>
  );
}
