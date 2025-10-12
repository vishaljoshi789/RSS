import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers } from "lucide-react";

const VyapariCategories = () => {
  const categories = [
    {
      id: 1,
      name: "Food & Beverages",
      description: "Restaurants, cafes, and food products",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
      totalCompanies: 1250,
      color: "from-orange-500/20 to-red-500/20",
    },
    {
      id: 2,
      name: "Healthcare & Wellness",
      description: "Ayurvedic, medical, and wellness services",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
      totalCompanies: 850,
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      id: 3,
      name: "Retail & E-commerce",
      description: "Online and offline retail businesses",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      totalCompanies: 2100,
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: 4,
      name: "Manufacturing",
      description: "Industrial and production companies",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      totalCompanies: 650,
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      id: 5,
      name: "Technology & IT",
      description: "Software, hardware, and IT services",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
      totalCompanies: 920,
      color: "from-indigo-500/20 to-blue-500/20",
    },
    {
      id: 6,
      name: "Agriculture & Farming",
      description: "Agricultural products and services",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
      totalCompanies: 580,
      color: "from-lime-500/20 to-green-500/20",
    },
    {
      id: 7,
      name: "Textile & Apparel",
      description: "Clothing, fabrics, and fashion",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea1c8347?w=400&h=300&fit=crop",
      totalCompanies: 780,
      color: "from-pink-500/20 to-rose-500/20",
    },
    {
      id: 8,
      name: "Education & Training",
      description: "Schools, institutes, and training centers",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
      totalCompanies: 430,
      color: "from-amber-500/20 to-orange-500/20",
    },
    {
      id: 9,
      name: "Financial Services",
      description: "Banking, insurance, and financial advisory",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop",
      totalCompanies: 340,
      color: "from-teal-500/20 to-cyan-500/20",
    },
    {
      id: 10,
      name: "Home & Furniture",
      description: "Furniture, decor, and home essentials",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
      totalCompanies: 520,
      color: "from-slate-500/20 to-gray-500/20",
    },
    {
      id: 11,
      name: "Automotive",
      description: "Vehicles, parts, and automotive services",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop",
      totalCompanies: 410,
      color: "from-red-500/20 to-orange-500/20",
    },
    {
      id: 12,
      name: "Beauty & Personal Care",
      description: "Cosmetics, salons, and personal care",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
      totalCompanies: 690,
      color: "from-fuchsia-500/20 to-pink-500/20",
    },
  ];

  return (
    <section className="w-full bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Browse by Category
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Explore Business Categories
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find businesses across various industries and sectors
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/vyapari/category/${category.id}`}
              className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
            >
              {/* Category Image */}
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Overlay Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color}`} />
                
                {/* Company Count Badge */}
                <div className="absolute right-3 top-3">
                  <div className="flex items-center gap-1 rounded-full bg-background/90 px-3 py-1.5 backdrop-blur-sm">
                    <span className="text-xs font-bold text-foreground">
                      {category.totalCompanies}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      companies
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.description}
                </p>

                {/* View Button */}
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  <span>Browse Category</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="mt-12 text-center">
          <Link
            href="/vyapari/categories"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <Layers className="h-5 w-5" />
            View All Categories
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VyapariCategories;
