"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  TrendingUp,
  User,
  Tag,
} from "lucide-react";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";
import { blogPosts, blogCategories } from "./blogData";

const truncateText = (text: string, maxWords: number) => {
  const words = text.split(" ");
  if (words.length <= maxWords) {
    return { text, isTruncated: false };
  }
  return {
    text: words.slice(0, maxWords).join(" ") + "...",
    isTruncated: true,
  };
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter((post) => post.featured);
  const latestPost = featuredPosts[0];

  return (
    <div className="min-h-screen bg-background mt-10">
      {/* Hero Section */}fix 
      <section className="relative overflow-hidden bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-orange-700">
                  Latest Updates
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                समाचार और{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                  अपडेट
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                राष्ट्रीय सेवा संघ की गतिविधियों, कार्यक्रमों और महत्वपूर्ण अपडेट
                के बारे में जानें
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {blogPosts.length}+
                    </div>
                    <div className="text-sm text-gray-600">लेख</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">10K+</div>
                    <div className="text-sm text-gray-600">पाठक</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {blogCategories.length - 1}
                    </div>
                    <div className="text-sm text-gray-600">श्रेणियां</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Featured Image/Illustration */}
            <div className="relative lg:block hidden">
              <div className="relative">
                {/* Background Decoration */}
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-3xl blur-3xl"></div>
                <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-3xl blur-3xl"></div>

                {/* Content Cards */}
                <div className="relative space-y-4">
                  <div className="bg-white border shadow-lg rounded-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          नवीनतम लेख
                        </div>
                        <div className="text-sm text-gray-600">
                          हर दिन नए अपडेट
                        </div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
                    </div>
                  </div>

                  <div className="bg-white border shadow-lg rounded-2xl p-6 transform -rotate-1 hover:rotate-0 transition-transform ml-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          ट्रेंडिंग
                        </div>
                        <div className="text-sm text-gray-600">
                          सबसे लोकप्रिय
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg"></div>
                      <div className="flex-1 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-lg"></div>
                      <div className="flex-1 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg"></div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 border shadow-lg rounded-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform mr-8">
                    <div className="flex items-center justify-between text-white mb-2">
                      <span className="font-semibold">साप्ताहिक अपडेट</span>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      50+
                    </div>
                    <div className="text-sm text-orange-100">
                      इस सप्ताह प्रकाशित
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post Section */}
      {latestPost && (
        <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full mb-4">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-700">
                  Featured Post
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                आज का मुख्य लेख
              </h2>
            </div>

            <Link href={`/blog/${latestPost.slug}`}>
              <div className="group overflow-hidden border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white cursor-pointer rounded-3xl">
                <div className="grid md:grid-cols-5 gap-0">
                  <div className="relative md:col-span-2 aspect-video md:aspect-square overflow-hidden">
                    <Image
                      src={latestPost.image}
                      alt={latestPost.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0"></div>
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-orange-600 text-white font-semibold shadow-lg">
                        फीचर्ड
                      </Badge>
                    </div>
                  </div>

                  <div className="md:col-span-3 p-8 lg:p-12 flex flex-col justify-center">
                    <Badge className="w-fit mb-5 bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 font-semibold">
                      {latestPost.category}
                    </Badge>

                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-5 leading-tight group-hover:text-orange-600 transition-colors">
                      {latestPost.title}
                    </h3>

                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      {latestPost.excerpt}
                    </p>

                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                      <Avatar className="w-14 h-14 ring-2 ring-orange-100">
                        <AvatarImage
                          src={latestPost.author.image}
                          alt={latestPost.author.name}
                        />
                        <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold">
                          {latestPost.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {latestPost.author.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {latestPost.author.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-8">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        {formatDate(latestPost.date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        {latestPost.readTime}
                      </div>
                    </div>

                    <Button className="w-fit bg-orange-600 hover:bg-orange-700 text-white group/btn shadow-lg">
                      पूरा लेख पढ़ें
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-10 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              श्रेणी के अनुसार खोजें
            </h3>
            <p className="text-gray-600">
              अपनी रुचि के अनुसार लेख खोजें
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {blogCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2 font-semibold transition-all ${
                  selectedCategory === category
                    ? "bg-orange-600 hover:bg-orange-700 text-white shadow-lg scale-105"
                    : "border-gray-300 hover:border-orange-600 hover:text-orange-600"
                }`}
              >
                {category === "All" && "सभी"}
                {category === "News" && "समाचार"}
                {category === "Events" && "कार्यक्रम"}
                {category === "Social Work" && "समाज सेवा"}
                {category === "Updates" && "अपडेट"}
                {category === "Announcements" && "घोषणाएं"}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {selectedCategory === "All" ? "सभी लेख" : selectedCategory}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {filteredPosts.length} लेख उपलब्ध हैं
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                <article className="group overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white cursor-pointer h-full flex flex-col rounded-2xl hover:-translate-y-1">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white text-orange-600 font-semibold shadow-md">
                        {post.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col p-6">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-orange-600 transition-colors duration-300">
                      {post.title}
                    </h3>

                    <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">
                      {(() => {
                        const { text, isTruncated } = truncateText(
                          post.excerpt,
                          20
                        );
                        return (
                          <>
                            {text}
                            {isTruncated && (
                              <span className="inline-flex items-center gap-1 ml-1 text-orange-600 font-semibold">
                                ...
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </p>

                    <div className="flex items-center gap-3 mb-4 pt-4 border-t border-gray-100">
                      <Avatar className="w-10 h-10 ring-2 ring-gray-100">
                        <AvatarImage
                          src={post.author.image}
                          alt={post.author.name}
                        />
                        <AvatarFallback className="bg-orange-100 text-orange-700 text-sm font-semibold">
                          {post.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate text-gray-900">
                          {post.author.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {post.author.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-orange-600" />
                        {formatDate(post.date)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-orange-600" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                कोई लेख नहीं मिला
              </h3>
              <p className="text-muted-foreground">
                इस श्रेणी में कोई लेख उपलब्ध नहीं है
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
