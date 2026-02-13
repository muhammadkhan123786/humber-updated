'use client'
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';

// Data
import {
  getInitialFormData,
  MarketplaceTemplate,
  FormData,
  ColorOption,
  IconOption
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
  const {
    marketplaces,
    editingMarketplace,
    deletingMarketplace,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    colors,
    icons,
    loading,
    toggleActive,
    setAsDefault,
    saveMarketplace,
    deleteMarketplace,
    handleAddMarketplace,
    handleEditMarketplace,
    handleDeleteMarketplace,
    closeAddDialog,
    closeEditDialog,
    closeDeleteDialog,
  } = useMarketplaceTemplates();

  const [formData, setFormData] = useState<FormData>(
    getInitialFormData(colors, icons)
  );

  console.log(formData)
  // Update formData when colors/icons are loaded
  useEffect(() => {
    if (colors.length > 0 || icons.length > 0) {
      setFormData(getInitialFormData(colors, icons));
    }
  }, [colors, icons]);

  const handleSubmit = async() => {
    const success = await saveMarketplace(formData);
    if (success) {
      setFormData(getInitialFormData(colors, icons));
    }
  };

 const handleEditClick = (marketplace: MarketplaceTemplate) => {
  handleEditMarketplace(marketplace);

 const colorId = typeof marketplace.color === 'object' 
    ? (marketplace.color as { _id: string })._id 
    : marketplace.color;

  const iconId = typeof marketplace.icon === 'object' 
    ? (marketplace.icon as { _id: string })._id 
    : marketplace.icon;
  const selectedColor = colors.find(c => c.value === colorId);
  const selectedIcon = icons.find(i => i.value === iconId);

  setFormData({
    name: marketplace.name,
    code: marketplace.code,
    description: marketplace.description || '',
    color: colorId, // Send ID to database
    colorCode: selectedColor?.colorCode || marketplace.colorCode || '#6366f1',
    icon: selectedIcon?.icon || '', // Send Base64 to <img> tag
    label: selectedIcon?.label || '',
    selectedIconId: iconId, // NEW field we must use for API
    fields: [...marketplace.fields],
    isActive: marketplace.isActive,
    isDefault: marketplace.isDefault,
  });
};

  const handleDialogClose = () => {
    if (isEditDialogOpen) {
      closeEditDialog();
    } else {
      closeAddDialog();
    }
    // Reset form data when closing
    setFormData(getInitialFormData(colors, icons));
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" richColors />
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
        onClose={handleDialogClose}
        onSubmit={handleSubmit}
        onFormChange={setFormData}
        colors={colors}
        icons={icons}
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
export type { MarketplaceTemplate } from '../data/marketplaceTemplates';