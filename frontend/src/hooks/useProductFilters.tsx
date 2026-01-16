// hooks/useProductFilters.ts
import { useState, useMemo } from 'react';
import { Product, Category } from '../app/dashboard/inventory-dashboard/product/types/product';



export const useProductFilters = (products: Product[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel1, setSelectedLevel1] = useState('all');
  const [selectedLevel2, setSelectedLevel2] = useState('all');
  const [selectedLevel3, setSelectedLevel3] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Extract unique categories
  const categoriesLevel1 = useMemo(() => 
    Array.from(new Set(products.map(p => JSON.stringify(p.categories.level1))))
      .map(str => JSON.parse(str) as Category),
    [products]
  );
  
  const categoriesLevel2 = useMemo(() => 
    Array.from(new Set(products.map(p => JSON.stringify(p.categories.level2))))
      .map(str => JSON.parse(str) as Category),
    [products]
  );
  
  const categoriesLevel3 = useMemo(() => 
    Array.from(new Set(products.map(p => JSON.stringify(p.categories.level3))))
      .map(str => JSON.parse(str) as Category),
    [products]
  );

  // Filter level 2 categories based on selected level 1
  const filteredLevel2 = useMemo(() => 
    selectedLevel1 === 'all' 
      ? categoriesLevel2 
      : categoriesLevel2.filter(cat => cat.parentId === selectedLevel1),
    [selectedLevel1, categoriesLevel2]
  );

  // Filter level 3 categories based on selected level 2
  const filteredLevel3 = useMemo(() => 
    selectedLevel2 === 'all'
      ? categoriesLevel3
      : categoriesLevel3.filter(cat => cat.parentId === selectedLevel2),
    [selectedLevel2, categoriesLevel3]
  );

  // Filter products
  const filteredProducts = useMemo(() => 
    products.filter((product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLevel1 = selectedLevel1 === 'all' || product.categories.level1.id === selectedLevel1;
      const matchesLevel2 = selectedLevel2 === 'all' || product.categories.level2.id === selectedLevel2;
      const matchesLevel3 = selectedLevel3 === 'all' || product.categories.level3.id === selectedLevel3;
      const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
      
      return matchesSearch && matchesLevel1 && matchesLevel2 && matchesLevel3 && matchesStatus;
    }),
    [products, searchTerm, selectedLevel1, selectedLevel2, selectedLevel3, selectedStatus]
  );

  const handleSearchChange = (value: string) => setSearchTerm(value);
  
  const handleLevel1Change = (value: string) => {
    setSelectedLevel1(value);
    setSelectedLevel2('all');
    setSelectedLevel3('all');
  };

  const handleLevel2Change = (value: string) => {
    setSelectedLevel2(value);
    setSelectedLevel3('all');
  };

  const handleLevel3Change = (value: string) => setSelectedLevel3(value);
  const handleStatusChange = (value: string) => setSelectedStatus(value);

  return {
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
    handleStatusChange
  };
};