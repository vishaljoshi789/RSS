"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  User,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { contactData } from "./ContactInfo";


const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);

    
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Form submitted:", data);
    setIsSubmitted(true);
    setIsSubmitting(false);

    
    setTimeout(() => {
      setIsSubmitted(false);
      form.reset();
    }, 3000);
  }

  const getContactIcon = (type: string) => {
    switch (type) {
      case "phone":
        return <Phone className="w-5 h-5" />;
      case "email":
        return <Mail className="w-5 h-5" />;
      case "address":
        return <MapPin className="w-5 h-5" />;
      case "hours":
        return <Clock className="w-5 h-5" />;
      default:
        return <Mail className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4 lg:mb-6">
            <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
            <span className="text-sm lg:text-base text-primary font-semibold">
              संपर्क करें
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3 lg:mb-4">
            Get in <span className="text-primary">Touch</span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions about our programs or want to get involved? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Contact Form */}
          <div className="order-2 lg:order-1">
            <div className="mb-6">
              <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                Send us a Message
              </h3>
              <p className="text-sm lg:text-base text-muted-foreground">
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </p>
            </div>

            <div>
              {isSubmitted ? (
                <div className="text-center py-12 px-6 bg-muted/30 rounded-xl border border-border">
                  <CheckCircle className="w-16 h-16 lg:w-20 lg:h-20 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5 lg:space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-foreground font-semibold text-sm lg:text-base">
                            <User className="w-4 h-4" />
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              className="h-11 lg:h-12 bg-background border-border focus:border-primary focus:ring-primary text-sm lg:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-foreground font-semibold text-sm lg:text-base">
                            <Mail className="w-4 h-4" />
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email address"
                              className="h-11 lg:h-12 bg-background border-border focus:border-primary focus:ring-primary text-sm lg:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-foreground font-semibold text-sm lg:text-base">
                            <MessageSquare className="w-4 h-4" />
                            Subject
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="What's this about?"
                              className="h-11 lg:h-12 bg-background border-border focus:border-primary focus:ring-primary text-sm lg:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-foreground font-semibold text-sm lg:text-base">
                            <MessageSquare className="w-4 h-4" />
                            Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about your inquiry..."
                              className="min-h-[120px] lg:min-h-[140px] bg-background border-border focus:border-primary focus:ring-primary resize-none text-sm lg:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 lg:h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm lg:text-base shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="order-1 lg:order-2">
            <div className="mb-6">
              <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Phone className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                Contact Information
              </h3>
              <p className="text-sm lg:text-base text-muted-foreground">
                Reach out to us through any of the following channels.
              </p>
            </div>

            <div className="space-y-4 lg:space-y-5">
              {contactData.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 lg:p-5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-border"
                >
                  <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    {getContactIcon(contact.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm lg:text-base mb-1">
                      {contact.label}
                    </h4>
                    {contact.link ? (
                      <a
                        href={contact.link}
                        className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm lg:text-base break-all"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="break-all">{contact.value}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    ) : (
                      <p className="text-muted-foreground text-sm lg:text-base break-words">
                        {contact.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
