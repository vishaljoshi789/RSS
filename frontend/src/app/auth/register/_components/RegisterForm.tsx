"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { registerFormSchema, type RegisterFormData } from './registerSchema';
import { User, Mail, Phone, Calendar as CalendarIcon, Lock, Key, CheckCircle, AlertCircle, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { hi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const RegisterForm = () => {
  const [showReferralCode, setShowReferralCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const containsHindi = (text: string) => {
    return /[\u0900-\u097F]/.test(text);
  };

  const handleEnglishOnlyInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = e.key;
    if (containsHindi(char) || /[\u0900-\u097F]/.test(char)) {
      e.preventDefault();
      return false;
    }
  };

  const handleEnglishOnlyPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (containsHindi(pastedText)) {
      e.preventDefault();
      setSubmitStatus('error');
      setSubmitMessage('कृपया केवल अंग्रेजी में टाइप करें (हिंदी में नहीं)');
      setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 3000);
      return false;
    }
  };

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      dateOfBirth: undefined,
      password: '',
      confirmPassword: '',
      referralCode: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setSubmitStatus('idle');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Registration data:', data);
      
      setSubmitStatus('success');
      setSubmitMessage('पंजीकरण सफल हुआ! कृपया अपने ईमेल की जांच करें।');
      form.reset();
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitStatus('error');
      setSubmitMessage('पंजीकरण में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm w-full max-w-2xl mx-auto my-4">
      <CardHeader className="space-y-1 text-center py-4">
        <div className="flex justify-center mb-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <UserPlus className="w-5 h-5 text-primary" />
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-gray-900">नया खाता बनाएं</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          RSS समुदाय में शामिल होने के लिए पंजीकरण करें
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-6 pb-4">
        {submitStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50 py-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              {submitMessage}
            </AlertDescription>
          </Alert>
        )}
        
        {submitStatus === 'error' && (
          <Alert className="border-red-200 bg-red-50 py-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-sm">
              {submitMessage}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                      <User className="w-3.5 h-3.5" />
                      पूरा नाम
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="अपना पूरा नाम दर्ज करें" 
                        className="h-8 text-sm"
                        onKeyPress={handleEnglishOnlyInput}
                        onPaste={handleEnglishOnlyPaste}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                      <Mail className="w-3.5 h-3.5" />
                      ईमेल पता
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="example@domain.com" 
                        className="h-8 text-sm"
                        onKeyPress={handleEnglishOnlyInput}
                        onPaste={handleEnglishOnlyPaste}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                      <Phone className="w-3.5 h-3.5" />
                      मोबाइल नंबर
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="9876543210" 
                        className="h-8 text-sm"
                        type='tel'
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      जन्म तिथि
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "h-8 text-sm justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: hi })
                            ) : (
                              <span>तारीख चुनें</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      पासवर्ड
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="कम से कम 8 अक्षर" 
                        className="h-8 text-sm"
                        onKeyPress={handleEnglishOnlyInput}
                        onPaste={handleEnglishOnlyPaste}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      पासवर्ड की पुष्टि करें
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="पासवर्ड दोबारा दर्ज करें" 
                        className="h-8 text-sm"
                        onKeyPress={handleEnglishOnlyInput}
                        onPaste={handleEnglishOnlyPaste}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            
            <div className="space-y-2">
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-primary text-sm font-medium"
                onClick={() => setShowReferralCode(!showReferralCode)}
              >
                {showReferralCode ? 'रेफरल कोड छुपाएं' : 'क्या आपके पास रेफरल कोड है?'}
              </Button>

              {showReferralCode && (
                <FormField
                  control={form.control}
                  name="referralCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                        <Key className="w-3.5 h-3.5" />
                        रेफरल कोड (वैकल्पिक)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="रेफरल कोड दर्ज करें" 
                          className="h-8 text-sm max-w-xs"
                          onKeyPress={handleEnglishOnlyInput}
                          onPaste={handleEnglishOnlyPaste}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              )}
            </div>

            
            <Button 
              type="submit" 
              className="w-full h-9 text-sm font-medium" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  पंजीकरण हो रहा है...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  पंजीकरण करें
                </div>
              )}
            </Button>
          </form>
        </Form>

        
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            पहले से खाता है?{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              लॉगिन करें
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;