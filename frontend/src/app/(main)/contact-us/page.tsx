"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Clock, Send, Users, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';


const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // You can add API call or email service here
  };

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-32 overflow-hidden">
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary text-secondary px-4 py-2 rounded-full text-sm font-semibold border border-primary/30">
                <Users className="w-4 h-4" />
                संपर्क करें
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">
                हमसे जुड़िए
              </h1>
              
              <p className="text-lg sm:text-xl text-primary-foreground/90 leading-relaxed max-w-2xl">
                राष्ट्रीय सेवा संघ भारतवर्ष के साथ जुड़कर राष्ट्र सेवा में अपना योगदान दें। 
                हमें आपकी सेवा और सहयोग की प्रतीक्षा है।
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary text-secondary hover:bg-primary/80">
                  <Link href="tel:+919429693593">
                    <Phone className="w-4 h-4 mr-2" />
                    तुरंत कॉल करें
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-primary-foreground hover:bg-primary hover:text-secondary">
                  <Link href="mailto:help@joinrss.org.in">
                    <Mail className="w-4 h-4 mr-2" />
                    ईमेल भेजें
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="overflow-hidden">
                <Image
                  src="https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-06-at-1.21.25-PM-e1756385010760.webp"
                  alt="Temple Service - Devotees at Temple"
                  width={800}
                  height={600}
                  className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              संपर्क विवरण
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              हमारे कार्यालयों से संपर्क करें या हमारे सामाजिक माध्यमों पर जुड़ें
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Phone Contact */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-bold">फोन नंबर</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4">सीधे हमसे बात करें</p>
                <Link href="tel:+919429693593" className="text-primary font-semibold hover:underline">
                  +91 94296 93593
                </Link>
              </CardContent>
            </Card>

            {/* Email Contact */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-bold">ईमेल पता</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4">हमें ईमेल भेजें</p>
                <Link href="mailto:help@joinrss.org.in" className="text-primary font-semibold hover:underline">
                  help@joinrss.org.in
                </Link>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="p-6 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-bold">कार्यालय समय</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-2">सोमवार - शुक्रवार</p>
                <p className="text-primary font-semibold">9:00 AM - 6:00 PM</p>
              </CardContent>
            </Card>
          </div>

          {/* Office Addresses */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Delhi Office */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-secondary/10 text-secondary-foreground rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-bold">दिल्ली कार्यालय</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  D BLOCK, POCKET-5 (Flat No. 34)<br />
                  DDA Flat, CRPF Flat, Bawana<br />
                  New Delhi – 110040
                </p>
                <Button asChild variant="outline" size="sm">
                  <a 
                    href="https://maps.google.com/?q=D+BLOCK+POCKET-5+Flat+No+34+DDA+Flat+CRPF+Flat+Bawana+New+Delhi+110040"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    मैप में देखें
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Uttarakhand Office */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-accent/10 text-accent-foreground rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-bold">उत्तराखंड कार्यालय</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Bareilly–Nainital Road<br />
                  Near Motahaldu Bus Stop<br />
                  Haldwani, Nainital – 263139
                </p>
                <Button asChild variant="outline" size="sm">
                  <a 
                    href="https://maps.google.com/?q=Bareilly+Nainital+Road+Near+Motahaldu+Bus+Stop+Haldwani+Nainital+263139"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    मैप में देखें
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              संदेश भेजें
            </h2>
            <p className="text-lg text-muted-foreground">
              हमें अपना संदेश भेजें और हम जल्द ही आपसे संपर्क करेंगे
            </p>
          </div>

          <Card className="shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">नाम *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="आपका पूरा नाम"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">फोन नंबर</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">ईमेल पता *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">विषय *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="आपके संदेश का विषय"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">संदेश *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="अपना संदेश यहाँ लिखें..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full sm:w-auto  text-secondary">
                    <Send className="w-4 h-4 mr-2" />
                    संदेश भेजें
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Media Links */}
      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            सामाजिक माध्यमों पर जुड़ें
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            हमारे सामाजिक माध्यमों पर फॉलो करें और नवीनतम अपडेट प्राप्त करें
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-initial">
              <a href="https://facebook.com/joinrss" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-5 h-5 mr-2" />
                Facebook
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-initial">
              <a href="https://twitter.com/joinrss" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5 mr-2" />
                Twitter
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-initial">
              <a href="https://instagram.com/joinrss" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5 mr-2" />
                Instagram
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-initial">
              <a href="https://linkedin.com/company/joinrss" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-2xl">
            <CardContent className="p-8 sm:p-12 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6">
                राष्ट्र सेवा में हमारे साथ जुड़ें
              </h3>
              <p className="text-lg mb-8 text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
                आपका छोटा सा योगदान भी राष्ट्र निर्माण में महत्वपूर्ण भूमिका निभा सकता है। 
                आज ही हमसे जुड़कर धर्म और संस्कृति की रक्षा में भागीदार बनें।
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  <Link href="/founders-team-members">
                    <Users className="w-4 h-4 mr-2" />
                    हमारी टीम देखें
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  <Link href="/#donation">
                    दान करें
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
