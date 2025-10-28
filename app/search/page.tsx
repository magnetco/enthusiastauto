import { SearchResults } from "@/components/search/SearchResults";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | Enthusiast Auto",
  description: "Search for BMW vehicles and parts",
};

interface SearchPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;
  const query = (searchParams?.q as string) || "";
  const type = (searchParams?.type as "vehicles" | "parts" | "all") || "all";
  const page = parseInt((searchParams?.page as string) || "1", 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchResults query={query} type={type} page={page} />
    </div>
  );
}
