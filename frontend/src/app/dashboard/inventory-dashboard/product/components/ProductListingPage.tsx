// pages/ProductListingPage.tsx
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/form/Card";
import { Button } from "@/components/form/CustomButton";
import Link from "next/link";
import {
  Package,
  Plus,
  Grid3x3,
  List,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Star,
  Box,
  Search,
} from "lucide-react";
import { Input } from "@/components/form/Input";
import { Badge } from "@/components/form/Badge";
import { ProductListing } from "../Product/ProductListing";
import { ProductTableView } from "../Product/ProductTableView";
import ProductDetailsModal from "../Product/ProductDetailsModal";
import EditProductDialog from "../Product/EditProductDialog";
import MarketplaceDistributionTab from "./MarketplaceDistributionTab";
import { CategoryFilters } from "../Product/CategoryFilters";
import { ProductStatistics } from "../Product/ProductStats";
import { useProductFilters } from "@/hooks/useProductFilters";
import { Product, ProductStats } from "../types/product";
import { sampleProducts } from "../data/sampleProducts";
import { toast } from "sonner";

export default function ProductListingPage() {
  // State
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [activeTab, setActiveTab] = useState<"products" | "distribution">(
    "products",
  );
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Filters
  const {
    searchTerm,
    selectedLevel1,
    selectedLevel2,
    selectedLevel3,
    selectedStatus,
    filteredProducts,
    categoriesLevel1,
    filteredLevel2,
    filteredLevel3,
    handleSearchChange,
    handleLevel1Change,
    handleLevel2Change,
    handleLevel3Change,
    handleStatusChange,
  } = useProductFilters(products);

  // Stats
  const stats: ProductStats = useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.status === "active").length,
      inStock: products.filter((p) => p.stockStatus === "in-stock").length,
      lowStock: products.filter((p) => p.stockStatus === "low-stock").length,
      outOfStock: products.filter((p) => p.stockStatus === "out-of-stock")
        .length,
      featured: products.filter((p) => p.featured).length,
    }),
    [products],
  );

  // Stock badge helper
  const getStockBadge = (status: string) => {
    const variants: Record<string, { class: string; icon: any }> = {
      "in-stock": {
        class: "bg-gradient-to-r from-emerald-500 to-green-500 text-white",
        icon: CheckCircle,
      },
      "low-stock": {
        class: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
        icon: AlertCircle,
      },
      "out-of-stock": {
        class: "bg-gradient-to-r from-rose-500 to-red-600 text-white",
        icon: AlertCircle,
      },
    };
    return variants[status] || variants["in-stock"];
  };

  // Handlers
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
    toast.success("Product updated successfully!");
    setIsEditDialogOpen(false);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;

    setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
    toast.success(`${productToDelete.name} deleted successfully!`);
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // Tab Button Component
  const TabButton = ({
    active,
    icon: Icon,
    title,
    subtitle,
    onClick,
    gradient,
  }: {
    active: boolean;
    icon: any;
    title: string;
    subtitle: string;
    onClick: () => void;
    gradient: string;
  }) => (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        variant={active ? "default" : "ghost"}
        onClick={onClick}
        className={`w-full h-auto py-4 px-6 gap-3 transition-all duration-300 ${
          active
            ? `bg-gradient-to-br ${gradient} hover:from-opacity-90 hover:via-opacity-90 hover:to-opacity-90 text-white shadow-xl border-2 border-white/20`
            : "hover:bg-gray-50 text-gray-700 hover:shadow-lg"
        }`}
      >
        <div className="flex flex-col items-center gap-2 w-full">
          <motion.div
            animate={active ? { rotate: [0, 360] } : {}}
            transition={
              active ? { duration: 2, repeat: Infinity, ease: "linear" } : {}
            }
            className={`p-3 rounded-xl ${active ? "bg-white/20 backdrop-blur-sm" : "bg-gray-100"}`}
          >
            <Icon
              className={`h-6 w-6 ${active ? "text-white" : "text-gray-600"}`}
            />
          </motion.div>
          <div className="text-center">
            <div
              className={`font-bold text-base ${active ? "text-white" : "text-gray-900"}`}
            >
              {title}
            </div>
            <div
              className={`text-xs mt-0.5 ${active ? "text-white/80" : "text-gray-500"}`}
            >
              {subtitle}
            </div>
          </div>
        </div>
      </Button>
    </motion.div>
  );

  return (
    <div className="space-y-6 relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.3, 0.5, 0.3],
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
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center shadow-xl"
                >
                  <Package className="h-8 w-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                    {activeTab === "products"
                      ? "Product Listing"
                      : "Marketplace Distribution"}
                  </h1>
                  <p className="text-white/90 mt-1 text-lg">
                    {activeTab === "products"
                      ? "Browse products by hierarchical categories"
                      : "Multi-channel analytics and distribution management"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Show Add Product button only in Products tab */}
                {activeTab === "products" && (
                  <Button
                    asChild
                    className="bg-white text-cyan-600 hover:bg-white/90"
                  >
                    <Link href="/dashboard/add-product">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Link>
                  </Button>
                )}

                {/* Show View Mode buttons only in Products tab */}
                {activeTab === "products" && (
                  <>
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      onClick={() => setViewMode("grid")}
                      className={
                        viewMode === "grid"
                          ? "bg-white text-cyan-600 hover:bg-white/90"
                          : "bg-white/20 text-white border-white/30 hover:bg-white/30"
                      }
                    >
                      <Grid3x3 className="h-4 w-4 mr-2" />
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === "table" ? "default" : "outline"}
                      onClick={() => setViewMode("table")}
                      className={
                        viewMode === "table"
                          ? "bg-white text-cyan-600 hover:bg-white/90"
                          : "bg-white/20 text-white border-white/30 hover:bg-white/30"
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
      >
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 via-rose-500 via-orange-500 via-amber-500 via-yellow-500 via-lime-500 via-green-500 via-emerald-500 via-teal-500 via-cyan-500 via-sky-500 via-blue-500 via-indigo-500 to-purple-500 animate-gradient" />
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-3">
              <TabButton
                active={activeTab === "products"}
                icon={Package}
                title="Product Listing"
                subtitle="Browse & Manage"
                onClick={() => setActiveTab("products")}
                gradient="from-purple-600 via-pink-600 to-rose-600"
              />
              <TabButton
                active={activeTab === "distribution"}
                icon={BarChart3}
                title="Marketplace Distribution"
                subtitle="Multi-Channel Analytics"
                onClick={() => setActiveTab("distribution")}
                gradient="from-orange-600 via-amber-600 to-yellow-600"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tab Content */}
      {activeTab === "products" ? (
        <div className="space-y-6">
                  {/* Content based on view mode */}
          {filteredProducts.length > 0 ? (
            <>
              {viewMode === "grid" ? (
                // Grid View - Using your existing ProductListing component
                <ProductListing
                  products={filteredProducts}
                  onViewProduct={handleViewProduct}
                  onEditProduct={handleEditProduct}
                />
              ) : (
                // Table View
                <ProductTableView
                  products={filteredProducts}
                  onView={handleViewProduct}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteClick}
                  getStockBadge={getStockBadge}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      ) : (
        // Marketplace Distribution Tab
        <MarketplaceDistributionTab products={products} />
      )}

      {/* Modals */}
      {selectedProduct && (
        <>
          <ProductDetailsModal
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            product={selectedProduct}
            getStockBadge={getStockBadge}
          />

          <EditProductDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            product={selectedProduct}
            onSave={handleSaveEdit}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {/* Uncomment this when you create the DeleteConfirmationDialog component */}
      {/* 
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        product={productToDelete}
        onConfirm={handleConfirmDelete}
      />
      */}
    </div>
  );
}
