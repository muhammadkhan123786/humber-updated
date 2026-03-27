import NotificationEngine from "../../notification-engine/notification.engine";

export const createTicketNotificationController = async (req, res) => {

  const {ticket} = await req.body;

  await NotificationEngine.trigger({
    eventKey: "TICKET_CREATED",
    payload: {
      ticketNumber: ticket.ticketNumber,
      customerName: ticket.customerName,
      email: ticket.email,
      phone: ticket.phone,
      status: ticket.status
    }
  });

  res.json(ticket);
};