import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { MarketplaceTemplate, FormData } from  '../app/dashboard/(system-setup)/marketplace-setup/data/marketplaceTemplates';;

export function useMarketplaceTemplates(initialMarketplaces: MarketplaceTemplate[]) {
  const [marketplaces, setMarketplaces] = useState<MarketplaceTemplate[]>(initialMarketplaces);
  const [editingMarketplace, setEditingMarketplace] = useState<MarketplaceTemplate | null>(null);
  const [deletingMarketplace, setDeletingMarketplace] = useState<MarketplaceTemplate | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const toggleActive = useCallback((marketplace: MarketplaceTemplate) => {
    setMarketplaces(prev => prev.map(m =>
      m.id === marketplace.id
        ? { ...m, isActive: !m.isActive }
        : m
    ));
    toast.success(`${marketplace.name} is now ${!marketplace.isActive ? 'active' : 'inactive'}`);
  }, []);

  const setAsDefault = useCallback((marketplace: MarketplaceTemplate) => {
    setMarketplaces(prev => prev.map(m => ({
      ...m,
      isDefault: m.id === marketplace.id
    })));
    toast.success(`${marketplace.name} set as default marketplace`);
  }, []);

  const saveMarketplace = useCallback((formData: FormData) => {
    if (!formData.name || !formData.code) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (editingMarketplace) {
      // If setting as default, remove default from others
      let updatedMarketplaces = marketplaces;
      if (formData.isDefault) {
        updatedMarketplaces = marketplaces.map(m => ({
          ...m,
          isDefault: m.id === editingMarketplace.id
        }));
      }

      // Update existing marketplace
      setMarketplaces(updatedMarketplaces.map(m =>
        m.id === editingMarketplace.id
          ? {
              ...m,
              name: formData.name,
              code: formData.code,
              description: formData.description,
              color: formData.color,
              icon: formData.icon,
              fields: formData.fields,
              isActive: formData.isActive,
              isDefault: formData.isDefault
            }
          : m
      ));
      toast.success(`${formData.name} has been updated`);
      setIsEditDialogOpen(false);
      return true;
    } else {
      // If setting as default, remove default from others
      let updatedMarketplaces = marketplaces;
      if (formData.isDefault) {
        updatedMarketplaces = marketplaces.map(m => ({
          ...m,
          isDefault: false
        }));
      }

      // Add new marketplace
      const newMarketplace: MarketplaceTemplate = {
        id: Date.now().toString(),
        name: formData.name,
        code: formData.code.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        color: formData.color,
        icon: formData.icon,
        fields: formData.fields,
        isActive: formData.isActive,
        isDefault: formData.isDefault,
        createdAt: new Date()
      };

      setMarketplaces([...updatedMarketplaces, newMarketplace]);
      toast.success(`${formData.name} has been added`);
      setIsAddDialogOpen(false);
      return true;
    }
  }, [editingMarketplace, marketplaces]);

  const deleteMarketplace = useCallback(() => {
    if (deletingMarketplace) {
      setMarketplaces(prev => prev.filter(m => m.id !== deletingMarketplace.id));
      toast.success(`${deletingMarketplace.name} has been deleted`);
      setIsDeleteDialogOpen(false);
      setDeletingMarketplace(null);
    }
  }, [deletingMarketplace]);

  const handleAddMarketplace = useCallback(() => {
    setIsAddDialogOpen(true);
  }, []);

  const handleEditMarketplace = useCallback((marketplace: MarketplaceTemplate) => {
    setEditingMarketplace(marketplace);
    setIsEditDialogOpen(true);
  }, []);

  const handleDeleteMarketplace = useCallback((marketplace: MarketplaceTemplate) => {
    setDeletingMarketplace(marketplace);
    setIsDeleteDialogOpen(true);
  }, []);

  const closeAddDialog = useCallback(() => {
    setIsAddDialogOpen(false);
  }, []);

  const closeEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    setEditingMarketplace(null);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setDeletingMarketplace(null);
  }, []);

  return {
    marketplaces,
    activeMarketplaces: marketplaces.filter(m => m.isActive),
    defaultMarketplace: marketplaces.find(m => m.isDefault),
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
  };
}