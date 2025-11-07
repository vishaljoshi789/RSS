import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import rawStateDistrictData from "@/lib/state-district.json";
import { useMemo, useState } from "react";

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
  stateOptions?: string[];
  readOnlyFields?: Partial<Record<string, boolean>>;
};
export const AddressStep = ({ formData, errors, onChange, stateOptions, readOnlyFields }: AddressStepProps) => {
  const [showCustomDistrictInput, setShowCustomDistrictInput] = useState(false);
  
  const stateDistrictData = rawStateDistrictData as { India?: Record<string, { districts?: Record<string, unknown> }> };
  
  const derivedStates: string[] = (stateOptions && stateOptions.length > 0)
    ? stateOptions
    : Object.keys(stateDistrictData?.India || {}).sort((a: string, b: string) => a.localeCompare(b));

  const availableDistricts = useMemo(() => {
    if (!formData.state) return [];
    const stateData = stateDistrictData?.India?.[formData.state];
    if (!stateData?.districts) return [];
    return Object.keys(stateData.districts).sort((a: string, b: string) => a.localeCompare(b));
  }, [formData.state, stateDistrictData]);
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>State</Label>
          {readOnlyFields?.state ? (
            <div className="px-3 py-1 h-9 rounded-md border bg-transparent">{formData.state}</div>
          ) : (
            <Select
              value={formData.state || undefined}
              onValueChange={(value) => onChange("state", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {derivedStates.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {errors.state && (
            <p className="text-sm text-destructive">{errors.state}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          {readOnlyFields?.district ? (
            <div className="px-3 py-1 h-9 rounded-md border bg-transparent">{formStateLabel(formData.district)}</div>
          ) : (
            <>
              {!showCustomDistrictInput ? (
                <Select
                  value={formData.district || undefined}
                  onValueChange={(value) => {
                    if (value === "__ADD_CUSTOM__") {
                      setShowCustomDistrictInput(true);
                      onChange("district", "");
                    } else {
                      onChange("district", value);
                    }
                  }}
                  disabled={!formData.state}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={formData.state ? "Select a district" : "Select state first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDistricts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                    {formData.state && availableDistricts.length > 0 && (
                      <SelectItem value="__ADD_CUSTOM__" className="text-primary font-medium">
                        <div className="flex items-center">
                          <Plus className="h-4 w-4 mr-2" />
                          Add your district
                        </div>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              ) : (
                <div className="space-y-2">
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => onChange("district", e.target.value)}
                    placeholder="Enter your district"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setShowCustomDistrictInput(false);
                      onChange("district", "");
                    }}
                  >
                    Back to district list
                  </Button>
                </div>
              )}
            </>
          )}
          {errors.district && (
            <p className="text-sm text-destructive">{errors.district}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sub_district">Tehsil</Label>
          {readOnlyFields?.sub_district ? (
            <div className="px-3 py-1 h-9 rounded-md border bg-transparent">{formData.sub_district}</div>
          ) : (
            <Input
              id="sub_district"
              value={formData.sub_district}
              onChange={(e) => onChange("sub_district", e.target.value)}
              placeholder="Enter tehsil"
            />
          )}
          {errors.sub_district && (
            <p className="text-sm text-destructive">{errors.sub_district}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Village / City name</Label>
          {readOnlyFields?.city ? (
            <div className="px-3 py-1 h-9 rounded-md border bg-transparent">{formData.city}</div>
          ) : (
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => onChange("city", e.target.value)}
              placeholder="Enter village or city"
            />
          )}
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city}</p>
          )}
        </div>
      </div>

      <div className="space-y-2 sm:max-w-xs">
        <Label htmlFor="postal_code">PIN code</Label>
        {readOnlyFields?.postal_code ? (
          <div className="px-3 py-1 h-9 rounded-md border bg-transparent">{formData.postal_code}</div>
        ) : (
          <Input
            id="postal_code"
            inputMode="numeric"
            maxLength={6}
            value={formData.postal_code}
            onChange={(e) => onChange("postal_code", e.target.value)}
            placeholder="Enter PIN code"
          />
        )}
        {errors.postal_code && (
          <p className="text-sm text-destructive">{errors.postal_code}</p>
        )}
      </div>
    </div>
  );
};

function formStateLabel(value: string) {
  return value || "";
}
