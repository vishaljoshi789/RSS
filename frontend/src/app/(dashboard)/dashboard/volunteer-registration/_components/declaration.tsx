"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { AddressFormData } from "@/module/dashboard/volunteer";

interface DeclarationFormData {
  full_name: string;
  age: string;
  agreed_to_declaration: boolean;
}

interface DeclarationFormProps {
  addressData: AddressFormData;
  onNext: () => void;
  onBack?: () => void;
}

const DeclarationForm = ({
  addressData,
  onNext,
  onBack,
}: DeclarationFormProps) => {
  const [formData, setFormData] = useState<DeclarationFormData>({
    full_name: "",
    age: "",
    agreed_to_declaration: false,
  });

  useEffect(() => {
    if (addressData.hindi_name && !formData.full_name) {
      setFormData((prev) => ({
        ...prev,
        full_name: addressData.hindi_name || "",
      }));
    }
  }, [addressData.hindi_name, formData.full_name]);

  const handleInputChange = (
    field: keyof DeclarationFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      toast.error(
        "कृपया अपना पूरा नाम दर्ज करें (Please enter your full name)"
      );
      return;
    }

    if (
      !formData.age.trim() ||
      isNaN(Number(formData.age)) ||
      Number(formData.age) < 18
    ) {
      toast.error(
        "कृपया वैध आयु दर्ज करें (18+ वर्ष) (Please enter valid age - 18+ years)"
      );
      return;
    }

    if (!formData.agreed_to_declaration) {
      toast.error("कृपया घोषणा से सहमति दें (Please agree to the declaration)");
      return;
    }

    toast.success("Declaration accepted successfully!");
    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-4xl mx-auto p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          घोषणा / DECLARATION
        </h2>
        <p className="text-sm text-muted-foreground">
          कृपया निम्नलिखित घोषणा को ध्यान से पढ़ें और सहमति दें
        </p>
      </div>

      <div className="bg-muted/30 p-6 rounded-lg border">
        <div className="space-y-4 text-sm leading-relaxed">
          <p className="font-semibold text-center">घोषणा / DECLARATION</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="full_name" className="mb-2">
                मैं / I, <span className="text-red-500">*</span>
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="पूरा नाम (हिंदी में)"
                className="font-hindi"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">(Full Name)</p>
            </div>

            <div>
              <Label htmlFor="age" className="mb-2">
                आयु / Age <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="18"
                  className="w-20"
                  required
                />
                <span className="text-sm">वर्ष / years</span>
              </div>
            </div>
          </div>

          <p>एतद्द्वारा गंभीरतापूर्वक घोषणा करता/करती हूँ कि —</p>
          <p className="text-xs text-muted-foreground mb-2">
            hereby solemnly declare that —
          </p>

          <ul className="space-y-3 ml-4">
            <li>• मैं एक भारतीय नागरिक हूँ और मेरी आयु ___ वर्ष है।</li>
            <li className="text-xs text-muted-foreground">
              I am an Indian citizen and my age is ___ years.
            </li>

            <li>
              • मैं किसी भी आपराधिक, अनैतिक या असामाजिक गतिविधियों में संलिप्त
              नहीं हूँ, और किसी भी न्यायालय में मेरे विरुद्ध कोई आपराधिक मामला
              लंबित नहीं है।
            </li>
            <li className="text-xs text-muted-foreground">
              I am not involved in any criminal, immoral, or anti-social
              activities, and no criminal case is pending against me in any
              court of law.
            </li>

            <li>
              • मैं किसी भी राष्ट्र-विरोधी, समाज-विरोधी या असंवैधानिक गतिविधियों
              में संलग्न संगठन, समूह या पार्टी का सदस्य नहीं हूँ।
            </li>
            <li className="text-xs text-muted-foreground">
              I am not a member of any organization, group, or party engaged in
              anti-national, anti-social, or unconstitutional activities.
            </li>

            <li>
              • मैं राष्ट्रीय सेवा संघ की विचारधारा, आचार संहिता और नीतियों का
              पूर्ण सम्मान करता/करती हूँ और इनका पालन करने के लिए सहमत हूँ।
            </li>
            <li className="text-xs text-muted-foreground">
              I fully respect and agree to abide by the ideology, code of
              conduct, and policies of the Rashtriya Seva Sangh.
            </li>

            <li>
              • मैं समझता/समझती हूँ कि यदि भविष्य में मैं अनुशासनहीनता, बेईमानी
              या किसी भी संगठन-विरोधी गतिविधि का दोषी पाया जाऊं, तो संगठन को
              मेरी सदस्यता रद्द करने या किसी भी पद से तुरंत हटाने का अधिकार है।
            </li>
            <li className="text-xs text-muted-foreground">
              I understand that if I am found guilty of indiscipline,
              dishonesty, or any anti-organizational activity in the future, the
              organization has the right to cancel my membership or remove me
              from any post immediately.
            </li>

            <li>
              • मैं एतद्द्वारा घोषणा करता/करती हूँ कि इस आवेदन में प्रदान की गई
              सभी जानकारी मेरी जानकारी और विश्वास के अनुसार सत्य और सही है।
            </li>
            <li className="text-xs text-muted-foreground">
              I hereby declare that all the information provided in this
              application is true and correct to the best of my knowledge and
              belief.
            </li>

            <li>
              • मैं किसी भी आंतरिक सत्यापन या पृष्ठभूमि जांच में पूर्ण सहयोग
              करूंगा/करूंगी और इसके लिए आवश्यक दस्तावेज प्रदान करूंगा/करूंगी।
            </li>
            <li className="text-xs text-muted-foreground">
              I will fully cooperate with any internal verification or
              background check and will provide necessary documents for the
              same.
            </li>

            <li>
              • मैं समझता/समझती हूँ कि इस संगठन के तहत दी जाने वाली सेवाएं
              पूर्णतः स्वैच्छिक हैं और किसी मौद्रिक लाभ या रोजगार लाभ के लिए
              नहीं हैं।
            </li>
            <li className="text-xs text-muted-foreground">
              I understand that the services rendered under this organization
              are purely voluntary and not meant for any monetary gain or
              employment benefits.
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-start space-x-3 p-4 bg-primary/5 rounded-lg border">
        <Checkbox
          id="declaration-agreement"
          checked={formData.agreed_to_declaration}
          onCheckedChange={(checked) =>
            handleInputChange("agreed_to_declaration", checked as boolean)
          }
          className="mt-1"
        />
        <Label
          htmlFor="declaration-agreement"
          className="text-sm cursor-pointer leading-relaxed"
        >
          <span className="font-medium">
            मैं उपरोक्त सभी घोषणाओं से सहमत हूँ / I agree to all the above
            declarations
          </span>
          <br />
          <span className="text-xs text-muted-foreground">
            मैं पुष्टि करता/करती हूँ कि मैंने सभी नियम और शर्तें पढ़ी हैं और
            इन्हें स्वीकार करता/करती हूँ।
          </span>
        </Label>
      </div>

      <div className="flex justify-between pt-6">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button
          type="submit"
          disabled={!formData.agreed_to_declaration}
          className="ml-auto"
        >
          Accept Declaration & Continue
        </Button>
      </div>
    </form>
  );
};

export default DeclarationForm;
