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
  return (
    <div>
      <HeaderSection />
      <div className="my-3">
        <CardSection />
      </div>

      <JobSelectionSection />
      <div className="my-7">
        <PartsAndComponents />
      </div>
      <LabourSection />
      <div className="my-3">
        <AdditionalCharges />
      </div>
      <InvoiceSummary />
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
