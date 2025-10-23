import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Advertisement, Vyapari, AdFormData, AD_TYPES } from "./types";

interface AdsFormDialogProps {
  open: boolean;
  editingAd: Advertisement | null;
  vyaparis: Vyapari[];
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export const AdsFormDialog: React.FC<AdsFormDialogProps> = ({
  open,
  editingAd,
  vyaparis,
  onClose,
  onSubmit,
}) => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<AdFormData>({
    vyapari: "",
    ad_type: "",
    title: "",
    description: "",
    image: null,
    start_date: "",
    end_date: "",
    is_active: true,
  });

  useEffect(() => {
    if (editingAd) {
      setFormData({
        vyapari: editingAd.vyapari.toString(),
        ad_type: editingAd.ad_type,
        title: editingAd.title,
        description: editingAd.description,
        image: null,
        start_date: editingAd.start_date,
        end_date: editingAd.end_date,
        is_active: editingAd.is_active,
      });
      setImagePreview(editingAd.image);
    } else {
      setFormData({
        vyapari: "",
        ad_type: "",
        title: "",
        description: "",
        image: null,
        start_date: "",
        end_date: "",
        is_active: true,
      });
      setImagePreview("");
    }
  }, [editingAd, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("vyapari", formData.vyapari);
    submitData.append("ad_type", formData.ad_type);
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("start_date", formData.start_date);
    submitData.append("end_date", formData.end_date);
    submitData.append("is_active", formData.is_active.toString());

    if (formData.image) {
      submitData.append("image", formData.image);
    }

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingAd ? "Edit Advertisement" : "Add New Advertisement"}
          </DialogTitle>
          <DialogDescription>
            {editingAd
              ? "Update the advertisement details below"
              : "Fill in the details to create a new advertisement"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vyapari" className="mb-2 block">Business <span className="text-red-500">*</span></Label>
              <Select
                value={formData.vyapari}
                onValueChange={(value) =>
                  setFormData({ ...formData, vyapari: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business" />
                </SelectTrigger>
                <SelectContent>
                  {vyaparis.map((vyapari) => (
                    <SelectItem key={vyapari.id} value={vyapari.id.toString()}>
                      {vyapari.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ad_type" className="mb-2 block">Advertisement Type <span className="text-red-500">*</span></Label>
              <Select
                value={formData.ad_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, ad_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {AD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="mb-2 block">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter advertisement title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="mb-2 block">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter advertisement description"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_date" className="mb-2 block">Start Date <span className="text-red-500">*</span></Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="mb-2 block">End Date <span className="text-red-500">*</span></Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="mb-2 block">Banner Image (16:9 recommended) <span className="text-red-500">*</span></Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!editingAd}
            />
            {imagePreview && (
              <div className="relative mt-2 h-48 w-full overflow-hidden rounded-lg border">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              Active
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingAd ? "Update Advertisement" : "Create Advertisement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
