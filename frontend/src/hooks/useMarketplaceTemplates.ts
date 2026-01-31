// import { useState, useCallback } from 'react';
// import { toast } from 'sonner';
// import { MarketplaceTemplate, FormData } from  '../app/dashboard/(system-setup)/marketplace-setup/data/marketplaceTemplates';;

// export function useMarketplaceTemplates(initialMarketplaces: MarketplaceTemplate[]) {
//   const [marketplaces, setMarketplaces] = useState<MarketplaceTemplate[]>(initialMarketplaces);
//   const [editingMarketplace, setEditingMarketplace] = useState<MarketplaceTemplate | null>(null);
//   const [deletingMarketplace, setDeletingMarketplace] = useState<MarketplaceTemplate | null>(null);
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

//   const toggleActive = useCallback((marketplace: MarketplaceTemplate) => {
//     setMarketplaces(prev => prev.map(m =>
//       m.id === marketplace.id
//         ? { ...m, isActive: !m.isActive }
//         : m
//     ));
//     toast.success(`${marketplace.name} is now ${!marketplace.isActive ? 'active' : 'inactive'}`);
//   }, []);

//   const setAsDefault = useCallback((marketplace: MarketplaceTemplate) => {
//     setMarketplaces(prev => prev.map(m => ({
//       ...m,
//       isDefault: m.id === marketplace.id
//     })));
//     toast.success(`${marketplace.name} set as default marketplace`);
//   }, []);

//   const saveMarketplace = useCallback((formData: FormData) => {
//     if (!formData.name || !formData.code) {
//       toast.error('Please fill in all required fields');
//       return false;
//     }

//     if (editingMarketplace) {
//       // If setting as default, remove default from others
//       let updatedMarketplaces = marketplaces;
//       if (formData.isDefault) {
//         updatedMarketplaces = marketplaces.map(m => ({
//           ...m,
//           isDefault: m.id === editingMarketplace.id
//         }));
//       }

//       // Update existing marketplace
//       setMarketplaces(updatedMarketplaces.map(m =>
//         m.id === editingMarketplace.id
//           ? {
//               ...m,
//               name: formData.name,
//               code: formData.code,
//               description: formData.description,
//               color: formData.color,
//               icon: formData.icon,
//               fields: formData.fields,
//               isActive: formData.isActive,
//               isDefault: formData.isDefault
//             }
//           : m
//       ));
//       toast.success(`${formData.name} has been updated`);
//       setIsEditDialogOpen(false);
//       return true;
//     } else {
//       // If setting as default, remove default from others
//       let updatedMarketplaces = marketplaces;
//       if (formData.isDefault) {
//         updatedMarketplaces = marketplaces.map(m => ({
//           ...m,
//           isDefault: false
//         }));
//       }

//       // Add new marketplace
//       const newMarketplace: MarketplaceTemplate = {
//         id: Date.now().toString(),
//         name: formData.name,
//         code: formData.code.toLowerCase().replace(/\s+/g, '-'),
//         description: formData.description,
//         color: formData.color,
//         icon: formData.icon,
//         fields: formData.fields,
//         isActive: formData.isActive,
//         isDefault: formData.isDefault,
//         createdAt: new Date()
//       };

//       setMarketplaces([...updatedMarketplaces, newMarketplace]);
//       toast.success(`${formData.name} has been added`);
//       setIsAddDialogOpen(false);
//       return true;
//     }
//   }, [editingMarketplace, marketplaces]);

//   const deleteMarketplace = useCallback(() => {
//     if (deletingMarketplace) {
//       setMarketplaces(prev => prev.filter(m => m.id !== deletingMarketplace.id));
//       toast.success(`${deletingMarketplace.name} has been deleted`);
//       setIsDeleteDialogOpen(false);
//       setDeletingMarketplace(null);
//     }
//   }, [deletingMarketplace]);

//   const handleAddMarketplace = useCallback(() => {
//     setIsAddDialogOpen(true);
//   }, []);

//   const handleEditMarketplace = useCallback((marketplace: MarketplaceTemplate) => {
//     setEditingMarketplace(marketplace);
//     setIsEditDialogOpen(true);
//   }, []);

//   const handleDeleteMarketplace = useCallback((marketplace: MarketplaceTemplate) => {
//     setDeletingMarketplace(marketplace);
//     setIsDeleteDialogOpen(true);
//   }, []);

//   const closeAddDialog = useCallback(() => {
//     setIsAddDialogOpen(false);
//   }, []);

