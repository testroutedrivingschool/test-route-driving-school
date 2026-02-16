"use client";
import {useState} from "react";
import {FaSearch, FaFilter, FaTimes, FaAngleDown} from "react-icons/fa";
import {FiChevronRight} from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import PageHeroSection from "@/app/shared/ui/PageHeroSection";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import {useQuery} from "@tanstack/react-query";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import axios from "axios";
import {addToCartLS} from "@/app/utils/cart";
import {useRouter} from "next/navigation";

export default function Packages() {
  const {data: packagesData = [], isLoading} = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await axios.get("/api/packages");
      return res.data;
    },
  });

  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");

  const areaOptions = [
    {value: "all", label: "All Areas"},
    {value: "sydney", label: "Sydney"},
    {value: "parramatta", label: "Parramatta"},
    {value: "campbelltown", label: "Campbelltown"},
    {value: "blacktown", label: "Blacktown"},
  ];

  const categoryOptions = [
    {value: "all", label: "All Categories"},
    {value: "driving-lesson", label: "Driving Lesson"},
    {value: "vouchers", label: "Vouchers"},
    {value: "test-package", label: "Test Packages"},
  ];

  const filteredPackages = packagesData
    .filter(
      (pkg) =>
        pkg.name.toLowerCase().includes(search.toLowerCase()) ||
        pkg.description.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((pkg) => {
      if (selectedCategory === "all") return true;
      return pkg.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "popular") return Number(b.popular) - Number(a.popular);
      return 0;
    });

  const activeFilters = [
    selectedCategory !== "all" &&
      `Category: ${
        categoryOptions.find((c) => c.value === selectedCategory)?.label
      }`,
    selectedArea !== "all" &&
      `Area: ${areaOptions.find((a) => a.value === selectedArea)?.label}`,
    sort !== "default" &&
      `Sort: ${
        sort === "low"
          ? "Price Low to High"
          : sort === "high"
            ? "Price High to Low"
            : "Most Popular"
      }`,
  ].filter(Boolean);

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedArea("all");
    setSort("default");
  };

  const handleAddToCart = (pkg, e) => {
    e.preventDefault();
    addToCartLS(pkg);
    router.push("/cart");
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="pb-16">
      <PageHeroSection
        title="Learn Faster with Our Professional Driving Package"
        subtitle={
          <>
            Are you looking for the{" "}
            <strong>best driving package near me</strong> in Kogarah? At{" "}
            <Link className="font-semibold underline px-1" href={`/`}>
              Test Route Driving School,
            </Link>{" "}
            we offer <strong>professional driving packages</strong> designed to
            help you learn faster, build confidence, and pass your driving test
            with ease. Whether you’re a beginner or need extra practice, our{" "}
            <a
              href="https://en.wikipedia.org/wiki/Driver%27s_license"
              target="_blank"
              className="location-link"
            >
              driving school packages
            </a>{" "}
            cater to every learner’s needs.
          </>
        }
      />
      <Container>
        <div className="text-center mb-12">
          <SectionHeader
            title="Find Your Perfect Driving Package"
            subtitle={
              <>
                Choosing the right{" "}
                <Link
                  className="font-semibold underline px-1"
                  href={`/services/automatic-driving-lessons`}
                >
                  driving lesson package
                </Link>{" "}
                is simple. Our <strong>driving school packages</strong> fit your
                schedule, skill, and needs, making learning easy, flexible, and
                confidence-boosting in every session.
              </>
            }
          />
        </div>

        {/* Filter Controls */}
        <div className="mb-8">
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-border-color">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <span className="text-primary font-semibold block mb-1">
                  Search:
                </span>
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search packages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <span className="text-primary font-semibold block mb-1">
                  Category:
                </span>
                <div className="relative">
                  <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition bg-white appearance-none"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Area */}
              <div>
                <span className="text-primary font-semibold block mb-1">
                  Area:
                </span>
                <div className="relative">
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition bg-white appearance-none"
                  >
                    {areaOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <FaAngleDown className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-neutral font-medium">
                  Active filters:
                </span>
                {activeFilters.map((filter, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {filter}
                    <button
                      onClick={() => {
                        if (filter.includes("Category"))
                          setSelectedCategory("all");
                        else if (filter.includes("Area"))
                          setSelectedArea("all");
                        else if (filter.includes("Sort")) setSort("default");
                      }}
                      className="ml-1 hover:text-blue-900"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center text-gray-700 gap-2">
          <div className="font-semibold">
            {filteredPackages.length} packages found
          </div>
          <div className="text-sm text-gray-500">
            Showing {Math.min(filteredPackages.length, 8)} of{" "}
            {packagesData.length} total packages
          </div>
        </div>

        {/* Packages Grid */}
        {filteredPackages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-6xl mb-4 animate-bounce">🚗</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No packages match your criteria
            </h3>
            <p className="text-neutral max-w-md mx-auto mb-6">
              Try adjusting your filters or search term to find the perfect
              driving package.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition inline-flex items-center gap-2"
            >
              <FaTimes />
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPackages.map((pkg) => (
              <Link
                href={`/packages/${pkg.slug}`}
                key={pkg._id}
                className="group bg-white rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer border border-gray-200 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="w-full h-60">
                  <Image
                    src={pkg.packageThumbline}
                    alt={pkg.name}
                    width={800}
                    height={800}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>

                  {/* Description */}
                  <p className="text-neutral text-sm mb-4 line-clamp-3">
                    {pkg.description.length > 60
                      ? pkg.description.slice(0, 60) + "..."
                      : pkg.description}
                  </p>

                  {/* Price */}
                  <div className="text-2xl font-bold text-gray-900 mb-4">
                    ${pkg.price}
                    {pkg.originalPrice != 0 && pkg.originalPrice && (
                      <span className="text-gray-400 line-through ml-2">
                        ${pkg.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Button */}
                  <PrimaryBtn
                    onClick={(e) => handleAddToCart(pkg, e)}
                    className="w-full flex justify-center items-center gap-2 mt-auto"
                  >
                    Add to Cart
                    <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </PrimaryBtn>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
