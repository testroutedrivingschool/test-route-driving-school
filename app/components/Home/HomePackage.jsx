import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import SecondaryBtn from "@/app/shared/Buttons/SecondaryBtn";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import {FaCheck} from "react-icons/fa";
import {FiChevronRight} from "react-icons/fi";

export const packages = [
  {
    id: 1,
    name: "1 Hour Lesson",
    description: "Perfect for beginners needing a short, focused session.",
    regularPrice: "$50",
    discountPrice: "$40",
    duration: "1 hour",
    features: [
      "Modern dual-controlled vehicle",
      "Pick up from home/work",
      "Certified instructor",
      "Flexible scheduling",
    ],
  },
  {
    id: 2,
    name: "2 Hour Lesson",
    description: "Comprehensive session for building confidence on the road.",
    regularPrice: "$90",
    discountPrice: "$75",
    duration: "2 hours",
    features: [
      "Modern dual-controlled vehicle",
      "Pick up from home/work",
      "Detailed feedback session",
      "Highway & city driving",
    ],
    popular: true,
  },
  {
    id: 3,
    name: "3 Hour Lesson",
    description: "Extended practice with varied road conditions.",
    regularPrice: "$130",
    discountPrice: "$110",
    duration: "3 hours",
    features: [
      "Modern dual-controlled vehicle",
      "Night driving practice",
      "Parallel parking focus",
      "Roundabout mastery",
    ],
  },
  {
    id: 4,
    name: "5 Hour Package",
    description: "Perfect for beginners needing extensive practice.",
    regularPrice: "$200",
    discountPrice: "$170",
    duration: "5 hours",
    features: [
      "Split over 2-3 sessions",
      "All road conditions covered",
      "Free mock test",
      "Progress tracking",
    ],
  },
  {
    id: 5,
    name: "Test Preparation",
    description: "Focused practice for your driving test.",
    regularPrice: "$150",
    discountPrice: "$130",
    duration: "2.5 hours",
    features: [
      "Test route practice",
      "Examiner tips & tricks",
      "Mock driving test",
      "Pre-test warm-up",
    ],
  },
  {
    id: 6,
    name: "Advanced Driving",
    description: "Build confidence for highway and challenging roads.",
    regularPrice: "$250",
    discountPrice: "$220",
    duration: "4 hours",
    features: [
      "Highway driving",
      "Defensive driving techniques",
      "Adverse weather tips",
      "Emergency maneuvers",
    ],
  },
];

export default function HomePackage() {
  return (
    <section className="mt-10 ">
      <Container>
        <SectionHeader
          title="Driving Lesson Packages"
          subtitle="Choose the perfect package for your learning journey. All lessons include certified instructors and modern vehicles."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-10">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-base-300 rounded-2xl shadow-md border-b-8 border-b-primary transition-all duration-300 overflow-hidden border border-border-color flex flex-col `}
            >
              {pkg.popular && (
                <div className="bg-accent text-black text-center py-2 text-sm font-semibold">
                  ⭐ Most Popular
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                {/* Package Header */}
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {pkg.name}
                    </h3>
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {pkg.duration}
                    </span>
                  </div>
                  <p className="text-gray-600">{pkg.description}</p>
                </div>

                {/* Pricing */}
                <div className="mb-6 p-4 bg-linear-to-r from-gray-50 to-blue-50 rounded-xl">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {pkg.discountPrice}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {pkg.regularPrice}
                    </span>
                    <span className="ml-auto text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      Save $
                      {parseInt(pkg.regularPrice.slice(1)) -
                        parseInt(pkg.discountPrice.slice(1))}
                    </span>
                  </div>
                 
                </div>

                {/* Features */}
                <div className="mb-6 flex-1">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    What&apos;s included:
                  </h4>
                  <ul className="space-y-3">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <FaCheck className="text-blue-600" size={12} />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <PrimaryBtn className="mt-auto w-full py-3 group hover:scale-[1.02] transition-transform duration-200">
                  <span className="flex items-center justify-center gap-2 font-semibold">
                    Get This Package
                    <FiChevronRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </PrimaryBtn>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <PrimaryBtn className={`py-4`}>View All Packages</PrimaryBtn>
        </div>
      </Container>
    </section>
  );
}
