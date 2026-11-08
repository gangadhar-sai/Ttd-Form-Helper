import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata = {
  title: "TTD Form Helper — Chrome Extension",
  description: "Free one-click autofill for TTD darshan and seva booking forms. Your details stay local.",
  authors: [{ name: "Gangadhar Sai" }],
  openGraph: {
    type: "website",
    title: "TTD Form Helper — Chrome Extension",
    description: "Fill TTD booking forms in seconds. Save pilgrim details once, reuse forever. 100% local.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TTD Form Helper",
    description: "Free one-click autofill for TTD darshan and seva booking forms.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
