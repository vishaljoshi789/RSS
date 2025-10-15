"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldX,
  Ban,
  UnlockKeyhole,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import type { Vyapari, Category, SubCategory } from "../types";
import VyapariFormModal from "./vyapari-form-modal";

export default function VyapariManagement() {
  const axios = useAxios();

  const [vyaparis, setVyaparis] = useState<Vyapari[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentVyapari, setCurrentVyapari] = useState<Vyapari | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vyaparisRes, categoriesRes, subcategoriesRes] = await Promise.all([
        axios.get("/vyapari/vyapari/"),
        axios.get("/vyapari/category/"),
        axios.get("/vyapari/subcategory/"),
      ]);
      setVyaparis(vyaparisRes.data.results || vyaparisRes.data || []);
      setCategories(categoriesRes.data.results || categoriesRes.data || []);
      setSubcategories(
        subcategoriesRes.data.results || subcategoriesRes.data || []
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return "N/A";
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const getSubCategoryName = (subcategoryId: number | null) => {
    if (!subcategoryId) return "N/A";
    const subcategory = subcategories.find((s) => s.id === subcategoryId);
    return subcategory?.name || "Unknown";
  };

  const openEditModal = (vyapari: Vyapari) => {
    setCurrentVyapari(vyapari);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (vyapari: Vyapari) => {
    setCurrentVyapari(vyapari);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!currentVyapari) return;

    try {
      await axios.delete(`/vyapari/vyapari/${currentVyapari.id}/`);
      toast.success("Business deleted successfully");
      setIsDeleteDialogOpen(false);
      setCurrentVyapari(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete business");
    }
  };

  const handleToggleVerification = async (vyapari: Vyapari) => {
    try {
      await axios.patch(`/vyapari/vyapari/${vyapari.id}/`, {
        is_verified: !vyapari.is_verified,
      });
      toast.success(
        `Business ${
          vyapari.is_verified ? "unverified" : "verified"
        } successfully`
      );
      fetchData();
    } catch (error: any) {
      toast.error("Failed to update verification status");
    }
  };

  const handleToggleBlock = async (vyapari: Vyapari) => {
    try {
      await axios.patch(`/vyapari/vyapari/${vyapari.id}/`, {
        is_blocked: !vyapari.is_blocked,
      });
      toast.success(
        `Business ${vyapari.is_blocked ? "unblocked" : "blocked"} successfully`
      );
      fetchData();
    } catch (error: any) {
      toast.error("Failed to update block status");
    }
  };

  const filteredVyaparis = vyaparis.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phone.includes(searchTerm) ||
      (v.email && v.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Businesses (Vyapari)</CardTitle>
            <CardDescription>Manage registered businesses</CardDescription>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Business
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredVyaparis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No businesses found
                  </TableCell>
                </TableRow>
              ) : (
                filteredVyaparis.map((vyapari) => (
                  <TableRow key={vyapari.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={vyapari.logo || undefined}
                            alt={vyapari.name}
                          />
                          <AvatarFallback>
                            {vyapari.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{vyapari.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {vyapari.short_description || "No description"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline">
                          {getCategoryName(vyapari.category)}
                        </Badge>
                        {vyapari.subcategory && (
                          <Badge variant="secondary" className="ml-1">
                            {getSubCategoryName(vyapari.subcategory)}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{vyapari.phone}</span>
                        </div>
                        {vyapari.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="line-clamp-1">
                              {vyapari.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {vyapari.is_verified && (
                          <Badge variant="default" className="w-fit flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                        {vyapari.is_blocked && (
                          <Badge variant="destructive" className="w-fit flex items-center gap-1">
                            <Ban className="h-3 w-3" />
                            Blocked
                          </Badge>
                        )}
                        {!vyapari.is_verified && !vyapari.is_blocked && (
                          <Badge variant="secondary" className="w-fit flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleVerification(vyapari)}
                          title={vyapari.is_verified ? "Mark as Unverified" : "Mark as Verified"}
                        >
                          {vyapari.is_verified ? (
                            <XCircle className="h-4 w-4 text-orange-500" />
                          ) : (
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleBlock(vyapari)}
                          title={vyapari.is_blocked ? "Unblock Business" : "Block Business"}
                        >
                          {vyapari.is_blocked ? (
                            <UnlockKeyhole className="h-4 w-4 text-green-600" />
                          ) : (
                            <Ban className="h-4 w-4 text-red-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditModal(vyapari)}
                          title="Edit Business"
                        >
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openDeleteDialog(vyapari)}
                          title="Delete Business"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      
      <VyapariFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchData}
        mode="create"
      />

      
      <VyapariFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentVyapari(null);
        }}
        onSuccess={fetchData}
        vyapari={currentVyapari}
        mode="edit"
      />

      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Business</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentVyapari?.name}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setCurrentVyapari(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
