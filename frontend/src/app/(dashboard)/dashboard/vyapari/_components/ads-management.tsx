"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import {
  AdsTable,
  AdsFormDialog,
  Advertisement,
  Vyapari,
} from "./ads";

const AdsManagement = () => {
  const axios = useAxios();
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [vyaparis, setVyaparis] = useState<Vyapari[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

  const fetchAds = useCallback(async (search?: string) => {
    setLoading(true);
    try {
      const searchParam = search ? `?search=${encodeURIComponent(search)}` : "";
      const response = await axios.get(`/vyapari/advertisement/${searchParam}`);
      setAds(response.data.results || response.data || []);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching ads:", error);
      }
      toast.error("Failed to fetch advertisements");
    } finally {
      setLoading(false);
    }
  }, [axios]);

  const fetchVyaparis = useCallback(async () => {
    try {
      const response = await axios.get("/vyapari/vyapari/");
      setVyaparis(response.data.results || response.data || []);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching vyaparis:", error);
      }
    }
  }, [axios]);

  useEffect(() => {
    fetchAds();
    fetchVyaparis();
  }, [fetchAds, fetchVyaparis]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAds(searchQuery);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchAds]);

  const handleOpenDialog = (ad?: Advertisement) => {
    setEditingAd(ad || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAd(null);
  };

  const handleSubmit = async (submitData: FormData) => {
    try {
      if (editingAd) {
        await axios.patch(`/vyapari/advertisement/${editingAd.id}/`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Advertisement updated successfully");
      } else {
        await axios.post("/vyapari/advertisement/", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Advertisement created successfully");
      }
      fetchAds();
      handleCloseDialog();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error saving ad:", error);
      }
      const errorResponse = error as { response?: { data?: { message?: string } } };
      toast.error(errorResponse.response?.data?.message || "Failed to save advertisement");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this advertisement?")) return;

    try {
      await axios.delete(`/vyapari/advertisement/${id}/`);
      toast.success("Advertisement deleted successfully");
      fetchAds();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting ad:", error);
      }
      toast.error("Failed to delete advertisement");
    }
  };

  const handleToggleActive = async (ad: Advertisement) => {
    try {
      await axios.patch(`/vyapari/advertisement/${ad.id}/`, {
        is_active: !ad.is_active,
      });
      toast.success(`Advertisement ${!ad.is_active ? "activated" : "deactivated"}`);
      fetchAds();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error toggling ad status:", error);
      }
      toast.error("Failed to update advertisement status");
    }
  };



  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Advertisement Management</CardTitle>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Advertisement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search advertisements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <AdsTable
            ads={ads}
            vyaparis={vyaparis}
            loading={loading}
            onEdit={handleOpenDialog}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        </CardContent>
      </Card>

      <AdsFormDialog
        open={isDialogOpen}
        editingAd={editingAd}
        vyaparis={vyaparis}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AdsManagement;
