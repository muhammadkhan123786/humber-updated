// components/product/ProductCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/form/Card';
import { Badge } from '@/components/form/Badge';
import { Button } from '@/components/form/CustomButton';
import { Star, ChevronRight, Eye, Edit, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from './Interface';

interface ProductCardProps {
  product: Product;
  index: number;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  getStockBadge: (status: string) => { class: string; icon: any };
}

export const ProductCard = ({ 
  product, 
  index, 
  onView, 
  onEdit, 
  getStockBadge 
}: ProductCardProps) => {
  const stockInfo = getStockBadge(product.stockStatus);
  const StockIcon = stockInfo.icon;

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Product Image */}
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-20 w-20 text-gray-400" />
            </div>
          )}
          {product.featured && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white gap-1">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            </div>
          )}
          <div className="absolute bottom-3 left-3">
            <Badge className={`${stockInfo.class} gap-1`}>
              <StockIcon className="h-3 w-3" />
              {product.stockStatus.replace('-', ' ')}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3 flex-grow">
          <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
          <p className="text-sm text-gray-500">{product.sku}</p>
          
          {/* Category Breadcrumb */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-1 text-xs flex-wrap">
              <Badge className="bg-blue-100 text-blue-700 border border-blue-300">
                {product.categories.level1.name}
              </Badge>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <Badge className="bg-cyan-100 text-cyan-700 border border-cyan-300">
                {product.categories.level2.name}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <Badge className="bg-teal-100 text-teal-700 border border-teal-300">
                {product.categories.level3.name}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">£{product.price.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Cost: £{product.costPrice.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Stock: {product.stockQuantity}</p>
              <div className="flex items-center gap-1 text-xs text-amber-600">
                <Star className="h-3 w-3 fill-amber-400" />
                {product.rating} ({product.totalReviews})
              </div>
            </div>
          </div>

          {/* Manufacturer */}
          <div className="text-xs text-gray-600 border-t pt-2">
            <p className="font-medium">by {product.manufacturer}</p>
            <p>Warranty: {product.warranty}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              onClick={() => onView(product)}
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onEdit(product)}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};