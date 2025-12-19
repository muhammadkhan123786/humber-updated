import type { Metadata } from "next";

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
    <html lang="en">
      <body className="bg-[#B4B4B4] antialiased">
        {/* Google Maps Script */}
        <ModalProvider>

          {/* Modal MUST be here at top level */}
          <Modal />

          {/* Your content */}

          {children}


        </ModalProvider>
      </body>
    </html>
  );
}
