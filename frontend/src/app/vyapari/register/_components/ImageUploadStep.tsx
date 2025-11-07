import { Upload, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface ImageUploadStepProps {
  logoFile: File | null;
  coverImageFile: File | null;
  logoPreview: string;
  coverImagePreview: string;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "cover_image"
  ) => void;
  removeImage: (type: "logo" | "cover_image") => void;
}

export function ImageUploadStep({
  logoFile,
  coverImageFile,
  logoPreview,
  coverImagePreview,
  handleFileChange,
  removeImage,
}: ImageUploadStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Business Images
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="logo">Business Logo</Label>
          <div className="border-2 border-dashed rounded-lg p-4 hover:border-orange-500 transition-colors">
            {!logoPreview ? (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <div className="flex flex-col items-center gap-2">
                  <Label
                    htmlFor="logo"
                    className="cursor-pointer text-sm text-orange-600 hover:text-orange-700"
                  >
                    Click to upload logo
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 5MB (Square format recommended)
                  </p>
                </div>
                <Input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "logo")}
                />
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={logoPreview}
                  height={100}
                  width={100}
                  alt="Logo preview"
                  className="mx-auto h-32 w-32 rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-0 right-0 h-8 w-8 p-0"
                  onClick={() => removeImage("logo")}
                >
                  ×
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  {logoFile?.name}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cover_image">Cover Image</Label>
          <div className="border-2 border-dashed rounded-lg p-4 hover:border-orange-500 transition-colors">
            {!coverImagePreview ? (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <div className="flex flex-col items-center gap-2">
                  <Label
                    htmlFor="cover_image"
                    className="cursor-pointer text-sm text-orange-600 hover:text-orange-700"
                  >
                    Click to upload cover image
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 5MB (16:9 format recommended)
                  </p>
                </div>
                <Input
                  id="cover_image"
                  name="cover_image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "cover_image")}
                />
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={coverImagePreview}
                  height={100}
                  width={100}
                  alt="Cover preview"
                  className="mx-auto h-48 w-full max-w-2xl rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-0 right-0 h-8 w-8 p-0"
                  onClick={() => removeImage("cover_image")}
                >
                  ×
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  {coverImageFile?.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Your business will be reviewed by our team before appearing in the
          directory. You will be notified once it&apos;s approved.
        </AlertDescription>
      </Alert>
    </div>
  );
}
