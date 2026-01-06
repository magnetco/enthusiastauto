import Link from "next/link";

import FooterMenu from "components/layout/footer-menu";
import LogoSquare from "components/logo-square";
import { getMenu } from "lib/shopify";
import { Suspense } from "react";

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
  const skeleton =
    "w-full h-6 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-700";
  const menu = await getMenu("next-js-frontend-footer-menu");
  const copyrightName = COMPANY_NAME || SITE_NAME || "";

  return (
    <footer className="text-sm text-muted-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 border-t border-border/50 px-6 py-16 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0">
        <div>
          <Link
            className="flex items-center gap-2 font-bold text-foreground transition-opacity duration-200 hover:opacity-80 md:pt-1"
            href="/"
          >
            <LogoSquare size="sm" />
            <span className="uppercase tracking-wide">{SITE_NAME}</span>
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[188px] w-[200px] flex-col gap-2">
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
            </div>
          }
        >
          <FooterMenu menu={menu} />
        </Suspense>
        <div className="md:ml-auto">
          <a
            className="flex h-10 w-max flex-none items-center justify-center rounded-lg border border-border/50 bg-card text-xs font-medium text-foreground shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md"
            aria-label="Deploy on Vercel"
            href="https://vercel.com/templates/next.js/nextjs-commerce"
          >
            <span className="px-4">▲</span>
            <hr className="h-full border-r border-border/50" />
            <span className="px-4">Deploy</span>
          </a>
        </div>
      </div>
      <div className="border-t border-border/50 py-8 text-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-2 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith(".")
              ? "."
              : ""}{" "}
            All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-[1px] border-l border-border md:inline-block" />
          <p>
            <a href="https://github.com/vercel/commerce" className="transition-colors duration-200 hover:text-foreground">View the source</a>
          </p>
          <p className="md:ml-auto">
            <a href="https://vercel.com" className="font-medium text-foreground transition-opacity duration-200 hover:opacity-80">
              Created by ▲ Vercel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
