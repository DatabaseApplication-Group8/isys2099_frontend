import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ISYS2099 - DATABASE PROJECT",
    description: "Hospital Management Sytem",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                {/* FONT AWESOME CDN  */}
                <link
                    rel="stylesheet"
                    href="https://site-assets.fontawesome.com/releases/v6.5.1/css/all.css"
                />

                <link
                    rel="stylesheet"
                    href="https://site-assets.fontawesome.com/releases/v6.5.1/css/sharp-thin.css"
                />

                <link
                    rel="stylesheet"
                    href="https://site-assets.fontawesome.com/releases/v6.5.1/css/sharp-solid.css"
                />

                <link
                    rel="stylesheet"
                    href="https://site-assets.fontawesome.com/releases/v6.5.1/css/sharp-regular.css"
                />

                <link
                    rel="stylesheet"
                    href="https://site-assets.fontawesome.com/releases/v6.5.1/css/sharp-light.css"
                />
            </head>
            <body className={inter.className}>{children}</body>

        </html>


        
    );
}
