import NotificationEngine from "../../notification-engine/notification.engine";

export const createTicketNotificationController = async (req, res) => {
  const { ticket } = await req.body;

  await NotificationEngine.trigger({
    eventKey: "TICKET_CREATED",
    payload: {
      ticketNumber: ticket.ticketNumber,
      customerName: ticket.customerName,
      email: ticket.email,
      phone: ticket.phone,
      status: ticket.status,
    },
  });

  res.json(ticket);
};

//customer create notificaton 
export const customerRegisterNotificationController = async (req, res) => {
  const { customer } = await req.body;

  await NotificationEngine.trigger({
    eventKey: "CUSTOMER_REGISTERED",
    payload: {
      customerName: customer.customerName,
      email: customer.email,
      phone:customer.phone
    },
  });
  res.json(customer);
};

//quotation create notification 
export const quotationCreateNotificationController = async (req, res) => {
  const { quotation } = await req.body;

  await NotificationEngine.trigger({
    eventKey: "QUOTATION_CREATED",
    payload: {
      quotationNumber: quotation.quotationNumber,
      customerName: quotation.customerName,
      email:quotation.email
    },
  });
  res.json(quotation);
};

//quotation create notification 
export const customerSendInvoiceNotificationController = async (req, res) => {
  const { invoice } = await req.body;

  await NotificationEngine.trigger({
    eventKey: "INVOICE_SENT",
    payload: {
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customerName,
      amount:invoice.amount,
      email:invoice.email
    },
  });
  res.json(invoice);
};