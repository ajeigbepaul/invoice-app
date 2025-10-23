// src/app/layout.tsx
"use client";

import { League_Spartan } from "next/font/google";
import "./globals.css";
import "@/styles/theme.css";
import ReactQueryProvider from "@/lib/react-query-provider";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-league-spartan",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={leagueSpartan.variable}>
        <ReactQueryProvider>
          <SessionProvider>
            <ThemeProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "var(--toast-bg)",
                    color: "var(--toast-color)",
                    border: "1px solid var(--toast-border)",
                  },
                  success: {
                    iconTheme: {
                      primary: "#33D69F",
                      secondary: "#fff",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#EC5757",
                      secondary: "#fff",
                    },
                  },
                }}
              />
            </ThemeProvider>
          </SessionProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
