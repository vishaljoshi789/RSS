import { type ChangeEvent, useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";

type PhotoUploadStepProps = {
  formData: {
    image: File | null;
  };
  errors: Record<string, string>;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const PhotoUploadStep = ({
  formData,
  errors,
  onFileChange,
}: PhotoUploadStepProps) => {
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (formData.image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(formData.image);
    } else {
      setImagePreview("");
    }
  }, [formData.image]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="image">Upload passport size photo</Label>
        <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border bg-background px-4 py-6">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
          <p className="text-xs text-muted-foreground">
            JPG or PNG, maximum 5MB.
          </p>
          {formData.image && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <UploadCloud className="h-4 w-4" />
              <span>{formData.image.name}</span>
            </div>
          )}
        </div>
        {errors.image && (
          <p className="text-sm text-destructive">{errors.image}</p>
        )}
      </div>

      {imagePreview && (
        <div className="space-y-2">
          <Label>Photo Preview</Label>
          <div className="relative h-64 w-48 overflow-hidden rounded-lg border-2 border-muted mx-auto">
            <Image
              src={imagePreview}
              alt="Photo preview"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};
