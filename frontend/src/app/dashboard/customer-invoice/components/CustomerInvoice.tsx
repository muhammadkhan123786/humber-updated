"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useInvoice } from "@/hooks/useInvoice";
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

const CustomerInvoice = () => {
  const {
    form,
    jobs,
    partsInventory,
    serviceTypes,
    selectedJob,
    defaultTaxRate,
    handleJobSelect,
    addService,
    addPart,
    onSubmit,
    isSubmitting,
    serviceFields,
    partFields,
    invoiceCode,
  } = useInvoice();

  const [calloutFee, setCalloutFee] = useState<number>(0);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string>("Percentage");
  const [isVatExempt, setIsVatExempt] = useState<boolean>(false);

  const isSyncing = useRef(false);

  const watchedParts = form.watch("parts");
  const watchedServices = form.watch("services");

  console.log("seletected job", selectedJob);

  useEffect(() => {
    if (!selectedJob?.ticketId?.customerId) return;

    const vatExempt = selectedJob.ticketId.customerId.isVatExemption === true;

    const currentValue = form.getValues("isVATEXEMPT");

    if (currentValue !== vatExempt) {
      form.setValue("isVATEXEMPT", vatExempt, {
        shouldDirty: true,
      });
    }
  }, [selectedJob, form]);

  useEffect(() => {
    if (isSyncing.current) return;
    isSyncing.current = true;

    const subscription = form.watch((value, { name }) => {
      if (name === "callOutFee" && value.callOutFee !== calloutFee) {
        setCalloutFee(value.callOutFee || 0);
      }
      if (name === "discountAmount") {
        const newValue = value.discountAmount || 0;
        if (newValue !== discountValue) {
          setDiscountValue(newValue);
        }
      }
      if (name === "discountType") {
        const type = value.discountType;
        if (
          (type === "Percentage" || type === "Fix Amount") &&
          type !== discountType
        ) {
          setDiscountType(type);
        }
      }
      if (name === "isVATEXEMPT" && value.isVATEXEMPT !== isVatExempt) {
        setIsVatExempt(value.isVATEXEMPT || false);
      }
    });

    setTimeout(() => {
      isSyncing.current = false;
    }, 100);

    return () => {
      subscription.unsubscribe();
      isSyncing.current = false;
    };
  }, [form, calloutFee, discountValue, discountType, isVatExempt]);

  const parts = useMemo(() => {
    const formParts = watchedParts || [];
    return formParts.map((part: any, index: number) => ({
      id: index + 1,
      name:
        part.partName ||
        partsInventory.find((p: any) => p._id === part.partId)?.partName ||
        "",
      sku:
        part.partNumber ||
        partsInventory.find((p: any) => p._id === part.partId)?.partNumber ||
        "",
      quantity: part.quantity,
      unitPrice: part.unitCost,
      partId: part.partId,
      source: part.source,
    }));
  }, [watchedParts, partsInventory]);

  const labourItems = useMemo(() => {
    const formServices = watchedServices || [];
    return formServices.map((service: any, index: number) => {
      let hours = 1;
      if (service?.duration) {
        if (
          typeof service.duration === "string" &&
          service.duration.includes(":")
        ) {
          const [h, m] = service.duration.split(":").map(Number);
          hours = h + (m || 0) / 60;
        } else {
          hours = parseFloat(String(service.duration)) || 1;
        }
      }

      return {
        id: index + 1,
        description: service.description,
        hours: hours,
        duration: service.duration || "1:00",
        rate: service.rate || 50,
        activityId: service.activityId,
        source: service.source,
      };
    });
  }, [watchedServices]);

  const handleSubmit = async () => {
    console.log("Handle Submit in Customer invoice.");
    await onSubmit(form.getValues());
  };

  const partsSubtotal = parts.reduce(
    (acc, part) => acc + (part.quantity || 0) * (part.unitPrice || 0),
    0,
  );

  const labourSubtotal = labourItems.reduce(
    (acc, item) => acc + (item.hours || 0) * (item.rate || 0),
    0,
  );

  const subtotal = partsSubtotal + labourSubtotal + (calloutFee || 0);

  return (
    <div>
      <HeaderSection invoiceCode={invoiceCode} />
      <div className="my-3">
        <CardSection form={form} vatRate={defaultTaxRate} />
      </div>
      <JobSelectionSection
        jobs={jobs}
        onJobSelect={handleJobSelect}
        selectedJob={selectedJob}
        form={form}
        invoiceCode={invoiceCode}
      />
      <div className="my-7">
        <PartsAndComponents
          parts={parts}
          partsInventory={partsInventory}
          form={form}
          addPart={addPart}
          partFields={partFields}
        />
      </div>
      <LabourSection
        labourItems={labourItems}
        serviceTypes={serviceTypes}
        form={form}
        addService={addService}
        serviceFields={serviceFields}
      />
      <div className="my-3">
        <AdditionalCharges
          subtotal={subtotal}
          vatRate={defaultTaxRate}
          form={form}
        />
      </div>
      <InvoiceSummary form={form} vatRate={defaultTaxRate} />
      <div className="my-3">
        <NotesAndTerms form={form} />
      </div>
      <PaymentLinkHeader form={form} />
      <div className="my-3">
        <PaymentModeSection form={form} />
      </div>
      <InvoiceFooter onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default CustomerInvoice;
