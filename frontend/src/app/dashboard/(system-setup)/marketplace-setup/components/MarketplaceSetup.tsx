'use client'
import { useState } from 'react';
import { toast } from 'sonner';

// Data
import {
  DEFAULT_MARKETPLACES,
  initialFormData,
  type FormData
} from '../data/marketplaceTemplates';

// Hooks
import { useMarketplaceTemplates } from '@/hooks/useMarketplaceTemplates';

// Components
import { MarketplaceHeader } from '../components/MarketplaceHeader';
import { StatsGrid } from '../components/StatsGrid';
import { MarketplaceTable } from '../components/MarketplaceTable';
import { AddEditDialog } from '../components/AddEditDialog';
import { DeleteDialog } from '../components/DeleteDialog';

export default function MarketplaceSetup() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  
  const {
    marketplaces,
    editingMarketplace,
    deletingMarketplace,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    toggleActive,
    setAsDefault,
    saveMarketplace,
    deleteMarketplace,
    handleAddMarketplace,
    handleEditMarketplace,
    handleDeleteMarketplace,
    closeAddDialog,
    closeEditDialog,
    closeDeleteDialog
  } = useMarketplaceTemplates(DEFAULT_MARKETPLACES);

  const handleSubmit = () => {
    const success = saveMarketplace(formData);
    if (success) {
      setFormData(initialFormData);
    }
  };

  const handleEditClick = (marketplace: typeof DEFAULT_MARKETPLACES[0]) => {
    handleEditMarketplace(marketplace);
    setFormData({
      name: marketplace.name,
      code: marketplace.code,
      description: marketplace.description,
      color: marketplace.color,
      icon: marketplace.icon,
      fields: [...marketplace.fields],
      isActive: marketplace.isActive,
      isDefault: marketplace.isDefault
    });
  };

  return (
    <div className="space-y-6">
      <MarketplaceHeader onAddMarketplace={handleAddMarketplace} />
      
      <StatsGrid marketplaces={marketplaces} />
      
      <MarketplaceTable
        marketplaces={marketplaces}
        onEdit={handleEditClick}
        onDelete={handleDeleteMarketplace}
        onToggleActive={toggleActive}
        onSetDefault={setAsDefault}
      />
      
      <AddEditDialog
        isOpen={isAddDialogOpen || isEditDialogOpen}
        isEdit={isEditDialogOpen}
        formData={formData}
        onClose={isEditDialogOpen ? closeEditDialog : closeAddDialog}
        onSubmit={handleSubmit}
        onFormChange={setFormData}
      />
      
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        marketplace={deletingMarketplace}
        onClose={closeDeleteDialog}
        onConfirm={deleteMarketplace}
      />
    </div>
  );
}

// Export for use in other components
export { DEFAULT_MARKETPLACES as marketplaceTemplates };
export type { MarketplaceTemplate } from '../data/marketplaceTemplates';