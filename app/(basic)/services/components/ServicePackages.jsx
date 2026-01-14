import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import Container from "@/app/shared/ui/Container";
import SectionHeader from "@/app/shared/ui/SectionHeader";
import {TbSteeringWheelFilled} from "react-icons/tb";

export default function ServicePackages({
  sectionTitle,
  sectionSubtitle,
  packages,
}) {
  return (
    <section className="py-16 bg-base-300">
      <Container>
        <SectionHeader
          className={`mt-0!`}
          title={sectionTitle}
          subtitle={sectionSubtitle}
        />

        <div className="mt-10 flex flex-wrap gap-4 shrink-0">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="w-full md:flex-1 group rounded-xl bg-white px-8 py-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-border-color"
            >
              {/* Icon */}
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                <TbSteeringWheelFilled size={40} />
              </div>

              {/* Title */}
              <h3 className="text-center text-lg md:text-xl font-semibold text-gray-900">
                {pkg.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-center text-sm text-neutral">
                {pkg.description}
              </p>

              {/* Features */}
              {pkg.features && pkg.features.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span className="text-neutral">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Divider */}
              <div className="my-6 h-px bg-border-color" />

              {/* Price */}
              <div className="text-center">
                <span className="text-4xl font-extrabold text-gray-900">
                  ${pkg.price}
                </span>
              </div>

              <PrimaryBtn className={`w-full! mt-4 text-center! block!`}>
                {pkg.buttonText}
              </PrimaryBtn>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
