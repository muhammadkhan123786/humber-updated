"use client";
import { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from 'react';
import { UserPlus } from 'lucide-react';
import { customerApi } from '@/lib/api';
import { type Customer } from '../customers/components/types';

// Lazy load components
const CustomerModal = lazy(() => import('./components/CustomerModal/CustomerModal'));
const FiltersBar = lazy(() => import('./components/CustomerTable/FiltersBar'));
const CustomerTable = lazy(() => import('./components/CustomerTable/CustomerTable'));
const DeleteConfirmation = lazy(() => import('./components/CustomerModal/DeleteConfirmation'));

const LoadingFallback = () => (
    <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FE6B1D]"></div>
    </div>
);

export default function CustomersContent() {
    // 1. Initial State - Vehicles list khtm kar di gayi hai
    const initialFormData = useMemo(() => ({
        customerType: 'domestic',
        firstName: '',
        lastName: '',
        emailId: '',
        mobileNumber: '',
        address: '',
        city: '',
        zipCode: '',
        country: '',
        companyName: '',
        registrationNo: '',
        vatNo: '',
        website: '',
        contactMethod: 'email' as 'email' | 'phone' | 'sms' | 'whatsapp',
        status: 'active'
    }), []);

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState(initialFormData);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isClosing, setIsClosing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
    const [actionMenu, setActionMenu] = useState({
        isOpen: false,
        customerId: null as string | null,
    });

    const modalRef = useRef<HTMLDivElement>(null);

    const fetchCustomers = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const data = await customerApi.getAll();
            setCustomers(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError('Failed to load customers');
            setCustomers([]);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // Filter Logic - Vehicle Make filter remove kar diya gaya hai
    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery ||
                customer.firstName.toLowerCase().includes(searchLower) ||
                customer.lastName.toLowerCase().includes(searchLower) ||
                customer.email.toLowerCase().includes(searchLower) ||
                (customer.city && customer.city.toLowerCase().includes(searchLower));

            const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [customers, searchQuery, statusFilter]);

    const openModal = useCallback((mode: 'add' | 'edit' | 'view', customer?: Customer) => {
        if ((mode === 'edit' || mode === 'view') && customer) {
            setSelectedCustomer(customer);
            setFormData({ 
                ...initialFormData, 
                ...customer,
                emailId: customer.email, // Map email to emailId for form
            });
        } else {
            setFormData(initialFormData);
            setSelectedCustomer(null);
        }
        setModalMode(mode);
        setShowModal(true);
        setIsClosing(false);
    }, [initialFormData]);

    const closeModal = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setShowModal(false);
            setFormData(initialFormData);
            setSelectedCustomer(null);
            setIsClosing(false);
        }, 300);
    }, [initialFormData]);

    const handleSubmit = useCallback(async () => {
        if (!formData.firstName || !formData.emailId || !formData.zipCode) {
        alert('Please fill in all required fields (Name, Email, and Post Code)');
        return;
    }

        try {
            if (modalMode === 'add') {
                await customerApi.create(formData);
            } else if (modalMode === 'edit' && selectedCustomer) {
                const { id, ...updateData } = formData as any;
                await customerApi.update(selectedCustomer.id!, updateData);
            }
            await fetchCustomers(false);
            closeModal();
        } catch (error) {
            console.error('Error saving customer:', error);
            alert('Error saving customer.');
        }
    }, [formData, modalMode, selectedCustomer, closeModal, fetchCustomers]);

    const handleActionMenuClick = useCallback((event: React.MouseEvent, customerId: string) => {
        event.stopPropagation();
        setActionMenu(prev => ({
            isOpen: prev.customerId === customerId ? !prev.isOpen : true,
            customerId: customerId,
        }));
    }, []);

    const handleDeleteClick = useCallback((customerId: string) => {
        setCustomerToDelete(customerId);
        setShowDeleteConfirm(true);
        setActionMenu({ isOpen: false, customerId: null });
    }, []);

    const confirmDelete = useCallback(async () => {
        if (customerToDelete) {
            try {
                await customerApi.delete(customerToDelete);
                await fetchCustomers(false);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        setShowDeleteConfirm(false);
        setCustomerToDelete(null);
    }, [customerToDelete, fetchCustomers]);

    return (
        <>
            <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                        <p className="text-gray-600 mt-1">Manage your customer database</p>
                    </div>
                    <button
                        onClick={() => openModal('add')}
                        className="flex items-center gap-2 px-4 py-2 bg-[#FE6B1D] text-white rounded-lg hover:bg-[#FE6B1D]/90 transition-all shadow-sm"
                        disabled={loading}
                    >
                        <UserPlus className="w-4 h-4" />
                        Add New Customer
                    </button>
                </div>

                {loading && !customers.length ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FE6B1D]"></div>
                        <span className="mt-4 text-gray-500 font-medium">Loading customers...</span>
                    </div>
                ) : (
                    <Suspense fallback={<LoadingFallback />}>
                        <FiltersBar
                            searchQuery={searchQuery}
                            statusFilter={statusFilter}
                            onSearchChange={setSearchQuery}
                            onStatusFilterChange={setStatusFilter}
                            onResetFilters={() => {
                                setStatusFilter('all');
                                setSearchQuery('');
                            }}
                        />

                        <CustomerTable
                            customers={customers}
                            filteredCustomers={filteredCustomers}
                            actionMenu={actionMenu}
                            onView={(customer) => openModal('view', customer)}
                            onEdit={(customer) => openModal('edit', customer)}
                            onActionMenuClick={handleActionMenuClick}
                            onDelete={handleDeleteClick}
                            onActionMenuClose={() => setActionMenu({ isOpen: false, customerId: null })}
                        />
                    </Suspense>
                )}
            </div>

            <Suspense fallback={null}>
                <DeleteConfirmation
                    isOpen={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={confirmDelete}
                />
                
                <CustomerModal
                    isOpen={showModal}
                    isClosing={isClosing}
                    modalMode={modalMode}
                    formData={formData}
                    selectedCustomer={selectedCustomer}
                    modalRef={modalRef}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    onPersonalInfoChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                    onEdit={() => selectedCustomer && openModal('edit', selectedCustomer)}
                />
            </Suspense>
        </>
    );
}