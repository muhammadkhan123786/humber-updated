'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  Marketplace,
  FormData,
  initialFormData,
  MarketplaceTemplate,
} from '../data/marketplaceData';

import { useMarketplaces, useCreateMarketplace } from '../hooks/useMarketplace';
import { useFormActions } from '@/hooks/useFormActions';

import { DashboardHeader } from './DashboardHeader';
import { StatsGrid } from './StatsGrid';
import { AddEditDialog } from './AddEditDialog';

export default function MarketplaceConnections() {
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  /* =========================
     MARKETPLACES
  ========================= */
  const { data: marketplacesData = [] } = useMarketplaces();
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);

  useEffect(() => {
    setMarketplaces(marketplacesData);
  }, [marketplacesData]);

  /* =========================
     TEMPLATES
  ========================= */
  const { data: templates } = useFormActions<MarketplaceTemplate>(
    '/marketplace-templates',
    'marketplaceTemplates',
    'MarketplaceTemplates'
  );

  const createMarketplaceMutation = useCreateMarketplace();

  /* =========================
     SAVE MARKETPLACE
  ========================= */
  const saveMarketplace = () => {
    const template = templates?.find(
      (t) => t._id === formData.type
    );

    if (!template) {
      toast.error('Please select a marketplace');
      return;
    }

    const credentials: Record<string, string> = {};

    const missingFields = template.fields.filter(
      (field) => !formData[field]
    );

    if (missingFields.length) {
      toast.error('Missing required fields', {
        description: missingFields.join(', '),
      });
      return;
    }

    template.fields.forEach((field) => {
      credentials[field] = formData[field];
    });

    createMarketplaceMutation.mutate({
      name: formData.name,
      templateId: template._id,
      description: formData.description,
      credentials,
      icon: template.icon._id,
      color: template.color._id,
    });

    setShowDialog(false);
    setFormData(initialFormData);
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