import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/form/Dialog';
import { Button } from '@/components/form/CustomButton';
import { AlertCircle, Trash2 } from 'lucide-react';
import { MarketplaceTemplate } from '../data/marketplaceTemplates';

interface DeleteDialogProps {
  isOpen: boolean;
  marketplace: MarketplaceTemplate | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteDialog({ isOpen, marketplace, onClose, onConfirm }: DeleteDialogProps) {
  if (!marketplace) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Marketplace Type</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this marketplace type?
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${marketplace.color} flex items-center justify-center text-xl`}>
              {marketplace.icon}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{marketplace.name}</p>
              <p className="text-sm text-gray-600">{marketplace.code}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-900">
              This will only remove the marketplace type template. Existing marketplace connections will not be affected.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="gap-2 bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete Marketplace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}