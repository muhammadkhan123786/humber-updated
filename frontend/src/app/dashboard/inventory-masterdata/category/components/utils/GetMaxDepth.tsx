
 
 import { ICategory } from "../../../../../../../../common/ICategory.interface";
 
 type CategoryNode = ICategory & {
   children: CategoryNode[];
  };
 export const getMaxDepth = (categories: ICategory[]) => {
  if (!categories || categories.length === 0) return 0;

  const map: Record<string, CategoryNode> = {};
  categories.forEach(cat => {
    map[cat._id!] = { ...cat, children: [] };
  });

  categories.forEach(cat => {
    if (cat.parentId) {
      map[cat.parentId]?.children.push(map[cat._id!]);
    }
  });

  const dfs = (node: CategoryNode, depth: number): number => {
    if (!node.children.length) return depth;

    return Math.max(...node.children.map((child: CategoryNode) => dfs(child, depth + 1)));
  };

  const roots = Object.values(map).filter(cat => !cat.parentId);
  return Math.max(...roots.map(root => dfs(root, 1)));
  };