"use client";

import { VehicleHero } from "./VehicleHero";

interface GalleryImage {
  asset: {
    _id: string;
    url: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
    };
  };
  alt?: string;
  caption?: string;
}

interface VehicleHeroClientProps {
  title: string;
  price?: number;
  showCallForPrice: boolean;
  status: "current" | "sold";
  images: GalleryImage[];
  createdAt: string;
  slug: string;
  isFavorited: boolean;
}

export function VehicleHeroClient(props: VehicleHeroClientProps) {
  const handleFavoriteToggle = async () => {
    // TODO: Implement favorite toggle API call
    console.log("Toggle favorite for:", props.slug);
  };

  return <VehicleHero {...props} onFavoriteToggle={handleFavoriteToggle} />;
}
