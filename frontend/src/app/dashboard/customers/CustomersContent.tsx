// app/dashboard/customers/CustomersContent.tsx
"use client";

import { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from 'react';
import { UserPlus } from 'lucide-react';
import { AddNewCustomerData, addNewCustomer, updateCustomer, deleteCustomer, type Customer } from '@/data/TestData';

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
    // State initialization with useMemo for better performance
    const initialFormData = useMemo(() => ({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        address: '',
        city: '',
        postCode: '',
       contactMethod: 'email' as 'email' | 'phone' | 'sms' | 'whatsapp',
        preferredLanguage: 'en',
        receiveUpdates: false,
        termsAccepted: false,
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        vehicleNumber: '',
        vehicleType: '',
        vehicleModel: '',
        vehicleColor: '',
        registrationDate: '',
    }), []);

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState(initialFormData);

    // Initialize customers state with actual data
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('all');

    // Simple action menu state
    const [actionMenu, setActionMenu] = useState({
        isOpen: false,
        customerId: null as string | null,
    });

    const modalRef = useRef<HTMLDivElement>(null);
    const [isClosing, setIsClosing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

    // Steps definition
    const steps = useMemo(() => [
        { id: 1, title: 'Personal Info' },
        { id: 2, title: 'Vehicle Registration' },
        { id: 3, title: 'Preferences' },
    ], []);

    // Load customers from TestData - only once
    useEffect(() => {
        console.log('Loading customers...', AddNewCustomerData.length);
        setCustomers([...AddNewCustomerData]);
    }, []);

    // Filtered customers - optimized with useMemo
    const filteredCustomers = useMemo(() => {
        console.log('Filtering customers...');
        console.log('Total customers:', customers.length);
        console.log('Search query:', searchQuery);
        console.log('Status filter:', statusFilter);
        console.log('Vehicle type filter:', vehicleTypeFilter);

        const result = customers.filter(customer => {
            // Search filter
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery ||
                customer.firstName.toLowerCase().includes(searchLower) ||
                customer.lastName.toLowerCase().includes(searchLower) ||
                customer.email.toLowerCase().includes(searchLower) ||
                customer.vehicleNumber.toLowerCase().includes(searchLower) ||
                customer.city.toLowerCase().includes(searchLower);

            // Status filter
            const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;

            // Vehicle type filter
            const matchesVehicleType = vehicleTypeFilter === 'all' || customer.vehicleType === vehicleTypeFilter;

            return matchesSearch && matchesStatus && matchesVehicleType;
        });

        console.log('Filtered result:', result.length);
        return result;
    }, [customers, searchQuery, statusFilter, vehicleTypeFilter]);

    // Debug: Log when filtered customers change
    useEffect(() => {
        console.log('Filtered customers updated:', filteredCustomers.length);
    }, [filteredCustomers]);

    // Helper functions with useCallback
    const getVehicleTypeLabel = useCallback((type: string): string => {
        const typeMap: Record<string, string> = {
            'car': 'Car',
            'motorcycle': 'Motorcycle',
            'truck': 'Truck',
            'suv': 'SUV',
            'van': 'Van',
            'bus': 'Bus'
        };
        return typeMap[type] || type;
    }, []);

    const getVehicleModelLabel = useCallback((model: string): string => {
        const modelMap: Record<string, string> = {
            'toyota_camry': 'Toyota Camry',
            'honda_civic': 'Honda Civic',
            'ford_f150': 'Ford F-150',
            'bmw_3series': 'BMW 3 Series',
            'mercedes_cclass': 'Mercedes C-Class',
            'audi_a4': 'Audi A4',
            'tesla_model3': 'Tesla Model 3',
            'hyundai_elantra': 'Hyundai Elantra',
            'kia_sportage': 'Kia Sportage',
            'other': 'Other Model'
        };
        return modelMap[model] || model;
    }, []);

    const getVehicleColorLabel = useCallback((color: string): string => {
        const colorMap: Record<string, string> = {
            'white': 'White',
            'black': 'Black',
            'silver': 'Silver',
            'gray': 'Gray',
            'red': 'Red',
            'blue': 'Blue',
            'green': 'Green',
            'yellow': 'Yellow',
            'brown': 'Brown',
            'other': 'Other'
        };
        return colorMap[color] || color;
    }, []);

    const getStatusIcon = useCallback((status: string) => {
        const color = status === 'active' ? 'green' :
            status === 'inactive' ? 'red' :
                status === 'pending' ? 'yellow' : 'gray';
        return <div className={`w-4 h-4 rounded-full bg-${color}-500`} />;
    }, []);

    // Modal functions
    const openModal = useCallback((mode: 'add' | 'edit' | 'view', customer?: Customer) => {
        console.time('openModal');

        if (mode === 'edit' && customer) {
            setSelectedCustomer(customer);
            setFormData({
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                mobileNumber: customer.mobileNumber,
                address: customer.address,
                city: customer.city,
                postCode: customer.postCode,
                contactMethod: customer.contactMethod,
                preferredLanguage: customer.preferredLanguage,
                receiveUpdates: customer.receiveUpdates,
                termsAccepted: true,
                ownerName: customer.ownerName,
                ownerEmail: customer.ownerEmail,
                ownerPhone: customer.ownerPhone,
                vehicleNumber: customer.vehicleNumber,
                vehicleType: customer.vehicleType,
                vehicleModel: customer.vehicleModel,
                vehicleColor: customer.vehicleColor,
                registrationDate: customer.registrationDate,
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

        console.timeEnd('openModal');
    }, [initialFormData]);

    const closeModal = useCallback(() => {
        setIsClosing(true);

        // ✅ Modal close hone ke baad filters reset karo
        setTimeout(() => {
            setShowModal(false);
            setCurrentStep(1);
            setFormData(initialFormData);
            setSelectedCustomer(null);
            setModalMode('add');
            setIsClosing(false);

            // Only reset filters if we were in add mode
            if (modalMode === 'add') {
                setStatusFilter('all');
                setVehicleTypeFilter('all');
                setSearchQuery('');
            }
        }, 300);
    }, [initialFormData, modalMode]);

    // Step navigation
    const nextStep = useCallback(() => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    }, [currentStep, steps.length]);

    const prevStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    }, [currentStep]);

    // Submit handler - optimized
    const handleSubmit = useCallback(() => {
        // Quick validation
        if (!formData.firstName || !formData.lastName || !formData.email) {
            alert('Please fill required fields');
            return;
        }

        try {
            if (modalMode === 'add') {
                const customerData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    mobileNumber: formData.mobileNumber,
                    address: formData.address,
                    city: formData.city,
                    postCode: formData.postCode,
                    contactMethod: formData.contactMethod as 'email' | 'phone' | 'sms' | 'whatsapp',
                    preferredLanguage: formData.preferredLanguage,
                    receiveUpdates: formData.receiveUpdates,
                    termsAccepted: formData.termsAccepted,
                    ownerName: formData.ownerName,
                    ownerEmail: formData.ownerEmail,
                    ownerPhone: formData.ownerPhone,
                    vehicleNumber: formData.vehicleNumber,
                    vehicleType: formData.vehicleType,
                    vehicleModel: formData.vehicleModel,
                    vehicleColor: formData.vehicleColor,
                    registrationDate: formData.registrationDate,
                };

                const newCustomer = addNewCustomer(customerData);
                setCustomers(prev => [...prev, newCustomer]);

                // ✅ IMPORTANT: Filters reset karo after adding new customer
                setStatusFilter('all');
                setVehicleTypeFilter('all');
                setSearchQuery('');

                alert(`Customer ${newCustomer.firstName} ${newCustomer.lastName} added successfully!`);

            } else if (modalMode === 'edit' && selectedCustomer) {
                const updatedCustomer = {
                    ...selectedCustomer,
                    ...formData,
                    updatedAt: new Date(),
                };

                updateCustomer(updatedCustomer);
                setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? updatedCustomer : c));
                alert(`Customer updated successfully!`);
            }

            closeModal();

        } catch (error) {
            console.error('Error saving customer:', error);
            alert(`Error ${modalMode === 'add' ? 'adding' : 'updating'} customer.`);
        }
    }, [formData, modalMode, selectedCustomer, closeModal]);

    // Action menu handlers
    const handleActionMenuClick = useCallback((event: React.MouseEvent, customerId: string) => {
        event.stopPropagation();
        setActionMenu({
            isOpen: true,
            customerId,
        });
    }, []);

    const handleDeleteClick = useCallback((customerId: string) => {
        setCustomerToDelete(customerId);
        setShowDeleteConfirm(true);
        setActionMenu({ isOpen: false, customerId: null });
    }, []);

    const confirmDelete = useCallback(() => {
        if (customerToDelete) {
            try {
                deleteCustomer(customerToDelete);
                setCustomers(prev => prev.filter(c => c.id !== customerToDelete));
                alert('Customer deleted successfully!');
            } catch (error) {
                console.error('Error deleting customer:', error);
                alert('Error deleting customer.');
            }
        }
        setShowDeleteConfirm(false);
        setCustomerToDelete(null);
    }, [customerToDelete]);

    return (
        <>
            {/* Main Content */}
            <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                        <p className="text-gray-600 mt-1">Manage your customer database</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <button
                            onClick={() => openModal('add')}
                            className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2 bg-[#FE6B1D] text-white rounded-lg hover:bg-[#FE6B1D]/90 transition-colors"
                        >
                            <UserPlus className="w-4 h-4" />
                            Add New Customer
                        </button>
                    </div>
                </div>

                {/* Filters and Search */}
                <Suspense fallback={<LoadingFallback />}>
                    <FiltersBar
                        searchQuery={searchQuery}
                        statusFilter={statusFilter}
                        vehicleTypeFilter={vehicleTypeFilter}
                        onSearchChange={setSearchQuery}
                        onStatusFilterChange={setStatusFilter}
                        onVehicleTypeFilterChange={setVehicleTypeFilter}
                        onResetFilters={() => {
                            setStatusFilter('all');
                            setVehicleTypeFilter('all');
                            setSearchQuery('');
                        }}
                    />

                    {/* Customers Table */}
                    <CustomerTable
                        customers={customers}
                        filteredCustomers={filteredCustomers}
                        searchQuery={searchQuery}
                        statusFilter={statusFilter}
                        vehicleTypeFilter={vehicleTypeFilter}
                        actionMenu={actionMenu}
                        onView={(customer) => openModal('view', customer)}
                        onEdit={(customer) => openModal('edit', customer)}
                        onAdd={() => openModal('add')}
                        onActionMenuClick={handleActionMenuClick}
                        onActionMenuClose={() => setActionMenu({ isOpen: false, customerId: null })}
                        onDelete={handleDeleteClick}
                        getVehicleTypeLabel={getVehicleTypeLabel}
                        getVehicleModelLabel={getVehicleModelLabel}
                        getVehicleColorLabel={getVehicleColorLabel}
                    />
                </Suspense>
            </div>

            {/* Delete Confirmation Modal */}
            <Suspense fallback={null}>
                <DeleteConfirmation
                    isOpen={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={confirmDelete}
                />
            </Suspense>

            {/* Add/Edit/View Modal */}
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
                    getVehicleTypeLabel={getVehicleTypeLabel}
                    getVehicleModelLabel={getVehicleModelLabel}
                    getVehicleColorLabel={getVehicleColorLabel}
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