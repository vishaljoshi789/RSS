"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers, AlertCircle } from "lucide-react";
import useAxios from "@/hooks/use-axios";
import { Category } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

const VyapariCategories = () => {
  const axios = useAxios();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/vyapari/category/");
      setCategories(response.data.results || response.data || []);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <Skeleton className="h-40 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="py-16 text-center">
            <Layers className="mx-auto h-16 w-16 text-muted-foreground opacity-20" />
            <h3 className="mt-4 text-lg font-semibold">No Categories Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No business categories are available at the moment.
            </p>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/vyapari/category/${category.id}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
              >
                {category.image ? (
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                ) : (
                  <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Layers className="h-16 w-16 text-primary/40" />
                  </div>
                )}

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    <span>Browse Category</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/vyapari/category"
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
