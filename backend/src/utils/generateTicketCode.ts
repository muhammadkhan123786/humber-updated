import { TicketSequenceCounter } from "../models/ticket-management-system-models/ticket.sequence.models";

export const generateTicketCode = async (): Promise<string> => {
  const year = new Date().getFullYear();

  const counter = await TicketSequenceCounter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  if (!counter) {
    throw new Error("Failed to generate ticket sequence");
  }
  console.log("counter", counter);
  return `TKT-${year}-${String(counter.seq).padStart(6, "0")}`;
};
