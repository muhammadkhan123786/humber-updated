"use client";
import { useState, useMemo, useEffect } from "react";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { ProductListing } from "../Product/ProductListing";
import { ProductTableView } from "../Product/ProductTableView";
import ProductDetailsModal from "../Product/ProductDetailsModal";
import EditProductDialog from "../Product/EditProductDialog";
import MarketplaceDistributionTab from "./MarketplaceDistributionTab";
import { useProductFilters } from "../../../../../hooks/useProductFilters";
import { useProducts } from "../../../../../hooks/useProduct";
import { useCategories } from "../../../../../hooks/useCategory";
import { Product, ProductListItem, ProductStats } from "../types/product";
import { toast } from "sonner";
import { TabNavigation } from "./TabNavigation";
import { PageHeader } from "./PageHeader";
import { Pagination } from "./Pagination";
import { NoProductsMessage } from "./NoProductsMessage";
import { AnimatedBackground } from "./AnimatedBackground";

const LoadingState = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <RefreshCw className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
      <p className="text-gray-600">Loading products...</p>
    </div>
  </div>
);

// =============== Main Component ===============

export default function ProductListingPage() {
  // State
  const [activeTab, setActiveTab] = useState<"products" | "distribution">(
    "products",
  );
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedProduct, setSelectedProduct] = useState<ProductListItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductListItem | null>(null);

  // Hooks
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories({
    autoFetch: true,
  });


  const data = useCategories();

  const {
    products,
    loading: productsLoading,
    error: productsError,
    statistics,
    pagination,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    goToPage,
    changePageSize,
    refetch: refetchProducts,
  } = useProducts({
    autoFetch: true,
    initialLimit: 12,
  });

  const {
    filteredProducts,
    searchTerm,
    selectedCategory,
    selectedStatus,
    selectedStockStatus,
    showFeaturedOnly,
    hasActiveFilters,
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    handleStockStatusChange,
    handleFeaturedToggle,
    resetFilters,
  } = useProductFilters({
    products,
    categories,
  });

  // Helper Functions
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

  // Event Handlers
  const handleViewProduct = async (product: Product) => {
    const result = await getProductById(product.id);
    if (result.success && result.data) {
      setSelectedProduct(result.data as any);
      setIsViewDialogOpen(true);
    } else {
      toast.error("Failed to load product details");
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (updatedProduct: ProductListItem) => {
    const result = await updateProduct(updatedProduct.id, updatedProduct);

    if (result.success) {
      toast.success("Product updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
    } else {
      toast.error(result.error || "Failed to update product");
    }
  };

  const handleDeleteClick = (product: ProductListItem) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    const result = await deleteProduct(productToDelete.id);

    if (result.success) {
      toast.success(`${productToDelete.name} deleted successfully!`);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } else {
      toast.error(result.error || "Failed to delete product");
    }
  };

  const handleRefresh = () => {
    refetchProducts();
    refetchCategories();
    toast.success("Refreshed!");
  };

  // Effects
  useEffect(() => {
    if (productsError) toast.error(productsError);
    if (categoriesError) toast.error(categoriesError);
  }, [productsError, categoriesError]);

  // Derived State
  const isLoading = productsLoading || categoriesLoading;
  const hasProducts = filteredProducts?.length > 0;

  // Render Logic
  const renderProductsContent = () => {
    if (isLoading) return <LoadingState />;

    if (!hasProducts) {
      return (
        <NoProductsMessage
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
        />
      );
    }

    return (
      <>
        {viewMode === "grid" ? (
          <ProductListing
            products={filteredProducts}
            categories={categories}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            selectedStockStatus={selectedStockStatus}
            showFeaturedOnly={showFeaturedOnly}
            hasActiveFilters={hasActiveFilters}
            onViewProduct={handleViewProduct}
            onEditProduct={handleEditProduct}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onStatusChange={handleStatusChange}
            onStockStatusChange={handleStockStatusChange}
            onFeaturedToggle={handleFeaturedToggle}
            onResetFilters={resetFilters}
          />
        ) : (
          <ProductTableView
            products={filteredProducts}
            onView={handleViewProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteClick}
            getStockBadge={getStockBadge}
          />
        )}

        {pagination.total > pagination.limit && (
          <Pagination
            pagination={pagination}
            onPageChange={goToPage}
            onPageSizeChange={changePageSize}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-6 relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <PageHeader
        activeTab={activeTab}
        viewMode={viewMode}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        onViewModeChange={setViewMode}
      />

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      {activeTab === "products" ? (
        <div className="space-y-6">{renderProductsContent()}</div>
      ) : (
        <MarketplaceDistributionTab products={products} />
      )}

      {/* Modals */}
      <ProductModals
        selectedProduct={selectedProduct}
        isViewDialogOpen={isViewDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        onViewDialogChange={setIsViewDialogOpen}
        onEditDialogChange={setIsEditDialogOpen}
        onSaveEdit={handleSaveEdit}
        getStockBadge={getStockBadge}
      />
    </div>
  );
}

// =============== Additional Components ===============

interface ProductModalsProps {
  selectedProduct: ProductListItem | null;
  isViewDialogOpen: boolean;
  isEditDialogOpen: boolean;
  onViewDialogChange: (open: boolean) => void;
  onEditDialogChange: (open: boolean) => void;
  onSaveEdit: (product: Product) => Promise<void>;
  getStockBadge: (status: string) => { class: string; icon: any };
}

const ProductModals: React.FC<ProductModalsProps> = ({
  selectedProduct,
  isViewDialogOpen,
  isEditDialogOpen,
  onViewDialogChange,
  onEditDialogChange,
  onSaveEdit,
  getStockBadge,
}) => {
  if (!selectedProduct) return null;

  return (
    <>
      <ProductDetailsModal
        open={isViewDialogOpen}
        onOpenChange={onViewDialogChange}
        product={selectedProduct}
        getStockBadge={getStockBadge}
      />

      <EditProductDialog
        open={isEditDialogOpen}
        onOpenChange={onEditDialogChange}
        product={selectedProduct}
        onSave={onSaveEdit}
      />
    </>
  );
};
