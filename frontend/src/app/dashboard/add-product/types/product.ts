import { CategoryNode } from '../data/categoryTree';

export interface DynamicField {
  name: string;
  label: string;
  type: string;
  options?: string[];
}

export interface CategorySelection {
  level1: string;
  level2: string;
  level3: string;
}

export interface CategoryState {
  selectedLevel1: string;
  selectedLevel2: string;
  selectedLevel3: string;
  dynamicFields: Record<string, any>;
  categories: {
    level1: CategoryNode | null;
    level2: CategoryNode | null;
    level3: CategoryNode | null;
  };
}


export interface CategoryNode {
  _id: string;
  categoryName: string;
  parentId: string | null;
  children?: CategoryNode[];
  fields?: DynamicField[];
}
