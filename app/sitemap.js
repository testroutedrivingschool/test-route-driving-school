import { blogsData } from "./(basic)/blogs/blogsData";

// app/sitemap.js
export default async function sitemap() {
  const baseUrl = "https://testroutedrivingschool.com.au";
  const lastModified = new Date();
  const locationRes = await fetch(
    "https://testroutedrivingschool.com.au/api/locations",
    {cache: "no-store"},
  );

  const locations = await locationRes.json();

  const locationUrls = locations.map((location) => {
    const slug = location.name
      .toLowerCase()
      .replace(/,/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    return {
      url: `${baseUrl}/driving-school-in/${slug}`,
      lastModified,
    };
  });

  //blogs

  const blogUrls = (blogsData ?? []).map((blog) => ({
    url: `${baseUrl}/${blog.slug}`, 
    lastModified,
  }));


  return [
    // Core pages
    {
      url: `${baseUrl}`,
      lastModified,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
    },
    {
      url: `${baseUrl}/instructors`,
      lastModified,
    },
    {
      url: `${baseUrl}/services`,
      lastModified,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified,
    },
    {
      url: `${baseUrl}/area-covered`,
      lastModified,
    },

    {
      url: `${baseUrl}/faq`,
      lastModified,
    },
    {
      url: `${baseUrl}/company/resources`,
      lastModified,
    },
    {
      url: `${baseUrl}/company/gallery`,
      lastModified,
    },
    {
      url: `${baseUrl}/company/testimonials`,
      lastModified,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified,
    },
    {
      url: `${baseUrl}/company/contact`,
      lastModified,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
    },
    {
      url: `${baseUrl}/return-refund`,
      lastModified,
    },
    // BLogs Pages
    ...blogUrls,
    // Service pages
    {
      url: `${baseUrl}/services/automatic-driving-lessons`,
      lastModified,
    },
    {
      url: `${baseUrl}/services/driving-test-package`,
      lastModified,
    },
    {
      url: `${baseUrl}/services/parking-package`,
      lastModified,
    },
   
    {
      url: `${baseUrl}/services/night-driving-lesson`,
      lastModified,
    },
    {
      url: `${baseUrl}/services/driving-test-assessment`,
      lastModified,
    },
    {
      url: `${baseUrl}/services/car-hire-for-instructor`,
      lastModified,
    },

    {
      url: `${baseUrl}/services/highway-package`,
      lastModified,
    },
    {
      url: `${baseUrl}/services/city-driving-package`,
      lastModified,
    },
// Location pages
    ...locationUrls,
  ];
}
