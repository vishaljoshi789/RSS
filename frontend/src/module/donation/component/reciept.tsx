import React from "react";
import Image from "next/image";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

interface ReceiptProps {
  donatedBy?: string;
  mobileNo?: string;
  dateOfDonation?: string;
  donationMode?: string;
  donationAmountWords?: string;
  donationAmountNumbers?: number;
  receiptNumber?: string;
  country?: string;
  state?: string;
  city?: string;
  postal_code?: string;
}

const Receipt: React.FC<ReceiptProps> = ({
  donatedBy = "",
  mobileNo = "",
  dateOfDonation = "",
  donationMode = "Online payment",
  donationAmountWords = "",
  donationAmountNumbers = 0,
  receiptNumber = "DA000000023",
  country = "",
  state = "",
  city = "",
  postal_code = "",
}) => {
  return (
    <div className="receipt-container relative w-full max-w-4xl mx-auto bg-white p-8 shadow-lg border-4 border-black">
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden">
        <div className="relative w-[600px] h-[600px]">
          <Image
            src="/logo/logo.png"
            alt="RSS Watermark"
            fill
            className="object-contain"
            priority
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-1">
              Rashtriya Seva Sangh
            </h1>
            <p className="text-base italic text-gray-700 mb-1">
              {country}, {state}, {city} - {postal_code}
            </p>
            <p className="text-sm text-gray-700 mb-0.5">
              (Registered Public Charitable Trust, REG NO. 47/2024)
            </p>
            <p className="text-sm text-gray-700 mb-0.5">
              NGO REG: UA/2024/0401926
            </p>
            <p className="text-sm text-gray-700">
              Contact : 9429693593 E-Mail : help@joinrss.org.in
            </p>
          </div>

          <div className="absolute top-0 right-0">
            <div className="relative w-28 h-28">
              <Image
                src="/logo/logo.png"
                alt="RSS Logo"
                fill
                className="object-contain"
                priority
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
              />
            </div>
          </div>
        </div>

        <div className="text-right mb-6">
          <p className="text-lg font-semibold text-gray-900">
            <span className="font-bold">Receipt #:</span>
            {receiptNumber}
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900 min-w-[200px]">
              Donated by:
            </span>
            <span className="text-lg text-gray-900">{donatedBy}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900 min-w-[200px]">
              Mobile No:
            </span>
            <span className="text-lg text-gray-900">{mobileNo}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900 min-w-[200px]">
              Date of donation:
            </span>
            <span className="text-lg text-gray-900">{dateOfDonation}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900 min-w-[200px]">
              Donation Mode:
            </span>
            <span className="text-lg text-gray-900">{donationMode}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900 min-w-[200px]">
              Donation amount(words):
            </span>
            <span className="text-lg text-gray-900">{donationAmountWords}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900 min-w-[200px]">
              Donation amount(numbers):
            </span>
            <span className="text-lg text-gray-900">
              ₹{donationAmountNumbers.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="mt-12 mb-8">
          <div className="flex flex-col items-end">
            <div className="relative inline-block">
              <p className="text-lg font-bold text-gray-900 mb-2">
                Authorized signature: _________________
              </p>
            </div>
            <p className="text-lg font-bold text-gray-900 mt-4">
              (Sunil Dutt Pant)
            </p>
            <p className="text-base text-gray-700">(Treasurer)</p>
          </div>
        </div>

        <div className="bg-yellow-300 px-4 py-2 mb-6">
          <p className="text-center text-sm font-bold text-gray-900">
            "Thank you for your support and for your belief in doing good.we
            simply couldn't do what we do without amazing people like you."
          </p>
        </div>

        <div className="border-t-2 border-gray-300 pt-4">
          <p className="text-center text-base italic text-blue-700 mb-1">
            For more information or help please visit: Rashtriya Seva Sangh{" "}
            <a
              href={
                process.env.NEXT_PUBLIC_FRONTEND_URL ||
                "https://www.joinrss.org.in"
              }
              className="underline hover:text-blue-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              {process.env.NEXT_PUBLIC_FRONTEND_URL || "www.joinrss.org.in"}
            </a>
          </p>
          <p className="text-center text-sm text-gray-700">
            The amount donated will be completely non-refundable and the
            organisation is free to use it for its religious and social work.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
