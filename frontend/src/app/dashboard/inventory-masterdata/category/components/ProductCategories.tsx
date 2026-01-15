// src/pages/ProductCategories.tsx
import React from "react";
import CategoryTree from "./CategoryView";

/* ===== Props Interface ===== */
interface ProductCategoriesProps {
  viewType: string;
  categories: any[]; 
  onEdit: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
  onCreate: (data: any) => void;
  onSub: (parentId: string) => void;
  onSetDefault: (categoryId: string) => void;
  initialCategoryId?: string;
}

/* ===== Component ===== */
const ProductCategories: React.FC<ProductCategoriesProps> = ({
  viewType,
  categories,
  onEdit,
  onDelete,
  onCreate,
  onSub,
  initialCategoryId,
  onSetDefault,
}) => {
  return (
    <main>
      <CategoryTree
        categories={categories}
        viewType={viewType}
        onCreate={onCreate}
        onEdit={onEdit}
        onDelete={onDelete}
        onSub={onSub}
        onSetDefault={onSetDefault}
        initialCategoryId={initialCategoryId}
      />
    </main>
  );
};

export default ProductCategories;

