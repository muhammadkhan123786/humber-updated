"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Search, FileText, Calendar, User, Package, Edit, Info } from 'lucide-react';
import { fetchTechnicianTickets } from '@/services/ticketService';

interface Ticket {
    _id: string;
    ticketCode: string;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
    };
    vehicle: {
        serialNumber?: string;
        vehicleBrandId?: {
            _id: string;
            brandName: string;
        };
        vehicleModelId?: {
            _id: string;
            modelName: string;
        };
        vehicleType?: string;
        _id: string;
    };
    issue_Details: string;
    ticketStatus: string;
    priority: string;
    location: string;
    ticketSource?: string;
    assignedTechnician?: {
        _id: string;
        firstName: string;
        lastName: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface AvailableTicketsProps {
    onSelectTicket?: (ticket: Ticket) => void;
}

const AvailableTickets = ({ onSelectTicket }: AvailableTicketsProps) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        setIsLoading(true);
        try {
            const response = await fetchTechnicianTickets({ page: 1, limit: 1000 });
            console.log('All tickets from API:', response.tickets);
            console.log('Total tickets count:', response.tickets?.length);

            // Log all unique ticket statuses
            const statuses = response.tickets?.map((t: Ticket) => t.ticketStatus);
            console.log('All ticket statuses:', [...new Set(statuses)]);

            // Filter tickets available for quotation (exclude completed, cancelled, closed)
            const excludedStatuses = ['completed', 'cancelled', 'closed'];
            const availableTickets = response.tickets.filter(
                (ticket: Ticket) => {
                    const status = ticket.ticketStatus.toLowerCase();
                    console.log(`Ticket ${ticket.ticketCode} status:`, ticket.ticketStatus, 'lowercase:', status);
                    return !excludedStatuses.includes(status);
                }
            );
            console.log('Filtered available tickets:', availableTickets);
            console.log('Available tickets count:', availableTickets.length);
            setTickets(availableTickets);
        } catch (error) {
            console.error('Error loading tickets:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTickets = useMemo(() => {
        if (!searchQuery) return tickets;

        const query = searchQuery.toLowerCase();
        return tickets.filter(ticket =>
            ticket.ticketCode.toLowerCase().includes(query) ||
            ticket.customer.firstName.toLowerCase().includes(query) ||
            ticket.customer.lastName.toLowerCase().includes(query)
        );
    }, [tickets, searchQuery]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-b-2xl border-t-4 border-blue-500 shadow-lg p-6 pt-10 animate-slideUp">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="">
                        <FileText className="text-blue-600 w-5 h-5 " />
                    </div>
                    <h2 className=" font-medium text-gray-900 leading-none">Available Tickets - Created Status</h2>
                </div>
                <div className=" px-2 py-0.5 font-medium border border-gray-300 rounded-lg text-sm ">
                    {filteredTickets.length} tickets
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by ticket ID or customer name..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto  rounded-lg border border-gray-300">
                <table className="w-full">
                    <thead>
                        <tr className="bg-linear-to-r from-blue-500 to-indigo-500 text-white">
                            <th className="px-4 py-3 text-left text-sm font-semibold rounded-tl-lg">Ticket Number</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Created Date</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Customer Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Scooter Name</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold rounded-tr-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 ">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    Loading tickets...
                                </td>
                            </tr>
                        ) : filteredTickets.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    No tickets available for quotation
                                </td>
                            </tr>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4">
                                        {/* Added 'w-max' to prevent shrinking and 'px-3 py-1' for horizontal padding */}
                                        <div className="flex items-center justify-center rounded-full border border-gray-300 text-xs font-medium bg-blue-50 px-3 py-1 w-max">
                                            <span className="text-gray-900">{ticket.ticketCode}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center text-sm gap-2 text-gray-700">
                                            <Calendar size={16} className="text-gray-400" />
                                            <span>{formatDate(ticket.createdAt)}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <User size={16} className="text-gray-400" />
                                            <span className="font-medium">
                                                {ticket.customer.firstName} {ticket.customer.lastName}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Package size={16} className="text-gray-400" />
                                            <span>
                                                {ticket.vehicle.vehicleBrandId?.brandName || 'N/A'}{' '}
                                                {ticket.vehicle.vehicleModelId?.modelName || ''}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <button
                                            onClick={() => onSelectTicket?.(ticket)}
                                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap w-fit bg-linear-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg hover:from-green-600 hover:to-emerald-700"
                                        >
                                            <Edit size={16} />
                                            <span className='text-sm'>Create Quote</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Info Banner */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                    <Info size={16} className="text-blue-600" />
                    <p>
                        Showing tickets with <strong>"created"</strong>status only. Click "Create Quote" to generate a quotation for the selected ticket.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AvailableTickets;
