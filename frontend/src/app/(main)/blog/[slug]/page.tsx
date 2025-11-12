"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  BookmarkPlus,
  Tag,
  User,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";
import { blogPosts } from "../blogData";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const post = blogPosts.find((p) => p.slug === slug);
  const relatedPosts = blogPosts
    .filter((p) => p.category === post?.category && p.id !== post?.id)
    .slice(0, 3);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">लेख नहीं मिला</h1>
          <Link href="/blog">
            <Button>ब्लॉग पर वापस जाएं</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-14">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ब्लॉग पर वापस जाएं
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Category Badge */}
        <div className="mb-6">
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 text-sm px-4 py-1">
            <Tag className="w-3.5 h-3.5 mr-1.5" />
            {post.category}
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b">
          {/* Author */}
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src={post.author.image} alt={post.author.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {post.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {post.author.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {post.author.role}
              </p>
            </div>
          </div>

          <Separator orientation="vertical" className="h-10 hidden sm:block" />

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {formatDate(post.date)}
          </div>

          {/* Read Time */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {post.readTime} पढ़ने का समय
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            शेयर करें
          </Button>
          <Button variant="outline" size="sm">
            <BookmarkPlus className="w-4 h-4 mr-2" />
            सहेजें
          </Button>
          <Button variant="outline" size="sm">
            <Facebook className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Twitter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Linkedin className="w-4 h-4" />
          </Button>
        </div>

        {/* Excerpt */}
        <div className="bg-muted/50 border-l-4 border-primary p-6 rounded-r-lg mb-8">
          <p className="text-lg text-foreground italic leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">
              टैग्स
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-12" />

        {/* Author Card */}
        <div className="bg-muted/30 rounded-xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src={post.author.image} alt={post.author.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {post.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{post.author.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {post.author.role}
              </p>
              <p className="text-sm text-muted-foreground">
                राष्ट्रीय सेवा संघ के समर्पित सदस्य और लेखक। समाज सेवा और राष्ट्र
                निर्माण में सक्रिय योगदान।
              </p>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">संबंधित लेख</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="block group"
                >
                  <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video">
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                      />
                    </div>
                    <div className="p-4">
                      <Badge className="mb-2 text-xs" variant="secondary">
                        {relatedPost.category}
                      </Badge>
                      <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(relatedPost.date)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Bottom CTA */}
      <div className="bg-primary/5 border-y py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            अधिक लेख पढ़ना चाहते हैं?
          </h2>
          <p className="text-muted-foreground mb-6">
            राष्ट्रीय सेवा संघ के सभी अपडेट और समाचार प्राप्त करें
          </p>
          <Link href="/blog">
            <Button size="lg">
              सभी लेख देखें
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
