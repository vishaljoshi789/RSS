import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Vyapari } from "./types";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

interface VyapariCardProps {
  vyapari: Vyapari;
}

export const VyapariCard: React.FC<VyapariCardProps> = ({ vyapari }) => {
  return (
    <Link href={`/vyapari/${vyapari.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-48 overflow-hidden rounded-md">
          {vyapari.logo ? (
            <Image
              src={vyapari.logo}
              alt={vyapari.name}
              fill
              className="object-cover p-2 rounded-md transition-transform group-hover:scale-105"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Building2 className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{vyapari.name}</h3>
          {vyapari.short_description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {vyapari.short_description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            {vyapari.address?.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {vyapari.address.city}
              </span>
            )}
            {vyapari.business_type && (
              <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                {vyapari.business_type}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
