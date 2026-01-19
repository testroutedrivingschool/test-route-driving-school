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

const schema = {
  "@context": "https://schema.org",
  "@type": "DrivingSchool",
  "name": "Test Route Driving School",
  "@id": "https://testroutedrivingschool.com.au/#drivingschool",
"priceRange": "$$",
  "legalName": "Test Route Driving School",
  "url": "https://testroutedrivingschool.com.au/",
  "logo": "https://testroutedrivingschool.com.au/test-route-driving-school-logo.png",
"image": "https://testroutedrivingschool.com.au/test-route-driving-school-logo.png",
  "description": "Join our expert instructors and gain confidence behind the wheel. At Test Route Driving School, we provide structured, safe, and friendly driving lessons in Sydney Suburbs. Whether you’re a beginner or improving your skills, our lessons help you feel comfortable on the road.",
  "slogan": "Learn to Drive Safely & Confidently",
  "telephone": "+61 412 018 593",
  "email": "testroutedrivingschool@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "67 Warialda St",
    "addressLocality": "Kogarah",
    "addressRegion": "NSW",
    "postalCode": "2217",
    "addressCountry": "AU"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -33.9835176,
    "longitude": 151.1348637
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "06:00",
      "closes": "20:00"
    }
  ],
  "areaServed": [
    "Kogarah", "Rockdale", "Roselands", "Sandringham", "Sans Souci", "South Hurstville", 
    "Sutherland", "Sylvania", "Sylvania Waters", "Taren Point", "Tempe", "Turella", 
    "Wali Creek", "Woolooware", "Kirrawee", "Kogarah Bay", "Kyeemagh", "Marrickville", 
    "Miranda", "Monterey", "Mortdale", "Peakhurst", "Penshurst", "Ramsgate", "Ramsgate Beach", 
    "Riverwood", "Allawah", "Arncliffe", "Banksia", "Bardwell Park", "Bardwell Valley", 
    "Beverly Hills", "Bexley", "Bexley North", "Blakehurst", "Botany", "Brighton-Le-Sands", 
    "Caringbah", "Caringbah South", "Carlton", "Carss Park", "Clemton Park", "Cronulla", 
    "Dolls Point", "Eastgardens", "Endgadline", "Eastlakes", "Gymea", "Gymea Bay", 
    "Hurstville", "Hurstville Grove", "Kangaroo Point", "Kareela", "Kingsgrove", "Mascot", 
    "Pagewood", "Port Botany"
  ],
  "knowsAbout": [
    "Automatic Driving Lessons",
    "Driving Test Assessment",
    "Driving Test Preparation Packages",
    "Car Hire for Driving Instructor",
    "Parking Techniques",
    "Highway and Motorway Driving",
    "Night Driving Lessons",
    "City Driving Navigation"
  ],
  "sameAs": [
    "https://www.facebook.com/share/1A148kMS7g/"
  ]
}

export default function RootLayout({children}) {
  return (
    <html lang="en">
       <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        ></script>
      </head>
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
