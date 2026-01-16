'use client'
import React, { useState} from 'react';
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Package,
  Search,
  Filter,
  ChevronRight,
  Grid3x3,
  List,
  Plus,
  Edit,
  Eye,
  Trash2,
  Star,
  TrendingUp,
  Box,
  Tag,
  DollarSign,
  Zap,
  AlertCircle,
  CheckCircle,
  BarChart3
} from 'lucide-react';

import { Card, CardContent } from '@/components/form/Card'
import { Button } from '@/components/form/CustomButton'

const ProductDashboard = () => {
   const [activeTab, setActiveTab] = useState<'products' | 'distribution'>('products');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const handleSubmit = () => {
    console.log('Saving product...')
  }

  return (
    <>
      {/* Animated background */}
       <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-2xl blur-xl opacity-20 -z-10"></div>
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center shadow-xl"
                >
                  <Package className="h-8 w-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                    Product Listing
                  </h1>
                  <p className="text-white/90 mt-1 text-lg">Browse products by hierarchical categories</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  asChild
                  className="bg-white text-cyan-600 hover:bg-white/90"
                >
                  <Link href="/products/add">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Link>
                </Button>
                {activeTab === 'products' && (
                  <>
                    <Button 
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      onClick={() => setViewMode('grid')}
                      className={viewMode === 'grid' 
                        ? 'bg-white text-cyan-600 hover:bg-white/90' 
                        : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                      }
                    >
                      <Grid3x3 className="h-4 w-4 mr-2" />
                      Grid
                    </Button>
                    <Button 
                      variant={viewMode === 'table' ? 'default' : 'outline'}
                      onClick={() => setViewMode('table')}
                      className={viewMode === 'table' 
                        ? 'bg-white text-cyan-600 hover:bg-white/90' 
                        : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                      }
                    >
                      <List className="h-4 w-4 mr-2" />
                      Table
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        
      </motion.div>
      
{/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl blur-xl opacity-30 -z-10"></div>
        
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden">
          {/* Rainbow Top Border */}
          <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 via-rose-500 via-orange-500 via-amber-500 via-yellow-500 via-lime-500 via-green-500 via-emerald-500 via-teal-500 via-cyan-500 via-sky-500 via-blue-500 via-indigo-500 to-purple-500 animate-gradient"></div>
          
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Product Listing Tab */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={activeTab === 'products' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('products')}
                  className={`w-full h-auto py-4 px-6 gap-3 transition-all duration-300 ${
                    activeTab === 'products'
                      ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white shadow-xl shadow-pink-500/50 border-2 border-white/20'
                      : 'hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 text-gray-700 hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 w-full">
                    <motion.div
                      animate={activeTab === 'products' ? { 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{ 
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity }
                      }}
                      className={`p-3 rounded-xl ${
                        activeTab === 'products'
                          ? 'bg-white/20 backdrop-blur-sm'
                          : 'bg-purple-100'
                      }`}
                    >
                      <Package className={`h-6 w-6 ${
                        activeTab === 'products' ? 'text-white' : 'text-purple-600'
                      }`} />
                    </motion.div>
                    <div className="text-center">
                      <div className={`font-bold text-base ${
                        activeTab === 'products' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Product Listing
                      </div>
                      <div className={`text-xs mt-0.5 ${
                        activeTab === 'products' ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        Browse & Manage
                      </div>
                    </div>
                  </div>
                  </Button>
                        </motion.div>


                        
 {/* Marketplace Distribution Tab */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={activeTab === 'distribution' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('distribution')}
                  className={`w-full h-auto py-4 px-6 gap-3 transition-all duration-300 ${
                    activeTab === 'distribution'
                      ? 'bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-700 hover:via-amber-700 hover:to-yellow-700 text-white shadow-xl shadow-amber-500/50 border-2 border-white/20'
                      : 'hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 text-gray-700 hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 w-full">
                    <motion.div
                      animate={activeTab === 'distribution' ? { 
                        y: [0, -5, 0],
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className={`p-3 rounded-xl ${
                        activeTab === 'distribution'
                          ? 'bg-white/20 backdrop-blur-sm'
                          : 'bg-orange-100'
                      }`}
                    >
                      <BarChart3 className={`h-6 w-6 ${
                        activeTab === 'distribution' ? 'text-white' : 'text-orange-600'
                      }`} />
                    </motion.div>
                    <div className="text-center">
                      <div className={`font-bold text-base ${
                        activeTab === 'distribution' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Marketplace Distribution
                      </div>
                      <div className={`text-xs mt-0.5 ${
                        activeTab === 'distribution' ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        Multi-Channel Analytics
                      </div>
                    </div>
                  </div>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>


           

      
    </>
  )
}

export default ProductDashboard

