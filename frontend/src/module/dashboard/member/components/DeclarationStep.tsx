import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Scale, AlertTriangle } from "lucide-react";

type DeclarationStepProps = {
  formData: {
    declaration_name: string;
    declaration_date: string;
    declaration_accepted: boolean;
    name: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string | boolean) => void;
};

export const DeclarationStep: React.FC<DeclarationStepProps> = ({
  formData,
  errors,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Scale className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            विधिक सहमति व उत्तरदायित्व
          </h2>
          <p className="text-sm text-muted-foreground">
            Legal Declaration & Liability
          </p>
        </div>
      </div>

      <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-sm text-orange-900 dark:text-orange-200">
          कृपया निम्नलिखित घोषणा को ध्यानपूर्वक पढ़ें और स्वीकार करें।
        </AlertDescription>
      </Alert>

      <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            IV
          </span>
          विधिक सहमति व उत्तरदायित्व (Legal Declaration & Liability)
        </h3>

        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p className="pl-8">
            <span className="font-medium text-foreground">1.</span> मैं, नीचे
            हस्ताक्षरकर्ता/आवेदक, विधिपूर्वक यह घोषणा करता/करती हूँ कि मेरे द्वारा
            प्रस्तुत समस्त जानकारी पूर्णतः सत्य, सुस्पष्ट एवं प्रमाण प्रस्तुत
            करने योग्य है।
          </p>

          <p className="pl-8">
            <span className="font-medium text-foreground">2.</span> मैं यह
            विधिक सहमति प्रदान करता/करती हूँ कि यदि मेरी जानकारी असत्य, अपूर्ण या
            भ्रामक पाई जाती है, तो संगठन द्वारा मेरी सदस्यता को तत्काल निरस्त
            किया जा सकता है, और मेरे विरुद्ध विधिक कार्यवाही की जा सकती है।
          </p>

          <p className="pl-8">
            <span className="font-medium text-foreground">3.</span> मैं यह भी
            स्वीकार करता/करती हूँ कि सदस्य बनते ही मैं &quot;राष्ट्रीय सेवा संघ
            भारतवर्ष&quot; के समस्त नियमों, नीति दस्तावेजों, आचार संहिता एवं
            दिशा-निर्देशों का पालन करूंगा/करूंगी, और किसी भी उल्लंघन की स्थिति में
            संघ द्वारा लिए गए निर्णय को अंतिम मानूंगा/मानूंगी।
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="declaration_name" className="text-sm font-medium">
            आवेदक का नाम (Applicant&apos;s Name){" "}
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="declaration_name"
            type="text"
            placeholder="अपना पूरा नाम दर्ज करें"
            value={formData.declaration_name}
            onChange={(e) => onChange("declaration_name", e.target.value)}
            className={errors.declaration_name ? "border-destructive" : ""}
          />
          {errors.declaration_name && (
            <p className="text-xs text-destructive">
              {errors.declaration_name}
            </p>
          )}
          {formData.name && !formData.declaration_name && (
            <p className="text-xs text-muted-foreground">
              Suggestion: {formData.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="declaration_date" className="text-sm font-medium">
            दिनांक (Date) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="declaration_date"
            type="date"
            value={formData.declaration_date}
            readOnly
            className="bg-muted cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">
            आज की तिथि स्वतः भर दी गई है (Today&apos;s date is auto-filled)
          </p>
        </div>

        <div className="rounded-lg border bg-background p-4 space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="declaration_accepted"
              checked={formData.declaration_accepted}
              onCheckedChange={(checked) =>
                onChange("declaration_accepted", checked as boolean)
              }
              className={
                errors.declaration_accepted
                  ? "border-destructive data-[state=checked]:bg-destructive"
                  : ""
              }
            />
            <div className="space-y-1 flex-1">
              <Label
                htmlFor="declaration_accepted"
                className="text-sm font-medium leading-relaxed cursor-pointer"
              >
                मैं सभी शर्तों, नियमों, गोपनीयता नीति एवं विधिक सहमति को पढ़
                चुका/चुकी हूँ और स्वीकार करता/करती हूँ
              </Label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                I have read and accept all terms, conditions, privacy policy,
                and legal declaration
              </p>
            </div>
          </div>
          {errors.declaration_accepted && (
            <p className="text-xs text-destructive pl-8">
              {errors.declaration_accepted}
            </p>
          )}
        </div>
      </div>

      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <AlertDescription className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
          🚩 <span className="font-semibold">राष्ट्रीय सेवा संघ भारतवर्ष</span>{" "}
          — भारत की सनातन चेतना को सेवा, संस्कृति और संगठन के माध्यम से जाग्रत
          करने का एक राष्ट्रधर्म आधारित प्रयास।
        </AlertDescription>
      </Alert>
    </div>
  );
};
