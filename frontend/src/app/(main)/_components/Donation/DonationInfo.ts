export interface BankDetails {
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface QRCodeInfo {
  image: string;
  alt: string;
  description: string;
}

export interface DonationData {
  description: string;
  qrCode: QRCodeInfo;
  bankDetails: BankDetails;
}

export const donationData: DonationData = {
  description: "Your Generosity Directly Empowers Our Ground-Level Work. Donate via Online, QR Code or Bank Transfer.",
  qrCode: {
    image: "/hero/qr-code.jpg",
    alt: "QR Code for Donation",
    description: "📲 Scan and Donate"
  },
  bankDetails: {
    accountName: "Rashtriya Seva Sangh",
    bankName: "Uttarakhand Gramin Bank",
    accountNumber: "76032104282",
    ifscCode: "SBIN0RRUTGB"
  }
};