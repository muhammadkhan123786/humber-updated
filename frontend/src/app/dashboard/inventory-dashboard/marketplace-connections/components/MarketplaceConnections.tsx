'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Marketplace,
  FormData,
  initialFormData,
  MarketplaceTemplate,
} from '../data/marketplaceData';
import { MarketplaceCard } from "../components/MarketplaceCard"

import { useMarketplaces, useCreateMarketplace } from '../hooks/useMarketplace';
import { useFormActions } from '@/hooks/useFormActions';

import { DashboardHeader } from './DashboardHeader';
import { StatsGrid } from './StatsGrid';
import { AddEditDialog } from './AddEditDialog';

export default function MarketplaceConnections() {
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

    // const [marketplaces, setMarketplaces] = useState<Marketplace[]>(INITIAL_MARKETPLACES);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState<Marketplace | null>(null);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [syncingMarketplace, setSyncingMarketplace] = useState<string | null>(null);

  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);

 

  /* =========================
     TEMPLATES
  ========================= */
  const { data: templates } = useFormActions<MarketplaceTemplate>(
    '/marketplace',
    'marketplace',
    'Marketplace'
  );

  const marketplace = templates || [];
  console.log("data", marketplace);
  const createMarketplaceMutation = useCreateMarketplace();

  /* =========================
     SAVE MARKETPLACE
  ========================= */
const saveMarketplace = async () => {


  
   console.log("formData:", formData);
  

  const credentials: Record<string, string> = {};

  if(!formData.type){
    return toast.error("Select type")
  }


  try {
    const res = await createMarketplaceMutation.mutateAsync({
     type: formData.type,
      name: formData.name,
      description: formData.description,
      credentials: JSON.stringify(credentials),     
      
    });

    console.log("response", res);

    // setShowDialog(false);
    setFormData(initialFormData);

  } catch (error) {
    console.log("error", error);
  }
};


  const testConnection = async (marketplace: Marketplace) => {
    setTestingConnection(marketplace.id);
    
    // Simulate API connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Randomly simulate success or failure for demo
    const success = Math.random() > 0.3;
    
    if (success) {
      setMarketplaces(marketplaces.map(m => 
        m.id === marketplace._id 
          ? { 
              ...m, 
              status: 'connected', 
              lastSync: new Date(),
              totalSales: Math.random() * 50000 + 10000,
              activeListings: Math.floor(Math.random() * 150 + 50),
              pendingOrders: Math.floor(Math.random() * 20),
              revenue24h: Math.random() * 3000 + 500,
              growth: Math.random() * 20 - 5
            }
          : m
      ));
      toast.success(`Successfully connected to ${marketplace.name}! 🎉`, {
        description: 'API credentials verified and data synced.'
      });
    } else {
      setMarketplaces(marketplaces.map(m => 
        m.id === marketplace._id 
          ? { ...m, status: 'error' }
          : m
      ));
      toast.error(`Failed to connect to ${marketplace.name}`, {
        description: 'Please verify your API credentials and try again.'
      });
    }
    
    setTestingConnection(null);
  };

  const syncMarketplace = async (marketplace: Marketplace) => {
    if (marketplace.status !== 'connected') {
      toast.error('Cannot sync disconnected marketplace', {
        description: 'Please test connection first.'
      });
      return;
    }

    setSyncingMarketplace(marketplace._id);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setMarketplaces(marketplaces.map(m => 
      m._id === marketplace.id 
        ? { 
            ...m, 
            lastSync: new Date(),
            totalSales: (m.totalSales || 0) + Math.random() * 1000,
            pendingOrders: Math.floor(Math.random() * 20),
            revenue24h: Math.random() * 3000 + 500,
            growth: Math.random() * 20 - 5
          }
        : m
    ));
    
    toast.success(`${marketplace.name} synced successfully! ✨`, {
      description: 'Latest data has been updated'
    });
    
    setSyncingMarketplace(null);
  }
  const handleDeleteMarketplace = (marketplace: Marketplace) => {
    setSelectedMarketplace(marketplace);
    setShowDeleteDialog(true);
  };

  const handleEditMarketplace = (marketplace: Marketplace) => {
    setSelectedMarketplace(marketplace);
    // setFormData({
    //   name: marketplace.name,
    //   type: marketplace.type,
    //   apiKey: marketplace.apiKey || '',
    //   apiSecret: marketplace.apiSecret || '',
    //   shopUrl: marketplace.shopUrl || '',
    //   accessToken: marketplace.accessToken || '',
    //   marketplaceId: '',
    //   description: marketplace.description
    // });
    setShowEditDialog(true);
  };
  return (
    <div className="space-y-6">
      <DashboardHeader onAddMarketplace={() => setShowDialog(true)} />

      <StatsGrid
        connectedCount={marketplaces.length}
        totalSales={0}
        totalListings={0}
        totalPending={0}
        total24hRevenue={0}
      />

 {/* Marketplaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {marketplace.map((marketplace, index) => (
            <MarketplaceCard
             key={marketplace._id || marketplace.id || index}
              marketplace={marketplace}
              index={index}
              testingConnection={testingConnection}
              syncingMarketplace={syncingMarketplace}
              onTestConnection={testConnection}
              onSyncMarketplace={syncMarketplace}
              onEdit={handleEditMarketplace}
              onDelete={handleDeleteMarketplace}
            />
          ))}
        </AnimatePresence>
      </div>
      <AddEditDialog
        isOpen={showDialog}
        isEdit={false}
        formData={formData}
        onClose={() => setShowDialog(false)}
        onSubmit={saveMarketplace}
        onFormChange={setFormData}
      />
    </div>
  );
}