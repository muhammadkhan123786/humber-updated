"use client";
import { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from 'react';
import { UserPlus } from 'lucide-react';
import { customerApi,  } from '@/lib/api';
import { type Customer } from '../customers/components/types';
import { VehicleData } from '../customers/components/types';

// Lazy load heavy components
const CustomerModal = lazy(() => import('./components/CustomerModal/CustomerModal'));
const FiltersBar = lazy(() => import('./components/CustomerTable/FiltersBar'));
const CustomerTable = lazy(() => import('./components/CustomerTable/CustomerTable'));
const DeleteConfirmation = lazy(() => import('./components/CustomerModal/DeleteConfirmation'));

// Simple loading component
const LoadingFallback = () => (
    <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FE6B1D]"></div>
    </div>
);

export default function CustomersContent() {
    // 1. Initial State for Form
    const initialFormData = useMemo(() => ({
        customerType: 'domestic',
        country: '',
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        address: '',
        city: '',
        postCode: '',
        companyName: '',
        registrationNo: '',
        vatNo: '',
        website: '',
        contactMethod: 'email' as 'email' | 'phone' | 'sms' | 'whatsapp',
        preferredLanguage: 'en',
        receiveUpdates: false,
        termsAccepted: false,
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        vehicles: [] as VehicleData[], 
        issues: [] as Array<{ category: string; subIssues: string[] }>, 
        description: ''
    }), []);

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState(initialFormData);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [vehicleMakeFilter, setVehicleMakeFilter] = useState<string>('all');
    const [isClosing, setIsClosing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
    const [actionMenu, setActionMenu] = useState({
        isOpen: false,
        customerId: null as string | null,
    });

    const modalRef = useRef<HTMLDivElement>(null);

    const steps = useMemo(() => [
        { id: 1, title: 'Personal Info' },
        { id: 2, title: 'Vehicle Registration' },
        { id: 3, title: 'Preferences' },
    ], []);

    const fetchCustomers = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const data = await customerApi.getAll();
            setCustomers(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError('Failed to load customers');
            // Fallback to empty array
            setCustomers([]);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery ||
                customer.firstName.toLowerCase().includes(searchLower) ||
                customer.lastName.toLowerCase().includes(searchLower) ||
                customer.email.toLowerCase().includes(searchLower) ||
                customer.city.toLowerCase().includes(searchLower);

            const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
            const matchesVehicleMake = vehicleMakeFilter === 'all' ||
                (customer.vehicles && customer.vehicles.some(v => v.vehicleMake === vehicleMakeFilter));

            return matchesSearch && matchesStatus && matchesVehicleMake;
        });
    }, [customers, searchQuery, statusFilter, vehicleMakeFilter]);

    const getVehicleMakeLabel = useCallback((make: string): string => {
        const makeMap: Record<string, string> = {
            'toyota': 'Toyota', 'honda': 'Honda', 'ford': 'Ford', 'bmw': 'BMW',
            'mercedes': 'Mercedes-Benz', 'audi': 'Audi', 'tesla': 'Tesla',
            'hyundai': 'Hyundai', 'kia': 'Kia', 'nissan': 'Nissan',
            'volkswagen': 'Volkswagen', 'other': 'Other'
        };
        return makeMap[make] || make;
    }, []);

    const getStatusIcon = useCallback((status: string) => {
        const color = status === 'active' ? 'green' : status === 'inactive' ? 'red' : status === 'pending' ? 'yellow' : 'gray';
        return <div className={`w-4 h-4 rounded-full bg-${color}-500`} />;
    }, []);

    const openModal = useCallback((mode: 'add' | 'edit' | 'view', customer?: Customer) => {
        if (mode === 'edit' && customer) {
            setSelectedCustomer(customer);
            setFormData({
                ...initialFormData,
                ...customer,
                customerType: (customer as any).customerType || 'domestic',
                companyName: (customer as any).companyName || '',
                registrationNo: (customer as any).registrationNo || '',
                vatNo: (customer as any).vatNo || '',
                website: (customer as any).website || '',
                issues: (customer as any).issues || [],
                description: (customer as any).description || "",
            });
        } else if (mode === 'view' && customer) {
            setSelectedCustomer(customer);
        } else {
            setFormData(initialFormData);
        }

        setModalMode(mode);
        setShowModal(true);
        setIsClosing(false);
        setCurrentStep(1);
    }, [initialFormData]);

    const closeModal = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setShowModal(false);
            setCurrentStep(1);
            setFormData(initialFormData);
            setSelectedCustomer(null);
            setModalMode('add');
            setIsClosing(false);
        }, 300);
    }, [initialFormData]);

    const nextStep = useCallback(() => {
        if (currentStep < steps.length) setCurrentStep(currentStep + 1);
    }, [currentStep, steps.length]);

    const prevStep = useCallback(() => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    }, [currentStep]);

    // --- UPDATED SUBMIT LOGIC ---
    const handleSubmit = useCallback(async () => {
        // Sirf basic fields check karein taake data save ho sake
        if (!formData.firstName) {
            alert('Please enter at least the First Name');
            return;
        }

        try {
            if (modalMode === 'add') {
                const customerData = {
                    ...formData,
                    // Default values for missing fields
                    vehicles: formData.vehicles || [],
                };

                await customerApi.create(customerData);
                await fetchCustomers(false);
            } else if (modalMode === 'edit' && selectedCustomer) {
                await customerApi.update(selectedCustomer.id!, formData);
                await fetchCustomers(false);
            }
            closeModal();
        } catch (error) {
            console.error('Error saving customer:', error);
            alert(`Error saving customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }, [formData, modalMode, selectedCustomer, closeModal]);

   const handleActionMenuClick = useCallback((event: React.MouseEvent, customerId: string) => {
    event.stopPropagation();
    event.preventDefault();
    
    setActionMenu(prev => ({
        // Agar pehle se wahi customer open hai to band kardo, warna naya kholo
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
                console.error('Error deleting customer:', error);
                alert(`Error deleting customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                        className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2 bg-[#FE6B1D] text-white rounded-lg hover:bg-[#FE6B1D]/90 transition-colors"
                        disabled={loading}
                    >
                        <UserPlus className="w-4 h-4" />
                        Add New Customer
                    </button>
                </div>

                {loading && (
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FE6B1D]"></div>
                        <span className="ml-2 text-gray-600">Loading customers...</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <Suspense fallback={<LoadingFallback />}>
                        <FiltersBar
                            searchQuery={searchQuery}
                            statusFilter={statusFilter}
                            vehicleMakeFilter={vehicleMakeFilter}
                            onSearchChange={setSearchQuery}
                            onStatusFilterChange={setStatusFilter}
                            onVehicleMakeFilterChange={setVehicleMakeFilter}
                            onResetFilters={() => {
                                setStatusFilter('all');
                                setVehicleMakeFilter('all');
                                setSearchQuery('');
                            }}
                        />

                        <CustomerTable
                            customers={customers}
                            filteredCustomers={filteredCustomers}
                            searchQuery={searchQuery}
                            statusFilter={statusFilter}
                            vehicleMakeFilter={vehicleMakeFilter}
                            actionMenu={actionMenu}
                            onView={(customer) => openModal('view', customer)}
                            onEdit={(customer) => openModal('edit', customer)}
                            onAdd={() => openModal('add')}
                            onActionMenuClick={handleActionMenuClick}
                            onActionMenuClose={() => setActionMenu({ isOpen: false, customerId: null })}
                            onDelete={handleDeleteClick}
                            getVehicleMakeLabel={getVehicleMakeLabel}
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
            </Suspense>

            <Suspense fallback={null}>
                <CustomerModal
                    isOpen={showModal}
                    isClosing={isClosing}
                    modalMode={modalMode}
                    currentStep={currentStep}
                    formData={formData}
                    selectedCustomer={selectedCustomer}
                    steps={steps}
                    modalRef={modalRef}
                    getVehicleMakeLabel={getVehicleMakeLabel}
                    getStatusIcon={getStatusIcon}
                    onClose={closeModal}
                    onNextStep={nextStep}
                    onPrevStep={prevStep}
                    onSubmit={handleSubmit}
                    onPersonalInfoChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                    onContactDetailsChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                    onPreferencesChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                    onEdit={() => selectedCustomer && openModal('edit', selectedCustomer)}
                />
            </Suspense>
        </>
    );
}