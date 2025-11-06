"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Building2,
  Layers,
  Search,
  ArrowRight,
  Store,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import useAxios from "@/hooks/use-axios";
import type { Category } from "../types";
import { buildMediaUrl } from "@/lib/media";

export default function CategoriesPage() {
  const router = useRouter();
  const axios = useAxios();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string | null | undefined) => {
    return buildMediaUrl(imagePath) ?? null;
  };

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

  // Filter categories by search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="h-16 w-full mb-8 rounded-2xl" />
          <Skeleton className="h-12 w-full mb-8" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button variant="outline" className="mt-4" onClick={fetchCategories}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Business Categories
              </h1>
              <p className="text-muted-foreground">
                Explore businesses by category
              </p>
            </div>
          </div>

          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>

        
        <div className="mb-6">
          <Badge variant="secondary" className="px-4 py-2">
            <Layers className="mr-2 h-4 w-4" />
            {filteredCategories.length} {filteredCategories.length === 1 ? 'Category' : 'Categories'} Available
          </Badge>
        </div>

        
        {filteredCategories.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-20 text-center">
              <Layers className="mx-auto h-20 w-20 text-muted-foreground/30" />
              <h3 className="mt-6 text-xl font-semibold">No Categories Found</h3>
              <p className="mt-2 text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search term"
                  : "No categories available at the moment"}
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCategories.map((category) => (
              <Card
                key={category.id}
                className="group cursor-pointer overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
                onClick={() => router.push(`/vyapari/category/${category.id}`)}
              >
                {/* Category Image with Padding */}
                {getImageUrl(category.image) ? (
                  <div className="p-4 pb-0">
                    <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                      <Image
                        src={getImageUrl(category.image)!}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 pb-0">
                    <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Layers className="h-16 w-16 text-primary/40" />
                      </div>
                    </div>
                  </div>
                )}

                <CardContent className="p-4">
                  <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">
                    {category.name}
                  </h3>
                  
                  {category.description ? (
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                      {category.description}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic min-h-[40px]">
                      Explore businesses in this category
                    </p>
                  )}

                  <Button
                    variant="outline"
                    className="mt-2 w-full group-hover:bg-primary/10 group-hover:text-primary"
                  >
                    <span>View Businesses</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}