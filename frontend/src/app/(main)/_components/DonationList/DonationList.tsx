
"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Clock,
  MapPin,
  Heart,
  CreditCard,
  Smartphone,
  Banknote,
} from "lucide-react";
import {
  DonationTickerRecord,
  tickerDonations,
} from "./DonationListInfo";
import NormalButton from "@/components/common/RssButton/RssButton";
import styles from "./DonationList.module.css";

const DonationList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDonations, setFilteredDonations] = useState<
    DonationTickerRecord[]
  >([]);
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = tickerDonations.filter(
        (donation) =>
          donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDonations(filtered.slice(0, displayCount));
    } else {
      setFilteredDonations(tickerDonations.slice(0, displayCount));
    }
  }, [searchTerm, displayCount]);

  const getPaymentIcon = (mode: string) => {
    switch (mode) {
      case "UPI":
        return <Smartphone className="w-4 h-4" />;
      case "Online":
      case "Card":
        return <CreditCard className="w-4 h-4" />;
      case "Cash":
        return <Banknote className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getPaymentBadgeVariant = (mode: string) => {
    switch (mode) {
      case "UPI":
        return "bg-green-50 text-green-700 border-green-200";
      case "Online":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Bank Transfer":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Card":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Cash":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cheque":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const loadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 10, tickerDonations.length));
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Heart className="w-4 h-4 mr-2" />
            दान सूची
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Pillars of <span className="text-red-600">Support</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Gratitude to Our Generous Donors: Partners in Upholding Sanatana Culture and National Welfare.
          </p>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-foreground">
              {liveStats.activeDonors.toLocaleString()}
            </h3>
            <p className="text-sm text-muted-foreground">कुल दानदाता</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-foreground">
              ₹{liveStats.totalAmountToday.toLocaleString()}
            </h3>
            <p className="text-sm text-muted-foreground">कुल राशि</p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 text-center">
            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-foreground">
              {liveStats.totalDonationsToday}
            </h3>
            <p className="text-sm text-muted-foreground">आज के दान</p>
          </div>
        </div> */}

        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search donor name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden relative">
          <Table>
            <TableCaption className="py-4 text-muted-foreground">
              List of donors to Rashtriya Seva Sangh - Total{" "}
              {tickerDonations.length} entries
            </TableCaption>
          </Table>
          
          <div className={styles.donationScrollContainer}>
            <Table>
              <TableBody className={styles.donationScrollBody}>
                {filteredDonations.map((donation) => (
                <TableRow
                  key={donation.id}
                  className="hover:bg-muted/30 transition-colors border-0"
                >
                  <TableCell className="px-6 py-4 border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {donation.donorName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {donation.isAnonymous
                            ? "Anonymous Donor"
                            : donation.donorName}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  {/* <TableCell className="px-6 py-4 border-0">
                    <span className="font-bold text-lg text-primary">
                      {formatTickerAmount(donation.amount, donation.currency)}
                    </span>
                  </TableCell> */}
                  <TableCell className="px-6 py-4 border-0">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {donation.location}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 border-0">
                    <Badge
                      className={`${getPaymentBadgeVariant(
                        donation.paymentMode
                      )} border`}
                    >
                      <div className="flex items-center gap-1">
                        {getPaymentIcon(donation.paymentMode)}
                        <span className="text-xs">{donation.paymentMode}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 border-0">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {donation.timeAgo}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 border-0">
                    {donation.message ? (
                      <span className="text-sm text-muted-foreground italic">
                        &ldquo;{donation.message}&rdquo;
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No message
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredDonations.map((donation) => (
                <TableRow
                  key={`duplicate-${donation.id}`}
                  className="hover:bg-muted/30 transition-colors border-0"
                >
                  <TableCell className="px-6 py-4 border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {donation.donorName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {donation.isAnonymous
                            ? "Anonymous Donor"
                            : donation.donorName}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  {/* <TableCell className="px-6 py-4 border-0">
                    <span className="font-bold text-lg text-primary">
                      {formatTickerAmount(donation.amount, donation.currency)}
                    </span>
                  </TableCell> */}
                  <TableCell className="px-6 py-4 border-0">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {donation.location}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 border-0">
                    <Badge
                      className={`${getPaymentBadgeVariant(
                        donation.paymentMode
                      )} border`}
                    >
                      <div className="flex items-center gap-1">
                        {getPaymentIcon(donation.paymentMode)}
                        <span className="text-xs">{donation.paymentMode}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 border-0">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {donation.timeAgo}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 border-0">
                    {donation.message ? (
                      <span className="text-sm text-muted-foreground italic">
                        &ldquo;{donation.message}&rdquo;
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No message
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>
        </div>

        {displayCount < tickerDonations.length && (
          <div className="text-center mt-8">
            <NormalButton
              variant="primary"
              size="md"
              showArrow={true}
              onClick={loadMore}
              className="px-8 py-3 font-semibold"
            >
              Load More
            </NormalButton>
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Legacy of Giving: Add Your Name
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Enroll Your Commitment: Contribute to the Sacred Work of Rashtriya Seva Sangh. Every Donation is a Step Towards a Stronger, Vedic Bharat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationList;