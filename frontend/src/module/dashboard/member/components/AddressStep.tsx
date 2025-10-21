import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AddressStepProps = {
  formData: {
    city: string;
    sub_district: string;
    district: string;
    state: string;
    postal_code: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
  stateOptions: string[];
};
export const AddressStep = ({ formData, errors, onChange, stateOptions }: AddressStepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">Village / City name</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="Enter village or city"
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="sub_district">Tehsil</Label>
          <Input
            id="sub_district"
            value={formData.sub_district}
            onChange={(e) => onChange("sub_district", e.target.value)}
            placeholder="Enter tehsil"
          />
          {errors.sub_district && (
            <p className="text-sm text-destructive">{errors.sub_district}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) => onChange("district", e.target.value)}
            placeholder="Enter district"
          />
          {errors.district && (
            <p className="text-sm text-destructive">{errors.district}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>State</Label>
          <Select
            value={formData.state || undefined}
            onValueChange={(value) => onChange("state", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {stateOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && (
            <p className="text-sm text-destructive">{errors.state}</p>
          )}
        </div>
      </div>

      <div className="space-y-2 sm:max-w-xs">
        <Label htmlFor="postal_code">PIN code</Label>
        <Input
          id="postal_code"
          inputMode="numeric"
          value={formData.postal_code}
          onChange={(e) => onChange("postal_code", e.target.value)}
          placeholder="Enter PIN code"
        />
        {errors.postal_code && (
          <p className="text-sm text-destructive">{errors.postal_code}</p>
        )}
      </div>
    </div>
  );
};
