import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountrySelect, StateSelect, DistrictSelect } from "@/module/country/components/country-select";
import { useState } from "react";

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

export const AddressStep = ({ formData, errors, onChange, readOnlyFields }: AddressStepProps) => {
  const [country] = useState("India");
  const [selectedStateId, setSelectedStateId] = useState<number | undefined>(undefined);

  return (
    <div className="space-y-6">
      {/* Country (fixed to India) */}
      <CountrySelect
        label="Country"
        value={country}
        onValueChange={() => {}} // Read-only
        required
        disabled
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {/* State */}
        <div className="space-y-2">
          {readOnlyFields?.state ? (
            <>
              <Label>State</Label>
              <div className="px-3 py-1 h-9 rounded-md border bg-transparent">{formData.state}</div>
            </>
          ) : (
            <StateSelect
              label="State"
              value={formData.state}
              onValueChange={(value) => {
                onChange("state", value);
                // Reset district when state changes
                onChange("district", "");
              }}
              onStateChange={(stateName, stateId) => {
                setSelectedStateId(stateId);
              }}
              countrySelected={!!country}
              required
              error={errors.state}
            />
          )}
        </div>

        {/* District */}
        <div className="space-y-2">
          {readOnlyFields?.district ? (
            <>
              <Label htmlFor="district">District</Label>
              <div className="px-3 py-1 h-9 rounded-md border bg-transparent">{formData.district}</div>
            </>
          ) : (
            <DistrictSelect
              label="District"
              value={formData.district}
              onValueChange={(value) => onChange("district", value)}
              stateSelected={!!formData.state}
              selectedStateId={selectedStateId}
              selectedStateName={formData.state}
              required
              error={errors.district}
            />
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
