import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export function ServiceHero() {
  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2074&auto=format&fit=crop')",
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/85 to-background" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-screen-2xl px-4 py-20 sm:px-5 sm:py-24 lg:px-6 lg:py-28">
        {/* Main Heading */}
        <h1 className="mb-4 max-w-[50rem] text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
          Expert BMW Care
          <br />
          <span className="text-primary">From Touch-Ups to Total Restoration</span>
        </h1>

        {/* Subheadline */}
        <p className="mb-6 max-w-[40rem] text-lg text-muted-foreground sm:text-xl lg:text-2xl">
          Whether you need cosmetic repairs, protective treatments, or complete
          restoration, we deliver factory-exceeding results.
        </p>

        {/* Key Benefits */}
        <div className="mb-8 flex flex-wrap gap-4 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-primary">✓</span>
            <span>Genuine BMW Parts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">✓</span>
            <span>Factory-Level Precision</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">✓</span>
            <span>M Series Specialists</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
          <Link href="#request-form">
            <Button size="lg" className="font-semibold">
              Request Service
            </Button>
          </Link>
          <Link href="#request-form">
            <Button
              size="lg"
              variant="outline"
              className="font-semibold"
            >
              <ArrowDown className="mr-2 h-4 w-4" />
              View Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
