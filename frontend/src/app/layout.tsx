import type { Metadata } from "next";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

import "./globals.css";
import Modal from "@/components/ui/Modal";
import { ModalProvider } from "@/context/ModalContext";

export const metadata: Metadata = {
  title: "Humber Mobility",
  description: "Technicians and workshops connections",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#B4B4B4] antialiased">
        {/* Google Maps Script */}
        <ModalProvider>
          {/* Modal MUST be here at top level */}
          <Modal />

          {/* Your content */}
          <Theme>
            <ThemeProvider>{children}</ThemeProvider>
          </Theme>
        </ModalProvider>
      </body>
    </html>
  );
}
