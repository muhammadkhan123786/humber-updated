'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Data
import {
  Marketplace,
  INITIAL_MARKETPLACES,
  MARKETPLACE_TEMPLATES,
  FormData,
  initialFormData
} from '../data/marketplaceData';

// Components
import { AnimatedBackground } from './AnimatedBackground';
import { DashboardHeader } from './DashboardHeader';
import { StatsGrid } from './StatsGrid';
import { MarketplaceCard } from './MarketplaceCard';
import { AddEditDialog } from './AddEditDialog';
import { DeleteDialog } from './DeleteDialog';

export default function MarketplaceConnections() {
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>(INITIAL_MARKETPLACES);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState<Marketplace | null>(null);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [syncingMarketplace, setSyncingMarketplace] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Calculate stats
  const totalSales = marketplaces.reduce((sum, m) => sum + (m.totalSales || 0), 0);
  const totalListings = marketplaces.reduce((sum, m) => sum + (m.activeListings || 0), 0);
  const totalPending = marketplaces.reduce((sum, m) => sum + (m.pendingOrders || 0), 0);
  const total24hRevenue = marketplaces.reduce((sum, m) => sum + (m.revenue24h || 0), 0);
  const connectedCount = marketplaces.filter(m => m.status === 'connected').length;

  // Event handlers
  const handleAddMarketplace = () => {
    setFormData(initialFormData);
    setShowAddDialog(true);
  };

  const handleEditMarketplace = (marketplace: Marketplace) => {
    setSelectedMarketplace(marketplace);
    setFormData({
      name: marketplace.name,
      type: marketplace.type,
      apiKey: marketplace.apiKey || '',
      apiSecret: marketplace.apiSecret || '',
      shopUrl: marketplace.shopUrl || '',
      accessToken: marketplace.accessToken || '',
      marketplaceId: '',
      description: marketplace.description
    });
    setShowEditDialog(true);
  };

  const handleDeleteMarketplace = (marketplace: Marketplace) => {
    setSelectedMarketplace(marketplace);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedMarketplace) {
      setMarketplaces(marketplaces.filter(m => m.id !== selectedMarketplace.id));
      toast.success(`${selectedMarketplace.name} has been removed`, {
        description: 'Marketplace connection deleted successfully'
      });
      setShowDeleteDialog(false);
      setSelectedMarketplace(null);
    }
  };

  const saveMarketplace = () => {
    const template = MARKETPLACE_TEMPLATES.find(t => t.type === formData.type);
    
    if (showEditDialog && selectedMarketplace) {
      // Update existing marketplace
      setMarketplaces(marketplaces.map(m => 
        m.id === selectedMarketplace.id 
          ? {
              ...m,
              name: formData.name,
              apiKey: formData.apiKey || m.apiKey,
              apiSecret: formData.apiSecret || m.apiSecret,
              shopUrl: formData.shopUrl || m.shopUrl,
              accessToken: formData.accessToken || m.accessToken,
              description: formData.description,
              status: 'disconnected' as const
            }
          : m
      ));
      toast.success(`${formData.name} has been updated`, {
        description: 'Please test connection to activate'
      });
      setShowEditDialog(false);
    } else {
      // Add new marketplace
      const newMarketplace: Marketplace = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        status: 'disconnected',
        apiKey: formData.apiKey,
        apiSecret: formData.apiSecret,
        shopUrl: formData.shopUrl,
        accessToken: formData.accessToken,
        pendingOrders: 0,
        revenue24h: 0,
        growth: 0,
        color: template?.color || 'from-gray-400 to-gray-600',
        icon: template?.icon || '🏪',
        description: formData.description
      };
      
      setMarketplaces([...marketplaces, newMarketplace]);
      toast.success(`${formData.name} has been added`, {
        description: 'Configure and test connection to get started'
      });
      setShowAddDialog(false);
    }
    
    setSelectedMarketplace(null);
  };

  const testConnection = async (marketplace: Marketplace) => {
    setTestingConnection(marketplace.id);
    
    // Simulate API connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Randomly simulate success or failure for demo
    const success = Math.random() > 0.3;
    
    if (success) {
      setMarketplaces(marketplaces.map(m => 
        m.id === marketplace.id 
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
        m.id === marketplace.id 
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

    setSyncingMarketplace(marketplace.id);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setMarketplaces(marketplaces.map(m => 
      m.id === marketplace.id 
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
  };

  return (
    <div className="space-y-6">
      <AnimatedBackground />

      <DashboardHeader onAddMarketplace={handleAddMarketplace} />

      <StatsGrid
        connectedCount={connectedCount}
        totalSales={totalSales}
        totalListings={totalListings}
        total24hRevenue={total24hRevenue}
        totalPending={totalPending}
      />

      {/* Marketplaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {marketplaces.map((marketplace, index) => (
            <MarketplaceCard
              key={marketplace.id}
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

      {/* Add/Edit Dialog */}
      <AddEditDialog
        isOpen={showAddDialog || showEditDialog}
        isEdit={showEditDialog}
        formData={formData}
        onClose={() => {
          setShowAddDialog(false);
          setShowEditDialog(false);
          setSelectedMarketplace(null);
        }}
        onSubmit={saveMarketplace}
        onFormChange={setFormData}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        marketplace={selectedMarketplace}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}