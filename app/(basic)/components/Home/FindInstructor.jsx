"use client";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Container from "@/app/shared/ui/Container";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa";

export default function FindInstructor() {
  const [searchLocationText, setSearchLocationText] = useState("");

  const { data: locations = [], isLoading, isError } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await axios.get("/api/locations");
      return res.data || [];
    },
  });

  // ✅ filtered list derived from state (no need extra state)
  const searchResultLocation = useMemo(() => {
    const q = searchLocationText.trim().toLowerCase();
    if (!q) return [];
    return locations.filter((loc) =>
      String(loc?.name || "").toLowerCase().includes(q)
    );
  }, [searchLocationText, locations]);

  const highlightMatch = (name) => {
    const q = searchLocationText.trim();
    if (!q) return name;

    const lowerName = name.toLowerCase();
    const lowerQ = q.toLowerCase();
    const index = lowerName.indexOf(lowerQ);

    if (index === -1) return name;

    return (
      <>
        {name.substring(0, index)}
        <span className="bg-yellow-200">
          {name.substring(index, index + q.length)}
        </span>
        {name.substring(index + q.length)}
      </>
    );
  };

  const toSlug = (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/,/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

  return (
    <section className="py-17">
      <Container>
        <div className="flex flex-col gap-8">
          {/* Left Column */}
          <div>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-4">
              Find a driving instructor{" "}
              <span className="text-primary">near you</span>
            </h2>

            <p className="mb-6 text-neutral">
              Whether you’re learning to drive in <strong>Carlton</strong> or{" "}
              <strong>Caringbah</strong>, we’ll find the perfect instructor to
              help you pass your driving test with confidence.
            </p>

            <form
              className="flex gap-2 mb-4"
              onSubmit={(e) => e.preventDefault()} // ✅ prevent refresh
            >
              <input
                type="text"
                placeholder="Search Location"
                value={searchLocationText}
                onChange={(e) => setSearchLocationText(e.target.value)}
                className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <PrimaryBtn className={`px-2! md:px-4! text-sm! md:text-base! `} type="submit">Search</PrimaryBtn>
            </form>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {isError && (
                <p className="text-red-500">Failed to load locations.</p>
              )}

              {!isLoading && searchLocationText && searchResultLocation.length > 0
                ? searchResultLocation.map((loc, idx) => {
                    const locSlug = toSlug(loc?.name);
                    return (
                      <Link
                        href={`/driving-school-in/${locSlug}`}
                        key={loc?._id || idx}
                        className="bg-white border border-border-color rounded px-4 py-2 hover:bg-primary/10 cursor-pointer transition block"
                      >
                        {highlightMatch(loc.name)}
                      </Link>
                    );
                  })
                : !isLoading &&
                  searchLocationText && (
                    <p className="text-gray-500">No locations found.</p>
                  )}
            </div>
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(locations || []).map((loc, idx) => {
              const locSlug = toSlug(loc?.name);
              return (
                <Link
                  key={loc?._id || idx}
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