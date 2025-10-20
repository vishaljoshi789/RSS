import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
  onToggleFilters: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  loading,
  onToggleFilters,
}) => {
  return (
    <div className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for businesses, products, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              className="h-12 pl-10 text-base"
            />
          </div>
          <Button
            onClick={onSearch}
            disabled={loading}
            className="h-12 px-8"
          >
            <Search className="mr-2 h-5 w-5" />
            {loading ? "Searching..." : "Search"}
          </Button>
          <Button
            variant="outline"
            onClick={onToggleFilters}
            className="h-12 px-6 lg:hidden"
          >
            <Search className="mr-2 h-5 w-5" />
            Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
