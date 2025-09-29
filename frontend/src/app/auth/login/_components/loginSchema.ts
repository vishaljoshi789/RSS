import * as z from 'zod';

export const loginFormSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "ईमेल या फोन नंबर आवश्यक है")
    .refine(
      (value) => {
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      "कृपया वैध ईमेल या 10 अंक का फोन नंबर दर्ज करें"
    ),
  password: z
    .string()
    .min(1, "पासवर्ड आवश्यक है")
    .min(8, "पासवर्ड कम से कम 8 अक्षर का होना चाहिए"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;