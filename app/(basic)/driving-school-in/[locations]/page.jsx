import { locationData } from "./locationData/locationData";
import LocationPageClient from "./LocationPageClient";

export async function generateMetadata({ params }) {
   const resolvedParams = await params;



  const slug = Array.isArray(resolvedParams.locations)
    ? resolvedParams.locations[0]
    : resolvedParams.locations;


  const data = locationData[slug];
  if (!data) {
    return {
      title: "Driving Lessons in Sydney | Test Route Driving School",
      description:
        "Professional driving lessons across Sydney suburbs with expert instructors.",
    };
  }

  return {
    title: data.pageTitle,
    description: data.metaDescription,
    keywords: data.keywords,
  };
}

export default async function LocationDetailsPage({ params }) {
  const resolvedParams = await params;



  const slug = Array.isArray(resolvedParams.locations)
    ? resolvedParams.locations[0]
    : resolvedParams.locations;


 

  const data = locationData[slug] || null;

  return <LocationPageClient locationData={data} />;
}
