import React from "react";
import { Receipt } from "@/module/donation/component";

const page = () => {
  return (
    <div className="p-12 mt-12">
      <Receipt
        donatedBy="John Doe"
        mobileNo="9876543210"
        dateOfDonation="2024-10-23"
        donationMode="Online payment"
        donationAmountWords="Five Hundred Only"
        donationAmountNumbers={500}
        receiptNumber="DA000000024"
        location="Uttarakhand"
      />
    </div>
  );
};

export default page;
