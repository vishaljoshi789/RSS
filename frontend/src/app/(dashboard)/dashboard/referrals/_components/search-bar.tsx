"use client";

import React from "react";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchBarProps } from "../referal";

export const SearchBar: React.FC<SearchBarProps> = ({
  userId,
  loading,
  onUserIdChange,
  onSearch,
  onKeyPress,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User ID से खोजें</CardTitle>
        <CardDescription>उपयोगकर्ता की अद्वितीय ID दर्ज करें</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            placeholder="User ID दर्ज करें (उदा: a27447fb)"
            value={userId}
            onChange={(e) => onUserIdChange(e.target.value)}
            onKeyPress={onKeyPress}
            className="flex-1"
          />
          <Button onClick={onSearch} disabled={loading} data-search-button>
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                खोज रहे हैं...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                खोजें
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
