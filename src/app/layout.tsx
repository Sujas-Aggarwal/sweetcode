import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SweetCode",
    description:
        "Online Fully Functiuonal Code Editor with Code Execution for Competetive Programmming, Development and Learning",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <Toaster position="top-center" reverseOrder={false} />
                {children}
            </body>
        </html>
    );
}
