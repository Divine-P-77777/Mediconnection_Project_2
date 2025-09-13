import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./components/ClientWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Provider } from "./Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://mediconnection.vercel.app"),
  title: "Mediconnection",
  description: "Let's connect with nearest health center .",
  icons: {
    icon: "/cube.gif",
  },
   verification: {
    google: "TYc7oU50kCRvacQe4ygPnBN_v_-VT4Usuvd9xzw11VM",
  },
  openGraph: {
    title: "Mediconnections",
    description: "Check out and connect with nearest health center !",
    url: "https://mediconnection.vercel.app",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "MediConnection Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MediConnection Logo",
    description: "Check out and connect with nearest health center !",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />

        {/* SEO Meta Tags */}
        <meta name="title" content="Dynamic FD" />
        <meta name="description" content="Welcome to the Dynamic FD website." />
    <meta name="google-site-verification" content="TYc7oU50kCRvacQe4ygPnBN_v_-VT4Usuvd9xzw11VM" />
        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://Mediconnection.vercel.app" />
        <meta property="og:title" content="Dynamic FD" />
        <meta property="og:description" content="Check out our achievements and journey!" />
        <meta property="og:image" content="/logo.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dynamic FD" />
        <meta name="twitter:description" content="Check out our achievements and journey!" />
        <meta name="twitter:image" content="/logo.png" />
        <script src="https://sdk.cashfree.com/js/v3/cashfree.js" async></script>
      </head>
      <body className={`${inter.className}  `}>
        <ClientWrapper>
          <Provider>{children}</Provider>
          {/* <SpeedInsights /> */}
        </ClientWrapper>
      </body>
    </html>
  );
}
