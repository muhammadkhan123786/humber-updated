import PurchaseOrderForm from "./components/PurchaseOrderForm";
import PurchaseOrderTabe from "./components/PurchaseOrderTable";
import Button from "@/components/Button";
import Header from "../components/pageHeader"
import { Printer, Save } from "lucide-react";

export default function PurchaseOrder() {
  return (
    <>
      <Header
        title="Good Receipt: GRN -2025-001"
        subtitle="Record incoming stock against purchase orders."
      >
        <div className="flex gap-2">
          <Button icon={Printer}>
            <span className="font-bold">Export</span>
          </Button>
          <Button icon={Save}>Create Order</Button>
        </div>
      </Header>
      <PurchaseOrderForm />
      <PurchaseOrderTabe />
    </>
  );
}
