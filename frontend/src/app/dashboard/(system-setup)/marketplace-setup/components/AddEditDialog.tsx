import { useState } from 'react';
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
import { Switch } from '@/components/form/Switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/form/Select';
import { Save } from 'lucide-react';
import { 
  FormData, 
  AVAILABLE_ICONS, 
  AVAILABLE_COLORS, 
  AVAILABLE_FIELDS 
} from '../data/marketplaceTemplates';

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
  const [fieldSearch, setFieldSearch] = useState('');

  const toggleFieldSelection = (field: string) => {
    if (formData.fields.includes(field)) {
      onFormChange({
        ...formData,
        fields: formData.fields.filter(f => f !== field)
      });
    } else {
      onFormChange({
        ...formData,
        fields: [...formData.fields, field]
      });
    }
  };

  const filteredFields = AVAILABLE_FIELDS.filter(field =>
    field.label.toLowerCase().includes(fieldSearch.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Marketplace Type' : 'Add New Marketplace Type'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update marketplace template configuration'
              : 'Create a new marketplace type that will be available when adding connections'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name */}
          <div>
            <Label>Marketplace Name <span className="text-red-500">*</span></Label>
            <Input
              placeholder="e.g., Amazon, eBay, Custom Store"
              value={formData.name}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Code */}
          <div>
            <Label>Marketplace Code <span className="text-red-500">*</span></Label>
            <Input
              placeholder="e.g., amazon, ebay, custom-store"
              value={formData.code}
              onChange={(e) => onFormChange({ 
                ...formData, 
                code: e.target.value.toLowerCase().replace(/\s+/g, '-') 
              })}
            />
            <p className="text-xs text-gray-500 mt-1">Unique identifier (lowercase, no spaces)</p>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              placeholder="Brief description of this marketplace..."
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          {/* Icon & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Icon</Label>
              <Select value={formData.icon} onValueChange={(value) => onFormChange({ ...formData, icon: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_ICONS.map(icon => (
                    <SelectItem key={icon} value={icon}>
                      <span className="text-2xl">{icon}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Color Theme</Label>
              <Select value={formData.color} onValueChange={(value) => onFormChange({ ...formData, color: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_COLORS.map((color, index) => (
                    <SelectItem key={color} value={color}>
                      <div className="flex items-center gap-2">
                        <div className={`h-4 w-16 rounded bg-gradient-to-r ${color}`}></div>
                        <span className="text-xs">Theme {index + 1}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <Label className="mb-2 block">Preview</Label>
            <div className={`bg-gradient-to-r ${formData.color} p-4 rounded-lg text-white`}>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{formData.icon}</div>
                <div>
                  <p className="font-semibold">{formData.name || 'Marketplace Name'}</p>
                  <p className="text-sm text-white/80">{formData.description || 'Description'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Required Fields */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Required API Fields</Label>
              <div className="text-xs text-gray-500">
                {formData.fields.length} field{formData.fields.length !== 1 ? 's' : ''} selected
              </div>
            </div>
            
            <div className="mb-2">
              <Input
                placeholder="Search fields..."
                value={fieldSearch}
                onChange={(e) => setFieldSearch(e.target.value)}
                className="text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 border rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
              {filteredFields.map(field => (
                <label key={field.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={formData.fields.includes(field.value)}
                    onChange={() => toggleFieldSelection(field.value)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{field.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Toggles */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Active</Label>
                <p className="text-xs text-gray-500">Make this marketplace available for connections</p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => onFormChange({ ...formData, isActive: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Set as Default</Label>
                <p className="text-xs text-gray-500">Pre-select this marketplace when adding connections</p>
              </div>
              <Switch
                checked={formData.isDefault}
                onCheckedChange={(checked) => onFormChange({ ...formData, isDefault: checked })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            <Save className="h-4 w-4" />
            {isEdit ? 'Update' : 'Add'} Marketplace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}