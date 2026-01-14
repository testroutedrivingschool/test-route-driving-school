import {Montserrat, Open_Sans} from "next/font/google";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import QueryProvider from "./utils/QueryProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Driving School in Sydney suburbs| Learn to Drive Safely & Confidently",
  description:
    "Master driving with our Driving School in Sydney suburbs– expert instructors, affordable packages, book now & enjoy your learning experience.",
     keywords: [
    "Driving School in Sydney suburbs",
    "driving school near me",
    "driving lessons schools",
    "driving schools in Sydney suburbs",
    "driving schools for manual transmission",
    "driving training school near me",
    "affordable driving school in Sydney suburbs",
    "driving schools near by me",
    "driving instructor schools in Sydney suburbs",
    "driving class Sydney suburbs",
    "driving lessons Sydney suburbs",
    "driving instructor in Sydney suburbs",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  
  openGraph: {
    title: "Driving School in Sydney suburbs | Learn to Drive Safely & Confidently",
    description:
      "Master driving with our Driving School in Sydney suburbs – expert instructors, affordable packages, book now & enjoy your learning experience.",
    url: "https://testroutedrivingschool.com.au",
    siteName: "Test Route Driving School",
    images: [
      {
        url: "https://testroutedrivingschool.com.au/test-route-driving-school-cover.png",
        width: 1200,
        height: 630,
        alt: "Test Route Driving School Sydney Suburbs",
      },
    ],
    locale: "en_AU",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Driving School in Sydney suburbs | Learn to Drive Safely & Confidently",
    description:
      "Master driving with our Driving School in Sydney suburbs – expert instructors, affordable packages, book now & enjoy your learning experience.",
    images: ["https://testroutedrivingschool.com.au/test-route-driving-school-cover.png"],
  },
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${montserrat.variable} ${openSans.variable} antialiased`}
      >
        {" "}
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
