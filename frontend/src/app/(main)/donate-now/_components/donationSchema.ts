import * as z from 'zod';

// Form validation schema
export const donationFormSchema = z.object({
  name: z.string().min(2, "नाम कम से कम 2 अक्षर का होना चाहिए"),
  location: z.string().min(2, "स्थान भरना आवश्यक है"),
  mobile: z.string().regex(/^[0-9]{10}$/, "मोबाइल नंबर 10 अंक का होना चाहिए"),
  donationAmount: z.enum(["100", "200", "500", "1000", "5000", "other"]).optional().refine((val) => val !== undefined, {
    message: "कृपया दान राशि चुनें",
  }),
  customAmount: z.string().optional(),
}).refine((data) => {
  if (data.donationAmount === "other") {
    return data.customAmount && parseInt(data.customAmount) > 0;
  }
  return true;
}, {
  message: "कस्टम राशि डालना आवश्यक है",
  path: ["customAmount"],
});

export type DonationFormData = z.infer<typeof donationFormSchema>;

export const donationAmounts = [
  { value: "100", label: "₹100", description: "बेसिक सहयोग" },
  { value: "200", label: "₹200", description: "मासिक सहयोग" },
  { value: "500", label: "₹500", description: "विशेष सहयोग" },
  { value: "1000", label: "₹1000", description: "प्रमुख सहयोग" },
  { value: "5000", label: "₹5000", description: "उत्कृष्ट सहयोग" },
  { value: "other", label: "अन्य राशि", description: "अपनी इच्छानुसार" },
];