// hooks/useMarketplaceTemplates.ts
"use client"

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  MarketplaceTemplate,
  FormData,
} from "../app/dashboard/(system-setup)/marketplace-setup/data/marketplaceTemplates";

import {
  fetchMarketplaceTemplates,
  createMarketplaceTemplate,
  updateMarketplaceTemplate,
  deleteMarketplaceTemplate,
  toggleMarketplaceTemplateActive, // NEW
  setMarketplaceTemplateDefault,   // NEW
  bulkUpdateMarketplaceTemplates,  // NEW
} from "../helper/marketplaceTemplates.api";

import { DropdownService  } from "../helper/dropdown.service";
import { ColorDropdownOption, IconDropdownOption } from "../helper/dropdown.service";

export function useMarketplaceTemplates() {
  const [marketplaces, setMarketplaces] = useState<MarketplaceTemplate[]>([]);
  const [colors, setColors] = useState<ColorDropdownOption[]>([]);
  const [icons, setIcons] = useState<IconDropdownOption[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingMarketplace, setEditingMarketplace] = useState<MarketplaceTemplate | null>(null);
  const [deletingMarketplace, setDeletingMarketplace] = useState<MarketplaceTemplate | null>(null);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  /* ---------------- FETCH ON LOAD ---------------- */
  useEffect(() => {
    loadMarketplaces();
  }, []);

  const loadMarketplaces = async () => {
    try {
      setLoading(true);
      const data = await fetchMarketplaceTemplates();
      setMarketplaces(data);
    } catch (err) {
      toast.error("Failed to load marketplaces");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- GET COLORS AND ICONS ---------------- */
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const { colors, icons } = await DropdownService.fetchColorsAndIcons();
        console.log("icons", icons);
        setColors(colors);
        setIcons(icons);
      } catch (error) {
        console.error("Failed to load dropdowns", error);
      }
    };

    loadDropdowns();
  }, []);

  /* ---------------- UPDATED: TOGGLE ACTIVE ---------------- */
  const toggleActive = useCallback(async (marketplace: MarketplaceTemplate) => {
    try {
      const result = await toggleMarketplaceTemplateActive(marketplace._id);
      
      if (result.success) {
        // Update local state
        setMarketplaces(prev =>
          prev.map((m) =>
            m._id === marketplace._id
              ? { ...m, isActive: !m.isActive }
              : m
          )
        );
        
        toast.success(
          `${marketplace.name} is now ${
            !marketplace.isActive ? 'active' : 'inactive'
          }`
        );
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  }, []);

  /* ---------------- UPDATED: SET DEFAULT ---------------- */
  const setAsDefault = useCallback(async (marketplace: MarketplaceTemplate) => {
    try {
      const result = await setMarketplaceTemplateDefault(marketplace._id);
      
      if (result.success) {
        // Update local state: set this as default, others as not default
        setMarketplaces(prev =>
          prev.map((m) => ({
            ...m,
            isDefault: m._id === marketplace._id
          }))
        );
        
        toast.success(`${marketplace.name} set as default marketplace`);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to set as default");
    }
  }, []);

  /* ---------------- BULK TOGGLE ACTIVE ---------------- */
  const bulkToggleActive = useCallback(async (ids: string[], makeActive: boolean) => {
    try {
      const result = await bulkUpdateMarketplaceTemplates(ids, { 
        isActive: makeActive 
      });
      
      if (result.success) {
        // Update local state
        setMarketplaces(prev =>
          prev.map((m) =>
            ids.includes(m._id) ? { ...m, isActive: makeActive } : m
          )
        );
        
        toast.success(`${ids.length} marketplace(s) ${makeActive ? 'activated' : 'deactivated'}`);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update templates");
    }
  }, []);

/* ---------------- Prepare form data for api ---------------- */
const prepareFormDataForApi = (formData: FormData) => {
  return {
    name: formData.name,
    code: formData.code,
    description: formData.description || "",
    // Ensure we send ONLY the ID string
    color: formData.color, 
    // This MUST be the 24-char ObjectId stored in selectedIconId
    icon: formData.selectedIconId, 
    fields: formData.fields || [],
    isActive: formData.isActive,
    isDefault: formData.isDefault,
  };
};

/* ---------------- CREATE / UPDATE ---------------- */
const saveMarketplace = useCallback(
  async (formData: FormData) => {
    try {
      const apiPayload = prepareFormDataForApi(formData);
      
      if (editingMarketplace) {
        await updateMarketplaceTemplate(editingMarketplace._id, apiPayload);
        toast.success("Updated successfully");
      } else {
        const response = await createMarketplaceTemplate(apiPayload);
       
      }
      await loadMarketplaces(); 
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      return true;
    } catch (error: any) {
      console.error("Save error:", error);
      return false;
    }
  },
  [editingMarketplace, loadMarketplaces] // Dependencies are crucial here!
);

  /* ---------------- DELETE ---------------- */
  const deleteMarketplace = useCallback(async () => {
    if (!deletingMarketplace) return;

    try {
      await deleteMarketplaceTemplate(deletingMarketplace._id);
      toast.success(`${deletingMarketplace.name} has been deleted`);
      setIsDeleteDialogOpen(false);
      setDeletingMarketplace(null);
      await loadMarketplaces();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete marketplace");
    }
  }, [deletingMarketplace]);

  /* ---------------- DIALOG HANDLERS ---------------- */
  const handleAddMarketplace = () => setIsAddDialogOpen(true);

  const handleEditMarketplace = (marketplace: MarketplaceTemplate) => {
    setEditingMarketplace(marketplace);
    setIsEditDialogOpen(true);
  };

  const handleDeleteMarketplace = (marketplace: MarketplaceTemplate) => {
    setDeletingMarketplace(marketplace);
    setIsDeleteDialogOpen(true);
  };

  const closeAddDialog = () => setIsAddDialogOpen(false);

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingMarketplace(null);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingMarketplace(null);
  };

  return {
    marketplaces,
    loading,
    colors,
    icons,
    
    activeMarketplaces: marketplaces.filter((m) => m.isActive),
    defaultMarketplace: marketplaces.find((m) => m.isDefault),

    editingMarketplace,
    deletingMarketplace,

    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,

    // Actions
    toggleActive,
    setAsDefault,
    bulkToggleActive,
    saveMarketplace,
    deleteMarketplace,

    // Dialog handlers
    handleAddMarketplace,
    handleEditMarketplace,
    handleDeleteMarketplace,

    closeAddDialog,
    closeEditDialog,
    closeDeleteDialog,
  };
}