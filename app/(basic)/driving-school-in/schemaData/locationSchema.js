export const locationSchemas = {
  roselands: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/roselands#webpage",
        url: "https://testroutedrivingschool.com.au/driving-school-in/roselands",
        name: "Driving Lessons in Roselands – Book Today | Test Route Driving School",
        description:
          "Gain confidence behind the wheel with Driving Lessons in Roselands – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
        inLanguage: "en-AU",
        breadcrumb: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/roselands#breadcrumb",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/roselands#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://testroutedrivingschool.com.au/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Area Covered",
            item: "https://testroutedrivingschool.com.au/area-covered",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Roselands",
            item: "https://testroutedrivingschool.com.au/driving-school-in/roselands",
          },
        ],
      },
      {
        "@type": "Service",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/roselands#service",
        name: "Test Route Driving School in Roselands",
        url: "https://testroutedrivingschool.com.au/driving-school-in/roselands",
        image:
          "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
        telephone: "0469 046 923",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "67 Warialda St",
          addressLocality: "Kogarah",
          addressRegion: "NSW",
          postalCode: "2217",
          addressCountry: "AU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -33.96342,
          longitude: 151.13539,
        },
        areaServed: {"@type": "Place", name: "Roselands"},
      },
      {
        "@type": "Product",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/roselands#product",
        name: "Single Driving Lesson - Roselands",
        image:
          "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        description:
          "60-minute personalized driving lesson in Roselands with professional instructors.",
        sku: "TRDS-RL-01",
        brand: {
          "@type": "Brand",
          name: "Test Route Driving School",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "850",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: {"@type": "Person", name: "Jasmine Akter"},
            reviewBody:
              "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
          {
            "@type": "Review",
            author: {"@type": "Person", name: "Najeeb Zahid"},
            reviewBody:
              "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
        ],
      },
    ],
  },
  sandringham: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/sandringham#webpage",
        url: "https://testroutedrivingschool.com.au/driving-school-in/sandringham",
        name: "Driving Lessons in Sandringham – Book Today | Test Route Driving School",
        description:
          "Master the roads with expert Driving Lessons in Sandringham – flexible timings and dual-controlled cars. Book now and pass your test with ease!",
        isPartOf: {
          "@id": "https://testroutedrivingschool.com.au/#website",
        },
        primaryImageOfPage: {
          "@id":
            "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/driving-lessons-sandringham.jpg#primaryimage",
        },
        breadcrumb: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/sandringham#breadcrumb",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/sandringham#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://testroutedrivingschool.com.au/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Area Covered",
            item: "https://testroutedrivingschool.com.au/area-covered",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Sandringham",
            item: "https://testroutedrivingschool.com.au/driving-school-in/sandringham",
          },
        ],
      },
      {
        "@type": "AutomotiveBusiness",
        "@id":
          "https://testroutedrivingschool.com.au/#driving-school-sandringham",
        name: "Test Route Driving School in Sandringham",
        url: "https://testroutedrivingschool.com.au/driving-school-in/sandringham",
        telephone: "0469 046 923",
        priceRange: "$$",
        image:
          "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
        address: {
          "@type": "PostalAddress",
          streetAddress: "67 Warialda St",
          addressLocality: "Kogarah",
          addressRegion: "NSW",
          postalCode: "2217",
          addressCountry: "AU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -33.96342,
          longitude: 151.13539,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "06:00",
            closes: "08:00",
          },
        ],
        areaServed: [
          {"@type": "City", name: "Sandringham"},
          {"@type": "City", name: "Hurstville"},
          {"@type": "City", name: "Rockdale"},
          {"@type": "City", name: "Bexley"},
          {"@type": "City", name: "Carlton"},
          {"@type": "City", name: "Arncliffe"},
          {"@type": "City", name: "Allawah"},
        ],
        sameAs: [
          "https://www.facebook.com/people/Test-Route-Driving-School-Kogarah-NSW/61573810690087/",
          "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
        ],
      },
      {
        "@type": "Service",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/sandringham#service",
        name: "Professional Driving Lessons in Sandringham",
        provider: {
          "@id":
            "https://testroutedrivingschool.com.au/#driving-school-sandringham",
        },
        description:
          "Professional and affordable driving lessons in Sandringham, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
        areaServed: {"@type": "City", name: "Sandringham"},
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Driving Instruction Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Automatic Driving Lessons",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Driving Test Assessment",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Highway Package"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Night Driving Lesson"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Parking Package"},
            },
          ],
        },
      },
      {
        "@type": "Product",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/sandringham#product",
        name: "Single Driving Lesson - Sandringham",
        image:
          "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/driving-lesson-package.jpg",
        description:
          "60-minute personalized driving lesson in Sandringham with professional instructors.",
        sku: "SAN-60-LESSON",
        brand: {
          "@type": "Brand",
          name: "Test Route Driving School",
        },
        offers: {
          "@type": "Offer",
          url: "https://testroutedrivingschool.com.au/bookings",
          priceCurrency: "AUD",
          price: "70.00",
          availability: "https://schema.org/InStock",
          seller: {
            "@id":
              "https://testroutedrivingschool.com.au/#driving-school-sandringham",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "850",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: {"@type": "Person", name: "Jasmine Akter"},
            datePublished: "2024-01-15",
            reviewBody:
              "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
          {
            "@type": "Review",
            author: {"@type": "Person", name: "Najeeb Zahid"},
            datePublished: "2024-02-10",
            reviewBody:
              "My nephew passed the driving test on the first attempt. Instructor Firoj is patient.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
        ],
      },
    ],
  },
  sutherland: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/sutherland#webpage",
        url: "https://testroutedrivingschool.com.au/driving-school-in/sutherland",
        name: "Driving Lessons in Sutherland – Book Today | Test Route Driving School",
        isPartOf: {
          "@id": "https://testroutedrivingschool.com.au/#website",
        },
        primaryImageOfPage: {
          "@id":
            "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/driving-lessons-sutherland.jpg#primaryimage",
        },
        description:
          "Get licensed faster with professional Driving Lessons in Sutherland – experienced instructors and patient teaching. Book now to start your journey today!",
        breadcrumb: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/sutherland#breadcrumb",
        },
        about: {
          "@id":
            "https://testroutedrivingschool.com.au/#driving-school-sutherland",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/sutherland#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://testroutedrivingschool.com.au/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Area Covered",
            item: "https://testroutedrivingschool.com.au/area-covered",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Sutherland",
            item: "https://testroutedrivingschool.com.au/driving-school-in/sutherland",
          },
        ],
      },
      {
        "@type": "AutomotiveBusiness",
        "@id":
          "https://testroutedrivingschool.com.au/#driving-school-sutherland",
        name: "Test Route Driving School in Sutherland",
        url: "https://testroutedrivingschool.com.au/driving-school-in/sutherland",
        telephone: "0469 046 923",
        priceRange: "$$",
        image:
          "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
        address: {
          "@type": "PostalAddress",
          streetAddress: "67 Warialda St",
          addressLocality: "Kogarah",
          addressRegion: "NSW",
          postalCode: "2217",
          addressCountry: "AU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -33.96342,
          longitude: 151.13539,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "06:00",
          closes: "08:00",
        },
        areaServed: [
          {"@type": "City", name: "Sutherland"},
          {"@type": "City", name: "Kirrawee"},
          {"@type": "City", name: "Loftus"},
          {"@type": "City", name: "Jannali"},
          {"@type": "City", name: "Como"},
          {"@type": "City", name: "Woronora"},
        ],
        sameAs: [
          "https://www.facebook.com/people/Test-Route-Driving-School-Kogarah-NSW/61573810690087/",
          "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
        ],
      },
      {
        "@type": "Service",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/sutherland#service",
        serviceType: "Driving Lessons",
        provider: {
          "@id":
            "https://testroutedrivingschool.com.au/#driving-school-sutherland",
        },
        areaServed: {
          "@type": "State",
          name: "Sutherland, NSW",
        },
        description:
          "Professional and affordable driving lessons in Sutherland, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Driving Instruction Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Automatic Driving Lessons",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Driving Test Assessment",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Highway Package"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Night Driving Lesson"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Parking Package"},
            },
          ],
        },
      },
      {
        "@type": "Product",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/sutherland#product",
        name: "Single Driving Lesson - Sutherland",
        image:
          "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/driving-lesson-package.jpg",
        description:
          "60-minute personalized driving lesson in Sutherland with professional instructors.",
        sku: "SUTH-60-LESSON",
        brand: {
          "@type": "Brand",
          name: "Test Route Driving School",
        },
        offers: {
          "@type": "Offer",
          url: "https://testroutedrivingschool.com.au/bookings",
          priceCurrency: "AUD",
          price: "70.00",
          availability: "https://schema.org/InStock",
          seller: {
            "@id":
              "https://testroutedrivingschool.com.au/#driving-school-sutherland",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "850",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: {"@type": "Person", name: "Jasmine Akter"},
            reviewBody:
              "Passed my driving test on the first attempt. The instructor made me feel comfortable.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
          {
            "@type": "Review",
            author: {"@type": "Person", name: "Najeeb Zahid"},
            reviewBody:
              "My nephew passed on the first attempt. Instructor Firoj explains everything clearly.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
        ],
      },
    ],
  },
  miranda: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/miranda#webpage",
        url: "https://testroutedrivingschool.com.au/driving-school-in/miranda",
        name: "Best Driving Lessons in Miranda | Test Route Driving School",
        isPartOf: {
          "@id": "https://testroutedrivingschool.com.au/#website",
        },
        primaryImageOfPage: {
          "@id":
            "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/driving-lessons-miranda.jpg#primaryimage",
        },
        description:
          "Build your driving skills with expert Driving Lessons in Miranda – safety-focused training for all learners. Book now and enjoy stress-free learning!",
        breadcrumb: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/miranda#breadcrumb",
        },
        about: {
          "@id":
            "https://testroutedrivingschool.com.au/#driving-school-miranda",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/miranda#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://testroutedrivingschool.com.au/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Area Covered",
            item: "https://testroutedrivingschool.com.au/area-covered",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Miranda",
            item: "https://testroutedrivingschool.com.au/driving-school-in/miranda",
          },
        ],
      },
      {
        "@type": "AutomotiveBusiness",
        "@id": "https://testroutedrivingschool.com.au/#driving-school-miranda",
        name: "Test Route Driving School in Miranda",
        url: "https://testroutedrivingschool.com.au/driving-school-in/miranda",
        telephone: "0469 046 923",
        priceRange: "$$",
        image:
          "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
        logo: "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
        address: {
          "@type": "PostalAddress",
          streetAddress: "67 Warialda St",
          addressLocality: "Kogarah",
          addressRegion: "NSW",
          postalCode: "2217",
          addressCountry: "AU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -33.96342,
          longitude: 151.13539,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "06:00",
            closes: "08:00",
          },
        ],
        areaServed: [
          {"@type": "City", name: "Miranda"},
          {"@type": "City", name: "Gymea"},
          {"@type": "City", name: "Sylvania"},
          {"@type": "City", name: "Caringbah"},
          {"@type": "City", name: "Taren Point"},
          {"@type": "City", name: "Yowie Bay"},
        ],
        sameAs: [
          "https://www.facebook.com/people/Test-Route-Driving-School-Kogarah-NSW/61573810690087/",
          "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
        ],
      },
      {
        "@type": "Service",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/miranda#service",
        serviceType: "Driving Lessons",
        provider: {
          "@id":
            "https://testroutedrivingschool.com.au/#driving-school-miranda",
        },
        description:
          "Professional and affordable driving lessons in Miranda, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Miranda, NSW",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Driving Packages",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Automatic Driving Lessons",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Driving Test Assessment",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Highway Package"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Night Driving Lesson"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Parking Package"},
            },
          ],
        },
      },
      {
        "@type": "Product",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/miranda#product",
        name: "Single Driving Lesson - Miranda",
        image:
          "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/driving-lesson-package.jpg",
        description:
          "60-minute personalized driving lesson in Miranda with professional instructors.",
        sku: "MIR-60-LESSON",
        brand: {
          "@type": "Brand",
          name: "Test Route Driving School",
        },
        offers: {
          "@type": "Offer",
          url: "https://testroutedrivingschool.com.au/bookings",
          priceCurrency: "AUD",
          price: "70.00",
          availability: "https://schema.org/InStock",
          seller: {
            "@id":
              "https://testroutedrivingschool.com.au/#driving-school-miranda",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "850",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: {"@type": "Person", name: "Jasmine Akter"},
            reviewBody:
              "I highly recommend TEST ROUTE DRIVING SCHOOL. Great instructors!",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
          {
            "@type": "Review",
            author: {"@type": "Person", name: "Najeeb Zahid"},
            reviewBody:
              "Passed on the first attempt. Firoj is a very patient instructor.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
        ],
      },
    ],
  },
  monterey: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/monterey#webpage",
        url: "https://testroutedrivingschool.com.au/driving-school-in/monterey",
        name: "Expert Driving Lessons in Monterey | Test Route Driving School",
        isPartOf: {
          "@id": "https://testroutedrivingschool.com.au/#website",
        },
        primaryImageOfPage: {
          "@id":
            "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/driving-lessons-monterey.jpg#primaryimage",
        },
        description:
          "Looking for quality driving instruction? Get Driving Lessons in Monterey – professional coaches and dual-control cars. Book now and pass on your first go!",
        breadcrumb: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/monterey#breadcrumb",
        },
        about: {
          "@id":
            "https://testroutedrivingschool.com.au/#driving-school-monterey",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/monterey#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://testroutedrivingschool.com.au/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Area Covered",
            item: "https://testroutedrivingschool.com.au/area-covered",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Monterey",
            item: "https://testroutedrivingschool.com.au/driving-school-in/monterey",
          },
        ],
      },
      {
        "@type": "AutomotiveBusiness",
        "@id": "https://testroutedrivingschool.com.au/#driving-school-monterey",
        name: "Test Route Driving School in Monterey",
        url: "https://testroutedrivingschool.com.au/driving-school-in/monterey",
        telephone: "0469 046 923",
        priceRange: "$$",
        image:
          "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
        logo: "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
        address: {
          "@type": "PostalAddress",
          streetAddress: "67 Warialda St",
          addressLocality: "Kogarah",
          addressRegion: "NSW",
          postalCode: "2217",
          addressCountry: "AU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -33.96342,
          longitude: 151.13539,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "06:00",
            closes: "08:00",
          },
        ],
        areaServed: [
          {"@type": "City", name: "Monterey"},
          {"@type": "City", name: "Brighton-Le-Sands"},
          {"@type": "City", name: "Ramsgate"},
          {"@type": "City", name: "Kogarah"},
          {"@type": "City", name: "Rockdale"},
        ],
        sameAs: [
          "https://www.facebook.com/people/Test-Route-Driving-School-Kogarah-NSW/61573810690087/",
          "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
        ],
      },
      {
        "@type": "Service",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/monterey#service",
        serviceType: "Driving Lessons",
        provider: {
          "@id":
            "https://testroutedrivingschool.com.au/#driving-school-monterey",
        },
        description:
          "Professional and affordable driving lessons in Monterey, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Monterey, NSW",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Driving Instruction Packages",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Automatic Driving Lessons",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Driving Test Assessment",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Highway Package"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Night Driving Lesson"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Parking Package"},
            },
          ],
        },
      },
      {
        "@type": "Product",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/monterey#product",
        name: "Single Driving Lesson - Monterey",
        image:
          "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/driving-lesson-package.jpg",
        description:
          "60-minute personalized driving lesson in Monterey with professional instructors.",
        sku: "MON-60-LESSON",
        brand: {
          "@type": "Brand",
          name: "Test Route Driving School",
        },
        offers: {
          "@type": "Offer",
          url: "https://testroutedrivingschool.com.au/bookings",
          priceCurrency: "AUD",
          price: "70.00",
          availability: "https://schema.org/InStock",
          seller: {
            "@id":
              "https://testroutedrivingschool.com.au/#driving-school-monterey",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "850",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: {"@type": "Person", name: "Jasmine Akter"},
            reviewBody:
              "The instructor made me feel confident. Pass on the first attempt!",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
          {
            "@type": "Review",
            author: {"@type": "Person", name: "Najeeb Zahid"},
            reviewBody:
              "Very clear explanations and patient. 10/10 recommendation.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
        ],
      },
    ],
  },

  ramsgate: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/ramsgate#webpage",
        url: "https://testroutedrivingschool.com.au/driving-school-in/ramsgate",
        name: "Driving Lessons in Ramsgate – Book Today | Test Route Driving School",
        description:
          "Gain confidence behind the wheel with Driving Lessons in Ramsgate – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
        breadcrumb: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/ramsgate#breadcrumb",
        },
        primaryImageOfPage: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/ramsgate#primaryimage",
        },
        isPartOf: {
          "@id": "https://testroutedrivingschool.com.au/#website",
        },
      },
      {
        "@type": "ImageObject",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/ramsgate#primaryimage",
        url: "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        contentUrl:
          "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        caption: "Test Route Driving School Ramsgate",
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/ramsgate#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://testroutedrivingschool.com.au/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Area Covered",
            item: "https://testroutedrivingschool.com.au/area-covered",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Ramsgate",
            item: "https://testroutedrivingschool.com.au/driving-school-in/ramsgate",
          },
        ],
      },
      {
        "@type": "AutomotiveBusiness",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/ramsgate#localbusiness",
        name: "Test Route Driving School in Ramsgate",
        image:
          "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
        telePhone: "0469 046 923",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "67 Warialda St",
          addressLocality: "Kogarah",
          addressRegion: "NSW",
          postalCode: "2217",
          addressCountry: "AU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -33.96342,
          longitude: 151.13539,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "06:00",
            closes: "08:00",
          },
        ],
        sameAs: ["https://www.facebook.com/share/1A148kMS7g/"],
        areaServed: [
          {"@type": "City", name: "Ramsgate"},
          {"@type": "City", name: "Ramsgate Beach"},
          {"@type": "City", name: "Sans Souci"},
          {"@type": "City", name: "Monterey"},
          {"@type": "City", name: "Kogarah"},
          {"@type": "City", name: "Carlton"},
          {"@type": "City", name: "Rockdale"},
        ],
        hasMap: "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      },
      {
        "@type": "Service",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/ramsgate#service",
        serviceType: "Driving Lessons",
        provider: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/ramsgate#localbusiness",
        },
        areaServed: {
          "@type": "City",
          name: "Ramsgate",
        },
        description:
          "Professional and affordable driving lessons in Ramsgate, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Driving Instruction Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Automatic Driving Lessons",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Driving Test Assessment",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Highway Package"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Night Driving Lesson"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Parking Package"},
            },
          ],
        },
      },
      {
        "@type": "Product",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/ramsgate#product",
        name: "Single Driving Lesson - Ramsgate",
        image:
          "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        description:
          "60-minute personalized driving lesson in Ramsgate with professional instructors.",
        brand: {
          "@type": "Brand",
          name: "Test Route Driving School",
        },
        offers: {
          "@type": "Offer",
          url: "https://testroutedrivingschool.com.au/bookings",
          price: "70.00",
          priceCurrency: "AUD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "850",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Jasmine Akter",
            },
            reviewBody:
              "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Najeeb Zahid",
            },
            reviewBody:
              "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
        ],
      },
    ],
  },
  "bardwell-park": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/bardwell-park#webpage",
        url: "https://testroutedrivingschool.com.au/driving-school-in/bardwell-park",
        name: "Driving Lessons in Bardwell Park – Book Today | Test Route Driving School",
        description:
          "Gain confidence behind the wheel with Driving Lessons in Bardwell Park – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
        isPartOf: {
          "@id": "https://testroutedrivingschool.com.au/#website",
        },
        primaryImageOfPage: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/bardwell-park#primaryimage",
        },
        breadcrumb: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/bardwell-park#breadcrumb",
        },
      },
      {
        "@type": "ImageObject",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/bardwell-park#primaryimage",
        url: "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        contentUrl:
          "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        caption: "Driving Lessons in Bardwell Park - Test Route Driving School",
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/bardwell-park#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://testroutedrivingschool.com.au/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Area Covered",
            item: "https://testroutedrivingschool.com.au/area-covered",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Bardwell Park",
            item: "https://testroutedrivingschool.com.au/driving-school-in/bardwell-park",
          },
        ],
      },
      {
        "@type": "AutomotiveBusiness",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/bardwell-park#localbusiness",
        name: "Test Route Driving School in Bardwell Park",
        image:
          "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
        telephone: "0469 046 923",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "67 Warialda St",
          addressLocality: "Kogarah",
          addressRegion: "NSW",
          postalCode: "2217",
          addressCountry: "AU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -33.96342,
          longitude: 151.13539,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "06:00",
            closes: "08:00",
          },
        ],
        sameAs: ["https://www.facebook.com/share/1A148kMS7g/"],
        areaServed: [
          {"@type": "City", name: "Bardwell Park"},
          {"@type": "City", name: "Bardwell Valley"},
          {"@type": "City", name: "Bexley North"},
          {"@type": "City", name: "Earlwood"},
          {"@type": "City", name: "Turrella"},
          {"@type": "City", name: "Arncliffe"},
          {"@type": "City", name: "Rockdale"},
        ],
        hasMap: "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      },
      {
        "@type": "Service",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/bardwell-park#service",
        serviceType: "Driving School Services",
        provider: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/bardwell-park#localbusiness",
        },
        areaServed: {
          "@type": "State",
          name: "Bardwell Park, NSW",
        },
        description:
          "Professional and affordable driving lessons in Bardwell Park, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Driving Instruction Packages",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Automatic Driving Lessons",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Driving Test Assessment",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Highway Package"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Night Driving Lesson"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Parking Package"},
            },
          ],
        },
      },
      {
        "@type": "Product",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/bardwell-park#product",
        name: "Single Driving Lesson - Bardwell Park",
        image:
          "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        description:
          "60-minute personalized driving lesson in Bardwell Park with professional instructors.",
        brand: {
          "@type": "Brand",
          name: "Test Route Driving School",
        },
        offers: {
          "@type": "Offer",
          url: "https://testroutedrivingschool.com.au/bookings",
          price: "70.00",
          priceCurrency: "AUD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "850",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Jasmine Akter",
            },
            reviewBody:
              "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Najeeb Zahid",
            },
            reviewBody:
              "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
        ],
      },
    ],
  },
  eastgardens: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/eastgardens#webpage",
        url: "https://testroutedrivingschool.com.au/driving-school-in/eastgardens",
        name: "Driving Lessons in Eastgardens – Book Today | Test Route Driving School",
        description:
          "Gain confidence behind the wheel with Driving Lessons in Eastgardens – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
        isPartOf: {
          "@id": "https://testroutedrivingschool.com.au/#website",
        },
        primaryImageOfPage: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/eastgardens#primaryimage",
        },
        breadcrumb: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/eastgardens#breadcrumb",
        },
      },
      {
        "@type": "ImageObject",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/eastgardens#primaryimage",
        url: "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        contentUrl:
          "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        caption: "Test Route Driving School Eastgardens",
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/eastgardens#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://testroutedrivingschool.com.au/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Area Covered",
            item: "https://testroutedrivingschool.com.au/area-covered",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Eastgardens",
            item: "https://testroutedrivingschool.com.au/driving-school-in/eastgardens",
          },
        ],
      },
      {
        "@type": "AutomotiveBusiness",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/eastgardens#localbusiness",
        name: "Test Route Driving School in Eastgardens",
        image:
          "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
        telephone: "0469 046 923",
        priceRange: "$$",
        url: "https://testroutedrivingschool.com.au/driving-school-in/eastgardens",
        address: {
          "@type": "PostalAddress",
          streetAddress: "67 Warialda St",
          addressLocality: "Kogarah",
          addressRegion: "NSW",
          postalCode: "2217",
          addressCountry: "AU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -33.96342,
          longitude: 151.13539,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "06:00",
            closes: "08:00",
          },
        ],
        sameAs: ["https://www.facebook.com/share/1A148kMS7g/"],
        areaServed: [
          {"@type": "City", name: "Eastgardens"},
          {"@type": "City", name: "Pagewood"},
          {"@type": "City", name: "Hillsdale"},
          {"@type": "City", name: "Maroubra"},
          {"@type": "City", name: "Kingsford"},
          {"@type": "City", name: "Botany"},
          {"@type": "City", name: "Mascot"},
        ],
        hasMap: "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      },
      {
        "@type": "Service",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/eastgardens#service",
        serviceType: "Driving School Lessons",
        provider: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/eastgardens#localbusiness",
        },
        areaServed: {
          "@type": "State",
          name: "Eastgardens, NSW",
        },
        description:
          "Professional and affordable driving lessons in Eastgardens, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Driving Instruction Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Automatic Driving Lessons",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Driving Test Assessment",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Highway Package"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Night Driving Lesson"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Parking Package"},
            },
          ],
        },
      },
      {
        "@type": "Product",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/eastgardens#product",
        name: "Single Driving Lesson - Eastgardens",
        image:
          "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        description:
          "60-minute personalized driving lesson in Eastgardens with professional instructors.",
        brand: {
          "@type": "Brand",
          name: "Test Route Driving School",
        },
        offers: {
          "@type": "Offer",
          url: "https://testroutedrivingschool.com.au/bookings",
          price: "70.00",
          priceCurrency: "AUD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "850",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Jasmine Akter",
            },
            reviewBody:
              "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Najeeb Zahid",
            },
            reviewBody:
              "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
        ],
      },
    ],
  },
  "gymea-bay": {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/gymea-bay#webpage",
        url: "https://testroutedrivingschool.com.au/driving-school-in/gymea-bay",
        name: "Driving Lessons in Gymea Bay – Book Today | Test Route Driving School",
        description:
          "Gain confidence behind the wheel with Driving Lessons in Gymea Bay – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
        isPartOf: {
          "@id": "https://testroutedrivingschool.com.au/#website",
        },
        primaryImageOfPage: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/gymea-bay#primaryimage",
        },
        breadcrumb: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/gymea-bay#breadcrumb",
        },
      },
      {
        "@type": "ImageObject",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/gymea-bay#primaryimage",
        url: "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        contentUrl:
          "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        caption: "Test Route Driving School Gymea Bay",
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/gymea-bay#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://testroutedrivingschool.com.au/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Area Covered",
            item: "https://testroutedrivingschool.com.au/area-covered",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Gymea Bay",
            item: "https://testroutedrivingschool.com.au/driving-school-in/gymea-bay",
          },
        ],
      },
      {
        "@type": "AutomotiveBusiness",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/gymea-bay#localbusiness",
        name: "Test Route Driving School in Gymea Bay",
        image:
          "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
        telephone: "0469 046 923",
        priceRange: "$$",
        url: "https://testroutedrivingschool.com.au/driving-school-in/gymea-bay",
        address: {
          "@type": "PostalAddress",
          streetAddress: "67 Warialda St",
          addressLocality: "Kogarah",
          addressRegion: "NSW",
          postalCode: "2217",
          addressCountry: "AU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -33.96342,
          longitude: 151.13539,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "06:00",
            closes: "08:00",
          },
        ],
        sameAs: ["https://www.facebook.com/share/1A148kMS7g/"],
        areaServed: [
          {"@type": "City", name: "Gymea Bay"},
          {"@type": "City", name: "Gymea"},
          {"@type": "City", name: "Miranda"},
          {"@type": "City", name: "Caringbah"},
          {"@type": "City", name: "Kirrawee"},
          {"@type": "City", name: "Sylvania"},
          {"@type": "City", name: "Cronulla"},
        ],
        hasMap: "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      },
      {
        "@type": "Service",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/gymea-bay#service",
        serviceType: "Driving Instruction",
        provider: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/gymea-bay#localbusiness",
        },
        areaServed: {
          "@type": "State",
          name: "Gymea Bay, NSW",
        },
        description:
          "Professional and affordable driving lessons in Gymea Bay, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Driving Lesson Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Automatic Driving Lessons",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Driving Test Assessment",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Highway Package"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Night Driving Lesson"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Parking Package"},
            },
          ],
        },
      },
      {
        "@type": "Product",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/gymea-bay#product",
        name: "Single Driving Lesson - Gymea Bay",
        image:
          "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        description:
          "60-minute personalized driving lesson in Gymea Bay with professional instructors.",
        brand: {
          "@type": "Brand",
          name: "Test Route Driving School",
        },
        offers: {
          "@type": "Offer",
          url: "https://testroutedrivingschool.com.au/bookings",
          price: "70.00",
          priceCurrency: "AUD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "850",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Jasmine Akter",
            },
            reviewBody:
              "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Najeeb Zahid",
            },
            reviewBody:
              "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
        ],
      },
    ],
  },
  rockdale: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/rockdale#webpage",
        url: "https://testroutedrivingschool.com.au/driving-school-in/rockdale",
        name: "Driving Lessons in Rockdale – Book Today | Test Route Driving School",
        description:
          "Gain confidence behind the wheel with Driving Lessons in Rockdale – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
        isPartOf: {
          "@id": "https://testroutedrivingschool.com.au/#website",
        },
        primaryImageOfPage: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/rockdale#primaryimage",
        },
        breadcrumb: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/rockdale#breadcrumb",
        },
      },
      {
        "@type": "ImageObject",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/rockdale#primaryimage",
        url: "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        contentUrl:
          "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        caption: "Test Route Driving School Rockdale",
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/rockdale#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://testroutedrivingschool.com.au/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Area Covered",
            item: "https://testroutedrivingschool.com.au/area-covered",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Rockdale",
            item: "https://testroutedrivingschool.com.au/driving-school-in/rockdale",
          },
        ],
      },
      {
        "@type": "AutomotiveBusiness",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/rockdale#localbusiness",
        name: "Test Route Driving School in Rockdale",
        image:
          "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
        telephone: "0469 046 923",
        priceRange: "$$",
        url: "https://testroutedrivingschool.com.au/driving-school-in/rockdale",
        address: {
          "@type": "PostalAddress",
          streetAddress: "67 Warialda St",
          addressLocality: "Kogarah",
          addressRegion: "NSW",
          postalCode: "2217",
          addressCountry: "AU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -33.96342,
          longitude: 151.13539,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "06:00",
            closes: "08:00",
          },
        ],
        sameAs: ["https://www.facebook.com/share/1A148kMS7g/"],
        areaServed: [
          {"@type": "City", name: "Rockdale"},
          {"@type": "City", name: "Kogarah"},
          {"@type": "City", name: "Bexley"},
          {"@type": "City", name: "Banksia"},
          {"@type": "City", name: "Carlton"},
          {"@type": "City", name: "Arncliffe"},
          {"@type": "City", name: "Brighton-Le-Sands"},
        ],
        hasMap: "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      },
      {
        "@type": "Service",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/rockdale#service",
        serviceType: "Driving Lessons",
        provider: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/rockdale#localbusiness",
        },
        areaServed: {
          "@type": "State",
          name: "Rockdale, NSW",
        },
        description:
          "Professional and affordable driving lessons in Rockdale, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Driving Instruction Packages",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Automatic Driving Lessons",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Driving Test Assessment",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Highway Package"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Night Driving Lesson"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Parking Package"},
            },
          ],
        },
      },
      {
        "@type": "Product",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/rockdale#product",
        name: "Single Driving Lesson - Rockdale",
        image:
          "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        description:
          "60-minute personalized driving lesson in Rockdale with professional instructors.",
        brand: {
          "@type": "Brand",
          name: "Test Route Driving School",
        },
        offers: {
          "@type": "Offer",
          url: "https://testroutedrivingschool.com.au/bookings",
          price: "70.00",
          priceCurrency: "AUD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "850",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Jasmine Akter",
            },
            reviewBody:
              "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Najeeb Zahid",
            },
            reviewBody:
              "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
        ],
      },
    ],
  },
  woolooware: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/woolooware#webpage",
        url: "https://testroutedrivingschool.com.au/driving-school-in/woolooware",
        name: "Driving Lessons in Woolooware – Book Today | Test Route Driving School",
        description:
          "Gain confidence behind the wheel with Driving Lessons in Woolooware – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
        isPartOf: {
          "@id": "https://testroutedrivingschool.com.au/#website",
        },
        primaryImageOfPage: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/woolooware#primaryimage",
        },
        breadcrumb: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/woolooware#breadcrumb",
        },
      },
      {
        "@type": "ImageObject",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/woolooware#primaryimage",
        url: "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        contentUrl:
          "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        caption: "Driving Lessons Woolooware - Test Route Driving School",
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/woolooware#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://testroutedrivingschool.com.au/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Area Covered",
            item: "https://testroutedrivingschool.com.au/area-covered",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Woolooware",
            item: "https://testroutedrivingschool.com.au/driving-school-in/woolooware",
          },
        ],
      },
      {
        "@type": "AutomotiveBusiness",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/woolooware#localbusiness",
        name: "Test Route Driving School in Woolooware",
        image:
          "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
        telephone: "0469 046 923",
        priceRange: "$$",
        url: "https://testroutedrivingschool.com.au/driving-school-in/woolooware",
        address: {
          "@type": "PostalAddress",
          streetAddress: "67 Warialda St",
          addressLocality: "Kogarah",
          addressRegion: "NSW",
          postalCode: "2217",
          addressCountry: "AU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -33.96342,
          longitude: 151.13539,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "06:00",
            closes: "08:00",
          },
        ],
        sameAs: ["https://www.facebook.com/share/1A148kMS7g/"],
        areaServed: [
          {"@type": "City", name: "Woolooware"},
          {"@type": "City", name: "Cronulla"},
          {"@type": "City", name: "Caringbah"},
          {"@type": "City", name: "Miranda"},
          {"@type": "City", name: "Gymea"},
          {"@type": "City", name: "Burraneer"},
          {"@type": "City", name: "Kurnell"},
        ],
        hasMap: "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      },
      {
        "@type": "Service",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/woolooware#service",
        serviceType: "Driving Lessons",
        provider: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/woolooware#localbusiness",
        },
        areaServed: {
          "@type": "State",
          name: "Woolooware, NSW",
        },
        description:
          "Professional and affordable driving lessons in Woolooware, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Driving Instruction Packages",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Automatic Driving Lessons",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Driving Test Assessment",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Highway Package"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Night Driving Lesson"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Parking Package"},
            },
          ],
        },
      },
      {
        "@type": "Product",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/woolooware#product",
        name: "Single Driving Lesson - Woolooware",
        image:
          "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        description:
          "60-minute personalized driving lesson in Woolooware with professional instructors.",
        brand: {
          "@type": "Brand",
          name: "Test Route Driving School",
        },
        offers: {
          "@type": "Offer",
          url: "https://testroutedrivingschool.com.au/bookings",
          price: "70.00",
          priceCurrency: "AUD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "850",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Jasmine Akter",
            },
            reviewBody:
              "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Najeeb Zahid",
            },
            reviewBody:
              "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
        ],
      },
    ],
  },
  kyeemagh: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/kyeemagh#webpage",
        url: "https://testroutedrivingschool.com.au/driving-school-in/kyeemagh",
        name: "Driving Lessons in Kyeemagh – Book Today | Test Route Driving School",
        description:
          "Gain confidence behind the wheel with Driving Lessons in Kyeemagh – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
        isPartOf: {
          "@id": "https://testroutedrivingschool.com.au/#website",
        },
        primaryImageOfPage: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/kyeemagh#primaryimage",
        },
        breadcrumb: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/kyeemagh#breadcrumb",
        },
      },
      {
        "@type": "ImageObject",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/kyeemagh#primaryimage",
        url: "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        contentUrl:
          "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        caption: "Test Route Driving School Kyeemagh",
      },
      {
        "@type": "BreadcrumbList",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/kyeemagh#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://testroutedrivingschool.com.au/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Area Covered",
            item: "https://testroutedrivingschool.com.au/area-covered",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Kyeemagh",
            item: "https://testroutedrivingschool.com.au/driving-school-in/kyeemagh",
          },
        ],
      },
      {
        "@type": "AutomotiveBusiness",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/kyeemagh#localbusiness",
        name: "Test Route Driving School in Kyeemagh",
        image:
          "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
        telephone: "0469 046 923",
        priceRange: "$$",
        url: "https://testroutedrivingschool.com.au/driving-school-in/kyeemagh",
        address: {
          "@type": "PostalAddress",
          streetAddress: "67 Warialda St",
          addressLocality: "Kogarah",
          addressRegion: "NSW",
          postalCode: "2217",
          addressCountry: "AU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -33.96342,
          longitude: 151.13539,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "06:00",
            closes: "08:00",
          },
        ],
        sameAs: ["https://www.facebook.com/share/1A148kMS7g/"],
        areaServed: [
          {"@type": "City", name: "Kyeemagh"},
          {"@type": "City", name: "Rockdale"},
          {"@type": "City", name: "Bexley"},
          {"@type": "City", name: "Carlton"},
          {"@type": "City", name: "Arncliffe"},
          {"@type": "City", name: "Allawah"},
          {"@type": "City", name: "Brighton-Le-Sands"},
        ],
        hasMap: "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      },
      {
        "@type": "Service",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/kyeemagh#service",
        serviceType: "Driving Lessons",
        provider: {
          "@id":
            "https://testroutedrivingschool.com.au/driving-school-in/kyeemagh#localbusiness",
        },
        areaServed: {
          "@type": "State",
          name: "Kyeemagh, NSW",
        },
        description:
          "Professional and affordable driving lessons in Kyeemagh, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Driving Instruction Packages",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Automatic Driving Lessons",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Driving Test Assessment",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Highway Package"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Night Driving Lesson"},
            },
            {
              "@type": "Offer",
              itemOffered: {"@type": "Service", name: "Parking Package"},
            },
          ],
        },
      },
      {
        "@type": "Product",
        "@id":
          "https://testroutedrivingschool.com.au/driving-school-in/kyeemagh#product",
        name: "Single Driving Lesson - Kyeemagh",
        image:
          "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
        description:
          "60-minute personalized driving lesson in Kyeemagh with professional instructors.",
        brand: {
          "@type": "Brand",
          name: "Test Route Driving School",
        },
        offers: {
          "@type": "Offer",
          url: "https://testroutedrivingschool.com.au/bookings",
          price: "70.00",
          priceCurrency: "AUD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          reviewCount: "850",
          bestRating: "5",
          worstRating: "1",
        },
        review: [
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Jasmine Akter",
            },
            reviewBody:
              "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
          {
            "@type": "Review",
            author: {
              "@type": "Person",
              name: "Najeeb Zahid",
            },
            reviewBody:
              "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
            },
          },
        ],
      },
    ],
  },
  "ramsgate-beach": {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/ramsgate-beach#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/ramsgate-beach",
      "name": "Driving Lessons in Ramsgate Beach – Book Today | Test Route Driving School",
      "description": "Gain confidence behind the wheel with Driving Lessons in Ramsgate Beach – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/ramsgate-beach#primaryimage"
      },
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/ramsgate-beach#breadcrumb"
      }
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/ramsgate-beach#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "caption": "Test Route Driving School Ramsgate Beach"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/ramsgate-beach#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Ramsgate Beach",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/ramsgate-beach"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/ramsgate-beach#localbusiness",
      "name": "Test Route Driving School in Ramsgate Beach",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telephone": "0469 046 923",
      "priceRange": "$$",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/ramsgate-beach",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ],
      "areaServed": [
        { "@type": "City", "name": "Ramsgate Beach" },
        { "@type": "City", "name": "Ramsgate" },
        { "@type": "City", "name": "Monterey" },
        { "@type": "City", "name": "Sans Souci" },
        { "@type": "City", "name": "Kyeemagh" },
        { "@type": "City", "name": "Brighton-Le-Sands" },
        { "@type": "City", "name": "Rockdale" }
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7"
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/ramsgate-beach#service",
      "serviceType": "Driving Lessons",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/ramsgate-beach#localbusiness"
      },
      "areaServed": {
        "@type": "State",
        "name": "Ramsgate Beach, NSW"
      },
      "description": "Professional and affordable driving lessons in Ramsgate Beach, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving Instruction Packages",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/ramsgate-beach#product",
      "name": "Single Driving Lesson - Ramsgate Beach",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in Ramsgate Beach with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "price": "70.00",
        "priceCurrency": "AUD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "850",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
}
,
  caringbah: {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/caringbah#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/caringbah",
      "name": "Driving Lessons in Caringbah – Book Today | Test Route Driving School",
      "description": "Gain confidence behind the wheel with Driving Lessons in Caringbah – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/caringbah#primaryimage"
      },
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/caringbah#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/caringbah#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/caringbah#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Caringbah",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/caringbah"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/#localbusiness",
      "name": "Test Route Driving School in Caringbah",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/caringbah",
      "priceRange": "$$",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "areaServed": [
        { "@type": "City", "name": "Caringbah" },
        { "@type": "City", "name": "Caringbah South" },
        { "@type": "City", "name": "Miranda" },
        { "@type": "City", "name": "Woolooware" },
        { "@type": "City", "name": "Taren Point" },
        { "@type": "City", "name": "Sylvania" },
        { "@type": "City", "name": "Cronulla" }
      ],
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7"
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/caringbah#service",
      "serviceType": "Driving Lessons",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/#localbusiness"
      },
      "areaServed": {
        "@type": "City",
        "name": "Caringbah"
      },
      "description": "Professional and affordable driving lessons in Caringbah, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving Instruction Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/caringbah#product",
      "name": "Single Driving Lesson - Caringbah",
      "description": "60-minute personalized driving lesson in Caringbah with professional instructors.",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "price": "60.00",
        "priceCurrency": "AUD",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://testroutedrivingschool.com.au/#localbusiness"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "850"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
}
,
  "caringbah-south": {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/caringbah-south#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/caringbah-south",
      "name": "Driving Lessons in Caringbah South – Book Today | Test Route Driving School",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/caringbah-south#primaryimage"
      },
      "description": "Gain confidence behind the wheel with Driving Lessons in Caringbah South – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/caringbah-south#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/caringbah-south#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "caption": "Test Route Driving School Logo"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/caringbah-south#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Caringbah South",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/caringbah-south"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/caringbah-south#localbusiness",
      "name": "Test Route Driving School in Caringbah South",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/caringbah-south",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "priceRange": "$$",
      "areaServed": [
        "Caringbah South",
        "Caringbah",
        "Miranda",
        "Cronulla",
        "Gymea",
        "Sylvania",
        "Taren Point"
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/caringbah-south#service",
      "name": "Driving Lessons in Caringbah South",
      "serviceType": "Driving Instruction",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/caringbah-south#localbusiness"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Caringbah South, NSW"
      },
      "description": "Professional and affordable driving lessons in Caringbah South, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving School Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/caringbah-south#product",
      "name": "Single Driving Lesson - Caringbah South",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in Caringbah South with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "priceCurrency": "AUD",
        "price": "70.00",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "850",
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
}
,
  "carss-park": {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/carss-park#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/carss-park",
      "name": "Driving Lessons in Carss Park – Book Today | Test Route Driving School",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/carss-park#primaryimage"
      },
      "description": "Gain confidence behind the wheel with Driving Lessons in Carss Park – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/carss-park#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/carss-park#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/carss-park#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Carss Park",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/carss-park"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/carss-park#localbusiness",
      "name": "Test Route Driving School in Carss Park",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/carss-park",
      "priceRange": "$$",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "areaServed": [
        { "@type": "City", "name": "Carss Park" },
        { "@type": "City", "name": "Kogarah Bay" },
        { "@type": "City", "name": "Blakehurst" },
        { "@type": "City", "name": "South Hurstville" },
        { "@type": "City", "name": "Allawah" },
        { "@type": "City", "name": "Carlton" },
        { "@type": "City", "name": "Sans Souci" }
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/carss-park#service",
      "name": "Driving Lessons in Carss Park",
      "serviceType": "Driving School",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/carss-park#localbusiness"
      },
      "areaServed": {
        "@type": "State",
        "name": "Carss Park, NSW"
      },
      "description": "Professional and affordable driving lessons in Carss Park, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving Instruction Packages",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/carss-park#product",
      "name": "Single Driving Lesson - Carss Park",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in Carss Park with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "priceCurrency": "AUD",
        "price": "70.00",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "850"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
}
,
  "clemton-park": {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/clemton-park#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/clemton-park",
      "name": "Driving Lessons in Clemton Park – Book Today | Test Route Driving School",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/clemton-park#primaryimage"
      },
      "description": "Gain confidence behind the wheel with Driving Lessons in Clemton Park – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/clemton-park#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/clemton-park#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/clemton-park#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Clemton Park",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/clemton-park"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/clemton-park#localbusiness",
      "name": "Test Route Driving School in Clemton Park",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/clemton-park",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "priceRange": "$$",
      "areaServed": [
        { "@type": "City", "name": "Clemton Park" },
        { "@type": "City", "name": "Earlwood" },
        { "@type": "City", "name": "Kingsgrove" },
        { "@type": "City", "name": "Bexley North" },
        { "@type": "City", "name": "Bardwell Park" },
        { "@type": "City", "name": "Campsie" },
        { "@type": "City", "name": "Canterbury" }
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/clemton-park#service",
      "name": "Driving Lessons in Clemton Park",
      "serviceType": "Driving School",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/clemton-park#localbusiness"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Clemton Park, NSW"
      },
      "description": "Professional and affordable driving lessons in Clemton Park, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving Instruction Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/clemton-park#product",
      "name": "Single Driving Lesson - Clemton Park",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in Clemton Park with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "priceCurrency": "AUD",
        "price": "70.00",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "850"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
}
,
  hurstville: {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/hurstville",
      "name": "Driving Lessons in Hurstville – Book Today | Test Route Driving School",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville#primaryimage"
      },
      "description": "Gain confidence behind the wheel with Driving Lessons in Hurstville – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Hurstville",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/hurstville"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville#localbusiness",
      "name": "Test Route Driving School in Hurstville",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/hurstville",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "priceRange": "$$",
      "areaServed": [
        "Hurstville",
        "Allawah",
        "Carlton",
        "Penshurst",
        "Mortdale",
        "Beverly Hills",
        "Kogarah"
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville#service",
      "name": "Driving Lessons in Hurstville",
      "serviceType": "Driving School",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville#localbusiness"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Hurstville, NSW"
      },
      "description": "Professional and affordable driving lessons in Hurstville, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving Instruction Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville#product",
      "name": "Single Driving Lesson - Hurstville",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in Hurstville with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "priceCurrency": "AUD",
        "price": "70.00",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville#localbusiness"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "850"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
},
  "kangaroo-point": {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kangaroo-point#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/kangaroo-point",
      "name": "Driving Lessons in Kangaroo Point – Book Today | Test Route Driving School",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/kangaroo-point#primaryimage"
      },
      "description": "Gain confidence behind the wheel with Driving Lessons in Kangaroo Point – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/kangaroo-point#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kangaroo-point#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kangaroo-point#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Kangaroo Point",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/kangaroo-point"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kangaroo-point#localbusiness",
      "name": "Test Route Driving School in Kangaroo Point",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/kangaroo-point",
      "priceRange": "$$",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "areaServed": [
        "Kangaroo Point",
        "Sylvania",
        "Sylvania Waters",
        "Blakehurst",
        "Connells Point",
        "Oyster Bay",
        "Kareela"
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kangaroo-point#service",
      "name": "Driving Lessons in Kangaroo Point",
      "serviceType": "Driving School",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/kangaroo-point#localbusiness"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Kangaroo Point, NSW"
      },
      "description": "Professional and affordable driving lessons in Kangaroo Point, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving School Packages",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kangaroo-point#product",
      "name": "Single Driving Lesson - Kangaroo Point",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in Kangaroo Point with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "priceCurrency": "AUD",
        "price": "70.00",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://testroutedrivingschool.com.au/driving-school-in/kangaroo-point#localbusiness"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "850"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
}
,
  kingsgrove: {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kingsgrove#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/kingsgrove",
      "name": "Driving Lessons in Kingsgrove – Book Today | Test Route Driving School",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/kingsgrove#primaryimage"
      },
      "description": "Gain confidence behind the wheel with Driving Lessons in Kingsgrove – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/kingsgrove#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kingsgrove#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kingsgrove#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Kingsgrove",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/kingsgrove"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kingsgrove#localbusiness",
      "name": "Test Route Driving School in Kingsgrove",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/kingsgrove",
      "priceRange": "$$",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "areaServed": [
        "Kingsgrove",
        "Bexley North",
        "Bardwell Park",
        "Earlwood",
        "Beverly Hills",
        "Penshurst",
        "Hurstville"
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kingsgrove#service",
      "name": "Driving Lessons in Kingsgrove",
      "serviceType": "Driving School",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/kingsgrove#localbusiness"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Kingsgrove, NSW"
      },
      "description": "Professional and affordable driving lessons in Kingsgrove, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving Instruction Packages",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kingsgrove#product",
      "name": "Single Driving Lesson - Kingsgrove",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in Kingsgrove with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "priceCurrency": "AUD",
        "price": "70.00",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://testroutedrivingschool.com.au/driving-school-in/kingsgrove#localbusiness"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "850"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
}
,
  "kogarah-nsw": {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kogarah-nsw#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/kogarah-nsw",
      "name": "Driving Lessons in Kogarah NSW – Book Today | Test Route Driving School",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/kogarah-nsw#primaryimage"
      },
      "description": "Gain confidence behind the wheel with Driving Lessons in Kogarah NSW – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/kogarah-nsw#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kogarah-nsw#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kogarah-nsw#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Kogarah NSW",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/kogarah-nsw"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kogarah-nsw#localbusiness",
      "name": "Test Route Driving School in Kogarah NSW",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/kogarah-nsw",
      "priceRange": "$$",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "areaServed": [
        "Kogarah",
        "Hurstville",
        "Rockdale",
        "Bexley",
        "Carlton",
        "Arncliffe",
        "Allawah"
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kogarah-nsw#service",
      "name": "Driving Lessons in Kogarah NSW",
      "serviceType": "Driving School",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/kogarah-nsw#localbusiness"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Kogarah NSW"
      },
      "description": "Professional and affordable driving lessons in Kogarah NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving Instruction Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/kogarah-nsw#product",
      "name": "Single Driving Lesson - Kogarah NSW",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in Kogarah NSW with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "priceCurrency": "AUD",
        "price": "70.00",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://testroutedrivingschool.com.au/driving-school-in/kogarah-nsw#localbusiness"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "850"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
}
,
  "south-hurstville": {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/south-hurstville#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/south-hurstville",
      "name": "Driving Lessons in South Hurstville – Book Today | Test Route Driving School",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/south-hurstville#primaryimage"
      },
      "description": "Gain confidence behind the wheel with Driving Lessons in South Hurstville – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/south-hurstville#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/south-hurstville#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/south-hurstville#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "South Hurstville",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/south-hurstville"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/south-hurstville#localbusiness",
      "name": "Test Route Driving School in South Hurstville",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/south-hurstville",
      "priceRange": "$$",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "areaServed": [
        "South Hurstville",
        "Hurstville",
        "Blakehurst",
        "Connells Point",
        "Carlton",
        "Allawah",
        "Kogarah"
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/south-hurstville#service",
      "name": "Driving Lessons in South Hurstville",
      "serviceType": "Driving School",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/south-hurstville#localbusiness"
      },
      "areaServed": {
        "@type": "Place",
        "name": "South Hurstville, NSW"
      },
      "description": "Professional and affordable driving lessons in South Hurstville, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving Packages",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/south-hurstville#product",
      "name": "Single Driving Lesson - South Hurstville",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in South Hurstville with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "priceCurrency": "AUD",
        "price": "70.00",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://testroutedrivingschool.com.au/driving-school-in/south-hurstville#localbusiness"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "850"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
}
,
  tempe: {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/tempe#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/tempe",
      "name": "Driving Lessons in Tempe – Book Today | Test Route Driving School",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/tempe#primaryimage"
      },
      "description": "Gain confidence behind the wheel with Driving Lessons in Tempe – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/tempe#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/tempe#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/tempe#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Tempe",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/tempe"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/tempe#localbusiness",
      "name": "Test Route Driving School in Tempe",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/tempe",
      "priceRange": "$$",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "areaServed": [
        "Tempe",
        "Wolli Creek",
        "Arncliffe",
        "Marrickville",
        "Sydenham",
        "St Peters",
        "Mascot"
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/tempe#service",
      "name": "Driving Lessons in Tempe",
      "serviceType": "Driving School",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/tempe#localbusiness"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Tempe, NSW"
      },
      "description": "Professional and affordable driving lessons in Tempe, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving Instruction Packages",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/tempe#product",
      "name": "Single Driving Lesson - Tempe",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in Tempe with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "priceCurrency": "AUD",
        "price": "70.00",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://testroutedrivingschool.com.au/driving-school-in/tempe#localbusiness"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "850"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
}
,
  mortdale: {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/mortdale#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/mortdale",
      "name": "Driving Lessons in Mortdale – Book Today | Test Route Driving School",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/mortdale#primaryimage"
      },
      "description": "Gain confidence behind the wheel with Driving Lessons in Mortdale – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/mortdale#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/mortdale#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/mortdale#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Mortdale",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/mortdale"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/mortdale#localbusiness",
      "name": "Test Route Driving School in Mortdale",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/mortdale",
      "priceRange": "$$",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "areaServed": [
        "Mortdale",
        "Penshurst",
        "Oatley",
        "Hurstville",
        "Peakhurst",
        "Beverly Hills",
        "Kogarah"
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/mortdale#service",
      "name": "Driving Lessons in Mortdale",
      "serviceType": "Driving School",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/mortdale#localbusiness"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Mortdale, NSW"
      },
      "description": "Professional and affordable driving lessons in Mortdale, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving Instruction Packages",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/mortdale#product",
      "name": "Single Driving Lesson - Mortdale",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in Mortdale with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "priceCurrency": "AUD",
        "price": "70.00",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://testroutedrivingschool.com.au/driving-school-in/mortdale#localbusiness"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "850"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
}
,
  peakhurst: {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/peakhurst#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/peakhurst",
      "name": "Driving Lessons in Peakhurst – Book Today | Test Route Driving School",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/peakhurst#primaryimage"
      },
      "description": "Gain confidence behind the wheel with Driving Lessons in Peakhurst – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/peakhurst#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/peakhurst#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/peakhurst#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Peakhurst",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/peakhurst"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/peakhurst#localbusiness",
      "name": "Test Route Driving School in Peakhurst",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/peakhurst",
      "priceRange": "$$",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "areaServed": [
        "Peakhurst",
        "Hurstville",
        "Rockdale",
        "Bexley",
        "Carlton",
        "Arncliffe",
        "Allawah"
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/peakhurst#service",
      "name": "Driving Lessons in Peakhurst",
      "serviceType": "Driving School",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/peakhurst#localbusiness"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Peakhurst, NSW"
      },
      "description": "Professional and affordable driving lessons in Peakhurst, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving Instruction Packages",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/peakhurst#product",
      "name": "Single Driving Lesson - Peakhurst",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in Peakhurst with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "priceCurrency": "AUD",
        "price": "70.00",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://testroutedrivingschool.com.au/driving-school-in/peakhurst#localbusiness"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "850"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
}
,
  riverwood: {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/riverwood#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/riverwood",
      "name": "Driving Lessons in Riverwood – Book Today | Test Route Driving School",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/riverwood#primaryimage"
      },
      "description": "Gain confidence behind the wheel with Driving Lessons in Riverwood – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/riverwood#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/riverwood#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/riverwood#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Riverwood",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/riverwood"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/riverwood#localbusiness",
      "name": "Test Route Driving School in Riverwood",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/riverwood",
      "priceRange": "$$",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "areaServed": [
        "Riverwood",
        "Narwee",
        "Peakhurst",
        "Padstow",
        "Punchbowl",
        "Beverly Hills",
        "Roselands"
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/riverwood#service",
      "name": "Driving Lessons in Riverwood",
      "serviceType": "Driving School",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/riverwood#localbusiness"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Riverwood, NSW"
      },
      "description": "Professional and affordable driving lessons in Riverwood, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving Packages",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/riverwood#product",
      "name": "Single Driving Lesson - Riverwood",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in Riverwood with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "priceCurrency": "AUD",
        "price": "70.00",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://testroutedrivingschool.com.au/driving-school-in/riverwood#localbusiness"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "850"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
}
,
  allawah: {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/allawah#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/allawah",
      "name": "Driving Lessons in Allawah – Book Today | Test Route Driving School",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/allawah#primaryimage"
      },
      "description": "Gain confidence behind the wheel with Driving Lessons in Allawah – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/allawah#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/allawah#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/allawah#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Allawah",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/allawah"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/allawah#localbusiness",
      "name": "Test Route Driving School in Allawah",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/allawah",
      "priceRange": "$$",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "areaServed": [
        "Allawah",
        "Hurstville",
        "Carlton",
        "Kogarah",
        "Rockdale",
        "Bexley",
        "Arncliffe"
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/allawah#service",
      "name": "Driving Lessons in Allawah",
      "serviceType": "Driving School",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/allawah#localbusiness"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Allawah, NSW"
      },
      "description": "Professional and affordable driving lessons in Allawah, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving Instruction Packages",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/allawah#product",
      "name": "Single Driving Lesson - Allawah",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in Allawah with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "priceCurrency": "AUD",
        "price": "70.00",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://testroutedrivingschool.com.au/driving-school-in/allawah#localbusiness"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "850"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
},
  "dolls-point":{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/dolls-point#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/dolls-point",
      "name": "Driving Lessons in Dolls Point – Book Today | Test Route Driving School",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/dolls-point#primaryimage"
      },
      "description": "Gain confidence behind the wheel with Driving Lessons in Dolls Point – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/dolls-point#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/dolls-point#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/dolls-point#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Dolls Point",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/dolls-point"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/dolls-point#localbusiness",
      "name": "Test Route Driving School in Dolls Point",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/dolls-point",
      "priceRange": "$$",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "areaServed": [
        "Dolls Point",
        "Sans Souci",
        "Ramsgate",
        "Ramsgate Beach",
        "Monterey",
        "Brighton-Le-Sands",
        "Kyeemagh"
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/dolls-point#service",
      "name": "Driving Lessons in Dolls Point",
      "serviceType": "Driving School",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/dolls-point#localbusiness"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Dolls Point, NSW"
      },
      "description": "Professional and affordable driving lessons in Dolls Point, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving Packages",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/dolls-point#product",
      "name": "Single Driving Lesson - Dolls Point",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in Dolls Point with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "priceCurrency": "AUD",
        "price": "70.00",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://testroutedrivingschool.com.au/driving-school-in/dolls-point#localbusiness"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "850"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
}
,
  gymea:{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/gymea#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/gymea",
      "name": "Driving Lessons in Gymea – Book Today | Test Route Driving School",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/gymea#primaryimage"
      },
      "description": "Gain confidence behind the wheel with Driving Lessons in Gymea – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/gymea#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/gymea#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/gymea#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Gymea",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/gymea"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/gymea#localbusiness",
      "name": "Test Route Driving School in Gymea",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/gymea",
      "priceRange": "$$",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "areaServed": [
        "Gymea",
        "Gymea Bay",
        "Miranda",
        "Kirrawee",
        "Sylvania",
        "Kareela",
        "Grays Point"
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/gymea#service",
      "name": "Driving Lessons in Gymea",
      "serviceType": "Driving School",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/gymea#localbusiness"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Gymea, NSW"
      },
      "description": "Professional and affordable driving lessons in Gymea, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving Instruction Packages",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/gymea#product",
      "name": "Single Driving Lesson - Gymea",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in Gymea with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "priceCurrency": "AUD",
        "price": "70.00",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://testroutedrivingschool.com.au/driving-school-in/gymea#localbusiness"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "850"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
}
,
  "hurstville-grove":{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville-grove#webpage",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/hurstville-grove",
      "name": "Driving Lessons in Hurstville Grove – Book Today | Test Route Driving School",
      "isPartOf": {
        "@id": "https://testroutedrivingschool.com.au/#website"
      },
      "primaryImageOfPage": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville-grove#primaryimage"
      },
      "description": "Gain confidence behind the wheel with Driving Lessons in Hurstville Grove – expert instructors, flexible timings. Book now and enjoy stress-free learning!",
      "breadcrumb": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville-grove#breadcrumb"
      },
      "inLanguage": "en-AU"
    },
    {
      "@type": "ImageObject",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville-grove#primaryimage",
      "url": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "contentUrl": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville-grove#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://testroutedrivingschool.com.au/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Area Covered",
          "item": "https://testroutedrivingschool.com.au/area-covered"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Hurstville Grove",
          "item": "https://testroutedrivingschool.com.au/driving-school-in/hurstville-grove"
        }
      ]
    },
    {
      "@type": "AutomotiveBusiness",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville-grove#localbusiness",
      "name": "Test Route Driving School in Hurstville Grove",
      "image": "https://testroutedrivingschool.com.au/wp-content/uploads/2024/06/test-route-logo-1.png",
      "telePhone": "0469 046 923",
      "url": "https://testroutedrivingschool.com.au/driving-school-in/hurstville-grove",
      "priceRange": "$$",
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
        "latitude": -33.96342,
        "longitude": 151.13539
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "08:00"
        }
      ],
      "areaServed": [
        "Hurstville Grove",
        "Hurstville",
        "Connells Point",
        "Blakehurst",
        "South Hurstville",
        "Allawah",
        "Kogarah"
      ],
      "hasMap": "https://maps.app.goo.gl/cr9kSKHHP4vzg9XE7",
      "sameAs": [
        "https://www.facebook.com/share/1A148kMS7g/"
      ]
    },
    {
      "@type": "Service",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville-grove#service",
      "name": "Driving Lessons in Hurstville Grove",
      "serviceType": "Driving School",
      "provider": {
        "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville-grove#localbusiness"
      },
      "areaServed": {
        "@type": "Place",
        "name": "Hurstville Grove, NSW"
      },
      "description": "Professional and affordable driving lessons in Hurstville Grove, NSW. We offer dual-controlled vehicles and mock driving tests to ensure you pass on your first attempt.",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Driving Instruction Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automatic Driving Lessons" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Driving Test Assessment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Highway Package" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Night Driving Lesson" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Parking Package" } }
        ]
      }
    },
    {
      "@type": "Product",
      "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville-grove#product",
      "name": "Single Driving Lesson - Hurstville Grove",
      "image": "https://testroutedrivingschool.com.au/_next/image?url=%2Ftest-route-driving-school-logo.png&w=828&q=75",
      "description": "60-minute personalized driving lesson in Hurstville Grove with professional instructors.",
      "brand": {
        "@type": "Brand",
        "name": "Test Route Driving School"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://testroutedrivingschool.com.au/bookings",
        "priceCurrency": "AUD",
        "price": "70.00",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@id": "https://testroutedrivingschool.com.au/driving-school-in/hurstville-grove#localbusiness"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "reviewCount": "850"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Jasmine Akter"
          },
          "reviewBody": "I am so thankful to TEST ROUTE DRIVING SCHOOL for helping me pass my driving test on the first attempt. The instructor made me feel comfortable and confident.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Najeeb Zahid"
          },
          "reviewBody": "My nephew passed the driving test on the first attempt. Instructor Firoj is extremely patient and explains everything clearly.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
          }
        }
      ]
    }
  ]
}

,
};
