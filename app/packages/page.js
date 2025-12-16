"use client";
import {useState} from "react";
import Container from "../shared/ui/Container";
import SectionHeader from "../shared/ui/SectionHeader";
import {
  FaSearch,
  FaFilter,
  FaClock,
  FaTimes,
  FaAngleDown,
} from "react-icons/fa";
import {FiChevronRight} from "react-icons/fi";
import PrimaryBtn from "../shared/Buttons/PrimaryBtn";
import packageImg from "@/app/assets/package1.png";
import Image from "next/image";
import Link from "next/link";
import PageHeroSection from "../shared/ui/PageHeroSection";
const packagesData = [
  {
    id: 1,
    name: "Starter Package",
    packageImg: packageImg,
    lessons: 5,
    duration: "5 Hours",
    durationNum: 5,
    price: 299,
    originalPrice: 349,
    description: "Perfect for beginners starting their driving journey.",
    features: [
      "5 driving lessons",
      "Theory material",
      "Progress tracking",
      "Beginner friendly",
    ],
    popular: false,
    savings: 50,
    category: "driving-lesson",
  },
  {
    id: 2,
    name: "Standard Package",
    packageImg: packageImg,
    lessons: 10,
    duration: "10 Hours",
    durationNum: 10,
    price: 549,
    originalPrice: 649,
    description: "Build confidence with structured lessons.",
    features: [
      "10 driving lessons",
      "Highway training",
      "Night driving",
      "Free mock test",
    ],
    popular: true,
    savings: 100,
    category: "driving-lesson",
  },
  {
    id: 3,
    name: "Premium Package",
    packageImg: packageImg,
    lessons: 15,
    duration: "15 Hours",
    durationNum: 15,
    price: 799,
    originalPrice: 949,
    description: "Advanced training with mock test preparation.",
    features: [
      "15 driving lessons",
      "Test routes practice",
      "Priority scheduling",
      "Guaranteed test slot",
    ],
    popular: false,
    savings: 150,
    category: "test-package",
  },
  {
    id: 4,
    name: "Test Ready Package",
    packageImg: packageImg,
    lessons: 3,
    duration: "3 Hours",
    durationNum: 3,
    price: 199,
    originalPrice: 249,
    description: "Final preparation before your driving test.",
    features: [
      "3 intensive lessons",
      "Test simulation",
      "Examiner tips",
      "Car for test day",
    ],
    popular: false,
    savings: 50,
    category: "test-package",
  },
  {
    id: 5,
    name: "Refresher Package",
    packageImg: packageImg,
    lessons: 4,
    duration: "4 Hours",
    durationNum: 4,
    price: 249,
    originalPrice: 299,
    description: "Ideal for returning or nervous drivers.",
    features: [
      "4 refresher lessons",
      "Confidence building",
      "Road safety update",
      "Flexible timing",
    ],
    popular: false,
    savings: 50,
    category: "driving-lesson",
  },
  {
    id: 6,
    name: "Intensive Course",
    packageImg: packageImg,
    lessons: 20,
    duration: "20 Hours",
    durationNum: 20,
    price: 999,
    originalPrice: 1199,
    description: "Complete driver training in shortest time.",
    features: [
      "20 comprehensive lessons",
      "All road types",
      "Emergency handling",
      "Certificate of completion",
    ],
    popular: true,
    savings: 200,
    category: "test-package",
  },
  {
    id: 7,
    name: "Weekend Warrior",
    packageImg: packageImg,
    lessons: 8,
    duration: "8 Hours",
    durationNum: 8,
    price: 449,
    originalPrice: 529,
    description: "Weekend-only lessons for busy schedules.",
    features: [
      "8 weekend lessons",
      "Saturday/Sunday slots",
      "Pickup service",
      "Progress reports",
    ],
    popular: false,
    savings: 80,
    category: "vouchers",
  },
  {
    id: 8,
    name: "Express Pass",
    packageImg: packageImg,
    lessons: 12,
    duration: "12 Hours",
    durationNum: 12,
    price: 699,
    originalPrice: 799,
    description: "Fast-track to your driving test.",
    features: [
      "12 focused lessons",
      "Test booking assistance",
      "Extra practice hours",
      "Discount on retest",
    ],
    popular: true,
    savings: 100,
    category: "vouchers",
  },
];

