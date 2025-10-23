export function AboutSection() {
  return (
    <section
      className="bg-muted/30 py-16 sm:py-20 lg:py-24"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-5 lg:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Section Heading */}
          <h2
            id="about-heading"
            className="mb-6 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
          >
            About Enthusiast Auto
          </h2>

          {/* Main Description */}
          <p className="mb-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Enthusiast Auto offers curated BMW vehicles for sale and premium
            parts for BMW enthusiasts. We understand the passion for the
            ultimate driving machine.
          </p>

          {/* Value Propositions */}
          <div className="grid gap-6 text-left sm:grid-cols-3 sm:gap-8">
            {/* Value Prop 1 */}
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Quality Curation
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every vehicle is hand-selected and every part is carefully
                chosen for quality and authenticity.
              </p>
            </div>

            {/* Value Prop 2 */}
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                BMW Expertise
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Decades of combined experience with BMW vehicles and parts
                ensure you get the right fit.
              </p>
            </div>

            {/* Value Prop 3 */}
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Dual Offering
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Whether you're buying your dream BMW or upgrading your current
                one, we've got you covered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
