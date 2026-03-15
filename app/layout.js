import {Montserrat, Open_Sans} from "next/font/google";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import QueryProvider from "./utils/QueryProvider";
import ScrollToTop from "./utils/ScrollToTop";
import Script from "next/script";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata = {
  title:
    "Driving School in Sydney suburbs| Learn to Drive Safely & Confidently",
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
    title:
      "Driving School in Sydney suburbs | Learn to Drive Safely & Confidently",
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
    title:
      "Driving School in Sydney suburbs | Learn to Drive Safely & Confidently",
    description:
      "Master driving with our Driving School in Sydney suburbs – expert instructors, affordable packages, book now & enjoy your learning experience.",
    images: [
      "https://testroutedrivingschool.com.au/test-route-driving-school-cover.png",
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://testroutedrivingschool.com.au/#localbusiness",
  name: "Test Route Driving School",
  url: "https://testroutedrivingschool.com.au",
  description:
    "Driving School in Sydney Suburbs | Learn to Drive Safely & Confidently\nJoin our expert instructors and gain confidence behind the wheel. At Test Route Driving School, we provide structured, safe, and friendly driving lessons in Sydney's suburbs. Whether you're a beginner or improving your skills, our lessons help you feel comfortable on the road. Our programs cover both automatic and manual cars, and we tailor every session to your pace. You’ll learn city driving, highway skills, parking techniques, and more—all designed to prepare you for your driving test.Book your lessons today and start your journey with a trusted driving school near you in Sydney Suburbs.",
  slogan: "Learn to Drive Safely & Confidently",
  image:
    "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
  logo: "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
  email: "testroutedrivingschool@gmail.com",
  telephone: ["+61 469 046 923", "+61 412 018 593"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "67 Warialda St",
    addressLocality: "Kogarah",
    addressRegion: "NSW",
    postalCode: "2217",
    addressCountry: "AU",
  },
  legalAddress: {
    "@type": "PostalAddress",
    streetAddress: "67 Warialda St",
    addressLocality: "Kogarah",
    addressRegion: "NSW",
    postalCode: "2217",
    addressCountry: "AU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -33.9835176,
    longitude: 151.1348637,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "https://schema.org/Monday",
        "https://schema.org/Tuesday",
        "https://schema.org/Wednesday",
        "https://schema.org/Thursday",
        "https://schema.org/Friday",
        "https://schema.org/Saturday",
        "https://schema.org/Sunday",
      ],
      opens: "06:00",
      closes: "20:00",
    },
  ],
  hasMap: "https://maps.app.goo.gl/Gxx8E4KHaQhTFWjZ6",
  areaServed: [
    "Roselands",
    "Sandringham",
    "Sutherland",
    "Wolli Creek",
    "Miranda",
    "Monterey",
    "Ramsgate",
    "Bardwell Park",
    "Eastgardens",
    "Gymea Bay",
    "Port Botany",
    "Rockdale",
    "Woolooware",
    "Kyeemagh",
    "Ramsgate Beach",
    "Beverly Hills",
    "Bexley North",
    "Botany",
    "Caringbah",
    "Caringbah South",
    "Carss Park",
    "Clemton Park",
    "Hurstville",
    "Kangaroo Point",
    "Kingsgrove",
    "Kogarah",
    "South Hurstville",
    "Tempe",
    "Marrickville",
    "Mortdale",
    "Peakhurst",
    "Riverwood",
    "Allawah",
    "Dolls Point",
    "Eastlakes",
    "Gymea",
    "Hurstville Grove",
    "Kareela",
    "Sans Souci",
    "Sylvania",
    "Sylvania Waters",
    "Taren Point",
    "Turella",
    "Kirrawee",
    "Kogarah Bay",
    "Penshurst",
    "Arncliffe",
    "Banksia",
    "Bardwell Valley",
    "Bexley",
    "Blakehurst",
    "Brighton-Le-Sands",
    "Carlton",
    "Cronulla",
    "Endgadline",
    "Mascot",
    "Pagewood",
    "Abbotsford",
    "Chatswood",
    "Campbelltown",
    "Baverly Hills",
    "Baxley",
    "Baxley North",
    "Carlton Park",
    "Jannali",
    "Airds",
    "Ambarvale",
    "Belfield",
  ],
  keywords: [
    "Automatic Driving Lessons",
    "Driving Test Assessment",
    "Driving Test Package",
    "Car Hire for Instructor",
    "Parking Package",
    "Highway Package",
    "Night Driving Lesson",
    "City Driving Package",
  ],
  knowsAbout: [
    "New learner drivers in Sydney suburbs",
    "overseas drivers needing NSW licence",
    "nervous or anxious drivers needing confidence",
    "students preparing for the NSW driving test",
    "parents looking for a safe driving instructor for their teenagers",
    "drivers who failed the test and want structured feedback",
    "learners wanting real test route practice around Sydney suburbs",
    "people searching for flexible driving lesson times",
    "customers needing car hire for the driving test at RMS centres",
    "local residents looking for an experienced, patient and friendly driving instructor near Kogarah and surrounding suburbs",
  ],
  knowsLanguage: ["en-AU"],
  skills: [
    "Providing one-to-one automatic and manual driving lessons",
    "Teaching NSW road rules clearly",
    "Preparing students for NSW driving test",
    "Coaching on real test routes in Sydney suburbs",
    "Designing customised lesson plans for each learner",
    "Conducting mock driving tests and detailed assessments",
    "Giving structured feedback and improvement plans",
    "Helping students build confidence behind the wheel",
    "Training safe and defensive driving habits",
    "Instructing complex parking manoeuvres (reverse park, kerbside stop, three point turn)",
    "Managing dual control vehicles safely",
    "Communicating calmly with nervous learners",
    "Planning efficient pick up and drop off routes in Sydney suburbs",
    "Handling lesson bookings and scheduling seven days a week",
    "Supporting learners until they pass their driving test",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+61 469 046 923",
      email: "testroutedrivingschool@gmail.com",
      availableLanguage: ["en-AU"],
    },
  ],
  sameAs: [
    "https://www.facebook.com/share/1A148kMS7g/",
    "https://testroutedrivingschool.tumblr.com/",
    "https://community.hubspot.com/t5/user/viewprofilepage/user-id/1042130",
    "https://instapaper.com/p/testroutedrivin",
  ],
  subjectOf: [
    {
      "@type": "WebPage",
      url: "https://www.yplocal.com/kogarah/business-professional-services/test-route-driving-school",
    },
    {
      "@type": "WebPage",
      url: "https://bizidex.com/en/test-route-driving-school-advertising-858454",
    },
    {
      "@type": "WebPage",
      url: "https://www.bizcoupon.directory/kogarah/business-services/test-route-driving-school",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Driving lesson services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Automatic Driving Lessons",
          provider: {
            "@id": "https://testroutedrivingschool.com.au/#localbusiness",
          },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Driving Test Assessment",
          provider: {
            "@id": "https://testroutedrivingschool.com.au/#localbusiness",
          },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Driving Test Package",
          provider: {
            "@id": "https://testroutedrivingschool.com.au/#localbusiness",
          },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Car Hire for Instructor",
          provider: {
            "@id": "https://testroutedrivingschool.com.au/#localbusiness",
          },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Parking Package",
          provider: {
            "@id": "https://testroutedrivingschool.com.au/#localbusiness",
          },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Highway Package",
          provider: {
            "@id": "https://testroutedrivingschool.com.au/#localbusiness",
          },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Night Driving Lesson",
          provider: {
            "@id": "https://testroutedrivingschool.com.au/#localbusiness",
          },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "City Driving Package",
          provider: {
            "@id": "https://testroutedrivingschool.com.au/#localbusiness",
          },
        },
      },
    ],
  },
  review: [
    {
      "@type": "Review",
      inLanguage: "en-AU",
      author: {
        "@type": "Person",
        name: "Najeeb Zahid",
      },
      reviewBody:
        "my nephew passed driving test on the first attempt thanks to Test Route Driving School. Instructor Firoj is extremely patient and explains everything clearly. Practicing real test routes made a huge difference.",
    },
    {
      "@type": "Review",
      inLanguage: "en-AU",
      author: {
        "@type": "Person",
        name: "Adrita's World",
      },
      reviewBody:
        "Best driving instructor I could ask for ,As a student learner, I was very scared at first, but Test Route Driving School made everything easy. The lessons were well-structured and focused on test routes around the Sydney suburbs. The instructor corrected my mistakes calmly and helped me build confidence. I’m very happy with the result!",
    },
    {
      "@type": "Review",
      inLanguage: "en-AU",
      author: {
        "@type": "Person",
        name: "porteboishobai",
      },
      reviewBody:
        "My experience has been great ! Instructors were really patient with me and easygoing enough for me to communicate with them about my problems properly. Because of these lessons I am more confident than ever!",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 5.0,
    bestRating: 5,
    worstRating: 1,
    reviewCount: 3,
  },
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9DRXR8GKP4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-9DRXR8GKP4');
          `}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        className={`${montserrat.variable} ${openSans.variable} antialiased`}
      >
        {" "}
        <QueryProvider>
          <AuthProvider>
            <ScrollToTop />
            {children}
            <div id="recaptcha-container"></div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
