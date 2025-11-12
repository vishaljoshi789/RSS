import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      {/* Hero Image */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="aspect-video rounded-2xl" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-12 w-3/4 mb-8" />

        {/* Meta */}
        <div className="flex gap-6 mb-8 pb-8 border-b">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-24" />
          ))}
        </div>

        {/* Excerpt */}
        <Skeleton className="h-24 w-full mb-8 rounded-lg" />

        {/* Content */}
        <div className="space-y-4 mb-12">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

        {/* Tags */}
        <div className="mb-8">
          <Skeleton className="h-5 w-16 mb-3" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-7 w-20" />
            ))}
          </div>
        </div>

        {/* Author Card */}
        <Skeleton className="h-32 w-full rounded-xl mb-12" />

        {/* Related Posts */}
        <div>
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden">
                <Skeleton className="aspect-video" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
