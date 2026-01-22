import { motion } from 'framer-motion';
import { Shield, Sparkles, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/form/Dialog';
import { Button } from '@/components/form/CustomButton';
import { Input } from '@/components/form/Input';
import { Label } from '@/components/form/Label';
import { Textarea } from '@/components/form/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/form/Select';
import { FormData, MARKETPLACE_TEMPLATES } from '../data/marketplaceData';

interface AddEditDialogProps {
  isOpen: boolean;
  isEdit: boolean;
  formData: FormData;
  onClose: () => void;
  onSubmit: () => void;
  onFormChange: (data: FormData) => void;
}

export function AddEditDialog({
  isOpen,
  isEdit,
  formData,
  onClose,
  onSubmit,
  onFormChange
}: AddEditDialogProps) {
  const getRequiredFields = () => {
    const template = MARKETPLACE_TEMPLATES.find(t => t.type === formData.type);
    return template?.fields || [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {isEdit ? 'Edit Marketplace' : 'Add New Marketplace'}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Update marketplace connection details' 
              : 'Connect a new e-commerce marketplace to sync your inventory and orders'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Marketplace Type */}
          <div>
            <Label className="text-base font-semibold">Marketplace Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: any) => onFormChange({ ...formData, type: value })}
              disabled={isEdit}
            >
              <SelectTrigger className="border-2 focus:border-indigo-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ebay">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🛒</span>
                    <span>eBay</span>
                  </div>
                </SelectItem>
                <SelectItem value="amazon">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📦</span>
                    <span>Amazon</span>
                  </div>
                </SelectItem>
                <SelectItem value="etsy">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎨</span>
                    <span>Etsy</span>
                  </div>
                </SelectItem>
                <SelectItem value="shopify">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏪</span>
                    <span>Shopify</span>
                  </div>
                </SelectItem>
                <SelectItem value="custom">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌐</span>
                    <span>Custom Marketplace</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Marketplace Name */}
          <div>
            <Label className="text-base font-semibold">Marketplace Name</Label>
            <Input
              placeholder="e.g., My eBay Store"
              value={formData.name}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              className="border-2 focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-base font-semibold">Description</Label>
            <Textarea
              placeholder="Brief description of this marketplace..."
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              rows={2}
              className="border-2 focus:border-indigo-500"
            />
          </div>

          {/* Dynamic Fields Based on Type */}
          <div className="border-t-2 pt-4">
            <div className="flex items-center gap-2 mb-4 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border-2 border-purple-200">
              <Shield className="h-5 w-5 text-purple-600" />
              <Label className="text-lg font-bold text-purple-900">API Credentials</Label>
            </div>

            {(getRequiredFields().includes('apiKey') || formData.type === 'custom') && (
              <div className="mb-3">
                <Label className="text-sm font-semibold">API Key</Label>
                <Input
                  type="password"
                  placeholder="Enter API key..."
                  value={formData.apiKey}
                  onChange={(e) => onFormChange({ ...formData, apiKey: e.target.value })}
                  className="border-2 focus:border-purple-500"
                />
              </div>
            )}

            {(getRequiredFields().includes('apiSecret') || formData.type === 'custom') && (
              <div className="mb-3">
                <Label className="text-sm font-semibold">API Secret</Label>
                <Input
                  type="password"
                  placeholder="Enter API secret..."
                  value={formData.apiSecret}
                  onChange={(e) => onFormChange({ ...formData, apiSecret: e.target.value })}
                  className="border-2 focus:border-purple-500"
                />
              </div>
            )}

            {(getRequiredFields().includes('shopUrl') || formData.type === 'custom') && (
              <div className="mb-3">
                <Label className="text-sm font-semibold">Shop URL</Label>
                <Input
                  placeholder="e.g., yourstore.myshopify.com"
                  value={formData.shopUrl}
                  onChange={(e) => onFormChange({ ...formData, shopUrl: e.target.value })}
                  className="border-2 focus:border-purple-500"
                />
              </div>
            )}

            {(getRequiredFields().includes('accessToken') || formData.type === 'custom') && (
              <div className="mb-3">
                <Label className="text-sm font-semibold">Access Token</Label>
                <Input
                  type="password"
                  placeholder="Enter access token..."
                  value={formData.accessToken}
                  onChange={(e) => onFormChange({ ...formData, accessToken: e.target.value })}
                  className="border-2 focus:border-purple-500"
                />
              </div>
            )}

            {getRequiredFields().includes('marketplaceId') && (
              <div className="mb-3">
                <Label className="text-sm font-semibold">Marketplace ID</Label>
                <Input
                  placeholder="Enter marketplace ID..."
                  value={formData.marketplaceId}
                  onChange={(e) => onFormChange({ ...formData, marketplaceId: e.target.value })}
                  className="border-2 focus:border-purple-500"
                />
              </div>
            )}
          </div>

          {/* Help Text */}
          <motion.div 
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex gap-3">
              <Sparkles className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-bold mb-1 text-base">Getting API Credentials</p>
                <p className="text-blue-800">
                  Visit your {MARKETPLACE_TEMPLATES.find(t => t.type === formData.type)?.name || 'marketplace'} developer portal 
                  to generate API keys and access tokens. Keep these credentials secure and never share them.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-2"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            className="gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/50"
            disabled={!formData.name}
          >
            <Check className="h-4 w-4" />
            {isEdit ? 'Update' : 'Add'} Marketplace
            <Sparkles className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}