export default function Packages() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");

  const areaOptions = [
    {value: "all", label: "All Areas"},
    {value: "sydney", label: "Sydney"},
    {value: "parramatta", label: "Parramatta"},
    {value: "campbelltown", label: "Campbelltown"},
    {value: "blacktown", label: "Blacktown"},
  ];
  const durationOptions = [
    {value: "all", label: "All Durations"},
    {value: "short", label: "Short (1-5 Hours)", min: 1, max: 5},
    {value: "medium", label: "Medium (6-10 Hours)", min: 6, max: 10},
    {value: "long", label: "Long (11+ Hours)", min: 11, max: 100},
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
        pkg.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter((pkg) => {
      if (selectedDuration === "all") return true;

      const durationOption = durationOptions.find(
        (d) => d.value === selectedDuration
      );
      return (
        pkg.durationNum >= durationOption.min &&
        pkg.durationNum <= durationOption.max
      );
    })
    .filter((pkg) => {
      if (selectedCategory === "all") return true;
      return pkg.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "popular") return b.popular ? 1 : -1;
      if (sort === "duration") return a.durationNum - b.durationNum;
      return 0;
    });

  const activeFilters = [
    selectedDuration !== "all" &&
      `Duration: ${
        durationOptions.find((d) => d.value === selectedDuration)?.label
      }`,
    selectedCategory !== "all" &&
      `Category: ${
        categoryOptions.find((c) => c.value === selectedCategory)?.label
      }`,
    sort !== "default" &&
      `Sort: ${
        sort === "low"
          ? "Price Low to High"
          : sort === "high"
          ? "Price High to Low"
          : sort === "popular"
          ? "Most Popular"
          : "Duration"
      }`,
  ].filter(Boolean);

  const clearAllFilters = () => {
    setSearch("");
    setSelectedDuration("all");
    setSelectedCategory("all");
    setSort("default");
  };

  return (
    <section className="pb-16">
      <PageHeroSection title="All Packages" subtitle={`Explore our range of carefully designed packages tailored to suit every learner’s needs. Whether you’re a beginner or looking to advance your skills, each package offers structured lessons, flexible scheduling, and expert guidance to help you succeed. Find the plan that fits your goals and start progressing with confidence today.`}/>
      <Container>
        <div className="text-center mb-12">
          <SectionHeader
            title="Find Your Perfect Driving Package"
            subtitle="Choose from our flexible packages designed for every skill level and learning style"
          />
        </div>
      {/* Area/Suburb Filter */}
<div className="flex justify-end items-center gap-3">
  <span className="text-primary font-bold">Area:</span>
  <div className="relative w-48">
    <select
      value={selectedArea}
      onChange={(e) => setSelectedArea(e.target.value)}
      className="w-full appearance-none bg-white border border-gray-300 rounded-xl py-3 pl-4 pr-10 shadow-sm hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
    >
      {areaOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>

    {/* Dropdown Icon */}
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <FaAngleDown className="text-gray-400" />
    </div>
  </div>
</div>


        {/* Filter Controls */}
        <div className="mt-5 mb-8 space-y-6">
          {/* Main Filter Card */}
          <div className="bg-base-300 rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border-color rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
                />
              </div>

              {/* Duration Filter */}
              <div className="relative">
                <FaClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border border-border-color rounded-xl appearance-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
                >
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="relative">
                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border border-border-color rounded-xl appearance-none focus:border-primary focus:ring-2 focus:ring-primary outline-none transition bg-white"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">
                  Active filters:
                </span>
                {activeFilters.map((filter, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm"
                  >
                    {filter}
                    <button
                      onClick={() => {
                        if (filter.includes("Duration"))
                          setSelectedDuration("all");
                        else if (filter.includes("Category"))
                          setSelectedCategory("all");
                        else if (filter.includes("Sort")) setSort("default");
                      }}
                      className="ml-1 text-primary hover:text-primary"
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
        <div className="mb-6 flex justify-between items-center">
          <div className="text-gray-700">
            <span className="font-semibold">{filteredPackages.length}</span>{" "}
            packages found
          </div>
          <div className="text-sm text-gray-500">
            Showing {Math.min(filteredPackages.length, 8)} of{" "}
            {packagesData.length} total packages
          </div>
        </div>

        {/* Packages Grid */}
        {filteredPackages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No packages match your criteria
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Try adjusting your filters or search term to find the perfect
              driving package.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary transition-colors inline-flex items-center gap-2"
            >
              <FaTimes />
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPackages.map((pkg) => (
              <Link
                href={`/packages/${pkg.id}`}
                key={pkg.id}
                className={`group bg-base-300 rounded-xl shadow-lg  hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-border-color cursor-pointer`}
              >
                {/* Package Img */}
                <Image
                  src={pkg.packageImg}
                  width={100}
                  height={100}
                  alt="test route driving school package"
                  className="w-full"
                />
                <div className="p-5">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{pkg.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-end gap-2 mb-1">
                      <div className="text-3xl font-bold text-gray-900">
                        ${pkg.price}
                      </div>
                      <div className="text-lg text-gray-500 line-through">
                        ${pkg.originalPrice}
                      </div>
                    </div>
                  </div>

                  <PrimaryBtn className={``}>
                    Book The Package
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
