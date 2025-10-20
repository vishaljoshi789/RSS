import React from "react";
import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Vyapari } from "./types";
import { VyapariCard } from "./VyapariCard";

interface SearchResultsProps {
  vyaparis: Vyapari[];
  loading: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  vyaparis,
  loading,
}) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Search Results</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading
              ? "Searching..."
              : `${vyaparis.length} businesses found`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 animate-pulse bg-muted" />
              <CardContent className="p-4">
                <div className="h-4 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : vyaparis.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No businesses found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search filters
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vyaparis.map((vyapari) => (
            <VyapariCard key={vyapari.id} vyapari={vyapari} />
          ))}
        </div>
      )}
    </div>
  );
};
