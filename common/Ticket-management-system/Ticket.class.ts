export enum TicketType {
    "Online Order",
    "Sales General Enquiry",
    "Service Repair"
}
export enum TicketStatus {
    OPEN,
    IN_REVIEW,
    AWAITING_CUSTOMER,
    AWAITING_PARTS,
    IN_PROGRESS,
    COMPLETED,
    CLOSED,
    CANCELLED
}

export enum Priority {
    "Urgent",
    "Normal"
}

export enum Staff {
    "Muhammad Imran",
    "Haider Ali"
}

export interface Note {
    notes: string
}
export interface Attachment {
    description: string;
    imageUrl: string;
}

export abstract class Ticket {
    /*
    id: string;
    customerId: string;
    type: TicketType;
    ticketStatus: TicketStatus;
    priority: Priority;
    assignedTo?: Staff;
    createdAt: Date;
    closedAt?: Date;
    notes?: Note[];
    attachments?: Attachment[];
*/


    abstract validateTicket(): void;
    abstract allowedActions(): string[];
    abstract handleAction(action: string): void;
    abstract allowedStatuses(): TicketStatus[];


}