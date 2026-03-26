export const eventsData = [

  // ==============================
  // TICKET MODULE
  // ==============================

  {
    moduleKey: "ticket",
    actionKey: "create",
    eventKey: "TICKET_CREATED",
    name: "Ticket Created",
    description: "Triggered when a service ticket is created",
    variables: [
      { key: "ticketNumber", description: "Ticket Number" },
      { key: "customerName", description: "Customer Name" },
      { key: "email", description: "Customer Email" },
      { key: "phone", description: "Customer Phone" },
      { key: "status", description: "Ticket Status" }
    ]
  },

  {
    moduleKey: "ticket",
    actionKey: "assign",
    eventKey: "TICKET_ASSIGNED",
    name: "Ticket Assigned",
    description: "Triggered when ticket is assigned to technician",
    variables: [
      { key: "ticketNumber", description: "Ticket Number" },
      { key: "technicianName", description: "Technician Name" },
      { key: "customerName", description: "Customer Name" }
    ]
  },

  {
    moduleKey: "ticket",
    actionKey: "in-progress",
    eventKey: "TICKET_IN_PROGRESS",
    name: "Ticket In Progress",
    description: "Triggered when ticket moves to in progress",
    variables: [
      { key: "ticketNumber", description: "Ticket Number" },
      { key: "status", description: "Ticket Status" }
    ]
  },

  {
    moduleKey: "ticket",
    actionKey: "hold",
    eventKey: "TICKET_ON_HOLD",
    name: "Ticket On Hold",
    description: "Triggered when ticket is on hold",
    variables: [
      { key: "ticketNumber", description: "Ticket Number" },
      { key: "reason", description: "Hold Reason" }
    ]
  },

  {
    moduleKey: "ticket",
    actionKey: "complete",
    eventKey: "TICKET_COMPLETED",
    name: "Ticket Completed",
    description: "Triggered when ticket is completed",
    variables: [
      { key: "ticketNumber", description: "Ticket Number" },
      { key: "completedDate", description: "Completion Date" }
    ]
  },

  {
    moduleKey: "ticket",
    actionKey: "cancel",
    eventKey: "TICKET_CANCELLED",
    name: "Ticket Cancelled",
    description: "Triggered when ticket is cancelled",
    variables: [
      { key: "ticketNumber", description: "Ticket Number" },
      { key: "reason", description: "Cancel Reason" }
    ]
  },

  // ==============================
  // INVOICE MODULE
  // ==============================

  {
    moduleKey: "invoice",
    actionKey: "draft",
    eventKey: "INVOICE_DRAFT",
    name: "Invoice Draft",
    description: "Triggered when invoice is drafted",
    variables: [
      { key: "invoiceNumber", description: "Invoice Number" },
      { key: "customerName", description: "Customer Name" }
    ]
  },

  {
    moduleKey: "invoice",
    actionKey: "send",
    eventKey: "INVOICE_SENT",
    name: "Invoice Sent",
    description: "Triggered when invoice is sent",
    variables: [
      { key: "invoiceNumber", description: "Invoice Number" },
      { key: "customerName", description: "Customer Name" },
      { key: "amount", description: "Invoice Amount" },
      { key: "email", description: "Customer Email" }
    ]
  },

  {
    moduleKey: "invoice",
    actionKey: "partial-paid",
    eventKey: "INVOICE_PARTIALLY_PAID",
    name: "Invoice Partially Paid",
    description: "Triggered when invoice partially paid",
    variables: [
      { key: "invoiceNumber", description: "Invoice Number" },
      { key: "paidAmount", description: "Paid Amount" }
    ]
  },

  {
    moduleKey: "invoice",
    actionKey: "paid",
    eventKey: "INVOICE_PAID",
    name: "Invoice Fully Paid",
    description: "Triggered when invoice fully paid",
    variables: [
      { key: "invoiceNumber", description: "Invoice Number" },
      { key: "amount", description: "Amount" }
    ]
  },

  {
    moduleKey: "invoice",
    actionKey: "overdue",
    eventKey: "INVOICE_OVERDUE",
    name: "Invoice Overdue",
    description: "Triggered when invoice overdue",
    variables: [
      { key: "invoiceNumber", description: "Invoice Number" },
      { key: "dueDate", description: "Due Date" }
    ]
  },

  // ==============================
  // QUOTATION MODULE
  // ==============================

  {
    moduleKey: "quotation",
    actionKey: "create",
    eventKey: "QUOTATION_CREATED",
    name: "Quotation Created",
    description: "Triggered when quotation created",
    variables: [
      { key: "quotationNumber", description: "Quotation Number" },
      { key: "customerName", description: "Customer Name" }
    ]
  },

  {
    moduleKey: "quotation",
    actionKey: "send-to-customer",
    eventKey: "QUOTATION_SENT",
    name: "Quotation Sent",
    description: "Triggered when quotation sent",
    variables: [
      { key: "quotationNumber", description: "Quotation Number" },
      { key: "email", description: "Customer Email" }
    ]
  },

  {
    moduleKey: "quotation",
    actionKey: "accepted",
    eventKey: "QUOTATION_ACCEPTED",
    name: "Quotation Accepted",
    description: "Triggered when quotation accepted",
    variables: [
      { key: "quotationNumber", description: "Quotation Number" }
    ]
  },

  {
    moduleKey: "quotation",
    actionKey: "rejected",
    eventKey: "QUOTATION_REJECTED",
    name: "Quotation Rejected",
    description: "Triggered when quotation rejected",
    variables: [
      { key: "quotationNumber", description: "Quotation Number" }
    ]
  },

  {
    moduleKey: "quotation",
    actionKey: "expired",
    eventKey: "QUOTATION_EXPIRED",
    name: "Quotation Expired",
    description: "Triggered when quotation expired",
    variables: [
      { key: "quotationNumber", description: "Quotation Number" }
    ]
  },

  // ==============================
  // PURCHASE ORDER
  // ==============================

  {
    moduleKey: "purchase-order",
    actionKey: "create",
    eventKey: "PO_CREATED",
    name: "Purchase Order Created",
    description: "Triggered when purchase order created",
    variables: [
      { key: "poNumber", description: "PO Number" },
      { key: "supplierName", description: "Supplier Name" }
    ]
  },

  {
    moduleKey: "purchase-order",
    actionKey: "approved",
    eventKey: "PO_APPROVED",
    name: "Purchase Order Approved",
    description: "Triggered when PO approved",
    variables: [
      { key: "poNumber", description: "PO Number" }
    ]
  },

  {
    moduleKey: "purchase-order",
    actionKey: "sent-to-supplier",
    eventKey: "PO_SENT_TO_SUPPLIER",
    name: "PO Sent to Supplier",
    description: "Triggered when PO sent to supplier",
    variables: [
      { key: "poNumber", description: "PO Number" },
      { key: "supplierEmail", description: "Supplier Email" }
    ]
  },

  {
    moduleKey: "purchase-order",
    actionKey: "goods-received",
    eventKey: "PO_GOODS_RECEIVED",
    name: "Goods Received",
    description: "Triggered when goods received",
    variables: [
      { key: "poNumber", description: "PO Number" }
    ]
  },

  {
    moduleKey: "purchase-order",
    actionKey: "cancelled",
    eventKey: "PO_CANCELLED",
    name: "PO Cancelled",
    description: "Triggered when PO cancelled",
    variables: [
      { key: "poNumber", description: "PO Number" }
    ]
  },

  // ==============================
  // CUSTOMER
  // ==============================

  {
    moduleKey: "customer",
    actionKey: "customer-registered",
    eventKey: "CUSTOMER_REGISTERED",
    name: "Customer Registered",
    description: "Triggered when customer registered",
    variables: [
      { key: "customerName", description: "Customer Name" },
      { key: "email", description: "Customer Email" },
      { key: "phone", description: "Customer Phone" }
    ]
  }

];