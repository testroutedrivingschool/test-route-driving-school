"use client";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Container from "@/app/shared/ui/Container";
import { locations } from "@/app/utils/locations";
import Link from "next/link";
import {useEffect, useState} from "react";
import {FaArrowRight} from "react-icons/fa";



export default function FindInstructor() {
  const [searchLocationText, setSearchLocationText] = useState("");
  const [searchResultLocation, setSearchResultLocation] = useState([]);
  useEffect(() => {
    if (searchLocationText.length > 0) {
      const filteredLocations = locations.filter((location) =>
        location.name.toLowerCase().includes(searchLocationText.toLowerCase())
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchResultLocation(filteredLocations);
    }
  }, [searchLocationText]);

const highlightMatch = (name) => {
  const index = name.toLowerCase().indexOf(searchLocationText.toLowerCase());
  if (index === -1 || searchLocationText === "") return name;

  return (
    <>
      {name.substring(0, index)}
      <span className="bg-yellow-200">
        {name.substring(index, index + searchLocationText.length)}
      </span>
      {name.substring(index + searchLocationText.length)}
    </>
  );
};


  return (
    <section className="py-17 ">
      <Container>
        <div className="flex flex-col gap-8">
          {/* Left Column */}
          <div className="">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-4 ">
              Find a driving instructor <span className="text-primary">near you</span>
            </h2>
            <p className="mb-6 text-neutral">
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
                    const locSlug = loc.name
                      .toLowerCase()
                      .replace(/,/g, "")
                      .replace(/\s+/g, "-")
                      .replace(/[^\w-]/g, "");

                    return (
                      <Link
                        href={`/driving-school-in/${locSlug}`}
                        key={idx}
                        className="bg-white border border-border-color rounded px-4 py-2 hover:bg-primary/10 cursor-pointer transition block"
                      >
                        {highlightMatch(loc.name)}
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
            {locations.map((loc,idx) => {
              const locSlug = loc.name
                .toLowerCase()
                .replace(/,/g, "")
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, "");
              return (
                <Link
                  key={idx}
                  href={`/driving-school-in/${locSlug}`}
                  className="bg-primary text-white py-3 rounded text-left px-4 shadow hover:scale-105 transition flex gap-1 items-center text-sm md:text-base"
                >
                  {loc.name} <FaArrowRight size={15} />
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
