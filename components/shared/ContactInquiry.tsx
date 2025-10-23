"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ContactInquiryProps {
  vehicleTitle: string;
  isSold: boolean;
}

export function ContactInquiry({ vehicleTitle, isSold }: ContactInquiryProps) {
  const subject = encodeURIComponent(`Inquiry: ${vehicleTitle}`);
  const contactUrl = `/contact?subject=${subject}`;

  if (isSold) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 text-center">
        <p className="text-gray-400">This vehicle has been sold.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
      <Link href={contactUrl} className="block">
        <Button className="w-full" size="lg">
          Inquire About This Vehicle
        </Button>
      </Link>
      <p className="mt-3 text-center text-xs text-gray-400">
        Contact us to schedule a viewing or request more information
      </p>
    </div>
  );
}
