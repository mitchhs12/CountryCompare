"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeSwitch() {
  const { setTheme } = useTheme();

  return (
    <div>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("system")}>System</button>
    </div>
  );
}
