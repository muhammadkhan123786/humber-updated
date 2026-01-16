// components/ProductDetailsModal.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/form/Dialog';
import { Badge } from '@/components/form/Badge';
import { Product } from '../types/product';
import { 
  Package, 
  Tag, 
  DollarSign, 
  Box, 
  Weight, 
  Ruler, 
  Building, 
  Shield, 
  Star, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
  ChevronRight,
} from 'lucide-react';

interface ProductDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (updatedProduct: Product) => void;
}

 const ProductDetailsModal = ({ 
  open, 
  onOpenChange, 
  product 
}: ProductDetailsModalProps) => {
  if (!product) return null;

  const getStockBadge = (status: string) => {
    const variants: Record<string, { class: string; icon: any }> = {
      'in-stock': { 
        class: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white',
        icon: CheckCircle
      },
      'low-stock': { 
        class: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
        icon: AlertCircle
      },
      'out-of-stock': { 
        class: 'bg-gradient-to-r from-rose-500 to-red-600 text-white',
        icon: AlertCircle
      }
    };
    return variants[status] || variants['in-stock'];
  };

  const stockInfo = getStockBadge(product.stockStatus);
  const StockIcon = stockInfo.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            {product.name}
          </DialogTitle>
          <DialogDescription>{product.sku}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stock Status & Featured Badge */}
          <div className="flex flex-wrap gap-2">
            <Badge className={`${stockInfo.class} gap-1`}>
              <StockIcon className="h-3 w-3" />
              {product.stockStatus.replace('-', ' ')}
            </Badge>
            {product.featured && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white gap-1">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            )}
            <Badge className={
              product.status === 'active' 
                ? 'bg-green-100 text-green-700 border border-green-300'
                : product.status === 'inactive'
                ? 'bg-gray-100 text-gray-700 border border-gray-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }>
              {product.status}
            </Badge>
          </div>

          {/* Image */}
          {product.imageUrl && (
            <div className="rounded-lg overflow-hidden border">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Grid Layout for Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pricing */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
              <h3 className="font-semibold text-lg text-blue-800 mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selling Price:</span>
                  <span className="font-bold text-2xl text-blue-700">£{product.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost Price:</span>
                  <span className="font-medium text-gray-700">£{product.costPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-blue-200 pt-2">
                  <span className="text-gray-600">Profit Margin:</span>
                  <span className="font-medium text-emerald-700">
                    {((product.price - product.costPrice) / product.costPrice * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <h3 className="font-semibold text-lg text-green-800 mb-3 flex items-center gap-2">
                <Box className="h-4 w-4" />
                Inventory
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock Quantity:</span>
                  <span className="font-bold text-green-700">{product.stockQuantity} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">On Hand:</span>
                  <span className="font-medium text-blue-700">{product.onHand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-medium text-emerald-700">{product.available}</span>
                </div>
                <div className="flex justify-between border-t border-green-200 pt-2">
                  <span className="text-gray-600">Reorder Level:</span>
                  <span className="font-medium text-orange-700">{product.reorderLevel} / {product.reorderQuantity}</span>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <h3 className="font-semibold text-lg text-purple-800 mb-3 flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Specifications
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Weight:</span>
                  <span className="ml-auto font-medium">{product.weight}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="ml-auto font-medium">{product.dimensions}</span>
                </div>
              </div>
            </div>

            {/* Manufacturer */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
              <h3 className="font-semibold text-lg text-orange-800 mb-3 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Manufacturer
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="font-medium text-gray-900">{product.manufacturer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Warranty:</span>
                  <span className="ml-auto font-medium">{product.warranty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-gray-600">Rating:</span>
                  <span className="ml-auto font-medium">
                    {product.rating} ({product.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Category Hierarchy
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-blue-100 text-blue-700 border border-blue-300">
                L1: {product.categories.level1.name}
              </Badge>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Badge className="bg-cyan-100 text-cyan-700 border border-cyan-300">
                L2: {product.categories.level2.name}
              </Badge>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Badge className="bg-teal-100 text-teal-700 border border-teal-300">
                L3: {product.categories.level3.name}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal