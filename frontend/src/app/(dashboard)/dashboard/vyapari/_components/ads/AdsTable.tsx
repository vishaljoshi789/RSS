import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Advertisement, Vyapari } from "./types";
import { AdsTableRow } from "./AdsTableRow";

interface AdsTableProps {
  ads: Advertisement[];
  vyaparis: Vyapari[];
  loading: boolean;
  onEdit: (ad: Advertisement) => void;
  onDelete: (id: number) => void;
  onToggleActive: (ad: Advertisement) => void;
}

export const AdsTable: React.FC<AdsTableProps> = ({
  ads,
  vyaparis,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : ads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No advertisements found
              </TableCell>
            </TableRow>
          ) : (
            ads.map((ad) => (
              <AdsTableRow
                key={ad.id}
                ad={ad}
                vyaparis={vyaparis}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleActive={onToggleActive}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
