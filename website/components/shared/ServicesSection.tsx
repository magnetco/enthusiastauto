import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { TitleBlock } from "@/components/shared/TitleBlock";

const services = [
  {
    number: "01",
    title: "Rejuvenation",
    slug: "rejuvenation",
    description:
      "Our comprehensive rejuvenation service breathes new life into your cherished BMW. We meticulously restore every aspect of your vehicle, from mechanical components to cosmetic details, bringing it back to its former glory. This service is perfect for classic BMWs or newer models that need a complete refresh, ensuring your car not only looks fantastic but also performs like it did when it first left the showroom.",
    image:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2074&auto=format&fit=crop",
  },
  {
    number: "02",
    title: "Mechanical",
    slug: "mechanical",
    description:
      "Keep your BMW running at its absolute best with our expert mechanical services. Our team of BMW specialists has extensive knowledge of all BMW models, allowing us to diagnose and repair any issues quickly and effectively. From routine maintenance to complex engine work, we use only genuine BMW parts and cutting-edge diagnostic tools to ensure your vehicle maintains its legendary performance and reliability for years to come.",
    image:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2070&auto=format&fit=crop",
  },
  {
    number: "03",
    title: "Cosmetic",
    slug: "cosmetic",
    description:
      "Enhance your BMW's appearance and protect its finish with our professional cosmetic services. We offer a range of treatments including paint correction, ceramic coating, and interior restoration. Our skilled technicians can address everything from minor blemishes to major cosmetic repairs, ensuring your BMW looks its absolute best. We pay attention to every detail, leaving your car looking showroom-fresh.",
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2070&auto=format&fit=crop",
  },
  {
    number: "04",
    title: "Conditioning",
    slug: "conditioning",
    description:
      "Preserve your BMW's value and condition with our meticulous detailing and conditioning treatments. Regular conditioning is crucial for maintaining your vehicle's appearance and preventing long-term wear. Our comprehensive service includes thorough cleaning of the exterior and interior, paint protection, and leather treatment. This proactive approach helps protect your investment, keeping your BMW in top condition for years to come.",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop",
  },
];

export function ServicesSection() {
  const [featured, ...secondaryServices] = services;

  return (
    <section
      className="relative bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-page-x">
        {/* Section Header */}
        <div className="mb-12 lg:mb-16">
          <TitleBlock
            title="Services"
            description="We are highly specialized on high performance BMW M-series only. The best of Bavaria. Take your dirty Supra down the road."
            id="services-heading"
            action={
              <Link
                href="/services"
                aria-label="Get an estimate"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "gap-2 rounded-full border-neutral-300 text-neutral-900 hover:bg-neutral-100"
                )}
              >
                Get an estimate
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            }
          />
        </div>

        {/* Featured Service (01) - Large Card */}
        <div className="mb-8 lg:mb-12">
          <Link
            href={`/services/${featured.slug}`}
            className="group grid gap-8 lg:grid-cols-[1.2fr,1fr] lg:gap-12"
          >
            {/* Featured Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg lg:aspect-auto lg:min-h-[400px]">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              {/* Image pagination dots */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                <span className="h-2 w-2 rounded-full bg-white/90" />
                <span className="h-2 w-2 rounded-full bg-white/40" />
                <span className="h-2 w-2 rounded-full bg-white/40" />
              </div>
            </div>

            {/* Featured Content */}
            <div className="flex flex-col justify-center lg:py-4">
              <span className="mb-2 font-mono text-sm tracking-wider text-neutral-400">
                {featured.number}
              </span>
              <h3 className="mb-4 font-headline text-xl uppercase tracking-wide text-neutral-900 sm:text-2xl">
                {featured.title}
              </h3>
              <p className="text-body-base leading-relaxed text-neutral-600">
                {featured.description}
              </p>
            </div>
          </Link>
        </div>

        {/* Secondary Services (02-04) - Three Column Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {secondaryServices.map((service) => (
            <Link
              key={service.number}
              href={`/services/${service.slug}`}
              className="group"
            >
              {/* Service Image */}
              <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Service Content */}
              <div>
                <span className="mb-1 block font-mono text-sm tracking-wider text-neutral-400">
                  {service.number}
                </span>
                <h3 className="mb-3 font-headline text-lg uppercase tracking-wide text-neutral-900 transition-colors group-hover:text-blue-600">
                  {service.title}
                </h3>
                <p className="line-clamp-5 text-sm leading-relaxed text-neutral-600">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA - Mobile */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/services"
            aria-label="Get an estimate"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full gap-2 rounded-full border-neutral-300 text-neutral-900 hover:bg-neutral-100"
            )}
          >
            Get an estimate
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
