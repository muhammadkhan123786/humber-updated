"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Mail, Printer, Download, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { downloadInvoicePDF } from "../../component/InvoicePDF";
const getAuthHeader = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return {};
  const cleanToken = token.replace(/^"|"$/g, "").trim();
  return { Authorization: `Bearer ${cleanToken}` };
};

const Page = () => {
  const params = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchInvoice();
    }
  }, [params?.id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
      const response = await axios.get(
        `${baseUrl}/customer-invoices/${params.id}`,
        {
          headers: getAuthHeader(),
        },
      );

      if (response.data?.success && response.data?.data) {
        setInvoice(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("Failed to fetch invoice");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const formatCurrency = (amount: number) => {
    return amount?.toFixed(2) || "0.00";
  };

  const buttonBase =
    "group inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] h-9 px-4 gap-2 border shadow-sm";
  const secondaryBtn = `${buttonBase} bg-white text-indigo-950 border-indigo-600/10 hover:bg-green-600 hover:text-white`;

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-gray-500">Loading invoice...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-gray-500">Invoice not found</div>
      </div>
    );
  }
  const partsTotal =
    invoice.parts?.reduce(
      (sum: number, part: any) => sum + (part.totalCost || 0),
      0,
    ) || 0;

  const labourTotal =
    invoice.services?.reduce((sum: number, service: any) => {
      let hours = 1;
      if (service?.duration) {
        if (
          typeof service.duration === "string" &&
          service.duration.includes(":")
        ) {
          const [h, m] = service.duration.split(":").map(Number);
          hours = (h || 0) + (m || 0) / 60;
        } else {
          hours = parseFloat(String(service.duration)) || 1;
        }
      }
      const rate = service?.rate || 50;
      return sum + hours * rate;
    }, 0) || 0;

  const subtotal = partsTotal + labourTotal + (invoice.callOutFee || 0);
  const afterDiscount = subtotal - (invoice.discountAmount || 0);
  const handleDownloadPDF = () => {
    downloadInvoicePDF(invoice);
  };
  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto h-9 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoice-management">
            <button className={secondaryBtn}>
              <ArrowLeft className="w-4 h-4 transition-colors group-hover:text-white text-indigo-950" />
              <span className="text-sm font-normal font-['Arial'] transition-colors">
                Back to Invoices
              </span>
            </button>
          </Link>

          <div
            className={`h-6 px-2 flex items-center gap-1 rounded-[10px] border ${
              invoice.paymentStatus === "PAID"
                ? "bg-green-100 border-green-300"
                : "bg-yellow-100 border-yellow-300"
            }`}
          >
            <CheckCircle2
              className={`w-3 h-3 ${
                invoice.paymentStatus === "PAID"
                  ? "text-green-700"
                  : "text-yellow-700"
              }`}
            />
            <span
              className={`text-xs font-normal font-['Arial'] ${
                invoice.paymentStatus === "PAID"
                  ? "text-green-700"
                  : "text-yellow-700"
              }`}
            >
              {invoice.paymentStatus || "PENDING"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className={secondaryBtn}>
            <Mail className="w-4 h-4 transition-colors group-hover:text-white text-indigo-950" />
            <span className="text-sm font-normal font-['Arial'] transition-colors">
              Email
            </span>
          </button>

          <button className={secondaryBtn}>
            <Printer className="w-4 h-4 transition-colors group-hover:text-white text-indigo-950" />
            <span className="text-sm font-normal font-['Arial'] transition-colors">
              Print
            </span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="h-9 px-4 flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 rounded-[10px] shadow-md hover:opacity-90 transition-all text-white"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-normal font-['Arial']">
              Download PDF
            </span>
          </button>
        </div>
      </div>

      <div className="mx-32 my-12 bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="flex justify-between items-start mb-12">
          <div className="flex gap-6">
            <div className="w-24 h-24 rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <img
                src="https://placehold.co/92x92"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                INVOICE
              </h1>
              <p className="text-lg text-gray-600">#{invoice.invoiceId}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Humber Mobility Scooter
            </h2>
            <p className="text-gray-600 text-sm">
              376 Anlaby Road, Hull, HU3 6PB
            </p>
            <p className="text-gray-600 text-sm">01482 561964</p>
            <p className="text-gray-600 text-sm">info@humbermobility.co.uk</p>
            <p className="text-sm font-semibold text-gray-700 mt-2">
              VAT: GB123456789
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 p-8 bg-gray-50 rounded-2xl">
          <div className="flex flex-col gap-2">
            <span className="text-gray-500 text-xs font-bold tracking-widest uppercase">
              BILL TO:
            </span>
            <div className="mt-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {invoice.customerId?.personId?.firstName || "N/A"}{" "}
                {invoice.customerId?.personId?.lastName || ""}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {invoice.customerId?.addressId?.address || "N/A"},
                <br />
                {invoice.customerId?.addressId?.city || "N/A"}
              </p>
              <div>
                <p className="text-gray-600 text-sm ">
                  {invoice.customerId?.contactId?.emailId || "N/A"}
                </p>
                <p className="text-gray-600 text-sm">
                  {invoice.customerId?.contactId?.mobileNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 justify-center">
            <div className="flex justify-between items-center pb-2">
              <span className="text-sm font-semibold text-gray-700">
                Issue Date:
              </span>
              <span className="text-gray-900 text-sm font-medium">
                {formatDate(invoice.invoiceDate)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-sm font-semibold text-gray-700">
                Due Date:
              </span>
              <span className="text-gray-900 text-sm font-medium">
                {formatDate(invoice.dueDate)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-sm font-semibold text-gray-700">
                Job Number:
              </span>
              <span className="text-gray-900 text-sm font-medium">
                {invoice.jobId?.jobId || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">
                Ticket Number:
              </span>
              <span className="text-gray-900 text-sm font-medium">
                {invoice.jobId?.ticketId?.ticketCode || "N/A"}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <div className="border-t border-gray-100 pt-8 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Parts & Components
            </h3>
          </div>

          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 px-4">
            <div className="col-span-6 text-sm font-semibold text-gray-700 tracking-widest">
              Description
            </div>
            <div className="col-span-2 text-center text-sm font-semibold text-gray-700 tracking-widest">
              Qty
            </div>
            <div className="col-span-2 text-right text-sm font-semibold text-gray-700 tracking-widest">
              Price
            </div>
            <div className="col-span-2 text-right text-sm font-semibold text-gray-700 tracking-widest">
              Total
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {invoice.parts?.map((part: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 py-6 px-4 items-center"
              >
                <div className="col-span-6 text-sm text-gray-900">
                  {part.partId?.partName || "Part Name"}
                </div>
                <div className="col-span-2 text-center text-sm text-gray-600 font-medium">
                  {part.quantity || 0}
                </div>
                <div className="col-span-2 text-right text-sm text-gray-600 font-medium">
                  £{formatCurrency(part.unitCost)}
                </div>
                <div className="col-span-2 text-right text-sm font-bold text-gray-900">
                  £{formatCurrency(part.totalCost)}
                </div>
              </div>
            ))}
            {(!invoice.parts || invoice.parts.length === 0) && (
              <div className="py-6 px-4 text-center text-gray-500">
                No parts added
              </div>
            )}
          </div>
        </div>
        <div className="mt-8">
          <div className="border-t border-gray-100 pt-8 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Labour & Services
            </h3>
          </div>

          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 px-4">
            <div className="col-span-6 text-sm font-semibold text-gray-700 tracking-widest">
              Description
            </div>
            <div className="col-span-2 text-center text-sm font-semibold text-gray-700 tracking-widest">
              Hours
            </div>
            <div className="col-span-2 text-right text-sm font-semibold text-gray-700 tracking-widest">
              Rate
            </div>
            <div className="col-span-2 text-right text-sm font-semibold text-gray-700 tracking-widest">
              Total
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {invoice.services?.map((service: any, index: number) => {
              let hours = 1;
              if (service?.duration) {
                if (
                  typeof service.duration === "string" &&
                  service.duration.includes(":")
                ) {
                  const [h, m] = service.duration.split(":").map(Number);
                  hours = (h || 0) + (m || 0) / 60;
                } else {
                  hours = parseFloat(String(service.duration)) || 1;
                }
              }
              const rate = service?.rate || 50;
              const total = hours * rate;

              return (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 py-6 px-4 items-center"
                >
                  <div className="col-span-6 text-sm text-gray-900">
                    {service.description ||
                      service.activityId?.technicianServiceType ||
                      "Service"}
                  </div>
                  <div className="col-span-2 text-center text-sm text-gray-600 font-medium">
                    {hours.toFixed(1)}
                  </div>
                  <div className="col-span-2 text-right text-sm text-gray-600 font-medium">
                    £{formatCurrency(rate)}
                  </div>
                  <div className="col-span-2 text-right text-sm font-bold text-gray-900">
                    £{formatCurrency(total)}
                  </div>
                </div>
              );
            })}
            {(!invoice.services || invoice.services.length === 0) && (
              <div className="py-6 px-4 text-center text-gray-500">
                No services added
              </div>
            )}
          </div>
        </div>
        <div className="mt-12 flex justify-end">
          <div className="w-full max-w-xs space-y-3">
            <div className="flex justify-between items-center px-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                Subtotal
              </span>
              <span className="font-semibold">£{formatCurrency(subtotal)}</span>
            </div>

            {invoice.discountAmount > 0 && (
              <div className="flex justify-between items-center px-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                  Discount ({invoice.discountType})
                </span>
                <span className="font-semibold text-red-600">
                  -£{formatCurrency(invoice.discountAmount)}
                </span>
              </div>
            )}

            {!invoice.isVATEXEMPT && (
              <div className="flex justify-between items-center px-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                  VAT (
                  {invoice.taxAmount
                    ? ((invoice.taxAmount / afterDiscount) * 100).toFixed(1)
                    : "20"}
                  %)
                </span>
                <span className="font-semibold">
                  £{formatCurrency(invoice.taxAmount)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center px-2">
              <span className="font-bold text-gray-900 tracking-[0.15em]">
                Total
              </span>
              <span className="font-bold text-blue-600">
                £{formatCurrency(invoice.netTotal)}
              </span>
            </div>

            {invoice.paymentStatus === "PAID" && (
              <>
                <div className="flex justify-between items-center px-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                    Amount Paid
                  </span>
                  <span className="font-semibold text-green-600">
                    £{formatCurrency(invoice.netTotal)}
                  </span>
                </div>

                <div className="p-4 flex justify-between bg-green-50 border-2 border-green-200 rounded-lg">
                  <div>
                    <p className="text-[10px] pt-3 font-black text-green-800 uppercase tracking-[0.2em] leading-tight">
                      PAID
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      {invoice.paymentMethod || "Payment Method"}
                      <br />
                      {formatDate(invoice.updatedAt)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {invoice.invoiceNotes && (
          <>
            <div className="mt-8 pt-4 border-t border-gray-300"></div>
            <div className="w-full my-6 h-20 pl-5 pr-4 pt-4 bg-blue-50 rounded border-l-4 border-blue-500 flex flex-col justify-start items-start gap-1">
              <div className="self-stretch h-5 flex justify-start items-start">
                <div className="flex-1 text-blue-900 text-sm font-bold font-['Arial'] leading-5">
                  Notes:
                </div>
              </div>
              <div className="self-stretch h-5 flex justify-start items-start">
                <div className="flex-1 text-blue-800 text-sm font-normal font-['Arial'] leading-5">
                  {invoice.invoiceNotes}
                </div>
              </div>
            </div>
          </>
        )}
        <div className="w-full mt-12 pt-8 border-t-2 border-gray-200 flex flex-col justify-start items-center gap-2">
          <div className="self-stretch flex justify-center items-center">
            <div className="text-center text-gray-600 text-sm font-normal font-['Arial'] leading-5">
              Thank you for choosing Humber Mobility Scooter
            </div>
          </div>
          <div className="self-stretch flex justify-center items-center">
            <div className="text-center text-gray-600 text-sm font-normal font-['Arial'] leading-5 max-w-2xl">
              For any queries, please contact us at info@humbermobility.co.uk or
              01482 561964
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
