// components/Product/CategoryFilters.tsx - PROFESSIONAL UI VERSION
"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/form/Card";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/form/CustomButton";
import {
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Package,
  CheckCircle2,
  Layers,
  Star,
  Filter,
} from "lucide-react";

interface CategoryFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedStatus: string;
  selectedStockStatus: string;
  showFeaturedOnly: boolean;
  categories?: Array<{
    _id: string;
    categoryName: string;
    parentId?: string | null;
    children?: any[];
    [key: string]: any;
  }>;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onStockStatusChange: (value: string) => void;
  onFeaturedToggle: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  filterStats?: {
    total: number;
    filtered: number;
  };
}

export const CategoryFilters = ({
  searchTerm,
  selectedCategory,
  selectedStatus,
  selectedStockStatus,
  showFeaturedOnly,
  categories = [],
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onStockStatusChange,
  onFeaturedToggle,
  onResetFilters,
  hasActiveFilters,
  filterStats,
}: CategoryFiltersProps) => {
  const [categorySearch, setCategorySearch] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Build category tree - handles pre-built tree data
  const categoryTree = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    const hasPrebuiltChildren = categories.some(c => c.children && Array.isArray(c.children) && c.children.length > 0);
    
    if (hasPrebuiltChildren) {
      const roots = categories.filter(c => !c.parentId).map(c => ({
        ...c,
        id: c._id,
        name: c.categoryName,
        children: c.children || []
      }));
      
      const processNode = (node: any): any => {
        const processed = {
          ...node,
          id: node._id || node.id,
          name: node.categoryName || node.name,
          children: []
        };
        
        if (node.children && Array.isArray(node.children) && node.children.length > 0) {
          processed.children = node.children.map(processNode);
        }
        
        return processed;
      };
      
      return roots.map(processNode);
    }
    
    // Build from flat data
    const categoryMap = new Map<string, any>();
    const roots: any[] = [];

    categories.forEach((category) => {
      if (category && category._id) {
        categoryMap.set(category._id, {
          ...category,
          id: category._id,
          name: category.categoryName,
          children: [],
        });
      }
    });

    categories.forEach((category) => {
      if (!category || !category._id) return;
      const node = categoryMap.get(category._id);
      if (!node) return;

      if (category.parentId && categoryMap.has(category.parentId)) {
        const parent = categoryMap.get(category.parentId);
        if (parent) parent.children.push(node);
      } else if (!category.parentId) {
        roots.push(node);
      }
    });

    const sortChildren = (nodes: any[]) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) sortChildren(node.children);
      });
    };
    sortChildren(roots);

    return roots;
  }, [categories]);

  const getCategoryPath = useMemo(() => {
    if (selectedCategory === "all") return "";

    const findCategoryPath = (id: string, nodes: any[], path: string[] = []): string[] | null => {
      for (const node of nodes) {
        if (node._id === id || node.id === id) {
          return [...path, node.name];
        }
        if (node.children && node.children.length > 0) {
          const result = findCategoryPath(id, node.children, [...path, node.name]);
          if (result) return result;
        }
      }
      return null;
    };

    const path = findCategoryPath(selectedCategory, categoryTree);
    return path ? path.join(" › ") : "";
  }, [selectedCategory, categoryTree]);

  const filteredCategoryTree = useMemo(() => {
    if (!categoryTree.length || !categorySearch.trim()) return categoryTree;

    const searchLower = categorySearch.toLowerCase();
    const filterNodes = (nodes: any[]): any[] => {
      const filtered: any[] = [];
      nodes.forEach((node) => {
        const nodeMatches = node.name.toLowerCase().includes(searchLower);
        const filteredChildren = filterNodes(node.children || []);
        if (nodeMatches || filteredChildren.length > 0) {
          filtered.push({ ...node, children: filteredChildren });
        }
      });
      return filtered;
    };
    return filterNodes(categoryTree);
  }, [categoryTree, categorySearch]);

  const toggleCategoryExpansion = (categoryId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    onCategoryChange(categoryId);
    setIsCategoryDropdownOpen(false);
    setCategorySearch("");
  };

  const renderCategoryTree = (nodes: any[], depth = 0) => {
    if (!nodes || nodes.length === 0) {
      if (depth === 0) {
        return (
          <div className="px-3 py-8 text-center">
            <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No categories found</p>
          </div>
        );
      }
      return null;
    }

    return nodes.map((node) => {
      const nodeId = node._id || node.id;
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedCategories.has(nodeId) || !!categorySearch;
      const isSelected = selectedCategory === nodeId;
      const isRootCategory = depth === 0;

      return (
        <div key={nodeId} className="w-full">
          <div
            className={`
              flex items-center gap-2.5 px-3 py-2 
              rounded-md cursor-pointer transition-all
              ${
                isSelected
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "hover:bg-gray-50 text-gray-700"
              }
            `}
            onClick={() => handleCategorySelect(nodeId)}
            style={{ paddingLeft: `${depth * 16 + 12}px` }}
          >
            {/* Expand/Collapse Arrow */}
            {hasChildren ? (
              <button
                onClick={(e) => toggleCategoryExpansion(nodeId, e)}
                className="flex-shrink-0 p-0.5 hover:bg-gray-200 rounded transition-colors"
              >
                <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
              </button>
            ) : (
              <div className="w-5" />
            )}

            {/* Icon */}
            <div className="flex-shrink-0">
              {hasChildren ? (
                <Folder className={`h-4 w-4 ${isSelected ? "text-blue-600" : "text-gray-500"}`} />
              ) : (
                <Package className={`h-3.5 w-3.5 ${isSelected ? "text-blue-600" : "text-gray-400"}`} />
              )}
            </div>

            {/* Category Name */}
            <span className={`flex-1 text-sm truncate ${isRootCategory ? "font-bold" : "font-normal"}`}>
              {node.name}
            </span>

            {/* Child Count & Selected Icon */}
            <div className="flex items-center gap-2">
              {hasChildren && (
                <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded font-medium">
                  {node.children.length}
                </span>
              )}
              {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />}
            </div>
          </div>

          {/* Children */}
          {isExpanded && hasChildren && (
            <AnimatePresence>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {renderCategoryTree(node.children, depth + 1)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      );
    });
  };

  return (
    <Card className="border border-gray-200 shadow-sm bg-white">
      <CardContent className="p-4 space-y-4">
        {/* Header with Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-bold text-gray-900">Filters</h3>
            {filterStats && (
              <span className="text-sm text-gray-500">
                ({filterStats.filtered} of {filterStats.total})
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-xs text-red-600 hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 text-sm"
          />
        </div>

        {/* Filters Row - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Category Dropdown */}
          <div className="relative sm:col-span-2 lg:col-span-1" ref={dropdownRef}>
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 
                border rounded-lg transition-all text-sm
                ${
                  isCategoryDropdownOpen
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400 bg-white"
                }
              `}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Folder className="h-4 w-4 text-gray-600 flex-shrink-0" />
                <span className="truncate font-medium text-gray-700">
                  {selectedCategory === "all" ? "All Categories" : getCategoryPath.split(" › ").pop() || "Category"}
                </span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
              {isCategoryDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
                  style={{ minWidth: "280px" }}
                >
                  {/* Search in Categories */}
                  <div className="p-3 border-b bg-gray-50">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* All Categories Option */}
                  <div
                    className={`
                      flex items-center gap-3 px-3 py-2.5 cursor-pointer border-b
                      ${selectedCategory === "all" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}
                    `}
                    onClick={() => handleCategorySelect("all")}
                  >
                    <Folder className="h-4 w-4" />
                    <span className="flex-1 text-sm font-semibold">All Categories</span>
                    {selectedCategory === "all" && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                  </div>

                  {/* Category Tree */}
                  <div className="max-h-72 overflow-y-auto p-2">
                    {renderCategoryTree(categorySearch ? filteredCategoryTree : categoryTree)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Stock Status Filter */}
          <div>
            <select
              value={selectedStockStatus}
              onChange={(e) => onStockStatusChange(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Stock</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={onFeaturedToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              <span className="ml-2 text-sm font-medium text-gray-700 whitespace-nowrap">
                <Star className="inline h-3.5 w-3.5 mb-0.5" /> Featured
              </span>
            </label>
          </div>
        </div>

        {/* Active Filters Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-3 border-t">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                <Search className="h-3 w-3" />
                {searchTerm}
                <X className="h-3 w-3 cursor-pointer hover:text-blue-900" onClick={() => onSearchChange("")} />
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                <Folder className="h-3 w-3" />
                {getCategoryPath.split(" › ").pop()}
                <X className="h-3 w-3 cursor-pointer hover:text-purple-900" onClick={() => onCategoryChange("all")} />
              </span>
            )}
            {selectedStatus !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                {selectedStatus}
                <X className="h-3 w-3 cursor-pointer hover:text-green-900" onClick={() => onStatusChange("all")} />
              </span>
            )}
            {selectedStockStatus !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium">
                {selectedStockStatus}
                <X className="h-3 w-3 cursor-pointer hover:text-amber-900" onClick={() => onStockStatusChange("all")} />
              </span>
            )}
            {showFeaturedOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium">
                <Star className="h-3 w-3" />
                Featured
                <X className="h-3 w-3 cursor-pointer hover:text-indigo-900" onClick={onFeaturedToggle} />
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};