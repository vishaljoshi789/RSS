import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Store, TrendingUp, Users, Award } from "lucide-react";

const VyapariHero = () => {
  return (
    <section className="relative w-full bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 ">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
              <Store className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Empowering Indian Businesses
              </span>
            </div>

            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Discover Trusted
              <span className="text-primary">Indian Businesses</span>
            </h1>

            <p className="mt-4 max-w-xl text-lg text-muted-foreground sm:text-xl">
              Connect with authentic swadeshi enterprises and support local
              commerce across India
            </p>

            <div className="mt-6 max-w-xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Store className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search for businesses..."
                    className="h-12 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-base placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button className="h-12 rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                  Search
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
              <Link
                href="/vyapari/category"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Store className="h-5 w-5" />
                Explore Business Listings
              </Link>
              <Link
                href="/vyapari/register"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-primary bg-background px-8 py-4 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Users className="h-5 w-5" />
                Register Your Business
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
              <div className="rounded-lg border border-border bg-card p-3 text-center">
                <p className="text-2xl font-bold text-foreground">10,000+</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Businesses
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-3 text-center">
                <p className="text-2xl font-bold text-foreground">50,000+</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Connections
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-3 text-center">
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="mt-1 text-xs text-muted-foreground">Verified</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border shadow-lg lg:aspect-square">
            <Image
              src="/hero/deal.jpg"
              alt="Business partnership and collaboration"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VyapariHero;
