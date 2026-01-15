import React, { useState } from "react";
import { Search, RotateCw, ChevronRight, Plus } from "lucide-react";
import { Button, StatCard, CustomTable, PageHeader } from "./index";
import { productData, ProductItem, steps } from "./data";

const Products = () => {
  const columns = [
    {
      header: "Image",
      accessor: (item: ProductItem) => (
        <img
          src={item.image}
          alt={item.name}
          className="w-10 h-10 rounded shadow-sm"
        />
      ),
    },
    {
      header: "Product",
      accessor: (item: ProductItem) => (
        <div>
          <div className="font-bold text-gray-900">{item.name}</div>
          <div className="text-xs text-gray-400">SKU: {item.sku}</div>
        </div>
      ),
    },
    {
      header: "Category Path",
      accessor: (item: ProductItem) => (
        <div className="flex items-center gap-1 text-[11px]">
          {item.categoryPath.map((cat, i) => (
            <React.Fragment key={i}>
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                {cat}
              </span>
              {i < item.categoryPath.length - 1 && (
                <ChevronRight size={12} className="text-gray-300" />
              )}
            </React.Fragment>
          ))}
        </div>
      ),
    },
    {
      header: "Stock Status",
      accessor: (item: ProductItem) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${
            item.stockStatus === "Healthy"
              ? "bg-green-50 text-green-600 border-green-100"
              : "bg-orange-50 text-orange-600 border-orange-100"
          }`}
        >
          ● {item.stockStatus}
        </span>
      ),
    },
    {
      header: "Inventory",
      accessor: (item: ProductItem) => (
        <div className="text-xs space-y-0.5">
          <p>
            On Hand: <b>{item.inventory.onHand}</b>
          </p>
          <p className="text-gray-400">Available: {item.inventory.available}</p>
        </div>
      ),
    },
    {
      header: "Price",
      accessor: (item: ProductItem) => (
        <span className="font-bold text-gray-900">${item.price}</span>
      ),
    },
    {
      header: "Actions",
      accessor: () => (
        <button className="text-blue-600 font-bold hover:underline">
          Edit
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="bg-gray-50 min-h-screen space-y-4">
        <CustomTable
          columns={columns}
          data={productData}
          showPagination
          totalPages={5}
          currentPage={1}
        />
      </div>
    </>
  );
};

export default Products;
