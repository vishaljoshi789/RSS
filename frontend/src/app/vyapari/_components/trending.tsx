import React from "react";
import { TrendingUp, Search, ArrowRight, Store } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

const VyapariTrending = () => {
  const trendingCompanies = [
    {
      id: 1,
      name: "Patanjali Ayurved",
      category: "Ayurvedic Products",
      logo: "https://banner2.cleanpng.com/20180809/gk/872c92f9a313587e848819131e0d9709.webp",
      searches: "12.5K",
    },
    {
      id: 2,
      name: "Amul",
      category: "Dairy Products",
      logo: "https://cdn.iconscout.com/icon/free/png-256/free-amul-icon-svg-download-png-2249167.png?f=webp&w=256",
      searches: "10.2K",
    },
    {
      id: 3,
      name: "Haldiram's",
      category: "Food & Snacks",
      logo: "https://www.pikpng.com/pngl/m/82-827034_open-haldiram-logo-png-clipart.png",
      searches: "9.8K",
    },
    {
      id: 4,
      name: "Baidyanath",
      category: "Ayurvedic Medicine",
      logo: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/0046b7db-cea8-4f34-bbff-0b6228fc0105.__CR0,0,300,300_PT0_SX300_V1___.jpg",
      searches: "8.5K",
    },
    {
      id: 5,
      name: "Britannia",
      category: "Food & Beverages",
      logo: "https://vectorseek.com/wp-content/uploads/2023/05/Britannia-Industries-Logo-Vector.jpg",
      searches: "7.9K",
    },
    {
      id: 6,
      name: "Dabur",
      category: "Healthcare",
      logo: "https://logodix.com/logo/1853933.jpg",
      searches: "7.3K",
    },
    {
      id: 7,
      name: "Mother Dairy",
      category: "Dairy Products",
      logo: "https://etimg.etb2bimg.com/photo/89062485.cms",
      searches: "6.8K",
    },
    {
      id: 8,
      name: "ITC Limited",
      category: "FMCG",
      logo: "https://www.brandcolorcode.com/images/color-palette/itc-ltd.png",
      searches: "6.2K",
    },
  ];

  return (
    <section className="w-full bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Popular This Week
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trending Business Searches
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover the most searched and trusted businesses in India
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trendingCompanies.map((company) => (
            <Link
              key={company.id}
              href={`/vyapari/business/${company.id}`}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="absolute right-3 top-3">
                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1">
                  <Search className="h-3 w-3 text-primary" />
                  <span className="text-xs font-semibold text-primary">
                    {company.searches}
                  </span>
                </div>
              </div>

              <div className="mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-2">
                <Image
                  src={company.logo}
                  alt={`${company.name} logo`}
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary">
                  {company.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {company.category}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                <span>View Details</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/vyapari/businesses"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <Store className="h-5 w-5" />
            View All Businesses
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VyapariTrending;
