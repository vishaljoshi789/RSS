"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { loginFormSchema, type LoginFormData } from './loginSchema';
import { LogIn, Mail, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();
    setIsLoading(true);
    setSubmitStatus('idle');
    setSubmitMessage('');
    
    try {
      
      const result = await login(data.emailOrPhone, data.password);
      
      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage('लॉगिन सफल! आपको डैशबोर्ड पर भेजा जा रहा है...');
        toast.success('लॉगिन सफल!');
        
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || 'लॉगिन में त्रुटि हुई। कृपया अपने विवरण जांचें और पुनः प्रयास करें।');
        toast.error(result.message || 'लॉगिन असफल');
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'लॉगिन में त्रुटि हुई। कृपया अपने विवरण जांचें और पुनः प्रयास करें।';
      
      if (error?.message) {
        errorMessage = error.message;
      }
      
      setSubmitStatus('error');
      setSubmitMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm w-full max-w-md mx-auto my-4">
      <CardHeader className="space-y-1 text-center py-4">
        <div className="flex justify-center mb-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <LogIn className="w-5 h-5 text-primary" />
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-gray-900">अपने खाते में लॉगिन करें</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          अपना ईमेल/फोन और पासवर्ड दर्ज करें
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-4">
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
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)(e);
            }} 
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="emailOrPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                    <Mail className="w-3.5 h-3.5" />
                    ईमेल या फोन नंबर
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="example@domain.com या 9876543210" 
                      className="h-8 text-sm"
                      {...field} 
                    />
                  </FormControl>
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
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="अपना पासवर्ड दर्ज करें" 
                        className="h-8 text-sm pr-10"
                        {...field} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-8 w-10 px-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-3.5 w-3.5 text-gray-500" />
                        ) : (
                          <Eye className="h-3.5 w-3.5 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Label className="text-xs font-normal cursor-pointer">
                        मुझे याद रखें
                      </Label>
                    </div>
                  </FormItem>
                )}
              />
              
              <Link 
                href="/auth/forgot-password" 
                className="text-xs text-primary hover:underline"
              >
                पासवर्ड भूल गए?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full h-9 text-sm font-medium" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  लॉगिन हो रहा है...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  लॉगिन करें
                </div>
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            खाता नहीं है?{' '}
            <Link href="/auth/register" className="text-primary hover:underline font-medium">
              नया खाता बनाएं
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;