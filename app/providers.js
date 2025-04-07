"use client";
import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    // نستخدم attribute="class" ليقوم next‑themes بإضافة أو إزالة كلاس "dark" على عنصر <html>
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  );
}
