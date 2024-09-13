import React, { FC } from "react";
import { ThemeProvider } from "next-themes";



const ThemeProviders = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  );
};

export default ThemeProviders;
