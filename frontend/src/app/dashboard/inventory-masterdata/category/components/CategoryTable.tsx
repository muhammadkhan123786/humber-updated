"use client";
import React, { useState } from "react";
import { Layers, FolderTree, ArrowRight, Eye } from "lucide-react";
import { ICategory } from "../../../../../../../common/ICategory.interface";
import { StatusBadge } from "../../../../common-form/StatusBadge";
import { TableActionButton } from "../../../../common-form/TableActionButtons";

interface CategoryTableProps {
  data: ICategory[];
  onEdit: (item: ICategory) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

// Add _path property for internal usage
interface FlatCategory extends ICategory {
  _path: string[];
}

const CategoryTable = ({
  data,
  onEdit,
  onDelete,
  themeColor,
}: CategoryTableProps) => {
  const [popupData, setPopupData] = useState<string[] | null>(null);

  // Flatten nested categories and keep the full path
  const flattenCategories = (categories: ICategory[]): FlatCategory[] => {
    const result: FlatCategory[] = [];

    const traverse = (cats: ICategory[], parentPath: string[] = []) => {
      cats.forEach((cat) => {
        const currentPath = [...parentPath, cat.categoryName];
        result.push({ ...cat, _path: currentPath });
        if (cat.children && cat.children.length > 0) {
          traverse(cat.children, currentPath);
        }
      });
    };

    traverse(categories);
    return result;
  };

  const flatData = flattenCategories(data);

  // Show short hierarchy in table (first 2 levels + "..." if deeper)
  const getShortPath = (cat: FlatCategory) => {
    if (cat._path.length > 2) return cat._path.slice(0, 2).join(" > ") + " ...";
    return cat._path.join(" > ");
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead
              className="text-white"
              style={{ backgroundColor: themeColor }}
            >
              <tr>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Hierarchy</th>
                <th className="px-6 py-4 text-center font-semibold">Status</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {flatData.length > 0 ? (
                flatData.map((item) => (
                  <tr
                    key={item._id}
                    className="transition-colors group hover:bg-gray-50"
                  >
                    {/* Category Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor: `${themeColor}20`,
                            color: themeColor,
                          }}
                        >
                          <Layers size={18} />
                        </div>
                        <span className="font-bold text-gray-800">
                          {item.categoryName}
                        </span>
                      </div>
                    </td>

                    {/* Hierarchy Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <FolderTree size={14} style={{ color: themeColor }} />

                        {/* Hierarchy Path Display */}
                        <div className="flex items-center flex-wrap gap-1">
                          {item._path.length <= 2 ? (
                            // Show full path for 2 levels or less
                            item._path.map((name, index) => (
                              <React.Fragment key={index}>
                                <span className="text-[13px] font-medium">
                                  {name}
                                </span>
                                {index < item._path.length - 1 && (
                                  <ArrowRight
                                    size={12}
                                    style={{ color: themeColor }}
                                  />
                                )}
                              </React.Fragment>
                            ))
                          ) : (
                            // Show first 2 levels + "..." for deeper hierarchies
                            <>
                              <span className="text-[13px] font-medium">
                                {item._path[0]}
                              </span>
                              <ArrowRight
                                size={12}
                                style={{ color: themeColor }}
                              />
                              <span className="text-[13px] font-medium">
                                {item._path[1]}
                              </span>
                              <ArrowRight
                                size={12}
                                style={{ color: themeColor }}
                              />
                              <span className="text-[13px] font-medium text-gray-500">
                                ...
                              </span>

                              {/* View All Button */}
                              <button
                                onClick={() => setPopupData(item._path)}
                                className="ml-2 text-xs font-semibold px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                              >
                                View All
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <StatusBadge isActive={!!item.isActive} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <TableActionButton
                        onEdit={() => onEdit(item)}
                        onDelete={() => {
                          if (!item._id) return;
                          onDelete(item._id);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-20 text-center text-gray-400 italic"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FolderTree size={40} className="text-gray-200" />
                      <p>No categories found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Modal */}
      {popupData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-[400px] max-h-[80vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Eye size={18} /> Full Category Path
            </h3>
            <ul className="space-y-2">
              {popupData.map((name, index) => (
                <li
                  key={index}
                  className="px-3 py-2 border rounded-md bg-gray-50"
                >
                  {index + 1}. {name}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setPopupData(null)}
              className="mt-4 w-full py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryTable;
