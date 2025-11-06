import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { Advertisement, Vyapari } from "./types";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

interface AdsTableRowProps {
  ad: Advertisement;
  vyaparis: Vyapari[];
  onEdit: (ad: Advertisement) => void;
  onDelete: (id: number) => void;
  onToggleActive: (ad: Advertisement) => void;
}

export const AdsTableRow: React.FC<AdsTableRowProps> = ({
  ad,
  vyaparis,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const getVyapariName = (vyapariId: number) => {
    const vyapari = vyaparis.find((v) => v.id === vyapariId);
    return vyapari?.name || "Unknown";
  };

  const isAdActive = (ad: Advertisement) => {
    if (!ad.is_active) return false;
    const today = new Date();
    const startDate = new Date(ad.start_date);
    const endDate = new Date(ad.end_date);
    return today >= startDate && today <= endDate;
  };

  return (
    <tr className="border-b">
      <td className="p-4">
        <div className="relative h-16 w-28 overflow-hidden rounded">
          <Image
            src={ad.image}
            alt={ad.title}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
        </div>
      </td>
      <td className="p-4 font-medium">{ad.title}</td>
      <td className="p-4">{getVyapariName(ad.vyapari)}</td>
      <td className="p-4">
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
          {ad.ad_type}
        </span>
      </td>
      <td className="p-4">
        <div className="flex flex-col text-xs">
          <span>{format(new Date(ad.start_date), "MMM dd, yyyy")}</span>
          <span className="text-muted-foreground">to</span>
          <span>{format(new Date(ad.end_date), "MMM dd, yyyy")}</span>
        </div>
      </td>
      <td className="p-4">
        {isAdActive(ad) ? (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Inactive
          </span>
        )}
      </td>
      <td className="p-4 text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onToggleActive(ad)}>
            {ad.is_active ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(ad)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(ad.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
