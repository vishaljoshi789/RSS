"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Clock,
  Users,
  Building2,
  Share2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

interface VyapariDetail {
  id: number;
  name: string;
  category: number | null;
  subcategory: number | null;
  owner: string | null;
  employee_count: string | null;
  short_description: string | null;
  long_description: string | null;
  phone: string;
  email: string | null;
  website_url: string | null;
  insta_url: string | null;
  facebook_url: string | null;
  address:
    | string
    | {
        address_line1?: string;
        address_line2?: string;
        street?: string;
        landmark?: string;
        city?: string;
        market?: string;
        district?: string;
        state?: string;
        postal_code?: string;
        country?: string;
      };
  location:
    | string
    | {
        latitude?: number;
        longitude?: number;
      };
  logo: string | null;
  cover_image: string | null;
  is_verified: boolean;
  date_joined: string;
}

interface Category {
  id: number;
  name: string;
}

const VyapariDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const axios = useAxios();
  const [vyapari, setVyapari] = useState<VyapariDetail | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchVyapariDetail();
    }
  }, [params.id]);

  const fetchVyapariDetail = async () => {
    try {
      const response = await axios.get(`/vyapari/vyapari/${params.id}/`);
      const data = response.data;

      if (typeof data.address === "string") {
        try {
          data.address = JSON.parse(data.address);
        } catch (e) {
          console.error("Failed to parse address:", e);
          data.address = {};
        }
      }

      if (typeof data.location === "string") {
        try {
          data.location = JSON.parse(data.location);
        } catch (e) {
          console.error("Failed to parse location:", e);
          data.location = {};
        }
      }

      setVyapari(data);

      if (data.category) {
        try {
          const categoryResponse = await axios.get(
            `/vyapari/category/${data.category}/`
          );
          setCategoryName(categoryResponse.data.name);
        } catch (error) {
          console.error("Error fetching category:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching vyapari details:", error);
      toast.error("Failed to load business details");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vyapari?.name || "Business",
        text: vyapari?.short_description || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const getFullAddress = () => {
    if (!vyapari?.address) return null;

    const addr =
      typeof vyapari.address === "string"
        ? JSON.parse(vyapari.address)
        : vyapari.address;

    return addr;
  };

  const getAddressLines = () => {
    const addr = getFullAddress();
    if (!addr) return [];

    const lines: string[] = [];

    // Line 1: address_line1
    if (addr.address_line1) lines.push(addr.address_line1);

    // Line 2: address_line2
    if (addr.address_line2) lines.push(addr.address_line2);

    // Line 3: street
    if (addr.street) lines.push(addr.street);

    // Line 4: landmark
    if (addr.landmark) lines.push(addr.landmark);

    // Line 5: city/market, district
    const cityDistrictParts = [addr.city || addr.market, addr.district].filter(
      Boolean
    );
    if (cityDistrictParts.length > 0) {
      lines.push(cityDistrictParts.join(", "));
    }

    // Line 6: state - postal_code
    const statePostalParts = [addr.state, addr.postal_code].filter(Boolean);
    if (statePostalParts.length > 0) {
      lines.push(statePostalParts.join(" - "));
    }

    // Line 7: country
    if (addr.country) lines.push(addr.country);

    return lines;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vyapari) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Business Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The business you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/vyapari")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-64 md:h-96 w-full bg-gradient-to-r from-primary/20 to-primary/10">
        {vyapari.cover_image ? (
          <Image
            src={vyapari.cover_image}
            alt={vyapari.name}
            fill
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 className="h-24 w-24 text-primary/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.back()}
            className="backdrop-blur-sm bg-background/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
            className="backdrop-blur-sm bg-background/80"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 pb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden border-4 border-background shadow-lg">
                      {vyapari.logo ? (
                        <Image
                          src={vyapari.logo}
                          alt={vyapari.name}
                          fill
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL={IMAGE_BLUR_DATA_URL}
                        />
                      ) : (
                        <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-10 w-10 text-primary" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h1 className="text-2xl md:text-3xl font-bold mb-2">
                            {vyapari.name}
                          </h1>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {categoryName && (
                              <Badge variant="outline">{categoryName}</Badge>
                            )}
                            {vyapari.is_verified && (
                              <Badge className="bg-green-600">Verified</Badge>
                            )}
                          </div>
                          {vyapari.short_description && (
                            <p className="text-muted-foreground">
                              {vyapari.short_description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {vyapari.long_description && (
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">About</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {vyapari.long_description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {(vyapari.owner || vyapari.employee_count) && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Business Information
                    </h2>
                    <div className="space-y-4">
                      {vyapari.owner && (
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Owner
                            </p>
                            <p className="font-medium">{vyapari.owner}</p>
                          </div>
                        </div>
                      )}
                      {vyapari.employee_count && (
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Employees
                            </p>
                            <p className="font-medium">
                              {vyapari.employee_count}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Member Since
                          </p>
                          <p className="font-medium">
                            {new Date(vyapari.date_joined).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="md:w-96">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <a
                      href={`tel:${vyapari.phone}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium truncate">{vyapari.phone}</p>
                      </div>
                    </a>

                    {vyapari.email && (
                      <a
                        href={`mailto:${vyapari.email}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium truncate">
                            {vyapari.email}
                          </p>
                        </div>
                      </a>
                    )}

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground mb-2">
                          Address
                        </p>
                        {getAddressLines().length > 0 ? (
                          <div className="text-sm space-y-0.5">
                            {getAddressLines().map((line, index) => (
                              <p key={index} className="text-muted-foreground">
                                {line}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Address not available
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-semibold mb-3">
                        Social Media
                      </h3>
                      <div className="space-y-3">
                        {vyapari.website_url ? (
                          <a
                            href={vyapari.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                          >
                            <Globe className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="flex-1 text-sm font-medium">
                              Website
                            </span>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </a>
                        ) : (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                            <Globe className="h-5 w-5 text-muted-foreground" />
                            <span className="flex-1 text-sm text-muted-foreground">
                              Website: Not provided
                            </span>
                          </div>
                        )}

                        {vyapari.insta_url ? (
                          <a
                            href={vyapari.insta_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                          >
                            <Instagram className="h-5 w-5 text-muted-foreground group-hover:text-pink-600 transition-colors" />
                            <span className="flex-1 text-sm font-medium">
                              Instagram
                            </span>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </a>
                        ) : (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                            <Instagram className="h-5 w-5 text-muted-foreground" />
                            <span className="flex-1 text-sm text-muted-foreground">
                              Instagram: Not provided
                            </span>
                          </div>
                        )}

                        {vyapari.facebook_url ? (
                          <a
                            href={vyapari.facebook_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                          >
                            <Facebook className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                            <span className="flex-1 text-sm font-medium">
                              Facebook
                            </span>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </a>
                        ) : (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                            <Facebook className="h-5 w-5 text-muted-foreground" />
                            <span className="flex-1 text-sm text-muted-foreground">
                              Facebook: Not provided
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <Button className="w-full" size="lg" asChild>
                      <a href={`tel:${vyapari.phone}`}>
                        <Phone className="mr-2 h-5 w-5" />
                        Call Now
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VyapariDetailPage;
