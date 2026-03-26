export const actionsData = [
  {
    moduleKey: "ticket",
    actions: [
      { actionKey: "create", name: "Ticket Created" },
      { actionKey: "assign", name: "Ticket Assigned" },
      { actionKey: "in-progress", name: "In Progress" },
      { actionKey: "hold", name: "On Hold" },
      { actionKey: "complete", name: "Completed" },
      { actionKey: "cancel", name: "Cancelled" }
    ]
  },
  {
    moduleKey: "invoice",
    actions: [
      { actionKey: "draft", name: "Draft" },
      { actionKey: "send", name: "Invoice Sent" },
      { actionKey: "partial-paid", name: "Partially Paid" },
      { actionKey: "paid", name: "Fully Paid" },
      { actionKey: "overdue", name: "Overdue" }
    ]
  },
    {
    moduleKey: "quotation",
    actions: [
      { actionKey: "create", name: "Quotation Created" },
      { actionKey: "send-to-customer", name: "Sent to Customer" },
      { actionKey: "accepted", name: "Accepted" },
      { actionKey: "Rejected", name: "Rejected" },
      { actionKey: "Expired", name: "Expired" }
    ]
  },
    {
    moduleKey: "purchase-order",
    actions: [
      { actionKey: "create", name: "PO Created" },
      { actionKey: "Approved", name: "Approved" },
      { actionKey: "sent-to-supplier", name: "Sent to Supplier" },
      { actionKey: "goods-received", name: "Goods Received" },
      { actionKey: "Cancelled", name: "cancelled" }
    ]
  },
  {
    moduleKey: "technician-job",
    actions: [
      { actionKey: "job-assigned", name: "Job Assigned" },
      { actionKey: "job-started", name: "Job Started" },
      { actionKey: "in-progress", name: "In progress" },
      { actionKey: "job-completed", name: "Job Completed" },
      { actionKey: "on-hold", name: "On Hold" }
    ]
  },
  {
    moduleKey: "delivery",
    actions: [
      { actionKey: "delivery-scheduled", name: "Delivery Scheduled" },
      { actionKey: "out-for-delivery", name: "Out for Delivery" },
      { actionKey: "delivered", name: "Delivered" },
      { actionKey: "delivery-failed", name: "Delivery Failed" },
      { actionKey: "returned", name: "Returned" }
    ]
  },
  {
    moduleKey: "customer",
    actions: [
      { actionKey: "customer-registered", name: "Customer Registered" },
      { actionKey: "account-verified", name: "Account Verified" },
      { actionKey: "account-suspended", name: "Account Suspended" },
    ]
  },
  {
    moduleKey: "call-log",
    actions: [
      { actionKey: "call-logged", name: "Call Logged" },
      { actionKey: "follow-up-scheduled", name: "Follow-up Scheduled" },
      { actionKey: "follow-up-completed", name: "Follow-up Completed" },
    ]
  }
];