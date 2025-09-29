"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Heart, Shield, Users, Globe, CreditCard, Phone, MapPin, User, IndianRupee, CheckCircle, AlertCircle } from 'lucide-react';

// Form validation schema
const donationFormSchema = z.object({
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

type DonationFormData = z.infer<typeof donationFormSchema>;

const donationAmounts = [
  { value: "100", label: "₹100", description: "बेसिक सहयोग" },
  { value: "200", label: "₹200", description: "मासिक सहयोग" },
  { value: "500", label: "₹500", description: "विशेष सहयोग" },
  { value: "1000", label: "₹1000", description: "प्रमुख सहयोग" },
  { value: "5000", label: "₹5000", description: "उत्कृष्ट सहयोग" },
  { value: "other", label: "अन्य राशि", description: "अपनी इच्छानुसार" },
];

const impactItems = [
  {
    icon: <Heart className="w-8 h-8 text-red-500" />,
    title: "सामाजिक कल्याण",
    description: "रक्तदान शिविर, स्वास्थ्य सेवा और आपातकालीन सहायता में योगदान"
  },
  {
    icon: <Users className="w-8 h-8 text-blue-500" />,
    title: "शिक्षा और प्रशिक्षण",
    description: "युवा प्रशिक्षण कार्यक्रम और चरित्र निर्माण गतिविधियों में सहयोग"
  },
  {
    icon: <Globe className="w-8 h-8 text-green-500" />,
    title: "सांस्कृतिक संरक्षण",
    description: "भारतीय संस्कृति और परंपरा के संरक्षण में योगदान"
  },
  {
    icon: <Shield className="w-8 h-8 text-purple-500" />,
    title: "राष्ट्र सेवा",
    description: "राष्ट्रीय एकता और धार्मिक मूल्यों के संवर्धन में सहयोग"
  },
];

const DonateNowPage = () => {
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      name: "",
      location: "",
      mobile: "",
      donationAmount: undefined,
      customAmount: "",
    },
  });

  const onSubmit = async (data: DonationFormData) => {
    setIsLoading(true);
    setSubmitStatus('idle');
    
    try {
      // Prepare donation data
      const donationData = {
        name: data.name,
        location: data.location,
        mobile: data.mobile,
        amount: data.donationAmount === 'other' ? data.customAmount : data.donationAmount,
        timestamp: new Date().toISOString(),
      };

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Donation Data:', donationData);
      
      // Set success state
      setSubmitStatus('success');
      setSubmitMessage(`धन्यवाद ${data.name}! आपका ₹${donationData.amount} का दान सफलतापूर्वक रजिस्टर हो गया है। हम जल्द ही आपसे संपर्क करेंगे।`);
      
      // Reset form after a delay
      setTimeout(() => {
        form.reset();
        setIsCustomAmount(false);
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 5000);
      
    } catch (error) {
      console.error('Donation error:', error);
      setSubmitStatus('error');
      setSubmitMessage('दुखद बात है कि कुछ त्रुटि हुई है। कृपया दोबारा कोशिश करें।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-4">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 px-4 py-2">
                <Heart className="w-4 h-4 mr-2" />
                दान करें - सेवा करें
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              राष्ट्र सेवा में योगदान करें
            </h1>
            <p className="text-lg lg:text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed mb-8">
              आपका हर योगदान समाज सेवा, शिक्षा और राष्ट्रीय एकता के कार्यों में उपयोग होता है
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-foreground/80" />
                <span>100% सुरक्षित भुगतान</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-foreground/80" />
                <span>त्वरित और आसान</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary-foreground/80" />
                <span>पारदर्शी उपयोग</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-12 lg:py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              आपका दान कैसे उपयोग होता है
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              हमारे संगठन द्वारा किए जाने वाले विभिन्न सेवा कार्यों में आपका योगदान प्रभावी रूप से उपयोग होता है
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactItems.map((item, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">{item.icon}</div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                    <IndianRupee className="w-6 h-6 text-primary" />
                    दान विवरण भरें
                  </CardTitle>
                  <CardDescription>
                    कृपया अपनी जानकारी भरें और दान राशि चुनें
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Success/Error Alerts */}
                  {submitStatus === 'success' && (
                    <Alert className="mb-6 border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {submitMessage}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {submitStatus === 'error' && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {submitMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Name Field */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="w-4 h-4 text-primary" />
                              पूरा नाम
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="अपना पूरा नाम भरें" 
                                {...field}
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Location Field */}
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              स्थान
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="अपना शहर / पता भरें" 
                                {...field}
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Mobile Number Field */}
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-primary" />
                              मोबाइल नंबर
                            </FormLabel>
                            <FormControl>
                              <div className="flex">
                                <div className="bg-primary text-primary-foreground px-3 py-3 rounded-l-md border border-r-0 border-primary flex items-center font-semibold">
                                  +91
                                </div>
                                <Input 
                                  placeholder="10 अंकों का मोबाइल नंबर" 
                                  {...field}
                                  className="h-12 rounded-l-none"
                                  maxLength={10}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    field.onChange(value);
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Donation Amount Selection */}
                      <FormField
                        control={form.control}
                        name="donationAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">दान राशि चुनें</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setIsCustomAmount(value === "other");
                                }}
                                value={field.value}
                                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                              >
                                {donationAmounts.map((amount) => (
                                  <div key={amount.value}>
                                    <RadioGroupItem
                                      value={amount.value}
                                      id={amount.value}
                                      className="sr-only"
                                    />
                                    <Label
                                      htmlFor={amount.value}
                                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-accent ${
                                        field.value === amount.value
                                          ? 'border-primary bg-primary/5 text-primary'
                                          : 'border-border hover:border-primary/50'
                                      }`}
                                    >
                                      <span className="font-bold text-lg">{amount.label}</span>
                                      <span className="text-xs text-muted-foreground mt-1">
                                        {amount.description}
                                      </span>
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Custom Amount Field */}
                      {isCustomAmount && (
                        <FormField
                          control={form.control}
                          name="customAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>कस्टम राशि (₹)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="अपनी इच्छित राशि भरें"
                                  {...field}
                                  className="h-12"
                                  min="1"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {/* Submit Button */}
                      <Button 
                        type="submit" 
                        className="w-full h-12 text-lg font-semibold"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            प्रक्रिया जारी है...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5" />
                            दान करें
                          </div>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Security Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    सुरक्षित भुगतान
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>256-बिट SSL एन्क्रिप्शन</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>PCI DSS अनुपालित</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>तुरंत भुगतान पुष्टि</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">संपर्क जानकारी</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>सहायता: +91 XXXXX XXXXX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>राष्ट्रीय सेवा संघ भारतवर्ष</span>
                  </div>
                </CardContent>
              </Card>

              {/* Tax Benefit */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">कर लाभ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">
                    आपका दान आयकर अधिनियम की धारा 80G के तहत कर लाभ के लिए पात्र हो सकता है।
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonateNowPage;
