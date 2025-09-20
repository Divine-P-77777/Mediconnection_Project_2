import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "./Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://mediconnection.vercel.app"),
  title: "Mediconnection – Connect with Nearest Health Centers",
  description:
    "Mediconnection helps you find, book, and connect with nearby health centers instantly. Book appointments, consult doctors online, and manage your health records easily.",
  keywords: [
    "Mediconnection",
    "nearest health center",
    "doctor consultation online",
    "book health appointment",
    "download medical reports",
    "healthcare platform",
    "Mediconnection India",
    "health center booking",
    "health consultation",
    "doctor appointment online",
    "medical reports download",
    "health center dashboard",
    "Mediconnect",
    "telemedicine",
  ],
  icons: {
    icon: "/cube.gif",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  verification: {
    google: "TYc7oU50kCRvacQe4ygPnBN_v_-VT4Usuvd9xzw11VM",
  },
  openGraph: {
    title: "Mediconnection – Connect with Nearest Health Centers",
    description:
      "Search and connect with your nearest health center. Book slots, consult doctors, and download your medical reports easily.",
    url: "https://mediconnection.vercel.app",
    type: "website",
    siteName: "Mediconnection",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Mediconnection Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mediconnection – Connect with Nearest Health Centers",
    description:
      "Book appointments, consult doctors online, and download your health reports instantly with Mediconnection.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://mediconnection.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="keywords" content={metadata.keywords.join(", ")} />

        {/* Canonical */}
        <link rel="canonical" href="https://mediconnection.vercel.app" />

        {/* Robots */}
        <meta name="robots" content="index, follow" />

        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Mediconnection",
              url: "https://mediconnection.vercel.app",
              logo: "https://mediconnection.vercel.app/logo.png",
              sameAs: [
                "https://twitter.com/yourhandle",
                "https://linkedin.com/company/yourcompany",
              ],
              description:
                "Mediconnection helps you find, book, and connect with nearby health centers instantly. Book appointments, consult doctors online, and manage your health records easily.",
            }),
          }}
        />

        {/* Cashfree JS */}
     <script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
      </head>
      <body className={`${inter.className}`}>
          <Provider>{children}</Provider>
      </body>
    </html>
  );
}
