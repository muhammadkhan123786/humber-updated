"use client";
import React, { useState } from "react";
import HeaderSection from "./HeaderSection";
import CardSection from "./CardSection";
import JobSelectionSection from "./JobSelection";
import PartsAndComponents from "./PartsAndComponents";
import LabourSection from "./LabourSection";
import AdditionalCharges from "./AdditionalCharges";
import InvoiceSummary from "./InvoiceSummary";
import NotesAndTerms from "./NotesAndTerms";
import PaymentLinkHeader from "./PaymentLinkHeader";
import PaymentModeSection from "./PaymentModeSection";
import InvoiceFooter from "./InvoiceFooter";

interface Part {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

interface LabourItem {
  id: number;
  description: string;
  hours: number;
  rate: number;
}

const CustomerInvoice = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [labourItems, setLabourItems] = useState<LabourItem[]>([]);
  const [calloutFee, setCalloutFee] = useState<number>(0);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string>("percentage");
  const [isVatExempt, setIsVatExempt] = useState<boolean>(false);
  const [vatRate, setVatRate] = useState<number>(20);
  const partsSubtotal = parts.reduce(
    (acc, part) => acc + (part.quantity || 0) * (part.unitPrice || 0),
    0,
  );

  const labourSubtotal = labourItems.reduce(
    (acc, item) => acc + (item.hours || 0) * (item.rate || 0),
    0,
  );

  const subtotal = partsSubtotal + labourSubtotal + (calloutFee || 0);
  let discountAmount = 0;
  if (discountType === "percentage") {
    discountAmount = (subtotal * (discountValue || 0)) / 100;
  } else {
    discountAmount = discountValue || 0;
  }

  const afterDiscount = subtotal - discountAmount;
  const vatAmount = !isVatExempt ? (afterDiscount * (vatRate || 0)) / 100 : 0;
  const grandTotal = afterDiscount + vatAmount;

  return (
    <div>
      <HeaderSection />
      <div className="my-3">
        <CardSection />
      </div>

      <JobSelectionSection />

      <div className="my-7">
        <PartsAndComponents parts={parts} setParts={setParts} />
      </div>

      <LabourSection
        labourItems={labourItems}
        setLabourItems={setLabourItems}
      />

      <div className="my-3">
        <AdditionalCharges
          calloutFee={calloutFee}
          setCalloutFee={setCalloutFee}
          discountValue={discountValue}
          setDiscountValue={setDiscountValue}
          discountType={discountType}
          setDiscountType={setDiscountType}
          isVatExempt={isVatExempt}
          setIsVatExempt={setIsVatExempt}
          vatRate={vatRate}
          setVatRate={setVatRate}
          subtotal={subtotal}
        />
      </div>

      <InvoiceSummary
        partsSubtotal={partsSubtotal}
        labourSubtotal={labourSubtotal}
        calloutFee={calloutFee}
        discountAmount={discountAmount}
        discountType={discountType}
        discountValue={discountValue}
        subtotal={subtotal}
        afterDiscount={afterDiscount}
        isVatExempt={isVatExempt}
        vatRate={vatRate}
        vatAmount={vatAmount}
        grandTotal={grandTotal}
      />

      <div className="my-3">
        <NotesAndTerms />
      </div>

      <PaymentLinkHeader />

      <div className="my-3">
        <PaymentModeSection />
      </div>

      <InvoiceFooter />
    </div>
  );
};

export default CustomerInvoice;