//   const closeEditDialog = useCallback(() => {
//     setIsEditDialogOpen(false);
//     setEditingMarketplace(null);
//   }, []);

//   const closeDeleteDialog = useCallback(() => {
//     setIsDeleteDialogOpen(false);
//     setDeletingMarketplace(null);
//   }, []);

//   return {
//     marketplaces,
//     activeMarketplaces: marketplaces.filter(m => m.isActive),
//     defaultMarketplace: marketplaces.find(m => m.isDefault),
//     editingMarketplace,
//     deletingMarketplace,
//     isAddDialogOpen,
//     isEditDialogOpen,
//     isDeleteDialogOpen,
//     toggleActive,
//     setAsDefault,
//     saveMarketplace,
//     deleteMarketplace,
//     handleAddMarketplace,
//     handleEditMarketplace,
//     handleDeleteMarketplace,
//     closeAddDialog,
//     closeEditDialog,
//     closeDeleteDialog
//   };
// }

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
  
} from "../helper/marketplaceTemplates.api";

import { DropdownService  } from "../helper/dropdown.service";
import { ColorDropdownOption, IconDropdownOption } from "../helper/dropdown.service";

export function useMarketplaceTemplates() {
  const [marketplaces, setMarketplaces] = useState<MarketplaceTemplate[]>([]);
    const [colors, setColors] = useState<ColorDropdownOption[]>([]);
  const [icons, setIcons] = useState<IconDropdownOption[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingMarketplace, setEditingMarketplace] =
    useState<MarketplaceTemplate | null>(null);

  const [deletingMarketplace, setDeletingMarketplace] =
    useState<MarketplaceTemplate | null>(null);

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
      console.log("data", data);
      setMarketplaces(data);
    } catch (err) {
      toast.error("Failed to load marketplaces");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TOGGLE ACTIVE ---------------- */
  const toggleActive = useCallback(async (marketplace: MarketplaceTemplate) => {
    try {
      const updated = await updateMarketplaceTemplate(marketplace._id, {
        isActive: !marketplace.isActive,
      });

      setMarketplaces((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m))
      );

      toast.success(
        `${marketplace.name} is now ${
          !marketplace.isActive ? "active" : "inactive"
        }`
      );
    } catch {
      toast.error("Failed to update status");
    }
  }, []);

  /* ---------------- GET COLORS AND ICONS ---------------- */

   useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const { colors, icons } =
          await DropdownService.fetchColorsAndIcons();

        setColors(colors);
        setIcons(icons);
      } catch (error) {
        console.error("Failed to load dropdowns", error);
      } finally {
        setLoading(false);
      }
    };

    loadDropdowns();
  }, []);

 
  /* ---------------- SET DEFAULT ---------------- */
  const setAsDefault = useCallback(async (marketplace: MarketplaceTemplate) => {
    try {
      await Promise.all(
        marketplaces.map((m) =>
          updateMarketplaceTemplate(m._id, {
            isDefault: m._id === marketplace._id,
          })
        )
      );

      loadMarketplaces();
      toast.success(`${marketplace.name} set as default marketplace`);
    } catch {
      toast.error("Failed to set default marketplace");
    }
  }, [marketplaces]);

  /* ---------------- CREATE / UPDATE ---------------- */
  const saveMarketplace = useCallback(
    async (formData: FormData) => {
      if (!formData.name) {
        toast.error("Please fill in all required fields");
        return false;
      }

      try {
        if (editingMarketplace) {
          await updateMarketplaceTemplate(editingMarketplace._id, {
            ...formData,
          });

          toast.success(`${formData.name} has been updated`);
          setIsEditDialogOpen(false);
        } else {
          await createMarketplaceTemplate({
            ...formData,
            code: formData.code.toLowerCase().replace(/\s+/g, "-"),
          });

          toast.success(`${formData.name} has been added`);
          setIsAddDialogOpen(false);
        }

        await loadMarketplaces();
        return true;
      } catch {
        toast.error("Failed to save marketplace");
        return false;
      }
    },
    [editingMarketplace]
  );

  /* ---------------- DELETE ---------------- */
  const deleteMarketplace = useCallback(async () => {
    if (!deletingMarketplace) return;

    try {
      await deleteMarketplaceTemplate(deletingMarketplace._id);
      toast.success(`${deletingMarketplace.name} has been deleted`);
      setIsDeleteDialogOpen(false);
      setDeletingMarketplace(null);
      loadMarketplaces();
    } catch {
      toast.error("Failed to delete marketplace");
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
  };
}
