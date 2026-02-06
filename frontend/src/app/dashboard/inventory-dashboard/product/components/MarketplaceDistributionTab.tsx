import { useState } from 'react';
import { motion } from 'framer-motion';

import { Input } from '@/components/form/Input';
import { Badge } from '@/components/form/Badge';
import { Button } from '@/components/form/CustomButton';
import { Card, CardContent } from '@/components/form/Card';
import { ShoppingCart, Globe, Store, Smartphone, Plus, Minus, Shuffle, Package, TrendingUp, Search, Filter, X } from 'lucide-react';
import { Product, ProductListItem } from '../types/product';


interface MarketplaceDistribution {
  productId: string;
  eBay: number;
  amazon: number;
  etsy: number;
  shopify: number;
  tiktok: number;
}

interface MarketplaceDistributionTabProps {
  products: ProductListItem[];
}

export default function MarketplaceDistributionTab({ products }: MarketplaceDistributionTabProps) {
  // Mock marketplace distribution data with useState for interactivity
  const [distributionData, setDistributionData] = useState<MarketplaceDistribution[]>([
    { productId: '1', eBay: 26, amazon: 34, etsy: 12, shopify: 8, tiktok: 3 },
    { productId: '2', eBay: 5, amazon: 8, etsy: 2, shopify: 3, tiktok: 0 },
    { productId: '3', eBay: 0, amazon: 0, etsy: 0, shopify: 0, tiktok: 0 },
    { productId: '4', eBay: 15, amazon: 20, etsy: 5, shopify: 10, tiktok: 2 },
    { productId: '5', eBay: 8, amazon: 12, etsy: 3, shopify: 5, tiktok: 1 },
    { productId: '6', eBay: 10, amazon: 15, etsy: 6, shopify: 7, tiktok: 4 },
  ]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const marketplaces = [
    { name: 'eBay', key: 'eBay', color: 'from-yellow-500 to-amber-500', bgColor: 'bg-gradient-to-br from-yellow-500 to-amber-500', textColor: 'text-yellow-700', icon: ShoppingCart },
    { name: 'Amazon', key: 'amazon', color: 'from-orange-500 to-amber-600', bgColor: 'bg-gradient-to-br from-orange-500 to-amber-600', textColor: 'text-orange-700', icon: ShoppingCart },
    { name: 'Etsy', key: 'etsy', color: 'from-orange-400 to-red-500', bgColor: 'bg-gradient-to-br from-orange-400 to-red-500', textColor: 'text-red-700', icon: Store },
    { name: 'Shopify', key: 'shopify', color: 'from-green-500 to-emerald-500', bgColor: 'bg-gradient-to-br from-green-500 to-emerald-500', textColor: 'text-green-700', icon: Store },
    { name: 'TikTok Shop', key: 'tiktok', color: 'from-pink-500 to-rose-500', bgColor: 'bg-gradient-to-br from-pink-500 to-rose-500', textColor: 'text-pink-700', icon: Smartphone },
  ];

  // Mock products data
  const mockProducts = [
    { id: '1', name: 'Pride Go-Go Elite Traveller Plus', sku: 'PRIDE-001', category: 'Mobility Scooters' },
    { id: '2', name: 'Drive Medical Scout 4-Wheel', sku: 'DRIVE-002', category: 'Travel Scooters' },
    { id: '3', name: 'Invacare Leo 3-Wheel', sku: 'INVA-003', category: 'Travel Scooters' },
    { id: '4', name: 'TGA Breeze S4 GT Heavy Duty', sku: 'TGA-004', category: 'Heavy Duty' },
    { id: '5', name: 'Shoprider Sovereign', sku: 'SHOP-005', category: 'Heavy Duty' },
    { id: '6', name: 'Sterling Pearl Auto-Folding', sku: 'STER-006', category: 'Folding Scooters' },
  ];

  const categories = ['All Products', 'Mobility Scooters', 'Travel Scooters', 'Heavy Duty', 'Folding Scooters'];

  // Filter products based on search and filters
  const filteredProducts = mockProducts.filter(product => {
    const dist = distributionData.find(d => d.productId === product.id);
    
    // Search filter
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    // Marketplace filter
    let matchesMarketplace = true;
    if (selectedMarketplace !== 'all' && dist) {
      const quantity = dist[selectedMarketplace as keyof Omit<MarketplaceDistribution, 'productId'>] as number;
      matchesMarketplace = quantity > 0;
    }
    
    return matchesSearch && matchesCategory && matchesMarketplace;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMarketplace('all');
    setSelectedCategory('all');
  };

  const hasActiveFilters = searchTerm || selectedMarketplace !== 'all' || selectedCategory !== 'all';

  // Calculate totals per marketplace
  const getTotals = () => {
    const totals: Record<string, number> = {};
    let grandTotal = 0;
    
    marketplaces.forEach(mp => {
      const total = distributionData.reduce((sum, dist) => 
        sum + (dist[mp.key as keyof Omit<MarketplaceDistribution, 'productId'>] as number), 0
      );
      totals[mp.key] = total;
      grandTotal += total;
    });
    
    return { totals, grandTotal };
  };

  const { totals, grandTotal } = getTotals();

  // Update quantity for a specific product and marketplace
  const updateQuantity = (productId: string, marketplace: string, change: number) => {
    setDistributionData(prev => 
      prev.map(dist => {
        if (dist.productId === productId) {
          const currentValue = dist[marketplace as keyof Omit<MarketplaceDistribution, 'productId'>] as number;
          const newValue = Math.max(0, currentValue + change);
          return { ...dist, [marketplace]: newValue };
        }
        return dist;
      })
    );
  };

  // Equally distribute quantities across all marketplaces for a product
  const equallyDistribute = (productId: string) => {
    setDistributionData(prev => 
      prev.map(dist => {
        if (dist.productId === productId) {
          const total = dist.eBay + dist.amazon + dist.etsy + dist.shopify + dist.tiktok;
          const perMarketplace = Math.floor(total / 5);
          const remainder = total % 5;
          
          return {
            ...dist,
            eBay: perMarketplace + (remainder > 0 ? 1 : 0),
            amazon: perMarketplace + (remainder > 1 ? 1 : 0),
            etsy: perMarketplace + (remainder > 2 ? 1 : 0),
            shopify: perMarketplace + (remainder > 3 ? 1 : 0),
            tiktok: perMarketplace + (remainder > 4 ? 1 : 0),
          };
        }
        return dist;
      })
    );
  };

  return (
    <>
      {/* Statistics Boxes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {/* Total Available Products */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -4 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 text-white overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="h-6 w-6" />
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  Total
                </Badge>
              </div>
              <p className="text-4xl font-bold mb-2">{grandTotal}</p>
              <p className="text-white/90 text-sm font-medium">Total Available</p>
              <p className="text-white/70 text-xs mt-1">Across all marketplaces</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Individual Marketplaces */}
        {marketplaces.map((mp, index) => {
          const Icon = mp.icon;
          const percentage = grandTotal > 0 ? ((totals[mp.key] / grandTotal) * 100).toFixed(1) : '0.0';
          
          return (
            <motion.div
              key={mp.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <Card className={`border-0 shadow-lg ${mp.bgColor} text-white overflow-hidden group hover:shadow-2xl transition-all duration-300`}>
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30">
                      {percentage}%
                    </Badge>
                  </div>
                  <p className="text-4xl font-bold mb-2">{totals[mp.key]}</p>
                  <p className="text-white/90 text-sm font-medium">{mp.name}</p>
                  <p className="text-white/70 text-xs mt-1">{percentage}% of total</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              {hasActiveFilters && (
                <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                  Active
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Products</option>
                  {categories.filter(c => c !== 'All Products').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Marketplace Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Marketplace
                </label>
                <select
                  value={selectedMarketplace}
                  onChange={(e) => setSelectedMarketplace(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Marketplaces</option>
                  {marketplaces.map(mp => (
                    <option key={mp.key} value={mp.key}>{mp.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">Quick Filters:</span>
              <Button
                size="sm"
                variant={selectedMarketplace === 'all' && selectedCategory === 'all' && !searchTerm ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedMarketplace('all');
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}
                className={selectedMarketplace === 'all' && selectedCategory === 'all' && !searchTerm
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : ''
                }
              >
                All Products
              </Button>
              {marketplaces.map(mp => {
                const Icon = mp.icon;
                return (
                  <Button
                    key={mp.key}
                    size="sm"
                    variant={selectedMarketplace === mp.key ? 'default' : 'outline'}
                    onClick={() => setSelectedMarketplace(mp.key)}
                    className={selectedMarketplace === mp.key
                      ? `${mp.bgColor} hover:opacity-90 text-white border-0`
                      : `hover:${mp.bgColor} hover:text-white`
                    }
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {mp.name}
                  </Button>
                );
              })}
              {hasActiveFilters && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearFilters}
                  className="text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Active Filter Summary */}
            {hasActiveFilters && (
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-start gap-2">
                  <Badge className="bg-indigo-600 text-white">
                    {filteredProducts.length}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-900">
                      Showing {filteredProducts.length} of {mockProducts.length} products
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {searchTerm && (
                        <Badge className="bg-white text-indigo-700 border-indigo-300">
                          Search: "{searchTerm}"
                        </Badge>
                      )}
                      {selectedCategory !== 'all' && (
                        <Badge className="bg-white text-indigo-700 border-indigo-300">
                          Category: {selectedCategory}
                        </Badge>
                      )}
                      {selectedMarketplace !== 'all' && (
                        <Badge className="bg-white text-indigo-700 border-indigo-300">
                          Marketplace: {marketplaces.find(m => m.key === selectedMarketplace)?.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Product Distribution Management Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-yellow-500 via-green-500 to-purple-500"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  Product Distribution Management
                </h3>
                <p className="text-gray-600 text-sm mt-1">Adjust quantities across different marketplaces</p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-40"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearFilters}
                  className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <th className="text-left p-4 font-semibold text-gray-700">Product</th>
                    <th className="text-left p-4 font-semibold text-gray-700">SKU</th>
                    {marketplaces.map(mp => (
                      <th key={mp.key} className={`text-center p-4 font-semibold ${mp.textColor}`}>
                        {mp.name}
                      </th>
                    ))}
                    <th className="text-center p-4 font-semibold text-gray-700">Total</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mock Product Row 1 */}
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300"
                  >
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">Pride Go-Go Elite Traveller Plus</p>
                      <Badge className="mt-1 bg-purple-100 text-purple-700 border-purple-200">
                        Mobility Scooters
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono bg-indigo-50 px-2 py-1 rounded text-indigo-700">
                        PRIDE-001
                      </span>
                    </td>
                    {marketplaces.map(mp => {
                      const dist = distributionData.find(d => d.productId === '1');
                      const quantity = dist ? dist[mp.key as keyof Omit<MarketplaceDistribution, 'productId'>] as number : 0;
                      
                      return (
                        <td key={mp.key} className="p-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity('1', mp.key, -1)}
                              className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className={`inline-flex items-center justify-center h-9 w-12 rounded-lg font-bold text-sm ${
                              quantity > 0 ? `bg-${mp.color.split('-')[1]}-100 ${mp.textColor}` : 'bg-gray-100 text-gray-400'
                            }`}>
                              {quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity('1', mp.key, 1)}
                              className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      );
                    })}
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700">
                        {distributionData.find(d => d.productId === '1') 
                          ? (distributionData.find(d => d.productId === '1')!.eBay + 
                             distributionData.find(d => d.productId === '1')!.amazon + 
                             distributionData.find(d => d.productId === '1')!.etsy + 
                             distributionData.find(d => d.productId === '1')!.shopify + 
                             distributionData.find(d => d.productId === '1')!.tiktok)
                          : 0}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        size="sm"
                        onClick={() => equallyDistribute('1')}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                      >
                        <Shuffle className="h-3 w-3 mr-1" />
                        Distribute
                      </Button>
                    </td>
                  </motion.tr>

                  {/* Mock Product Row 2 */}
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 }}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300"
                  >
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">Drive Medical Scout 4-Wheel</p>
                      <Badge className="mt-1 bg-blue-100 text-blue-700 border-blue-200">
                        Travel Scooters
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono bg-indigo-50 px-2 py-1 rounded text-indigo-700">
                        DRIVE-002
                      </span>
                    </td>
                    {marketplaces.map(mp => {
                      const dist = distributionData.find(d => d.productId === '2');
                      const quantity = dist ? dist[mp.key as keyof Omit<MarketplaceDistribution, 'productId'>] as number : 0;
                      
                      return (
                        <td key={mp.key} className="p-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity('2', mp.key, -1)}
                              className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className={`inline-flex items-center justify-center h-9 w-12 rounded-lg font-bold text-sm ${
                              quantity > 0 ? `bg-${mp.color.split('-')[1]}-100 ${mp.textColor}` : 'bg-gray-100 text-gray-400'
                            }`}>
                              {quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity('2', mp.key, 1)}
                              className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      );
                    })}
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700">
                        {distributionData.find(d => d.productId === '2') 
                          ? (distributionData.find(d => d.productId === '2')!.eBay + 
                             distributionData.find(d => d.productId === '2')!.amazon + 
                             distributionData.find(d => d.productId === '2')!.etsy + 
                             distributionData.find(d => d.productId === '2')!.shopify + 
                             distributionData.find(d => d.productId === '2')!.tiktok)
                          : 0}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        size="sm"
                        onClick={() => equallyDistribute('2')}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                      >
                        <Shuffle className="h-3 w-3 mr-1" />
                        Distribute
                      </Button>
                    </td>
                  </motion.tr>

                  {/* Mock Product Row 3 */}
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300"
                  >
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">TGA Breeze S4 GT Heavy Duty</p>
                      <Badge className="mt-1 bg-green-100 text-green-700 border-green-200">
                        Heavy Duty
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono bg-indigo-50 px-2 py-1 rounded text-indigo-700">
                        TGA-004
                      </span>
                    </td>
                    {marketplaces.map(mp => {
                      const dist = distributionData.find(d => d.productId === '4');
                      const quantity = dist ? dist[mp.key as keyof Omit<MarketplaceDistribution, 'productId'>] as number : 0;
                      
                      return (
                        <td key={mp.key} className="p-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity('4', mp.key, -1)}
                              className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className={`inline-flex items-center justify-center h-9 w-12 rounded-lg font-bold text-sm ${
                              quantity > 0 ? `bg-${mp.color.split('-')[1]}-100 ${mp.textColor}` : 'bg-gray-100 text-gray-400'
                            }`}>
                              {quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity('4', mp.key, 1)}
                              className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      );
                    })}
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700">
                        {distributionData.find(d => d.productId === '4') 
                          ? (distributionData.find(d => d.productId === '4')!.eBay + 
                             distributionData.find(d => d.productId === '4')!.amazon + 
                             distributionData.find(d => d.productId === '4')!.etsy + 
                             distributionData.find(d => d.productId === '4')!.shopify + 
                             distributionData.find(d => d.productId === '4')!.tiktok)
                          : 0}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        size="sm"
                        onClick={() => equallyDistribute('4')}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                      >
                        <Shuffle className="h-3 w-3 mr-1" />
                        Distribute
                      </Button>
                    </td>
                  </motion.tr>

                  {/* Mock Product Row 4 */}
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 }}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300"
                  >
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">Sterling Pearl Auto-Folding</p>
                      <Badge className="mt-1 bg-amber-100 text-amber-700 border-amber-200">
                        Folding Scooters
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono bg-indigo-50 px-2 py-1 rounded text-indigo-700">
                        STER-006
                      </span>
                    </td>
                    {marketplaces.map(mp => {
                      const dist = distributionData.find(d => d.productId === '6');
                      const quantity = dist ? dist[mp.key as keyof Omit<MarketplaceDistribution, 'productId'>] as number : 0;
                      
                      return (
                        <td key={mp.key} className="p-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity('6', mp.key, -1)}
                              className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className={`inline-flex items-center justify-center h-9 w-12 rounded-lg font-bold text-sm ${
                              quantity > 0 ? `bg-${mp.color.split('-')[1]}-100 ${mp.textColor}` : 'bg-gray-100 text-gray-400'
                            }`}>
                              {quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity('6', mp.key, 1)}
                              className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      );
                    })}
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700">
                        {distributionData.find(d => d.productId === '6') 
                          ? (distributionData.find(d => d.productId === '6')!.eBay + 
                             distributionData.find(d => d.productId === '6')!.amazon + 
                             distributionData.find(d => d.productId === '6')!.etsy + 
                             distributionData.find(d => d.productId === '6')!.shopify + 
                             distributionData.find(d => d.productId === '6')!.tiktok)
                          : 0}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        size="sm"
                        onClick={() => equallyDistribute('6')}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                      >
                        <Shuffle className="h-3 w-3 mr-1" />
                        Distribute
                      </Button>
                    </td>
                  </motion.tr>
                </tbody>
                
                {/* Totals Footer */}
                <tfoot>
                  <tr className="border-t-2 border-gray-300 bg-gradient-to-r from-indigo-100 to-purple-100">
                    <td colSpan={2} className="p-4 font-bold text-gray-900 text-lg">TOTALS</td>
                    {marketplaces.map(mp => (
                      <td key={mp.key} className="p-4 text-center">
                        <span className={`inline-flex items-center justify-center px-3 py-2 rounded-lg font-bold ${mp.bgColor} text-white shadow-md`}>
                          {totals[mp.key]}
                        </span>
                      </td>
                    ))}
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                        {grandTotal}
                      </span>
                    </td>
                    <td className="p-4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}