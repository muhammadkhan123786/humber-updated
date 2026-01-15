"use client";

import { useState, useEffect } from "react";
import ProductFormModal from "./components/ProductFormModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal"; // Import your delete modal
import { Plus } from "lucide-react";
import DropdownMenu from '@/components/form/DropdownMenu';
import CustomTable from "@/components/CustomTable";
import { getAlls, deleteItem } from "@/helper/apiHelper";
import InventoryManagement from "./components/InventoryManagement";
import { Product, ProductTable, TableColumn, PaginatedResponse } from "./components/Interface";
import Super from "./components/Super"

export default function CreateProductPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // 1. Fetch Data
type ProductResponse = Product[] | PaginatedResponse<Product[]>;

const fetchProducts = async () => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const userObj = JSON.parse(userStr);

    const response = await getAlls("/product-base", { 
      userId: userObj.id 
    }) as ProductResponse;

    if (Array.isArray(response)) {
      setProducts(response);
    } else {
      setProducts(response.data);
    }
  } catch (error) {
    console.error("Error fetching products", error);
  }
};

  useEffect(() => { fetchProducts(); }, []);

  // 2. Action Handlers
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    setIsDeleting(true);
    try {
      // await deleteItem(`/product-base/${selectedProduct._id}`);
      await deleteItem("/product-base", selectedProduct._id);
      // UI Update: Remove from state directly for instant feedback
      setProducts(products.filter(p => p._id !== selectedProduct._id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      alert("Failed to delete product");
    } finally {
      setIsDeleting(false);
      setSelectedProduct(null);
    }
  };

  // 3. Table Columns Definition
  const columns: TableColumn<Product>[]  = [
    {
      header: 'Product Details',
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
            {item.productName?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{item.productName}</p>
            <p className="text-xs text-gray-500 uppercase">{item.SKU}</p>
          </div>
        </div>
      ),
    },
    { header: 'Stock', accessor: (item) => <span className="font-medium">{item.stock}</span> },
    { header: 'Lead Time', accessor: (item) => <span>{item.leadTime} Days</span> },
    {
      header: 'Status',
      accessor: (item) => (
        <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: (item) => (
        <DropdownMenu 
          onEdit={() => handleEdit(item)} 
          onDelete={() => handleDeleteClick(item)} 
        />
      ),
    },
  ];

  return (
    // <div className="min-h-screen bg-gray-50 p-8">
    //   <div className="max-w-7xl mx-auto">
    //     <div className="flex justify-between items-center mb-8">
    //       <div>
    //         <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
    //         <p className="text-gray-500">Manage and track your inventory levels</p>
    //       </div>
    //       <button
    //         onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
    //         className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
    //       >
    //         <Plus className="w-4 h-4" /> Add Product
    //       </button>
    //     </div>

    //     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    //       <CustomTable data={products} columns={columns} />
    //     </div>
    //   </div>

    //   {/* Create/Edit Modal */}
    //   <ProductFormModal
    //     isOpen={isModalOpen}
    //     editingProduct={selectedProduct}
    //     onClose={() => { setIsModalOpen(false); setSelectedProduct(null); }}
    //     onSuccess={fetchProducts} // Refresh list on success
    //   />

    //   {/* Delete Confirmation Modal */}
    //   <DeleteConfirmModal
    //     isOpen={isDeleteModalOpen}
    //     itemName={selectedProduct?.productName}
    //     isDeleting={isDeleting}
    //     onConfirm={confirmDelete}
    //     onCancel={() => setIsDeleteModalOpen(false)}
    //   />
    // </div>
    <div className="bg-[#d32424]">

      <Super />
    </div>
  );
}