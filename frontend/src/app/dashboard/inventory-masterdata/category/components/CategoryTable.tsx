"use client";
import React from "react";
import { Layers, FolderTree, ArrowRight } from "lucide-react";
import { ICategory } from "../../../../../../../common/ICategory.interface";
import { StatusBadge } from "../../../../common-form/StatusBadge";
import { TableActionButton } from "../../../../common-form/TableActionButtons";

interface CategoryTableProps {
  data: ICategory[];
  onEdit: (item: ICategory) => void;
  onDelete: (id: string) => void;
  themeColor: string;
}

const CategoryTable = ({
  data,
  onEdit,
  onDelete,
  themeColor,
}: CategoryTableProps) => {
  const getFullHierarchy = (cat: ICategory): string[] => {
    const names: string[] = [];

    const traverse = (current: ICategory | null | undefined) => {
      if (!current) return;
      if (typeof current.parentId === "object" && current.parentId !== null) {
        traverse(current.parentId as ICategory);
      }
      if (current.categoryName) {
        names.push(current.categoryName);
      }
    };

    if (typeof cat.parentId === "object" && cat.parentId !== null) {
      traverse(cat.parentId as ICategory);
    }

    return names;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-white" style={{ backgroundColor: themeColor }}>
            <tr>
              <th className="px-6 py-4 font-semibold">Category Details</th>
              <th className="px-6 py-4 font-semibold">Hierarchy Path</th>
              <th className="px-6 py-4 text-center font-semibold">Status</th>
              <th className="px-6 py-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((item) => {
                const parentPath = getFullHierarchy(item);

                return (
                  <tr
                    key={item._id}
                    className="transition-colors group"
                    style={{
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = `${themeColor}10`)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
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
                    <td className="px-6 py-4">
                      {parentPath.length > 0 ? (
                        <div className="flex items-center gap-1.5 flex-wrap text-[13px]">
                          <FolderTree size={14} style={{ color: themeColor }} />

                          {parentPath.map((name, index) => (
                            <React.Fragment key={index}>
                              <span
                                className="font-medium px-2 py-0.5 rounded-md border"
                                style={{
                                  color: themeColor,
                                  backgroundColor: `${themeColor}10`,
                                  borderColor: `${themeColor}30`,
                                }}
                              >
                                {name}
                              </span>
                              <ArrowRight size={12} className="text-gray-400" />
                            </React.Fragment>
                          ))}
                          <span
                            className="font-bold underline underline-offset-4"
                            style={{ textDecorationColor: `${themeColor}80` }}
                          >
                            {item.categoryName}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 text-gray-400 rounded-md border border-gray-100">
                          <span className="text-[10px] uppercase tracking-widest font-bold">
                            Root Category
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge isActive={!!item.isActive} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <TableActionButton
                        onEdit={() => onEdit(item)}
                        onDelete={() => item._id && onDelete(item._id)}
                      />
                    </td>
                  </tr>
                );
              })
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
  );
};

export default CategoryTable;
