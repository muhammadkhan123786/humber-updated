// components/product/CategoryFilters.tsx
import { Card, CardContent } from '@/components/form/Card';
import { Label } from '@/components/form/Label';
import { Search } from 'lucide-react';
import { Input } from '@/components/form/Input';
import { Category } from './Interface';

interface CategoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoriesLevel1: Category[];
  categoriesLevel2: Category[];
  categoriesLevel3: Category[];
  filteredLevel2: Category[];
  filteredLevel3: Category[];
  selectedLevel1: string;
  selectedLevel2: string;
  selectedLevel3: string;
  selectedStatus: string;
  onLevel1Change: (value: string) => void;
  onLevel2Change: (value: string) => void;
  onLevel3Change: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const CategoryFilters = ({
  searchTerm,
  onSearchChange,
  categoriesLevel1,
  filteredLevel2,
  filteredLevel3,
  selectedLevel1,
  selectedLevel2,
  selectedLevel3,
  selectedStatus,
  onLevel1Change,
  onLevel2Change,
  onLevel3Change,
  onStatusChange,
}: CategoryFiltersProps) => (
  <Card className="border-0 shadow-lg">
    <CardContent className="p-6 space-y-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search by part name, SKU, or manufacturer..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="level1" className="text-sm font-semibold text-gray-700 mb-2 block">
            Category
          </Label>
          <select
            id="level1"
            value={selectedLevel1}
            onChange={(e) => onLevel1Change(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Categories</option>
            {categoriesLevel1.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="level2" className="text-sm font-semibold text-gray-700 mb-2 block">
            Subcategory
          </Label>
          <select
            id="level2"
            value={selectedLevel2}
            onChange={(e) => onLevel2Change(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={selectedLevel1 === 'all'}
          >
            <option value="all">All Subcategories</option>
            {filteredLevel2.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="level3" className="text-sm font-semibold text-gray-700 mb-2 block">
            Sub-subcategory
          </Label>
          <select
            id="level3"
            value={selectedLevel3}
            onChange={(e) => onLevel3Change(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={selectedLevel2 === 'all'}
          >
            <option value="all">All Sub-subcategories</option>
            {filteredLevel3.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="status" className="text-sm font-semibold text-gray-700 mb-2 block">
            Status
          </Label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>
      </div>
    </CardContent>
  </Card>
);