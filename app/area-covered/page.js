"use client";

import React, {useState} from "react";
import PageHeroSection from "../shared/ui/PageHeroSection";
import Container from "../shared/ui/Container";
import {
  FaMapMarkerAlt,
  FaCar,
  FaCheckCircle,
  FaSearch,
  FaClock,
  FaUsers,
} from "react-icons/fa";
import {FiChevronRight} from "react-icons/fi";
import Image from "next/image";
import SecondaryBtn from "../shared/Buttons/SecondaryBtn";
import OutlineBtn from "../shared/Buttons/OutlineBtn";
import Faq from "../shared/Faq";
import WhyChooseUs from "../components/Home/WhyChooseUs";

const coveredLocations = [
  {name: "Allawah", zone: "South"},
  {name: "Arncliffe", zone: "South"},
  {name: "Banksia", zone: "South"},
  {name: "Bardwell Park", zone: "Inner West"},
  {name: "Bardwell Valley", zone: "South"},
  {name: "Beverly Hills", zone: "South West"},
  {name: "Bexley", zone: "South"},
  {name: "Bexley North", zone: "South"},
  {name: "Blakehurst", zone: "South"},
  {name: "Botany", zone: "East"},
  {name: "Brighton-Le-Sands", zone: "South"},
  {name: "Caringbah", zone: "Sutherland"},
  {name: "Caringbah South", zone: "Sutherland"},
  {name: "Carlton", zone: "South"},
  {name: "Carss Park", zone: "South"},
  {name: "Clemton Park", zone: "Inner West"},
  {name: "Cronulla", zone: "Sutherland"},
  {name: "Dolls Point", zone: "South"},
  {name: "Eastgardens", zone: "East"},
  {name: "Eastlakes", zone: "East"},
  {name: "Gymea", zone: "Sutherland"},
  {name: "Gymea Bay", zone: "Sutherland"},
  {name: "Hurstville", zone: "South"},
  {name: "Hurstville Grove", zone: "South"},
  {name: "Kangaroo Point", zone: "Sutherland"},
  {name: "Kareela", zone: "Sutherland"},
  {name: "Kingsgrove", zone: "Inner West"},
  {name: "Kirrawee", zone: "Sutherland"},
  {name: "Kogarah", zone: "South"},
  {name: "Kogarah Bay", zone: "South"},
  {name: "Kyeemagh", zone: "South"},
  {name: "Marrickville", zone: "Inner West"},
  {name: "Mascot", zone: "East"},
  {name: "Miranda", zone: "Sutherland"},
  {name: "Monterey", zone: "South"},
  {name: "Mortdale", zone: "South"},
  {name: "Pagewood", zone: "East"},
  {name: "Peakhurst", zone: "South"},
  {name: "Penshurst", zone: "South"},
  {name: "Port Botany", zone: "East"},
];

const zones = [
  {name: "South", count: 18, color: "bg-blue-100 text-blue-700"},
  {name: "Sutherland", count: 7, color: "bg-green-100 text-green-700"},
  {name: "East", count: 5, color: "bg-purple-100 text-purple-700"},
  {name: "Inner West", count: 5, color: "bg-orange-100 text-orange-700"},
  {name: "South West", count: 1, color: "bg-red-100 text-red-700"},
];

export default function AreaCovered() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZone, setSelectedZone] = useState("All");
  const [showMore, setShowMore] = useState(false);

  // Filter locations based on search and zone
  const filteredLocations = coveredLocations.filter((location) => {
    const matchesSearch = location.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesZone =
      selectedZone === "All" || location.zone === selectedZone;
    return matchesSearch && matchesZone;
  });

  const displayedLocations = showMore
    ? filteredLocations
    : filteredLocations.slice(0, 12);

  return (
    <div className="">
      <PageHeroSection
        title="Areas We Cover"
        subtitle="Our expert instructors provide professional driving lessons across Sydney's suburbs, ensuring comprehensive coverage for all your driving needs."
      />

      {/* Main Content */}
      <section className="pt-16">
        <Container>
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: <FaMapMarkerAlt className="text-primary" />,
                value: "40+",
                label: "Suburbs Covered",
              },
              {
                icon: <FaCar className="text-green-600" />,
                value: "15+",
                label: "Service Areas",
              },
              {
                icon: <FaClock className="text-purple-600" />,
                value: "24/7",
                label: "Flexible Booking",
              },
              {
                icon: <FaUsers className="text-orange-600" />,
                value: "2,500+",
                label: "Students Served",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-border-color text-center hover:shadow-xl transition-shadow"
              >
                <div className="text-3xl mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column - Content */}
            <div className="lg:w-1/2 space-y-8">
              <div>
                

                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  Comprehensive Driving Lesson Coverage <span className="text-primary">Across Sydney</span> 
                </h2>

                <p className="text-neutral  leading-relaxed mb-6">
                  Test Route Driving School proudly serves over 40 suburbs
                  across Sydney, providing expert driving instruction to
                  students in Southern Sydney, the Inner West, Eastern Suburbs,
                  and Sutherland Shire.
                </p>
              </div>

       

              {/* Features */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Why Choose Our Service:
                </h3>
                {[
                  "Pick-up and drop-off included in all covered areas",
                  "Local knowledge of test routes in each suburb",
                  "Flexible scheduling to suit your location",
                  "Modern dual-controlled vehicles for every lesson",
                  "Experienced instructors familiar with local roads",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Locations */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 h-full">
                {/* Search and Filter */}
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search for your suburb..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="All">All Zones</option>
                      {zones.map((zone) => (
                        <option key={zone.name} value={zone.name}>
                          {zone.name} ({zone.count})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    Showing {displayedLocations.length} of{" "}
                    {filteredLocations.length} suburbs
                    {selectedZone !== "All" && ` in ${selectedZone}`}
                  </div>
                </div>

                {/* Locations Grid */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {displayedLocations.map((location, index) => (
                      <div
                        key={index}
                        className="group flex items-center gap-2 p-3 bg-base-300 rounded-lg hover:bg-primary/10 cursor-pointer  border border-transparent transition-all"
                      >
                        <FaMapMarkerAlt className="text-primary " />
                        <div>
                          <div className="font-medium text-gray-900">
                            {location.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {location.zone}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredLocations.length > 12 && (
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="mt-6 w-full py-3 border-2 border-border-color text-primary font-semibold rounded-xl hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                    >
                      {showMore
                        ? "Show Less"
                        : `Show All ${filteredLocations.length} Suburbs`}
                      <FiChevronRight
                        className={`transform ${
                          showMore ? "rotate-90" : ""
                        } transition-transform`}
                      />
                    </button>
                  )}
                </div>

                {/* Not Found Your Suburb? */}
                {filteredLocations.length === 0 && (
                  <div className="text-center py-8">
                    <FaMapMarkerAlt className="text-4xl text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Suburb Not Found?
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Don&apos;t see your suburb in the list? We might still service
                      your area.
                    </p>
                    <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                      Contact Us to Check
                    </button>
                  </div>
                )}

              
              </div>
            </div>
          </div>

         
          
        </Container>
      </section>
      <WhyChooseUs/>
      <section className="mb-16">
        <Container>
          {/* CTA Section */}
          <div className=" bg-primary rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your Driving Journey?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Book your first lesson today and experience professional driving
              instruction in your local area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SecondaryBtn>Check Availability</SecondaryBtn>
              <OutlineBtn
                className={`border-white! text-white hover:bg-secondary hover:border-secondary!`}
              >
                Contact With Our Team
              </OutlineBtn>
            </div>
          </div>
        </Container>
      </section>
       <Faq />
    </div>
  );
}
