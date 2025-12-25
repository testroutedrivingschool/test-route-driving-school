"use client";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Container from "@/app/shared/ui/Container";
import Link from "next/link";
import {useEffect, useState} from "react";
import {FaArrowRight} from "react-icons/fa";

const locations = [
  "Kogarah, NSW",
  "Allawah",
  "Arncliffe",
  "Banksia",
  "Bardwell Park",
  "Bardwell Valley",
  "Beverly Hills",
  "Bexley",
  "Bexley North",
  "Blakehurst",
  "Botany",
  "Brighton-Le-Sands",
  "Caringbah",
  "Caringbah South",
  "Carlton",
  "Carss Park",
  "Clemton Park",
  "Cronulla",
  "Dolls Point",
  "Eastgardens",
  "Eastlakes",
  "Gymea",
  "Gymea Bay",
  "Hurstville",
  "Hurstville Grove",
  "Kangaroo Point",
  "Kareela",
  "Kingsgrove",
  "Kirrawee",
  "Kogarah",
  "Kogarah Bay",
  "Kyeemagh",
  "Marrickville",
  "Mascot",
  "Miranda",
  "Monterey",
  "Mortdale",
  "Pagewood",
  "Peakhurst",
  "Penshurst",
  "Port Botany",
];

export default function FindInstructor() {
  const [searchLocationText, setSearchLocationText] = useState("");
  const [searchResultLocation, setSearchResultLocation] = useState([]);
  useEffect(() => {
    if (searchLocationText.length > 0) {
      const filteredLocations = locations.filter((location) =>
        location.toLowerCase().includes(searchLocationText.toLowerCase())
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchResultLocation(filteredLocations);
    }
  }, [searchLocationText]);

  const highlightMatch = (loc) => {
    const index = loc.toLowerCase().indexOf(searchLocationText.toLowerCase());
    if (index === -1 || searchLocationText === "") return loc;
    return (
      <>
        {loc.substring(0, index)}
        <span className="bg-yellow-200">
          {loc.substring(index, index + searchLocationText.length)}
        </span>
        {loc.substring(index + searchLocationText.length)}
      </>
    );
  };

  return (
    <section className="py-17 ">
      <Container>
        <div className="flex flex-col gap-8">
          {/* Left Column */}
          <div className="">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Find a driving instructor near you
            </h2>
            <p className="mb-6 text-gray-600">
              Whether you’re learning to drive in <strong>Carlton</strong> or{" "}
              <strong>Caringbah</strong>, we’ll find the perfect instructor to
              help you pass your driving test with confidence.
            </p>
            <form className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Search Location"
                value={searchLocationText}
                onChange={(e) => setSearchLocationText(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <PrimaryBtn type={"submit"}>Search</PrimaryBtn>
            </form>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {searchLocationText && searchResultLocation.length > 0
                ? searchResultLocation.map((loc, idx) => {
                    const locSlug = loc
                      .toLowerCase()
                      .replace(/,/g, "")
                      .replace(/\s+/g, "-")
                      .replace(/[^\w-]/g, "");

                    return (
                      <Link
                        href={`/area-covered/${locSlug}`}
                        key={idx}
                        className="bg-white border border-border-color rounded px-4 py-2 hover:bg-primary/10 cursor-pointer transition block"
                      >
                        {highlightMatch(loc)}
                      </Link>
                    );
                  })
                : searchLocationText && (
                    <p className="text-gray-500">No locations found.</p>
                  )}
            </div>
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-2  md:grid-cols-4 gap-3">
            {locations.map((loc) => {
              const locSlug = loc
                .toLowerCase()
                .replace(/,/g, "")
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, "");
              return (
                <Link
                  key={loc}
                  href={`/area-covered/${locSlug}`}
                  className="bg-primary text-white py-3 rounded text-left px-4 shadow hover:scale-105 transition flex gap-1 items-center text-sm md:text-base"
                >
                  {loc} <FaArrowRight size={15} />
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
